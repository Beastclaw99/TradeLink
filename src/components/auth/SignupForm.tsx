
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const SignupForm: React.FC = () => {
  const { toast } = useToast();
  const [accountType, setAccountType] = useState<'client' | 'professional'>('client');
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Sign Up Attempt",
      description: `This is a demo. Account type: ${accountType}. In a real app, registration would be implemented.`,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <RadioGroup 
        defaultValue={accountType} 
        className="grid grid-cols-2 gap-4 mb-4"
        onValueChange={(value) => setAccountType(value as 'client' | 'professional')}
      >
        <div>
          <RadioGroupItem
            value="client"
            id="client"
            className="peer sr-only"
          />
          <Label
            htmlFor="client"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-ttc-blue-500 [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-xl mb-2">👤</span>
            <span className="font-semibold">I'm a Client</span>
            <span className="text-xs text-muted-foreground mt-1">Hire professionals</span>
          </Label>
        </div>
        
        <div>
          <RadioGroupItem
            value="professional"
            id="professional"
            className="peer sr-only"
          />
          <Label
            htmlFor="professional"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-muted hover:text-accent-foreground peer-data-[state=checked]:border-ttc-blue-500 [&:has([data-state=checked])]:border-primary"
          >
            <span className="text-xl mb-2">🛠️</span>
            <span className="font-semibold">I'm a Professional</span>
            <span className="text-xs text-muted-foreground mt-1">Offer services</span>
          </Label>
        </div>
      </RadioGroup>
    
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" placeholder="John" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Doe" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="name@example.com" type="email" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required />
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters long with a number and special character.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" required />
      </div>
      
      <Button type="submit" className="w-full bg-ttc-blue-500 hover:bg-ttc-blue-600">
        {accountType === 'client' ? 'Create Client Account' : 'Create Professional Account'}
      </Button>
      
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-ttc-blue-500 hover:text-ttc-blue-600">
          Sign in
        </Link>
      </div>
    </form>
  );
};

export default SignupForm;
