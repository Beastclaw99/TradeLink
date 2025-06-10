import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { ProfileData } from '@/components/profile/types';
import { Switch } from '@/components/ui/switch';

interface OnboardingStep {
  title: string;
  description: string;
  fields: {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'tel' | 'email' | 'file' | 'boolean';
    required: boolean;
    multiple?: boolean;
  }[];
}

const clientSteps: OnboardingStep[] = [
  {
    title: "Personal Information",
    description: "Let's start with your basic information",
    fields: [
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
    ]
  },
  {
    title: "About You",
    description: "Tell us a bit about yourself",
    fields: [
      { name: 'bio', label: 'Bio', type: 'textarea', required: true },
    ]
  }
];

const professionalSteps: OnboardingStep[] = [
  {
    title: "Welcome to TradeLink",
    description: "Let's set up your professional profile to start connecting with clients",
    fields: [
      { name: 'first_name', label: 'First Name', type: 'text', required: true },
      { name: 'last_name', label: 'Last Name', type: 'text', required: true },
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true },
    ]
  },
  {
    title: "Professional Details",
    description: "Tell us about your professional background and experience",
    fields: [
      { name: 'bio', label: 'Professional Bio', type: 'textarea', required: true },
      { name: 'years_experience', label: 'Years of Experience', type: 'number', required: true },
      { name: 'hourly_rate', label: 'Hourly Rate (TTD)', type: 'number', required: true },
    ]
  },
  {
    title: "Skills & Expertise",
    description: "What are your areas of expertise? This helps clients find you",
    fields: [
      { name: 'skills', label: 'Skills (comma-separated)', type: 'text', required: true },
      { name: 'certifications', label: 'Certifications (comma-separated)', type: 'text', required: false },
    ]
  },
  {
    title: "Portfolio (Optional)",
    description: "Showcase your best work - you can add this later",
    fields: [
      { name: 'portfolio_images', label: 'Portfolio Images', type: 'file', required: false, multiple: true },
    ]
  },
  {
    title: "Profile Visibility",
    description: "Control how clients can find and contact you",
    fields: [
      { name: 'profile_visibility', label: 'Make Profile Public', type: 'boolean', required: true },
      { name: 'show_email', label: 'Show Email to Clients', type: 'boolean', required: true },
      { name: 'show_phone', label: 'Show Phone to Clients', type: 'boolean', required: true },
      { name: 'allow_messages', label: 'Allow Direct Messages', type: 'boolean', required: true },
    ]
  }
];

const OnboardingFlow: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  if (!user) {
    navigate('/login');
    return null;
  }

  const steps = user.user_metadata?.account_type === 'professional' ? professionalSteps : clientSteps;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateStep = (stepIndex: number): boolean => {
    const currentStepData = steps[stepIndex];
    const errors: Record<string, string> = {};

    currentStepData.fields.forEach(field => {
      if (field.required) {
        const value = formData[field.name];
        if (!value) {
          errors[field.name] = `${field.label} is required`;
        } else if (field.type === 'number' && isNaN(Number(value))) {
          errors[field.name] = `${field.label} must be a number`;
        } else if (field.type === 'tel' && !/^\+?[\d\s-]{10,}$/.test(value)) {
          errors[field.name] = 'Please enter a valid phone number';
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!user || !validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Process skills and certifications if they exist
      const processedData = { ...formData };
      if (processedData.skills) {
        processedData.skills = processedData.skills.split(',').map((s: string) => s.trim());
      }
      if (processedData.certifications) {
        processedData.certifications = processedData.certifications.split(',').map((c: string) => c.trim());
      }

      const { error } = await supabase
        .from('profiles')
        .update(processedData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Profile Setup Complete",
        description: "Your profile has been set up successfully! You can now start connecting with clients.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="container-custom py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-gray-500 mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {currentStepData.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    className={validationErrors[field.name] ? 'border-red-500' : ''}
                  />
                ) : field.type === 'boolean' ? (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={field.name}
                      checked={formData[field.name] ?? true}
                      onCheckedChange={(checked) => handleInputChange(field.name, checked)}
                    />
                    <Label htmlFor={field.name} className="cursor-pointer">
                      {field.label}
                    </Label>
                  </div>
                ) : (
                  <Input
                    id={field.name}
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    required={field.required}
                    className={validationErrors[field.name] ? 'border-red-500' : ''}
                  />
                )}
                {validationErrors[field.name] && (
                  <p className="text-sm text-red-500">{validationErrors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            {currentStep < steps.length - 1 ? (
              <Button onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Complete Setup'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow; 