import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface PortfolioUploadProps {
  profileId: string;
  onUploadComplete?: () => void;
}

const PortfolioUpload: React.FC<PortfolioUploadProps> = ({ profileId, onUploadComplete }) => {
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);

      // Create previews for images
      newFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviews(prev => ({
              ...prev,
              [file.name]: reader.result as string
            }));
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const removeFile = (fileName: string) => {
    setSelectedFiles(prev => prev.filter(file => file.name !== fileName));
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // Upload files to Supabase Storage
      const uploadPromises = selectedFiles.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${profileId}/portfolio/${Date.now()}-${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      // Update profile with new portfolio images
      const { data: profile } = await supabase
        .from('profiles')
        .select('portfolio_images')
        .eq('id', profileId)
        .single();

      const existingImages = profile?.portfolio_images || [];
      const newImages = [...existingImages, ...uploadedUrls];

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ portfolio_images: newImages })
        .eq('id', profileId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Portfolio images uploaded successfully."
      });

      setSelectedFiles([]);
      setPreviews({});
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading portfolio images:', error);
      toast({
        title: "Error",
        description: "Failed to upload portfolio images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Portfolio Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {selectedFiles.map((file) => (
              <div key={file.name} className="relative aspect-square border rounded-lg overflow-hidden">
                {previews[file.name] ? (
                  <img
                    src={previews[file.name]}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={() => removeFile(file.name)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
              <div className="text-center">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <span className="text-sm text-gray-600 mt-2">Add Image</span>
              </div>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                multiple
              />
            </label>
          </div>

          {selectedFiles.length > 0 && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Upload Images'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioUpload; 