import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

// Types for learning modules
type LearningModule = {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progress?: number;
  rating?: number;
  level: 'beginner' | 'intermediate' | 'advanced';
};

export default function LearningModules() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Fetch learning modules data
  const { data: modules, isLoading } = useQuery<LearningModule[]>({
    queryKey: ['/api/modules'],
  });

  // Default modules data if API call is not yet fulfilled
  const defaultModules: LearningModule[] = modules || [
    {
      id: 1,
      title: "Password Security",
      description: "Best practices for creating and managing secure passwords",
      category: "General Security",
      duration: "15 min",
      status: "completed",
      progress: 100,
      rating: 4.8,
      level: "beginner"
    },
    {
      id: 2,
      title: "Phishing Awareness",
      description: "How to identify and avoid phishing attempts",
      category: "Email Security",
      duration: "20 min",
      status: "in-progress",
      progress: 45,
      level: "beginner"
    },
    {
      id: 3,
      title: "Data Protection",
      description: "Guidelines for securing sensitive company data",
      category: "Data Security",
      duration: "25 min",
      status: "not-started",
      level: "intermediate"
    },
    {
      id: 4,
      title: "Mobile Device Security",
      description: "How to secure smartphones and tablets used for work",
      category: "Device Security",
      duration: "20 min",
      status: "not-started",
      level: "beginner"
    },
    {
      id: 5,
      title: "Social Engineering Tactics",
      description: "Understanding and preventing social manipulation attacks",
      category: "Threat Awareness",
      duration: "30 min",
      status: "not-started",
      level: "intermediate"
    },
    {
      id: 6,
      title: "Secure Remote Working",
      description: "Best practices for working securely outside the office",
      category: "Remote Security",
      duration: "25 min",
      status: "completed",
      progress: 100,
      rating: 4.5,
      level: "beginner"
    },
    {
      id: 7,
      title: "Cloud Security Fundamentals",
      description: "Essential concepts for securing cloud-based resources",
      category: "Cloud Security",
      duration: "35 min",
      status: "not-started",
      level: "intermediate"
    },
    {
      id: 8,
      title: "Incident Response Basics",
      description: "How to respond to common security incidents",
      category: "Incident Response",
      duration: "40 min",
      status: "not-started",
      level: "advanced"
    }
  ];

  // Extract categories for filter
  const categories = ['all', ...new Set(defaultModules.map(module => module.category))];

  // Filter modules based on search and filters
  const filteredModules = defaultModules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         module.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || module.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || module.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case 'in-progress':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Progress</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  // Render level badge
  const renderLevelBadge = (level: string) => {
    switch(level) {
      case 'beginner':
        return <Badge variant="outline" className="ml-2">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="outline" className="ml-2">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="outline" className="ml-2">Advanced</Badge>;
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Learning Modules</h1>
            <p className="text-slate-500">Enhance your security knowledge with our educational modules</p>
          </header>

          {/* Filters and Search */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search modules..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModules.map(module => (
              <Card key={module.id} className="overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    {renderStatusBadge(module.status)}
                    <div className="flex items-center text-sm text-slate-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {module.duration}
                    </div>
                  </div>
                  <CardTitle className="mt-2">{module.title}</CardTitle>
                  <div className="flex items-center">
                    <Badge variant="secondary">{module.category}</Badge>
                    {renderLevelBadge(module.level)}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {module.description}
                  </CardDescription>
                </CardContent>
                <CardFooter className="flex flex-col items-stretch mt-auto pt-0">
                  {module.status === 'in-progress' && (
                    <div className="w-full mb-3">
                      <div className="flex justify-between items-center mb-1 text-xs">
                        <span>Progress</span>
                        <span>{module.progress}%</span>
                      </div>
                      <Progress value={module.progress} className="h-1.5" />
                    </div>
                  )}
                  
                  {module.status === 'completed' && module.rating && (
                    <div className="flex items-center mb-3 text-sm">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg 
                            key={star}
                            className={`w-4 h-4 ${star <= Math.floor(module.rating!) ? 'text-yellow-400' : 'text-slate-300'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2">{module.rating}/5</span>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <a href={`/modules/${module.id}`}>
                      {module.status === 'completed' ? 'Review' : 
                       module.status === 'in-progress' ? 'Continue' : 'Start Module'}
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredModules.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium">No modules found</h3>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
