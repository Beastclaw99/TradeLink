import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Star, MessageSquare, CheckCircle, XCircle, Flag } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AdminReview } from './types';

const ReviewModeration: React.FC = () => {
  const { toast } = useToast();
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);
  const [moderationNotes, setModerationNotes] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('status', activeTab)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to match AdminReview interface
      const transformedReviews: AdminReview[] = (data || []).map(review => ({
        id: review.id,
        rating: review.rating || 0,
        comment: review.comment || '',
        status: (review.status as AdminReview['status']) || 'pending',
        reported_at: review.reported_at,
        reported_by: review.reported_by,
        report_reason: review.report_reason,
        created_at: review.created_at,
        client_id: review.client_id,
        professional_id: review.professional_id,
        project_id: review.project_id,
        communication_rating: review.communication_rating,
        quality_rating: review.quality_rating,
        timeliness_rating: review.timeliness_rating,
        professionalism_rating: review.professionalism_rating
      }));
      
      setReviews(transformedReviews);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to fetch reviews.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModeration = async (reviewId: string, action: 'approve' | 'reject') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({
          status: action === 'approve' ? 'approved' : 'rejected',
          moderated_at: new Date().toISOString(),
          moderation_notes: moderationNotes
        })
        .eq('id', reviewId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Review ${action === 'approve' ? 'approved' : 'rejected'} successfully.`
      });

      setSelectedReview(null);
      setModerationNotes('');
      fetchReviews();
    } catch (error: any) {
      console.error('Error moderating review:', error);
      toast({
        title: "Error",
        description: "Failed to moderate review.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: AdminReview['status']) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', text: 'Rejected' },
      reported: { color: 'bg-orange-100 text-orange-800', text: 'Reported' }
    };

    const config = statusConfig[status];
    return (
      <Badge className={config.color}>
        {config.text}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Review Moderation</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div>Loading reviews...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No reviews to moderate.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map(review => (
            <Card key={review.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Project Review
                  </CardTitle>
                  {getStatusBadge(review.status)}
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Overall Rating</Label>
                    <StarRating
                      value={review.rating}
                      onChange={() => {}}
                      className="mt-1"
                    />
                  </div>

                  {review.communication_rating && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Communication</Label>
                        <StarRating
                          value={review.communication_rating}
                          onChange={() => {}}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Quality</Label>
                        <StarRating
                          value={review.quality_rating || 0}
                          onChange={() => {}}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Timeliness</Label>
                        <StarRating
                          value={review.timeliness_rating || 0}
                          onChange={() => {}}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Professionalism</Label>
                        <StarRating
                          value={review.professionalism_rating || 0}
                          onChange={() => {}}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Review</Label>
                    <p className="mt-1 text-gray-700">{review.comment}</p>
                  </div>

                  {review.status === 'reported' && (
                    <Alert variant="destructive">
                      <Flag className="h-4 w-4" />
                      <AlertDescription>
                        <p className="font-medium">Reported on {new Date(review.reported_at!).toLocaleDateString()}</p>
                        <p className="mt-1">{review.report_reason}</p>
                      </AlertDescription>
                    </Alert>
                  )}

                  {review.status === 'pending' && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="moderation-notes">Moderation Notes</Label>
                        <Textarea
                          id="moderation-notes"
                          value={moderationNotes}
                          onChange={(e) => setModerationNotes(e.target.value)}
                          placeholder="Add notes about your moderation decision..."
                          className="mt-1"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleModeration(review.id, 'reject')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={() => handleModeration(review.id, 'approve')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewModeration;
