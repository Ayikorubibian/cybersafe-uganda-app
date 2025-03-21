import { users, type User, type InsertUser, modules, assessments, resources, securityEvents } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Add module-related methods
  getModules(): Promise<typeof modules.$inferSelect[]>;
  getModuleById(id: number): Promise<typeof modules.$inferSelect | undefined>;
  
  // Add assessment-related methods
  getAssessments(): Promise<typeof assessments.$inferSelect[]>;
  getAssessmentById(id: number): Promise<typeof assessments.$inferSelect | undefined>;
  
  // Add resources-related methods
  getResources(): Promise<typeof resources.$inferSelect[]>;
  getResourceById(id: number): Promise<typeof resources.$inferSelect | undefined>;
  
  // Add security events-related methods
  getSecurityEvents(): Promise<typeof securityEvents.$inferSelect[]>;
  
  // Session store for authentication
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moduleData: Map<number, typeof modules.$inferSelect>;
  private assessmentData: Map<number, typeof assessments.$inferSelect>;
  private resourceData: Map<number, typeof resources.$inferSelect>;
  private securityEventData: Map<number, typeof securityEvents.$inferSelect>;
  sessionStore: session.SessionStore;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.moduleData = new Map();
    this.assessmentData = new Map();
    this.resourceData = new Map();
    this.securityEventData = new Map();
    this.currentId = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // Clear expired sessions every day
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Module methods
  async getModules(): Promise<typeof modules.$inferSelect[]> {
    return Array.from(this.moduleData.values());
  }
  
  async getModuleById(id: number): Promise<typeof modules.$inferSelect | undefined> {
    return this.moduleData.get(id);
  }
  
  // Assessment methods
  async getAssessments(): Promise<typeof assessments.$inferSelect[]> {
    return Array.from(this.assessmentData.values());
  }
  
  async getAssessmentById(id: number): Promise<typeof assessments.$inferSelect | undefined> {
    return this.assessmentData.get(id);
  }
  
  // Resource methods
  async getResources(): Promise<typeof resources.$inferSelect[]> {
    return Array.from(this.resourceData.values());
  }
  
  async getResourceById(id: number): Promise<typeof resources.$inferSelect | undefined> {
    return this.resourceData.get(id);
  }
  
  // Security event methods
  async getSecurityEvents(): Promise<typeof securityEvents.$inferSelect[]> {
    return Array.from(this.securityEventData.values());
  }
}

export const storage = new MemStorage();
