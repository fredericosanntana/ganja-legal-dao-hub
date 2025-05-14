# Documento de Requisitos do Produto (PRD) - GanjaDAO

## 1. Introdução

Este Documento de Requisitos do Produto (PRD) descreve as funcionalidades, objetivos, e requisitos técnicos para a plataforma GanjaDAO. A GanjaDAO é uma iniciativa LegalTech ativista que visa proteger e empoderar cultivadores de Cannabis no Brasil através de educação jurídica, ferramentas de automação legal, e mobilização comunitária. A plataforma é composta por dois núcleos principais: o `ganjadao.app`, que oferece serviços informativos, ferramentas jurídicas e calculadoras, e o `ganjadao-clube`, um clube de assinaturas para apoiar a causa e permitir a participação dos membros em votações sobre as iniciativas da DAO.

Este PRD serve como uma fonte central de verdade para as equipes de desenvolvimento, design e produto, garantindo um entendimento comum dos objetivos e do escopo do projeto.

## 2. Objetivos do Produto

Os principais objetivos da plataforma GanjaDAO são:

*   **Empoderar Cultivadores:** Fornecer conhecimento jurídico acessível e ferramentas práticas para que cultivadores possam entender e defender seus direitos.
*   **Facilitar a Autoproteção Legal:** Oferecer mecanismos automatizados, como a geração de Habeas Corpus preventivo, para aumentar a segurança jurídica dos usuários.
*   **Promover o Engajamento Comunitário:** Criar um espaço para que a comunidade de cultivadores se conecte, compartilhe informações e participe ativamente das decisões da GanjaDAO através de um sistema de votação.
*   **Apoiar a Causa:** Estabelecer um modelo de financiamento sustentável (clube de assinaturas) para garantir a continuidade e expansão das iniciativas da GanjaDAO.
*   **Descentralizar o Acesso ao Direito:** Tornar o conhecimento e as ferramentas legais mais acessíveis, reduzindo a dependência de advogados ou ONGs para questões básicas de proteção.
*   **Educar e Informar:** Disponibilizar conteúdo relevante sobre o cultivo de Cannabis, aspectos legais, e novidades da área (ex: consultas públicas da ANVISA).
*   **Fornecer Ferramentas Úteis:** Oferecer calculadoras e outras ferramentas que auxiliem os cultivadores em suas práticas.

## 3. Escopo do Produto

A plataforma GanjaDAO abrange as seguintes áreas principais:

*   **Aplicação Principal (`ganjadao.app`):
    *   **Módulo Jurídico:** Ferramentas para geração de documentos legais (HC), consulta de jurisprudência, templates de documentos.
    *   **Módulo ANVISA:** Ferramenta para auxiliar na criação e envio de manifestações para consultas públicas da ANVISA.
    *   **Módulo Calculadoras:** Conjunto de calculadoras úteis para o cultivo (VPD, DLI, Nutrientes, Ponto de Orvalho, EC Flush).
    *   **Módulo Conteúdo:** Repositório de artigos, manuais e notícias relevantes para a comunidade.
    *   **Página Inicial e Navegação Geral.**
*   **Clube de Assinaturas (`ganjadao-clube`):
    *   **Autenticação de Usuários:** Registro, login, logout.
    *   **Gerenciamento de Perfil:** Visualização de dados do usuário.
    *   **Gerenciamento de Assinaturas:** Adesão (simulada/básica), status da assinatura.
    *   **Sistema de Votação:** Participação em votações sobre iniciativas da DAO (com lógica de votação quadrática a ser plenamente implementada).
    *   **Painel Administrativo:** Gerenciamento de usuários, assinaturas, iniciativas e votos.

## 4. Requisitos Funcionais

Esta seção detalha as funcionalidades específicas que a plataforma GanjaDAO deve oferecer.

### 4.1. Requisitos Funcionais Comuns (Aplicáveis a ambos os núcleos onde relevante)

*   **RF001: Navegação Responsiva:** O sistema deve ser acessível e funcional em dispositivos desktop e móveis.
*   **RF002: Feedback ao Usuário:** O sistema deve fornecer feedback claro sobre o resultado das ações do usuário (ex: mensagens de sucesso, erro, carregamento).

