
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Review } from '../dashboard/types';

const ReviewModeration: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'reported'>('all');

  // Mock data with proper typing
  const mockReviews: Review[] = [
    {
      id: '1',
      rating: 5,
      comment: 'Great work!',
      status: 'approved',
      created_at: '2024-01-15',
      client_id: 'client1',
      professional_id: 'prof1',
      project_id: 'proj1',
      is_verified: true
    },
    {
      id: '2',
      rating: 2,
      comment: 'Poor quality work',
      status: 'reported',
      created_at: '2024-01-14',
      client_id: 'client2',
      professional_id: 'prof2',
      project_id: 'proj2',
      is_verified: false,
      reported_at: '2024-01-16',
      report_reason: 'Inappropriate content'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Review Moderation</h2>
        
        <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All Reviews</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4">
        {mockReviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Review #{review.id}</CardTitle>
                <Badge variant={review.status === 'reported' ? 'destructive' : 'default'}>
                  {review.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Rating:</strong> {review.rating}/5</p>
                <p><strong>Comment:</strong> {review.comment}</p>
                <p><strong>Date:</strong> {new Date(review.created_at).toLocaleDateString()}</p>
                {review.report_reason && (
                  <p><strong>Report Reason:</strong> {review.report_reason}</p>
                )}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  Approve
                </Button>
                <Button size="sm" variant="destructive">
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReviewModeration;
