
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, DollarSign, Star, TrendingUp, Briefcase, Filter } from "lucide-react";
import ProjectDiscoveryCard from './enhanced/ProjectDiscoveryCard';
import { Project, Application } from '../types';

interface AvailableProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  skills: string[];
  selectedProject: string | null;
  setSelectedProject: (projectId: string | null) => void;
}

const AvailableProjectsTab: React.FC<AvailableProjectsTabProps> = ({ 
  isLoading, 
  projects, 
  skills,
  selectedProject,
  setSelectedProject
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Filter projects to only show open ones
  const openProjects = projects.filter(p => p.status === 'open');

  // Apply filters
  const filteredProjects = openProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
    
    const matchesBudget = budgetFilter === 'all' || (
      budgetFilter === 'under_1000' && (project.budget || 0) < 1000 ||
      budgetFilter === '1000_5000' && (project.budget || 0) >= 1000 && (project.budget || 0) <= 5000 ||
      budgetFilter === 'over_5000' && (project.budget || 0) > 5000
    );
    
    const matchesUrgency = urgencyFilter === 'all' || project.urgency === urgencyFilter;
    
    const matchesLocation = locationFilter === 'all' || project.location?.includes(locationFilter);

    return matchesSearch && matchesCategory && matchesBudget && matchesUrgency && matchesLocation;
  });

  // Calculate skill matches for recommendations
  const getSkillMatchPercentage = (project: Project) => {
    const projectSkills = Array.isArray(project.recommended_skills) 
      ? project.recommended_skills 
      : (project.recommended_skills?.split(',').map(skill => skill.trim()) || []);
    
    if (!projectSkills.length || !skills.length) return 0;
    
    const matchingSkills = projectSkills.filter(skill => 
      skills.some(userSkill => 
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );
    
    return Math.round((matchingSkills.length / projectSkills.length) * 100);
  };

  // Sort projects by skill match and urgency
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    const aMatch = getSkillMatchPercentage(a);
    const bMatch = getSkillMatchPercentage(b);
    
    if (aMatch !== bMatch) return bMatch - aMatch;
    
    const urgencyOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 };
    const aUrgency = urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 0;
    const bUrgency = urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 0;
    
    return bUrgency - aUrgency;
  });

  const handleApply = (projectId: string) => {
    setSelectedProject(projectId);
  };

  const getUniqueValues = (field: keyof Project) => {
    return [...new Set(openProjects.map(p => p[field]).filter(Boolean))];
  };

  const categories = getUniqueValues('category');
  const locations = getUniqueValues('location');

  return (
    <>
      <div className="flex items-center mb-8">
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Available Projects</h2>
          <p className="text-ttc-neutral-600">Find projects that match your skills</p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {filteredProjects.length}
          </div>
          <div className="text-sm text-ttc-neutral-500">Open Projects</div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filter Projects
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                  <SelectItem key={category} value={category as string}>
                    {category as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Budget Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="under_1000">Under $1,000</SelectItem>
                <SelectItem value="1000_5000">$1,000 - $5,000</SelectItem>
                <SelectItem value="over_5000">Over $5,000</SelectItem>
              </SelectContent>
            </Select>

            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgencies</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location as string}>
                    {location as string}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <p>Loading available projects...</p>
      ) : sortedProjects.length === 0 ? (
        <div className="text-center py-8">
          <Briefcase className="w-12 h-12 mx-auto text-ttc-neutral-400" />
          <p className="mt-4 text-ttc-neutral-600">
            {searchTerm || categoryFilter !== 'all' || budgetFilter !== 'all' || urgencyFilter !== 'all' || locationFilter !== 'all'
              ? 'No projects match your current filters.'
              : 'No projects available right now.'
            }
          </p>
          <p className="mt-2 text-sm text-ttc-neutral-500">
            {searchTerm || categoryFilter !== 'all' || budgetFilter !== 'all' || urgencyFilter !== 'all' || locationFilter !== 'all'
              ? 'Try adjusting your filters to see more projects.'
              : 'Check back later for new opportunities.'
            }
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {sortedProjects.map(project => (
            <ProjectDiscoveryCard
              key={project.id}
              project={project}
              userSkills={skills}
              onApply={handleApply}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AvailableProjectsTab;
