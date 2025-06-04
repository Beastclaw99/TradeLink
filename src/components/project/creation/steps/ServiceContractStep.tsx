
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectData } from '../types';
import { FileText, Download, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceContractStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const ServiceContractStep: React.FC<ServiceContractStepProps> = ({ data, onUpdate }) => {
  const [accepted, setAccepted] = useState(false);
  const { user } = useAuth();

  const formatCurrency = (amount?: number) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTimelineLabel = (value?: string) => {
    if (!value) return 'Not specified';
    const labels: Record<string, string> = {
      'less_than_1_month': 'Less than 1 month',
      '1_to_3_months': '1-3 months',
      '3_to_6_months': '3-6 months',
      'more_than_6_months': 'More than 6 months'
    };
    return labels[value] || value;
  };

  const getUrgencyLabel = (value?: string) => {
    if (!value) return 'Not specified';
    const labels: Record<string, string> = {
      'low': 'Low - Flexible timeline',
      'medium': 'Medium - Standard timeline',
      'high': 'High - Urgent completion needed'
    };
    return labels[value] || value;
  };

  const generateContract = () => {
    const contract = `
PROLINKTT SERVICE AGREEMENT

This Service Agreement ("Agreement") is made and entered into on ${new Date().toLocaleDateString()} through the ProLinkTT platform.

PARTIES:
Client: ${user?.email || 'Client'}
Client ID: ${user?.id || 'N/A'}
Platform: ProLinkTT

PROJECT DETAILS:
════════════════════════════════════════════════════════════════════════════════
Title: ${data.title}
Description: ${data.description}
Location: ${data.location || 'Not specified'}
Category: ${data.category || 'Not specified'}

BUDGET AND TIMELINE:
════════════════════════════════════════════════════════════════════════════════
Total Budget: ${formatCurrency(data.budget)}
Expected Timeline: ${getTimelineLabel(data.timeline)}
Urgency Level: ${getUrgencyLabel(data.urgency)}

SCOPE OF WORK:
════════════════════════════════════════════════════════════════════════════════
The Professional agrees to perform the following services:

${data.requirements?.map((req: string) => `• ${req}`).join('\n') || 'No specific requirements listed'}

REQUIRED SKILLS:
════════════════════════════════════════════════════════════════════════════════
The Professional must possess the following skills:

${data.recommended_skills?.map((skill: string) => `• ${skill}`).join('\n') || 'No specific skills required'}

MILESTONES AND DELIVERABLES:
════════════════════════════════════════════════════════════════════════════════
${data.milestones.map(milestone => `
Milestone: ${milestone.title}
• Description: ${milestone.description || 'N/A'}
• Due Date: ${milestone.due_date || 'TBD'}
• Deliverables: ${milestone.deliverables?.length || 0} item(s)
`).join('\n')}

TERMS AND CONDITIONS:
════════════════════════════════════════════════════════════════════════════════

1. Payment Terms
   • The total project cost is ${formatCurrency(data.budget)}
   • Payment schedule will be determined based on project milestones
   • All payments are processed through the ProLinkTT platform
   • Payment disputes must be reported within 7 days of payment

2. Timeline and Deadlines
   • Project duration: ${getTimelineLabel(data.timeline)}
   • Urgency level: ${getUrgencyLabel(data.urgency)}
   • Milestone deadlines are as specified above
   • Delays must be communicated at least 48 hours in advance

3. Quality Standards
   • All work must meet industry standards and local regulations
   • Materials used must be of professional quality
   • Work must be completed to client's satisfaction
   • Professional must maintain appropriate insurance coverage

4. Changes and Modifications
   • Any changes to the scope must be agreed upon in writing
   • Additional costs must be approved by the client
   • Timeline adjustments must be communicated promptly
   • Change requests must be submitted through the platform

5. Termination
   • Either party may terminate with written notice
   • Professional must complete current milestone before termination
   • Client must pay for completed work
   • Termination disputes will be handled by ProLinkTT

6. Confidentiality
   • Both parties agree to maintain confidentiality
   • Project details may not be shared without consent
   • Client information must be kept secure
   • Non-disclosure terms apply for 2 years after project completion

7. Dispute Resolution
   • Disputes will be resolved through ProLinkTT's mediation
   • Legal action may be taken if mediation fails
   • Governing law: Trinidad and Tobago
   • Arbitration will be conducted in Port of Spain

ACCEPTANCE:
════════════════════════════════════════════════════════════════════════════════
By proceeding with project creation on the ProLinkTT platform, the Client acknowledges and agrees to all terms and conditions outlined in this Agreement. The act of publishing this project constitutes acceptance of this Agreement.

Platform: ProLinkTT
Date: ${new Date().toLocaleDateString()}
    `;

    return contract;
  };

  const handleDownload = () => {
    const contract = generateContract();
    const blob = new Blob([contract], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service_contract_${data.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Service Contract</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Review and Accept Contract</h3>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download Contract
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900">Important Notice</h4>
                  <p className="text-sm text-yellow-700">
                    Please review the contract carefully. By accepting, you agree to all terms and conditions.
                    The contract will be legally binding once the project is published.
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="h-[500px] w-full rounded-md border p-4">
              <pre className="whitespace-pre-wrap font-mono text-sm">
                {generateContract()}
              </pre>
            </ScrollArea>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="accept-terms"
                checked={accepted}
                onCheckedChange={(checked) => {
                  setAccepted(checked as boolean);
                  onUpdate({ service_contract: checked ? generateContract() : '' });
                }}
              />
              <Label htmlFor="accept-terms" className="text-sm">
                I have read and agree to the terms of this service contract
              </Label>
            </div>

            {accepted && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">Contract accepted</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceContractStep;
