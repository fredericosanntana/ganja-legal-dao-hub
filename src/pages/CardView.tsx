
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, User, Calendar, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { documentCategories } from "@/lib/document-constants";

interface DocumentInfo {
  id: string;
  name: string;
  category: string;
  file_path: string;
  created_at: string;
}

interface CardData {
  user: {
    username: string;
    email: string;
    created_at: string;
  };
  documents: DocumentInfo[];
  valid_until: string;
}

const CardView = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchCardData = async () => {
      if (!linkId) return;
      
      setIsLoading(true);
      try {
        // Fetch card data
        const { data: cardData, error: cardError } = await supabase
          .from("user_cards")
          .select("user_id, document_ids, valid_until")
          .eq("link_id", linkId)
          .single();
          
        if (cardError) throw cardError;
        if (!cardData) {
          setError("Carteirinha não encontrada ou expirada.");
          setIsLoading(false);
          return;
        }
        
        // Check if card is still valid
        if (new Date(cardData.valid_until) < new Date()) {
          setError("Esta carteirinha expirou.");
          setIsLoading(false);
          return;
        }
        
        // Fetch user data
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username, email, created_at")
          .eq("id", cardData.user_id)
          .single();
          
        if (userError) throw userError;
        
        // Fetch documents
        const { data: documents, error: docsError } = await supabase
          .from("user_documents")
          .select("id, name, category, file_path, created_at")
          .in("id", cardData.document_ids);
          
        if (docsError) throw docsError;
        
        // Combine all data
        setCardData({
          user: userData,
          documents: documents || [],
          valid_until: cardData.valid_until
        });
        
      } catch (error) {
        console.error("Error fetching card data:", error);
        setError("Erro ao carregar dados da carteirinha.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCardData();
  }, [linkId]);

  const getCategoryLabel = (value: string) => {
    const category = documentCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };
  
  const handleViewDocument = async (filePath: string) => {
    try {
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(filePath);
      
      if (publicUrl) {
        window.open(publicUrl, '_blank');
      }
    } catch (error) {
      console.error("View error:", error);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <p>Carregando informações da carteirinha...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Acesso Inválido</h3>
              <p className="text-muted-foreground text-center mb-2">
                {error}
              </p>
              <Button asChild className="mt-4">
                <a href="/">Voltar para a página inicial</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!cardData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Shield className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Carteirinha não encontrada</h3>
              <Button asChild className="mt-4">
                <a href="/">Voltar para a página inicial</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-green-600" />
              Carteirinha Digital GanjaDAO
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Informações do Membro
                </h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Nome:</span> {cardData.user.username}</p>
                  <p><span className="font-medium">Email:</span> {cardData.user.email}</p>
                  <p><span className="font-medium">Membro desde:</span> {new Date(cardData.user.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Validade da Carteirinha
                </h3>
                <p className="text-green-600 font-medium">
                  Válida até {new Date(cardData.valid_until).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-3">Documentos Associados</h3>
                <div className="space-y-4">
                  {cardData.documents.map((doc) => (
                    <Card key={doc.id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        <div className="flex-grow">
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">{getCategoryLabel(doc.category)}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleViewDocument(doc.file_path)}>
                          <File className="h-4 w-4 mr-1" /> 
                          Visualizar
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Esta carteirinha digital foi emitida pelo sistema GanjaDAO para comprovar o cultivo legal de cannabis medicinal.</p>
          <p className="mt-1">A autenticidade deste documento pode ser verificada através do QR code.</p>
        </div>
      </div>
    </Layout>
  );
};

export default CardView;
