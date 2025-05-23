import axios from 'axios';

// --- URL Base aponta para o Proxy --- 
// Use uma variável de ambiente para configurar a URL do seu proxy.
// Exemplo para Vite: VITE_PROXY_URL=http://localhost:3001/api/datajud
const PROXY_API_BASE_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001/api/datajud'; 
console.log(`JurisprudenciaService: Using Proxy URL: ${PROXY_API_BASE_URL}`);

// Mapeamento de tribunais para aliases na API (mantido)
const TRIBUNAL_ALIASES: Record<string, string> = {
  'STJ': 'stj',
  'STF': 'stf',
  'TST': 'tst',
  'TSE': 'tse',
  'TRF1': 'trf1',
  'TRF2': 'trf2',
  'TRF3': 'trf3',
  'TRF4': 'trf4',
  'TRF5': 'trf5',
  'TRF6': 'trf6',
  'TJDFT': 'tjdft',
  'TJSP': 'tjsp',
  'TJRJ': 'tjrj',
  'TJMG': 'tjmg',
  'TJRS': 'tjrs',
  'TJPR': 'tjpr',
  'TJSC': 'tjsc',
  'TJBA': 'tjba',
  'TJGO': 'tjgo',
  'TJPB': 'tjpb',
};

// Lista de tribunais para pesquisa em todos (mantido)
const DEFAULT_TRIBUNAIS = ['STJ', 'STF', 'TRF1', 'TRF4', 'TJDFT'];

// Tipos para parâmetros e respostas
export interface SearchDataJudParams {
  termo?: string;
  tribunal?: string;
  numeroProcesso?: string;
  classeProcessual?: string;
  orgaoJulgador?: string;
  dataInicio?: string;
  dataFim?: string;
  tamanhoPagina?: number;
  pagina?: number;
}

export interface JurisprudenciaResult {
  id: string;
  tribunal?: string;
  numeroProcesso?: string;
  ementa: string;
  dataAjuizamento?: string;
  classe?: string;
  orgaoJulgador?: string;
}

export interface SearchDataJudResponse {
  success: boolean;
  data: JurisprudenciaResult[];
  source: string;
  total?: number;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
}