### 4.2. Requisitos Funcionais - Aplicação Principal (`ganjadao.app`)

#### 4.2.1. Módulo Jurídico
*   **RFJ001: Página Inicial do Módulo Jurídico:** Deve apresentar as opções e ferramentas disponíveis no módulo jurídico.
*   **RFJ002: Geração de Habeas Corpus Preventivo:**
    *   O sistema deve permitir que o usuário preencha um formulário com dados pessoais e informações relevantes para a geração de um HC preventivo.
    *   O sistema deve gerar um documento HC em formato PDF com base nos dados fornecidos.
    *   O sistema deve permitir o download do HC gerado.
    *   (Opcional) O sistema pode oferecer a opção de salvar o HC gerado na conta do usuário.
*   **RFJ003: Consulta de Jurisprudência:**
    *   O sistema deve permitir a busca e visualização de decisões judiciais relevantes sobre o tema do autocultivo.
    *   (Opcional) O sistema pode permitir filtros de busca (tribunal, data, palavras-chave).
*   **RFJ004: Templates de Documentos Jurídicos:** O sistema deve disponibilizar templates de outros documentos úteis para cultivadores (ex: notificação extrajudicial, declaração de posse para consumo pessoal).
*   **RFJ005: Geração de QR Code para Documentos:** O sistema deve ser capaz de gerar um QR Code que direcione para um documento legal específico armazenado na plataforma (a ser detalhado o fluxo de armazenamento e acesso).

#### 4.2.2. Módulo ANVISA
*   **RFAN001: Página de Manifestação ANVISA:** Deve apresentar um formulário para que o usuário construa sua manifestação sobre propostas normativas da ANVISA relacionadas à Cannabis.
*   **RFAN002: Geração de Prévia da Manifestação:** O sistema deve gerar uma prévia em texto da manifestação com base nos dados preenchidos pelo usuário.
*   **RFAN003: Geração e Download de PDF da Manifestação:** O sistema deve gerar um documento PDF formatado com a manifestação do usuário e permitir seu download.
*   **RFAN004: Envio da Manifestação por E-mail:** O sistema deve permitir o envio da manifestação gerada por e-mail para o endereço da ANVISA e, opcionalmente, uma cópia para o e-mail do usuário.
*   **RFAN005: Salvamento da Manifestação:** O sistema deve permitir que o usuário salve a manifestação gerada em um banco de dados associado à plataforma.
*   **RFAN006: Listagem de Manifestações Salvas:** O sistema deve permitir a visualização das manifestações salvas anteriormente pelo usuário ou pela comunidade (a depender da política de privacidade).

#### 4.2.3. Módulo Calculadoras
*   **RFCAL001: Página Principal de Calculadoras:** Deve listar todas as calculadoras disponíveis.
*   **RFCAL002: Calculadora de VPD (Pressão de Déficit de Vapor):** Deve permitir ao usuário calcular o VPD com base na temperatura e umidade relativa.
*   **RFCAL003: Calculadora de DLI (Integral de Luz Diária):** Deve permitir ao usuário calcular o DLI com base na intensidade da luz e fotoperíodo.
*   **RFCAL004: Calculadora de Nutrientes:** Deve auxiliar no cálculo de dosagens de nutrientes para soluções hidropônicas ou fertirrigação (detalhar os inputs e outputs específicos).
*   **RFCAL005: Calculadora de Ponto de Orvalho (Dew Point):** Deve permitir ao usuário calcular o ponto de orvalho com base na temperatura e umidade.
*   **RFCAL006: Calculadora de EC Flush:** Deve auxiliar no cálculo do volume de água necessário para o flush do substrato com base no EC (condutividade elétrica) desejado.

#### 4.2.4. Módulo Conteúdo
*   **RFCON001: Exibição de Conteúdo Educacional:** O sistema deve exibir artigos, manuais e notícias de forma organizada e legível.
*   **RFCON002: Categorização/Navegação de Conteúdo:** (Opcional) O conteúdo pode ser categorizado para facilitar a navegação (ex: Jurídico, Cultivo, Notícias DAO).
*   **RFCON003: Conteúdos Específicos Identificados:**
    *   Checklist Jurídico GanjaDAO
    *   Bastidores da GanjaDAO
    *   Caso Real: Mariana e GanjaDAO
    *   Convocação DAO para Votação
    *   Mitos e Verdades sobre HC Digital
    *   Cultivo Legal: Descentralizando o Direito
    *   Oferta DAO Ativa (HC Digital com Desconto)
    *   Manual do Cultivador Autônomo
    *   Mapa da Proteção (HCs e Autocultivo)
    *   Chamada para Embaixadores GanjaDAO
    *   Página sobre Manifestação ANVISA (link para o módulo)

