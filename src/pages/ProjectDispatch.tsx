
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ProjectDispatch: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container-custom">
          <Button 
            variant="outline" 
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            ← Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold mb-6">Project Dispatch</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Project ID: {projectId}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-yellow-800 mb-2">Feature Under Development</h3>
                <p className="text-yellow-700">
                  The project dispatch feature is currently being developed. This will allow you to 
                  manage project assignments, track progress, and coordinate with professionals.
                </p>
              </div>
              
              <div className="mt-6 space-y-4">
                <h4 className="font-semibold">Planned Features:</h4>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Real-time project status tracking</li>
                  <li>Professional assignment management</li>
                  <li>Progress milestone updates</li>
                  <li>Communication hub for project stakeholders</li>
                  <li>Document and file sharing</li>
                  <li>Automated notifications and reminders</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProjectDispatch;
