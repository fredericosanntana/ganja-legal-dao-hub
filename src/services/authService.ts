
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Define the AuthServicePost type for dynamic posts
export interface AuthServicePost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  author_id?: string;
  category?: string;
}

// Get all posts from the contents table
export const getAllAuthServicePosts = async (): Promise<AuthServicePost[]> => {
  try {
    const { data, error } = await supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      toast.error('Failed to fetch posts');
      return [];
    }

    // Map the database results to the AuthServicePost type
    const posts: AuthServicePost[] = data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.body,
      published: true, // All posts from the database are considered published
      createdAt: post.created_at,
      author_id: post.author_id,
      category: post.category
    }));

    return posts;
  } catch (error) {
    console.error('Exception fetching posts:', error);
    toast.error('An unexpected error occurred');
    return [];
  }
};

// New function to update the user trigger function (to be called on app initialization)
export const updateUserTriggerFunction = async () => {
  try {
    // Call the edge function to update the trigger
    const { data, error } = await supabase.functions.invoke('update-user-trigger');
    
    if (error) {
      console.error('Error updating user trigger:', error);
      return false;
    }
    
    return data.success;
  } catch (error) {
    console.error('Exception updating user trigger:', error);
    return false;
  }
};

// New function to create a post with authenticated user
export const createAuthServicePost = async (postData: {
  title: string;
  content: string;
  published: boolean;
  userId: string;
}) => {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user) {
      toast.error('Authentication failed. Please login again.');
      return null;
    }

    const { data, error } = await supabase
      .from('contents')
      .insert([
        {
          title: postData.title,
          body: postData.content,
          slug: createSlugFromTitle(postData.title),
          author_id: user.user?.id,
          category: 'blog' // Default category
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post: ' + error.message);
      return null;
    }

    toast.success('Post created successfully!');
    return data;
  } catch (error) {
    console.error('Exception creating post:', error);
    toast.error('An unexpected error occurred');
    return null;
  }
};

// Helper function to create a URL-friendly slug from a post title
function createSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove consecutive hyphens
    .trim(); // Remove whitespace from both ends
}
