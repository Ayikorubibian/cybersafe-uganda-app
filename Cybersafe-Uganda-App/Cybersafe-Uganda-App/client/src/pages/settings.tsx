import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/sidebar";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { UserAvatar } from "@/components/user-avatar";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Lock,
  Shield,
  User,
  Building,
  Users,
  Mail,
  MessageSquare,
  HelpCircle,
  CheckCircle
} from "lucide-react";

// Form schemas
const profileFormSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  role: z.string().min(1, "Please select a role."),
  company: z.string().min(1, "Please enter your company name."),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(8, "Password must be at least 8 characters."),
  newPassword: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters.")
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const notificationFormSchema = z.object({
  securityAlerts: z.boolean().default(true),
  newModules: z.boolean().default(true),
  assessmentReminders: z.boolean().default(true),
  teamUpdates: z.boolean().default(false),
  marketingEmails: z.boolean().default(false),
  emailDigest: z.string().default("daily"),
});

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      email: "user@example.com",
      role: "Security Admin",
      company: "Acme Inc",
      phone: "+1 (555) 123-4567",
      bio: "Cybersecurity specialist with 5+ years of experience."
    },
  });

  // Password form
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    },
  });

  // Notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      securityAlerts: true,
      newModules: true,
      assessmentReminders: true,
      teamUpdates: false,
      marketingEmails: false,
      emailDigest: "daily",
    },
  });

  // Form submission handlers
  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  }

  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    }, 1000);
  }

  function onNotificationSubmit(values: z.infer<typeof notificationFormSchema>) {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved successfully.",
      });
    }, 1000);
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      
      <main className="flex-1 md:ml-64 min-h-screen">
        <div className="p-4 md:p-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-500">Manage your account and application preferences</p>
          </header>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Settings Menu */}
            <div className="md:w-64">
              <Card>
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Button 
                      variant={activeTab === "profile" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("profile")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Button>
                    <Button 
                      variant={activeTab === "security" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("security")}
                    >
                      <Lock className="mr-2 h-4 w-4" />
                      Security
                    </Button>
                    <Button 
                      variant={activeTab === "notifications" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                    <Button 
                      variant={activeTab === "organization" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("organization")}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      Organization
                    </Button>
                    <Button 
                      variant={activeTab === "team" ? "default" : "ghost"} 
                      className="w-full justify-start"
                      onClick={() => setActiveTab("team")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Team Members
                    </Button>
                    <Separator className="my-2" />
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-slate-500"
                    >
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </Button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="flex-1">
              {/* Profile Settings */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Manage your personal information and account details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row gap-6 mb-6">
                      <div className="flex flex-col items-center">
                        {user && <UserAvatar user={user} />}
                        <Button variant="link" className="mt-2">Change Avatar</Button>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">{user?.username || "User Profile"}</h3>
                        <p className="text-sm text-slate-500">Security Administrator</p>
                        <div className="flex items-center mt-2">
                          <Badge className="bg-green-100 text-green-800">Active Account</Badge>
                        </div>
                      </div>
                    </div>

                    <Form {...profileForm}>
                      <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={profileForm.control}
                            name="username"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="role"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={profileForm.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={profileForm.control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormDescription>
                                Brief description about yourself
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Changes"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {/* Security Settings */}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and account security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h3 className="text-lg font-medium mb-4">Change Password</h3>
                    <Form {...passwordForm}>
                      <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormDescription>
                                Password should be at least 8 characters with a mix of letters, numbers, and symbols
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update Password"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Authenticator App</p>
                          <p className="text-sm text-slate-500">Use an authenticator app to generate one-time codes</p>
                        </div>
                        <Button variant="outline">Setup</Button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">SMS Authentication</p>
                          <p className="text-sm text-slate-500">Receive one-time codes via SMS</p>
                        </div>
                        <Button variant="outline">Setup</Button>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <h3 className="text-lg font-medium mb-4">Security Preferences</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Session Timeout</p>
                          <p className="text-sm text-slate-500">Automatically log out after period of inactivity</p>
                        </div>
                        <Select defaultValue="30min">
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select timeout" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="15min">15 minutes</SelectItem>
                            <SelectItem value="30min">30 minutes</SelectItem>
                            <SelectItem value="1hour">1 hour</SelectItem>
                            <SelectItem value="4hours">4 hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Login Notifications</p>
                          <p className="text-sm text-slate-500">Receive alerts for new login attempts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Remember this device</p>
                          <p className="text-sm text-slate-500">Stay logged in on this device</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Notification Settings */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Control how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...notificationForm}>
                      <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                        <h3 className="text-lg font-medium mb-2">Email Notifications</h3>
                        
                        <FormField
                          control={notificationForm.control}
                          name="securityAlerts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Security Alerts</FormLabel>
                                <FormDescription>
                                  Receive notifications about security incidents and threats
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="newModules"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>New Learning Modules</FormLabel>
                                <FormDescription>
                                  Get notified when new training modules are available
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="assessmentReminders"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Assessment Reminders</FormLabel>
                                <FormDescription>
                                  Receive reminders for upcoming and overdue assessments
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="teamUpdates"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Team Progress Updates</FormLabel>
                                <FormDescription>
                                  Get updates on your team's security training progress
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="marketingEmails"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                              <div className="space-y-0.5">
                                <FormLabel>Marketing and Newsletter</FormLabel>
                                <FormDescription>
                                  Receive product updates and cybersecurity news
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={notificationForm.control}
                          name="emailDigest"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Digest Frequency</FormLabel>
                              <Select 
                                value={field.value} 
                                onValueChange={field.onChange}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                  <SelectItem value="never">Never</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                How often you would like to receive email digests
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : "Save Preferences"}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
              
              {/* Organization Settings */}
              {activeTab === "organization" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Organization Settings</CardTitle>
                    <CardDescription>
                      Manage your organization's security configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-2">Organization Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Organization Name</Label>
                            <Input defaultValue="Acme Inc" />
                          </div>
                          <div className="space-y-2">
                            <Label>Industry</Label>
                            <Select defaultValue="technology">
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="technology">Technology</SelectItem>
                                <SelectItem value="finance">Finance</SelectItem>
                                <SelectItem value="healthcare">Healthcare</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Company Size</Label>
                            <Select defaultValue="medium">
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Small (1-50 employees)</SelectItem>
                                <SelectItem value="medium">Medium (51-250 employees)</SelectItem>
                                <SelectItem value="large">Large (251-1000 employees)</SelectItem>
                                <SelectItem value="enterprise">Enterprise (1000+ employees)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Domain</Label>
                            <Input defaultValue="acme.com" />
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Security Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Require Two-Factor Authentication</p>
                              <p className="text-sm text-slate-500">Enforce 2FA for all users in your organization</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Password Complexity Requirements</p>
                              <p className="text-sm text-slate-500">Enforce strong password policies</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Password Expiration</p>
                              <p className="text-sm text-slate-500">Require password changes periodically</p>
                            </div>
                            <Select defaultValue="90days">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="30days">Every 30 days</SelectItem>
                                <SelectItem value="60days">Every 60 days</SelectItem>
                                <SelectItem value="90days">Every 90 days</SelectItem>
                                <SelectItem value="never">Never</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">IP Restriction</p>
                              <p className="text-sm text-slate-500">Limit access to specific IP addresses</p>
                            </div>
                            <Button variant="outline">Configure</Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h3 className="text-lg font-medium mb-2">Compliance Requirements</h3>
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox id="gdpr" defaultChecked />
                            <div>
                              <Label htmlFor="gdpr" className="font-medium">GDPR</Label>
                              <p className="text-sm text-slate-500">General Data Protection Regulation</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <Checkbox id="hipaa" />
                            <div>
                              <Label htmlFor="hipaa" className="font-medium">HIPAA</Label>
                              <p className="text-sm text-slate-500">Health Insurance Portability and Accountability Act</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-3">
                            <Checkbox id="pci" />
                            <div>
                              <Label htmlFor="pci" className="font-medium">PCI DSS</Label>
                              <p className="text-sm text-slate-500">Payment Card Industry Data Security Standard</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button>Save Changes</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Team Members Settings */}
              {activeTab === "team" && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>
                        Manage users and their permissions
                      </CardDescription>
                    </div>
                    <Button>
                      <Users className="mr-2 h-4 w-4" />
                      Invite User
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border">
                      <div className="grid grid-cols-5 bg-slate-50 p-3 text-sm font-medium">
                        <div className="col-span-2">User</div>
                        <div>Role</div>
                        <div>Status</div>
                        <div className="text-right">Actions</div>
                      </div>
                      
                      <div className="grid grid-cols-5 p-3 text-sm border-t items-center">
                        <div className="col-span-2 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">Sarah Johnson</p>
                            <p className="text-xs text-slate-500">sarah@example.com</p>
                          </div>
                        </div>
                        <div>Security Admin</div>
                        <div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 p-3 text-sm border-t items-center">
                        <div className="col-span-2 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">Michael Brown</p>
                            <p className="text-xs text-slate-500">michael@example.com</p>
                          </div>
                        </div>
                        <div>Finance Director</div>
                        <div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 p-3 text-sm border-t items-center">
                        <div className="col-span-2 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">Emma Watson</p>
                            <p className="text-xs text-slate-500">emma@example.com</p>
                          </div>
                        </div>
                        <div>HR Manager</div>
                        <div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 p-3 text-sm border-t items-center">
                        <div className="col-span-2 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">David Clark</p>
                            <p className="text-xs text-slate-500">david@example.com</p>
                          </div>
                        </div>
                        <div>IT Specialist</div>
                        <div>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-5 p-3 text-sm border-t items-center">
                        <div className="col-span-2 flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 mr-3">
                            <User className="h-5 w-5 text-slate-500" />
                          </div>
                          <div>
                            <p className="font-medium">James Wilson</p>
                            <p className="text-xs text-slate-500">james@example.com</p>
                          </div>
                        </div>
                        <div>Sales Manager</div>
                        <div>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </div>
                        <div className="text-right">
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-2">Role Permissions</h3>
                      <p className="text-sm text-slate-500 mb-4">Configure access levels for each role in your organization</p>
                      
                      <Tabs defaultValue="admin">
                        <TabsList>
                          <TabsTrigger value="admin">Admin</TabsTrigger>
                          <TabsTrigger value="manager">Manager</TabsTrigger>
                          <TabsTrigger value="user">User</TabsTrigger>
                        </TabsList>
                        <TabsContent value="admin" className="space-y-4 mt-4 border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Manage Users</p>
                              <p className="text-sm text-slate-500">Add, edit, and remove users</p>
                            </div>
                            <CheckCircle className="text-green-600 h-5 w-5" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Organization Settings</p>
                              <p className="text-sm text-slate-500">Modify organization configuration</p>
                            </div>
                            <CheckCircle className="text-green-600 h-5 w-5" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">View Reports</p>
                              <p className="text-sm text-slate-500">Access analytics and reporting</p>
                            </div>
                            <CheckCircle className="text-green-600 h-5 w-5" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Manage Content</p>
                              <p className="text-sm text-slate-500">Add and edit training modules</p>
                            </div>
                            <CheckCircle className="text-green-600 h-5 w-5" />
                          </div>
                        </TabsContent>
                        <TabsContent value="manager" className="mt-4">
                          {/* Manager permissions content */}
                        </TabsContent>
                        <TabsContent value="user" className="mt-4">
                          {/* User permissions content */}
                        </TabsContent>
                      </Tabs>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component to avoid shadcn imports
const Label = ({ htmlFor, className, children }: { htmlFor?: string, className?: string, children: React.ReactNode }) => (
  <label
    htmlFor={htmlFor}
    className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`}
  >
    {children}
  </label>
);

// Helper component for badges
const Badge = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className || ''}`}>
    {children}
  </span>
);
