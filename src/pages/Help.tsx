
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Search, BookOpen, MessageCircle, Phone } from 'lucide-react';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const faqCategories = [
    {
      title: "Getting Started",
      questions: [
        {
          id: "1",
          question: "How do I create an account?",
          answer: "Click the 'Sign Up' button in the top right corner and choose whether you're a client or professional. Fill out the required information and verify your email address."
        },
        {
          id: "2",
          question: "What's the difference between client and professional accounts?",
          answer: "Client accounts are for people who need services (posting projects), while professional accounts are for service providers (applying to projects and offering services)."
        },
        {
          id: "3",
          question: "How do I complete my profile?",
          answer: "Go to your dashboard and click on the Profile tab. Add your skills, certifications, portfolio images, and contact information to create a complete profile."
        }
      ]
    },
    {
      title: "For Clients",
      questions: [
        {
          id: "4",
          question: "How do I post a project?",
          answer: "From your dashboard, click 'Post New Project', fill out the project details including description, budget, timeline, and requirements. Your project will be visible to professionals immediately."
        },
        {
          id: "5",
          question: "How do I choose the right professional?",
          answer: "Review applications carefully, check professional profiles, ratings, previous work samples, and communicate with applicants before making your decision."
        },
        {
          id: "6",
          question: "How does payment work?",
          answer: "Payments are processed securely through our platform. You can pay by milestone or upon project completion. Funds are held securely until work is completed to your satisfaction."
        }
      ]
    },
    {
      title: "For Professionals",
      questions: [
        {
          id: "7",
          question: "How do I find projects to apply for?",
          answer: "Browse the Project Marketplace or check your dashboard's 'Available Projects' tab. Use filters to find projects that match your skills and location."
        },
        {
          id: "8",
          question: "How do I submit a strong application?",
          answer: "Write a personalized proposal explaining your approach, relevant experience, and why you're the best fit. Include a competitive but fair bid and realistic timeline."
        },
        {
          id: "9",
          question: "When do I get paid?",
          answer: "Payment is released when the client marks milestones as complete or when the full project is completed and approved. Typical processing time is 2-3 business days."
        }
      ]
    },
    {
      title: "Technical Support",
      questions: [
        {
          id: "10",
          question: "I'm having trouble uploading files",
          answer: "Ensure your files are under 10MB and in supported formats (JPG, PNG, PDF). Clear your browser cache and try again. Contact support if issues persist."
        },
        {
          id: "11",
          question: "Why can't I see my messages?",
          answer: "Check your internet connection and refresh the page. Messages may take a few seconds to load. If problems continue, try logging out and back in."
        },
        {
          id: "12",
          question: "How do I reset my password?",
          answer: "Click 'Forgot Password' on the login page, enter your email address, and follow the instructions sent to your email to reset your password."
        }
      ]
    }
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Help Centre</h1>
            <p className="text-gray-600 mb-6">
              Find answers to commonly asked questions and get help using ProLinkTT
            </p>
            
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search for help..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="space-y-6">
                {filteredCategories.map((category) => (
                  <Card key={category.title}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        {category.title}
                        <Badge variant="secondary">{category.questions.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {category.questions.map((qa) => (
                          <Collapsible key={qa.id}>
                            <CollapsibleTrigger
                              onClick={() => toggleItem(qa.id)}
                              className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50 border"
                            >
                              <span className="font-medium">{qa.question}</span>
                              <ChevronDown 
                                className={`h-4 w-4 transition-transform ${
                                  openItems.includes(qa.id) ? 'rotate-180' : ''
                                }`} 
                              />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-3 py-2">
                              <p className="text-gray-600 text-sm leading-relaxed">
                                {qa.answer}
                              </p>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredCategories.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No results found</h3>
                    <p className="text-gray-600">
                      Try adjusting your search terms or browse through the categories above.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Still need help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                    <MessageCircle className="h-5 w-5 text-ttc-blue-600" />
                    <div>
                      <div className="font-medium">Contact Support</div>
                      <div className="text-sm text-gray-600">Get personalized help</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                    <Phone className="h-5 w-5 text-ttc-blue-600" />
                    <div>
                      <div className="font-medium">Call Us</div>
                      <div className="text-sm text-gray-600">+1 (868) 123-4567</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Popular Articles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                      How to verify your professional account
                    </div>
                    <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                      Understanding ProLinkTT's fee structure
                    </div>
                    <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                      Best practices for project communication
                    </div>
                    <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                      Managing project deadlines and milestones
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
