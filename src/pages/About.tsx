import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Users, Target, Heart, Mail, Phone, MapPin } from 'lucide-react';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-6 text-ttc-blue-900">About ProLinkTT</h1>
          <p className="text-xl text-ttc-neutral-600 max-w-3xl mx-auto">
            Connecting skilled trade professionals with clients across Trinidad and Tobago, 
            building a stronger, more efficient marketplace for quality services.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-ttc-blue-700" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ttc-neutral-600">
                To revolutionize the trade services industry in Trinidad and Tobago by creating a trusted platform 
                that connects skilled professionals with clients, ensuring quality service delivery and fostering 
                economic growth in our local communities.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-ttc-blue-700" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ttc-neutral-600">
                To become the leading platform for trade services in the Caribbean, known for reliability, 
                quality, and innovation in connecting professionals with opportunities that drive success 
                for all stakeholders.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-ttc-blue-700" />
                Our Story
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-ttc-neutral-600 mb-4">
                Founded in 2024, ProLinkTT emerged from a simple observation: finding reliable trade professionals 
                in Trinidad and Tobago was challenging, while skilled professionals struggled to find consistent work.
              </p>
              <p className="text-ttc-neutral-600">
                We created a platform that bridges this gap, leveraging technology to create meaningful connections 
                and opportunities for growth in our local trade industry.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-ttc-blue-900">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trust & Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ttc-neutral-600">
                  Building a community based on verified professionals and transparent service delivery.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quality & Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ttc-neutral-600">
                  Maintaining high standards in service delivery and professional conduct.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ttc-neutral-600">
                  Supporting the development of local trade professionals and businesses.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center text-ttc-blue-900">Our Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Leadership Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ttc-neutral-600">
                  Experienced professionals dedicated to building the future of trade services in Trinidad and Tobago.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Support Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ttc-neutral-600">
                  Committed to providing excellent service and support to our community members.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Technology Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-ttc-neutral-600">
                  Building and maintaining a secure, efficient platform for our users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-ttc-neutral-100 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-ttc-blue-900">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Mail className="h-6 w-6 text-ttc-blue-700 mb-2" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-ttc-neutral-600">contact@prolinktt.com</p>
            </div>
            <div className="flex flex-col items-center">
              <Phone className="h-6 w-6 text-ttc-blue-700 mb-2" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-ttc-neutral-600">+1 (868) XXX-XXXX</p>
            </div>
            <div className="flex flex-col items-center">
              <MapPin className="h-6 w-6 text-ttc-blue-700 mb-2" />
              <h3 className="font-semibold mb-2">Location</h3>
              <p className="text-ttc-neutral-600">Port of Spain, Trinidad & Tobago</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
