flowchart TD
  %% Onboarding e Autenticação
  subgraph Onboarding
    A[Visitar GanjaDAO.app] --> B[Clicar em Registrar ou Login]
    B -->|Registrar| C[Formulário de Cadastro]
    C --> C1{Validação de Dados}
    C1 -->|Erro| C2[Exibir Erros Inline] --> C
    C1 -->|Sucesso| C3[Verificar E-mail] --> D[Seleção de Perfil]
    B -->|Login| D1[Formulário de Login]
    D1 --> D2{Credenciais Válidas?}
    D2 -->|Não| D3[Exibir Erro de Login] --> D1
    D2 -->|Sim| E[Redirecionar para Dashboard]
  end

  %% Dashboard e Escolha de Módulo
  subgraph Sessão Autenticada
    E --> F[Dashboard Principal]
    F --> G{Escolher Módulo}
    G -->|Jurídico| M1
    G -->|ANVISA| M2
    G -->|Calculadoras| M3
    G -->|Conteúdo| M4
    G -->|Clube| M5
  end

  %% Módulo Jurídico
  subgraph Módulo Jurídico
    M1[Menu Jurídico] --> J1[Novo HC]
    J1 --> J2[Formulário HC Passo-a-Passo]
    J2 --> J3{Validação Inputs}
    J3 -->|Erro| J4[Destacar Campos Inválidos] --> J2
    J3 -->|Sucesso| J5[Gerar PDF + QR Code]
    J5 --> J6[Exibir Download & QR]
    M1 --> J7[Consultar Jurisprudência]
    J7 --> J8[Form de Busca com Filtros]
    J8 --> J9[Mostrar Spinner]
    J9 --> J10[Resultados Paginados + Badges]
    J10 --> J8
    M1 --> J11[Templates de Documentos]
    J11 --> J12[Listar e Download de Templates]
  end

  %% Módulo ANVISA
  subgraph Módulo ANVISA
    M2[Menu ANVISA] --> A1[Formulário Manifestação]
    A1 --> A2{Validação}
    A2 -->|Erro| A3[Mostrar Erros Inline] --> A1
    A2 -->|Sucesso| A4[Exibir Prévia Texto]
    A4 --> A5{Ação do Usuário}
    A5 -->|Download PDF| A6[Gerar PDF e Download]
    A5 -->|Enviar E-mail| A7[Enviar e Mostrar Confirmação]
    A5 -->|Salvar| A8[Salvar no BD + Confirmação]
    A6 --> A4
    A7 --> A4
    A8 --> A4
  end

  %% Módulo Calculadoras
  subgraph Módulo Calculadoras
    M3[Menu Calculadoras] --> C1[VPD]
    M3 --> C2[DLI]
    M3 --> C3[Nutrientes]
    M3 --> C4[Ponto de Orvalho]
    M3 --> C5[EC Flush]
    C1 --> C1a[Inputs T, UR] --> C1b{Validação}
    C1b -->|Erro| C1c[Exibir Erros] --> C1a
    C1b -->|OK| C1d[Calcular e Mostrar VPD] --> M3
    %% Repetir lógica de validação e resultado para C2 a C5
  end

  %% Módulo Conteúdo
  subgraph Módulo Conteúdo
    M4[Lista de Artigos/Manuais] --> CT1[Filtro/Categoria]
    M4 --> CT2[Selecionar Item]
    CT2 --> CT3[Exibir Conteúdo]
    CT3 --> M4
  end

  %% Clube de Assinaturas
  subgraph Clube de Assinaturas
    M5[Checar Status de Assinatura] -->|Não Assinante| S1[Página de Planos]
    S1 --> S2[Simular Adesão (R$4,20)]
    S2 --> S3[Exibir Status Ativo]
    M5 -->|Assinante| S3
    S3 --> S4[Listar Iniciativas para Votar]
    S4 --> S5[Detalhes da Iniciativa]
    S5 --> S6[Interface de Votação Quadrática]
    S6 --> S7{Créditos Suficientes?}
    S7 -->|Não| S8[Exibir Erro de Crédito]
    S8 --> S6
    S7 -->|Sim| S9[Confirmar Voto]
    S9 --> S10[Atualizar Créditos + Confirmação]
    S10 --> S4
  end
