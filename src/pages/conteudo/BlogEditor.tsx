import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { createAuthServicePost } from '../../services/authService'; // Importando a nova função

const BlogEditor: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Se não estiver carregando e não houver usuário logado, redireciona ou mostra acesso negado.
    if (!loading && !user) {
        // A lógica de acesso negado já está no return.
        // Se preferir redirecionar, pode fazer aqui: navigate('/login'); ou navigate('/conteudo');
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (published: boolean) => {
    // Agora, apenas verifica se o usuário está logado (user.id existe)
    if (!user?.id) { 
      alert('Acesso negado. Você precisa estar logado para criar posts.');
      return;
    }
    setIsSubmitting(true);
    try {
      const postData = {
        title,
        content,
        published,
        userId: user.id, // Adiciona o userId do usuário logado
      };
      
      const newPost = await createAuthServicePost(postData);

      if (newPost) {
        alert(`Artigo ${published ? 'publicado' : 'salvo como rascunho'} com sucesso! (ID: ${newPost.id})`);
        setTitle('');
        setContent('');
        // Opcional: redirecionar para a lista de posts ou para o post criado
        // navigate('/conteudo'); 
      } else {
        alert(`Erro ao ${published ? 'publicar' : 'salvar rascunho'}. Verifique o console para mais detalhes.`);
      }
    } catch (error) {
      console.error('Erro ao submeter o post via authService:', error);
      alert('Ocorreu um erro ao tentar salvar o post. Tente novamente.');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Carregando informações do usuário...</div>;
  }

  // Se não estiver carregando e não houver usuário logado
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Acesso Negado</h1>
        <p className="text-slate-700">Você precisa estar logado para acessar esta página.</p>
        <button 
          onClick={() => navigate('/clube/login')} // Redireciona para a página de login
          className="mt-6 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out"
        >
          Ir para Login
        </button>
      </div>
    );
  }

  // Se chegou aqui, o usuário está logado (não necessariamente admin)
  return (
    <div className="container mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
      <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">Editor de Artigos do Blog</h1>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6 bg-white p-6 md:p-8 rounded-xl shadow-2xl">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Digite o título do artigo"
            className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm placeholder-slate-400"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">
            Corpo do Artigo (Markdown)
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={15}
            placeholder="Escreva seu artigo aqui usando Markdown...\n\nPor exemplo:\n# Cabeçalho Principal\n## Sub-cabeçalho\n\n- Item de lista 1\n- Item de lista 2\n\n**Texto em negrito** e *texto em itálico*.\n\[Link para GanjaDAO](https://ganjadao.com.br)"
            className="mt-1 block w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm placeholder-slate-400 resize-y"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting || !title || !content}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-slate-700 bg-slate-200 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Rascunho'}
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting || !title || !content}
            className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition ease-in-out duration-150"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar Artigo'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BlogEditor;

