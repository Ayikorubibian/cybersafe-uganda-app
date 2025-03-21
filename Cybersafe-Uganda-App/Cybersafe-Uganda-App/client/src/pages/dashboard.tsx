import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  BookOpen,
  BarChart2,
  UserCheck,
  Clock
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { User } from "@shared/schema";

// Type definitions for dashboard data
type SecurityScoreData = {
  score: number;
  change: number;
  strengths: number;
  warnings: number;
  critical: number;
};

type TeamMember = {
  username: string;
  progress: number;
};

type Activity = {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  time: string;
};

type Module = {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'not-started';
  duration: string;
  progress?: number;
  rating?: number;
};

type NewsItem = {
  id: number;
  category: string;
  title: string;
  description: string;
  time: string;
  isCritical?: boolean;
};

export default function Dashboard() {
  // Fetch dashboard data
  const { data: securityScore } = useQuery<SecurityScoreData>({
    queryKey: ['/api/dashboard/security-score'],
  });

  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ['/api/dashboard/team-progress'],
  });

  const { data: activities } = useQuery<Activity[]>({
    queryKey: ['/api/dashboard/activities'],
  });

  const { data: modules } = useQuery<Module[]>({
    queryKey: ['/api/dashboard/modules'],
  });

  const { data: news } = useQuery<NewsItem[]>({
    queryKey: ['/api/dashboard/news'],
  });

  // Default data if API calls are not yet fulfilled
  const defaultSecurityScore: SecurityScoreData = securityScore || {
    score: 73,
    change: 5,
    strengths: 4,
    warnings: 2,
    critical: 1,
  };

  const defaultTeamMembers: TeamMember[] = teamMembers || [
    { username: "Emma Watson", progress: 85 },
    { username: "Michael Brown", progress: 64 },
    { username: "David Clark", progress: 45 },
  ];

  const defaultActivities: Activity[] = activities || [
    { id: 1, type: 'success', title: 'Password Policy Updated', time: '2 hours ago' },
    { id: 2, type: 'info', title: 'New User Onboarded', time: 'Yesterday' },
    { id: 3, type: 'error', title: 'Failed Login Attempts (3)', time: '3 days ago' },
  ];

  const defaultModules: Module[] = modules || [
    { 
      id: 1, 
      title: 'Password Security', 
      description: 'Best practices for creating and managing secure passwords', 
      status: 'completed', 
      duration: '15 min',
      rating: 4.8
    },
    { 
      id: 2, 
      title: 'Phishing Awareness', 
      description: 'How to identify and avoid phishing attempts', 
      status: 'in-progress',
      duration: '20 min',
      progress: 45
    },
    { 
      id: 3, 
      title: 'Data Protection', 
      description: 'Guidelines for securing sensitive company data', 
      status: 'not-started',
      duration: '25 min'
    },
  ];

  const defaultNews: NewsItem[] = news || [
    { 
      id: 1, 
      category: 'Threat Intelligence', 
      title: 'New Ransomware Variant Targeting SMEs', 
      description: 'A new strain of ransomware has been observed targeting small and medium businesses through vulnerabilities in outdated CMS platforms.',
      time: '3 days ago'
    },
    { 
      id: 2, 
      category: 'Critical Alert', 
      title: 'Major SaaS Provider Reports Data Breach', 
      description: 'Users of CloudService are advised to change their passwords immediately following a security incident affecting their authentication database.',
      time: '1 week ago',
      isCritical: true
    },
  ];

  // Activity icon mapping
  const getActivityIcon = (type: string) => {
    switch(type) {
      case 'success':
        return <CheckCircle className="text-green-600" />;
      case 'info':
        return <UserCheck className="text-blue-600" />;
      case 'warning':
        return <AlertTriangle className="text-warning-DEFAULT" />;
      case 'error':
        return <AlertCircle className="text-red-600" />;
      default:
        return <Clock className="text-slate-600" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Security Dashboard</h1>
            <p className="text-slate-500">Your organization's security health overview</p>
          </header>

          {/* Security Score Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">Overall Security Score</h3>
                    <p className="text-slate-500 text-sm">Based on completed training & assessments</p>
                  </div>
                  <span className="text-xs bg-primary/10 text-primary py-1 px-2 rounded-full">
                    +{defaultSecurityScore.change}% from last month
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="relative h-32 w-32">
                    <svg className="h-full w-full" viewBox="0 0 36 36">
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" strokeDasharray="100, 100"/>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#2563eb" strokeWidth="3" strokeDasharray={`${defaultSecurityScore.score}, 100`}/>
                      <text x="18" y="21" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#1e293b">{defaultSecurityScore.score}%</text>
                    </svg>
                  </div>
                  <div className="ml-4">
                    <div className="mb-2">
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                        <span className="text-sm">Strengths <span className="font-semibold">({defaultSecurityScore.strengths})</span></span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-warning-DEFAULT rounded-full mr-2"></span>
                        <span className="text-sm">Warnings <span className="font-semibold">({defaultSecurityScore.warnings})</span></span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                        <span className="text-sm">Critical Issues <span className="font-semibold">({defaultSecurityScore.critical})</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Team Progress</h3>
                  <p className="text-slate-500 text-sm">Training completion status</p>
                </div>
                <div className="space-y-4">
                  {defaultTeamMembers.map((member, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{member.username}</span>
                        <span className="text-xs font-semibold">{member.progress}%</span>
                      </div>
                      <Progress 
                        value={member.progress} 
                        className="h-2" 
                        indicatorClassName={member.progress < 50 ? "bg-warning-DEFAULT" : "bg-primary"}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <a href="/reports" className="text-sm text-primary hover:underline">View all team members</a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">Recent Activity</h3>
                  <p className="text-slate-500 text-sm">Latest security events</p>
                </div>
                <div className="space-y-4">
                  {defaultActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start">
                      <div className={`bg-${activity.type === 'success' ? 'green' : activity.type === 'info' ? 'blue' : activity.type === 'warning' ? 'yellow' : 'red'}-100 p-2 rounded-lg`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-right">
                  <a href="/reports" className="text-sm text-primary hover:underline">View all activity</a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Modules */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Learning Modules</h2>
              <a href="/modules" className="text-sm text-primary hover:underline">View all modules</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {defaultModules.map((module) => (
                <Card key={module.id} className="overflow-hidden">
                  <div className="h-40 bg-primary/10 relative">
                    {/* Using a generic illustration for learning modules */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
                      <BookOpen className="h-16 w-16 text-primary/40" />
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-900/70 text-white text-xs py-1 px-2 rounded-full backdrop-blur-sm">
                      {module.duration}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{module.title}</h3>
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${module.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          module.status === 'in-progress' ? 'bg-warning-light/20 text-warning-dark' : 
                          'bg-slate-100 text-slate-800'}
                      `}>
                        {module.status === 'completed' ? 'Completed' : 
                         module.status === 'in-progress' ? 'In Progress' : 
                         'Not Started'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{module.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      {module.status === 'completed' && module.rating && (
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs">{module.rating}/5</span>
                        </div>
                      )}
                      {module.status === 'in-progress' && typeof module.progress === 'number' && (
                        <div className="flex items-center w-full">
                          <Progress value={module.progress} className="h-1.5 flex-grow" />
                          <span className="text-xs ml-2">{module.progress}%</span>
                        </div>
                      )}
                      {module.status === 'not-started' && (
                        <a href={`/modules/${module.id}`} className="text-xs text-primary font-medium hover:underline">Start Module</a>
                      )}
                      {module.status === 'completed' && (
                        <a href={`/modules/${module.id}`} className="text-xs text-primary font-medium hover:underline">Review</a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Security News */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Latest Security News</h2>
              <a href="/threats" className="text-sm text-primary hover:underline">View all news</a>
            </div>
            <Card className="overflow-hidden">
              <div className="divide-y divide-slate-200">
                {defaultNews.map((item) => (
                  <div key={item.id} className="p-4 md:p-5 hover:bg-slate-50">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg overflow-hidden w-16 h-16 flex-shrink-0 hidden md:block bg-slate-100 flex items-center justify-center">
                        <AlertTriangle className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <span className={`text-xs font-medium ${item.isCritical ? 'text-red-600' : 'text-primary'}`}>
                          {item.category}
                        </span>
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-slate-500">{item.time}</span>
                          <Separator orientation="vertical" className="mx-2 h-3" />
                          <span className="text-xs font-medium text-primary hover:underline cursor-pointer">Read More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
