
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { UserCircle, LogOut } from 'lucide-react';

const Navbar = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

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
              <div className="hidden md:flex items-center text-sm text-gray-600">
                <UserCircle className="h-5 w-5 mr-1" />
                <span>
                  {state.user?.name} ({getRoleText(state.user?.role || '')})
                </span>
              </div>
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
};

export default Navbar;
