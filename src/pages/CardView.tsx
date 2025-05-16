
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { FileText, Shield, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { documentCategories } from "@/lib/document-constants";

interface Document {
  id: string;
  name: string;
  category: string;
  file_path: string;
  mime_type: string;
}

interface UserDetails {
  username: string;
  email: string;
}

interface CardData {
  user_id: string;
  document_ids: string[];
  valid_until: string;
  user_details?: UserDetails;
  documents?: Document[];
}

const CardView = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cardData, setCardData] = useState<CardData | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const loadCardData = async () => {
      if (!linkId) {
        setError("Link inválido");
        setLoading(false);
        return;
      }

      try {
        // Get card data with the link ID
        const { data: cardData, error: cardError } = await supabase
          .from("user_cards")
          .select("user_id, document_ids, valid_until")
          .eq("link_id", linkId)
          .single();

        if (cardError || !cardData) {
          setError("Carteirinha não encontrada ou expirada");
          setLoading(false);
          return;
        }

        // Check if card is expired
        const validUntil = new Date(cardData.valid_until);
        if (validUntil < new Date()) {
          setExpired(true);
        }

        // Get user details
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("username, email")
          .eq("id", cardData.user_id)
          .single();

        if (userError) {
          console.error("Error fetching user data:", userError);
        }

        // Get documents
        const { data: documents, error: docsError } = await supabase
          .from("user_documents")
          .select("id, name, category, file_path, mime_type")
          .in("id", cardData.document_ids || []);

        if (docsError) {
          console.error("Error fetching documents:", docsError);
        }

        setCardData({
          ...cardData,
          user_details: userData || undefined,
          documents: documents || []
        });
      } catch (error) {
        console.error("Error loading card:", error);
        setError("Erro ao carregar a carteirinha");
      } finally {
        setLoading(false);
      }
    };

    loadCardData();
  }, [linkId]);

  const getCategoryLabel = (value: string) => {
    const category = documentCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <p className="text-center">Carregando carteirinha digital...</p>
        </div>
      </Layout>
    );
  }

  if (error || !cardData) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <h2 className="text-xl font-bold mb-2">Carteirinha não encontrada</h2>
              <p className="text-muted-foreground text-center">
                {error || "Esta carteirinha não existe ou foi removida."}
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Card className={expired ? "border-red-500" : ""}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Carteirinha Digital GanjaDAO</CardTitle>
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            {expired && (
              <div className="bg-red-100 text-red-800 px-4 py-2 rounded-md mt-2">
                Esta carteirinha expirou em {new Date(cardData.valid_until).toLocaleDateString('pt-BR')}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {cardData.user_details && (
                <div>
                  <h3 className="font-medium text-lg mb-2">Dados do Associado</h3>
                  <div className="bg-slate-50 p-4 rounded-md">
                    <p><span className="font-medium">Nome:</span> {cardData.user_details.username}</p>
                    <p><span className="font-medium">Email:</span> {cardData.user_details.email}</p>
                    <p><span className="font-medium">Válido até:</span> {new Date(cardData.valid_until).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-medium text-lg mb-2">Documentos Registrados</h3>
                {cardData.documents && cardData.documents.length > 0 ? (
                  <div className="space-y-2">
                    {cardData.documents.map((doc) => (
                      <div key={doc.id} className="bg-slate-50 p-4 rounded-md flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        <div>
                          <p className="font-medium">{doc.name}</p>
                          <p className="text-sm text-muted-foreground">Categoria: {getCategoryLabel(doc.category)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Nenhum documento disponível na carteirinha</p>
                )}
              </div>

              <div className="bg-blue-50 p-4 rounded-md">
                <p className="text-sm text-blue-800">
                  Esta carteirinha digital comprova que o portador é membro da GanjaDAO 
                  e possui a documentação necessária para o autocultivo de cannabis para fins medicinais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CardView;
