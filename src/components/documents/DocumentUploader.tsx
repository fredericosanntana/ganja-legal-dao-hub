
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";
import { documentCategories } from "@/lib/document-constants";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

interface DocumentUploaderProps {
  defaultCategory?: string;
  onUploadComplete?: () => void;
}

const DocumentUploader = ({ defaultCategory, onUploadComplete }: DocumentUploaderProps) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState(defaultCategory || "");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Set default name from file name
      if (!name) {
        setName(selectedFile.name.replace(/\.[^/.]+$/, "")); // Remove extension
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !file || !name || !category) {
      toast.error("Preencha todos os campos e selecione um arquivo");
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload file to storage
      const filePath = `${user.id}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      
      const { error: storageError } = await supabase
        .storage
        .from("documents")
        .upload(filePath, file);

      if (storageError) throw storageError;

      // Save document metadata in database
      const { error: dbError } = await supabase
        .from("user_documents")
        .insert({
          user_id: user.id,
          name: name,
          file_path: filePath,
          category: category,
          mime_type: file.type
        });

      if (dbError) throw dbError;

      // Reset form
      setFile(null);
      setName("");
      setCategory(defaultCategory || "");
      setOpen(false);
      
      // Call callback
      if (onUploadComplete) {
        onUploadComplete();
      }
      
      toast.success("Documento enviado com sucesso");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Erro ao enviar o documento");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Enviar Documento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Novo Documento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">Arquivo</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              required
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {file && (
              <p className="text-xs text-muted-foreground">
                Arquivo selecionado: {file.name} ({Math.round(file.size / 1024)} KB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome do Documento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Habeas Corpus Digital"
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

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={isUploading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={!file || !name || !category || isUploading}
            >
              {isUploading ? "Enviando..." : "Enviar Documento"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentUploader;
