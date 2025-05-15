
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const JoinNetwork: React.FC = () => {
  const profileForm = useForm();
  
  const onSubmit = (data: any) => {
    console.log(data);
    // Would handle profile submission here
  };

  return (
    <Layout>
      <section className="bg-ttc-blue-800 py-12 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Professional Network</h1>
            <p className="text-lg mb-6">Connect with clients looking for your skills and grow your business</p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
                <Check className="mr-1 h-4 w-4" /> Access to quality clients
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
                <Check className="mr-1 h-4 w-4" /> Set your own rates
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
                <Check className="mr-1 h-4 w-4" /> Free professional profile
              </Badge>
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white px-4 py-2 text-sm">
                <Check className="mr-1 h-4 w-4" /> Secure payments
              </Badge>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6 text-ttc-neutral-800">Create Your Professional Profile</h2>
              
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                </TabsList>
                
                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                      <CardDescription>
                        Add your personal details to create your professional profile.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={profileForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="John Smith" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={profileForm.control}
                              name="email"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Email</FormLabel>
                                  <FormControl>
                                    <Input type="email" placeholder="you@example.com" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Phone</FormLabel>
                                  <FormControl>
                                    <Input placeholder="+1 (555) 000-0000" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={profileForm.control}
                            name="location"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Location</FormLabel>
                                <FormControl>
                                  <Input placeholder="Port of Spain, Trinidad" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Enter your city and region to help clients find you.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit">Save & Continue</Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="professional">
                  <Card>
                    <CardHeader>
                      <CardTitle>Professional Details</CardTitle>
                      <CardDescription>
                        Add your skills, experience, and professional information.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...profileForm}>
                        <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6">
                          <FormField
                            control={profileForm.control}
                            name="profession"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Primary Profession</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Electrician, Plumber" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Years of Experience</FormLabel>
                                <FormControl>
                                  <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="bio"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Professional Bio</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Tell clients about your experience, skills, and the services you offer..." 
                                    className="min-h-32"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  This will appear on your public profile. Be detailed about your expertise.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="certifications"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Certifications</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="List your relevant certifications and licenses..." 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="flex justify-end">
                            <Button type="submit">Save & Continue</Button>
                          </div>
                        </form>
                      </Form>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="portfolio">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio & Gallery</CardTitle>
                      <CardDescription>
                        Showcase your best work to attract more clients.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Upload Photos of Your Work</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[1, 2, 3, 4, 5, 6].map(index => (
                            <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100">
                              <span className="text-gray-400">+ Add Photo</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium mb-4">Past Projects</h3>
                        <Textarea 
                          placeholder="Describe some of your past successful projects..." 
                          className="min-h-32 mb-6"
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit">Complete Profile</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold mb-6 text-ttc-neutral-800">Why Join Trade Link?</h2>
              
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-2 flex items-center text-ttc-blue-700">
                    <span className="bg-ttc-blue-50 p-2 rounded-full mr-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    Set Your Own Rates
                  </h3>
                  <p className="text-gray-600">You decide how much to charge for your services. Counter-bid on client projects with your own rates.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-2 flex items-center text-ttc-blue-700">
                    <span className="bg-ttc-blue-50 p-2 rounded-full mr-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    Secure Payments
                  </h3>
                  <p className="text-gray-600">Our payment protection ensures you get paid for completed work. No more chasing clients for payment.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-2 flex items-center text-ttc-blue-700">
                    <span className="bg-ttc-blue-50 p-2 rounded-full mr-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    Verified Reviews
                  </h3>
                  <p className="text-gray-600">Build your reputation with verified reviews from satisfied clients to attract more business.</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="font-bold text-lg mb-2 flex items-center text-ttc-blue-700">
                    <span className="bg-ttc-blue-50 p-2 rounded-full mr-3">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                    Client Network
                  </h3>
                  <p className="text-gray-600">Access a growing network of clients looking for skilled tradesmen like you in Trinidad & Tobago.</p>
                </div>
              </div>
              
              <div className="mt-8 bg-ttc-blue-50 p-6 rounded-lg shadow border border-ttc-blue-100">
                <div className="flex items-center mb-4">
                  <div className="mr-3">
                    <img src="https://i.pravatar.cc/100?img=12" alt="Professional" className="w-14 h-14 rounded-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold">David J.</h3>
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">Electrician in San Fernando</p>
                  </div>
                </div>
                <p className="italic text-gray-600 text-sm">"Joining Trade Link has transformed my business. I get consistent projects and the secure payment system ensures I always get paid for my work."</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default JoinNetwork;
