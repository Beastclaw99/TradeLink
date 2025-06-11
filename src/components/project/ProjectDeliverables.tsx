import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { 
  Upload, 
  FileText, 
  Download, 
  Eye,
  Trash2,
  Plus,
  Calendar
} from "lucide-react";
import { ProjectDeliverable } from '@/types/database';

interface ExtendedProjectDeliverable extends ProjectDeliverable {
  uploaded_by?: string;
}

interface ProjectDeliverablesProps {
  projectId: string;
  canUpload?: boolean;
}

const ProjectDeliverables: React.FC<ProjectDeliverablesProps> = ({ 
  projectId, 
  canUpload = false 
}) => {
  const { toast } = useToast();
  const [deliverables, setDeliverables] = useState<ExtendedProjectDeliverable[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    deliverable_type: 'file',
    content: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchDeliverables();
  }, [projectId]);

  const fetchDeliverables = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('project_deliverables')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDeliverables(data || []);
    } catch (error) {
      console.error('Error fetching deliverables:', error);
      toast({
        title: "Error",
        description: "Failed to load project deliverables",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile && formData.deliverable_type === 'file') {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let fileUrl = '';
      
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${projectId}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(fileName, selectedFile);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('project-files')
          .getPublicUrl(fileName);
          
        fileUrl = publicUrl;
      }

      const deliverableData: Omit<ExtendedProjectDeliverable, 'id' | 'created_at' | 'updated_at'> = {
        project_id: projectId,
        file_url: fileUrl || formData.content,
        description: formData.description,
        deliverable_type: formData.deliverable_type,
        content: formData.deliverable_type === 'note' ? formData.content : null,
        uploaded_by: user.id
      };

      const { error } = await supabase
        .from('project_deliverables')
        .insert([deliverableData]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Deliverable uploaded successfully"
      });

      setDialogOpen(false);
      setSelectedFile(null);
      setFormData({
        description: '',
        deliverable_type: 'file',
        content: ''
      });
      fetchDeliverables();
    } catch (error) {
      console.error('Error uploading deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to upload deliverable",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const deleteDeliverable = async (deliverableId: string, fileUrl: string) => {
    try {
      // Delete from database
      const { error } = await supabase
        .from('project_deliverables')
        .delete()
        .eq('id', deliverableId);

      if (error) throw error;

      // Delete file from storage if it exists
      if (fileUrl && fileUrl.includes('project-files')) {
        const fileName = fileUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('project-files')
            .remove([`${projectId}/${fileName}`]);
        }
      }
      
      toast({
        title: "Success",
        description: "Deliverable deleted successfully"
      });
      
      fetchDeliverables();
    } catch (error) {
      console.error('Error deleting deliverable:', error);
      toast({
        title: "Error",
        description: "Failed to delete deliverable",
        variant: "destructive"
      });
    }
  };

  const getFileIcon = (fileUrl: string, type: string) => {
    if (type === 'note') return <FileText className="h-5 w-5 text-blue-600" />;
    
    const extension = fileUrl.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <Eye className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getFileName = (fileUrl: string, type: string) => {
    if (type === 'note') return 'Project Note';
    return fileUrl.split('/').pop() || 'Unknown File';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Project Deliverables ({deliverables.length})
        </h3>
        
        {canUpload && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Deliverable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload New Deliverable</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    className="w-full p-2 border rounded-md"
                    value={formData.deliverable_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, deliverable_type: e.target.value }))}
                  >
                    <option value="file">File Upload</option>
                    <option value="note">Text Note</option>
                    <option value="link">External Link</option>
                  </select>
                </div>

                {formData.deliverable_type === 'file' && (
                  <div>
                    <Label htmlFor="file">Select File</Label>
                    <Input
                      id="file"
                      type="file"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>
                )}

                {formData.deliverable_type === 'note' && (
                  <div>
                    <Label htmlFor="content">Note Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      required
                      rows={4}
                    />
                  </div>
                )}

                {formData.deliverable_type === 'link' && (
                  <div>
                    <Label htmlFor="link">External Link URL</Label>
                    <Input
                      id="link"
                      type="url"
                      value={formData.content}
                      onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                      required
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this deliverable..."
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setDialogOpen(false);
                      setSelectedFile(null);
                      setFormData({ description: '', deliverable_type: 'file', content: '' });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {deliverables.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-8">
            <FileText className="w-10 h-10 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-600">No deliverables uploaded yet.</p>
            {canUpload && (
              <Button 
                className="mt-3" 
                onClick={() => setDialogOpen(true)}
              >
                Upload First Deliverable
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliverables.map((deliverable) => (
            <Card key={deliverable.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getFileIcon(deliverable.file_url, deliverable.deliverable_type)}
                    <div>
                      <CardTitle className="text-base">
                        {getFileName(deliverable.file_url, deliverable.deliverable_type)}
                      </CardTitle>
                      {deliverable.description && (
                        <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {deliverable.deliverable_type}
                    </Badge>
                    <div className="flex gap-1">
                      {deliverable.deliverable_type === 'file' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(deliverable.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {deliverable.deliverable_type === 'note' && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Show note content in a dialog or expand
                            toast({
                              title: "Note Content",
                              description: deliverable.content || "No content"
                            });
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      {canUpload && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteDeliverable(deliverable.id, deliverable.file_url)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(deliverable.created_at).toLocaleDateString()}
                  </span>
                  {deliverable.deliverable_type === 'note' && deliverable.content && (
                    <div className="flex-1">
                      <p className="text-sm bg-gray-50 p-2 rounded border line-clamp-2">
                        {deliverable.content}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDeliverables;
