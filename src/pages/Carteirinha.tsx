
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import QRCode from "react-qr-code";
import { User, Download, Share2, UserCheck, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  category: string;
  file_path: string;
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
          .select("id, name, category, file_path")
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
    setSelectedDocuments(prev => {
      if (prev.includes(id)) {
        return prev.filter(docId => docId !== id);
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
                <UserCheck className="mr-2 h-5 w-5" />
                Informações Pessoais
              </h2>
              <div className="space-y-3">
                <div>
                  <span className="font-medium">Nome:</span> {user.username}
                </div>
                <div>
                  <span className="font-medium">Email:</span> {user.email}
                </div>
                <div>
                  <span className="font-medium">Membro desde:</span> {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium mb-4 flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Selecione os Documentos
              </h2>
              
              {isLoading ? (
                <p>Carregando documentos...</p>
              ) : documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`doc-${doc.id}`}
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => handleDocumentCheck(doc.id)}
                      />
                      <Label htmlFor={`doc-${doc.id}`}>{doc.name}</Label>
                    </div>
                  ))}
                  
                  <Button
                    className="w-full mt-4"
                    onClick={generateCardLink}
                    disabled={selectedDocuments.length === 0}
                  >
                    Gerar Carteirinha Digital
                  </Button>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-4">
                    Você ainda não possui documentos para incluir na carteirinha.
                  </p>
                  <Button asChild>
                    <a href="/clube/documentos">Enviar Documentos</a>
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Sua Carteirinha Digital</h2>
            
            {qrCodeValue ? (
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg shadow-inner mb-6">
                  <QRCode value={qrCodeValue} size={200} />
                </div>
                
                <p className="text-sm text-center text-muted-foreground mb-6">
                  Apresente este QR code para permitir que autoridades ou terceiros 
                  verifiquem seus documentos de autocultivo.
                </p>
                
                <div className="flex gap-4 w-full">
                  <Button variant="outline" className="flex-1" onClick={handleShare}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartilhar
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                    <Download className="mr-2 h-4 w-4" />
                    Imprimir
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[300px]">
                <div className="bg-muted rounded-lg h-48 w-48 flex items-center justify-center mb-4">
                  <QRCode value="" size={130} style={{ opacity: 0.3 }} />
                </div>
                <p className="text-muted-foreground text-center">
                  Selecione seus documentos e gere sua carteirinha digital para 
                  obter o QR code.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Carteirinha;
