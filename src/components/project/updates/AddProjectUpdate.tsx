import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UpdateType } from '@/types/projectUpdates';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
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
  XMarkIcon as XMark,
} from '@heroicons/react/24/outline';

// Update type groups for better organization
const UPDATE_TYPE_GROUPS = {
  activity: {
    label: 'Activity',
    types: ['message', 'check_in', 'check_out', 'on_my_way', 'site_check'] as UpdateType[]
  },
  status: {
    label: 'Status',
    types: ['status_change', 'delayed', 'cancelled', 'revisit_required'] as UpdateType[]
  },
  files: {
    label: 'Files & Notes',
    types: ['file_upload', 'completion_note'] as UpdateType[]
  },
  expenses: {
    label: 'Expenses',
    types: ['expense_submitted', 'expense_approved', 'payment_processed'] as UpdateType[]
  },
  schedule: {
    label: 'Schedule',
    types: ['start_time', 'schedule_updated'] as UpdateType[]
  }
} as const;

type UpdateGroup = keyof typeof UPDATE_TYPE_GROUPS;

// Quick actions configuration
const QUICK_ACTIONS = [
  { type: 'check_in' as UpdateType, icon: CheckIcon, label: 'Check In' },
  { type: 'check_out' as UpdateType, icon: XMarkIcon, label: 'Check Out' },
  { type: 'on_my_way' as UpdateType, icon: TruckIcon, label: 'On My Way' }
];

interface AddProjectUpdateProps {
  projectId: string;
  onUpdateAdded: () => void;
  projectStatus: string;
  isProfessional: boolean;
}

export default function AddProjectUpdate({ 
  projectId, 
  onUpdateAdded,
  projectStatus,
  isProfessional 
}: AddProjectUpdateProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<UpdateGroup>('activity');
  const [selectedType, setSelectedType] = useState<UpdateType>('message');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Check if component should be visible
  const isVisible = isProfessional && ['assigned', 'in_progress', 'revision'].includes(projectStatus);

  // Get current location
  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  // Handle quick action clicks
  const handleQuickAction = async (type: UpdateType) => {
    try {
      setIsSubmitting(true);
      
      let metadata = {};
      
      if (type === 'site_check') {
        const position = await getCurrentLocation();
        if (position) {
          metadata = {
            geolocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          };
        }
      }
      
      await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: type,
        created_by: user?.id,
        metadata
      }]);
      
      toast({
        title: "Update Added",
        description: `Successfully added ${type.replace('_', ' ')} update.`
      });
      
      onUpdateAdded();
    } catch (error) {
      console.error('Error adding quick update:', error);
      toast({
        title: "Error",
        description: "Failed to add update. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      let metadata = {};
      let fileUrl = null;
      
      if (file && selectedType === 'file_upload') {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('project-files')
          .upload(`${projectId}/${file.name}`, file);
          
        if (fileError) throw fileError;
        
        fileUrl = fileData.path;
      }
      
      if (selectedType === 'site_check' && location) {
        metadata = {
          geolocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        };
      }

      // Check if message contains "completed" and update project status
      if (message.toLowerCase().includes('completed')) {
        const { error: statusError } = await supabase
          .from('projects')
          .update({ status: 'submitted' })
          .eq('id', projectId);

        if (statusError) throw statusError;
      }
      
      await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: selectedType,
        message,
        file_url: fileUrl,
        file_name: file?.name,
        created_by: user?.id,
        metadata
      }]);
      
      // Reset form
      setMessage('');
      setFile(null);
      setFilePreview(null);
      setLocation(null);
      setPreviewMode(false);
      
      toast({
        title: "Update Added",
        description: "Successfully added project update."
      });
      
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
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {QUICK_ACTIONS.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant="outline"
            className="flex items-center gap-2 min-w-fit"
            onClick={() => handleQuickAction(type)}
            disabled={isSubmitting}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Button>
        ))}
      </div>

      {/* Main Update Form */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Update Type Selection */}
          <Tabs
            value={selectedGroup}
            onValueChange={(value: UpdateGroup) => setSelectedGroup(value)}
          >
            <TabsList className="grid grid-cols-5">
              {Object.entries(UPDATE_TYPE_GROUPS).map(([key, { label }]) => (
                <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
              ))}
            </TabsList>
            
            {Object.entries(UPDATE_TYPE_GROUPS).map(([key, { types }]) => (
              <TabsContent key={key} value={key} className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {types.map(type => (
                    <Button
                      key={type}
                      type="button"
                      variant={selectedType === type ? "default" : "outline"}
                      className="justify-start"
                      onClick={() => setSelectedType(type)}
                    >
                      {type.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Message Input */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your update message..."
              className="min-h-[100px]"
            />
          </div>

          {/* File Upload */}
          {selectedType === 'file_upload' && (
            <div className="space-y-2">
              <Label htmlFor="file">Attachment</Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file')?.click()}
                >
                  <PaperClipIcon className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
                {file && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                    >
                      <XMark className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {filePreview && (
                <div className="mt-2">
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="max-w-xs rounded-lg border"
                  />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting || (!message && !file)}
            className="w-full"
          >
            {isSubmitting ? 'Adding Update...' : 'Add Update'}
          </Button>
        </form>
      </Card>
    </div>
  );
} 