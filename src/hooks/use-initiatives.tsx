
import { useState, useEffect, useCallback } from "react";
import { Initiative } from "@/types/initiatives";
import { getAllInitiatives, getInitiativeById, voteOnInitiative, removeVoteFromInitiative } from "@/services/initiativeService";
import { useAuth } from "./use-auth";

// Hook for getting all initiatives
export const useInitiatives = () => {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { refreshUser } = useAuth();

  useEffect(() => {
    const fetchInitiatives = async () => {
      setIsLoading(true);
      try {
        const data = await getAllInitiatives();
        setInitiatives(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch initiatives"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitiatives();
  }, []);

  return { initiatives, isLoading, error };
};

// Hook for getting a single initiative and voting on it
export const useInitiative = (id: string | undefined) => {
  const [initiative, setInitiative] = useState<Initiative | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { refreshUser } = useAuth();

  useEffect(() => {
    const fetchInitiative = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getInitiativeById(id);
        setInitiative(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to fetch initiative"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitiative();
  }, [id]);

  const vote = useCallback(async (creditsSpent: number) => {
    if (!id) {
      throw new Error("Initiative ID is required");
    }

    try {
      await voteOnInitiative(id, creditsSpent);
      
      // Refresh the initiative data
      const updatedInitiative = await getInitiativeById(id);
      setInitiative(updatedInitiative);
      
      // Refresh user data to update credits
      await refreshUser();
      
      return true;
    } catch (err) {
      throw err;
    }
  }, [id, refreshUser]);

  const removeVote = useCallback(async () => {
    if (!id) {
      throw new Error("Initiative ID is required");
    }

    try {
      await removeVoteFromInitiative(id);
      
      // Refresh the initiative data
      const updatedInitiative = await getInitiativeById(id);
      setInitiative(updatedInitiative);
      
      // Refresh user data to update credits
      await refreshUser();
      
      return true;
    } catch (err) {
      throw err;
    }
  }, [id, refreshUser]);

  return { initiative, isLoading, error, vote, removeVote };
};
