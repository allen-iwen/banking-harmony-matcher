
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, CircleDot, Clock } from 'lucide-react';

type EnhancementStatus = 'planned' | 'in-progress' | 'completed';

interface EnhancementItem {
  id: string;
  title: string;
  description: string;
  status: EnhancementStatus;
  eta?: string;
  category: 'user-portrait' | 'manager-matching' | 'product-recommendation' | 'data-analysis' | 'security' | 'ui-optimization' | 'performance';
}

const enhancementItems: EnhancementItem[] = [
  // 用户画像功能拓展
  {
    id: 'up-1',
    title: '非结构化数据分析',
    description: '通过NLP技术分析客服对话文本、社交媒体行为数据，挖掘客户情绪倾向和关注点',
    status: 'planned',
    eta: '2023 Q3',
    category: 'user-portrait'
  },
  {
    id: 'up-2',
    title: '实时画像更新',
    description: '与银行核心业务系统深度对接，实现客户数据实时更新',
    status: 'planned',
    eta: '2023 Q2',
    category: 'user-portrait'
  },
  
  // 客户经理分配优化
  {
    id: 'mm-1',
    title: '智能匹配算法升级',
    description: '引入强化学习算法，根据环境变化、业务目标和客户反馈动态优化匹配模型',
    status: 'planned',
    eta: '2023 Q3',
    category: 'manager-matching'
  },
  {
    id: 'mm-2',
    title: '匹配过程可视化',
    description: '提供匹配过程的可视化界面，展示匹配度计算依据和结果',
    status: 'in-progress',
    eta: '2023 Q2',
    category: 'manager-matching'
  },
  
  // 产品推荐功能
  {
    id: 'pr-1',
    title: '精准个性化产品推荐',
    description: '基于用户画像和客户经理专业知识，为客户推荐合适的金融产品',
    status: 'planned',
    eta: '2023 Q4',
    category: 'product-recommendation'
  },
  {
    id: 'pr-2',
    title: '推荐效果跟踪评估',
    description: '建立产品推荐效果的跟踪评估机制，持续优化推荐算法',
    status: 'planned',
    eta: '2024 Q1',
    category: 'product-recommendation'
  },
  
  // 数据分析与决策支持
  {
    id: 'da-1',
    title: '业务数据分析工具',
    description: '提供数据分析工具和报表功能，展示客户分布、业务增长趋势等指标',
    status: 'in-progress',
    eta: '2023 Q2',
    category: 'data-analysis'
  },
  {
    id: 'da-2',
    title: '模拟决策功能',
    description: '支持管理层进行模拟决策分析，预测业务结果和风险',
    status: 'planned',
    eta: '2023 Q4',
    category: 'data-analysis'
  },
  
  // 系统安全强化
  {
    id: 'se-1',
    title: '高级数据加密',
    description: '采用国密算法对敏感信息进行加密，实施分类分级数据管理',
    status: 'completed',
    category: 'security'
  },
  {
    id: 'se-2',
    title: '细化访问控制',
    description: '实施基于角色的细粒度访问控制和多因素认证',
    status: 'in-progress',
    eta: '2023 Q2',
    category: 'security'
  },
  
  // 前端交互优化
  {
    id: 'ui-1',
    title: '客户经理工作台整合',
    description: '将各功能整合到统一工作台，提供一站式工作体验',
    status: 'in-progress',
    eta: '2023 Q2',
    category: 'ui-optimization'
  },
  {
    id: 'ui-2',
    title: '统一响应式设计',
    description: '确保系统在不同设备上的显示效果和操作体验一致',
    status: 'planned',
    eta: '2023 Q3',
    category: 'ui-optimization'
  },
  
  // 系统性能优化
  {
    id: 'pe-1',
    title: '大数据处理能力提升',
    description: '采用分布式计算框架处理海量客户数据',
    status: 'planned',
    eta: '2023 Q4',
    category: 'performance'
  },
  {
    id: 'pe-2',
    title: '微服务架构重构',
    description: '优化系统后端架构，采用微服务架构提高扩展性',
    status: 'planned',
    eta: '2024 Q1',
    category: 'performance'
  },
];

const StatusIcon = ({ status }: { status: EnhancementStatus }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case 'in-progress':
      return <CircleDot className="h-4 w-4 text-blue-500" />;
    case 'planned':
      return <Clock className="h-4 w-4 text-gray-500" />;
    default:
      return null;
  }
};

const StatusBadge = ({ status }: { status: EnhancementStatus }) => {
  switch (status) {
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">已完成</Badge>;
    case 'in-progress':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">进行中</Badge>;
    case 'planned':
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">计划中</Badge>;
    default:
      return null;
  }
};

const calculateProgress = (items: EnhancementItem[]): number => {
  const total = items.length;
  const completed = items.filter(item => item.status === 'completed').length;
  const inProgress = items.filter(item => item.status === 'in-progress').length;
  
  // 完成的计为1，进行中的计为0.5
  return total > 0 ? ((completed + (inProgress * 0.5)) / total) * 100 : 0;
};

const filterItemsByCategory = (items: EnhancementItem[], category: string): EnhancementItem[] => {
  return items.filter(item => item.category === category);
};

const SystemEnhancementRoadmap: React.FC = () => {
  const overallProgress = calculateProgress(enhancementItems);
  
  return (
    <div className="container mx-auto py-6">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">系统优化升级路线图</CardTitle>
          <CardDescription>
            展示银行客户画像与客户经理分配系统的功能优化和技术升级计划
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">总体进度</span>
              <span className="text-sm font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <StatusIcon status="completed" />
              <span className="text-sm">已完成 ({enhancementItems.filter(i => i.status === 'completed').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon status="in-progress" />
              <span className="text-sm">进行中 ({enhancementItems.filter(i => i.status === 'in-progress').length})</span>
            </div>
            <div className="flex items-center gap-2">
              <StatusIcon status="planned" />
              <span className="text-sm">计划中 ({enhancementItems.filter(i => i.status === 'planned').length})</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="user-portrait" className="w-full">
        <TabsList className="grid grid-cols-7 mb-8">
          <TabsTrigger value="user-portrait">用户画像</TabsTrigger>
          <TabsTrigger value="manager-matching">客户经理分配</TabsTrigger>
          <TabsTrigger value="product-recommendation">产品推荐</TabsTrigger>
          <TabsTrigger value="data-analysis">数据分析</TabsTrigger>
          <TabsTrigger value="security">系统安全</TabsTrigger>
          <TabsTrigger value="ui-optimization">界面优化</TabsTrigger>
          <TabsTrigger value="performance">性能优化</TabsTrigger>
        </TabsList>
        
        {['user-portrait', 'manager-matching', 'product-recommendation', 'data-analysis', 'security', 'ui-optimization', 'performance'].map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid md:grid-cols-2 gap-6">
              {filterItemsByCategory(enhancementItems, category).map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">{item.title}</CardTitle>
                      <StatusBadge status={item.status} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                  <CardFooter className="bg-gray-50 py-2 px-6 flex justify-between">
                    <div className="flex items-center gap-2">
                      <StatusIcon status={item.status} />
                      <span className="text-sm font-medium">
                        {item.status === 'completed' ? '已完成' : item.status === 'in-progress' ? '进行中' : '计划中'}
                      </span>
                    </div>
                    {item.eta && <span className="text-sm text-gray-500">预计完成: {item.eta}</span>}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SystemEnhancementRoadmap;
