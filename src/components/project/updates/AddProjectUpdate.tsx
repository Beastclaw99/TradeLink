import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateType } from '@/types/projectUpdates';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
    types: ['message', 'check_in', 'check_out', 'on_my_way', 'site_check'] as UpdateType[],
    icon: ClockIcon
  },
  status: {
    label: 'Status',
    types: ['status_change', 'delayed', 'cancelled', 'revisit_required'] as UpdateType[],
    icon: ExclamationCircleIcon
  },
  files: {
    label: 'Files & Notes',
    types: ['file_upload', 'completion_note'] as UpdateType[],
    icon: DocumentIcon
  },
  expenses: {
    label: 'Expenses',
    types: ['expense_submitted', 'expense_approved', 'payment_processed'] as UpdateType[],
    icon: CurrencyDollarIcon
  },
  schedule: {
    label: 'Schedule',
    types: ['start_time', 'schedule_updated'] as UpdateType[],
    icon: CalendarIcon
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
  const [metadata, setMetadata] = useState<any>({});

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

  const handleQuickAction = async (type: UpdateType) => {
    try {
      setIsSubmitting(true);
      
      let updateData: any = {
        project_id: projectId,
        update_type: type,
        user_id: user?.id,
        message: `Professional ${type.replace('_', ' ')}`
      };

      if (type === 'site_check') {
        try {
          const position = await getCurrentLocation();
          setLocation(position);
          updateData.metadata = {
            geolocation: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude
            }
          };
        } catch (error) {
          console.error('Error getting location:', error);
        }
      }

      const { error: insertError } = await supabase
        .from('project_updates')
        .insert([updateData]);

      if (insertError) throw insertError;

      toast({
        title: "Update Added",
        description: "Your update has been added successfully."
      });

      onUpdateAdded();
      setMessage('');
      setFile(null);
      setFilePreview(null);
      setLocation(null);
      setMetadata({});
      
    } catch (error: any) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message && !file) return;

    try {
      setIsSubmitting(true);
      
      let fileUrl = null;
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${projectId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;
        fileUrl = filePath;
      }

      const updateData = {
        project_id: projectId,
        update_type: selectedType,
        user_id: user?.id,
        message,
        file_url: fileUrl,
        metadata
      };

      const { error: insertError } = await supabase
        .from('project_updates')
        .insert([updateData]);

      if (insertError) throw insertError;

      toast({
        title: "Update Added",
        description: "Your update has been added successfully."
      });

      onUpdateAdded();
      setMessage('');
      setFile(null);
      setFilePreview(null);
      setLocation(null);
      setMetadata({});
      
    } catch (error: any) {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const renderMetadataFields = () => {
    switch (selectedType) {
      case 'expense_submitted':
      case 'expense_approved':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={metadata.amount || ''}
                onChange={(e) => setMetadata({ ...metadata, amount: e.target.value })}
                placeholder="Enter amount"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={metadata.description || ''}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                placeholder="Enter expense description"
              />
            </div>
          </div>
        );
      
      case 'delayed':
        return (
          <div>
            <Label htmlFor="delay_reason">Reason for Delay</Label>
            <Textarea
              id="delay_reason"
              value={metadata.delay_reason || ''}
              onChange={(e) => setMetadata({ ...metadata, delay_reason: e.target.value })}
              placeholder="Enter reason for delay"
            />
          </div>
        );
      
      default:
        return null;
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
      <Card>
        <CardHeader>
          <CardTitle>Add Project Update</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Update Type Selection */}
            <Tabs
              value={selectedGroup}
              onValueChange={(value: UpdateGroup) => setSelectedGroup(value)}
            >
              <TabsList className="grid grid-cols-5">
                {Object.entries(UPDATE_TYPE_GROUPS).map(([key, { label, icon: Icon }]) => (
                  <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                  </TabsTrigger>
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
                placeholder="Enter your update message"
                className="min-h-[100px]"
              />
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="file">Attachment</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
              />
              {filePreview && (
                <div className="mt-2">
                  <div className="relative inline-block">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="max-h-32 rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => {
                        setFile(null);
                        setFilePreview(null);
                      }}
                    >
                      <XMark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata Fields */}
            {renderMetadataFields()}

            <Button
              type="submit"
              disabled={isSubmitting || (!message && !file)}
              className="w-full"
            >
              {isSubmitting ? 'Adding Update...' : 'Add Update'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 