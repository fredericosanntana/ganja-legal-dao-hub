
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { File, Eye, Download, Trash, FileText, FileImage } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { documentCategories } from "@/lib/document-constants";

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
  onDelete: (id: string) => void;
}

const DocumentCard = ({ document, onDelete }: DocumentCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const getCategoryLabel = (value: string) => {
    const category = documentCategories.find(cat => cat.value === value);
    return category ? category.label : value;
  };
  
  const getFileIcon = () => {
    if (document.mime_type.includes('pdf')) {
      return <FileText className="h-10 w-10 text-red-500" />;
    } else if (document.mime_type.includes('image')) {
      return <FileImage className="h-10 w-10 text-blue-500" />;
    } else if (document.mime_type.includes('word')) {
      return <File className="h-10 w-10 text-indigo-500" />;
    } else {
      return <File className="h-10 w-10 text-gray-500" />;
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage.from('documents').download(document.file_path);
      
      if (error) throw error;
      
      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = document.name + '.' + document.file_path.split('.').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Falha ao baixar o documento.");
    }
  };
  
  const handleView = async () => {
    try {
      const { data: { publicUrl } } = supabase.storage.from('documents').getPublicUrl(document.file_path);
      
      if (publicUrl) {
        window.open(publicUrl, '_blank');
      } else {
        toast.error("Não foi possível visualizar este documento.");
      }
    } catch (error) {
      console.error("View error:", error);
      toast.error("Falha ao visualizar o documento.");
    }
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      // Delete the database entry
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', document.id);
        
      if (dbError) throw dbError;
      
      // Delete the storage file
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([document.file_path]);
        
      if (storageError) {
        console.error("Storage delete error:", storageError);
        // Continue even if storage delete fails, as the DB record is already deleted
      }
      
      onDelete(document.id);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Falha ao excluir o documento.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getFileIcon()}
          <div className="truncate">{document.name}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <div>
          <span className="font-medium">Categoria:</span> {getCategoryLabel(document.category)}
        </div>
        <div>
          <span className="font-medium">Adicionado em:</span> {formatDate(document.created_at)}
        </div>
        {document.expiry_date && (
          <div>
            <span className="font-medium">Válido até:</span> {formatDate(document.expiry_date)}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={handleView}>
            <Eye className="h-4 w-4 mr-1" /> Ver
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Baixar
          </Button>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="outline" className="text-red-500 hover:text-red-700">
              <Trash className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir documento</AlertDialogTitle>
              <AlertDialogDescription>
                Tem certeza que deseja excluir este documento? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "Excluindo..." : "Excluir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
