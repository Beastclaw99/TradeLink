
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateType } from '@/types/projectUpdates';
import { useAuth } from '@/contexts/AuthContext';

// Import extracted components
import QuickActionsBar from './types/QuickActionsBar';
import UpdateTypeSelector from './types/UpdateTypeSelector';
import MetadataFields from './types/MetadataFields';
import FileUploadSection from './types/FileUploadSection';

// Import extracted hooks
import { useGeolocation } from './hooks/useGeolocation';
import { useFileUpload } from './hooks/useFileUpload';
import { useUpdateSubmission } from './hooks/useUpdateSubmission';

// Import types
import { UpdateGroup } from './constants/updateTypes';

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
  const [selectedGroup, setSelectedGroup] = useState<UpdateGroup>('activity');
  const [selectedType, setSelectedType] = useState<UpdateType>('message');
  const [message, setMessage] = useState('');
  const [metadata, setMetadata] = useState<any>({});

  // Use extracted hooks
  const { location, setLocation, getLocationForUpdate } = useGeolocation();
  const { 
    file, 
    filePreview, 
    handleFileChange, 
    clearFile,
    setFile,
    setFilePreview 
  } = useFileUpload();
  const { isSubmitting, submitUpdate, submitQuickAction } = useUpdateSubmission({
    projectId,
    onUpdateAdded
  });

  // Check if component should be visible
  const isVisible = isProfessional && ['assigned', 'in_progress', 'revision'].includes(projectStatus);

  const handleQuickAction = async (type: UpdateType) => {
    let locationData = null;
    if (type === 'site_check') {
      locationData = await getLocationForUpdate();
    }
    
    const success = await submitQuickAction(type, locationData || undefined);
    if (success) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await submitUpdate(selectedType, message, file, metadata);
    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setMessage('');
    clearFile();
    setLocation(null);
    setMetadata({});
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <QuickActionsBar 
        onQuickAction={handleQuickAction}
        isSubmitting={isSubmitting}
      />

      {/* Main Update Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Project Update</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Update Type Selection */}
            <UpdateTypeSelector
              selectedGroup={selectedGroup}
              setSelectedGroup={setSelectedGroup}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
            />

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
            <FileUploadSection
              file={file}
              filePreview={filePreview}
              onFileChange={handleFileChange}
              onClearFile={clearFile}
            />

            {/* Metadata Fields */}
            <MetadataFields
              selectedType={selectedType}
              metadata={metadata}
              setMetadata={setMetadata}
            />

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
