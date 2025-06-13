import React, { useState } from 'react';
import { useForm, Control } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Database } from '@/integrations/supabase/types';

const formSchema = z.object({
  status: z.enum(['pending', 'accepted', 'rejected', 'withdrawn'] as const),
  proposal: z.string().min(100, 'Proposal must be at least 100 characters'),
  budget: z.number().min(0, 'Budget must be a positive number'),
  timeline: z.string().min(1, 'Please specify the timeline'),
  availability: z.string().min(1, 'Please specify your availability'),
  additional_notes: z.string().optional(),
  attachments: z.array(z.string()).optional(),
  terms_accepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  })
});

type FormValues = z.infer<typeof formSchema>;

interface ApplicationFormProps {
  projectId: string;
  onSuccess?: () => void;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({
  projectId,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposal: '',
      budget: 0,
      timeline: '',
      availability: '',
      status: 'pending',
      additional_notes: '',
      attachments: [],
      terms_accepted: false
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit an application.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('applications')
        .insert({
          project_id: projectId,
          professional_id: user.id,
          proposal: values.proposal,
          budget: values.budget,
          timeline: values.timeline,
          availability: values.availability,
          status: values.status,
          additional_notes: values.additional_notes,
          attachments: values.attachments,
          terms_accepted: values.terms_accepted,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your application has been submitted successfully."
      });

      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField<FormValues>
          control={form.control}
          name="proposal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proposal</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your approach, experience, and why you're the best fit for this project..."
                  className="min-h-[200px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FormValues>
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget (TTD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter your proposed budget"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FormValues>
          control={form.control}
          name="timeline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timeline</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 2 weeks, 1 month, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FormValues>
          control={form.control}
          name="availability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Immediate, Within 2 weeks, etc."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FormValues>
          control={form.control}
          name="additional_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information you'd like to share..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField<FormValues>
          control={form.control}
          name="terms_accepted"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </FormControl>
              <FormLabel className="text-sm">
                I accept the terms and conditions
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm; 