import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, Clock, DollarSign, MapPin, Calendar } from 'lucide-react';
import { Project as DBProject, Profile } from '@/types/database';

interface ProjectSummary {
  id: string;
  title: string;
  professional: Profile;
  amount: number;
  description: string;
  location: string;
  timeline: string;
  submitted_date: string;
  status: DBProject['status'];
}

interface ApprovalInterfaceProps {
  project?: ProjectSummary;
}

const ApprovalInterface: React.FC<ApprovalInterfaceProps> = ({ project }) => {
  const [approvalNotes, setApprovalNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock project data if none provided
  const mockProject: ProjectSummary = {
    id: '1',
    title: 'Kitchen Plumbing Repair',
    professional: {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-555-5555',
      address: '123 Main St, Port of Spain, Trinidad',
      profile_picture: 'https://example.com/john-smith.jpg',
      rating: 4.5,
      reviews: 12,
      description: 'Professional plumber with 10 years of experience'
    },
    amount: 2500,
    description: 'Complete kitchen sink and dishwasher plumbing installation with new fixtures and connections.',
    location: 'Port of Spain, Trinidad',
    timeline: '2-3 days',
    submitted_date: '2024-01-15',
    status: 'open'
  };

  const projectData = project || mockProject;

  const handleApproval = async (approved: boolean) => {
    setIsProcessing(true);
    
    // TODO: Integrate with backend API
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    
    console.log(`Project ${approved ? 'approved' : 'rejected'}:`, {
      projectId: projectData.id,
      notes: approvalNotes,
      approved
    });
    
    alert(`Project ${approved ? 'approved' : 'rejected'} successfully! (Placeholder)`);
    setIsProcessing(false);
  };

  const statusConfig: Record<DBProject['status'], { icon: typeof Clock; color: string; text: string }> = {
    draft: { icon: Clock, color: 'bg-gray-100 text-gray-800', text: 'Draft' },
    open: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: 'Pending Review' },
    assigned: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Assigned' },
    in_progress: { icon: Clock, color: 'bg-blue-100 text-blue-800', text: 'In Progress' },
    work_submitted: { icon: CheckCircle, color: 'bg-purple-100 text-purple-800', text: 'Work Submitted' },
    work_revision_requested: { icon: XCircle, color: 'bg-orange-100 text-orange-800', text: 'Revision Requested' },
    work_approved: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Work Approved' },
    completed: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: 'Completed' },
    archived: { icon: Clock, color: 'bg-gray-100 text-gray-800', text: 'Archived' },
    cancelled: { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Cancelled' },
    disputed: { icon: XCircle, color: 'bg-red-100 text-red-800', text: 'Disputed' }
  };

  const StatusIcon = statusConfig[projectData.status].icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Project Approval</CardTitle>
            <Badge className={statusConfig[projectData.status].color}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusConfig[projectData.status].text}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Project Details */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{projectData.title}</h3>
                <p className="text-gray-600">{projectData.description}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  {projectData.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  Estimated Duration: {projectData.timeline}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  Submitted: {new Date(projectData.submitted_date).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Professional Details</h4>
                <p className="text-sm text-gray-600">Professional: {projectData.professional.name}</p>
                {/* TODO: Add professional profile link, rating, etc. */}
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <h4 className="font-medium">Project Cost</h4>
                </div>
                <p className="text-2xl font-bold text-blue-700">
                  TTD {projectData.amount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Approval Section */}
          {projectData.status === 'open' && (
            <div className="border-t pt-6">
              <h4 className="font-medium mb-4">Approval Decision</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <Textarea
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    placeholder="Add any notes or conditions for this approval..."
                    rows={3}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={() => handleApproval(false)}
                    variant="destructive"
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Project
                  </Button>
                  <Button
                    onClick={() => handleApproval(true)}
                    disabled={isProcessing}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isProcessing ? 'Processing...' : 'Approve Project'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Already Processed */}
          {projectData.status !== 'open' && (
            <div className="border-t pt-6">
              <div className={`p-4 rounded-lg ${
                projectData.status === 'assigned' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <p className="font-medium">
                  This project has been {projectData.status.replace('_', ' ')}.
                </p>
                {projectData.status === 'assigned' && (
                  <p className="text-sm text-gray-600 mt-1">
                    Payment processing will begin automatically.
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApprovalInterface;
