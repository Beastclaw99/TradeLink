
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";

const LoginForm: React.FC = () => {
  const { toast } = useToast();
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Login Attempt",
      description: "This is a demo. In a real app, authentication would be implemented.",
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" placeholder="name@example.com" type="email" required />
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to="/forgot-password" className="text-sm font-medium text-ttc-blue-500 hover:text-ttc-blue-600">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" required />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox id="remember" />
        <Label htmlFor="remember" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Remember me
        </Label>
      </div>
      
      <Button type="submit" className="w-full bg-ttc-blue-500 hover:bg-ttc-blue-600">
        Sign In
      </Button>
      
      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-ttc-blue-500 hover:text-ttc-blue-600">
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;
