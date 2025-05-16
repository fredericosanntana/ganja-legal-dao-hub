
import { supabase } from '@/integrations/supabase/client';
import type { Initiative, InitiativeStatus } from '@/types/initiatives';
import { toast } from 'sonner';

// Mock data for initiatives
const mockInitiatives: Initiative[] = [
  {
    id: '1',
    title: 'Regulamentação da Cannabis Medicinal',
    description: 'Proposta para a regulamentação completa da cannabis medicinal no Brasil.',
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
    title: 'Programa de Educação sobre Cannabis',
    description: 'Iniciativa para criar um programa educacional sobre os benefícios e riscos da cannabis.',
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
