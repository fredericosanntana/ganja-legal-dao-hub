
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Database, Globe, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { searchDataJud, searchSTJWebsite } from "@/services/jurisprudenciaService";
import { Link } from "react-router-dom";

interface JurisprudenciaResult {
  id: string;
  tribunal?: string;
  numeroProcesso?: string;
  ementa: string;
}

// jurisprudências padrão para fallback
const defaultResults: JurisprudenciaResult[] = [
  {
    id: "hc-802866-pr",
    tribunal: "PR",
    numeroProcesso: "HC 802.866/PR",
    ementa: `HABEAS CORPUS. CULTIVO DOMÉSTICO DA PLANTA CANNABIS SATIVA PARA FINS MEDICINAIS. HABEAS CORPUS PREVENTIVO. UNIFORMIZAÇÃO DO ENTENDIMENTO DAS TURMAS CRIMINAIS. RISCO DE CONSTRANGIMENTO ILEGAL. DIREITO À SAÚDE PÚBLICA E À MELHOR QUALIDADE DE VIDA. REGULAMENTAÇÃO. OMISSÃO DA ANVISA E DO MINISTÉRIO DA SAÚDE. ATIPICIDADE PENAL DA CONDUTA. 1. O Juiz de primeiro grau concedeu o habeas corpus preventivo, porque, analisando o conjunto probatório, entendeu que o uso medicinal do óleo extraído da planta encontra-se suficientemente demonstrado pela documentação médica e, especialmente, pelo fato de que o paciente obteve autorização da ANVISA para importar o medicamento derivado da substância, o que indica que sua condição clínica fora avaliada com crivo administrativo, que reconheceu a necessidade de uso do medicamento. 2. O entendimento da Quinta Turma passou a corroborar o da Sexta Turma que, na sessão de julgamento do dia 14/6/2022, de relatoria do Ministro Rogério Schietti Cruz, por unanimidade, negou provimento ao Recurso Especial n. 1.972.092-SP do Ministério Público, e manteve a decisão do Tribunal de origem, que havia concedido habeas corpus preventivo. Então, ambas as turmas passaram a entender que o plantio e a aquisição das sementes da Cannabis sativa, para fins medicinais, não se trata de conduta criminosa, independente da regulamentação da ANVISA. 3. Após o precedente paradigma da Sexta Turma, formou-se a jurisprudência, segundo a qual, "uma vez que o uso pleiteado do óleo da Cannabis sativa, mediante fabrico artesanal, se dará para fins exclusivamente terapêuticos, com base em receituário e laudo subscrito por profissional médico especializado, chancelado pela ANVISA na oportunidade em que autorizou os pacientes a importarem o medicamento feito à base de canabidiol - a revelar que reconheceu a necessidade que têm no seu uso - , não há dúvidas de que deve ser obstada a iminente repressão criminal sobre a conduta praticada pelos pacientes/recorridos" (REsp n. 1.972.092/SP, relator Ministro Rogerio Schietti Cruz, Sexta Turma, julgado em 14/6/2022, DJe de 30/6/2022). 4. Os fatos, ora apresentados pelo impetrante, não podem ser objeto da sanção penal, porque se tratam do exercício de um direito fundamental garantido na Constituição da República, e não há como, em matéria de saúde pública e melhor qualidade de vida, ignorar que "a função judicial acaba exercendo a competência institucional e a capacidade intelectual para fixar tais conceitos abstratos, atribuindo significado aos mesmos, concretizando-os, e até dando um alcance maior ao texto constitucional, bem como julgando os atos das outras funções do Poder Público que interpretam estes mesmos princípios" (DUTRA JÚNIOR, José Felicio. *Constitucionalização de fatos sociais por meio da interpretação do Supremo Tribunal Federal: Análise de alguns julgados proativos da Suprema Corte Brasileira*. Revista Cadernos de Direito, v. 1, n. 1, UDF: Brasília, 2019, pags. 205-206). 5. Habeas corpus concedido, a fim de reestabelecer a decisão de primeiro grau que garantiu ao paciente o salvo-conduto, para obstar que qualquer órgão de persecução penal turbe ou embarace o cultivo de 15 (quinze) mudas de Cannabis sativa para uso exclusivo próprio e enquanto durar o tratamento. Oficie-se à Agência Nacional de Vigilância Sanitária (ANVISA) e ao Ministério da Saúde. (HC n. 802.866/PR, rel. Min. Jesuíno Rissato, 13/9/2023, DJe 3/10/2023.)`,
  },
  {
    id: "embargos-1972092-STJ",
    tribunal: "STJ",
    numeroProcesso: "REsp 1.972.092/SP",
    ementa: `EMBARGOS DE DECLARAÇÃO NO AGRAVO REGIMENTAL NO RECURSO EM HABEAS CORPUS. CULTIVO DOMÉSTICO DA PLANTA CANNABIS SATIVA PARA FINS MEDICINAIS. HABEAS CORPUS PREVENTIVO. UNIFORMIZAÇÃO DO ENTENDIMENTO DAS TURMAS CRIMINAIS. RISCO DE CONSTRANGIMENTO ILEGAL. DIREITO A SAÚDE PÚBLICA E A MELHOR QUALIDADE DE VIDA. REGULAMENTAÇÃO. OMISSÃO DA ANVISA E DO MINISTÉRIO DA SAÚDE. ATIPICIDADE PENAL DA CONDUTA. 1. No presente caso, "a autorização de importação n. 036687.0641726/2020, acostada às págs. 41/42, proveniente da ANVISA, autoriza que o paciente importe excepcionalmente o produto HempFlex CBD - Green Care, o que demonstra a veracidade de suas afirmações nesse momento quanto à necessidade do cultivo da plante para uso medicinal, uma vez que o impetrante não possui recursos financeiros para a compra do medicamento". 2. O entendimento da Quinta Turma passou a corroborar o da Sexta Turma que, na sessão de julgamento do dia 14/6/2022, de relatoria do Ministro Rogério Schietti Cruz, por unanimidade, negou provimento ao Recurso Especial n. 1.972.092-SP do Ministério Público, e manteve a decisão do Tribunal de origem, que havia concedido habeas corpus preventivo. Então, ambas as turmas passaram a entender que o plantio e a aquisição das sementes da Cannabis sativa, para fins medicinais, não se trata de conduta criminosa, independente da regulamentação da ANVISA. 3. Após o precedente paradigma da Sexta Turma, formou-se a jurisprudência, segundo a qual, "uma vez que o uso pleiteado do óleo da Cannabis sativa, mediante fabrico artesanal, se dará para fins exclusivamente terapêuticos, com base em receituário e laudo subscrito por profissional médico especializado, chancelado pela ANVISA na oportunidade em que autorizou os pacientes a importarem o medicamento feito à base de canabidiol - a revelar que reconheceu a necessidade que têm no seu uso - , não há dúvidas de que deve ser obstada a iminente repressão criminal sobre a conduta praticada pelos pacientes/recorridos" (REsp n. 1.972.092/SP, relator Ministro Rogerio Schietti Cruz, Sexta Turma, julgado em 14/6/2022, DJe de 30/6/2022). 4. Os fatos, ora apresentados pelo embargante, não podem ser objeto da sanção penal, porque se tratam do exercício de um direito fundamental garantido na Constituição da República, e não há como, em matéria de saúde pública e melhor qualidade de vida, ignorar que "a função judicial acaba exercendo a competência institucional e a capacidade intelectual para fixar tais conceitos abstratos, atribuindo significado aos mesmos, concretizando-os, e até dando um alcance maior ao texto constitucional, bem como julgando os atos das outras funções do Poder Público que interpretam estes mesmos princípios" (DUTRA JÚNIOR, José Felicio. Constitucionalização de fatos sociais por meio da interpretação do Supremo Tribunal Federal: Análise de alguns julgados proativos da Suprema Corte Brasileira. Revista Cadernos de Direito, v. 1, n. 1, UDF: Brasília, 2019, pags. 205-206). 5`,
  },
  {
    id: "agravo-182453-MG",
    tribunal: "MG",
    numeroProcesso: "AgRg no RHC 182.453/MG",
    ementa: `AGRAVO REGIMENTAL NO RECURSO EM HABEAS CORPUS. PLANTIO DE MACONHA PARA USO PRÓPRIO COM FINS MEDICINAIS. AUTORIZAÇÃO PARA IMPORTAÇÃO CONCEDIDA PELA ANVISA CONDICIONADA À PRESCRIÇÃO MÉDICA ATUALIZADA. IRRESIGNAÇÃO DO MINISTÉRIO PÚBLICO DO ESTADO DE MINAS GERAIS. ESPECIFICAÇÃO DA QUANTIDADE AUTORIZADA. AGRAVO REGIMENTAL PARCIALMENTE PROVIDO. 1. O Superior Tribunal de Justiça vem entendendo pela concessão de habeas corpus para que se possa obter salvo-conduto para fins exclusivamente terapêuticos e/ou medicinais, com base em receituário e laudo subscrito por profissional médico habilitado, desde que devidamente autorizado pela Anvisa, pois é possível, "ao menos em tese, que os pacientes (ora recorridos) tenham suas condutas enquadradas no art. 33, 1º, da Lei n. 11.343/2006, punível com pena privativa de liberdade, é indiscutível o cabimento de habeas corpus para os fins por eles almejados: concessão de salvo-conduto para o plantio e o transporte de Cannabis sativa, da qual se pode extrair a substância necessária para a produção artesanal dos medicamentos prescritos para fins de tratamento de saúde" (REsp n. 1.972.092/SP, relator Ministro Rogerio Schietti Cruz, Sexta Turma, julgado em 14/6/2022, DJe de 30/6/2022). 2. No caso, verificando-se situação excepcional, concedo salvo-conduto aos agravados, autorizando o cultivo de 304 plantas de Cannabis sativa, a cada 6 meses, totalizando 608 plantas de Cannabis sativa, por ano, para uso exclusivo e próprio dos agravados, enquanto durar o tratamento, nos termos das prescrições médicas, impedindo-se qualquer medida de natureza penal, devendo manter atualizadas as prescrições médicas e autorizações administrativas necessárias junto à Agência Nacional de Vigilância Sanitária - ANVISA. 3. Agravo regimental parcialmente provido. (AgRg no RHC n. 182.453/MG, relator Ministro Jesuíno Rissato (Desembargador Convocado do Tjdft), Sexta Turma, julgado em 8/4/2024, DJe de 11/4/2024.)`,
  },
  {
    id: "rhc-123402-RS",
    tribunal: "RS",
    numeroProcesso: "RHC 123.402/RS",
    ementa: `RECURSO ORDINÁRIO EM HABEAS CORPUS. PEDIDO DE SALVO-CONDUTO PARA PLANTIO, CULTIVO, USO E POSSE DE CANNABIS SATIVA L. PARA TRATAMENTO INDIVIDUAL. INDICAÇÃO MÉDICA PARA O USO DA SUBSTÂNCIA. AUTORIZAÇÃO PARA IMPORTAÇÃO DO PRODUTO POR PARTE DA AGÊNCIA NACIONAL DE VIGILÂNCIA SANITÁRIA (ANVISA). HIPOSSUFICIÊNCIA FINANCEIRA. IMPORTAÇÃO DE SEMENTES AUTORIZADA PELA CORTE A QUO. AUTORIZAÇÃO PARA O CULTIVO E EXTRAÇÃO DE ÓLEO MEDICINAL. ANÁLISE TÉCNICA A CARGO DA AGÊNCIA DE VIGILÂNCIA SANITÁRIA. RECURSO NÃO PROVIDO. RECOMENDAÇÃO PARA QUE A ANVISA ANALISE A POSSIBILIDADE DE AUTORIZAÇÃO DO CULTIVO E MANEJO PARA FINS MEDICINAIS. 1. A recorrente busca salvo-conduto para viabilizar o plantio de maconha para fins medicinais, após ter obtido, perante o Tribunal Regional Federal da 4ª Região, permissão para importar pequenas quantidades de semente de Cannabis sativa L. 2. Os Tribunais Superiores já possuem jurisprudência firmada no sentido de considerar que a conduta de importar pequenas quantidades de sementes de maconha não se adequa à forma prevista no art. 33 da Lei de Drogas, subsumindo-se, formalmente, ao tipo penal descrito no art. 334-A do Código Penal, mas cuja tipicidade material é afastada pela aplicação do princípio da insignificância. 3. O controle do cultivo e da manipulação da maconha deve ser limitado aos conhecidos efeitos deletérios atribuídos a algumas substâncias contidas na planta, sendo certo que a própria Lei n. 11.343/2006 permite o manejo de vegetais dos quais possam ser extraídas ou produzidas drogas para fins medicinais ou científicos, desde que autorizado pela União. 3. No atual estágio do debate acerca da regulamentação dos produtos baseados na Cannabis e de desenvolvimento das pesquisas a respeito da eficácia dos medicamentos obtidos a partir da planta, não parece razoável desautorizar a produção artesanal do óleo à base de maconha apenas sob o pretexto da falta de regulamentação. De mais a mais, a própria agência de vigilância sanitária federal já permite a importação de medicamentos à base de maconha, produzidos industrial ou artesanalmente no exterior, como, aliás, comprovam os documentos juntados a estes autos. 4. Entretanto, a autorização buscada pela recorrente depende de análise de critérios técnicos que não cabem ao juízo criminal, especialmente em sede de habeas corpus. Essa incumbência está a cargo da própria Agência Nacional de Vigilância Sanitária que, diante das peculiaridades do caso concreto, poderá autorizar ou não o cultivo e colheita de plantas das quais se possam extrair as substâncias necessárias para a produção artesanal dos medicamentos. 5. Recurso ordinário em habeas corpus não provido, recomendando à Agência Nacional de Vigilância Sanitária que analise o caso e decida se é viável autorizar a recorrente a cultivar e ter a posse de plantas de Cannabis sativa L. para fins medicinais, suprindo a exigência contida no art. 33 da Lei n. 11.343/2006. (RHC n. 123.402/RS, relator Ministro Reynaldo Soares da Fonseca, Quinta Turma, julgado em 23/3/2021, DJe de 29/3/2021.)`,
  },
  {
    id: "RE 635659-STF",
    tribunal: "STF",
    numeroProcesso: "RE 635659",
    ementa: `RECURSO EXTRAORDINÁRIO COM REPERCUSSÃO GERAL. PORTE DE DROGAS PARA CONSUMO PESSOAL. DECLARAÇÃO DE INCONSTITUCIONALIDADE, SEM REDUÇÃO DE TEXTO, DO ART. 28 DA LEI 11.343/2006, PARA AFASTAR A REPERCUSSÃO CRIMINAL DO DISPOSITIVO EM RELAÇÃO AO PORTE DE CANNABIS SATIVA PARA USO PESSOAL. RISCO DE ESTIGMATIZAÇÃO DO USUÁRIO. DESLOCAMENTO DO ENFOQUE PARA O CAMPO DA SAÚDE PÚBLICA. IMPLEMENTAÇÃO DE POLÍTICAS PÚBLICAS DE PREVENÇÃO AO USO DE DROGAS E DE ATENÇÃO ESPECIALIZADA AO USUÁRIO. MANUTENÇÃO DO CARÁTER ILÍCITO DO PORTE DE DROGAS. POSSIBILIDADE DE APREENSÃO DA SUBSTÂNCIA E DE APLICAÇÃO DAS SANÇÕES PREVISTAS EM LEI (INCISOS I E III DO ART. 28), MEDIANTE PROCEDIMENTO NÃO PENAL. INSTITUIÇÃO DE CRITÉRIOS OBJETIVOS PARA DISTINGUIR USUÁRIOS E TRAFICANTES. 1. Discussão sobre a constitucionalidade do art. 28 da Lei 11.343/2006 (Quem adquirir, guardar, tiver em depósito, transportar ou trouxer consigo, para consumo pessoal, drogas sem autorização ou em desacordo com determinação legal ou regulamentar será submetido às seguintes penas: I - advertência sobre os efeitos das drogas; II - prestação de serviços à comunidade; III - medida educativa de comparecimento a programa ou curso educativo). 2. Caso em que o Tribunal não discute o tratamento legislativo do tráfico de drogas. Tal conduta é criminalizada com base em determinação constitucional (art. 5º, XLIII). Quem comercializa, distribui e mantém em depósito drogas ilícitas pratica crime inafiançável e insuscetível de graça e anistia e incide nas penas do art. 33 da Lei 11.343/2006, as quais alcançam 15 anos de prisão. 3. Respeito às atribuições do Legislativo; cabe aos parlamentares e a ninguém mais decidir sobre o caráter ilícito do porte de drogas, ainda que para uso pessoal. Caso em que a Corte cogita apenas a supressão da repercussão criminal das condutas tipificadas no art. 28 da Lei 11.343/2006, sem prejuízo da aplicação das penalidades previstas nos incisos I e III do dispositivo, em procedimento a ser regulamentado pelo CNJ. Propósito de humanizar o tratamento dispensado por lei aos usuários, deslocando os esforços do campo penal para o da saúde pública. 4. A atribuição de natureza penal às sanções cominadas pelo art. 28 da Lei 11.343/2006 aprofunda a estigmatização do usuário e do dependente, ofuscando as políticas de prevenção, atenção especializada e tratamento, expressamente definidas no Sistema Nacional de Políticas sobre Drogas. 5. O segundo ponto abordado no recurso diz respeito à necessidade de previsão de critérios objetivos para distinguir usuários e traficantes, de modo a reduzir a discricionariedade das autoridades na capitulação do delito. O estado atual do sistema, caracterizado pela vagueza de conceitos jurídicos que podem importar a prisão de usuários, é incompatível com a ordem constitucional e com a própria intenção do legislador. 6. Com a edição do art. 28 da Lei 11.343/2006, pretendeu o legislador apartar a conduta do tráfico de drogas, que repercute negativamente em toda a sociedade, do porte para uso pessoal, cuja ofensividade se limita à esfera pessoal do usuário. Porém, na prática, o que se observou foi o contrário. Em vez de suavizar a punição cominada para o delito de porte de drogas para uso pessoal, os conceitos jurídicos indeterminados previstos na lei (“consumo pessoal” e “pequena quantidade”) recrudesceram o tratamento dispensado aos usuários. 7. Nota-se que, em vez de representar invasão de competência do Congresso Nacional, a fixação de parâmetros objetivos se alinha com a opção do legislador. Evita-se que disfuncionalidades do sistema de Justiça deformem o programa normativo da Lei 11.343/2006. 8. Conforme deliberado pelo Plenário, presume-se como usuário de drogas aquele que é encontrado na posse de até 40 gramas de maconha ou de 6 plantas-fêmeas, sem prejuízo do afastamento dessa presunção por decisão fundamentada do Delegado de Polícia, fundada em elementos objetivos que sinalizem o intuito de mercancia. A solução vale até que o Congresso Nacional delibere sobre o assunto, concebendo mecanismos capazes de reduzir a discricionariedade policial na aplicação do art. 28 da Lei 11.343/2006. 9. Por todo o exposto, fixa-se a seguinte tese de repercussão geral: (i) não comete infração penal quem adquirir, guardar, tiver em depósito, transportar ou trouxer consigo, para consumo pessoal, a substância cannabis sativa, sem prejuízo do reconhecimento da ilicitude extrapenal da conduta, com apreensão da droga e aplicação de sanções de advertência sobre os efeitos dela (art. 28, I) e medida educativa de comparecimento a programa ou curso educativo (art. 28, III); (ii) as sanções estabelecidas nos incisos I e III do art. 28 da Lei 11.343/2006 serão aplicadas pelo juiz em procedimento de natureza não penal, sem nenhuma repercussão criminal para a conduta; (iii) em se tratando da posse de cannabis para consumo pessoal, a autoridade policial apreenderá a substância e notificará o autor do fato para comparecer em Juízo, na forma do regulamento a ser aprovado pelo CNJ. Até que o CNJ delibere a respeito, a competência para julgar as condutas do art. 28 da Lei 11.343/2006 será dos Juizados Especiais Criminais, segundo a sistemática atual, vedada a atribuição de quaisquer efeitos penais para a sentença; (iv) nos termos do 2º do artigo 28 da Lei 11.343/2006, será presumido usuário quem, para consumo próprio, adquirir, guardar, tiver em depósito, transportar ou trouxer consigo até 40 gramas de cannabis sativa ou seis plantas-fêmeas, até que o Congresso Nacional venha a legislar a respeito; (v) a presunção do item anterior é relativa, não estando a autoridade policial e seus agentes impedidos de realizar a prisão em flagrante por tráfico de drogas, mesmo para quantidades inferiores ao limite acima estabelecido, quando presentes elementos que indiquem intuito de mercancia, como a forma de acondicionamento da droga, as circunstâncias da apreensão, a variedade de substâncias apreendidas, a apreensão simultânea de instrumentos como balança, registros de operações comerciais e aparelho celular contendo contatos de usuários ou traficantes; (vi) nesses casos, caberá ao delegado de polícia consignar, no auto de prisão em flagrante, justificativa minudente para afastamento da presunção do porte para uso pessoal, sendo vedada a alusão a critérios subjetivos arbitrários; (vii) na hipótese de prisão por quantidades inferiores à fixada no item 4, deverá o juiz, na audiência de custódia, avaliar as razões invocadas para o afastamento da presunção de porte para uso próprio; (viii) a apreensão de quantidades superiores aos limites ora fixados não impede o juiz de concluir que a conduta é atípica, apontando nos autos prova suficiente da condição de usuário. 10. Apelo para que os Poderes avancem no tema, estabelecendo uma política focada não na estigmatização, mas no engajamento dos usuários, especialmente os dependentes, em um processo de autocuidado contínuo que lhes possibilite compreender os graves danos causados pelo uso de drogas; e na agenda de prevenção educativa, implementando programas de dissuasão ao consumo de drogas; na criação de órgãos técnicos na estrutura do Executivo, compostos por especialistas em saúde pública, com atribuição de aplicar aos usuários as medidas previstas em lei. 11. Para viabilizar a concretização dessa política pública especialmente a implementação de programas de dissuasão contra o consumo de drogas e a criação de órgãos especializados no atendimento de usuários caberá ao Executivo e ao Legislativo assegurar dotações orçamentárias suficientes para essa finalidade. Para isso, a União deverá liberar o saldo acumulado do Fundo Nacional Antidrogas, instituído pela Lei 7.560/1986, e deixar de contingenciar os futuros aportes no fundo recursos que deverão ser utilizados em programas de esclarecimento sobre os malefícios do uso de drogas. (RE 635659, Relator(a): GILMAR MENDES, Tribunal Pleno, julgado em 26-06-2024, PROCESSO ELETRÔNICO REPERCUSSÃO GERAL - MÉRITO DJe-s/n DIVULG 26-09-2024 PUBLIC 27-09-2024)
`,
  }, 
  {
    id: "EDcl no REsp n. 1.657.156-RJ",
    tribunal: "RJ",
    numeroProcesso: "EDcl no REsp n. 1.657.156-RJ",
    ementa: `EMENTA: AGRAVO REGIMENTAL NO HABEAS CORPUS. PEDIDO DE SALVO-CONDUTO. PLANTIO DE MACONHA PARA FINS MEDICINAIS. POSSIBILIDADE. AUTORIZAÇÃO PARA IMPORTAÇÃO DO MEDICAMENTO CONCEDIDA PELA ANVISA E PRESCRIÇÃO MÉDICA RELATANDO A NECESSIDADE DO USO. INSURGÊNCIA DO MINISTÉRIO PÚBLICO ESTADUAL. ESPECIALIDADE DO MÉDICO PRESCRITOR. QUESTÃO ALHEIA AOS LIMITES DE COGNIÇÃO DO HABEAS CORPUS. QUANTIDADE AUTORIZADA PARA O CULTIVO. NECESSIDADE DE ADEQUAÇÃO AOS DITAMES FIXADOS EM CASOS SIMILARES. AGRAVO REGIMENTAL PARCIALMENTE PROVIDO. 1. Hipótese em que o Agravado buscou a permissão para importar sementes, transportar e plantar Cannabis para fins medicinais, sob a afirmação de ser indispensável para o controle de sua enfermidade. 2. Considerando que o art. 2.º, parágrafo único, da Lei n. 11.343/20006, expressamente autoriza o plantio, a cultura e a colheita de vegetais dos quais possam ser extraídas substâncias psicotrópicas, exclusivamente para fins medicinais, bem como que a omissão estatal em regulamentar tal cultivo tem deixado pacientes sob o risco de rigorosa reprimenda penal, não há como deixar de reconhecer a adequação procedimental do salvo-conduto. 3. À luz dos princípios da legalidade e da intervenção mínima, não cabe ao Direito Penal reprimir condutas sem a rigorosa adequação típico-normativa, o que não há em tais casos, já que o cultivo em questão não se destina à produção de substância entorpecente. Notadamente, o afastamento da intervenção penal configura meramente o reconhecimento de que a extração do óleo da cannabis sativa, mediante cultivo artesanal e lastreado em prescrição médica, não atenta contra o bem jurídico saúde pública, o que não conflita, de forma alguma, com a possibilidade de fiscalização ou de regulamentação administrativa pelas autoridades sanitárias competentes. 4. Comprovado nos autos que o Agravado obteve autorização da Anvisa para importação do medicamento canábico, e juntada documentação médica que demonstra a necessidade do uso do óleo extraído da Cannabis para o tratamento do quadro clínico do Agravado, há de ser concedida a medida pretendida. 5. Verifica-se a regular habilitação do médico responsável pelo tratamento do Agravado perante o órgão fiscalizador do exercício da profissão, conforme destacado pelo Ministério Público nas razões do presente recurso. Dessa forma, a questão afeta à área de especialização do médico remonta a um tema que escapa dos preceitos da presente via. Aliás, ao tratar dessa específica questão no emblemático julgamento do REsp n. 1.972.092/SP, relator Ministro Rogerio Schietti Cruz, estabeleceu a Sexta Turma:"[e]m acréscimo, faço lembrar que, por ocasião do julgamento do Tema n. 106 dos Recursos Repetitivos, este Superior Tribunal decidiu que o fornecimento de medicamentos por parte do Poder Público pode ser determinado com base em laudo subscrito pelo próprio médico que assiste o paciente, sem necessidade de perícia oficial. Basta, para tanto, que haja "Comprovação, por meio de laudo médico fundamentado e circunstanciado expedido por médico que assiste o paciente, da imprescindibilidade ou necessidade do medicamento, assim como da ineficácia, para o tratamento da moléstia, dos fármacos fornecidos pelo SUS" (EDcl no REsp n. 1.657.156/RJ, Rel. Ministro Benedito Gonçalves, 1ª S., DJe 21/9/2018)." (fl. 25 do voto condutor do acórdão).`,
  }
];

