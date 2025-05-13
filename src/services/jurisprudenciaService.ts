
// Serviço para consulta de jurisprudência através de diferentes fontes

// API DataJud
export const searchDataJud = async (searchTerm: string) => {
  try {
    console.log("Iniciando busca no DataJud com termo:", searchTerm);
    
    const apiUrl = "https://api-publica.datajud.cnj.jus.br/api_publica_stj/_search";
    console.log("URL da API DataJud:", apiUrl);
    
    const requestBody = {
      query: {
        bool: {
          should: [
            { match: { "assuntos.nome": searchTerm } },
            { match: { "classe.nome": searchTerm } },
            { match: { "numeroProcesso": searchTerm } }
          ]
        }
      },
      size: 10
    };
    
    console.log("Corpo da requisição DataJud:", JSON.stringify(requestBody));
    
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Authorization": "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==",
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log("Status da resposta DataJud:", response.status);
    
    if (!response.ok) {
      throw new Error(`Erro na API DataJud: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Dados recebidos do DataJud:", data);
    
    const hits = data.hits?.hits || [];
    console.log("Hits encontrados no DataJud:", hits.length);
    
    return {
      success: true,
      data: hits.map((hit: any) => ({
        id: hit._id,
        tribunal: hit._source.tribunal || "Não informado",
        numeroProcesso: hit._source.numeroProcesso || "Não informado",
        dataAjuizamento: hit._source.dataAjuizamento ? new Date(hit._source.dataAjuizamento).toLocaleDateString('pt-BR') : "Não informado",
        classe: hit._source.classe || { nome: "Não informado" },
        assuntos: hit._source.assuntos || [],
        fonte: "DataJud"
      }))
    };
  } catch (error) {
    console.error("Erro ao buscar jurisprudência no DataJud:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido na API do DataJud"
    };
  }
};

// Web scraping do site do STJ usando um proxy CORS
export const searchSTJWebsite = async (searchTerm: string) => {
  try {
    console.log("Iniciando busca no site do STJ com termo:", searchTerm);
    
    // Usamos um proxy CORS para contornar as restrições de segurança
    const corsProxy = "https://corsproxy.io/?";
    const stJUrl = "https://www.stj.jus.br/portal/jurisprudencia/pesquisa/resultado";
    const encodedUrl = encodeURIComponent(`${stJUrl}?q=${encodeURIComponent(searchTerm)}&paginacao=50`);
    const proxyUrl = `${corsProxy}${encodedUrl}`;
    
    console.log("URL do proxy STJ:", proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: "GET",
      headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3"
      }
    });
    
    console.log("Status da resposta STJ Website:", response.status);
    
    if (!response.ok) {
      throw new Error(`Erro no site do STJ: ${response.status} - ${response.statusText}`);
    }

    const htmlText = await response.text();
    console.log("Tamanho do HTML recebido:", htmlText.length);
    
    // Importamos o Cheerio dinamicamente para processar o HTML
    const cheerio = await import('cheerio');
    const $ = cheerio.load(htmlText);
    
    // Extraimos os resultados da jurisprudência
    const resultados = $('.resultado-jurisprudencia');
    console.log("Resultados encontrados no site do STJ:", resultados.length);
    
    const processedResults = [];
    
    resultados.each((i, el) => {
      try {
        const titulo = $(el).find('h2').text().trim();
        const link = $(el).find('a').attr('href') || '';
        const descricao = $(el).find('.resultado-jurisprudencia-descricao').text().trim();
        const detalhes = $(el).find('.resultado-jurisprudencia-detalhes').text().trim();
        
        processedResults.push({
          id: `stj-${i}`,
          titulo: titulo,
          link: link.startsWith('http') ? link : `https://www.stj.jus.br${link}`,
          descricao: descricao,
          detalhes: detalhes,
          fonte: "STJ Website"
        });
      } catch (err) {
        console.error(`Erro ao processar resultado ${i}:`, err);
      }
    });
    
    return {
      success: true,
      data: processedResults
    };
  } catch (error) {
    console.error("Erro ao fazer web scraping do site do STJ:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido no web scraping do STJ"
    };
  }
};
