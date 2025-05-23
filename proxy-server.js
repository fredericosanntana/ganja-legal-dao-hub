
import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Carrega variáveis do arquivo .env

const app = express();
const port = process.env.PORT || 3001; // Porta para o servidor proxy

// Configuração do CORS mais permissiva para desenvolvimento
const corsOptions = {
  origin: '*', // Permite requisições de qualquer origem durante desenvolvimento
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware para parsear JSON no corpo das requisições
app.use(express.json());

// Endpoint do proxy para a busca no DataJud
app.post('/api/datajud/search/:tribunalAlias', async (req, res) => {
  const { tribunalAlias } = req.params;
  const searchPayload = req.body;
  const datajudApiKey = process.env.DATAJUD_API_KEY;

  if (!datajudApiKey) {
    console.error('Erro: Chave da API DataJud (DATAJUD_API_KEY) não definida no .env');
    return res.status(500).json({ error: 'Configuração interna do servidor incompleta.' });
  }

  if (!tribunalAlias) {
    return res.status(400).json({ error: 'Alias do tribunal não fornecido na URL.' });
  }

  const datajudApiUrl = `https://api-publica.datajud.cnj.jus.br/api_publica_${tribunalAlias}/_search`;

  console.log(`Proxying request for ${tribunalAlias} to: ${datajudApiUrl}`);
  console.log('Payload:', JSON.stringify(searchPayload, null, 2)); // Adiciona log detalhado do payload

  try {
    const response = await axios.post(datajudApiUrl, searchPayload, {
      headers: {
        'Authorization': `APIKey ${datajudApiKey}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 30000 // Aumenta o timeout para 30 segundos
    });

    console.log(`Success response from DataJud (${tribunalAlias}): Status ${response.status}`);
    console.log(`Response data:`, JSON.stringify(response.data).substring(0, 500) + '...');
    res.status(response.status).json(response.data);

  } catch (error) {
    console.error(`Error fetching from DataJud (${tribunalAlias}):`, error.message);
    if (axios.isAxiosError(error)) { // Verifica se é um erro do Axios
      if (error.response) {
        console.error('DataJud Error Status:', error.response.status);
        console.error('DataJud Error Data:', error.response.data);
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        console.error('DataJud No Response');
        res.status(504).json({ error: 'Gateway Timeout: Sem resposta da API DataJud.' });
      } else {
        console.error('Axios Setup Error:', error.message);
        res.status(500).json({ error: 'Erro interno ao configurar a requisição para DataJud.' });
      }
    } else {
      // Erro não relacionado ao Axios
      console.error('Non-Axios Error:', error);
      res.status(500).json({ error: 'Erro interno inesperado no servidor proxy.' });
    }
  }
});

// Endpoint de health check simples para o proxy
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'Proxy server is running',
    apiKey: datajudApiKey ? 'API key is set' : 'API key is missing',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, () => {
  console.log(`Servidor proxy (ESM) rodando em http://localhost:${port}`);
  console.log(`Permitindo requisições CORS de: ${corsOptions.origin}`);
  if (!process.env.DATAJUD_API_KEY) {
    console.warn('AVISO: Variável de ambiente DATAJUD_API_KEY não está definida!');
  } else {
    console.log('DATAJUD_API_KEY está configurada');
  }
});
