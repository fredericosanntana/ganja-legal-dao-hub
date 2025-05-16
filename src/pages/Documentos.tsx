
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, File, QrCode } from "lucide-react";
import DocumentUploader from "@/components/documents/DocumentUploader";
import DocumentCard from "@/components/documents/DocumentCard";
import { useAuth } from "@/hooks/use-auth";
import { documentCategories } from "@/lib/document-constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  file_path: string;
  category: string;
  mime_type: string;
  created_at: string;
  expiry_date?: string;
}

const Documentos = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Using storage to fetch from documents
      const { data, error } = await supabase
        .from("user_documents")
        .select("*")
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

  const handleDocumentDeleted = (documentId: string) => {
    setDocuments(documents.filter(doc => doc.id !== documentId));
    toast.success("Documento excluído com sucesso");
  };

  const handleDocumentUploaded = () => {
    fetchDocuments();
    toast.success("Documento enviado com sucesso");
  };

  // Load documents on component mount
  useEffect(() => {
    if (user) {
      fetchDocuments();
    } else {
      navigate('/clube/login');
    }
  }, [user, navigate]);

  // Filter documents by category
  const filteredDocuments = activeTab === "all" 
    ? documents 
    : documents.filter(doc => doc.category === activeTab);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Meus Documentos</h1>
            <p className="text-muted-foreground">
              Gerencie os documentos do seu cultivo para garantir segurança jurídica
            </p>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button variant="outline" asChild>
              <a href="/clube/carteirinha" target="_blank">
                <QrCode className="mr-2 h-4 w-4" />
                Carteirinha Digital
              </a>
            </Button>
            <DocumentUploader onUploadComplete={handleDocumentUploaded} />
          </div>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4 flex flex-wrap">
            <TabsTrigger value="all" className="mb-1">
              Todos
            </TabsTrigger>
            {documentCategories.map((category) => (
              <TabsTrigger key={category.value} value={category.value} className="mb-1">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Carregando documentos...</p>
              </div>
            ) : filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDocuments.map((document) => (
                  <DocumentCard 
                    key={document.id} 
                    document={document} 
                    onDelete={handleDocumentDeleted}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <File className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Nenhum documento encontrado</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    {activeTab === "all" 
                      ? "Você ainda não enviou nenhum documento. Clique em 'Enviar Documento' para começar." 
                      : `Você ainda não enviou documentos na categoria ${documentCategories.find(cat => cat.value === activeTab)?.label}.`}
                  </p>
                  <DocumentUploader 
                    defaultCategory={activeTab !== "all" ? activeTab : undefined} 
                    onUploadComplete={handleDocumentUploaded} 
                  />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Documentos;
