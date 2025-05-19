
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Review, Project } from '../types';

interface ProfileTabProps {
  profile: any;
  skills: string[];
  reviews: Review[];
  projects: Project[];
  userId: string;
  calculateAverageRating: () => string;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ 
  profile, 
  skills, 
  reviews, 
  projects, 
  userId, 
  calculateAverageRating 
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Your Profile</h2>
        <Button 
          onClick={() => {
            window.location.href = '/profile';
          }}
          className="bg-ttc-blue-700 hover:bg-ttc-blue-800"
        >
          View Full Profile
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p>{profile?.first_name} {profile?.last_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Skills</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {profile?.skills && profile.skills.length > 0 ? (
                    profile.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Rating & Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star 
                    key={star} 
                    className={`w-5 h-5 ${
                      star <= Number(calculateAverageRating()) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-lg font-bold">{calculateAverageRating()}</span>
              <span className="ml-2 text-gray-500">({reviews.length} reviews)</span>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Projects Completed</h3>
              <p>{projects.filter(p => p.status === 'completed' && p.assigned_to === userId).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProfileTab;
