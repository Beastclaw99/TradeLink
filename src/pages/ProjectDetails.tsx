
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Check,
  DollarSign,
  FileText,
  MapPin,
  Star,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Sample project data (in a real app, this would be fetched from an API)
const project = {
  id: 1,
  title: "Kitchen Renovation",
  description: "Complete renovation of a 15x10 kitchen including new cabinets, countertops, and appliance installation. The current kitchen is outdated with cabinets from the 1990s and laminate countertops. We'd like to modernize the space with custom wood cabinets, granite countertops, and new stainless steel appliances. The existing floor is tile and will remain, but the backsplash needs to be replaced as well.",
  location: "Port of Spain",
  category: "Carpentry",
  subcategory: "Kitchen Remodeling",
  budget: 15000,
  deadline: "2025-06-15",
  startDate: "2025-06-01",
  postedDate: "2025-05-10",
  clientName: "Michelle R.",
  clientRating: 4.8,
  clientJoined: "2024-03",
  completedProjects: 3,
  status: "Open",
  scope: [
    "Remove existing cabinets and countertops",
    "Install new custom wood cabinets",
    "Install granite countertops",
    "Install new backsplash",
    "Install new sink and faucet",
    "Connect appliances (client will purchase appliances separately)",
    "Clean up and remove all debris"
  ],
  requirements: [
    "Must be licensed and insured",
    "Must have at least 3 years of kitchen renovation experience",
    "Must provide references from similar projects",
    "Must be available to start work on June 1, 2025",
    "Project should be completed within 2 weeks"
  ],
  images: [
    "/lovable-uploads/8bbf4ce1-7690-4c37-9adf-b2751ac81a84.png",
    "/lovable-uploads/848377f4-0205-491b-a416-42eea8acae4b.png"
  ],
  contractTerms: {
    paymentSchedule: "50% upfront, 50% upon completion",
    warranty: "1 year warranty on workmanship",
    insurance: "Contractor must provide proof of liability insurance",
    cancellation: "7 days notice required for cancellation",
    additionalCosts: "Any additional work beyond the scope will require written approval"
  }
};

