
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Clock, AlertCircle, ListChecks, FileText, Link, CheckCircle } from 'lucide-react';
import { ProjectData } from '../types';

interface ReviewStepProps {
  data: ProjectData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimelineLabel = (value: string) => {
    const labels: Record<string, string> = {
      'less_than_1_month': 'Less than 1 month',
      '1_to_3_months': '1-3 months',
      '3_to_6_months': '3-6 months',
      'more_than_6_months': 'More than 6 months'
    };
    return labels[value] || value;
  };

  const getUrgencyLabel = (value: string) => {
    const labels: Record<string, string> = {
      'low': 'Low - Flexible timeline',
      'medium': 'Medium - Standard timeline',
      'high': 'High - Urgent completion needed'
    };
    return labels[value] || value;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Project Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{data.title}</h3>
            <p className="text-gray-600 mt-1">{data.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{data.category}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{data.location}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recommended Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Skills that would be helpful for this project</h4>
            <div className="flex flex-wrap gap-2">
              {data.recommendedSkills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Budget & Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>{formatCurrency(data.budget)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{getTimelineLabel(data.timeline)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <span>{getUrgencyLabel(data.urgency)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{milestone.title}</h4>
                    {milestone.dueDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date(milestone.dueDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  {milestone.description && (
                    <p className="text-gray-600 mt-2">{milestone.description}</p>
                  )}
                  <div className="flex gap-2 mt-2">
                    {milestone.requires_deliverable && (
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
                        Requires Deliverable
                      </Badge>
                    )}
                    <Badge variant="outline" className="border-gray-200 bg-gray-50 text-gray-700">
                      {milestone.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.deliverables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Deliverables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.deliverables.map((deliverable, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    {deliverable.deliverable_type === 'file' && <FileText className="h-4 w-4 text-gray-500" />}
                    {deliverable.deliverable_type === 'note' && <ListChecks className="h-4 w-4 text-gray-500" />}
                    {deliverable.deliverable_type === 'link' && <Link className="h-4 w-4 text-gray-500" />}
                    <span className="font-medium">{deliverable.description}</span>
                  </div>
                  {deliverable.content && (
                    <p className="text-gray-600 mt-2">{deliverable.content}</p>
                  )}
                  <Badge variant="secondary" className="mt-2">
                    {deliverable.deliverable_type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Service Contract</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.service_contract ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Service contract has been accepted</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <span>Service contract has not been accepted</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Ready to Create</h4>
            <p className="text-sm text-blue-700">
              Review your project details above. Once created, professionals will be able to 
              view and apply for your project.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;
