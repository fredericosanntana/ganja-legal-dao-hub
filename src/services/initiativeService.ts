
// Temporary mock implementation - would connect to backend in production
import { getCurrentUser } from './authService';
import { Initiative, Vote } from '@/types/initiatives';

// Initialize with some sample initiatives
let initiatives: Initiative[] = [
  {
    id: "1",
    title: "Criação de Guia de Cultivo Seguro",
    description: "Proposta para desenvolver um guia abrangente sobre cultivo seguro para fins medicinais, incluindo orientações legais e técnicas para cultivadores.",
    user_id: 1,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    votes: [],
    author: {
      id: 1,
      username: "admin"
    }
  },
  {
    id: "2",
    title: "Campanha de Conscientização Pública",
    description: "Iniciativa para criar materiais informativos e educacionais sobre cannabis medicinal e direitos dos pacientes para distribuição em hospitais e postos de saúde.",
    user_id: 1,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    votes: [],
    author: {
      id: 1,
      username: "admin"
    }
  }
];

// Try to load initiatives from localStorage
try {
  const storedInitiatives = localStorage.getItem("ganjadao_initiatives");
  if (storedInitiatives) {
    initiatives = JSON.parse(storedInitiatives);
  } else {
    // First run - save the initial initiatives
    localStorage.setItem("ganjadao_initiatives", JSON.stringify(initiatives));
  }
} catch (error) {
  console.error("Error loading initiatives from localStorage:", error);
}

// Helper to save initiatives to localStorage
const saveInitiatives = () => {
  try {
    localStorage.setItem("ganjadao_initiatives", JSON.stringify(initiatives));
  } catch (error) {
    console.error("Error saving initiatives to localStorage:", error);
  }
};

// Get all initiatives
export const getAllInitiatives = async (): Promise<Initiative[]> => {
  return initiatives;
};

// Get initiative by ID
export const getInitiativeById = async (id: string): Promise<Initiative | null> => {
  const initiative = initiatives.find(i => i.id === id);
  return initiative || null;
};

// Create a new initiative
export const createInitiative = async (title: string, description: string): Promise<Initiative | null> => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("User must be logged in to create an initiative");
  }
  
  if (!user.subscription) {
    throw new Error("User must have a subscription to create an initiative");
  }
  
  const newInitiative: Initiative = {
    id: String(Date.now()),
    title,
    description,
    user_id: user.id,
    status: "open",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    votes: [],
    author: {
      id: user.id,
      username: user.username
    }
  };
  
  initiatives.push(newInitiative);
  saveInitiatives();
  
  return newInitiative;
};

// Vote on an initiative
export const voteOnInitiative = async (initiativeId: string, creditsSpent: number): Promise<Vote | null> => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("User must be logged in to vote");
  }
  
  if (!user.subscription) {
    throw new Error("User must have a subscription to vote");
  }
  
  // Check if user has enough credits
  if (!user.vote_credits || user.vote_credits.total_credits < creditsSpent) {
    throw new Error("Not enough vote credits");
  }
  
  // Check if initiative exists and is open
  const initiativeIndex = initiatives.findIndex(i => i.id === initiativeId);
  if (initiativeIndex === -1 || initiatives[initiativeIndex].status !== "open") {
    throw new Error("Initiative not found or not open for voting");
  }
  
  // Check if user has already voted on this initiative
  const existingVoteIndex = user.votes?.findIndex(v => v.initiative_id === initiativeId);
  if (existingVoteIndex !== -1 && existingVoteIndex !== undefined) {
    throw new Error("User has already voted on this initiative");
  }
  
  // Create the vote
  const newVote: Vote = {
    id: String(Date.now()),
    user_id: user.id,
    initiative_id: initiativeId,
    credits_spent: creditsSpent,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    initiative: {
      id: initiativeId,
      title: initiatives[initiativeIndex].title
    }
  };
  
  // Add vote to initiative
  initiatives[initiativeIndex].votes = [...(initiatives[initiativeIndex].votes || []), newVote];
  saveInitiatives();
  
  // Add vote to user's votes and update credits
  const updatedVotes = [...(user.votes || []), newVote];
  user.votes = updatedVotes;
  
  if (user.vote_credits) {
    user.vote_credits.total_credits -= creditsSpent;
  }
  
  // Save updated user to localStorage
  localStorage.setItem("ganjadao_user", JSON.stringify(user));
  
  return newVote;
};

// Remove vote from initiative
export const removeVoteFromInitiative = async (initiativeId: string): Promise<boolean> => {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("User must be logged in to remove vote");
  }
  
  // Find user's vote on this initiative
  const voteIndex = user.votes?.findIndex(v => v.initiative_id === initiativeId);
  if (voteIndex === undefined || voteIndex === -1) {
    throw new Error("User has not voted on this initiative");
  }
  
  // Get the vote details
  const vote = user.votes?.[voteIndex];
  if (!vote) {
    throw new Error("Vote not found");
  }
  
  // Find the initiative
  const initiativeIndex = initiatives.findIndex(i => i.id === initiativeId);
  if (initiativeIndex === -1) {
    throw new Error("Initiative not found");
  }
  
  // Remove vote from initiative
  initiatives[initiativeIndex].votes = initiatives[initiativeIndex].votes.filter(
    v => !(v.user_id === user.id)
  );
  saveInitiatives();
  
  // Remove vote from user and refund credits
  user.votes = user.votes.filter(v => v.initiative_id !== initiativeId);
  
  if (user.vote_credits) {
    user.vote_credits.total_credits += vote.credits_spent;
  }
  
  // Save updated user to localStorage
  localStorage.setItem("ganjadao_user", JSON.stringify(user));
  
  return true;
};
