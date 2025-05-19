
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";
import { Project, Review } from '../types';

interface PaymentsTabProps {
  isLoading: boolean;
  projects: Project[];
  reviews: Review[];
  applications: any[];
  projectToReview: Project | null;
  reviewData: { rating: number; comment: string };
  isSubmitting: boolean;
  handleReviewInitiate: (project: Project) => void;
  handleReviewCancel: () => void;
  handleReviewSubmit: () => Promise<void>;
  setReviewData: (data: { rating: number; comment: string }) => void;
}

const PaymentsTab: React.FC<PaymentsTabProps> = ({ 
  isLoading, 
  projects, 
  reviews,
  applications,
  projectToReview,
  reviewData,
  isSubmitting,
  handleReviewInitiate,
  handleReviewCancel,
  handleReviewSubmit,
  setReviewData
}) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Payments</h2>
      {isLoading ? (
        <p>Loading payments...</p>
      ) : projects.filter(p => p.status === 'paid').length === 0 ? (
        <div className="text-center py-8">
          <p className="text-ttc-neutral-600">You don't have any paid projects yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects
            .filter(p => p.status === 'paid')
            .map(project => {
              // Find the accepted application for this project to get professional info
              const acceptedApp = applications.find(app => 
                app.project_id === project.id && app.status === 'accepted'
              );
              
              // Check if this project has a review
              const hasReview = reviews.some(r => r.project_id === project.id);
              
              return (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription className="flex items-center justify-between">
                      <span>Completed</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        project.status === 'archived' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {project.status === 'archived' ? 'Reviewed' : 'Completed'}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-ttc-neutral-600 mb-4">{project.description}</p>
                    <p className="font-medium">Budget: ${project.budget}</p>
                    
                    {acceptedApp && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="font-medium">Completed by:</p>
                        <p>{acceptedApp.professional?.first_name} {acceptedApp.professional?.last_name}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    {!hasReview && project.status === 'completed' ? (
                      <Button 
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                        onClick={() => handleReviewInitiate(project)}
                      >
                        <Star className="w-4 h-4 mr-2" /> Leave a Review
                      </Button>
                    ) : hasReview ? (
                      <p className="text-sm text-center w-full text-green-600">
                        Review submitted
                      </p>
                    ) : (
                      <p className="text-sm text-center w-full text-gray-500">
                        Project archived
                      </p>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
        </div>
      )}
      
      {/* Review Dialog */}
      {projectToReview && (
        <Card className="mt-6 border-yellow-200">
          <CardHeader className="bg-yellow-50">
            <CardTitle>Leave a Review</CardTitle>
            <CardDescription>
              Share your experience with the professional who completed your project.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="rating" className="block mb-2">Rating</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Button 
                      key={star}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={`p-1 ${reviewData.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                    >
                      <Star className={`h-8 w-8 ${reviewData.rating >= star ? 'fill-yellow-500' : ''}`} />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="review-comment">Your Comments</Label>
                <Textarea 
                  id="review-comment" 
                  className="min-h-[120px]"
                  placeholder="Share details about your experience working with this professional..."
                  value={reviewData.comment}
                  onChange={e => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleReviewCancel}
            >
              Cancel
            </Button>
            <Button 
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={handleReviewSubmit}
              disabled={isSubmitting || reviewData.rating === 0}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default PaymentsTab;
