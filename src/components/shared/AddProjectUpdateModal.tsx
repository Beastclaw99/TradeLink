
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UpdateType } from '@/types/projectUpdates';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';
import {
  CheckCircleIcon,
  ClockIcon,
  DocumentIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  PaperClipIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  TruckIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ListBulletIcon,
  PencilSquareIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';

// Update type groups for better organization
const UPDATE_TYPE_GROUPS = {
  activity: {
    label: 'Activity',
    types: ['message', 'check_in', 'check_out', 'on_my_way', 'site_check'] as UpdateType[],
    icon: CheckCircleIcon,
    color: 'text-blue-600'
  },
  status: {
    label: 'Status',
    types: ['status_change', 'delayed', 'cancelled', 'revisit_required'] as UpdateType[],
    icon: ExclamationCircleIcon,
    color: 'text-orange-600'
  },
  files: {
    label: 'Files & Notes',
    types: ['file_upload', 'completion_note'] as UpdateType[],
    icon: DocumentIcon,
    color: 'text-green-600'
  },
  expenses: {
    label: 'Expenses',
    types: ['expense_submitted', 'expense_approved', 'payment_processed'] as UpdateType[],
    icon: CurrencyDollarIcon,
    color: 'text-purple-600'
  }
} as const;

type UpdateGroup = keyof typeof UPDATE_TYPE_GROUPS;

interface AddProjectUpdateModalProps {
  projectId: string;
  onUpdateAdded: () => void;
  projectStatus: string;
  isProfessional: boolean;
}

export default function AddProjectUpdateModal({ 
  projectId, 
  onUpdateAdded,
  projectStatus,
  isProfessional 
}: AddProjectUpdateModalProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<UpdateGroup>('activity');
  const [selectedType, setSelectedType] = useState<UpdateType>('message');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if component should be visible
  const isVisible = isProfessional && ['assigned', 'in_progress', 'revision'].includes(projectStatus);

  // Handle file selection with preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Remove file
  const removeFile = () => {
    setFile(null);
    setFilePreview(null);
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() && !file) {
      toast({
        title: "Error",
        description: "Please provide a message or upload a file.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      let fileUrl = null;
      
      if (file && selectedType === 'file_upload') {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
        const filePath = `projects/${projectId}/updates/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, file);
          
        if (uploadError) throw uploadError;
        
        fileUrl = filePath;
      }

      // Create the update
      const { error } = await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: selectedType,
        message: message.trim() || null,
        file_url: fileUrl,
        professional_id: user?.id,
      }]);

      if (error) throw error;
      
      // Reset form
      setMessage('');
      setFile(null);
      setFilePreview(null);
      setSelectedType('message');
      setSelectedGroup('activity');
      
      onUpdateAdded();
    } catch (error) {
      console.error('Error adding update:', error);
      toast({
        title: "Error",
        description: "Failed to add update. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Updates can only be added when the project is active.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Update Type Selection */}
      <div className="space-y-4">
        <Label className="text-base font-medium">Update Type</Label>
        
        {/* Group Selection */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(UPDATE_TYPE_GROUPS).map(([key, { label, icon: Icon, color }]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedGroup(key as UpdateGroup);
                setSelectedType(UPDATE_TYPE_GROUPS[key as UpdateGroup].types[0]);
              }}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedGroup === key 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}
            >
              <Icon className={`h-6 w-6 mx-auto mb-1 ${selectedGroup === key ? 'text-blue-600' : color}`} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Specific Type Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Specific Type</Label>
          <Select value={selectedType} onValueChange={(value: UpdateType) => setSelectedType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {UPDATE_TYPE_GROUPS[selectedGroup].types.map(type => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe what happened or provide an update..."
          className="min-h-[100px] resize-none"
          maxLength={1000}
        />
        <div className="text-xs text-gray-500 text-right">
          {message.length}/1000 characters
        </div>
      </div>

      {/* File Upload */}
      {selectedType === 'file_upload' && (
        <div className="space-y-3">
          <Label>Attachment</Label>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            
            {!file ? (
              <div className="space-y-3">
                <Upload className="h-10 w-10 text-gray-400 mx-auto" />
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                    className="mb-2"
                  >
                    Choose File
                  </Button>
                  <p className="text-sm text-gray-500">
                    Support: Images, PDF, Word docs (max 10MB)
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filePreview ? (
                  <div className="relative">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-w-full h-32 object-cover rounded-lg mx-auto"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <DocumentIcon className="h-8 w-8 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{file.name}</span>
                  </div>
                )}
                
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </Badge>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t">
        <Button
          type="submit"
          disabled={isSubmitting || (!message.trim() && !file)}
          className="min-w-[120px]"
        >
          {isSubmitting ? 'Adding...' : 'Add Update'}
        </Button>
      </div>
    </form>
  );
}
