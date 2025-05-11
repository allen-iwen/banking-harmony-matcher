
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import UserAuthForm from '@/components/UserAuthForm';
import Navbar from '@/components/Navbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const navigate = useNavigate();
  const { state } = useAuth();
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");
  
  useEffect(() => {
    if (state.isAuthenticated) {
      navigate('/dashboard');
    }
  }, [state.isAuthenticated, navigate]);

  // 检查API服务器是否在线
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        // 这里将来会替换为实际的Flask API健康检查端点
        // 例如: const response = await fetch('http://localhost:5000/api/health');
        // 目前使用模拟数据
        setServerStatus("online");
        console.log("API服务器在线");
      } catch (error) {
        console.error("API服务器离线:", error);
        setServerStatus("offline");
        toast({
          title: "连接错误",
          description: "无法连接到服务器，请稍后再试",
          variant: "destructive",
        });
      }
    };

    checkServerStatus();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {serverStatus === "offline" && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                服务器连接失败，系统将使用本地模式运行。部分功能可能不可用。
              </AlertDescription>
            </Alert>
          )}
          
          <UserAuthForm mode="login" />
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>系统环境: {import.meta.env.MODE}</p>
            <p>API 状态: {serverStatus === "checking" ? "检查中..." : serverStatus === "online" ? "在线" : "离线"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
