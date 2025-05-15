
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, BarChart3, UserCircle, Users } from 'lucide-react';

const SystemEnhancements = () => {
  const enhancementModules = [
    {
      title: "系统优化路线图",
      description: "查看银行客户画像与客户经理分配系统的功能优化和技术升级计划",
      icon: <BarChart3 className="h-6 w-6" />,
      link: "/system-roadmap",
      status: "available",
    },
    {
      title: "增强客户画像洞察",
      description: "基于多维度数据分析的客户画像和金融行为洞察",
      icon: <UserCircle className="h-6 w-6" />,
      link: "/customer-insights",
      status: "available",
    },
    {
      title: "客户经理匹配可视化",
      description: "直观展示客户与客户经理匹配过程和匹配度评分",
      icon: <Users className="h-6 w-6" />,
      link: "/matching-visualization",
      status: "available",
    },
    {
      title: "个性化产品推荐",
      description: "基于客户画像和行为习惯的智能金融产品推荐",
      icon: <ChevronRight className="h-6 w-6" />,
      status: "coming-soon",
    },
    {
      title: "数据分析决策支持",
      description: "多维度业务数据分析与决策支持工具",
      icon: <ChevronRight className="h-6 w-6" />,
      status: "coming-soon", 
    },
    {
      title: "安全控制中心",
      description: "增强型数据加密与细粒度访问控制",
      icon: <ChevronRight className="h-6 w-6" />,
      status: "coming-soon",
    }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">系统功能优化与增强</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          银行客户画像与客户经理分配系统的新功能模块和增强特性，提供更精准的客户洞察、智能匹配和个性化服务
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {enhancementModules.map((module, index) => (
          <Card key={index} className={`${module.status === 'coming-soon' ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <div className="bg-blue-100 p-2 rounded-md text-blue-700">
                  {module.icon}
                </div>
                {module.status === 'coming-soon' && (
                  <div className="bg-gray-100 py-1 px-3 rounded-full text-xs font-medium text-gray-600">
                    即将推出
                  </div>
                )}
              </div>
              <CardTitle className="mt-4">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {module.status === 'available' ? (
                <Link to={module.link}>
                  <Button variant="outline" className="w-full">
                    查看模块 <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Button variant="outline" disabled className="w-full">
                  敬请期待 <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SystemEnhancements;
