
import { supabase } from '@/integrations/supabase/client';
import type { Initiative, InitiativeStatus } from '@/types/initiatives';
import { toast } from 'sonner';

// Mock data for initiatives
const mockInitiatives: Initiative[] = [
  {
    id: '1',
    title: 'Expansão do Suporte Jurídico para Casos de Apreensão',
    description: 'Atualmente, nosso foco principal é o HC preventivo. Esta proposta visa desenvolver e implementar um novo módulo de suporte jurídico focado em auxiliar cultivadores que, infelizmente, já enfrentaram uma apreensão de suas plantas ou produtos. Isso incluiria a criação de modelos de defesa, orientação sobre como proceder legalmente após uma apreensão, e a facilitação do contato com advogados especializados em casos de defesa criminal relacionados ao cultivo. O objetivo é não deixar desamparado quem já está enfrentando um processo. Impacto Potencial: Aumentaria significativamente o escopo de proteção da GanjaDAO, oferecendo amparo em um momento crítico e de grande vulnerabilidade para os cultivadores. Poderia ajudar a reverter situações injustas e a garantir que os direitos dos pacientes sejam respeitados mesmo após uma intercorrência legal. Recursos Necessários: Desenvolvimento de nova plataforma/módulo, contratação ou parceria com mais advogados criminalistas, criação de material informativo específico.',
    status: 'open',
    created_at: '2023-04-10T10:00:00Z',
    updated_at: '2023-04-10T10:00:00Z',
    user_id: '1',
    author: {
      id: '1',
      username: 'joaosilva',
    },
    votes: []
  },
  {
    id: '2',
    title: 'Lançamento de uma Plataforma Educacional sobre Cultivo e Legislação (GanjaDAO Educa)',
    description: 'Esta proposta foca na criação de uma plataforma educacional robusta, a "GanjaDAO Educa". O objetivo é oferecer cursos, workshops, webinars, artigos e guias detalhados sobre todos os aspectos do cultivo de cannabis (desde o básico até técnicas avançadas, cultivo orgânico, extração de óleos, etc.) e, crucialmente, sobre a legislação brasileira, direitos dos pacientes, como montar uma documentação médica forte, e como se preparar para um pedido de HC. O conteúdo seria produzido por especialistas e acessível de forma gratuita ou a baixo custo para membros da DAO. Impacto Potencial: Empoderaria os cultivadores com conhecimento técnico e jurídico, aumentando a qualidade dos cultivos, a segurança dos pacientes e a capacidade da comunidade de se autodefender e de advogar pela causa. A informação é uma ferramenta poderosa de transformação. Recursos Necessários: Desenvolvimento da plataforma EAD, produção de conteúdo multimídia, parcerias com educadores e especialistas, equipe de moderação e suporte.' ,
    status: 'open',
    created_at: '2023-04-15T14:30:00Z',
    updated_at: '2023-04-15T14:30:00Z',
    user_id: '2',
    author: {
      id: '2',
      username: 'mariaoliver',
    },
    votes: []
  },
  {
    id: '3',
    title: 'Desenvolvimento de Ferramentas para Associações de Pacientes',
    description: 'Muitas associações de pacientes de cannabis medicinal realizam um trabalho incrível, mas frequentemente carecem de ferramentas de gestão, comunicação e captação de recursos. Esta proposta visa desenvolver um conjunto de soluções tecnológicas (software como serviço - SaaS) especificamente para essas associações. Poderia incluir ferramentas para gestão de associados, comunicação interna, organização de eventos, campanhas de doação, e até mesmo um módulo simplificado para auxiliar as associações a orientarem seus membros sobre a busca por HCs, em parceria com a GanjaDAO. Impacto Potencial: Fortaleceria o ecossistema de associações, que são pilares fundamentais no apoio aos pacientes e na luta pela regulamentação. Ao otimizar a gestão dessas organizações, permitiríamos que elas focassem mais em sua missão principal e ampliassem seu alcance e impacto. Recursos Necessários: Pesquisa de necessidades das associações, desenvolvimento de software customizado, equipe de suporte técnico e treinamento para as associações.',
    status: 'open',
    created_at: '2023-04-15T14:30:00Z',
    updated_at: '2023-04-15T14:30:00Z',
    user_id: '2',
    author: {
      id: '2',
      username: 'mariaoliver',
    },
    votes: []
  }
];

