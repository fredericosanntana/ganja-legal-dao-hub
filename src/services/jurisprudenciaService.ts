
import axios from 'axios';

// Configurações da API
const API_BASE_URL = 'https://api-publica.datajud.cnj.jus.br';
const API_KEY = import.meta.env.VITE_DATAJUD_API_KEY || 'APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==';

// Mapeamento de tribunais para aliases na API
const TRIBUNAL_ALIASES: Record<string, string> = {
  'STJ': 'api_publica_stj',
  'STF': 'api_publica_stf',
  'TST': 'api_publica_tst',
  'TSE': 'api_publica_tse',
  'TRF1': 'api_publica_trf1',
  'TRF2': 'api_publica_trf2',
  'TRF3': 'api_publica_trf3',
  'TRF4': 'api_publica_trf4',
  'TRF5': 'api_publica_trf5',
  'TRF6': 'api_publica_trf6',
  'TJDFT': 'api_publica_tjdft',
  // Adicionar outros tribunais conforme necessário
};

// Lista de tribunais para pesquisa em todos
const DEFAULT_TRIBUNAIS = ['STJ', 'STF', 'TST', 'TRF1', 'TJDFT'];

// Tipos para parâmetros e respostas
export interface SearchDataJudParams {
  termo?: string;
  numeroProcesso?: string;
  tribunal?: string;
  dataInicio?: string;
  dataFim?: string;
  classeProcessual?: string | number;
  orgaoJulgador?: string | number;
  pagina?: number;
  tamanhoPagina?: number;
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
  source: 'datajud_api' | 'fallback';
  total?: number;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

// Adicionando a interface para o retorno da função searchInTribunal
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
 * Constrói o payload da consulta com base nos parâmetros fornecidos
 */
const buildQueryPayload = (params: SearchDataJudParams) => {
  const query: any = {
    query: {}
  };

  // Configurar tamanho da página e offset
  query.size = params.tamanhoPagina || 10;
  if (params.pagina && params.pagina > 1) {
    query.from = (params.pagina - 1) * (params.tamanhoPagina || 10);
  }

  // Ordenação padrão por data de ajuizamento decrescente
  query.sort = [
    { "dataAjuizamento": { "order": "desc" } }
  ];

  // Pesquisa por número de processo (prioridade mais alta)
  if (params.numeroProcesso) {
    query.query = {
      match: {
        numeroProcesso: params.numeroProcesso.replace(/[^0-9]/g, '') // Remove caracteres não numéricos
      }
    };
    return query;
  }

  // Pesquisa por termo com filtros adicionais
  const mustClauses = [];
  const filterClauses = [];

  // Adicionar pesquisa por termo
  if (params.termo) {
    mustClauses.push({
      multi_match: {
        query: params.termo,
        fields: ["ementa", "assunto.descricao", "observacao"]
      }
    });
  }

  // Adicionar filtro por classe processual
  if (params.classeProcessual) {
    filterClauses.push({
      match: {
        "classe.codigo": params.classeProcessual
      }
    });
  }

  // Adicionar filtro por órgão julgador
  if (params.orgaoJulgador) {
    filterClauses.push({
      match: {
        "orgaoJulgador.codigo": params.orgaoJulgador
      }
    });
  }

  // Adicionar filtro por data
  if (params.dataInicio || params.dataFim) {
    const rangeFilter: any = {
      range: {
        dataAjuizamento: {}
      }
    };

    if (params.dataInicio) {
      rangeFilter.range.dataAjuizamento.gte = params.dataInicio;
    }

    if (params.dataFim) {
      rangeFilter.range.dataAjuizamento.lte = params.dataFim;
    }

    filterClauses.push(rangeFilter);
  }

  // Montar a query final
  if (mustClauses.length > 0 || filterClauses.length > 0) {
    query.query = {
      bool: {}
    };

    if (mustClauses.length > 0) {
      query.query.bool.must = mustClauses;
    }

    if (filterClauses.length > 0) {
      query.query.bool.filter = filterClauses;
    }
  } else {
    // Se não houver critérios específicos, buscar todos os documentos
    query.query = {
      match_all: {}
    };
  }

  return query;
};

/**
 * Mapeia os resultados da API para o formato esperado pelo componente
 */
const mapApiResults = (results: any[], tribunal: string): JurisprudenciaResult[] => {
  return results.map(item => {
    const source = item._source || {};
    
    return {
      id: item._id || `${tribunal}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      tribunal: source.tribunal?.sigla || tribunal,
      numeroProcesso: source.numeroProcesso,
      ementa: source.ementa || 'Ementa não disponível',
      dataAjuizamento: source.dataAjuizamento,
      classe: source.classe?.descricao,
      orgaoJulgador: source.orgaoJulgador?.descricao
    };
  });
};

/**
 * Realiza uma consulta em um tribunal específico
 */
const searchInTribunal = async (
  tribunal: string, 
  params: SearchDataJudParams, 
  options = { timeout: 10000, retries: 2, retryDelay: 1000 }
): Promise<TribunalSearchResult> => {
  const alias = TRIBUNAL_ALIASES[tribunal];
  if (!alias) {
    return {
      success: false,
      data: [],
      error: {
        message: `Tribunal não suportado: ${tribunal}`,
        code: 'UNSUPPORTED_TRIBUNAL'
      }
    };
  }

  const url = `${API_BASE_URL}/${alias}/_search`;
  const payload = buildQueryPayload(params);
  
  let attempts = 0;
  
  while (attempts <= options.retries) {
    try {
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `APIKey ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: options.timeout
      });
      
      if (response.status === 200 && response.data) {
        const hits = response.data.hits?.hits || [];
        return {
          success: true,
          data: mapApiResults(hits, tribunal),
          total: response.data.hits?.total?.value || hits.length
        };
      } else {
        return {
          success: false,
          data: [],
          error: {
            message: 'Resposta inválida da API',
            code: 'INVALID_RESPONSE',
            details: response.data
          }
        };
      }
    } catch (error: any) {
      if (attempts === options.retries) {
        // Último retry, retornar o erro
        return {
          success: false,
          data: [],
          error: {
            message: error.response?.data?.error || error.message || 'Erro desconhecido',
            code: error.code || (error.response ? `HTTP_${error.response.status}` : 'NETWORK_ERROR'),
            details: error.response?.data
          }
        };
      }
      
      // Aguardar antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, options.retryDelay));
      attempts++;
    }
  }
  
