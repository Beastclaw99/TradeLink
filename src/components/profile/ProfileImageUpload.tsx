import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileImageUploadProps {
  userId: string;
  currentImage: string | null;
  onUploadComplete?: () => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userId, currentImage, onUploadComplete }) => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Delete old image if it exists
      if (currentImage) {
        const oldImagePath = currentImage.split('/').pop();
        if (oldImagePath) {
          await supabase.storage
            .from('profile-images')
            .remove([`${userId}/${oldImagePath}`]);
        }
      }

      // Upload new image
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(fileName);

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      toast({
        title: "Success",
        description: "Profile image updated successfully."
      });

      setSelectedFile(null);
      setPreview(null);
      onUploadComplete?.();
    } catch (error) {
      console.error('Error uploading profile image:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Image</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={preview || currentImage || undefined} />
              <AvatarFallback>
                <ImageIcon className="h-8 w-8 text-gray-400" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-center gap-2">
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                  <Upload className="h-4 w-4" />
                  <span>Choose new image</span>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </label>
              {selectedFile && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>

          {selectedFile && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'Uploading...' : 'Update Profile Image'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileImageUpload; 