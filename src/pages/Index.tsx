
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();
  const { state } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <div className="flex-1 container py-12">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-bank-700 mb-4">银行用户画像与客户经理分配系统</h1>
          <p className="text-lg text-gray-600 mb-8">
            欢迎使用银行用户画像与客户经理分配系统，这是一个为银行客户和客户经理提供精准匹配的智能平台。
          </p>
          
          {!state.isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button size="lg" onClick={() => navigate('/register')}>
                立即注册
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/login')}>
                登录系统
              </Button>
            </div>
          ) : (
            <div className="mb-12">
              <Button size="lg" onClick={() => navigate('/dashboard')}>
                进入控制面板
              </Button>
            </div>
          )}
          
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">客户服务</h2>
                <p className="text-gray-600">
                  完善您的个人资料和投资需求，系统将为您匹配最适合的客户经理。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">客户经理服务</h2>
                <p className="text-gray-600">
                  展示您的专业能力和兴趣爱好，系统将为您匹配最适合的客户群体。
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">数据分析</h2>
                <p className="text-gray-600">
                  利用K-Means++算法分析用户数据，实现客户精准分类和智能匹配。
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <footer className="bg-white border-t py-6">
        <div className="container text-center text-gray-500 text-sm">
          © 2025 银行用户画像与客户经理分配系统. 保留所有权利.
        </div>
      </footer>
    </div>
  );
};

export default Index;
