
// Temporary mock implementation - would connect to backend in production
import { supabase } from '@/integrations/supabase/client';
import { Initiative, Vote } from '@/types/initiatives';
import { toast } from 'sonner';

// Get all initiatives
export const getAllInitiatives = async (): Promise<Initiative[]> => {
  try {
    const { data, error } = await supabase
      .from('initiatives')
      .select(`
        *,
        author:users(id, username),
        votes(*)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching initiatives:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception fetching initiatives:', error);
    return [];
  }
};

// Get initiative by ID
export const getInitiativeById = async (id: string): Promise<Initiative | null> => {
  try {
    const { data, error } = await supabase
      .from('initiatives')
      .select(`
        *,
        author:users(id, username),
        votes(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching initiative:', error);
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error('Exception fetching initiative:', error);
    return null;
  }
};

// Create a new initiative
export const createInitiative = async (title: string, description: string): Promise<Initiative | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('User must be logged in to create an initiative');
      return null;
    }
    
    // Check if user has a subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (subError || !subscription) {
      toast.error('User must have a subscription to create an initiative');
      return null;
    }
    
    const { data, error } = await supabase
      .from('initiatives')
      .insert([
        {
          title,
          description,
          user_id: user.id,
          status: 'open'
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating initiative:', error);
      toast.error('Failed to create initiative: ' + error.message);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception creating initiative:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Vote on an initiative
export const voteOnInitiative = async (initiativeId: string, creditsSpent: number): Promise<Vote | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('User must be logged in to vote');
      return null;
    }
    
    // Check if user has a subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (subError || !subscription) {
      toast.error('User must have a subscription to vote');
      return null;
    }
    
    // Check if user has enough credits
    const { data: userVoteCredits, error: creditError } = await supabase
      .from('user_vote_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (creditError) {
      console.error('Error checking vote credits:', creditError);
      toast.error('Failed to check vote credits');
      return null;
    }
    
    if (!userVoteCredits || userVoteCredits.total_credits < creditsSpent) {
      toast.error('Not enough vote credits');
      return null;
    }
    
    // Check if initiative exists and is open
    const { data: initiative, error: initiativeError } = await supabase
      .from('initiatives')
      .select('*')
      .eq('id', initiativeId)
      .eq('status', 'open')
      .single();
    
    if (initiativeError || !initiative) {
      toast.error('Initiative not found or not open for voting');
      return null;
    }
    
    // Check if user has already voted on this initiative
    const { data: existingVote, error: voteError } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('initiative_id', initiativeId);
    
    if (!voteError && existingVote && existingVote.length > 0) {
      toast.error('User has already voted on this initiative');
      return null;
    }
    
    // Create the vote
    const { data: newVote, error } = await supabase
      .from('votes')
      .insert([
        {
          user_id: user.id,
          initiative_id: initiativeId,
          credits_spent: creditsSpent
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating vote:', error);
      toast.error('Failed to create vote: ' + error.message);
      return null;
    }
    
    // Update user's vote credits
    const { error: updateError } = await supabase
      .from('user_vote_credits')
      .update({ total_credits: userVoteCredits.total_credits - creditsSpent })
      .eq('user_id', user.id);
    
    if (updateError) {
      console.error('Error updating vote credits:', updateError);
      toast.error('Vote created but failed to update credits');
    }
    
    return newVote;
  } catch (error) {
    console.error('Exception creating vote:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Remove vote from initiative
export const removeVoteFromInitiative = async (initiativeId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('User must be logged in to remove vote');
      return false;
    }
    
    // Find user's vote on this initiative
    const { data: vote, error: voteError } = await supabase
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('initiative_id', initiativeId)
      .single();
    
    if (voteError || !vote) {
      toast.error('User has not voted on this initiative');
      return false;
    }
    
    // Remove vote from initiative
    const { error } = await supabase
      .from('votes')
      .delete()
      .eq('id', vote.id);
    
    if (error) {
      console.error('Error removing vote:', error);
      toast.error('Failed to remove vote: ' + error.message);
      return false;
    }
    
    // Refund credits to user
    const { data: userVoteCredits, error: creditError } = await supabase
      .from('user_vote_credits')
      .select('*')
      .eq('user_id', user.id)
      .single();
    
    if (!creditError && userVoteCredits) {
      const { error: updateError } = await supabase
        .from('user_vote_credits')
        .update({ total_credits: userVoteCredits.total_credits + vote.credits_spent })
        .eq('user_id', user.id);
      
      if (updateError) {
        console.error('Error updating vote credits:', updateError);
        toast.error('Vote removed but failed to refund credits');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Exception removing vote:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};
