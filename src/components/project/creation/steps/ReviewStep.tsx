import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProjectData } from '../types';

interface ReviewStepProps {
  data: ProjectData;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Review Your Project</h3>
        <p className="text-gray-600 mb-6">
          Please review all the information below before submitting your project.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium">Title</h4>
            <p className="text-gray-700">{data.title}</p>
          </div>
          <div>
            <h4 className="font-medium">Description</h4>
            <p className="text-gray-700">{data.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Category</h4>
              <p className="text-gray-700">{data.category}</p>
            </div>
            <div>
              <h4 className="font-medium">Location</h4>
              <p className="text-gray-700">{data.location}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Requirements & Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.requirements && data.requirements.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Requirements</h4>
              <ul className="list-disc list-inside space-y-1">
                {data.requirements.map((req, index) => (
                  <li key={index} className="text-gray-700">{req}</li>
                ))}
              </ul>
            </div>
          )}
          {data.recommendedSkills && data.recommendedSkills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recommended Skills</h4>
              <div className="flex flex-wrap gap-2">
                {data.recommendedSkills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Budget & Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Budget</h4>
              <p className="text-gray-700">${data.budget?.toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-medium">Timeline</h4>
              <p className="text-gray-700">{data.timeline}</p>
            </div>
            <div>
              <h4 className="font-medium">Urgency</h4>
              <Badge variant="outline">{data.urgency}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.milestones && data.milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.milestones.map((milestone, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{milestone.title}</h4>
                    <Badge variant="outline">{milestone.status}</Badge>
                  </div>
                  {milestone.description && (
                    <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
                  )}
                  {milestone.dueDate && (
                    <p className="text-sm text-gray-500">Due: {milestone.dueDate}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.deliverables && data.deliverables.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Deliverables</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.deliverables.map((deliverable, index) => (
                <div key={index} className="border rounded p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{deliverable.description}</p>
                    <Badge variant="outline">{deliverable.deliverable_type}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.service_contract && (
        <Card>
          <CardHeader>
            <CardTitle>Service Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 whitespace-pre-wrap">{data.service_contract}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReviewStep;
