
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, DollarSign, AlertTriangle } from 'lucide-react';

interface ReviewStepProps {
  data: any;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>{data.title || 'Untitled Project'}</span>
            {data.urgency && (
              <Badge className={urgencyColors[data.urgency as keyof typeof urgencyColors]}>
                {data.urgency}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">{data.description}</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{data.location || 'No location specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">{data.category || 'No category'}</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span>TTD {data.budget || 0}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{data.timeline || 'No timeline specified'}</span>
            </div>
          </div>

          {data.requirements && data.requirements.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Requirements:</h4>
              <div className="flex flex-wrap gap-2">
                {data.requirements.map((req: string, index: number) => (
                  <Badge key={index} variant="secondary">{req}</Badge>
                ))}
              </div>
            </div>
          )}

          {data.skills && data.skills.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Required Skills:</h4>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill: string, index: number) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
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