interface TribunalSearchResult {
  success: boolean;
  data: JurisprudenciaResult[];
  total?: number;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

/**
 * Constrói o payload da consulta
 */
const buildQueryPayload = (params: SearchDataJudParams) => {
  console.log('Building query payload with params:', params);
  const query: any = {
    size: params.tamanhoPagina || 20,
    from: params.pagina ? (params.pagina - 1) * (params.tamanhoPagina || 20) : 0,
    sort: [
      { "dataAjuizamento": { "order": "desc", "missing": "_last" } }
    ],
    query: {
      bool: {
        must: [],
        filter: []
      }
    }
  };

  if (params.numeroProcesso) {
    query.query.bool.must.push({
      match_phrase: { "numeroProcesso": params.numeroProcesso }
    });
  }

  if (params.termo && params.termo.trim()) {
    query.query.bool.must.push({
      multi_match: {
        query: params.termo,
        fields: ["ementa^3", "ementaTexto^3", "textoDecisao", "textoEmenta"],
        type: "most_fields",
        operator: "and"
      }
    });
    // Adicionar também com fuzzy para termos similares
    query.query.bool.should = [
      {
        multi_match: {
          query: params.termo,
          fields: ["ementa^2", "ementaTexto^2"],
          fuzziness: "AUTO",
          operator: "or"
        }
      },
      {
        match_phrase_prefix: {
          ementa: {
            query: params.termo,
            max_expansions: 10
          }
        }
      }
    ];
  }

  if (params.classeProcessual) {
    query.query.bool.filter.push({
      nested: {
        path: "classe",
        query: {
          bool: {
            should: [
              { match: { "classe.nome": params.classeProcessual } },
              { match: { "classe.descricao": params.classeProcessual } }
            ]
          }
        }
      }
    });
  }

  if (params.orgaoJulgador) {
    query.query.bool.filter.push({
      nested: {
        path: "orgaoJulgador",
        query: {
          bool: {
            should: [
              { match: { "orgaoJulgador.nome": params.orgaoJulgador } },
              { match: { "orgaoJulgador.descricao": params.orgaoJulgador } }
            ]
          }
        }
      }
    });
  }

  if (params.dataInicio || params.dataFim) {
    const rangeQuery: any = { range: { dataAjuizamento: {} } };
    if (params.dataInicio) rangeQuery.range.dataAjuizamento.gte = params.dataInicio;
    if (params.dataFim) rangeQuery.range.dataAjuizamento.lte = params.dataFim;
    query.query.bool.filter.push(rangeQuery);
  }

  // Se não houver nenhuma condição de busca, adicionar match_all para buscar tudo
  if (query.query.bool.must.length === 0 && !params.termo?.trim()) {
    query.query.bool.must.push({ match_all: {} });
  }

  console.log('Final query payload:', JSON.stringify(query, null, 2));
  return query;
};

/**
 * Mapeia os resultados da API
 */
const mapApiResults = (results: any[], tribunal: string): JurisprudenciaResult[] => {
  console.log(`Mapping ${results.length} results from ${tribunal}`);
  return results.map((item, index) => {
    const source = item._source || {};
    
    return {
      id: item._id || `${tribunal}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      tribunal: source.tribunal?.sigla || tribunal.toUpperCase(),
      numeroProcesso: source.numeroProcesso || 'Não informado',
      ementa: source.ementa || source.ementaTexto || 'Ementa não disponível',
      dataAjuizamento: source.dataAjuizamento,
      classe: source.classe?.descricao || source.classe?.nome,
      orgaoJulgador: source.orgaoJulgador?.descricao || source.orgaoJulgador?.nome
    };
  });
};

/**
 * Realiza uma consulta em um tribunal específico - MODIFICADO PARA USAR O PROXY
 */
const searchInTribunal = async (
  tribunal: string,
  params: SearchDataJudParams,
  options = { timeout: 25000, retries: 1, retryDelay: 2000 }
): Promise<TribunalSearchResult> => {
  const alias = TRIBUNAL_ALIASES[tribunal];
  if (!alias) {
    console.error(`Tribunal não suportado: ${tribunal}`);
    return {
      success: false,
      data: [],
      error: {
        message: `Tribunal não suportado: ${tribunal}`,
        code: 'UNSUPPORTED_TRIBUNAL'
      }
    };
  }

  const url = `${PROXY_API_BASE_URL}/search/${alias}`;
  const payload = buildQueryPayload(params);

  console.log(`Sending request TO PROXY for ${tribunal} (${alias}) at URL: ${url}`);

  let attempts = 0;

  while (attempts <= options.retries) {
    try {
      console.log(`Attempt ${attempts + 1} for ${tribunal} via proxy`);

      const response = await axios.post(url, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: options.timeout,
        validateStatus: (status) => status < 500
      });

      console.log(`Response FROM PROXY for ${tribunal}:`, {
        status: response.status,
        statusText: response.statusText,
        hasData: !!response.data,
        hasHits: !!(response.data && response.data.hits),
        hitsCount: response.data?.hits?.hits?.length || 0
      });

      if (response.status === 200 && response.data) {
        const hits = response.data.hits?.hits || [];
        const total = response.data.hits?.total?.value || response.data.hits?.total || hits.length;
        console.log(`Successfully got ${hits.length} results from ${tribunal} via proxy, total: ${total}`);
        return {
          success: true,
          data: mapApiResults(hits, tribunal),
          total: total
        };
      } else {
        console.error(`HTTP error ${response.status} from proxy for ${tribunal}:`, response.data);
        return {
          success: false,
          data: [],
          error: {
            message: `Erro HTTP ${response.status} via proxy: ${response.data?.error?.reason || response.data?.error || 'Erro desconhecido do servidor'}`,
            code: `PROXY_HTTP_${response.status}`,
            details: response.data
          }
        };
      }
    } catch (error: any) {
      console.error(`Error on attempt ${attempts + 1} for ${tribunal} via proxy:`, {
        message: error.message,
        code: error.code,
        isAxiosError: axios.isAxiosError(error),
        responseStatus: error.response?.status,
        responseData: error.response?.data
      });

      if (attempts === options.retries) {
        let errorMessage = error.message;
        let errorCode = error.code || 'PROXY_REQUEST_FAILED';
        let details = error.response?.data;

        if (axios.isAxiosError(error) && error.response) {
          errorMessage = `Erro ao contatar o proxy (${error.response.status}): ${error.response.data?.error || errorMessage}`;
          errorCode = `PROXY_HTTP_${error.response.status}`;
        } else if (error.code === 'ECONNABORTED') {
          errorMessage = `Timeout ao conectar com o proxy (${options.timeout}ms)`;
          errorCode = 'PROXY_TIMEOUT';
        } else {
           errorMessage = `Falha na comunicação com o servidor proxy: ${errorMessage}`;
        }

        return {
          success: false,
          data: [],
          error: {
            message: errorMessage,
            code: errorCode,
            details: details
          }
        };
      }

      console.log(`Waiting ${options.retryDelay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, options.retryDelay));
      attempts++;
    }
  }

  // Se chegou aqui, todos os retries falharam
  return {
    success: false,
    data: [],
    error: {
      message: 'Falha ao buscar dados via proxy após múltiplas tentativas.',
      code: 'PROXY_RETRIES_EXHAUSTED'
    }
  };
};

/**
 * Função principal para pesquisa no DataJud
 */
export const searchDataJud = async (
  searchTerm: string,
  options: Partial<SearchDataJudParams> = {}
): Promise<SearchDataJudResponse> => {
  console.log('=== Starting DataJud Search (via Proxy) ===');
  console.log('Search term:', searchTerm);
  console.log('Options:', options);
  try {
    const params: SearchDataJudParams = { termo: searchTerm, ...options };
    console.log('Final search params:', params);
    const tribunaisParaPesquisar = params.tribunal ? [params.tribunal] : DEFAULT_TRIBUNAIS;
    console.log('Tribunais to search:', tribunaisParaPesquisar);
    let allResults: JurisprudenciaResult[] = [];
    let hasSuccessfulSearch = false;
    let errors: any[] = [];

    for (const tribunal of tribunaisParaPesquisar) {
      console.log(`\n--- Searching in ${tribunal} (via Proxy) ---`);
      const result = await searchInTribunal(tribunal, params);
      console.log(`${tribunal} result (via Proxy):`, { 
        success: result.success, 
        resultsCount: result.data.length,
        error: result.error 
      });
      
      if (result.success && result.data.length > 0) {
        allResults = [...allResults, ...result.data];
        hasSuccessfulSearch = true;
        console.log(`Added ${result.data.length} results from ${tribunal}`);
      } else if (!result.success) {
        errors.push({ tribunal, ...result.error });
        console.error(`Error from ${tribunal} (via Proxy):`, result.error);
      } else {
        console.log(`No results from ${tribunal} (via Proxy)`);
      }
    }

    console.log(`\n=== Search Summary (via Proxy) ===`);
    console.log(`Total results: ${allResults.length}`);
    console.log(`Successful search: ${hasSuccessfulSearch}`);
    console.log(`Error count: ${errors.length}`);
    
    if (hasSuccessfulSearch) {
      return { success: true, data: allResults, source: 'datajud_api', total: allResults.length };
    } 
    if (errors.length > 0) {
      const criticalErrors = errors.filter(e => e.code !== 'NOT_FOUND' && e.code !== 'EMPTY_RESULTS');
      if (criticalErrors.length > 0) {
        console.error('Critical errors found (via Proxy):', criticalErrors);
        return { 
          success: false, 
          data: [], 
          source: 'datajud_api', 
          error: { 
            message: `Erro na busca: ${criticalErrors[0].message}`, 
            code: criticalErrors[0].code,
            details: criticalErrors
          } 
        };
      }
    }
    console.log('No results found (via Proxy), but no critical errors');
    return { success: true, data: [], source: 'datajud_api', total: 0 };

  } catch (error: any) {
    console.error('Unexpected error in searchDataJud (via Proxy):', error);
    return { 
      success: false, 
      data: [], 
      source: 'datajud_api', 
      error: { 
        message: `Erro inesperado: ${error.message || 'Desconhecido'}`, 
        code: error.code || 'UNKNOWN_ERROR',
        details: error
      } 
    };
  }
};

export const searchSTJWebsite = async (searchTerm: string): Promise<any> => {
  console.warn('searchSTJWebsite implementation needs review for potential CORS issues if called directly from frontend.');
  // Placeholder - Implementar ou adaptar conforme necessário, possivelmente usando o proxy.
  return { success: false, data: [], source: 'stj_website', error: { message: 'Not implemented or needs proxy', code: 'NOT_IMPLEMENTED' } };
};

// Removendo a exportação duplicada e exportando apenas o que é necessário
export { TRIBUNAL_ALIASES };
