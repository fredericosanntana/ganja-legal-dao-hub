
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Initiative, InitiativeStatus } from '@/types/initiatives';

// Get all initiatives
export const getAllInitiatives = async (): Promise<Initiative[]> => {
  try {
    const { data, error } = await supabase
      .from('initiatives')
      .select(`
        *,
        author:user_id(id, username),
        votes(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching initiatives:', error);
      toast.error('Failed to fetch initiatives');
      return [];
    }

    // Convert the data to match our Initiative type
    const initiatives: Initiative[] = data.map(item => ({
      id: item.id,
      title: item.title,
      description: item.description,
      user_id: item.user_id,
      status: item.status as InitiativeStatus, // Cast to our enum type
      created_at: item.created_at,
      updated_at: item.updated_at,
      author: item.author,
      votes: item.votes || []
    }));

    return initiatives;
  } catch (error) {
    console.error('Exception fetching initiatives:', error);
    toast.error('An unexpected error occurred');
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
        author:user_id(id, username),
        votes(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching initiative:', error);
      toast.error('Failed to fetch initiative');
      return null;
    }

    // Convert the data to match our Initiative type
    const initiative: Initiative = {
      id: data.id,
      title: data.title,
      description: data.description,
      user_id: data.user_id,
      status: data.status as InitiativeStatus, // Cast to our enum type
      created_at: data.created_at,
      updated_at: data.updated_at,
      author: data.author,
      votes: data.votes || []
    };

    return initiative;
  } catch (error) {
    console.error('Exception fetching initiative:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Create initiative
export const createInitiative = async (title: string, description: string): Promise<Initiative | null> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      toast.error('You must be logged in to create an initiative');
      throw new Error('User not authenticated');
    }

    // Create the initiative
    const { data, error } = await supabase
      .from('initiatives')
      .insert({
        title,
        description,
        user_id: user.user.id,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating initiative:', error);
      toast.error('Failed to create initiative');
      throw error;
    }

    toast.success('Initiative created successfully!');
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      user_id: data.user_id,
      status: data.status as InitiativeStatus,
      created_at: data.created_at,
      updated_at: data.updated_at,
      votes: []
    };
  } catch (error) {
    console.error('Exception creating initiative:', error);
    throw error;
  }
};

// Vote on initiative
export const voteOnInitiative = async (initiativeId: string, creditsSpent: number) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      toast.error('You must be logged in to vote');
      throw new Error('User not authenticated');
    }

    // Add the vote
    const { error: voteError } = await supabase
      .from('votes')
      .insert({
        user_id: user.user.id,
        initiative_id: initiativeId,
        credits_spent: creditsSpent
      });

    if (voteError) {
      console.error('Error creating vote:', voteError);
      toast.error('Failed to record your vote');
      throw voteError;
    }

    // Update user's credits using a direct query
    const { data: userData, error: userError } = await supabase
      .from('user_vote_credits')
      .select('total_credits')
      .eq('user_id', user.user.id)
      .single();

    if (userError) {
      console.error('Error getting user credits:', userError);
      toast.error('Vote recorded but failed to update credits');
      return { success: true };
    }

    const currentCredits = userData?.total_credits || 0;
    const newCredits = Math.max(0, currentCredits - creditsSpent);

    const { error: creditError } = await supabase
      .from('user_vote_credits')
      .update({ total_credits: newCredits })
      .eq('user_id', user.user.id);

    if (creditError) {
      console.error('Error updating credits:', creditError);
      toast.error('Vote recorded but failed to update credits');
    }

    toast.success('Your vote has been recorded!');
    return { 
      success: true,
      votes: [{
        id: 'temp-id', // This would be replaced with the actual ID from the database
        user_id: user.user.id,
        initiative_id: initiativeId,
        credits_spent: creditsSpent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }] 
    };
  } catch (error) {
    console.error('Exception voting on initiative:', error);
    throw error;
  }
};

// Remove vote from initiative
export const removeVoteFromInitiative = async (initiativeId: string) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      toast.error('You must be logged in to manage votes');
      throw new Error('User not authenticated');
    }

    // Get the vote to determine credits spent
    const { data: voteData, error: fetchError } = await supabase
      .from('votes')
      .select('credits_spent')
      .eq('user_id', user.user.id)
      .eq('initiative_id', initiativeId)
      .single();

    if (fetchError) {
      console.error('Error fetching vote:', fetchError);
      toast.error('Failed to retrieve your vote information');
      throw fetchError;
    }

    const creditsToRefund = voteData?.credits_spent || 0;

    // Remove the vote
    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .eq('user_id', user.user.id)
      .eq('initiative_id', initiativeId);

    if (deleteError) {
      console.error('Error removing vote:', deleteError);
      toast.error('Failed to remove your vote');
      throw deleteError;
    }

    // Update user's credits if there were any to refund
    if (creditsToRefund > 0) {
      // Get current credits
      const { data: userData, error: userError } = await supabase
        .from('user_vote_credits')
        .select('total_credits')
        .eq('user_id', user.user.id)
        .single();

      if (userError) {
        console.error('Error getting user credits:', userError);
        toast.error('Vote removed but failed to refund credits');
        return { success: true };
      }
      
      const currentCredits = userData?.total_credits || 0;
      const newCredits = currentCredits + creditsToRefund;

      const { error: creditError } = await supabase
        .from('user_vote_credits')
        .update({ total_credits: newCredits })
        .eq('user_id', user.user.id);

      if (creditError) {
        console.error('Error updating credits:', creditError);
        toast.error('Vote removed but failed to refund credits');
      }
    }

    toast.success('Your vote has been removed and credits refunded');
    return { success: true };
  } catch (error) {
    console.error('Exception removing vote:', error);
    throw error;
  }
};
