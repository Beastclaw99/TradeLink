
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, BookOpen, Video, Download } from 'lucide-react';

const Resources: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Resources</h1>
          <p className="text-gray-600 mb-8">
            Helpful guides, templates, and tools for professionals and clients
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Templates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Ready-to-use project description templates for common trade work.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Home Renovation Template</span>
                    <Download className="h-4 w-4 text-ttc-blue-600 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Electrical Work Template</span>
                    <Download className="h-4 w-4 text-ttc-blue-600 cursor-pointer" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plumbing Service Template</span>
                    <Download className="h-4 w-4 text-ttc-blue-600 cursor-pointer" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  User Guides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Step-by-step guides to help you get the most out of ProLinkTT.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                    How to Post Your First Project
                  </div>
                  <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                    Finding the Right Professional
                  </div>
                  <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                    Managing Project Communications
                  </div>
                  <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                    Payment Processing Guide
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Watch video tutorials to learn platform features quickly.
                </p>
                <div className="space-y-2">
                  <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                    Platform Overview (5 min)
                  </div>
                  <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                    Creating Professional Profile (8 min)
                  </div>
                  <div className="text-sm text-ttc-blue-600 cursor-pointer hover:underline">
                    Project Management Tips (12 min)
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>FAQ - Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">How do I get started as a professional?</h4>
                    <p className="text-gray-600 text-sm">
                      Create your professional profile, upload your certifications, and start applying to projects that match your skills.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What payment methods are accepted?</h4>
                    <p className="text-gray-600 text-sm">
                      We accept all major credit cards, bank transfers, and mobile payment solutions popular in Trinidad & Tobago.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How are professionals verified?</h4>
                    <p className="text-gray-600 text-sm">
                      All professionals undergo background checks, certification verification, and reference validation before joining our platform.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resources;
