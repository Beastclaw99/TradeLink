
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Briefcase, Search, Filter, SlidersHorizontal } from "lucide-react";
import { Project, Application } from '../types';
import ProjectDiscoveryCard from './enhanced/ProjectDiscoveryCard';

interface AvailableProjectsTabProps {
  isLoading: boolean;
  projects: Project[];
  applications: Application[];
  skills: string[];
  selectedProject: string | null;
  setSelectedProject: (id: string | null) => void;
  bidAmount: number | null;
  setBidAmount: (amount: number | null) => void;
}

const AvailableProjectsTab: React.FC<AvailableProjectsTabProps> = ({
  isLoading,
  projects,
  applications,
  skills,
  setSelectedProject,
  setBidAmount
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');
  const [skillMatchFilter, setSkillMatchFilter] = useState('all');

  const availableProjects = projects.filter(p => p.status === 'open');
  
  // Apply filters
  const filteredProjects = availableProjects.filter(project => {
    // Search filter
    const matchesSearch = !searchTerm || 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Category filter
    const matchesCategory = categoryFilter === 'all' || 
      (project.category && project.category.toLowerCase() === categoryFilter.toLowerCase());
    
    // Urgency filter
    const matchesUrgency = urgencyFilter === 'all' || 
      (project.urgency && project.urgency.toLowerCase() === urgencyFilter.toLowerCase());
    
    // Budget filter
    let matchesBudget = true;
    if (budgetFilter !== 'all' && project.budget) {
      switch (budgetFilter) {
        case 'under-1k':
          matchesBudget = project.budget < 1000;
          break;
        case '1k-5k':
          matchesBudget = project.budget >= 1000 && project.budget <= 5000;
          break;
        case '5k-10k':
          matchesBudget = project.budget >= 5000 && project.budget <= 10000;
          break;
        case 'over-10k':
          matchesBudget = project.budget > 10000;
          break;
      }
    }
    
    // Skill match filter
    let matchesSkillFilter = true;
    if (skillMatchFilter !== 'all') {
      const requiredSkills = Array.isArray(project.required_skills) 
        ? project.required_skills 
        : typeof project.required_skills === 'string' 
          ? project.required_skills.split(',').map(s => s.trim())
          : [];
      
      const matchingSkills = skills.filter(skill => 
        requiredSkills.some(reqSkill => 
          reqSkill.toLowerCase().includes(skill.toLowerCase()) ||
          skill.toLowerCase().includes(reqSkill.toLowerCase())
        )
      );
      
      const skillMatchPercentage = requiredSkills.length > 0 
        ? Math.round((matchingSkills.length / requiredSkills.length) * 100) 
        : 100;
      
      switch (skillMatchFilter) {
        case 'high-match':
          matchesSkillFilter = skillMatchPercentage >= 80;
          break;
        case 'medium-match':
          matchesSkillFilter = skillMatchPercentage >= 50 && skillMatchPercentage < 80;
          break;
        case 'low-match':
          matchesSkillFilter = skillMatchPercentage < 50;
          break;
      }
    }
    
    return matchesSearch && matchesCategory && matchesUrgency && matchesBudget && matchesSkillFilter;
  });

  const handleApplyToProject = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    setSelectedProject(projectId);
    if (project?.budget) {
      setBidAmount(project.budget);
    }
  };

  const getUniqueCategories = () => {
    const categories = availableProjects
      .map(p => p.category)
      .filter(Boolean) as string[];
    return [...new Set(categories)];
  };

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Discover Projects</h2>
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600">Your Skills:</span>
            {skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index} 
                className="px-2 py-1 bg-ttc-blue-50 text-ttc-blue-700 text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {getUniqueCategories().map(category => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Urgency Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency Levels</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={budgetFilter} onValueChange={setBudgetFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Budgets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Budgets</SelectItem>
                <SelectItem value="under-1k">Under $1,000</SelectItem>
                <SelectItem value="1k-5k">$1,000 - $5,000</SelectItem>
                <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                <SelectItem value="over-10k">Over $10,000</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={skillMatchFilter} onValueChange={setSkillMatchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Skill Matches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skill Matches</SelectItem>
                <SelectItem value="high-match">High Match (80%+)</SelectItem>
                <SelectItem value="medium-match">Medium Match (50-79%)</SelectItem>
                <SelectItem value="low-match">Low Match (&lt;50%)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setUrgencyFilter('all');
                setBudgetFilter('all');
                setSkillMatchFilter('all');
              }}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Clear Filters
            </Button>
          </div>
          
          <div className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {availableProjects.length} available projects
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded-md w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded-md w-full"></div>
                <div className="h-4 bg-gray-200 rounded-md w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="w-16 h-16 mx-auto text-ttc-neutral-400 mb-4" />
          <h3 className="text-xl font-semibold text-ttc-neutral-700 mb-2">
            {availableProjects.length === 0 ? 'No Projects Available' : 'No Projects Match Your Filters'}
          </h3>
          <p className="text-ttc-neutral-600 mb-4">
            {availableProjects.length === 0 
              ? skills.length === 0 
                ? 'Add skills to your profile to see matching projects.'
                : 'Check back later for new project opportunities.'
              : 'Try adjusting your filters to see more projects.'
            }
          </p>
          {availableProjects.length > 0 && (
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setUrgencyFilter('all');
                setBudgetFilter('all');
                setSkillMatchFilter('all');
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map(project => (
            <ProjectDiscoveryCard
              key={project.id}
              project={project}
              applications={applications}
              userSkills={skills}
              onApply={handleApplyToProject}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default AvailableProjectsTab;