### 4.3. Requisitos Funcionais - Clube de Assinaturas (`ganjadao-clube`)

#### 4.3.1. Autenticação e Gerenciamento de Usuários
*   **RFCU001: Registro de Usuário:** Permitir que novos usuários se registrem fornecendo nome de usuário, e-mail e senha. O sistema deve validar os dados (campos obrigatórios, formato de e-mail, complexidade de senha, senhas coincidentes).
*   **RFCU002: Login de Usuário:** Permitir que usuários registrados acessem o sistema usando seu nome de usuário/e-mail e senha.
*   **RFCU003: Logout de Usuário:** Permitir que usuários autenticados encerrem sua sessão.
*   **RFCU004: Gerenciamento de Sessão:** Manter a sessão do usuário ativa durante a navegação e invalidá-la após logout ou tempo de inatividade.
*   **RFCU005: Criação de Créditos de Voto no Registro:** Ao se registrar, o usuário deve receber uma quantidade inicial de créditos de voto (ex: 100 créditos).
*   **RFCU006: Visualização de Perfil:** Usuários logados devem poder visualizar suas informações básicas de perfil (username, email).
*   **RFCU007: (Futuro) Alteração de Senha:** Usuários logados devem poder alterar sua senha.

#### 4.3.2. Gerenciamento de Assinaturas
*   **RFCA001: Página de Assinatura:** Exibir informações sobre o clube de assinaturas, valor (R$4,20) e benefícios.
*   **RFCA002: Processo de Adesão à Assinatura:** Permitir que usuários se tornem assinantes (atualmente simulado/básico, mas deve prever integração com gateway de pagamento no futuro).
*   **RFCA003: Verificação de Status da Assinatura:** O sistema deve identificar se um usuário logado é um assinante ativo.
*   **RFCA004: (Futuro) Cancelamento de Assinatura:** Permitir que assinantes cancelem sua assinatura.
*   **RFCA005: (Futuro) Histórico de Pagamentos:** Permitir que assinantes visualizem seu histórico de pagamentos.

#### 4.3.3. Sistema de Votação
*   **RFVOT001: Listagem de Iniciativas para Votação:** Exibir as iniciativas da DAO que estão abertas para votação para os assinantes.
*   **RFVOT002: Detalhes da Iniciativa:** Mostrar informações detalhadas sobre cada iniciativa (título, descrição).
*   **RFVOT003: Registro de Voto:** Permitir que assinantes registrem seu voto em uma iniciativa. (A implementação atual é de 1 voto/crédito por iniciativa. A votação quadrática precisa ser detalhada).
    *   **RFVOT003.1: Votação Quadrática (Detalhar):** O sistema deve implementar a lógica de votação quadrática, onde o custo para registrar múltiplos 

votos em uma mesma iniciativa aumenta quadraticamente (ex: 1º voto = 1 crédito, 2º voto = 4 créditos, 3º voto = 9 créditos). O usuário terá um total de créditos de voto que pode alocar entre diferentes iniciativas.
*   **RFVOT004: Visualização de Créditos de Voto:** O usuário deve poder ver quantos créditos de voto ainda possui disponíveis.
*   **RFVOT005: (Futuro) Reset de Créditos de Voto:** O sistema pode resetar os créditos de voto periodicamente (ex: mensalmente).
*   **RFVOT006: Listagem de Votos do Usuário:** O usuário deve poder ver em quais iniciativas já votou.
*   **RFVOT007: Remoção de Voto:** Permitir que o usuário remova seu voto de uma iniciativa (e recupere os créditos correspondentes).

