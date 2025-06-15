import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateType } from '@/types/projectUpdates';
import { useAuth } from '@/contexts/AuthContext';

// Import extracted components
import QuickActionsBar from '@/types/project/updates/QuickActionsBar';
import UpdateTypeSelector from '@/types/project/updates/UpdateTypeSelector';
import MetadataFields from '@/types/project/updates/MetadataFields';
import FileUploadSection from '@/types/project/updates/FileUploadSection';

// Import extracted hooks
import { useGeolocation } from '@/components/project/updates/hooks/useGeolocation';
import { useFileUpload } from '@/components/project/updates/hooks/useFileUpload';
import { useUpdateSubmission } from '@/components/project/updates/hooks/useUpdateSubmission';

// Import types
import { UpdateGroup } from '@/components/project/updates/constants/updateTypes';

interface AddProjectUpdateProps {
  projectId: string;
  onUpdateAdded: () => void;
  projectStatus: string;
  isProfessional: boolean;
}

interface UpdateState {
  selectedGroup: UpdateGroup;
  selectedType: UpdateType;
  message: string;
  metadata: Record<string, any>;
}

export default function AddProjectUpdate({ 
  projectId, 
  onUpdateAdded,
  projectStatus,
  isProfessional 
}: AddProjectUpdateProps) {
  const { user } = useAuth();
  const [updateState, setUpdateState] = useState<UpdateState>({
    selectedGroup: 'activity',
    selectedType: 'message',
    message: '',
    metadata: {}
  });

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
    
    const success = await submitUpdate(
      updateState.selectedType, 
      updateState.message, 
      file, 
      updateState.metadata
    );
    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setUpdateState({
      selectedGroup: 'activity',
      selectedType: 'message',
      message: '',
      metadata: {}
    });
    clearFile();
    setLocation(null);
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
              selectedGroup={updateState.selectedGroup}
              setSelectedGroup={(group) => setUpdateState(prev => ({ ...prev, selectedGroup: group }))}
              selectedType={updateState.selectedType}
              setSelectedType={(type) => setUpdateState(prev => ({ ...prev, selectedType: type }))}
            />

            {/* Message Input */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={updateState.message}
                onChange={(e) => setUpdateState(prev => ({ ...prev, message: e.target.value }))}
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
              selectedType={updateState.selectedType}
              metadata={updateState.metadata}
              setMetadata={(metadata) => setUpdateState(prev => ({ ...prev, metadata }))}
            />

            <Button
              type="submit"
              disabled={isSubmitting || (!updateState.message && !file)}
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
