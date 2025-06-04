
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ProjectData } from '@/types';

interface ServiceContractStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const ServiceContractStep: React.FC<ServiceContractStepProps> = ({ data, onUpdate }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [customTerms, setCustomTerms] = useState('');

  const handleAcceptContract = () => {
    if (agreedToTerms) {
      onUpdate({ 
        service_contract: customTerms || 'Standard service contract accepted'
      });
    }
  };

  const standardTerms = [
    "Payment will be made upon completion of agreed milestones",
    "Professional will provide updates on project progress",
    "Client has the right to review and request revisions",
    "Both parties agree to communicate professionally",
    "Disputes will be resolved through the platform mediation process"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Contract Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-medium">Standard Terms & Conditions</h4>
            <ul className="space-y-2">
              {standardTerms.map((term, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{term}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <Label htmlFor="customTerms">Additional Terms (Optional)</Label>
            <Textarea
              id="customTerms"
              placeholder="Add any specific terms or requirements for this project..."
              value={customTerms}
              onChange={(e) => setCustomTerms(e.target.value)}
              rows={4}
            />
          </div>

          {data.milestones.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Project Milestones Summary</h4>
              <div className="space-y-2">
                {data.milestones.map((milestone: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <span className="font-medium">{milestone.title}</span>
                      {milestone.due_date && (
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(milestone.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <Badge variant="outline">
                      {milestone.deliverables?.length || 0} deliverables
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the standard terms and conditions and any additional terms specified above.
                I understand that these terms will govern the professional relationship for this project.
              </Label>
            </div>
          </div>

          <Button
            onClick={handleAcceptContract}
            disabled={!agreedToTerms}
            className="w-full"
          >
            {data.service_contract ? 'Update Contract Terms' : 'Accept Service Contract'}
          </Button>

          {data.service_contract && (
            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded">
              <CheckCircle2 className="h-5 w-5" />
              <span>Service contract has been accepted</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceContractStep;
