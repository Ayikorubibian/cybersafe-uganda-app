import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import {
  Download,
  FileText,
  Users,
  CheckSquare,
  BarChart2,
  Calendar,
  Filter
} from "lucide-react";

// Types for reports data
type TeamMember = {
  id: number;
  username: string;
  role: string;
  completedModules: number;
  totalModules: number;
  completedAssessments: number;
  totalAssessments: number;
  averageScore: number;
  lastActivity: string;
};

type ModuleCompletion = {
  name: string;
  completed: number;
  inProgress: number;
  notStarted: number;
};

type AssessmentScore = {
  name: string;
  averageScore: number;
  usersCompleted: number;
};

type SecurityAwarenessData = {
  date: string;
  awarenessScore: number;
};

type SecurityIncident = {
  id: number;
  type: string;
  date: string;
  source: string;
  status: string;
  impact: 'low' | 'medium' | 'high';
};

export default function Reports() {
  const [timePeriod, setTimePeriod] = useState("30days");
  const [reportType, setReportType] = useState("all");
  
  // Fetch reports data
  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ['/api/reports/team-progress'],
  });

  const { data: moduleData } = useQuery<ModuleCompletion[]>({
    queryKey: ['/api/reports/module-completion'],
  });

  const { data: assessmentData } = useQuery<AssessmentScore[]>({
    queryKey: ['/api/reports/assessment-scores'],
  });

  const { data: awarenessData } = useQuery<SecurityAwarenessData[]>({
    queryKey: ['/api/reports/awareness-trend', timePeriod],
  });

  const { data: securityIncidents } = useQuery<SecurityIncident[]>({
    queryKey: ['/api/reports/security-incidents', timePeriod],
  });

  // Default data if API calls are not yet fulfilled
  const defaultTeamMembers: TeamMember[] = teamMembers || [
    { id: 1, username: "Emma Watson", role: "HR Manager", completedModules: 4, totalModules: 5, completedAssessments: 3, totalAssessments: 4, averageScore: 92, lastActivity: "Today" },
    { id: 2, username: "Michael Brown", role: "Finance Director", completedModules: 3, totalModules: 5, completedAssessments: 2, totalAssessments: 4, averageScore: 85, lastActivity: "Yesterday" },
    { id: 3, username: "David Clark", role: "IT Specialist", completedModules: 5, totalModules: 5, completedAssessments: 4, totalAssessments: 4, averageScore: 98, lastActivity: "2 days ago" },
    { id: 4, username: "Sarah Johnson", role: "Security Admin", completedModules: 5, totalModules: 5, completedAssessments: 4, totalAssessments: 4, averageScore: 94, lastActivity: "Today" },
    { id: 5, username: "James Wilson", role: "Sales Manager", completedModules: 2, totalModules: 5, completedAssessments: 1, totalAssessments: 4, averageScore: 75, lastActivity: "3 days ago" }
  ];

  const defaultModuleData: ModuleCompletion[] = moduleData || [
    { name: "Password Security", completed: 24, inProgress: 6, notStarted: 2 },
    { name: "Phishing Awareness", completed: 18, inProgress: 10, notStarted: 4 },
    { name: "Data Protection", completed: 12, inProgress: 8, notStarted: 12 },
    { name: "Mobile Security", completed: 20, inProgress: 5, notStarted: 7 },
    { name: "Social Engineering", completed: 15, inProgress: 9, notStarted: 8 }
  ];

  const defaultAssessmentData: AssessmentScore[] = assessmentData || [
    { name: "Password Security", averageScore: 88, usersCompleted: 24 },
    { name: "Phishing Attack Recognition", averageScore: 76, usersCompleted: 18 },
    { name: "Data Protection Principles", averageScore: 82, usersCompleted: 12 },
    { name: "Mobile Security Assessment", averageScore: 79, usersCompleted: 20 },
    { name: "Social Engineering Defense", averageScore: 65, usersCompleted: 15 }
  ];

  const defaultAwarenessData: SecurityAwarenessData[] = awarenessData || [
    { date: "Jan", awarenessScore: 45 },
    { date: "Feb", awarenessScore: 52 },
    { date: "Mar", awarenessScore: 58 },
    { date: "Apr", awarenessScore: 62 },
    { date: "May", awarenessScore: 70 },
    { date: "Jun", awarenessScore: 73 }
  ];

  const defaultSecurityIncidents: SecurityIncident[] = securityIncidents || [
    { id: 1, type: "Phishing Attempt", date: "2 days ago", source: "Email", status: "Resolved", impact: "low" },
    { id: 2, type: "Unauthorized Access Attempt", date: "1 week ago", source: "VPN", status: "Resolved", impact: "medium" },
    { id: 3, type: "Data Leak", date: "2 weeks ago", source: "Cloud Storage", status: "Resolved", impact: "high" },
    { id: 4, type: "Malware Detection", date: "3 weeks ago", source: "Endpoint", status: "Resolved", impact: "medium" }
  ];

  // Chart colors
  const COLORS = ['#2563eb', '#a855f7', '#f59e0b', '#ef4444'];
  const PIE_COLORS = ['#2563eb', '#93c5fd', '#dbeafe'];

  // Process data for pie chart
  const processPieData = (moduleData: ModuleCompletion[]) => {
    const totalCompleted = moduleData.reduce((acc, curr) => acc + curr.completed, 0);
    const totalInProgress = moduleData.reduce((acc, curr) => acc + curr.inProgress, 0);
    const totalNotStarted = moduleData.reduce((acc, curr) => acc + curr.notStarted, 0);
    
    return [
      { name: 'Completed', value: totalCompleted },
      { name: 'In Progress', value: totalInProgress },
      { name: 'Not Started', value: totalNotStarted }
    ];
  };
  
  const pieData = processPieData(defaultModuleData);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
              <p className="text-slate-500">Track security awareness progress and identify areas for improvement</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Generate PDF
              </Button>
            </div>
          </header>

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <Select value={timePeriod} onValueChange={setTimePeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="modules">Module Completion</SelectItem>
                <SelectItem value="assessments">Assessment Scores</SelectItem>
                <SelectItem value="awareness">Awareness Trend</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <Users className="text-primary h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Total Users</p>
                    <p className="text-2xl font-bold">{defaultTeamMembers.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <CheckSquare className="text-green-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Completion Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round((
                        defaultTeamMembers.reduce((acc, curr) => acc + curr.completedModules, 0) / 
                        defaultTeamMembers.reduce((acc, curr) => acc + curr.totalModules, 0)
                      ) * 100)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <BarChart2 className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Avg. Assessment Score</p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        defaultTeamMembers.reduce((acc, curr) => acc + curr.averageScore, 0) / 
                        defaultTeamMembers.length
                      )}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-purple-100 p-4 rounded-lg">
                    <Calendar className="text-purple-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Active Today</p>
                    <p className="text-2xl font-bold">
                      {defaultTeamMembers.filter(member => member.lastActivity === "Today").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Reports Section */}
          <Tabs defaultValue="overview" className="mb-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="team">Team Performance</TabsTrigger>
              <TabsTrigger value="modules">Module Analytics</TabsTrigger>
              <TabsTrigger value="assessments">Assessment Results</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Awareness Trend Chart */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Security Awareness Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={defaultAwarenessData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="awarenessScore" 
                          name="Awareness Score" 
                          stroke="#2563eb" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Module Completion Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Module Completion Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Assessment Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle>Assessment Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart 
                        data={defaultAssessmentData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Bar dataKey="averageScore" name="Average Score %" fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                {/* Recent Security Incidents */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Security Incidents</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 bg-slate-50 p-3 text-sm font-medium">
                        <div>Type</div>
                        <div>Date</div>
                        <div>Source</div>
                        <div>Status</div>
                        <div>Impact</div>
                      </div>
                      {defaultSecurityIncidents.map((incident) => (
                        <div key={incident.id} className="grid grid-cols-5 p-3 text-sm border-t">
                          <div>{incident.type}</div>
                          <div>{incident.date}</div>
                          <div>{incident.source}</div>
                          <div>{incident.status}</div>
                          <div>
                            <Badge 
                              className={
                                incident.impact === 'high' ? 'bg-red-100 text-red-800' : 
                                incident.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-green-100 text-green-800'
                              }
                            >
                              {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Team Performance Tab */}
            <TabsContent value="team">
              <Card>
                <CardHeader>
                  <CardTitle>Team Member Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <div className="grid grid-cols-12 bg-slate-50 p-3 text-sm font-medium">
                      <div className="col-span-2">User</div>
                      <div className="col-span-2">Role</div>
                      <div className="col-span-2">Modules</div>
                      <div className="col-span-2">Assessments</div>
                      <div className="col-span-2">Avg. Score</div>
                      <div className="col-span-2">Last Activity</div>
                    </div>
                    {defaultTeamMembers.map((member) => (
                      <div key={member.id} className="grid grid-cols-12 p-3 text-sm border-t">
                        <div className="col-span-2 font-medium">{member.username}</div>
                        <div className="col-span-2">{member.role}</div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(member.completedModules / member.totalModules) * 100} 
                              className="h-2 w-20" 
                            />
                            <span>{member.completedModules}/{member.totalModules}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Progress 
                              value={(member.completedAssessments / member.totalAssessments) * 100} 
                              className="h-2 w-20" 
                            />
                            <span>{member.completedAssessments}/{member.totalAssessments}</span>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <Badge 
                            className={
                              member.averageScore >= 90 ? 'bg-green-100 text-green-800' : 
                              member.averageScore >= 70 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }
                          >
                            {member.averageScore}%
                          </Badge>
                        </div>
                        <div className="col-span-2">{member.lastActivity}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Module Analytics Tab */}
            <TabsContent value="modules">
              <Card>
                <CardHeader>
                  <CardTitle>Module Completion Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={defaultModuleData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="completed" name="Completed" stackId="a" fill="#2563eb" />
                      <Bar dataKey="inProgress" name="In Progress" stackId="a" fill="#93c5fd" />
                      <Bar dataKey="notStarted" name="Not Started" stackId="a" fill="#dbeafe" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-6 rounded-md border">
                    <div className="grid grid-cols-7 bg-slate-50 p-3 text-sm font-medium">
                      <div className="col-span-3">Module Name</div>
                      <div className="col-span-1 text-center">Completed</div>
                      <div className="col-span-1 text-center">In Progress</div>
                      <div className="col-span-1 text-center">Not Started</div>
                      <div className="col-span-1 text-center">Completion %</div>
                    </div>
                    {defaultModuleData.map((module, index) => {
                      const total = module.completed + module.inProgress + module.notStarted;
                      const completionPercentage = Math.round((module.completed / total) * 100);
                      
                      return (
                        <div key={index} className="grid grid-cols-7 p-3 text-sm border-t">
                          <div className="col-span-3 font-medium">{module.name}</div>
                          <div className="col-span-1 text-center">{module.completed}</div>
                          <div className="col-span-1 text-center">{module.inProgress}</div>
                          <div className="col-span-1 text-center">{module.notStarted}</div>
                          <div className="col-span-1 text-center">
                            <Badge 
                              className={
                                completionPercentage >= 70 ? 'bg-green-100 text-green-800' : 
                                completionPercentage >= 40 ? 'bg-yellow-100 text-yellow-800' : 
                                'bg-red-100 text-red-800'
                              }
                            >
                              {completionPercentage}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Assessment Results Tab */}
            <TabsContent value="assessments">
              <Card>
                <CardHeader>
                  <CardTitle>Assessment Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={defaultAssessmentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" orientation="left" stroke="#2563eb" />
                      <YAxis yAxisId="right" orientation="right" stroke="#a855f7" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="averageScore" name="Average Score %" fill="#2563eb" />
                      <Bar yAxisId="right" dataKey="usersCompleted" name="Users Completed" fill="#a855f7" />
                    </BarChart>
                  </ResponsiveContainer>
                  
                  <div className="mt-6 rounded-md border">
                    <div className="grid grid-cols-3 bg-slate-50 p-3 text-sm font-medium">
                      <div>Assessment Name</div>
                      <div>Average Score</div>
                      <div>Users Completed</div>
                    </div>
                    {defaultAssessmentData.map((assessment, index) => (
                      <div key={index} className="grid grid-cols-3 p-3 text-sm border-t">
                        <div className="font-medium">{assessment.name}</div>
                        <div>
                          <Badge 
                            className={
                              assessment.averageScore >= 80 ? 'bg-green-100 text-green-800' : 
                              assessment.averageScore >= 60 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }
                          >
                            {assessment.averageScore}%
                          </Badge>
                        </div>
                        <div>{assessment.usersCompleted} users</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
