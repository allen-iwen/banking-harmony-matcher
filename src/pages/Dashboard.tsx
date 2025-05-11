
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import CustomerProfile from '@/components/CustomerProfile';
import ManagerProfile from '@/components/ManagerProfile';
import AdminDashboard from '@/components/AdminDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated, navigate]);

  const renderDashboardContent = () => {
    if (!state.user) return null;

    switch (state.user.role) {
      case 'customer':
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">客户控制面板</h1>
            <CustomerProfile initialProfile={state.customerProfile} />
          </div>
        );
        
      case 'manager':
        return (
          <div className="max-w-4xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">客户经理控制面板</h1>
            <ManagerProfile initialProfile={state.managerProfile} />
          </div>
        );
        
      case 'admin':
        return <AdminDashboard />;
        
      default:
        return (
          <div className="text-center p-8">
            <p>未知用户角色</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container py-8">
        {renderDashboardContent()}
      </div>
    </div>
  );
};

export default Dashboard;
