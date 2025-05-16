
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { User, Download, Share2, UserCheck, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Custom QR Code component instead of using the external library
import QRCode from "@/components/ui/qr-code";

interface Document {
  id: string;
  name: string;
  file_path: string;
  category: string;
  mime_type: string;
  created_at: string;
}

const Carteirinha = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [shareLink, setShareLink] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchDocuments = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("user_documents")
          .select("id, name, category, file_path, created_at, mime_type")
          .order("created_at", { ascending: false });
          
        if (error) throw error;
        
        setDocuments(data || []);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast.error("Não foi possível carregar seus documentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [user]);

  const handleDocumentCheck = (id: string) => {
    setSelectedDocuments((prev) => {
      if (prev.includes(id)) {
        return prev.filter((docId) => docId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const generateCardLink = async () => {
    if (!user || selectedDocuments.length === 0) {
      toast.error("Selecione pelo menos um documento para incluir na carteirinha");
      return;
    }

    try {
      // Generate a unique link ID
      const linkId = Math.random().toString(36).substring(2, 15);

      // Store the selected document IDs and user info
      const { error } = await supabase
        .from("user_cards")
        .insert({
          user_id: user.id,
          link_id: linkId,
          document_ids: selectedDocuments,
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days expiration
        });

      if (error) throw error;

      // Generate QR code URL (app domain + card route + link ID)
      const cardUrl = `${window.location.origin}/card/${linkId}`;
      setQrCodeValue(cardUrl);
      setShareLink(cardUrl);

      toast.success("Carteirinha digital gerada com sucesso!");
    } catch (error) {
      console.error("Error generating card:", error);
      toast.error("Falha ao gerar a carteirinha digital");
    }
  };

  const handleShare = async () => {
    if (!shareLink) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Carteirinha GanjaDAO",
          text: "Minha carteirinha digital GanjaDAO com documentos do autocultivo",
          url: shareLink
        });
      } else {
        await navigator.clipboard.writeText(shareLink);
        toast.success("Link copiado para a área de transferência");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <User className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Acesso Restrito</h3>
              <p className="text-muted-foreground text-center mb-6">
                Faça login para acessar sua carteirinha digital.
              </p>
              <Button asChild>
                <a href="/clube/login">Fazer Login</a>
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
        <h1 className="text-2xl font-bold mb-6">Carteirinha Digital</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <UserCheck className="h-5 w-5 mr-2 text-green-600" />
                Informações Pessoais
              </h2>
              <div className="space-y-2">
                <p><span className="font-medium">Nome:</span> {user.user_metadata?.name || user.email}</p>
                <p><span className="font-medium">Email:</span> {user.email}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-blue-600" />
                Documentos para a Carteirinha
              </h2>
              
              {isLoading ? (
                <p>Carregando documentos...</p>
              ) : documents.length === 0 ? (
                <div>
                  <p className="mb-4">Você ainda não possui documentos cadastrados.</p>
                  <Button asChild variant="outline">
                    <a href="/clube/documentos">Gerenciar Documentos</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selecione os documentos que deseja incluir na sua carteirinha digital:
                  </p>
                  
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`doc-${doc.id}`} 
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => handleDocumentCheck(doc.id)}
                      />
                      <Label 
                        htmlFor={`doc-${doc.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {doc.name}
                      </Label>
                    </div>
                  ))}
                  
                  <Button 
                    onClick={generateCardLink}
                    disabled={selectedDocuments.length === 0}
                    className="mt-4"
                  >
                    Gerar Carteirinha Digital
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            {qrCodeValue ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium mb-4">Sua Carteirinha Digital</h2>
                
                <div className="flex flex-col items-center justify-center p-4 border rounded-lg mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm mb-4">
                    <QRCode value={qrCodeValue} size={200} />
                  </div>
                  <p className="text-sm text-center text-muted-foreground mb-4">
                    Esta carteirinha é válida por 30 dias e pode ser compartilhada 
                    com autoridades ou utilizada para comprovar sua documentação.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartilhar
                  </Button>
                  <Button asChild className="flex-1">
                    <a href={`/card/${shareLink.split('/').pop()}`} target="_blank">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </a>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center min-h-[200px]">
                <p className="text-center text-muted-foreground mb-4">
                  Selecione documentos e gere sua carteirinha para visualizar o QR Code.
                </p>
              </div>
            )}
            
            <div className="bg-blue-50 p-6 rounded-lg mt-6">
              <h3 className="font-medium mb-2">Sobre a Carteirinha Digital</h3>
              <p className="text-sm text-blue-800 mb-4">
                A carteirinha digital da GanjaDAO é um documento que comprova que você possui
                a documentação necessária para o autocultivo de cannabis medicinal,
                de acordo com as determinações legais e jurisprudências.
              </p>
              <p className="text-sm text-blue-800">
                Ela pode ser apresentada às autoridades em caso de questionamento sobre
                seu cultivo e oferece uma camada adicional de segurança jurídica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Carteirinha;
