import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { UpdateType } from '@/types/projectUpdates';
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
}

export default function AddProjectUpdate({ projectId, onUpdateAdded }: AddProjectUpdateProps) {
  const { toast } = useToast();
  const [selectedGroup, setSelectedGroup] = useState<UpdateGroup>('activity');
  const [selectedType, setSelectedType] = useState<UpdateType>('message');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Handle quick action clicks
  const handleQuickAction = async (type: UpdateType) => {
    try {
      setIsSubmitting(true);
      
      let metadata = {};
      
      // Get location for site check
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

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      let metadata = {};
      let fileUrl = null;
      
      // Handle file upload if present
      if (file && selectedType === 'file_upload') {
        const { data: fileData, error: fileError } = await supabase.storage
          .from('project-files')
          .upload(`${projectId}/${file.name}`, file);
          
        if (fileError) throw fileError;
        
        fileUrl = fileData.path;
      }
      
      // Handle location for site check
      if (selectedType === 'site_check' && location) {
        metadata = {
          geolocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
          }
        };
      }
      
      await supabase.from('project_updates').insert([{
        project_id: projectId,
        update_type: selectedType,
        message,
        file_url: fileUrl,
        file_name: file?.name,
        metadata
      }]);
      
      // Reset form
      setMessage('');
      setFile(null);
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

          {/* Dynamic Input Fields */}
          <div className="space-y-4">
            {selectedType === 'message' && (
              <div className="space-y-2">
                <Label>Message</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  className="min-h-[100px]"
                />
              </div>
            )}

            {selectedType === 'file_upload' && (
              <div className="space-y-2">
                <Label>File</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 hover:text-blue-800"
                  >
                    {file ? file.name : 'Click to upload or drag and drop'}
                  </label>
                </div>
              </div>
            )}

            {selectedType === 'site_check' && (
              <div className="space-y-2">
                <Label>Location</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const position = await getCurrentLocation();
                      setLocation(position);
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Failed to get location. Please try again.",
                        variant: "destructive"
                      });
                    }
                  }}
                >
                  {location ? 'Update Location' : 'Get Current Location'}
                </Button>
                {location && (
                  <p className="text-sm text-gray-600">
                    📍 Location: {location.coords.latitude.toFixed(6)}, 
                    {location.coords.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              {previewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding Update...' : 'Add Update'}
            </Button>
          </div>

          {/* Preview Mode */}
          {previewMode && (
            <div className="mt-4 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-medium mb-2">Preview</h3>
              <div className="space-y-2">
                <p><strong>Type:</strong> {selectedType.replace('_', ' ')}</p>
                {message && <p><strong>Message:</strong> {message}</p>}
                {file && <p><strong>File:</strong> {file.name}</p>}
                {location && (
                  <p>
                    <strong>Location:</strong> {location.coords.latitude.toFixed(6)}, 
                    {location.coords.longitude.toFixed(6)}
                  </p>
                )}
              </div>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
} 