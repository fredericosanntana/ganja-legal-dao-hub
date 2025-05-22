
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const voteOnInitiative = async (
  initiativeId: string, 
  creditsToSpend: number
): Promise<boolean> => {
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

    // Calculate voting intensity (square root of credits)
    const intensity = Math.sqrt(creditsToSpend);

    // Create the vote
    const { error: voteError } = await supabase
      .from('votes')
      .upsert(
        {
          user_id: userData.user.id,
          initiative_id: initiativeId,
          credits_spent: creditsToSpend,
        },
        { onConflict: 'user_id,initiative_id' }
      );

    if (voteError) {
      console.error('Error creating vote:', voteError);
      toast.error('Falha ao registrar seu voto');
      return false;
    }

    // Update user's credits
    const { error: updateError } = await supabase
      .from('user_vote_credits')
      .update({ total_credits: userCredits.total_credits - creditsToSpend })
      .eq('user_id', userData.user.id);

    if (updateError) {
      console.error('Error updating user credits:', updateError);
      toast.error('Falha ao atualizar seus créditos');
      // Try to revert the vote since we couldn't update credits
      await supabase
        .from('votes')
        .delete()
        .eq('user_id', userData.user.id)
        .eq('initiative_id', initiativeId);
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