#### 4.3.4. Painel Administrativo (`/admin`)
*   **RFADM001: Acesso Restrito a Administradores:** Apenas usuários com permissão de administrador podem acessar o painel administrativo.
*   **RFADM002: Dashboard Administrativo:** Exibir um resumo das principais informações e links para as seções de gerenciamento.
*   **RFADM003: Gerenciamento de Usuários:**
    *   Listar todos os usuários registrados com informações básicas (ID, username, email, status de admin, data de criação).
    *   Permitir alternar o status de administrador de um usuário.
    *   Permitir excluir um usuário.
*   **RFADM004: Gerenciamento de Assinaturas:**
    *   Listar todas as assinaturas com detalhes (ID do usuário, status, datas).
    *   Permitir cancelar uma assinatura (marcar como cancelada).
*   **RFADM005: Gerenciamento de Iniciativas:**
    *   Listar todas as iniciativas criadas com detalhes (ID, título, autor, data de criação).
    *   (Futuro) Permitir criar novas iniciativas para votação.
    *   (Futuro) Permitir editar iniciativas existentes.
    *   Permitir excluir uma iniciativa.
*   **RFADM006: Gerenciamento de Votos:**
    *   Listar todos os votos registrados (ID do usuário, username, ID da iniciativa, título da iniciativa, data do voto).
    *   Permitir remover um voto específico.

## 5. Requisitos Não Funcionais

*   **RNF001: Desempenho:**
    *   As páginas devem carregar em um tempo aceitável (ex: < 3 segundos para conteúdo principal em conexões de banda larga).
    *   As consultas ao banco de dados devem ser otimizadas para evitar lentidão, especialmente em listagens e buscas.
*   **RNF002: Segurança:**
    *   Senhas de usuários devem ser armazenadas de forma segura (hashed com salt).
    *   O sistema deve proteger contra vulnerabilidades comuns da web (XSS, CSRF, SQL Injection).
    *   Sessões de usuário devem ser gerenciadas de forma segura.
    *   Dados sensíveis (se houver) devem ser transmitidos via HTTPS.
*   **RNF003: Usabilidade:**
    *   A interface do usuário deve ser intuitiva e fácil de usar, mesmo para usuários com pouca familiaridade com tecnologia.
    *   A linguagem utilizada deve ser acessível, evitando "juridiquês" desnecessário, conforme o tom da GanjaDAO.
    *   O design deve seguir a identidade visual da GanjaDAO (paleta de cores, tipografia).
*   **RNF004: Escalabilidade:**
    *   A arquitetura deve permitir o crescimento futuro no número de usuários, conteúdo e funcionalidades sem degradação significativa de desempenho (considerar para escolhas de banco de dados e infraestrutura se o projeto crescer muito).
*   **RNF005: Manutenibilidade:**
    *   O código deve ser bem organizado, comentado e seguir boas práticas de desenvolvimento para facilitar futuras manutenções e evoluções.
    *   O uso de módulos e componentes reutilizáveis é encorajado.
*   **RNF006: Confiabilidade:**
    *   O sistema deve estar disponível para os usuários a maior parte do tempo (alta disponibilidade).
    *   Mecanismos de tratamento de erros devem ser implementados para evitar quebras inesperadas e fornecer mensagens úteis ao usuário.
*   **RNF007: Compatibilidade:**
    *   O sistema deve ser compatível com os principais navegadores web modernos (Chrome, Firefox, Safari, Edge).
*   **RNF008: Privacidade:**
    *   Os dados dos usuários devem ser tratados com confidencialidade e em conformidade com as leis de proteção de dados aplicáveis (LGPD no Brasil).
    *   Políticas de privacidade claras devem ser disponibilizadas.

## 6. Personas de Usuário

*   **Persona 1: Cultivador Iniciante (Mariana, 28 anos)**
    *   **Background:** Começou a cultivar recentemente para uso medicinal próprio, tem receio das implicações legais, busca informação confiável e proteção.
    *   **Necessidades:** Entender seus direitos, aprender sobre o processo legal de HC, encontrar calculadoras para otimizar seu cultivo, sentir-se parte de uma comunidade de apoio.
    *   **Como a GanjaDAO ajuda:** Acesso a conteúdo educativo, ferramenta de geração de HC, calculadoras, clube de assinaturas para se sentir parte e apoiar.

