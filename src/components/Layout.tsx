
import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarInset,
  SidebarFooter,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  MessageSquare,
  PieChart,
  BarChart,
  ChevronRight,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { state } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(true);

  // Navigation items based on user role
  const getNavItems = () => {
    if (state.user?.role === 'admin') {
      return [
        { title: "仪表盘", path: "/dashboard", icon: <LayoutDashboard /> },
        { title: "客户管理", path: "/customer-insights", icon: <Users /> },
        { title: "经理分配", path: "/matching-visualization", icon: <PieChart /> },
        { title: "系统功能", path: "/enhancements", icon: <ChevronRight /> },
        { title: "数据分析", path: "/system-roadmap", icon: <BarChart /> },
      ];
    } else if (state.user?.role === 'manager') {
      return [
        { title: "仪表盘", path: "/dashboard", icon: <LayoutDashboard /> },
        { title: "我的客户", path: "/customer-insights", icon: <Users /> },
        { title: "分配情况", path: "/matching-visualization", icon: <PieChart /> },
        { title: "功能中心", path: "/enhancements", icon: <ChevronRight /> },
      ];
    } else {
      return [
        { title: "仪表盘", path: "/dashboard", icon: <LayoutDashboard /> },
        { title: "我的资料", path: "/customer-insights", icon: <Users /> },
        { title: "功能中心", path: "/enhancements", icon: <ChevronRight /> },
      ];
    }
  };
  
  // Get AI Support items
  const getAISupportItems = () => {
    return [
      { title: "智能问答", path: "/ai-support", icon: <MessageSquare /> },
      { title: "系统功能", path: "/enhancements", icon: <BarChart3 /> },
    ];
  };

  const navItems = getNavItems();
  const aiSupportItems = getAISupportItems();

  if (!state.isAuthenticated && location.pathname !== '/login' && location.pathname !== '/register' && location.pathname !== '/') {
    return <>{children}</>;
  }
  
  // Return simple layout for public pages
  if (location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/') {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={open} onOpenChange={setOpen}>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 px-4">
              <span className="bg-bank-600 text-white p-1 rounded">BH</span>
              <span className="font-semibold text-lg">银行客户画像系统</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>主要功能</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        isActive={location.pathname === item.path} 
                        asChild
                        tooltip={item.title}
                      >
                        <Link to={item.path}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            
            <SidebarSeparator />
            
            <SidebarGroup>
              <SidebarGroupLabel>智能支持</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {aiSupportItems.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton 
                        isActive={location.pathname === item.path} 
                        asChild
                        tooltip={item.title}
                      >
                        <Link to={item.path}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="px-4 py-2">
              {state.user && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="h-8 w-8 rounded-full bg-bank-100 flex items-center justify-center">
                    {state.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{state.user.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {state.user.role === 'admin' ? '管理员' : 
                       state.user.role === 'manager' ? '客户经理' : '客户'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </SidebarFooter>
          
          <SidebarRail />
        </Sidebar>
        
        <SidebarInset>
          <div className="flex h-full flex-col">
            <Navbar />
            <div className="flex-1 p-4 md:p-6 overflow-y-auto">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