const Jurisprudencia: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"datajud" | "stj">("datajud");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dataJudResults, setDataJudResults] = useState<JurisprudenciaResult[]>([]);
  const [stjResults, setStjResults] = useState<JurisprudenciaResult[]>([]);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Carrega jurisprudências padrão inicialmente
    setDataJudResults(defaultResults);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getPreview = (text: string) => {
    const sentences = text.split(/\.\s+/);
    const preview: string[] = [];
    for (const s of sentences) {
      if (s === s.trim().toUpperCase()) preview.push(s.trim());
      else break;
    }
    return preview.join('. ') + (preview.length ? '.' : '');
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);

    try {
      if (activeTab === "datajud") {
        // mantém padrão visível
        setDataJudResults(defaultResults);
        const res = await searchDataJud(searchTerm);
        if (res.success && res.data.length > 0) {
          setDataJudResults(res.data.map((r: any) => ({
            id: r.id,
            tribunal: r.tribunal,
            numeroProcesso: r.numeroProcesso,
            ementa: r.ementa || ''
          })));
          toast({ title: "Busca concluída", description: `Encontrados ${res.data.length} resultados.` });
        } else {
          toast({ title: "Nenhum resultado", description: "Mantendo jurisprudências padrão.", variant: "default" });
        }
      } else {
        const res = await searchSTJWebsite(searchTerm);
        if (res.success && res.data.length > 0) {
          setStjResults(res.data.map((r: any) => ({ id: r.id, ementa: r.ementa || '' })));
        } else {
          setStjResults([]);
          toast({ title: "Nenhum resultado STJ", description: "Tente outro termo.", variant: "default" });
        }
      }
    } catch (err: any) {
      setApiError(err.message);
      toast({ title: "Erro na busca", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Consulta de Jurisprudência</h1>
        <p className="text-muted-foreground mb-6">Pesquise decisões ligadas ao cultivo de cannabis</p>

        {apiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Erro de conexão</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <Tabs 
          value={activeTab} 
          onValueChange={(value: "datajud" | "stj") => setActiveTab(value)} 
          className="mb-6"
        >
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="datajud" className="flex items-center gap-2">
              <Database className="w-4 h-4" /> API DataJud
            </TabsTrigger>
            <TabsTrigger value="stj" className="flex items-center gap-2">
              <Globe className="w-4 h-4" /> Site STJ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="datajud">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" /> Pesquisar DataJud
                </CardTitle>
                <CardDescription>API oficial do CNJ</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="searchTerm">Termo de Pesquisa</Label>
                    <Input
                      id="searchTerm"
                      placeholder="Ex: cultivo, habeas corpus"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Pesquisando..." : "Pesquisar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stj">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" /> Pesquisar Site STJ
                </CardTitle>
                <CardDescription>Web scraping no site do STJ</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                  <div>
                    <Label htmlFor="searchTermStj">Termo de Pesquisa</Label>
                    <Input
                      id="searchTermStj"
                      placeholder="Ex: REsp 2.121.548"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Pesquisando..." : "Pesquisar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {loading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {!loading && activeTab === "datajud" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Jurisprudências</h2>
            {dataJudResults.map(item => {
              const isExpanded = expandedItems.has(item.id);
              const preview = getPreview(item.ementa);
              return (
                <Card key={item.id} className="p-4">
                  <CardHeader>
                    <CardTitle>
                      {item.numeroProcesso} {item.tribunal && `— ${item.tribunal}`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-sm font-semibold">
                      {isExpanded ? item.ementa : preview || item.ementa.substring(0, 100) + '...'}
                    </p>
                    {preview && preview !== item.ementa && (
                      <button
                        className="mt-2 text-primary hover:underline"
                        onClick={() => toggleExpand(item.id)}
                      >
                        {isExpanded ? 'Ver menos' : 'Ver mais'}
                      </button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {!loading && activeTab === "stj" && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resultados Site STJ</h2>
            {stjResults.length > 0 ? (
              stjResults.map(item => {
                const isExpanded = expandedItems.has(item.id);
                const preview = getPreview(item.ementa);
                return (
                  <Card key={item.id} className="p-4">
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm">
                        {isExpanded ? item.ementa : preview || item.ementa.substring(0, 100) + '...'}
                      </p>
                      {preview && preview !== item.ementa && (
                        <button
                          className="mt-2 text-primary hover:underline"
                          onClick={() => toggleExpand(item.id)}
                        >
                          {isExpanded ? 'Ver menos' : 'Ver mais'}
                        </button>
                      )}
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum resultado STJ.</p>
            )}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Dicas de Pesquisa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Use termos específicos para resultados mais precisos.</li>
              <li>Inclua números de processo no formato CNJ (sem pontuação).</li>
              <li>Para classes processuais, use termos como “Habeas Corpus”.</li>
              <li>Se a API não retornar nada, as ementas padrão já estarão visíveis.</li>
            </ul>
          </CardContent>
        </Card>

        <div className="mt-6">
          <Link to="/juridico" className="text-primary hover:underline">
            &larr; Voltar ao Módulo Jurídico
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Jurisprudencia;