*   **Persona 2: Ativista Engajado (João, 35 anos)**
    *   **Background:** Já cultiva há algum tempo, é ativo na comunidade canábica, busca formas de contribuir para a mudança da legislação e apoiar iniciativas que defendem os direitos dos cultivadores.
    *   **Necessidades:** Participar de decisões da DAO, apoiar financeiramente a causa, utilizar ferramentas para manifestações (ANVISA), acessar jurisprudência atualizada.
    *   **Como a GanjaDAO ajuda:** Clube de assinaturas com votação quadrática, ferramenta de manifestação ANVISA, módulo jurídico com jurisprudência.

*   **Persona 3: Administrador da GanjaDAO (Equipe Interna)**
    *   **Background:** Responsável por gerenciar a plataforma, usuários, conteúdo e iniciativas da DAO.
    *   **Necessidades:** Ferramentas para gerenciar usuários, assinaturas, criar e moderar iniciativas de votação, analisar resultados de votações, publicar conteúdo.
    *   **Como a GanjaDAO ajuda:** Painel administrativo completo com funcionalidades de gerenciamento.




## 7. Fluxos de Usuário e Casos de Uso

Esta seção descreve os principais fluxos de interação do usuário com a plataforma GanjaDAO e os casos de uso associados.

### 7.1. Fluxo: Novo Usuário - Registro e Primeiro Acesso ao Clube

*   **Ator:** Usuário não registrado (Visitante)
*   **Objetivo:** Registrar-se na plataforma e acessar o painel do clube.
*   **Pré-condições:** Nenhuma.
*   **Fluxo Principal:**
    1.  Visitante acessa a página inicial do `ganjadao-clube` ou uma página que requer autenticação.
    2.  Visitante clica no link/botão "Registrar".
    3.  Sistema exibe o formulário de registro (campos: nome de usuário, e-mail, senha, confirmação de senha).
    4.  Visitante preenche o formulário e submete.
    5.  Sistema valida os dados:
        *   Se houver erros (campos vazios, e-mail inválido, senhas não coincidem, usuário/e-mail já existe), exibe mensagens de erro e permite correção.
        *   Se os dados forem válidos, sistema cria a conta do usuário, armazena a senha de forma segura (hash), e cria os créditos de voto iniciais.
    6.  Sistema redireciona o usuário para a página de login com uma mensagem de sucesso no registro.
    7.  Usuário preenche o formulário de login (identificador: username/email, senha) e submete.
    8.  Sistema valida as credenciais:
        *   Se inválidas, exibe mensagem de erro.
        *   Se válidas, cria a sessão do usuário.
    9.  Sistema redireciona o usuário para o `/dashboard` do clube.
*   **Pós-condições:** Usuário registrado, autenticado e com acesso ao painel do clube.

### 7.2. Fluxo: Usuário Existente - Login e Acesso ao Painel

*   **Ator:** Usuário registrado
*   **Objetivo:** Acessar o painel do clube.
*   **Pré-condições:** Usuário possui uma conta registrada.
*   **Fluxo Principal:**
    1.  Usuário acessa a página de login.
    2.  Usuário preenche o formulário de login (identificador, senha) e submete.
    3.  Sistema valida as credenciais.
    4.  Se válidas, sistema cria a sessão e redireciona para o `/dashboard`.
    5.  Se inválidas, sistema exibe mensagem de erro.
*   **Pós-condições:** Usuário autenticado e com acesso ao painel.

### 7.3. Fluxo: Usuário do Clube - Participar de uma Votação

*   **Ator:** Usuário assinante do clube (ou com permissão para votar)
*   **Objetivo:** Registrar votos em uma iniciativa da DAO.
*   **Pré-condições:** Usuário logado, assinatura ativa (ou permissão de voto), iniciativa aberta para votação.
*   **Fluxo Principal:**
    1.  Usuário acessa a seção de "Iniciativas" ou "Votações".
    2.  Sistema exibe a lista de iniciativas abertas para votação.
    3.  Usuário seleciona uma iniciativa para ver os detalhes.
    4.  Sistema exibe os detalhes da iniciativa e a interface de votação (considerando votação quadrática).
    5.  Usuário aloca seus créditos de voto para a iniciativa (ex: decide quantos votos/créditos quer dar).
    6.  Sistema valida se o usuário possui créditos suficientes.
    7.  Usuário confirma o voto.
    8.  Sistema registra o voto, deduz os créditos do usuário e atualiza a visualização da iniciativa (ex: mostrando que o usuário já votou ou o total de votos).
    9.  Sistema exibe mensagem de confirmação.
