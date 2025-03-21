import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email"),
  role: text("role").default("user"),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  role: true,
});

// Learning modules table schema
export const modules = pgTable("modules", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  duration: text("duration").notNull(),
  level: text("level").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertModuleSchema = createInsertSchema(modules).pick({
  title: true,
  description: true,
  content: true,
  duration: true,
  level: true,
  category: true,
});

// User progress tracking for modules
export const moduleProgress = pgTable("module_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  moduleId: integer("module_id").notNull(),
  status: text("status").notNull(), // 'not-started', 'in-progress', 'completed'
  progress: integer("progress").default(0),
  completedAt: timestamp("completed_at"),
  lastActivity: timestamp("last_activity").defaultNow(),
});

export const insertModuleProgressSchema = createInsertSchema(moduleProgress).pick({
  userId: true,
  moduleId: true,
  status: true,
  progress: true,
});

// Assessments table schema
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  moduleId: integer("module_id"), // Related module, if any
  timeLimit: text("time_limit"),
  passingScore: integer("passing_score").default(70),
  questions: jsonb("questions").notNull(), // JSON array of questions
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAssessmentSchema = createInsertSchema(assessments).pick({
  title: true,
  description: true,
  moduleId: true,
  timeLimit: true,
  passingScore: true,
  questions: true,
});

// Assessment attempts by users
export const assessmentAttempts = pgTable("assessment_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  assessmentId: integer("assessment_id").notNull(),
  score: integer("score"),
  passed: boolean("passed"),
  answers: jsonb("answers"), // User's answers
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertAssessmentAttemptSchema = createInsertSchema(assessmentAttempts).pick({
  userId: true,
  assessmentId: true,
  score: true,
  passed: true,
  answers: true,
});

// Security events/threats table
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content"),
  category: text("category").notNull(),
  severity: text("severity").notNull(), // 'informational', 'low', 'medium', 'high', 'critical'
  source: text("source"),
  recommendations: jsonb("recommendations"), // JSON array of recommendations
  industries: jsonb("industries"), // Affected industries
  tags: jsonb("tags"), // Tags for categorization
  publishedAt: timestamp("published_at").defaultNow(),
});

export const insertSecurityEventSchema = createInsertSchema(securityEvents).pick({
  title: true,
  description: true,
  content: true,
  category: true,
  severity: true,
  source: true,
  recommendations: true,
  industries: true,
  tags: true,
});

// Resources table schema
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // 'document', 'video', 'template', 'link'
  category: text("category").notNull(),
  url: text("url").notNull(),
  fileSize: text("file_size"),
  duration: text("duration"),
  popular: boolean("popular").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).pick({
  title: true,
  description: true,
  type: true,
  category: true,
  url: true,
  fileSize: true,
  duration: true,
  popular: true,
});

// User activity logs
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  action: text("action").notNull(),
  details: jsonb("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  details: true,
  ipAddress: true,
  userAgent: true,
});

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertModule = z.infer<typeof insertModuleSchema>;
export type Module = typeof modules.$inferSelect;

export type InsertModuleProgress = z.infer<typeof insertModuleProgressSchema>;
export type ModuleProgress = typeof moduleProgress.$inferSelect;

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

export type InsertAssessmentAttempt = z.infer<typeof insertAssessmentAttemptSchema>;
export type AssessmentAttempt = typeof assessmentAttempts.$inferSelect;

export type InsertSecurityEvent = z.infer<typeof insertSecurityEventSchema>;
export type SecurityEvent = typeof securityEvents.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
