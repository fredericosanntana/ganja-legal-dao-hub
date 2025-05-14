
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { POST_CATEGORIES } from "@/types/forum";
import { useCreatePost } from "@/hooks/use-forum";
import { useAuth } from "@/hooks/use-auth";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "O título deve ter pelo menos 5 caracteres",
  }).max(100, {
    message: "O título não pode ter mais de 100 caracteres",
  }),
  content: z.string().min(10, {
    message: "O conteúdo deve ter pelo menos 10 caracteres",
  }),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreatePostForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mutate: createPost, isPending } = useCreatePost();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "geral",
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!user) {
      return;
    }

    createPost({
      title: values.title,
      content: values.content,
      category: values.category,
      user_id: user.id,
    }, {
      onSuccess: () => {
        navigate("/clube/comunidade");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Digite um título para o seu post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {POST_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Compartilhe seus pensamentos..." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="button" variant="outline" className="mr-2" onClick={() => navigate("/clube/comunidade")}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Publicando..." : (
              <>
                <Send className="mr-2 h-4 w-4" /> Publicar
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreatePostForm;
