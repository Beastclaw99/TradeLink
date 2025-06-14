
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, FileText, Clock, AlertTriangle } from 'lucide-react';
import { ProjectData } from '@/types/project';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

interface ServiceContractStepProps {
  data: ProjectData;
  onUpdate: (data: Partial<ProjectData>) => void;
}

const ServiceContractStep: React.FC<ServiceContractStepProps> = ({ data, onUpdate }) => {
  // Ensure we have safe defaults for all data
  const safeData = {
    service_contract: data?.service_contract || '',
    contract_template_id: data?.contract_template_id || '',
    payment_required: data?.payment_required ?? true,
    payment_due_date: data?.payment_due_date || '',
    project_start_time: data?.project_start_time || '',
    sla_terms: data?.sla_terms || null,
    requirements: data?.requirements || [],
    scope: data?.scope || '',
    title: data?.title || '',
    budget: data?.budget || 0,
    timeline: data?.timeline || '',
    ...data
  };

  const contractTemplates = [
    { id: 'basic', name: 'Basic Service Agreement', description: 'Standard terms for general projects' },
    { id: 'hourly', name: 'Hourly Rate Contract', description: 'Time-based billing agreement' },
    { id: 'fixed', name: 'Fixed Price Contract', description: 'Fixed scope and price agreement' },
    { id: 'milestone', name: 'Milestone-Based Contract', description: 'Payment tied to project milestones' },
    { id: 'custom', name: 'Custom Contract', description: 'Create your own contract terms' }
  ];

  const handleServiceContractChange = (value: string) => {
    onUpdate({ service_contract: value });
  };

  const handleTemplateChange = (templateId: string) => {
    onUpdate({ contract_template_id: templateId });
    
    // Auto-populate contract terms based on template
    const template = contractTemplates.find(t => t.id === templateId);
    if (template && templateId !== 'custom') {
      const templateText = generateTemplateText(templateId, safeData);
      onUpdate({ 
        contract_template_id: templateId,
        service_contract: templateText 
      });
    }
  };

  const generateTemplateText = (templateId: string, projectData: ProjectData): string => {
    const templates = {
      basic: `Basic Service Agreement

Project: ${projectData.title || '[Project Title]'}
Budget: $${projectData.budget || '[Budget Amount]'}
Timeline: ${projectData.timeline || '[Timeline]'}

Terms:
1. Service Provider agrees to perform the services described in the project description.
2. Client agrees to pay the agreed amount upon satisfactory completion.
3. Both parties agree to communicate professionally and promptly.
4. Any changes to scope must be agreed upon in writing.
5. Either party may terminate with reasonable notice.`,

      hourly: `Hourly Rate Service Agreement

Project: ${projectData.title || '[Project Title]'}
Estimated Budget: $${projectData.budget || '[Budget Amount]'}
Estimated Timeline: ${projectData.timeline || '[Timeline]'}

Terms:
1. Services will be billed at an hourly rate.
2. Detailed time tracking will be provided.
3. Payment due within 30 days of invoice.
4. Minimum billing increment of 15 minutes.
5. Overtime rates apply for urgent requests.`,

      fixed: `Fixed Price Service Agreement

Project: ${projectData.title || '[Project Title]'}
Fixed Price: $${projectData.budget || '[Budget Amount]'}
Delivery Date: ${projectData.timeline || '[Timeline]'}

Terms:
1. Fixed price for the complete scope of work.
2. Payment schedule: 50% upfront, 50% on completion.
3. Scope changes require additional agreement.
4. Delivery timeline is binding unless scope changes.
5. Quality guarantee included.`,

      milestone: `Milestone-Based Service Agreement

Project: ${projectData.title || '[Project Title]'}
Total Budget: $${projectData.budget || '[Budget Amount]'}
Timeline: ${projectData.timeline || '[Timeline]'}

Terms:
1. Payment tied to milestone completion.
2. Each milestone requires client approval.
3. Milestone payments due within 7 days of approval.
4. Project may be paused between milestones.
5. Final payment upon project completion.`
    };

    return templates[templateId as keyof typeof templates] || '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Service Contract & Terms</h3>
        <p className="text-gray-600 mb-6">
          Define the terms and conditions for your project. This helps set clear expectations 
          between you and the professional you'll hire.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Contract Template
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="contract-template">Choose a Contract Template</Label>
            <Select value={safeData.contract_template_id} onValueChange={handleTemplateChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select a contract template" />
              </SelectTrigger>
              <SelectContent>
                {contractTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="service-contract">Contract Terms</Label>
            <Textarea
              id="service-contract"
              value={safeData.service_contract}
              onChange={(e) => handleServiceContractChange(e.target.value)}
              placeholder="Enter your contract terms and conditions..."
              className="min-h-32"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Project Timeline & Payment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="project-start">Preferred Start Date</Label>
              <Input
                id="project-start"
                type="date"
                value={safeData.project_start_time}
                onChange={(e) => onUpdate({ project_start_time: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="payment-due">Payment Due Date</Label>
              <Input
                id="payment-due"
                type="date"
                value={safeData.payment_due_date}
                onChange={(e) => onUpdate({ payment_due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="payment-required"
              checked={safeData.payment_required}
              onCheckedChange={(checked) => onUpdate({ payment_required: checked as boolean })}
            />
            <Label htmlFor="payment-required">Payment is required for this project</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="project-scope">Detailed Project Scope</Label>
            <Textarea
              id="project-scope"
              value={safeData.scope}
              onChange={(e) => onUpdate({ scope: e.target.value })}
              placeholder="Provide a detailed description of what should be included and excluded from this project..."
              className="min-h-24"
            />
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Clear contract terms help prevent misunderstandings and ensure 
          both you and the professional are aligned on expectations, timelines, and payment terms.
        </AlertDescription>
      </Alert>

      {!safeData.service_contract && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Consider adding contract terms to protect both parties and set clear expectations.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ServiceContractStep;