export const getInitiatives = async (): Promise<Initiative[]> => {
  // Using mock data for now
  const useMockData = true;
  
  if (useMockData) {
    return Promise.resolve(mockInitiatives);
  }

  try {
    const { data, error } = await supabase
      .from('initiatives')
      .select(`
        *,
        author: user_id (id, username),
        votes (*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching initiatives:', error);
      return [];
    }

    return data as unknown as Initiative[];
  } catch (error) {
    console.error('Exception fetching initiatives:', error);
    return [];
  }
};

export const getInitiativeById = async (id: string): Promise<Initiative | null> => {
  // Using mock data for now
  const useMockData = true;
  
  if (useMockData) {
    const initiative = mockInitiatives.find(i => i.id === id);
    return initiative ? Promise.resolve(initiative) : Promise.resolve(null);
  }

  try {
    const { data, error } = await supabase
      .from('initiatives')
      .select(`
        *,
        author: user_id (id, username),
        votes (*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching initiative:', error);
      return null;
    }

    return data as unknown as Initiative;
  } catch (error) {
    console.error('Exception fetching initiative:', error);
    return null;
  }
};

export const createInitiative = async (title: string, description: string): Promise<Initiative | null> => {
  // Using mock data for now
  const useMockData = true;
  
  if (useMockData) {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error('Você precisa estar logado para criar uma iniciativa');
      return null;
    }
    
    const newId = (mockInitiatives.length + 1).toString();
    const newInitiative: Initiative = {
      id: newId,
      title,
      description,
      status: 'open',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user_id: user.data.user.id,
      author: {
        id: user.data.user.id,
        username: 'current_user'
      },
      votes: []
    };
    
    mockInitiatives.push(newInitiative);
    return Promise.resolve(newInitiative);
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast.error('Você precisa estar logado para criar uma iniciativa');
      return null;
    }

    const { data, error } = await supabase
      .from('initiatives')
      .insert({
        title,
        description,
        user_id: userData.user.id,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating initiative:', error);
      toast.error('Falha ao criar iniciativa');
      return null;
    }

    // Return the created initiative
    return {
      ...data,
      author: {
        id: userData.user.id,
        username: 'current_user'
      },
      votes: []
    } as Initiative;
  } catch (error) {
    console.error('Exception creating initiative:', error);
    toast.error('Erro ao criar iniciativa');
    return null;
  }
};

export const voteOnInitiative = async (
  initiativeId: string, 
  creditsToSpend: number
): Promise<boolean> => {
  // Using mock data for now
  const useMockData = true;
  
  if (useMockData) {
    // In mock mode, just simulate a successful vote
    return true;
  }

  try {
    const { data: userData } = await supabase.auth.getUser();
    
    if (!userData.user) {
      toast.error('Você precisa estar logado para votar');
      return false;
    }

    // Check user's available credits
    const { data: userCredits, error: creditsError } = await supabase
      .from('user_vote_credits')
      .select('total_credits')
      .eq('user_id', userData.user.id)
      .single();

    if (creditsError || !userCredits) {
      console.error('Error fetching user credits:', creditsError);
      toast.error('Falha ao verificar seus créditos disponíveis');
      return false;
    }

    if (userCredits.total_credits < creditsToSpend) {
      toast.error('Você não tem créditos suficientes para este voto');
      return false;
    }

    // Begin transaction
    // 1. Create the vote
    const { error: voteError } = await supabase
      .from('votes')
      .upsert(
        {
          user_id: userData.user.id,
          initiative_id: initiativeId,
          credits_spent: creditsToSpend
        },
        { onConflict: 'user_id,initiative_id' }
      );

    if (voteError) {
      console.error('Error creating vote:', voteError);
      toast.error('Falha ao registrar seu voto');
      return false;
    }

    // 2. Update user's credits
    const { error: updateError } = await supabase
      .from('user_vote_credits')
      .update({ total_credits: userCredits.total_credits - creditsToSpend })
      .eq('user_id', userData.user.id);

    if (updateError) {
      console.error('Error updating user credits:', updateError);
      toast.error('Falha ao atualizar seus créditos');
      return false;
    }

    toast.success('Voto registrado com sucesso!');
    return true;
  } catch (error) {
    console.error('Exception in voting process:', error);
    toast.error('Erro ao processar seu voto');
    return false;
  }
};