*   **Fluxos Alternativos:**
    *   Usuário não tem créditos suficientes: Sistema informa e não permite o voto.
    *   Usuário decide remover votos: Sistema permite remover votos e reembolsa os créditos.
*   **Pós-condições:** Voto do usuário registrado na iniciativa, créditos de voto atualizados.

### 7.4. Fluxo: Usuário - Gerar Manifestação para ANVISA (`ganjadao.app`)

*   **Ator:** Qualquer visitante ou usuário da plataforma.
*   **Objetivo:** Criar e obter uma manifestação formatada para uma consulta pública da ANVISA.
*   **Pré-condições:** Nenhuma (para gerar), acesso à internet (para enviar/salvar).
*   **Fluxo Principal:**
    1.  Usuário acessa o módulo "ANVISA" na `ganjadao.app`.
    2.  Sistema exibe o formulário de manifestação (campos para dados pessoais, argumentos, etc.).
    3.  Usuário preenche o formulário.
    4.  Usuário solicita a "Prévia" da manifestação.
    5.  Sistema gera e exibe o texto da manifestação.
    6.  Usuário revisa a prévia e, se necessário, volta para editar o formulário.
    7.  Após aprovar a prévia, usuário escolhe uma ação:
        *   **Download PDF:** Sistema gera um PDF da manifestação e inicia o download.
        *   **Enviar por E-mail:** Sistema envia a manifestação para o e-mail da ANVISA (e opcionalmente para o usuário).
        *   **Salvar Manifestação:** Sistema salva os dados da manifestação no banco de dados da plataforma.
    8.  Sistema exibe mensagem de sucesso para a ação escolhida.
*   **Pós-condições:** Manifestação gerada em PDF, enviada por e-mail ou salva, conforme a escolha do usuário.

### 7.5. Fluxo: Usuário - Utilizar uma Calculadora (`ganjadao.app`)

*   **Ator:** Qualquer visitante ou usuário da plataforma.
*   **Objetivo:** Realizar um cálculo específico relacionado ao cultivo.
*   **Pré-condições:** Nenhuma.
*   **Fluxo Principal:**
    1.  Usuário acessa o módulo "Calculadoras" na `ganjadao.app`.
    2.  Sistema exibe a lista de calculadoras disponíveis (VPD, DLI, etc.).
    3.  Usuário seleciona a calculadora desejada.
    4.  Sistema exibe a interface da calculadora com os campos de entrada necessários.
    5.  Usuário insere os dados nos campos.
    6.  Sistema calcula e exibe o resultado.
*   **Pós-condições:** Usuário obtém o resultado do cálculo desejado.

### 7.6. Fluxo: Administrador - Gerenciar Usuários no Clube

*   **Ator:** Administrador da plataforma.
*   **Objetivo:** Gerenciar contas de usuários do clube.
*   **Pré-condições:** Administrador logado e com acesso ao painel administrativo.
*   **Fluxo Principal (Exemplo: Tornar um usuário admin):
    1.  Administrador acessa o painel administrativo (`/admin`).
    2.  Administrador navega para a seção "Gerenciar Usuários".
    3.  Sistema exibe a lista de usuários.
    4.  Administrador localiza o usuário desejado e clica na opção "Alternar Admin".
    5.  Sistema atualiza o status de administrador do usuário no banco de dados.
    6.  Sistema atualiza a lista de usuários exibindo o novo status.
    7.  Sistema exibe mensagem de sucesso.
*   **Outros Casos de Uso para Admin:** Excluir usuário, gerenciar assinaturas, gerenciar iniciativas, gerenciar votos (conforme detalhado nos Requisitos Funcionais do Admin).
*   **Pós-condições:** Ação de gerenciamento concluída (usuário com status de admin alterado, usuário excluído, etc.).




## 8. Critérios de Aceitação

