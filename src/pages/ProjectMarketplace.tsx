
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  DollarSign, 
  Filter, 
  Grid,
  LayoutList,
  MapPin, 
  Search,
  Tag, 
  Clock
} from 'lucide-react';

// Sample project data
const projects = [
  {
    id: 1,
    title: "Kitchen Renovation",
    description: "Complete renovation of a 15x10 kitchen including new cabinets, countertops, and appliance installation.",
    location: "Port of Spain",
    category: "Carpentry",
    budget: 15000,
    deadline: "2025-06-15",
    postedDate: "2025-05-10",
    clientName: "Michelle R.",
    clientRating: 4.8,
    status: "Open",
  },
  {
    id: 2,
    title: "Home Electrical Rewiring",
    description: "Complete rewiring of a 3-bedroom house with updated electrical panel installation.",
    location: "San Fernando",
    category: "Electrical",
    budget: 8000,
    deadline: "2025-06-30",
    postedDate: "2025-05-12",
    clientName: "John T.",
    clientRating: 4.5,
    status: "Open",
  },
  {
    id: 3,
    title: "Commercial Plumbing Repair",
    description: "Fix leaking pipes and install new bathroom fixtures in a small office building.",
    location: "Arima",
    category: "Plumbing",
    budget: 3500,
    deadline: "2025-05-25",
    postedDate: "2025-05-08",
    clientName: "Business Solutions Inc.",
    clientRating: 4.9,
    status: "Open",
  },
  {
    id: 4,
    title: "House Exterior Painting",
    description: "Paint the exterior of a 2-story house including trim and doors. Approximately 2500 sq ft area.",
    location: "Chaguanas",
    category: "Painting",
    budget: 7000,
    deadline: "2025-07-10",
    postedDate: "2025-05-14",
    clientName: "Sarah P.",
    clientRating: 4.7,
    status: "Open",
  },
  {
    id: 5,
    title: "Bathroom Renovation",
    description: "Complete renovation of a master bathroom including new shower, toilet, vanity, and tile work.",
    location: "Port of Spain",
    category: "Plumbing",
    budget: 12000,
    deadline: "2025-06-20",
    postedDate: "2025-05-09",
    clientName: "Robert L.",
    clientRating: 4.6,
    status: "Open",
  },
  {
    id: 6,
    title: "Roof Leak Repair",
    description: "Repair leaking roof on a residential property. Approximately 200 sq ft area affected.",
    location: "Point Fortin",
    category: "Roofing",
    budget: 2500,
    deadline: "2025-05-30",
    postedDate: "2025-05-15",
    clientName: "Maria C.",
    clientRating: 4.4,
    status: "Open",
  },
];

const ProjectMarketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filter logic
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "" || project.category === categoryFilter;
    const matchesLocation = locationFilter === "" || project.location === locationFilter;
    let matchesBudget = true;
    
    if (budgetFilter === "under5k") {
      matchesBudget = project.budget < 5000;
    } else if (budgetFilter === "5k-10k") {
      matchesBudget = project.budget >= 5000 && project.budget <= 10000;
    } else if (budgetFilter === "over10k") {
      matchesBudget = project.budget > 10000;
    }
    
    return matchesSearch && matchesCategory && matchesLocation && matchesBudget;
  });
  
  return (
    <Layout>
      <section className="bg-ttc-blue-800 py-12 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Project Marketplace</h1>
            <p className="text-lg mb-6">Browse available projects or post your own project to find the right professional</p>
            <Link to="/post-job">
              <Button size="lg" className="bg-ttc-green-500 hover:bg-ttc-green-600 mt-2">
                Post a New Project
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Projects</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input 
                    id="search"
                    placeholder="Search by keyword..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    <SelectItem value="Carpentry">Carpentry</SelectItem>
                    <SelectItem value="Electrical">Electrical</SelectItem>
                    <SelectItem value="Plumbing">Plumbing</SelectItem>
                    <SelectItem value="Painting">Painting</SelectItem>
                    <SelectItem value="Roofing">Roofing</SelectItem>
                    <SelectItem value="Landscaping">Landscaping</SelectItem>
                    <SelectItem value="Masonry">Masonry</SelectItem>
                    <SelectItem value="Flooring">Flooring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="Port of Spain">Port of Spain</SelectItem>
                    <SelectItem value="San Fernando">San Fernando</SelectItem>
                    <SelectItem value="Arima">Arima</SelectItem>
                    <SelectItem value="Chaguanas">Chaguanas</SelectItem>
                    <SelectItem value="Point Fortin">Point Fortin</SelectItem>
                    <SelectItem value="Tobago">Tobago</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Budget" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Budget</SelectItem>
                    <SelectItem value="under5k">Under $5,000</SelectItem>
                    <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                    <SelectItem value="over10k">Over $10,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button variant="outline" className="gap-2 md:w-auto w-full">
                <Filter size={16} /> Filter
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-ttc-neutral-800">{filteredProjects.length} Projects Available</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 border rounded-md p-1">
                <Button 
                  size="icon" 
                  variant={viewMode === "grid" ? "default" : "ghost"} 
                  onClick={() => setViewMode("grid")} 
                  className="h-8 w-8"
                >
                  <Grid size={16} />
                </Button>
                <Button 
                  size="icon" 
                  variant={viewMode === "list" ? "default" : "ghost"} 
                  onClick={() => setViewMode("list")} 
                  className="h-8 w-8"
                >
                  <LayoutList size={16} />
                </Button>
              </div>
              <Select defaultValue="newest">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="budget-high">Budget: High to Low</SelectItem>
                  <SelectItem value="budget-low">Budget: Low to High</SelectItem>
                  <SelectItem value="deadline">Deadline: Soonest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700 mb-2">
                        {project.category}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        {project.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin size={14} /> {project.location}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center text-ttc-neutral-700">
                        <DollarSign size={16} className="mr-1 text-ttc-blue-700" />
                        <span className="font-semibold">${project.budget}</span>
                      </div>
                      
                      <div className="flex items-center text-ttc-neutral-700">
                        <Calendar size={16} className="mr-1 text-ttc-blue-700" />
                        <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                      
                      <div className="flex items-center text-ttc-neutral-700">
                        <Tag size={16} className="mr-1 text-ttc-blue-700" />
                        <span>Fixed Price</span>
                      </div>
                      
                      <div className="flex items-center text-ttc-neutral-700">
                        <Clock size={16} className="mr-1 text-ttc-blue-700" />
                        <span>{new Date(project.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      Posted by: <span className="font-medium">{project.clientName}</span>
                    </div>
                    <Link to={`/project/${project.id}`}>
                      <Button variant="outline" className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50">
                        View Details
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div key={project.id} className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-ttc-blue-50 text-ttc-blue-700">
                          {project.category}
                        </Badge>
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {project.status}
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
                      
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin size={14} className="mr-1" /> {project.location}
                        <span className="mx-2">|</span>
                        <span>Posted by: <span className="font-medium">{project.clientName}</span></span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <div className="flex items-center text-ttc-neutral-700">
                          <DollarSign size={16} className="mr-1 text-ttc-blue-700" />
                          <span className="font-semibold">${project.budget}</span>
                        </div>
                        
                        <div className="flex items-center text-ttc-neutral-700">
                          <Calendar size={16} className="mr-1 text-ttc-blue-700" />
                          <span>{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                      </div>
                      
                      <Link to={`/project/${project.id}`}>
                        <Button variant="outline" className="border-ttc-blue-700 text-ttc-blue-700 hover:bg-ttc-blue-50 whitespace-nowrap">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {filteredProjects.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters or check back later.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="bg-ttc-blue-700 rounded-lg shadow-xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Have a project you need help with?</h2>
                <p className="mb-6">Post your project for free and get connected with qualified professionals in Trinidad & Tobago.</p>
                <Link to="/post-job">
                  <Button className="bg-white text-ttc-blue-700 hover:bg-blue-50">
                    Post Your Project
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block">
                <img 
                  src="/lovable-uploads/8bbf4ce1-7690-4c37-9adf-b2751ac81a84.png" 
                  alt="Post a project" 
                  className="rounded-lg max-h-48 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProjectMarketplace;
