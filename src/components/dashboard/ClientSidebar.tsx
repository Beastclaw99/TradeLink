
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  HelpCircle
} from 'lucide-react';

const sidebarItems = [
  {
    title: "My Profile",
    icon: User,
    href: "/profile",
    description: "Manage personal information and settings"
  },
  {
    title: "My Network",
    icon: Users,
    href: "/network",
    description: "List of preferred professionals"
  },
  {
    title: "Invoices",
    icon: FileText,
    href: "/invoices",
    description: "Payment management and billing history"
  },
  {
    title: "Analytics",
    icon: BarChart,
    href: "/analytics",
    description: "Project costs and performance insights"
  },
  {
    title: "Insights",
    icon: TrendingUp,
    href: "/insights",
    description: "Market trends and rate insights"
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

const ClientSidebar: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const location = useLocation();

  return (
    <div 
      className="fixed right-0 top-16 z-50 h-[calc(100vh-4rem)]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hover trigger area */}
      <div className="absolute right-0 top-0 w-4 h-full bg-transparent" />
      
      {/* Sidebar content */}
      <div className={cn(
        "bg-white border-l border-gray-200 shadow-lg h-full transition-transform duration-300 ease-in-out w-80",
        isHovered ? "translate-x-0" : "translate-x-72"
      )}>
        {/* Tab indicator */}
        <div className="absolute -left-12 top-1/2 transform -translate-y-1/2">
          <div className="bg-ttc-blue-600 text-white px-3 py-2 rounded-l-lg shadow-lg">
            <div className="text-sm font-medium writing-mode-vertical-rl text-orientation-mixed">
              MENU
            </div>
          </div>
        </div>

        {/* Sidebar header */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Client Dashboard</h3>
          <p className="text-sm text-gray-500 mt-1">Quick access to your tools</p>
        </div>

        {/* Navigation items */}
        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-100px)]">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.href || 
                           (item.href === '/profile' && location.pathname === '/dashboard' && location.search.includes('tab=profile'));
            
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-colors duration-200 group",
                  isActive 
                    ? "bg-ttc-blue-50 text-ttc-blue-700 border border-ttc-blue-200" 
                    : "hover:bg-gray-50 text-gray-700"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 mt-0.5 flex-shrink-0",
                  isActive ? "text-ttc-blue-600" : "text-gray-500 group-hover:text-gray-700"
                )} />
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-sm font-medium",
                    isActive ? "text-ttc-blue-700" : "text-gray-900"
                  )}>
                    {item.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight">
                    {item.description}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ClientSidebar;
