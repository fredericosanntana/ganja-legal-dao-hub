
// Temporary mock implementation - would connect to backend in production
import { User } from "@/types/auth";

// Store user in localStorage for persistence
const STORAGE_KEY = "ganjadao_user";

// Mock database
let users: User[] = [
  {
    id: 1,
    username: "admin",
    email: "admin@ganjadao.org",
    password: "Admin123", // In real app, this would be hashed
    is_admin: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subscription: {
      id: 1,
      user_id: 1,
      status: "active",
      started_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    vote_credits: {
      id: 1,
      user_id: 1,
      total_credits: 100,
      updated_at: new Date().toISOString(),
    },
    votes: []
  }
];

// Try to load users from localStorage
try {
  const storedUsers = localStorage.getItem("ganjadao_users");
  if (storedUsers) {
    users = JSON.parse(storedUsers);
  } else {
    // First run - save the initial users
    localStorage.setItem("ganjadao_users", JSON.stringify(users));
  }
} catch (error) {
  console.error("Error loading users from localStorage:", error);
}

// Helper to save users to localStorage
const saveUsers = () => {
  try {
    localStorage.setItem("ganjadao_users", JSON.stringify(users));
  } catch (error) {
    console.error("Error saving users to localStorage:", error);
  }
};

// Helper to save current user to localStorage
const saveCurrentUser = (user: User | null) => {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error saving current user to localStorage:", error);
  }
};

// Register a new user
export const register = async (username: string, email: string, password: string): Promise<boolean> => {
  // Check if username or email already exists
  if (users.some(u => u.username === username || u.email === email)) {
    return false;
  }

  // Create new user
  const newUser: User = {
    id: users.length + 1,
    username,
    email,
    password, // In real app, this would be hashed
    is_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vote_credits: {
      id: users.length + 1,
      user_id: users.length + 1,
      total_credits: 100, // Initial credits
      updated_at: new Date().toISOString(),
    },
    votes: []
  };

  // Add user to "database"
  users.push(newUser);
  saveUsers();
  
  return true;
};

// Login user
export const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
  // Find user by username or email
  const user = users.find(
    u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );

  if (user) {
    // Clone user object to avoid reference issues
    const userClone = JSON.parse(JSON.stringify(user));
    
    // Remove password for security
    delete userClone.password;
    
    // Save user to localStorage
    saveCurrentUser(userClone);
    return true;
  }
  
  return false;
};

// Logout user
export const logout = async (): Promise<void> => {
  saveCurrentUser(null);
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const userData = localStorage.getItem(STORAGE_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error getting current user from localStorage:", error);
  }
  
  return null;
};

// Update user credits (after voting)
export const updateUserCredits = async (userId: number, newCredits: number): Promise<boolean> => {
  // Update in local storage for current user if it's them
  try {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      if (currentUser.vote_credits) {
        currentUser.vote_credits.total_credits = newCredits;
        currentUser.vote_credits.updated_at = new Date().toISOString();
        saveCurrentUser(currentUser);
      }
    }

    // Update in the "database"
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      if (users[userIndex].vote_credits) {
        users[userIndex].vote_credits.total_credits = newCredits;
        users[userIndex].vote_credits.updated_at = new Date().toISOString();
        saveUsers();
      }
      return true;
    }
  } catch (error) {
    console.error("Error updating user credits:", error);
  }
  
  return false;
};

// Update user votes
export const updateUserVotes = async (userId: number, votes: any[]): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      currentUser.votes = votes;
      saveCurrentUser(currentUser);
    }

    // Update in the "database"
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].votes = votes;
      saveUsers();
      return true;
    }
  } catch (error) {
    console.error("Error updating user votes:", error);
  }
  
  return false;
};
