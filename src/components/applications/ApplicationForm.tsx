import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

const formSchema = z.object({
  proposal: z.string().min(100, 'Proposal must be at least 100 characters'),
  budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Please enter a valid budget amount',
  }),
  timeline: z.string().min(1, 'Please specify the timeline'),
});

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposal: '',
      budget: '',
      timeline: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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
          budget: Number(values.budget),
          timeline: values.timeline,
          status: 'pending'
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
        <FormField
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

        <FormField
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
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

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </Button>
      </form>
    </Form>
  );
};

export default ApplicationForm; 