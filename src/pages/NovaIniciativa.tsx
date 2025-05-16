import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInitiative } from "@/services/initiativeService";

const NovaIniciativa = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const newInitiative = await createInitiative(title, description);
      if (newInitiative) {
        toast.success('Iniciativa criada com sucesso!');
        navigate('/clube/iniciativas');
      } else {
        toast.error('Falha ao criar iniciativa.');
      }
    } catch (error) {
      console.error("Create initiative error:", error);
      toast.error("Erro ao criar iniciativa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Nova Iniciativa</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Título:</Label>
              <Input
                type="text"
                id="title"
                placeholder="Título da iniciativa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição:</Label>
              <Textarea
                id="description"
                placeholder="Descrição detalhada da iniciativa"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Criando..." : "Criar Iniciativa"}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default NovaIniciativa;
