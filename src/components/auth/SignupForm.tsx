
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';

const SignupForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accountType, setAccountType] = useState<'client' | 'professional'>('client');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive"
      });
      return;
    }
    
    if (formData.password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Clean up existing auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });
      
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            account_type: accountType
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully. Please check your email for verification.",
      });
      
      // Navigate to home page after successful signup
      navigate('/');
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Something went wrong. Please try again later.",
        variant: "destructive"
      });
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
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
          <Input 
            id="firstName" 
            placeholder="John" 
            required 
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            placeholder="Doe" 
            required 
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email" 
          placeholder="name@example.com" 
          type="email" 
          required 
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          required 
          value={formData.password}
          onChange={handleChange}
        />
        <p className="text-xs text-muted-foreground">
          Must be at least 8 characters long with a number and special character.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input 
          id="confirmPassword" 
          type="password" 
          required 
          value={formData.confirmPassword}
          onChange={handleChange}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-ttc-blue-500 hover:bg-ttc-blue-600"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : (accountType === 'client' ? 'Create Client Account' : 'Create Professional Account')}
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
