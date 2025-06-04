
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const AccountTypeSelection: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleAccountTypeSelection = async (accountType: 'professional' | 'client') => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({ account_type: accountType })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Account type selected",
        description: `You have selected ${accountType} account type.`,
      });

      // Refresh the page to update the user metadata
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating account type:', error);
      toast({
        title: "Error",
        description: "Failed to update account type. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Account Type</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Professional</CardTitle>
              <CardDescription>
                Offer your trade services and find new clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleAccountTypeSelection('professional')}
                disabled={isLoading}
                className="w-full"
              >
                Select Professional
              </Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Client</CardTitle>
              <CardDescription>
                Post projects and hire trade professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => handleAccountTypeSelection('client')}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                Select Client
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