const ProjectDetails: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [bidAmount, setBidAmount] = useState<number | ''>(project.budget);
  const [bidMessage, setBidMessage] = useState("");
  const [bidSubmitted, setBidSubmitted] = useState(false);
  
  const handleBidSubmission = () => {
    // In a real app, this would send the bid to an API
    console.log("Bid submitted:", { amount: bidAmount, message: bidMessage });
    setBidSubmitted(true);
  };
  
  const acceptClientPrice = () => {
    // In a real app, this would send an acceptance to an API
    console.log("Accepted client's price:", project.budget);
    setBidSubmitted(true);
  };

  return (
    <Layout>
      <div className="bg-gray-50 min-h-screen">
        <section className="bg-ttc-blue-800 py-10 text-white">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-ttc-blue-200 text-ttc-blue-800">
                    {project.category}
                  </Badge>
                  <Badge variant="outline" className="bg-white/10 border-white/20">
                    {project.subcategory}
                  </Badge>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {project.status}
                  </Badge>
                </div>
                
                <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
                
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1" /> {project.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1" /> Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-1" /> Posted: {new Date(project.postedDate).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <div className="text-center">
                  <div className="text-2xl font-bold">${project.budget}</div>
                  <div className="text-xs">Client's Budget</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="details">
                <TabsList className="w-full">
                  <TabsTrigger value="details">Project Details</TabsTrigger>
                  <TabsTrigger value="contract">Service Contract</TabsTrigger>
                  <TabsTrigger value="client">About Client</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Project Description</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>{project.description}</p>
                      
                      <div className="pt-4">
                        <h3 className="font-semibold text-lg mb-2">Project Scope</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {project.scope.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="font-semibold text-lg mb-2">Requirements</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {project.requirements.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="font-semibold text-lg mb-2">Project Timeline</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Start Date</div>
                            <div className="font-medium">{new Date(project.startDate).toLocaleDateString()}</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-500">Deadline</div>
                            <div className="font-medium">{new Date(project.deadline).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <h3 className="font-semibold text-lg mb-2">Project Images</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {project.images.map((image, index) => (
                            <div key={index} className="rounded-lg overflow-hidden">
                              <img src={image} alt={`Project image ${index + 1}`} className="w-full h-48 object-cover" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="contract">
                  <Card>
                    <CardHeader>
                      <CardTitle>Service Contract</CardTitle>
                      <CardDescription>
                        These are the terms defined by the client for this project
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                        <div className="flex items-start mb-6">
                          <FileText className="text-ttc-blue-700 mr-3" size={24} />
                          <div>
                            <h3 className="font-semibold text-lg mb-1">Project Service Contract</h3>
                            <p className="text-sm text-gray-600">
                              This contract outlines the terms and conditions for the {project.title} project.
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-ttc-neutral-800 mb-1">Payment Terms</h4>
                            <p className="text-sm text-gray-600">{project.contractTerms.paymentSchedule}</p>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium text-ttc-neutral-800 mb-1">Warranty</h4>
                            <p className="text-sm text-gray-600">{project.contractTerms.warranty}</p>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium text-ttc-neutral-800 mb-1">Insurance Requirements</h4>
                            <p className="text-sm text-gray-600">{project.contractTerms.insurance}</p>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium text-ttc-neutral-800 mb-1">Cancellation Policy</h4>
                            <p className="text-sm text-gray-600">{project.contractTerms.cancellation}</p>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-medium text-ttc-neutral-800 mb-1">Additional Costs</h4>
                            <p className="text-sm text-gray-600">{project.contractTerms.additionalCosts}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <div className="flex items-start">
                            <AlertTriangle className="text-amber-500 mr-3" size={20} />
                            <p className="text-sm text-gray-600">
                              By submitting a bid or accepting this project, you agree to these terms. If you have questions about the contract, please contact the client before submitting your proposal.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="client">
                  <Card>
                    <CardHeader>
                      <CardTitle>About the Client</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 rounded-full bg-ttc-blue-100 flex items-center justify-center text-ttc-blue-700 font-bold text-xl mr-4">
                          {project.clientName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{project.clientName}</h3>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={i < Math.floor(project.clientRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
                              />
                            ))}
                            <span className="ml-1 text-sm text-gray-600">{project.clientRating}</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Member since {new Date(project.clientJoined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-ttc-blue-700">{project.completedProjects}</div>
                          <div className="text-sm text-gray-600">Projects Completed</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-ttc-blue-700">100%</div>
                          <div className="text-sm text-gray-600">Payment Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Proposal</CardTitle>
                  <CardDescription>
                    You can either accept the client's budget or make a counteroffer.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!bidSubmitted ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Bid Amount (TTD)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                          <Input 
                            type="number"
                            placeholder="Enter your bid amount"
                            className="pl-10"
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value ? Number(e.target.value) : '')}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Client's budget: ${project.budget}</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Proposal Message</label>
                        <Textarea 
                          placeholder="Describe why you're the right professional for this project..."
                          className="min-h-32"
                          value={bidMessage}
                          onChange={(e) => setBidMessage(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-50 p-4 rounded-lg text-green-800 border border-green-200">
                      <div className="flex items-center mb-2">
                        <Check className="mr-2" size={20} />
                        <h3 className="font-medium">Proposal Submitted!</h3>
                      </div>
                      <p className="text-sm">
                        Your proposal has been sent to the client. They will review it and get back to you soon.
                      </p>
                    </div>
                  )}
                </CardContent>
                
                {!bidSubmitted && (
                  <CardFooter className="flex flex-col gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-ttc-blue-700 hover:bg-ttc-blue-800">
                          {bidAmount === project.budget ? "Accept Project Price" : "Submit Counteroffer"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Submission</DialogTitle>
                          <DialogDescription>
                            You are about to submit a {bidAmount === project.budget ? "proposal at the client's budget" : "counteroffer"} of ${bidAmount} for this project.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                          <p className="text-sm text-gray-600 mb-4">
                            By proceeding, you agree to the terms in the service contract and commit to completing the project according to the outlined specifications if selected.
                          </p>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => {}}>Cancel</Button>
                          <Button 
                            onClick={bidAmount === project.budget ? acceptClientPrice : handleBidSubmission}
                            className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
                          >
                            Confirm Submission
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    {bidAmount === project.budget && (
                      <Button variant="outline" className="w-full" onClick={() => setBidAmount('')}>
                        Make a Counteroffer
                      </Button>
                    )}
                    
                    {bidAmount !== project.budget && bidAmount !== '' && (
                      <Button variant="outline" className="w-full" onClick={() => setBidAmount(project.budget)}>
                        Accept Client's Budget
                      </Button>
                    )}
                  </CardFooter>
                )}
              </Card>
              
              <div className="mt-6 bg-ttc-blue-50 p-4 rounded-lg border border-ttc-blue-100">
                <h3 className="font-medium text-ttc-blue-800 mb-2">Why work on this project?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <Check className="mr-2 text-ttc-blue-700 mt-0.5" size={16} />
                    <span className="text-sm">Fixed price project with clear scope</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 text-ttc-blue-700 mt-0.5" size={16} />
                    <span className="text-sm">Client has completed 3 previous projects</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 text-ttc-blue-700 mt-0.5" size={16} />
                    <span className="text-sm">Clear service contract with payment terms</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDetails;
