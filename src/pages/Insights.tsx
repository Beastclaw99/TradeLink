
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, DollarSign, Briefcase, Users } from 'lucide-react';

const Insights: React.FC = () => {
  const marketInsights = [
    {
      title: "Average Project Rates",
      value: "$85/hour",
      change: "+12%",
      icon: <DollarSign className="h-6 w-6" />,
      trend: "up"
    },
    {
      title: "Popular Project Types",
      value: "Electrical, Plumbing",
      change: "This month",
      icon: <Briefcase className="h-6 w-6" />,
      trend: "neutral"
    },
    {
      title: "Active Clients",
      value: "2,340",
      change: "+8%",
      icon: <Users className="h-6 w-6" />,
      trend: "up"
    },
    {
      title: "Market Demand",
      value: "High",
      change: "+15%",
      icon: <TrendingUp className="h-6 w-6" />,
      trend: "up"
    }
  ];

  return (
    <Layout>
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Market Insights</h1>
          <p className="text-gray-600">Stay informed about market trends and opportunities in your industry.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {marketInsights.map((insight, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
                <div className="text-ttc-blue-600">{insight.icon}</div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{insight.value}</div>
                <p className={`text-xs ${
                  insight.trend === 'up' ? 'text-green-600' : 
                  insight.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {insight.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Industry Trends</CardTitle>
              <CardDescription>Key developments in the trade industry</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-ttc-blue-500 pl-4">
                <h4 className="font-semibold">Green Energy Projects Growing</h4>
                <p className="text-sm text-gray-600">Solar panel installations up 45% this quarter</p>
              </div>
              <div className="border-l-4 border-ttc-green-500 pl-4">
                <h4 className="font-semibold">Smart Home Integration</h4>
                <p className="text-sm text-gray-600">Increasing demand for IoT and automation work</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold">Emergency Repairs</h4>
                <p className="text-sm text-gray-600">Higher rates for urgent plumbing and electrical work</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Opportunity Alerts</CardTitle>
              <CardDescription>Projects that match your skills</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-ttc-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-ttc-blue-800">High-Value Commercial Project</h4>
                <p className="text-sm text-ttc-blue-600">$25,000 electrical renovation - Downtown Port of Spain</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Repeat Client Available</h4>
                <p className="text-sm text-green-600">Previous 5-star client posted new plumbing project</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-semibold text-yellow-800">Urgent Project</h4>
                <p className="text-sm text-yellow-600">Emergency HVAC repair - Premium rates offered</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Insights;
