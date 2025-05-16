import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useAuth } from "@/hooks/use-auth";
import { createAuthServicePost } from "@/services/authService";

const BlogEditor = () => {
  const [title, setTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [published, setPublished] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // React Quill modules and formats
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  const handleContentChange = (content: string) => {
    setEditorContent(content);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    
    try {
      if (!user?.id) {
        toast.error("Você precisa estar logado para criar um artigo");
        return;
      }
      
      const result = await createAuthServicePost({
        title,
        content: editorContent,
        published: published,
        userId: user.id
      });
      
      if (result) {
        toast.success("Artigo salvo com sucesso!");
        // Redirect to content page after successful save
        navigate("/conteudo");
      }
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Erro ao salvar o artigo");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Editor de Artigos</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título do Artigo</Label>
            <Input
              type="text"
              id="title"
              placeholder="Digite o título do artigo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <Label>Conteúdo do Artigo</Label>
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="published">Publicar</Label>
            <Switch
              id="published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked)}
            />
          </div>

          <div>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar Artigo"}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default BlogEditor;
