
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Bell, LogOut, Search, Menu } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from '@/components/ui/sidebar';

const Navbar = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  
  // Check if we're on a public page where sidebar is not needed
  const isPublicPage = location.pathname === '/login' || 
                       location.pathname === '/register' || 
                       location.pathname === '/';
  
  // Only access useSidebar when not on public pages to prevent errors
  const sidebarContext = !isPublicPage ? useSidebar() : null;
  
  const toggleSidebar = () => {
    if (sidebarContext) {
      sidebarContext.toggleSidebar();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'customer':
        return '客户';
      case 'manager':
        return '客户经理';
      case 'admin':
        return '管理员';
      default:
        return '用户';
    }
  };

  // For public pages, show a simpler navbar
  if (isPublicPage) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          <div className="flex items-center">
            <h1 
              onClick={() => navigate('/')}
              className="text-xl font-semibold text-bank-700 flex items-center cursor-pointer"
            >
              <span className="bg-bank-600 text-white p-1 rounded mr-2">
                BH
              </span>
              银行客户画像系统
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {state.isAuthenticated ? (
              <>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout} 
                  className="text-gray-600 hover:text-red-600 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  退出
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/login')}
                >
                  登录
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  注册
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // For authenticated pages with sidebar
  return (
    <header className="bg-white border-b h-14 flex items-center px-4 md:px-6">
      <div className="flex-1 flex items-center gap-2 md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>
      
      <div className={`flex-1 transition-all duration-200 ${searchOpen ? 'flex' : 'hidden md:flex'}`}>
        <form className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="搜索..."
            className="w-full bg-gray-100 pl-8 focus-visible:ring-bank-500"
          />
        </form>
      </div>
      
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>通知中心</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              <div className="flex items-start gap-4 p-3 hover:bg-gray-100">
                <div className="h-8 w-8 rounded-full bg-bank-100 flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-bank-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">系统功能更新通知</p>
                  <p className="text-xs text-gray-500 mt-1">系统新增了智能客服功能，您现在可以通过智能问答获取帮助</p>
                  <p className="text-xs text-gray-400 mt-1">10分钟前</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="flex items-start gap-4 p-3 hover:bg-gray-100">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Bell className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-sm font-medium">客户经理已回复</p>
                  <p className="text-xs text-gray-500 mt-1">您的问题"如何更新我的投资偏好"已被回复</p>
                  <p className="text-xs text-gray-400 mt-1">2小时前</p>
                </div>
              </div>
            </div>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button variant="ghost" size="sm" className="w-full justify-center">
                查看全部通知
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {state.isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="hidden md:block">{state.user?.name}</div>
                <div className="h-8 w-8 rounded-full bg-bank-100 flex items-center justify-center">
                  {state.user?.name.charAt(0)}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {state.user?.name} ({getRoleText(state.user?.role || '')})
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => navigate('/dashboard')}>
                仪表盘
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/customer-insights')}>
                {state.user?.role === 'customer' ? '我的资料' : '客户管理'}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => navigate('/ai-support')}>
                智能客服
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={handleLogout} className="text-red-600">
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default Navbar;
