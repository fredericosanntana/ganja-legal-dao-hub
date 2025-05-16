
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PostData {
  title: string;
  content: string;
  published: boolean;
  userId: number;
}

export const createAuthServicePost = async (postData: PostData) => {
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
