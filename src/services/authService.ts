
// Temporary mock implementation - would connect to backend in production
import { User } from "@/types/auth";
// Import Post interface, assuming it's relevant for the structure
import { Post } from "@/types/forum"; // Or define a local Post interface if preferred

// Store user in localStorage for persistence
const USER_STORAGE_KEY = "ganjadao_user";
const POSTS_STORAGE_KEY = "ganjadao_posts"; // Key for storing posts

// Mock user database
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
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Error saving current user to localStorage:", error);
  }
};

// Register a new user
export const register = async (username: string, email: string, password: string): Promise<boolean> => {
  if (users.some(u => u.username === username || u.email === email)) {
    return false;
  }
  const newUser: User = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username,
    email,
    password,
    is_admin: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    vote_credits: {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1, // Ensure unique ID for vote_credits
      user_id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      total_credits: 100,
      updated_at: new Date().toISOString(),
    },
    votes: []
  };
  users.push(newUser);
  saveUsers();
  return true;
};

// Login user
export const login = async (usernameOrEmail: string, password: string): Promise<boolean> => {
  const user = users.find(
    u => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password
  );
  if (user) {
    const userClone = JSON.parse(JSON.stringify(user));
    delete userClone.password;
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
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Error getting current user from localStorage:", error);
  }
  return null;
};

// Update user credits
export const updateUserCredits = async (userId: number, newCredits: number): Promise<boolean> => {
  try {
    const currentUser = await getCurrentUser();
    if (currentUser && currentUser.id === userId && currentUser.vote_credits) {
      currentUser.vote_credits.total_credits = newCredits;
      currentUser.vote_credits.updated_at = new Date().toISOString();
      saveCurrentUser(currentUser);
    }
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1 && users[userIndex].vote_credits) {
      users[userIndex].vote_credits!.total_credits = newCredits;
      users[userIndex].vote_credits!.updated_at = new Date().toISOString();
      saveUsers();
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

// Define a type for the post data to be created, similar to forum.ts Post but simpler for this context
interface AuthServicePostInput {
  title: string;
  content: string;
  published: boolean;
  userId: number; // Or use user_id to match forum.ts
}

// Define the structure of a post stored by authService
// Re-using Post from forum.ts might be good if it fits, or define a specific one here.
// For simplicity, let's define a structure based on what BlogEditor will send + metadata.
export interface AuthServicePost extends AuthServicePostInput {
  id: number;
  createdAt: string;
  updatedAt: string;
  // category?: string; // Add if you want category selection in BlogEditor
}

// Function to create and store a post using localStorage
export const createAuthServicePost = async (postData: AuthServicePostInput): Promise<AuthServicePost | null> => {
  try {
    const currentUser = await getCurrentUser();
    // Теперь любой залогиненный пользователь может создавать посты
    if (!currentUser) {
      console.error("User is not logged in.");
      return null; // Or throw an error
    }

    let posts: AuthServicePost[] = [];
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      posts = JSON.parse(storedPosts);
    }

    const newPost: AuthServicePost = {
      ...postData,
      id: posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1,
      userId: currentUser.id, // Ensure the post is associated with the logged-in user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    posts.push(newPost);
    localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    return newPost;
  } catch (error) {
    console.error("Error creating post in authService:", error);
    return null; // Or throw the error
  }
};

// Optional: Function to get all posts (if needed for display elsewhere)
export const getAllAuthServicePosts = async (): Promise<AuthServicePost[]> => {
  try {
    const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
    if (storedPosts) {
      return JSON.parse(storedPosts);
    }
    return [];
  } catch (error) {
    console.error("Error fetching posts from authService:", error);
    return [];
  }
};

