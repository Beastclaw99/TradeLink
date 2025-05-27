
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, Book, Video, FileText, Users } from 'lucide-react';

const Help: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const faqCategories = [
    {
      title: "Getting Started",
      icon: <Book className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I create my professional profile?",
          answer: "To create your profile, go to Dashboard > Profile tab. Fill in your personal information, skills, certifications, work history, and rates. Upload high-quality photos of your previous work to showcase your expertise."
        },
        {
          question: "How do I find and apply for projects?",
          answer: "Visit the 'Available Projects' tab in your dashboard to browse open projects. Use filters to find projects that match your skills and location. Click 'Apply' to submit a proposal with your bid amount and cover letter."
        },
        {
          question: "What information should I include in my proposal?",
          answer: "Include a detailed description of how you'll approach the project, your timeline, materials needed, and a competitive but fair bid amount. Mention relevant experience and certifications."
        }
      ]
    },
    {
      title: "Managing Projects",
      icon: <FileText className="h-5 w-5" />,
      faqs: [
        {
          question: "How do I communicate with clients?",
          answer: "Use the built-in messaging system to communicate with clients. You can access messages through the 'Messages' tab in your dashboard or sidebar. Keep all project-related communication on the platform."
        },
        {
          question: "How do I track project progress?",
          answer: "Use the project timeline feature to log updates, share photos of work progress, and keep clients informed. Regular updates help build trust and ensure project success."
        },
        {
          question: "What should I do if there's a dispute?",
          answer: "Contact our support team immediately through the 'Contact Support' option. We provide mediation services to help resolve disputes fairly for both parties."
        }
      ]
    },
    {
      title: "Payments & Billing",
      icon: <Users className="h-5 w-5" />,
      faqs: [
        {
          question: "How and when do I get paid?",
          answer: "Payments are processed through our secure platform after project completion and client approval. Funds are typically available in your account within 3-5 business days."
        },
        {
          question: "What are the platform fees?",
          answer: "ProLinkTT charges a small service fee on completed projects. The exact percentage depends on your membership tier and project value. See our pricing page for details."
        },
        {
          question: "Can I negotiate rates with clients?",
          answer: "Yes, you can discuss and negotiate rates with clients before accepting a project. Make sure both parties agree on the final terms before starting work."
        }
      ]
    }
  ];

  const helpResources = [
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      icon: <Video className="h-6 w-6" />,
      count: "12 videos"
    },
    {
      title: "User Guides",
      description: "Detailed written instructions",
      icon: <Book className="h-6 w-6" />,
      count: "8 guides"
    },
    {
      title: "Community Forum",
      description: "Connect with other professionals",
      icon: <Users className="h-6 w-6" />,
      count: "500+ members"
    }
  ];

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Help Centre</h1>
          <p className="text-gray-600 mb-6">Find answers to your questions and learn how to make the most of ProLinkTT</p>
          
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Help Resources */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {helpResources.map((resource, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="text-ttc-blue-600 mb-4 flex justify-center">
                  {resource.icon}
                </div>
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <p className="text-xs text-ttc-blue-600 font-medium">{resource.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="text-ttc-blue-600">{category.icon}</div>
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-gray-600">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="bg-ttc-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-bold text-ttc-blue-800 mb-4">Still need help?</h3>
          <p className="text-ttc-blue-600 mb-6">
            Can't find the answer you're looking for? Our support team is ready to help you succeed.
          </p>
          <Button className="bg-ttc-blue-600 hover:bg-ttc-blue-700">
            Contact Support
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Help;
