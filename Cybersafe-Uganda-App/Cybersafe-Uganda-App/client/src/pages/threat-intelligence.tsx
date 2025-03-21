import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  AlertTriangle, 
  Clock, 
  ExternalLink,
  Shield,
  Search,
  Bell,
  Bookmark,
  Filter,
  Maximize2
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Types for threat intelligence data
type ThreatItem = {
  id: number;
  title: string;
  summary: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'informational';
  date: string;
  source: string;
  content: string;
  industries?: string[];
  tags?: string[];
  recommendations?: string[];
};

export default function ThreatIntelligence() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedThreat, setSelectedThreat] = useState<ThreatItem | null>(null);
  
  // Fetch threats data
  const { data: threats } = useQuery<ThreatItem[]>({
    queryKey: ['/api/threats'],
  });

  // Default threats data if API call is not yet fulfilled
  const defaultThreats: ThreatItem[] = threats || [
    {
      id: 1,
      title: "New Ransomware Variant Targeting SMEs",
      summary: "A new strain of ransomware has been observed targeting small and medium businesses through vulnerabilities in outdated CMS platforms.",
      category: "Ransomware",
      severity: "high",
      date: "3 days ago",
      source: "CyberSecurity News",
      content: "Security researchers have identified a new ransomware variant named 'LockBit 3.0' specifically targeting small and medium enterprises. This ransomware exploits vulnerabilities in outdated content management systems, particularly WordPress plugins that haven't been updated. Once infected, the ransomware encrypts all files and demands payment in cryptocurrency. The attackers are specifically targeting businesses with annual revenues between $10M-$100M, suggesting they are deliberately focusing on organizations that may have valuable data but potentially weaker security infrastructure.",
      industries: ["Retail", "Healthcare", "Financial Services"],
      tags: ["Ransomware", "CMS", "WordPress"],
      recommendations: [
        "Update all CMS platforms and plugins to the latest versions immediately",
        "Implement regular backup procedures with offline storage",
        "Deploy endpoint protection solutions with anti-ransomware capabilities",
        "Conduct security awareness training focused on phishing detection"
      ]
    },
    {
      id: 2,
      title: "Major SaaS Provider Reports Data Breach",
      summary: "Users of CloudService are advised to change their passwords immediately following a security incident affecting their authentication database.",
      category: "Data Breach",
      severity: "critical",
      date: "1 week ago",
      source: "TechSecurity Today",
      content: "CloudService, a major SaaS provider with over 2 million business users, has disclosed a significant data breach affecting their authentication systems. The breach, discovered during routine security monitoring, exposed user credentials including hashed passwords. While passwords were not stored in plaintext, the company is recommending all users change their passwords immediately and enable two-factor authentication. The breach reportedly occurred through a sophisticated supply chain attack that compromised a third-party authentication library used by the service.",
      industries: ["All industries"],
      tags: ["Data Breach", "SaaS", "Authentication"],
      recommendations: [
        "Change passwords for CloudService accounts immediately",
        "Enable two-factor authentication",
        "Monitor for suspicious activity on accounts",
        "Review and revoke unnecessary API integrations"
      ]
    },
    {
      id: 3,
      title: "Critical Zero-Day Vulnerability in Popular Email Client",
      summary: "Multiple zero-day vulnerabilities have been discovered in ThunderMail that allow remote code execution without user interaction.",
      category: "Vulnerability",
      severity: "critical",
      date: "2 days ago",
      source: "Security Watch",
      content: "Multiple critical vulnerabilities have been discovered in ThunderMail, a popular email client used by many businesses. The vulnerabilities allow attackers to execute arbitrary code remotely simply by sending a specially crafted email, requiring no user interaction beyond receiving the email. The ThunderMail development team has released an emergency patch (version 15.8.2) to address these vulnerabilities. Organizations are urged to update immediately or consider temporarily switching to alternative email clients until patching is complete.",
      industries: ["All industries"],
      tags: ["Zero-Day", "Email", "Remote Code Execution"],
      recommendations: [
        "Update ThunderMail to version 15.8.2 immediately",
        "Consider disabling HTML email rendering until patched",
        "Implement email filtering to quarantine suspicious attachments",
        "Monitor for indicators of compromise on endpoints running affected software"
      ]
    },
    {
      id: 4,
      title: "New Phishing Campaign Impersonating Tax Authorities",
      summary: "Sophisticated phishing campaign targets businesses with fake tax documents and IRS impersonation.",
      category: "Phishing",
      severity: "medium",
      date: "5 days ago",
      source: "PhishGuard",
      content: "A sophisticated phishing campaign is currently active, targeting businesses with emails purportedly from tax authorities. The emails contain convincing tax documents and request urgent action regarding supposed tax discrepancies. The campaign is particularly effective due to its timing near tax deadlines and the high-quality impersonation of official tax authority communications. When users click on links in these emails, they are directed to convincing but fraudulent websites that harvest credentials and financial information.",
      industries: ["All industries"],
      tags: ["Phishing", "Tax Fraud", "Social Engineering"],
      recommendations: [
        "Alert employees about the ongoing campaign",
        "Remind staff that tax authorities typically don't request sensitive information via email",
        "Implement DMARC, SPF, and DKIM email authentication",
        "Configure email gateways to flag external emails"
      ]
    },
    {
      id: 5,
      title: "Exposed API Keys Found in Public Code Repositories",
      summary: "Researchers discover thousands of valid API keys and credentials in public GitHub repositories from various companies.",
      category: "Data Exposure",
      severity: "high",
      date: "2 weeks ago",
      source: "DevSecOps Daily",
      content: "Security researchers have identified thousands of valid API keys, access tokens, and credentials accidentally uploaded to public code repositories. This exposure affects companies of all sizes, with many cloud service API keys, database credentials, and payment processing integrations discovered. Attackers are actively scanning GitHub and other public repositories for these exposed credentials, which can lead to data breaches, unauthorized access, and potential financial losses. In several documented cases, exposed keys have led to significant AWS and cloud service bills due to unauthorized resource usage.",
      industries: ["Technology", "Software Development", "All industries"],
      tags: ["API Security", "GitHub", "Credentials"],
      recommendations: [
        "Audit all code repositories for exposed secrets",
        "Implement pre-commit hooks to prevent credential leakage",
        "Use secret management systems rather than hardcoded credentials",
        "Rotate any credentials that may have been exposed"
      ]
    },
    {
      id: 6,
      title: "Business Email Compromise Attacks Target Financial Departments",
      summary: "Sophisticated BEC campaigns specifically targeting CFOs and finance teams to initiate fraudulent wire transfers.",
      category: "Social Engineering",
      severity: "high",
      date: "1 month ago",
      source: "Corporate Security Bulletin",
      content: "A series of highly targeted Business Email Compromise (BEC) attacks have been reported across multiple industries. The attackers are conducting detailed reconnaissance on target companies, identifying CFOs, finance directors, and accounting staff. Using this information, they create convincing impersonation emails, often appearing to come from company executives, requesting urgent wire transfers or changes to vendor payment details. Several companies have reported losses ranging from $25,000 to over $1 million due to these attacks.",
      industries: ["All industries"],
      tags: ["BEC", "Wire Fraud", "Phishing"],
      recommendations: [
        "Implement multi-person authorization for financial transactions",
        "Establish out-of-band verification for payment changes or wire transfers",
        "Conduct regular training for finance personnel on BEC techniques",
        "Configure email with strict SPF, DKIM, and DMARC policies"
      ]
    }
  ];

  // Filter threats based on active tab and search query
  const filteredThreats = defaultThreats.filter(threat => {
    const matchesSearch = threat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          threat.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "critical") return threat.severity === "critical" && matchesSearch;
    if (activeTab === "recent") return new Date(threat.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && matchesSearch;
    
    return matchesSearch;
  });

  // Get severity badge class
  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-red-500">High</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-yellow-500">Low</Badge>;
      case "informational":
        return <Badge className="bg-blue-500">Info</Badge>;
      default:
        return <Badge>{severity}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Threat Intelligence</h1>
            <p className="text-slate-500">Stay informed about the latest security threats and vulnerabilities</p>
          </header>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input 
                placeholder="Search threats..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Threat Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 p-4 rounded-lg">
                    <AlertTriangle className="text-red-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Critical Threats</p>
                    <p className="text-2xl font-bold">
                      {defaultThreats.filter(t => t.severity === "critical").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <Clock className="text-blue-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">New This Week</p>
                    <p className="text-2xl font-bold">
                      {defaultThreats.filter(t => new Date(t.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-4 rounded-lg">
                    <Shield className="text-green-600 h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Protected Against</p>
                    <p className="text-2xl font-bold">
                      {Math.floor(defaultThreats.length * 0.7)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Threats List */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Threats</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="recent">Recent (7d)</TabsTrigger>
            </TabsList>
          </Tabs>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Active Threats</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200">
                {filteredThreats.map((threat) => (
                  <div key={threat.id} className="p-4 md:p-5 hover:bg-slate-50 cursor-pointer" onClick={() => setSelectedThreat(threat)}>
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg overflow-hidden w-12 h-12 flex-shrink-0 hidden md:flex items-center justify-center bg-slate-100">
                        <AlertTriangle className="h-6 w-6 text-slate-400" />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{threat.category}</Badge>
                              {getSeverityBadge(threat.severity)}
                            </div>
                            <h3 className="font-medium">{threat.title}</h3>
                          </div>
                          <Button variant="ghost" size="sm" className="ml-2" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedThreat(threat);
                          }}>
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{threat.summary}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-xs text-slate-500">{threat.date}</span>
                          <Separator orientation="vertical" className="mx-2 h-3" />
                          <span className="text-xs text-slate-500">Source: {threat.source}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredThreats.length === 0 && (
                  <div className="py-8 text-center">
                    <AlertTriangle className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                    <p className="text-slate-500">No threats matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Threat Detail Dialog */}
          <Dialog open={!!selectedThreat} onOpenChange={(open) => !open && setSelectedThreat(null)}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              {selectedThreat && (
                <>
                  <DialogHeader>
                    <div className="flex items-center gap-2 mb-2">
                      {getSeverityBadge(selectedThreat.severity)}
                      <Badge variant="outline">{selectedThreat.category}</Badge>
                    </div>
                    <DialogTitle className="text-2xl">{selectedThreat.title}</DialogTitle>
                    <DialogDescription className="text-base mt-2">
                      {selectedThreat.summary}
                    </DialogDescription>
                    <div className="flex items-center mt-3 text-sm text-slate-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{selectedThreat.date}</span>
                      <Separator orientation="vertical" className="mx-2 h-3" />
                      <span>Source: {selectedThreat.source}</span>
                    </div>
                  </DialogHeader>
                  
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Detailed Information:</h3>
                    <p className="mb-4">{selectedThreat.content}</p>
                    
                    {selectedThreat.industries && (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Affected Industries:</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedThreat.industries.map((industry, i) => (
                            <Badge key={i} variant="secondary">{industry}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedThreat.tags && (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Tags:</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedThreat.tags.map((tag, i) => (
                            <Badge key={i} variant="outline">{tag}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedThreat.recommendations && (
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Recommendations:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          {selectedThreat.recommendations.map((rec, i) => (
                            <li key={i} className="text-slate-700">{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-end mt-6">
                      <Button variant="outline" className="mr-2">
                        <Bookmark className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Full Report
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
