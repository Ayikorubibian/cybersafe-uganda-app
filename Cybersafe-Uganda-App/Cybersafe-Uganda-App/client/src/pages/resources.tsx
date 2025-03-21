import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  FileText, 
  Download, 
  ExternalLink, 
  FileIcon, 
  Video, 
  BookOpen,
  Link2,
  Filter
} from "lucide-react";

// Types for resources
type Resource = {
  id: number;
  title: string;
  description: string;
  type: 'document' | 'video' | 'template' | 'link';
  category: string;
  url: string;
  fileSize?: string;
  duration?: string;
  lastUpdated: string;
  popular?: boolean;
};

export default function Resources() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch resources data
  const { data: resources } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });

  // Default resources data if API call is not yet fulfilled
  const defaultResources: Resource[] = resources || [
    {
      id: 1,
      title: "SME Cybersecurity Checklist",
      description: "A comprehensive checklist for evaluating your organization's security posture",
      type: "document",
      category: "Guidelines",
      url: "/resources/cybersecurity-checklist.pdf",
      fileSize: "1.2 MB",
      lastUpdated: "2 months ago",
      popular: true
    },
    {
      id: 2,
      title: "Password Policy Template",
      description: "Customizable template for creating an effective password policy",
      type: "template",
      category: "Templates",
      url: "/resources/password-policy-template.docx",
      fileSize: "845 KB",
      lastUpdated: "3 months ago"
    },
    {
      id: 3,
      title: "Phishing Response Playbook",
      description: "Step-by-step guide for responding to phishing incidents",
      type: "document",
      category: "Playbooks",
      url: "/resources/phishing-response-playbook.pdf",
      fileSize: "2.3 MB",
      lastUpdated: "1 month ago",
      popular: true
    },
    {
      id: 4,
      title: "How to Identify Phishing Emails - Video Guide",
      description: "Visual guide showing how to spot common phishing techniques",
      type: "video",
      category: "Training Materials",
      url: "/resources/phishing-identification-video.mp4",
      duration: "12:45",
      lastUpdated: "2 weeks ago",
      popular: true
    },
    {
      id: 5,
      title: "Security Awareness Posters (Set of 5)",
      description: "Printable posters covering common security topics for office display",
      type: "document",
      category: "Awareness Materials",
      url: "/resources/security-posters.zip",
      fileSize: "5.8 MB",
      lastUpdated: "4 months ago"
    },
    {
      id: 6,
      title: "NIST Cybersecurity Framework for SMEs",
      description: "Official NIST guidelines adapted for small and medium businesses",
      type: "link",
      category: "Guidelines",
      url: "https://www.nist.gov/cyberframework",
      lastUpdated: "1 year ago"
    },
    {
      id: 7,
      title: "Security Incident Response Plan Template",
      description: "Customizable template for creating a comprehensive incident response plan",
      type: "template",
      category: "Templates",
      url: "/resources/incident-response-template.docx",
      fileSize: "1.5 MB",
      lastUpdated: "2 months ago"
    },
    {
      id: 8,
      title: "Securing Remote Work Environments",
      description: "Best practices for ensuring security with remote and hybrid workforces",
      type: "video",
      category: "Training Materials",
      url: "/resources/remote-work-security.mp4",
      duration: "24:18",
      lastUpdated: "3 months ago"
    },
    {
      id: 9,
      title: "GDPR Compliance Checklist for SMEs",
      description: "Simplified guide to GDPR compliance requirements for small businesses",
      type: "document",
      category: "Compliance",
      url: "/resources/gdpr-sme-checklist.pdf",
      fileSize: "980 KB",
      lastUpdated: "5 months ago"
    },
    {
      id: 10,
      title: "Cyber Insurance Guide for Small Businesses",
      description: "Understanding cyber insurance options and requirements",
      type: "document",
      category: "Guidelines",
      url: "/resources/cyber-insurance-guide.pdf",
      fileSize: "1.1 MB",
      lastUpdated: "4 months ago"
    }
  ];

  // Get unique categories for filtering
  const categories = ['all', ...new Set(defaultResources.map(resource => resource.category))];

  // Filter resources based on active tab and search query
  const filteredResources = defaultResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "popular") return resource.popular && matchesSearch;
    if (activeTab === "documents") return resource.type === "document" && matchesSearch;
    if (activeTab === "videos") return resource.type === "video" && matchesSearch;
    if (activeTab === "templates") return resource.type === "template" && matchesSearch;
    if (categories.includes(activeTab)) return resource.category === activeTab && matchesSearch;
    
    return matchesSearch;
  });

  // Get icon based on resource type
  const getResourceIcon = (type: string) => {
    switch(type) {
      case "document":
        return <FileText className="h-6 w-6" />;
      case "video":
        return <Video className="h-6 w-6" />;
      case "template":
        return <FileIcon className="h-6 w-6" />;
      case "link":
        return <Link2 className="h-6 w-6" />;
      default:
        return <FileText className="h-6 w-6" />;
    }
  };

  // Get color based on resource type
  const getResourceColor = (type: string) => {
    switch(type) {
      case "document":
        return "text-blue-500 bg-blue-50";
      case "video":
        return "text-purple-500 bg-purple-50";
      case "template":
        return "text-green-500 bg-green-50";
      case "link":
        return "text-orange-500 bg-orange-50";
      default:
        return "text-slate-500 bg-slate-50";
    }
  };

  // Get badge text based on resource type
  const getResourceTypeBadge = (type: string) => {
    switch(type) {
      case "document":
        return "Document";
      case "video":
        return "Video";
      case "template":
        return "Template";
      case "link":
        return "External Link";
      default:
        return type;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Security Resources</h1>
            <p className="text-slate-500">Download templates, guides, and materials to enhance your security program</p>
          </header>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search resources..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Resource Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="flex flex-wrap">
              <TabsTrigger value="all">All Resources</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => (
              <Card key={resource.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex justify-between">
                    <div className={`p-2 rounded-lg ${getResourceColor(resource.type)}`}>
                      {getResourceIcon(resource.type)}
                    </div>
                    <Badge variant="outline">{resource.category}</Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg">{resource.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {resource.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {getResourceTypeBadge(resource.type)}
                    </Badge>
                    <div className="text-sm text-slate-500">
                      {resource.fileSize && <span>{resource.fileSize}</span>}
                      {resource.duration && <span>{resource.duration}</span>}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full flex flex-col space-y-2">
                    <div className="flex items-center text-xs text-slate-500">
                      <span>Updated {resource.lastUpdated}</span>
                      {resource.popular && (
                        <>
                          <Separator orientation="vertical" className="mx-2 h-3" />
                          <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Popular</Badge>
                        </>
                      )}
                    </div>
                    <Button 
                      className="w-full"
                      variant={resource.type === "link" ? "outline" : "default"}
                      asChild
                    >
                      <a href={resource.url} target={resource.type === "link" ? "_blank" : "_self"} rel="noopener noreferrer">
                        {resource.type === "link" ? (
                          <>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Visit Resource
                          </>
                        ) : (
                          <>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </>
                        )}
                      </a>
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {/* Empty state */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-medium">No resources found</h3>
              <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
