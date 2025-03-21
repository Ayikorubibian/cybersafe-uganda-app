import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckSquare, 
  Clock, 
  BookOpen, 
  LockIcon, 
  Trophy,
  ChevronRight
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Types for assessments
type Assessment = {
  id: number;
  title: string;
  description: string;
  questions: number;
  timeLimit: string;
  status: 'completed' | 'in-progress' | 'not-started' | 'locked';
  score?: number;
  relatedModule?: string;
  dueDate?: string;
  completedDate?: string;
};

export default function Assessments() {
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch assessments data
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ['/api/assessments'],
  });

  // Default assessments data if API call is not yet fulfilled
  const defaultAssessments: Assessment[] = assessments || [
    {
      id: 1,
      title: "Password Security Fundamentals",
      description: "Test your knowledge on creating and managing secure passwords",
      questions: 10,
      timeLimit: "15 min",
      status: "completed",
      score: 90,
      relatedModule: "Password Security",
      completedDate: "2 weeks ago"
    },
    {
      id: 2,
      title: "Phishing Attack Recognition",
      description: "Identify common phishing tactics and prevention methods",
      questions: 12,
      timeLimit: "20 min",
      status: "in-progress",
      relatedModule: "Phishing Awareness",
      dueDate: "3 days"
    },
    {
      id: 3,
      title: "Data Protection Principles",
      description: "Test your understanding of data security best practices",
      questions: 15,
      timeLimit: "25 min",
      status: "not-started",
      relatedModule: "Data Protection",
      dueDate: "1 week"
    },
    {
      id: 4,
      title: "Mobile Security Assessment",
      description: "Evaluate your knowledge of securing mobile devices",
      questions: 10,
      timeLimit: "15 min",
      status: "not-started",
      relatedModule: "Mobile Device Security",
      dueDate: "2 weeks"
    },
    {
      id: 5,
      title: "Social Engineering Defense",
      description: "Identify and respond to social engineering tactics",
      questions: 15,
      timeLimit: "25 min",
      status: "locked",
      relatedModule: "Social Engineering Tactics"
    },
    {
      id: 6,
      title: "Remote Work Security",
      description: "Best practices for maintaining security while working remotely",
      questions: 12,
      timeLimit: "20 min",
      status: "completed",
      score: 85,
      relatedModule: "Secure Remote Working",
      completedDate: "1 month ago"
    }
  ];

  // Filter assessments based on active tab
  const filteredAssessments = defaultAssessments.filter(assessment => {
    if (activeTab === "all") return true;
    if (activeTab === "completed") return assessment.status === "completed";
    if (activeTab === "pending") return assessment.status === "in-progress" || assessment.status === "not-started";
    return true;
  });

  // Get assessment status information
  const getStatusInfo = (assessment: Assessment) => {
    switch(assessment.status) {
      case "completed":
        return {
          badge: <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>,
          action: "Review Results",
          actionVariant: "outline" as const,
          icon: <Trophy className="h-10 w-10 text-yellow-400" />,
          infoText: `Score: ${assessment.score}% · Completed ${assessment.completedDate}`
        };
      case "in-progress":
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">In Progress</Badge>,
          action: "Continue",
          actionVariant: "default" as const,
          icon: <CheckSquare className="h-10 w-10 text-blue-400" />,
          infoText: `Due in ${assessment.dueDate}`
        };
      case "not-started":
        return {
          badge: <Badge variant="outline">Not Started</Badge>,
          action: "Start Assessment",
          actionVariant: "default" as const,
          icon: <BookOpen className="h-10 w-10 text-slate-400" />,
          infoText: `Due in ${assessment.dueDate}`
        };
      case "locked":
        return {
          badge: <Badge variant="secondary">Locked</Badge>,
          action: "Complete Module First",
          actionVariant: "outline" as const,
          icon: <LockIcon className="h-10 w-10 text-slate-300" />,
          infoText: "Complete the related module to unlock"
        };
      default:
        return {
          badge: <Badge variant="outline">Unknown</Badge>,
          action: "View",
          actionVariant: "outline" as const,
          icon: <BookOpen className="h-10 w-10 text-slate-400" />,
          infoText: ""
        };
    }
  };

  // Count assessments by status
  const counts = {
    all: defaultAssessments.length,
    completed: defaultAssessments.filter(a => a.status === "completed").length,
    pending: defaultAssessments.filter(a => a.status === "in-progress" || a.status === "not-started").length
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Assessments & Quizzes</h1>
            <p className="text-slate-500">Test your knowledge and track your security awareness progress</p>
          </header>

          {/* Progress Overview */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold mb-1">Your Assessment Progress</h2>
                  <p className="text-sm text-slate-500 mb-4">Complete all assessments to earn your security awareness certification</p>
                  
                  <div className="flex flex-col sm:flex-row gap-6 mt-2">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Completed</p>
                        <p className="text-xl font-bold">{counts.completed}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Pending</p>
                        <p className="text-xl font-bold">{counts.pending}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <Trophy className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Average Score</p>
                        <p className="text-xl font-bold">
                          {Math.round(
                            defaultAssessments
                              .filter(a => a.status === "completed" && a.score)
                              .reduce((acc, curr) => acc + (curr.score || 0), 0) / 
                            counts.completed
                          )}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-1/3">
                  <p className="text-sm font-medium mb-1">Overall Completion</p>
                  <Progress 
                    value={(counts.completed / counts.all) * 100} 
                    className="h-2.5 mb-2"
                  />
                  <p className="text-sm text-slate-500">
                    {counts.completed} of {counts.all} assessments completed
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessments Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Assessments ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({counts.pending})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({counts.completed})</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Assessments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredAssessments.map(assessment => {
              const statusInfo = getStatusInfo(assessment);
              
              return (
                <Card key={assessment.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      {statusInfo.badge}
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {assessment.timeLimit}
                      </div>
                    </div>
                    <CardTitle className="mt-2">{assessment.title}</CardTitle>
                    <CardDescription className="text-slate-600">
                      {assessment.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckSquare className="h-4 w-4 mr-1.5 text-slate-500" />
                        <span className="text-sm text-slate-600">{assessment.questions} questions</span>
                      </div>
                      
                      {assessment.relatedModule && (
                        <Badge variant="secondary" className="text-xs">
                          {assessment.relatedModule}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-stretch pt-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {statusInfo.icon}
                        <div className="ml-3">
                          <p className="text-sm text-slate-500">{statusInfo.infoText}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      variant={statusInfo.actionVariant}
                      className="w-full"
                      asChild
                      disabled={assessment.status === "locked"}
                    >
                      <a href={`/assessments/${assessment.id}`}>
                        {statusInfo.action}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          
          {/* Empty state */}
          {filteredAssessments.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium">No assessments found</h3>
              <p className="mt-1 text-sm text-slate-500">
                {activeTab === "completed" 
                  ? "You haven't completed any assessments yet"
                  : activeTab === "pending"
                  ? "No pending assessments at the moment"
                  : "No assessments available"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
