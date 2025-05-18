
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Send, Bot, User, AlertTriangle, Clock } from "lucide-react";
import { toast } from "sonner";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatStats {
  used: number;
  limit: number;
  resetTime?: string;
}

const GanjaChat = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStats, setChatStats] = useState<ChatStats>({ used: 0, limit: 10 });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Você precisa estar logado para acessar o chat");
      navigate('/clube/login');
    } else {
      // Initialize with welcome message
      setMessages([
        {
          role: 'assistant',
          content: 'Olá! Sou o Ganja Chat, assistente jurídico para questões relacionadas ao cultivo de cannabis. Como posso ajudar você hoje?',
          timestamp: new Date()
        }
      ]);
      
      // Get current usage stats
      fetchChatStats();
    }
  }, [isAuthenticated, navigate]);
  
  const fetchChatStats = async () => {
    try {
      if (!user) return;
      
      const { data, error } = await supabase.functions.invoke('check-chat-limit', {
        body: { userId: user.id }
      });
      
      if (error) throw error;
      
      setChatStats({
        used: data.used,
        limit: data.limit,
        resetTime: data.resetTime
      });
      
    } catch (error) {
      console.error("Error fetching chat stats:", error);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !user) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setPrompt("");
    
    try {
      // Call the edge function that will handle rate limiting and n8n webhook
      const { data, error } = await supabase.functions.invoke('ganja-chat', {
        body: { 
          prompt, 
          userId: user.id 
        }
      });
      
      if (error) {
        if (error.message.includes('rate limit')) {
          throw new Error("Você atingiu o limite diário de perguntas. Volte amanhã!");
        }
        throw error;
      }
      
      // Update stats from response
      if (data?.stats) {
        setChatStats({
          used: data.stats.used,
          limit: data.stats.limit,
          resetTime: data.stats.resetTime
        });
      }
      
      // Add AI response to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data?.answer || "Desculpe, não consegui processar sua pergunta.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Erro ao obter resposta. Tente novamente.");
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: error.message || "Erro ao obter resposta. Tente novamente.",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isLimitReached = chatStats.used >= chatStats.limit;
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Ganja Chat - Assistente Jurídico</h1>
          <p className="text-muted-foreground">
            Tire suas dúvidas sobre aspectos jurídicos relacionados ao cultivo de cannabis.
          </p>
        </div>
        
        {/* Usage stats */}
        <div className={`mb-4 p-3 rounded-md border ${isLimitReached ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
          <div className="flex items-center gap-2">
            {isLimitReached ? (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            ) : (
              <Clock className="h-5 w-5 text-green-500" />
            )}
            <span className="font-medium">
              Interações: {chatStats.used}/{chatStats.limit} hoje
              {isLimitReached && " - Limite diário atingido"}
            </span>
          </div>
          {isLimitReached && chatStats.resetTime && (
            <p className="text-sm text-muted-foreground mt-1">
              O limite será restaurado à meia-noite (horário local).
            </p>
          )}
        </div>
        
        {/* Chat messages */}
        <div className="border rounded-lg mb-4 h-[60vh] overflow-y-auto bg-slate-50 p-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground ml-auto' 
                  : 'bg-secondary text-secondary-foreground mr-auto'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.role === 'user' ? (
                    <>
                      <span className="font-medium">Você</span>
                      <User className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <Bot className="h-4 w-4" />
                      <span className="font-medium">Ganja Chat</span>
                    </>
                  )}
                </div>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
          
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className="bg-secondary text-secondary-foreground rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4" />
                  <span className="font-medium">Ganja Chat</span>
                </div>
                <div className="mt-1">
                  <span className="inline-block animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={
              isLimitReached 
                ? "Você atingiu seu limite diário de perguntas" 
                : "Digite sua pergunta sobre aspectos jurídicos do cultivo..."
            }
            className="min-h-[80px]"
            disabled={isLoading || isLimitReached}
          />
          <Button 
            type="submit" 
            disabled={!prompt.trim() || isLoading || isLimitReached}
            className="h-auto"
          >
            <Send className="mr-2 h-4 w-4" />
            Enviar
          </Button>
        </form>
      </div>
    </Layout>
  );
};

export default GanjaChat;