Esta seção define os critérios que devem ser atendidos para que as funcionalidades sejam consideradas concluídas e aceitas.

### 8.1. Autenticação e Gerenciamento de Usuários (Clube)
*   **CA-AUTH001 (Registro):** Um novo usuário consegue se registrar com sucesso usando um e-mail e nome de usuário únicos. Todas as validações de campo (obrigatoriedade, formato de e-mail, complexidade e confirmação de senha) funcionam conforme especificado. O usuário recebe créditos de voto iniciais.
*   **CA-AUTH002 (Login):** Um usuário registrado consegue fazer login com credenciais válidas (username/email e senha). Um usuário com credenciais inválidas recebe uma mensagem de erro apropriada.
*   **CA-AUTH003 (Logout):** Um usuário logado consegue fazer logout, e sua sessão é invalidada.
*   **CA-AUTH004 (Acesso ao Painel):** Após o login, o usuário é redirecionado para o seu painel (`/dashboard`).

### 8.2. Sistema de Votação (Clube)
*   **CA-VOT001 (Listar Iniciativas):** Usuários logados e autorizados (assinantes) conseguem visualizar a lista de iniciativas abertas para votação.
*   **CA-VOT002 (Votar em Iniciativa):** Um usuário autorizado consegue alocar créditos de voto a uma iniciativa, respeitando a lógica de votação quadrática (a ser detalhada e implementada). Os créditos do usuário são deduzidos corretamente.
*   **CA-VOT003 (Visualizar Créditos):** O usuário consegue ver seu saldo atual de créditos de voto.
*   **CA-VOT004 (Remover Voto):** O usuário consegue remover seus votos de uma iniciativa, e os créditos são reembolsados corretamente.

### 8.3. Módulo ANVISA (`ganjadao.app`)
*   **CA-ANV001 (Gerar Prévia):** O usuário consegue preencher o formulário de manifestação e visualizar uma prévia em texto do conteúdo gerado.
*   **CA-ANV002 (Download PDF):** O usuário consegue gerar e baixar um PDF formatado da manifestação preenchida.
*   **CA-ANV003 (Enviar E-mail):** O usuário consegue enviar a manifestação por e-mail para o destinatário configurado (ANVISA) e receber uma cópia, se solicitado. O envio deve ser confirmado por uma mensagem de sucesso.
*   **CA-ANV004 (Salvar Manifestação):** O usuário consegue salvar os dados da manifestação na plataforma, e estes podem ser recuperados posteriormente (se a funcionalidade de listagem for implementada).

### 8.4. Módulo Calculadoras (`ganjadao.app`)
*   **CA-CALC001 (Cálculo Correto):** Cada calculadora (VPD, DLI, Nutrientes, Ponto de Orvalho, EC Flush) deve fornecer resultados precisos com base nas entradas fornecidas pelo usuário, conforme as fórmulas padrão para cada cálculo.
*   **CA-CALC002 (Interface Clara):** Cada calculadora deve ter uma interface clara, indicando quais entradas são necessárias e onde o resultado será exibido.

### 8.5. Módulo Jurídico (`ganjadao.app`)
*   **CA-JUR001 (Gerar HC):** O usuário consegue preencher o formulário de HC e gerar um documento PDF formatado e pronto para download.
*   **CA-JUR002 (Acesso a Conteúdo):** O usuário consegue navegar e visualizar os conteúdos educacionais e templates de documentos disponibilizados.

### 8.6. Painel Administrativo (Clube)
*   **CA-ADM001 (Acesso Restrito):** Somente usuários com permissão de administrador conseguem acessar qualquer rota dentro de `/admin`.
*   **CA-ADM002 (Gerenciar Usuários):** O administrador consegue listar usuários, alterar o status de admin de um usuário e excluir um usuário. As alterações são refletidas corretamente no sistema.
*   **CA-ADM003 (Gerenciar Iniciativas/Votos):** O administrador consegue listar iniciativas e votos, e excluir iniciativas ou votos específicos. As alterações são refletidas.

## 9. Restrições Técnicas e Considerações

