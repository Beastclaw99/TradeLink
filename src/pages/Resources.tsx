
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Book, Video, Download } from 'lucide-react';

const Resources: React.FC = () => {
  const resourceCategories = [
    {
      title: "Industry Guides",
      icon: <Book className="h-6 w-6" />,
      items: [
        "Getting Started as a Trade Professional",
        "Best Practices for Project Management",
        "Safety Guidelines and Regulations",
        "Tools and Equipment Recommendations"
      ]
    },
    {
      title: "Documentation",
      icon: <FileText className="h-6 w-6" />,
      items: [
        "Platform User Manual",
        "API Documentation",
        "Terms of Service",
        "Privacy Policy"
      ]
    },
    {
      title: "Video Tutorials",
      icon: <Video className="h-6 w-6" />,
      items: [
        "Setting Up Your Profile",
        "Bidding on Projects",
        "Managing Client Communications",
        "Payment and Invoicing"
      ]
    },
    {
      title: "Downloads",
      icon: <Download className="h-6 w-6" />,
      items: [
        "Contract Templates",
        "Invoice Templates",
        "Project Checklist",
        "Safety Inspection Forms"
      ]
    }
  ];

  return (
    <Layout>
      <div className="bg-ttc-blue-800 py-12 text-white">
        <div className="container-custom">
          <h1 className="text-4xl font-bold mb-4">Resources</h1>
          <p className="text-xl text-blue-50">
            Everything you need to succeed on ProLinkTT - guides, documentation, and tools for trade professionals and clients.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {resourceCategories.map((category, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-ttc-blue-100 rounded-lg text-ttc-blue-600">
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
                <CardDescription>
                  Access {category.title.toLowerCase()} to help you navigate and succeed on our platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">{item}</span>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-ttc-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-ttc-blue-800 mb-4">Need More Help?</h2>
          <p className="text-ttc-blue-600 mb-6">
            Can't find what you're looking for? Our support team is here to help you succeed.
          </p>
          <div className="flex justify-center gap-4">
            <Button className="bg-ttc-blue-600 hover:bg-ttc-blue-700">
              Contact Support
            </Button>
            <Button variant="outline">
              Visit Help Center
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