  // Este ponto não deveria ser alcançado, mas para satisfazer o TypeScript
  return {
    success: false,
    data: [],
    error: {
      message: 'Erro inesperado',
      code: 'UNEXPECTED_ERROR'
    }
  };
};

/**
 * Função principal para pesquisa no DataJud
 * Permite pesquisar em um tribunal específico ou em vários tribunais
 */
export const searchDataJud = async (
  searchTerm: string,
  options: Partial<SearchDataJudParams> = {}
): Promise<SearchDataJudResponse> => {
  try {
    // Preparar parâmetros de pesquisa
    const params: SearchDataJudParams = {
      termo: searchTerm,
      ...options
    };
    
    // Determinar em quais tribunais pesquisar
    const tribunaisParaPesquisar = params.tribunal 
      ? [params.tribunal] 
      : DEFAULT_TRIBUNAIS;
    
    // Resultados combinados de todos os tribunais
    let allResults: JurisprudenciaResult[] = [];
    let hasSuccessfulSearch = false;
    let errors: any[] = [];
    
    // Pesquisar em cada tribunal
    for (const tribunal of tribunaisParaPesquisar) {
      const result = await searchInTribunal(tribunal, params);
      
      if (result.success && result.data.length > 0) {
        allResults = [...allResults, ...result.data];
        hasSuccessfulSearch = true;
      } else if (!result.success) {
        errors.push({
          tribunal,
          ...result.error
        });
      }
    }
    
    // Se encontrou resultados em pelo menos um tribunal
    if (hasSuccessfulSearch) {
      return {
        success: true,
        data: allResults,
        source: 'datajud_api',
        total: allResults.length
      };
    }
    
    // Se não encontrou resultados em nenhum tribunal
    if (errors.length > 0) {
      // Priorizar erros de rede/servidor sobre "não encontrado"
      const criticalErrors = errors.filter(e => 
        e.code !== 'NOT_FOUND' && e.code !== 'EMPTY_RESULTS'
      );
      
      if (criticalErrors.length > 0) {
        return {
          success: false,
          data: [],
          source: 'datajud_api',
          error: {
            message: `Erro ao consultar DataJud: ${criticalErrors[0].message}`,
            code: criticalErrors[0].code,
            details: criticalErrors
          }
        };
      }
    }
    
    // Nenhum resultado encontrado (sem erros críticos)
    return {
      success: true,
      data: [],
      source: 'datajud_api',
      total: 0
    };
    
  } catch (error: any) {
    // Erro inesperado na função principal
    return {
      success: false,
      data: [],
      source: 'datajud_api',
      error: {
        message: error.message || 'Erro inesperado ao consultar DataJud',
        code: 'UNEXPECTED_ERROR',
        details: error
      }
    };
  }
};

/**
 * Verifica o status da API do DataJud
 */
export const checkDataJudApiStatus = async (): Promise<{ online: boolean, details?: any }> => {
  try {
    // Testar com um tribunal que provavelmente estará disponível
    const testTribunal = 'STJ';
    const alias = TRIBUNAL_ALIASES[testTribunal];
    
    const response = await axios.get(`${API_BASE_URL}/${alias}`, {
      headers: {
        'Authorization': `APIKey ${API_KEY}`
      },
      timeout: 5000
    });
    
    return {
      online: response.status === 200,
      details: {
        status: response.status,
        message: 'API DataJud disponível'
      }
    };
  } catch (error: any) {
    return {
      online: false,
      details: {
        message: error.message,
        status: error.response?.status,
        code: error.code
      }
    };
  }
};

/**
 * Função para pesquisa no site do STJ (mantida para compatibilidade)
 */
export const searchSTJWebsite = async (searchTerm: string) => {
  try {
    // Implementação simplificada para exemplo
    // Em um cenário real, isso seria uma chamada para um serviço de web scraping
    console.log(`Pesquisando "${searchTerm}" no site do STJ`);
    
    // Simular uma resposta de sucesso com dados fictícios
    return {
      success: true,
      data: [
        {
          id: `stj-web-${Date.now()}`,
          ementa: `Resultado da pesquisa por "${searchTerm}" no site do STJ. Esta é uma implementação de exemplo.`
        }
      ]
    };
  } catch (error: any) {
    return {
      success: false,
      data: [],
      error: error.message
    };
  }
};
