
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Briefcase, DollarSign, Clock, MapPin } from "lucide-react";
import { Project } from '../types';
import ProjectDiscoveryCard from './enhanced/ProjectDiscoveryCard';

interface AvailableProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  skills: string[];
  profile: any;
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
}

const AvailableProjectsTab: React.FC<AvailableProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  skills,
  profile,
  selectedProject,
  setSelectedProject
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const availableProjects = projects.filter(p => p.status === 'open');
  
  // Get all project skills safely
  const getProjectSkills = (project: Project): string[] => {
    return Array.isArray(project.required_skills) ? project.required_skills : [];
  };

  // Filter projects based on search and filters
  const filteredProjects = availableProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    
    const matchesBudget = budgetFilter === 'all' || 
                         (budgetFilter === 'low' && project.budget < 1000) ||
                         (budgetFilter === 'medium' && project.budget >= 1000 && project.budget < 5000) ||
                         (budgetFilter === 'high' && project.budget >= 5000);
    
    return matchesSearch && matchesCategory && matchesBudget;
  });

  // Sort projects
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'budget_high':
        return b.budget - a.budget;
      case 'budget_low':
        return a.budget - b.budget;
      default:
        return 0;
    }
  });

  const onApply = (projectId: string) => {
    setSelectedProject(projectId);
  };

  // Get unique categories
  const categories = Array.from(new Set(availableProjects.map(p => p.category).filter(Boolean)));

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Available Projects</h2>
          <p className="text-ttc-neutral-600">Find projects that match your skills</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {sortedProjects.length}
          </div>
          <div className="text-sm text-ttc-neutral-500">Open Projects</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={budgetFilter} onValueChange={setBudgetFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Budget Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Budgets</SelectItem>
              <SelectItem value="low">Under $1,000</SelectItem>
              <SelectItem value="medium">$1,000 - $5,000</SelectItem>
              <SelectItem value="high">Over $5,000</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="budget_high">Highest Budget</SelectItem>
              <SelectItem value="budget_low">Lowest Budget</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <p>Loading projects...</p>
      ) : sortedProjects.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">No projects found matching your criteria.</p>
          <p className="mt-2 text-sm text-ttc-neutral-500">
            Try adjusting your search filters or check back later for new opportunities.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {sortedProjects.map(project => (
            <ProjectDiscoveryCard
              key={project.id}
              project={project}
              userSkills={skills}
              onApply={onApply}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AvailableProjectsTab;
