
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UserAuthForm from '@/components/UserAuthForm';
import Navbar from '@/components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [state.isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <UserAuthForm mode="login" />
        </div>
      </div>
    </div>
  );
};

export default Login;
