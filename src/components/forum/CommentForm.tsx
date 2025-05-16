
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateComment } from "@/hooks/use-forum";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  content: z.string().min(1, {
    message: "O comentário não pode estar vazio",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CommentFormProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
}

const CommentForm = ({ postId, parentId, onSuccess }: CommentFormProps) => {
  const { user } = useAuth();
  const { mutate: createComment, isPending } = useCreateComment();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!user) {
      return;
    }

    createComment({
      content: values.content,
      post_id: postId,
      user_id: user.id,
      parent_id: parentId,
    }, {
      onSuccess: () => {
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Escreva um comentário..." 
                  className="min-h-[80px] resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Enviando..." : (
              <>
                <Send className="mr-2 h-4 w-4" /> Comentar
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
