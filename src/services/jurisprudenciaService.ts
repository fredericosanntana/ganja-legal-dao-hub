import axios from 'axios';

// --- MODIFICAÇÃO 1: URL Base aponta para o Proxy --- 
// Use uma variável de ambiente para configurar a URL do seu proxy.
// Exemplo para Vite: VITE_PROXY_URL=http://localhost:3001/api/datajud
// Exemplo para Create React App: REACT_APP_PROXY_URL=http://localhost:3001/api/datajud
const PROXY_API_BASE_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001/api/datajud'; 
console.log(`JurisprudenciaService: Using Proxy URL: ${PROXY_API_BASE_URL}`);

// --- MODIFICAÇÃO 2: Remover completamente a lógica da API Key do Frontend --- 
/*
const FALLBACK_API_KEY_VALUE = '...';
let VITE_KEY_VALUE = import.meta.env.VITE_DATAJUD_API_KEY;
let IS_FALLBACK = false;
if (!VITE_KEY_VALUE) { ... }
const AUTH_HEADER_STRING = `APIKey ${VITE_KEY_VALUE}`;
console.log(`JurisprudenciaService: Using API Key ending with: ...`);
*/

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
  'TJPB': 'tjpb'
};

// Lista de tribunais para pesquisa em todos (mantido)
const DEFAULT_TRIBUNAIS = ['STJ', 'STF', 'TRF1', 'TRF4', 'TJDFT'];

// Tipos para parâmetros e respostas (mantidos)
export interface SearchDataJudParams { /* ... */ }
export interface JurisprudenciaResult { /* ... */ }
export interface SearchDataJudResponse { /* ... */ }
interface TribunalSearchResult { /* ... */ }

/**
 * Constrói o payload da consulta (mantido)
 */
const buildQueryPayload = (params: SearchDataJudParams) => {
  // ... (lógica original mantida)
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
  // ... (lógica original de filtros mantida)
  if (params.numeroProcesso) { /* ... */ }
  if (params.termo && params.termo.trim()) { /* ... */ }
  if (params.classeProcessual) { /* ... */ }
  if (params.orgaoJulgador) { /* ... */ }
  if (params.dataInicio || params.dataFim) { /* ... */ }
  if (query.query.bool.must.length === 0 && !params.termo?.trim()) { /* ... */ }
  console.log('Final query payload:', JSON.stringify(query, null, 2));
  return query;
};

/**
 * Mapeia os resultados da API (mantido)
 */
const mapApiResults = (results: any[], tribunal: string): JurisprudenciaResult[] => {
  // ... (lógica original mantida)
  console.log(`Mapping ${results.length} results from ${tribunal}`);
  return results.map((item, index) => {
    const source = item._source || {};
    // ... (lógica original de mapeamento mantida)
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
  options = { timeout: 25000, retries: 1, retryDelay: 2000 } // Timeout pode ser maior via proxy
): Promise<TribunalSearchResult> => {
  const alias = TRIBUNAL_ALIASES[tribunal];
  if (!alias) {
    console.error(`Tribunal não suportado: ${tribunal}`);
    return { /* ... erro tribunal não suportado ... */ };
  }

  // --- MODIFICAÇÃO 3: URL aponta para o endpoint do Proxy --- 
  const url = `${PROXY_API_BASE_URL}/search/${alias}`;
  const payload = buildQueryPayload(params);

  console.log(`Sending request TO PROXY for ${tribunal} (${alias}) at URL: ${url}`);

  let attempts = 0;

  while (attempts <= options.retries) {
    try {
      console.log(`Attempt ${attempts + 1} for ${tribunal} via proxy`);

      const response = await axios.post(url, payload, {
        // --- MODIFICAÇÃO 4: REMOVER o cabeçalho 'Authorization' daqui! --- 
        headers: {
          // 'Authorization': AUTH_HEADER_STRING, // REMOVIDO!
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: options.timeout,
        validateStatus: (status) => status < 500
      });

      console.log(`Response FROM PROXY for ${tribunal}:`, {
        status: response.status,
        // ... (resto do logging)
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
        // Tratamento de erro HTTP vindo do proxy/DataJud
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
 * Função principal para pesquisa no DataJud (mantida, usa searchInTribunal adaptado)
 */
export const searchDataJud = async (
  searchTerm: string,
  options: Partial<SearchDataJudParams> = {}
): Promise<SearchDataJudResponse> => {
  console.log('=== Starting DataJud Search (via Proxy) ===');
  // ... (lógica original mantida, pois depende de searchInTribunal que foi adaptado)
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
      console.log(`${tribunal} result (via Proxy):`, { /* ... logging ... */ });
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
    // ... (lógica original de sumarização e retorno mantida)
    if (hasSuccessfulSearch) {
      return { success: true, data: allResults, source: 'datajud_api', total: allResults.length };
    } 
    if (errors.length > 0) {
      const criticalErrors = errors.filter(e => e.code !== 'NOT_FOUND' && e.code !== 'EMPTY_RESULTS');
      if (criticalErrors.length > 0) {
        console.error('Critical errors found (via Proxy):', criticalErrors);
        return { success: false, data: [], source: 'datajud_api', error: { /* ... */ } };
      }
    }
    console.log('No results found (via Proxy), but no critical errors');
    return { success: true, data: [], source: 'datajud_api', total: 0 };

  } catch (error: any) {
    console.error('Unexpected error in searchDataJud (via Proxy):', error);
    return { success: false, data: [], source: 'datajud_api', error: { /* ... */ } };
  }
};

// --- MODIFICAÇÃO 5: Remover ou comentar checkDataJudApiStatus --- 
/*
export const checkDataJudApiStatus = async (): Promise<{ online: boolean, details?: any }> => {
  // Esta função faz chamadas diretas e causará CORS.
  // Foi removida do componente Jurisprudencia.tsx.
  // Se precisar verificar o status, crie um endpoint no proxy.
  console.warn('Direct call to checkDataJudApiStatus is disabled.');
  return Promise.resolve({ online: false, details: { message: 'Status check disabled.' } });
};
*/

// Função para buscar no site do STJ (verificar se precisa de proxy também)
// Se searchSTJWebsite também faz chamadas diretas do frontend para um site externo,
// ela provavelmente também precisará ser roteada através do proxy.
export const searchSTJWebsite = async (searchTerm: string): Promise<any> => {
  console.warn('searchSTJWebsite implementation needs review for potential CORS issues if called directly from frontend.');
  // Placeholder - Implementar ou adaptar conforme necessário, possivelmente usando o proxy.
  return { success: false, data: [], source: 'stj_website', error: { message: 'Not implemented or needs proxy', code: 'NOT_IMPLEMENTED' } };
};

// Exportar apenas as funções necessárias e adaptadas
export { searchDataJud, TRIBUNAL_ALIASES }; // Removido checkDataJudApiStatus e searchSTJWebsite (se não adaptado)

