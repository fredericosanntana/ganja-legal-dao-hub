
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import { documentCategories } from "@/lib/document-constants";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface DocumentCardProps {
  document: {
    id: string;
    name: string;
    file_path: string;
    category: string;
    mime_type: string;
    created_at: string;
    expiry_date?: string;
  };
  onDelete: (documentId: string) => void;
}

const DocumentCard = ({ document, onDelete }: DocumentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Get category label from value
  const getCategoryLabel = (value: string) => {
    const category = documentCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };

  // Handle file download
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from("documents")
        .download(document.file_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = document.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Erro ao baixar o documento");
    }
  };

  // Handle document preview for images and PDFs
  const handlePreview = () => {
    setShowPreview(true);
  };

  // Handle document deletion
  const handleDelete = async () => {
    if (isDeleting) return;
    
    setIsDeleting(true);
    try {
      // Delete from storage
      await supabase.storage
        .from("documents")
        .remove([document.file_path]);

      // Delete from database
      const { error } = await supabase
        .from("user_documents")
        .delete()
        .eq("id", document.id);

      if (error) throw error;
      
      onDelete(document.id);
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Erro ao excluir o documento");
    } finally {
      setIsDeleting(false);
    }
  };

  // Check if file is previewable
  const isPreviewable = () => {
    return document.mime_type.startsWith("image/") || document.mime_type === "application/pdf";
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <CardContent className="p-4 h-full flex flex-col">
        <div className="flex items-start mb-3">
          <FileText className="h-5 w-5 mt-1 text-blue-500 mr-2" />
          <div className="flex-1">
            <h3 className="font-medium truncate" title={document.name}>
              {document.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Categoria: {getCategoryLabel(document.category)}
            </p>
            <p className="text-xs text-muted-foreground">
              Adicionado: {new Date(document.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-3 flex justify-between">
          <div>
            {isPreviewable() && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mr-2" 
                onClick={handlePreview}
              >
                <Eye className="h-4 w-4 mr-1" />
                Visualizar
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-1" />
              Baixar
            </Button>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Excluir
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar exclusão</DialogTitle>
                </DialogHeader>
                <p>Tem certeza que deseja excluir o documento "{document.name}"?</p>
                <p className="text-sm text-muted-foreground">Esta ação não pode ser desfeita.</p>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button 
                    variant="destructive" 
                    onClick={handleDelete}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Excluindo..." : "Excluir"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>

      {/* Document Preview Dialog */}
      {isPreviewable() && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{document.name}</DialogTitle>
            </DialogHeader>
            <div className="overflow-auto max-h-[70vh]">
              {document.mime_type.startsWith("image/") ? (
                <img 
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/documents/${document.file_path}`} 
                  alt={document.name} 
                  className="max-w-full mx-auto"
                />
              ) : document.mime_type === "application/pdf" && (
                <iframe 
                  src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/documents/${document.file_path}`}
                  className="w-full h-[60vh]"
                  title={document.name}
                />
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowPreview(false)}>Fechar</Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Baixar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default DocumentCard;
