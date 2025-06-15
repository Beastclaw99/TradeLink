
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: {
    id: string;
    title: string;
    description: string | null;
    client?: {
      first_name?: string | null;
      last_name?: string | null;
      profile_image_url?: string | null;
      rating?: number | null;
      completed_projects?: number | null;
    };
    budget: number | null;
    timeline?: string | null;
    location?: string | null;
    created_at?: string | null;
    category?: string | null;
    urgency?: string | null;
    requirements?: string[] | null;
    recommended_skills?: string[] | null;
    rich_description?: string | null;
    scope?: string | null;
    status?: string | null;
    // More fields if necessary
  } | null;
}

const formatCurrency = (amount: number | null) => {
  if (amount == null) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

const formatDate = (date: string | null | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({ open, onOpenChange, project }) => {
  if (!project) return null;
  const {
    title,
    description,
    client,
    budget,
    timeline,
    location,
    created_at,
    category,
    urgency,
    requirements,
    recommended_skills,
    rich_description,
    scope,
    status
  } = project;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex flex-wrap items-center">
            {title}
            {urgency && (
              <Badge variant={urgency === "high" ? "destructive" : "default"} className="ml-3">{urgency} priority</Badge>
            )}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-6 text-base mt-2">
            <span><b>Category:</b> {category || "N/A"}</span>
            <span><b>Posted:</b> {formatDate(created_at)}</span>
            <span><b>Status:</b> {status || "Open"}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="divide-y space-y-4 my-4">
          <div>
            <h3 className="font-semibold mb-2">Project Description</h3>
            <p className="prose max-w-none">{rich_description || description || "No description provided."}</p>
          </div>
          {scope && (
            <div className="pt-4">
              <h3 className="font-semibold mb-2">Scope</h3>
              <p className="text-gray-700">{scope}</p>
            </div>
          )}
          <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold">Budget</h4>
              <p>{formatCurrency(budget)}</p>
            </div>
            <div>
              <h4 className="font-semibold">Timeline</h4>
              <p>{timeline || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Location</h4>
              <p>{location || "Remote"}</p>
            </div>
            <div>
              <h4 className="font-semibold">Required Skills</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {(requirements && requirements.length > 0
                  ? requirements
                  : (recommended_skills || [])
                ).map(skill => (
                  <Badge key={skill} variant="outline">{skill}</Badge>
                ))}
                {( (!requirements || requirements.length === 0) &&
                    (!recommended_skills || recommended_skills.length === 0)
                  ) && (
                    <span className="text-gray-400">None listed</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h4 className="font-semibold mb-2">Client Details</h4>
          {client ? (
            <div className="flex items-center gap-4">
              {client.profile_image_url && (
                <img src={client.profile_image_url} alt="Client" className="h-10 w-10 rounded-full object-cover" />
              )}
              <span>
                <b>{client.first_name} {client.last_name}</b>
                <span className="block text-sm text-gray-500">{client.completed_projects || 0} completed projects</span>
                {client.rating !== undefined && client.rating !== null && (
                  <span className="block text-sm text-yellow-700 font-medium">★ {client.rating.toFixed(1)}/5</span>
                )}
              </span>
            </div>
          ) : (
            <span className="text-gray-500">No client details available</span>
          )}
        </div>
        <DialogFooter className="flex flex-row justify-end gap-2 mt-8">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {/* Optionally, add an Apply button or other CTAs here */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;
