
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { documentCategories } from "@/lib/document-constants";

interface DocumentUploaderProps {
  defaultCategory?: string;
  onUploadComplete?: () => void;
}

const DocumentUploader = ({ defaultCategory, onUploadComplete }: DocumentUploaderProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState("");
  const [category, setCategory] = useState(defaultCategory || "");
  const [expiryDate, setExpiryDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type
      const validTypes = [
        "application/pdf", 
        "image/jpeg", 
        "image/png", 
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      
      if (!validTypes.includes(file.type)) {
        toast.error("Formato de arquivo inválido. Envie arquivos PDF, JPG, PNG ou DOCX.");
        e.target.value = "";
        return;
      }
      
      // Check file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Arquivo muito grande. O tamanho máximo é 10MB.");
        e.target.value = "";
        return;
      }
      
      setSelectedFile(file);
      // Set a default name from the file if not provided
      if (!documentName) {
        setDocumentName(file.name.split('.')[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !selectedFile || !documentName || !category) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }
    
    setIsUploading(true);
    
    try {
      // 1. Upload file to storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, selectedFile);
        
      if (uploadError) throw uploadError;
      
      // 2. Create database entry
      const { error: dbError } = await supabase
        .from("user_documents")
        .insert({
          user_id: user.id,
          name: documentName,
          file_path: filePath,
          category,
          mime_type: selectedFile.type,
          expiry_date: expiryDate || null
        });
        
      if (dbError) throw dbError;
      
      // 3. Reset form
      setSelectedFile(null);
      setDocumentName("");
      setCategory(defaultCategory || "");
      setExpiryDate("");
      setIsOpen(false);
      
      // 4. Notify parent component
      if (onUploadComplete) {
        onUploadComplete();
      }
      
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Falha ao enviar o documento. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Enviar Documento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enviar novo documento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentName">Nome do documento</Label>
            <Input 
              id="documentName"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="Ex: Prescrição Médica Dr. Silva"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={category} 
              onValueChange={setCategory}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Data de validade (opcional)</Label>
            <Input 
              id="expiryDate"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo (PDF, JPG, PNG ou DOCX até 10MB)</Label>
            <Input 
              id="file"
              type="file" 
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.docx"
              required
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isUploading || !selectedFile}
            >
              {isUploading ? "Enviando..." : "Enviar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploader;