*   **RT001: Tecnologia Backend (Clube e App):** A aplicação utiliza Node.js com o framework Express.js.
*   **RT002: Banco de Dados (Clube):** O `ganjadao-clube` utiliza SQLite para persistência de dados (usuários, sessões, iniciativas, votos, assinaturas). O arquivo do banco de dados (`ganjadao.db`) está localizado na pasta `/db`.
*   **RT003: Banco de Dados (App - Módulo ANVISA):** O módulo ANVISA do `ganjadao.app` também utiliza SQLite para salvar manifestações (a ser confirmado se é o mesmo DB ou um separado).
*   **RT004: View Engine:** Ambas as aplicações utilizam EJS (Embedded JavaScript templates) como view engine.
*   **RT005: Autenticação e Sessão (Clube):** Utiliza `express-session` com `connect-sqlite3` para armazenamento de sessões. Senhas são hasheadas usando `bcryptjs`.
*   **RT006: Frontend:** HTML, CSS e JavaScript client-side básico. Não foi identificado o uso de frameworks frontend complexos como React, Angular ou Vue no código analisado (além do EJS para renderização server-side).
*   **RT007: Geração de PDF:** O módulo ANVISA utiliza a biblioteca `pdf-lib` para gerar documentos PDF. O módulo Jurídico também deve utilizar uma abordagem similar ou a mesma biblioteca para a geração de HCs.
*   **RT008: Envio de E-mail:** O módulo ANVISA utiliza `nodemailer` para envio de e-mails. As configurações de SMTP devem ser gerenciadas através de variáveis de ambiente (`.env`).
*   **RT009: Estrutura do Projeto:** Os projetos são modularizados, com separação de rotas, controladores, modelos (implícito no uso do DB) e views.
*   **RT010: Variáveis de Ambiente:** Configurações sensíveis e específicas do ambiente (como `SESSION_SECRET`, `DATABASE_PATH`, credenciais de e-mail, `PORT`) são gerenciadas através de um arquivo `.env` (requer `dotenv` para carregar).
*   **RT011: Validação e Sanitização:** O módulo ANVISA possui funções de validação e sanitização de entradas. Práticas similares devem ser aplicadas em todas as entradas de usuário em ambos os projetos para segurança.
*   **RT012: Dependências:** O projeto possui um `package.json` que lista todas as dependências Node.js. A instalação é feita via `npm install`.
*   **RT013: Votação Quadrática:** A lógica completa da votação quadrática ainda precisa ser implementada no `ganjadao-clube`. A estrutura atual permite um voto simples.
*   **RT014: Pagamentos (Clube):** O sistema de assinatura do clube é atualmente básico/simulado. Uma integração real com um gateway de pagamento (ex: Stripe, PagSeguro, Mercado Pago) será necessária para funcionalidade completa e não foi identificada no código atual.

## 10. Considerações Futuras (Fora do Escopo Inicial, mas Relevantes)

*   **CF001: API Dedicada:** Desenvolvimento de uma API RESTful para desacoplar o frontend do backend e permitir o desenvolvimento de outros clientes (ex: aplicativo móvel).
*   **CF002: Testes Automatizados:** Implementação de testes unitários, de integração e end-to-end para garantir a qualidade e estabilidade do software.
*   **CF003: Integração Contínua/Entrega Contínua (CI/CD):** Configuração de pipelines de CI/CD para automatizar o build, teste e deploy da aplicação.
*   **CF004: Internacionalização (i18n):** Suporte para múltiplos idiomas, se houver planos de expansão.
*   **CF005: Acessibilidade (a11y):** Garantir que a plataforma seja acessível para pessoas com deficiência, seguindo as diretrizes WCAG.
*   **CF006: Monitoramento e Logging Avançado:** Implementação de ferramentas de monitoramento de performance e logging centralizado para facilitar a identificação e resolução de problemas em produção.
*   **CF007: Documentação da API (Swagger/OpenAPI):** Se uma API for desenvolvida.
*   **CF008: Melhorias no Módulo Jurídico:** Assinatura digital de documentos, integração com sistemas de tribunais (se viável e permitido).

## 11. Apêndice

*   (Opcional) Diagramas de arquitetura.
*   (Opcional) Mockups de interface (se disponíveis).
*   (Opcional) Glossário de termos.

---
*Fim do Documento de Requisitos do Produto (PRD) - GanjaDAO v1.0*

