
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, DollarSign, Users, Clock } from 'lucide-react';

const Insights: React.FC = () => {
  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-2">Market Insights</h1>
          <p className="text-gray-600 mb-8">
            Stay informed with the latest trends and market data for trade services in Trinidad & Tobago
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Project Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">TTD 8,500</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Professionals</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +8% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4 hrs</div>
                <p className="text-xs text-muted-foreground">
                  -15% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Project Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground">
                  +2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Popular Service Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Electrical Work</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-ttc-blue-600 h-2 w-16 rounded"></div>
                      <span className="text-sm text-gray-600">32%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Plumbing</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-ttc-blue-500 h-2 w-12 rounded"></div>
                      <span className="text-sm text-gray-600">24%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Carpentry</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-ttc-blue-400 h-2 w-10 rounded"></div>
                      <span className="text-sm text-gray-600">19%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Painting</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-ttc-blue-300 h-2 w-8 rounded"></div>
                      <span className="text-sm text-gray-600">15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Other</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-ttc-blue-200 h-2 w-6 rounded"></div>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Port of Spain</span>
                    <span className="font-semibold">342 projects</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>San Fernando</span>
                    <span className="font-semibold">298 projects</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Chaguanas</span>
                    <span className="font-semibold">256 projects</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Arima</span>
                    <span className="font-semibold">189 projects</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Point Fortin</span>
                    <span className="font-semibold">124 projects</span>
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

export default Insights;
