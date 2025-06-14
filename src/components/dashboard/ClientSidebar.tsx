
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { 
  User, 
  Users, 
  FileText, 
  BarChart, 
  TrendingUp, 
  Bell, 
  MessageSquare, 
  Settings, 
  Phone,
  HelpCircle,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const sidebarItems = [
  {
    title: "Projects",
    icon: FileText,
    href: "/dashboard",
    tab: "projects",
    description: "Manage your projects and view progress"
  },
  {
    title: "Applications",
    icon: Users,
    href: "/dashboard",
    tab: "applications",
    description: "Review project applications"
  },
  {
    title: "Post Project",
    icon: TrendingUp,
    href: "/dashboard",
    tab: "create",
    description: "Create a new project"
  },
  {
    title: "Payments",
    icon: BarChart,
    href: "/dashboard",
    tab: "payments",
    description: "View payments and billing"
  },
  {
    title: "My Profile",
    icon: User,
    href: "/profile",
    description: "Manage personal information and settings"
  },
  {
    title: "Notifications",
    icon: Bell,
    href: "/notifications",
    description: "Alerts and updates"
  },
  {
    title: "Messages",
    icon: MessageSquare,
    href: "/messages",
    description: "Messaging interface"
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
    description: "Platform preferences"
  },
  {
    title: "Contact Support",
    icon: Phone,
    href: "/support",
    description: "Submit tickets for assistance"
  },
  {
    title: "Help Centre",
    icon: HelpCircle,
    href: "/help",
    description: "FAQs and resources"
  }
];

interface ClientSidebarProps {
  onExpand: (expanded: boolean) => void;
}

const ClientSidebar: React.FC<ClientSidebarProps> = ({ onExpand }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    onExpand(isExpanded);
  }, [isExpanded, onExpand]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNavigation = (item: typeof sidebarItems[0]) => {
    if (item.tab && item.href === '/dashboard') {
      // Navigate to dashboard with specific tab
      navigate('/dashboard', { state: { activeTab: item.tab } });
    } else {
      // For other routes, navigate normally (these may not exist yet)
      navigate(item.href);
    }
  };

  return (
    <aside className={cn(
      "fixed right-0 top-16 z-40 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out",
      isExpanded ? "w-64" : "w-16"
    )}>
      <div className="bg-white border-l border-gray-200 shadow-lg h-full">
        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-4 top-6 h-8 w-8 rounded-full border border-gray-200 bg-white shadow-md hover:bg-gray-50"
          onClick={handleToggle}
        >
          {isExpanded ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>

        {/* Sidebar header */}
        <div className={cn(
          "p-4 border-b border-gray-200",
          !isExpanded && "flex justify-center"
        )}>
          {isExpanded ? (
            <>
              <h3 className="text-lg font-semibold text-gray-900">Client Dashboard</h3>
              <p className="text-sm text-gray-500 mt-1">Quick access to your tools</p>
            </>
          ) : (
            <div className="w-8 h-8 rounded-full bg-ttc-blue-600 flex items-center justify-center">
              <span className="text-white text-sm font-medium">C</span>
            </div>
          )}
        </div>

        {/* Navigation items */}
        <nav className="p-2 space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href && 
                           (!item.tab || location.state?.activeTab === item.tab);
            
            const menuItem = (
              <button
                key={item.href + (item.tab || '')}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "w-full flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 group text-left",
                  isActive 
                    ? "bg-ttc-blue-50 text-ttc-blue-700 border border-ttc-blue-200" 
                    : "hover:bg-gray-50 text-gray-700"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 flex-shrink-0",
                  isActive ? "text-ttc-blue-600" : "text-gray-500 group-hover:text-gray-700"
                )} />
                {isExpanded && (
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "text-sm font-medium",
                      isActive ? "text-ttc-blue-700" : "text-gray-900"
                    )}>
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5 leading-tight">
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            );

            if (!isExpanded) {
              return (
                <TooltipProvider key={item.href + (item.tab || '')} delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      {menuItem}
                    </TooltipTrigger>
                    <TooltipContent side="left" align="center">
                      {item.title}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            }

            return menuItem;
          })}
        </nav>
      </div>
    </aside>
  );
};

export default ClientSidebar;
