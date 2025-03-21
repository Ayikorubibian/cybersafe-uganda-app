import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/components/ui/theme-provider";
import { UserAvatar } from "@/components/user-avatar";
import {
  BarChart2,
  BookOpen,
  FileText,
  AlertTriangle,
  FolderLock,
  Settings,
  LogOut,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Sidebar = () => {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(true);
      } else {
        setMobileMenuOpen(false);
      }
    };

    handleResize(); // Call once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const navItems = [
    { icon: <BarChart2 className="mr-3 h-5 w-5" />, name: "Dashboard", path: "/" },
    { icon: <BookOpen className="mr-3 h-5 w-5" />, name: "Learning Modules", path: "/modules" },
    { icon: <FileText className="mr-3 h-5 w-5" />, name: "Assessments", path: "/assessments" },
    { icon: <AlertTriangle className="mr-3 h-5 w-5" />, name: "Threat Intelligence", path: "/threats" },
    { icon: <FolderLock className="mr-3 h-5 w-5" />, name: "Resources", path: "/resources" },
    { icon: <BarChart2 className="mr-3 h-5 w-5" />, name: "Reports & Analytics", path: "/reports" },
  ];

  return (
    <aside className="bg-slate-800 text-white md:w-64 w-full md:fixed md:h-screen z-10 transition-all duration-300 ease-in-out">
      <div className="p-4 flex justify-between items-center md:justify-center border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">CyberGuard</h1>
        </div>
        <Button 
          variant="ghost" 
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
      
      <div className={cn("p-4", { "hidden": !mobileMenuOpen, "md:block": true })}>
        {user && (
          <div className="flex items-center p-2 mb-6 bg-slate-700 rounded-lg">
            <UserAvatar user={user} />
            <div className="ml-3">
              <p className="text-sm font-medium">{user.username}</p>
              <p className="text-xs text-slate-400">Security Admin</p>
            </div>
          </div>
        )}
        
        <nav>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={cn(
                    "flex items-center p-3 text-sm rounded-lg hover:bg-slate-700 group",
                    { "bg-primary-dark": location === item.path }
                  )}>
                    {item.icon}
                    <span>{item.name}</span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Link href="/settings">
            <a className="flex items-center p-3 text-sm rounded-lg hover:bg-slate-700 group">
              <Settings className="mr-3 h-5 w-5" />
              <span>Settings</span>
            </a>
          </Link>
          <button 
            onClick={handleLogout} 
            className="flex items-center p-3 text-sm rounded-lg hover:bg-slate-700 text-red-400 group w-full text-left"
          >
            <LogOut className="mr-3 h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
