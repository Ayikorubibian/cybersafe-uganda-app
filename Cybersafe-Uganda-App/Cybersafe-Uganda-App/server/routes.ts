import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);

  // Dashboard data
  app.get("/api/dashboard/security-score", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // In a real app this would come from the database
    res.json({
      score: 73,
      change: 5,
      strengths: 4,
      warnings: 2,
      critical: 1,
    });
  });

  app.get("/api/dashboard/team-progress", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      { username: "Emma Watson", progress: 85 },
      { username: "Michael Brown", progress: 64 },
      { username: "David Clark", progress: 45 },
    ]);
  });

  app.get("/api/dashboard/activities", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      { id: 1, type: 'success', title: 'Password Policy Updated', time: '2 hours ago' },
      { id: 2, type: 'info', title: 'New User Onboarded', time: 'Yesterday' },
      { id: 3, type: 'error', title: 'Failed Login Attempts (3)', time: '3 days ago' },
    ]);
  });

  app.get("/api/dashboard/modules", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
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
    ]);
  });

  app.get("/api/dashboard/news", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
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
    ]);
  });

  // Learning modules
  app.get("/api/modules", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
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
      }
    ]);
  });

  // Assessments
  app.get("/api/assessments", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
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
      }
    ]);
  });

  // Threat intelligence
  app.get("/api/threats", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      {
        id: 1,
        title: "New Ransomware Variant Targeting SMEs",
        summary: "A new strain of ransomware has been observed targeting small and medium businesses through vulnerabilities in outdated CMS platforms.",
        category: "Ransomware",
        severity: "high",
        date: "3 days ago",
        source: "CyberSecurity News",
        content: "Security researchers have identified a new ransomware variant named 'LockBit 3.0' specifically targeting small and medium enterprises. This ransomware exploits vulnerabilities in outdated content management systems, particularly WordPress plugins that haven't been updated. Once infected, the ransomware encrypts all files and demands payment in cryptocurrency.",
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
        content: "CloudService, a major SaaS provider with over 2 million business users, has disclosed a significant data breach affecting their authentication systems. The breach, discovered during routine security monitoring, exposed user credentials including hashed passwords.",
        industries: ["All industries"],
        tags: ["Data Breach", "SaaS", "Authentication"],
        recommendations: [
          "Change passwords for CloudService accounts immediately",
          "Enable two-factor authentication",
          "Monitor for suspicious activity on accounts",
          "Review and revoke unnecessary API integrations"
        ]
      }
    ]);
  });

  // Resources
  app.get("/api/resources", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
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
      }
    ]);
  });

  // Reports data
  app.get("/api/reports/team-progress", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      { id: 1, username: "Emma Watson", role: "HR Manager", completedModules: 4, totalModules: 5, completedAssessments: 3, totalAssessments: 4, averageScore: 92, lastActivity: "Today" },
      { id: 2, username: "Michael Brown", role: "Finance Director", completedModules: 3, totalModules: 5, completedAssessments: 2, totalAssessments: 4, averageScore: 85, lastActivity: "Yesterday" },
      { id: 3, username: "David Clark", role: "IT Specialist", completedModules: 5, totalModules: 5, completedAssessments: 4, totalAssessments: 4, averageScore: 98, lastActivity: "2 days ago" }
    ]);
  });

  app.get("/api/reports/module-completion", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      { name: "Password Security", completed: 24, inProgress: 6, notStarted: 2 },
      { name: "Phishing Awareness", completed: 18, inProgress: 10, notStarted: 4 },
      { name: "Data Protection", completed: 12, inProgress: 8, notStarted: 12 }
    ]);
  });

  app.get("/api/reports/assessment-scores", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      { name: "Password Security", averageScore: 88, usersCompleted: 24 },
      { name: "Phishing Attack Recognition", averageScore: 76, usersCompleted: 18 },
      { name: "Data Protection Principles", averageScore: 82, usersCompleted: 12 }
    ]);
  });

  app.get("/api/reports/awareness-trend", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      { date: "Jan", awarenessScore: 45 },
      { date: "Feb", awarenessScore: 52 },
      { date: "Mar", awarenessScore: 58 },
      { date: "Apr", awarenessScore: 62 },
      { date: "May", awarenessScore: 70 },
      { date: "Jun", awarenessScore: 73 }
    ]);
  });

  app.get("/api/reports/security-incidents", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json([
      { id: 1, type: "Phishing Attempt", date: "2 days ago", source: "Email", status: "Resolved", impact: "low" },
      { id: 2, type: "Unauthorized Access Attempt", date: "1 week ago", source: "VPN", status: "Resolved", impact: "medium" },
      { id: 3, type: "Data Leak", date: "2 weeks ago", source: "Cloud Storage", status: "Resolved", impact: "high" }
    ]);
  });

  const httpServer = createServer(app);

  return httpServer;
}
