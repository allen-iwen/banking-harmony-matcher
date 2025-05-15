
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { BarChart, LineChart, PieChart, RadarChart } from "@/components/ui/chart";
import { User, CustomerNeed, Hobby } from "@/types/types";

// Mock data for customer insights
const mockCustomerData = {
  id: "1",
  name: "张三",
  age: 35,
  occupation: "企业高管",
  totalAssets: 5000000,
  customerClass: "A" as const,
  needs: ["investment", "wealthManagement", "stock"] as CustomerNeed[],
  hobbies: ["travel", "art", "charity"] as Hobby[],
  riskTolerance: "中高风险",
  investmentPreference: "稳健增长型",
  transactionFrequency: "每周2-3次",
  preferredChannels: ["手机银行", "网上银行", "微信小程序"],
  activityScore: 85,
  sentimentAnalysis: {
    positive: 75,
    neutral: 20,
    negative: 5
  },
  contactHistory: [
    { date: "2023-04-10", channel: "电话", purpose: "理财产品咨询", duration: 15, sentiment: "积极" },
    { date: "2023-03-22", channel: "线下网点", purpose: "投资建议", duration: 45, sentiment: "中性" },
    { date: "2023-02-18", channel: "邮件", purpose: "市场资讯推送", duration: 0, sentiment: "积极" },
  ],
  productInterests: [
    { category: "理财产品", interestLevel: 85 },
    { category: "保险服务", interestLevel: 60 },
    { category: "信贷服务", interestLevel: 30 },
    { category: "基金投资", interestLevel: 90 },
    { category: "外汇服务", interestLevel: 40 },
  ],
  financialBehavior: {
    savingsRate: 35,
    investmentRate: 45,
    consumptionRate: 20
  },
  lifeEvents: [
    { event: "子女教育", timeframe: "3-5年内", financialImpact: "高" },
    { event: "房产投资", timeframe: "1-2年内", financialImpact: "高" },
    { event: "父母养老", timeframe: "持续性", financialImpact: "中" },
  ],
  relationshipNetwork: {
    familyMembers: 3,
    businessAssociates: 12,
    referrals: 5
  }
};

// 需求与产品映射
const needProductMapping = {
  savings: ["定期存款", "零存整取", "大额存单"],
  wealthManagement: ["理财产品", "资产配置服务", "家族财富管理"],
  investment: ["基金", "股票", "债券", "黄金"],
  retirement: ["养老保险", "养老理财", "养老年金"],
  loan: ["个人贷款", "房屋抵押贷款", "信用贷款"],
  insurance: ["人寿保险", "健康医疗保险", "财产保险"],
  stock: ["股票投资", "股票ETF", "港股通"],
  businessAssociation: ["企业对公服务", "商会活动", "高端客户俱乐部"]
};

interface CustomerInsightsProps {
  customerId?: string;
}

const CustomerInsights: React.FC<CustomerInsightsProps> = ({ customerId }) => {
  const { toast } = useToast();
  // In a real app, we would fetch the customer data based on the customerId
  // For now, we'll use the mock data
  const customerData = mockCustomerData;

  const sentimentData = {
    labels: ["积极", "中性", "消极"],
    datasets: [
      {
        data: [
          customerData.sentimentAnalysis.positive,
          customerData.sentimentAnalysis.neutral,
          customerData.sentimentAnalysis.negative
        ],
        backgroundColor: ["#4CAF50", "#FFC107", "#F44336"]
      }
    ]
  };

  const productInterestData = {
    labels: customerData.productInterests.map(item => item.category),
    datasets: [
      {
        label: "兴趣度",
        data: customerData.productInterests.map(item => item.interestLevel),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1
      }
    ]
  };

  const financialBehaviorData = {
    labels: ["储蓄", "投资", "消费"],
    datasets: [
      {
        data: [
          customerData.financialBehavior.savingsRate,
          customerData.financialBehavior.investmentRate,
          customerData.financialBehavior.consumptionRate
        ],
        backgroundColor: ["#2196F3", "#9C27B0", "#FF9800"]
      }
    ]
  };

  const recommendProducts = () => {
    toast({
      title: "产品推荐已生成",
      description: "根据客户画像已生成个性化产品推荐",
    });
  };

  const customerNeeds = customerData.needs.map(need => {
    const products = needProductMapping[need] || [];
    return { need, products };
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-2xl font-semibold">
                  {customerData.name.charAt(0)}
                </div>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{customerData.name}</CardTitle>
                <CardDescription>
                  {customerData.occupation} | {customerData.age}岁 | 
                  <Badge className="ml-2" variant="outline">
                    {customerData.customerClass}类客户
                  </Badge>
                </CardDescription>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold">总资产: ¥{(customerData.totalAssets / 10000).toFixed(2)}万</div>
              <div className="text-sm text-gray-500">
                活跃度: {customerData.activityScore}/100
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">客户概览</TabsTrigger>
          <TabsTrigger value="behavior">行为分析</TabsTrigger>
          <TabsTrigger value="needs">需求分析</TabsTrigger>
          <TabsTrigger value="recommendations">产品推荐</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>客户情绪分析</CardTitle>
                <CardDescription>
                  基于客服对话和反馈数据的情绪分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PieChart 
                    data={sentimentData}
                    options={{
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>财务行为分布</CardTitle>
                <CardDescription>
                  客户资金分配和财务行为分析
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <PieChart 
                    data={financialBehaviorData}
                    options={{
                      plugins: {
                        legend: { position: 'bottom' }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>产品兴趣分布</CardTitle>
                <CardDescription>
                  客户对不同金融产品种类的兴趣水平
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={productInterestData}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 100
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="behavior">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>客户画像标签</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge>风险偏好: {customerData.riskTolerance}</Badge>
                  <Badge variant="outline">投资偏好: {customerData.investmentPreference}</Badge>
                  <Badge variant="outline">交易频率: {customerData.transactionFrequency}</Badge>
                  {customerData.hobbies.map((hobby) => (
                    <Badge key={hobby} variant="secondary">{hobby}</Badge>
                  ))}
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">首选渠道</h4>
                  <div className="flex flex-wrap gap-2">
                    {customerData.preferredChannels.map((channel, index) => (
                      <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200" variant="outline">
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>生命周期事件</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerData.lifeEvents.map((event, index) => (
                    <div key={index} className="border-b pb-2 last:border-0">
                      <div className="flex justify-between">
                        <span className="font-medium">{event.event}</span>
                        <Badge 
                          variant={event.financialImpact === "高" ? "destructive" : 
                                 event.financialImpact === "中" ? "default" : "outline"}
                        >
                          {event.financialImpact}影响
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-500">时间范围: {event.timeframe}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>联系历史</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b text-left">
                        <th className="pb-2">日期</th>
                        <th className="pb-2">渠道</th>
                        <th className="pb-2">目的</th>
                        <th className="pb-2">时长(分)</th>
                        <th className="pb-2">情绪</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerData.contactHistory.map((contact, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-3">{contact.date}</td>
                          <td>{contact.channel}</td>
                          <td>{contact.purpose}</td>
                          <td>{contact.duration}</td>
                          <td>
                            <Badge variant={
                              contact.sentiment === "积极" ? "default" :
                              contact.sentiment === "中性" ? "outline" : "destructive"
                            }>
                              {contact.sentiment}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="needs">
          <div className="grid md:grid-cols-2 gap-6">
            {customerNeeds.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{getNeedDisplayName(item.need)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-medium mb-2">相关产品推荐:</div>
                  <div className="flex flex-wrap gap-2">
                    {item.products.map((product, idx) => (
                      <Badge key={idx} variant="outline">{product}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations">
          <Card>
            <CardHeader>
              <CardTitle>
                个性化产品推荐
                <button 
                  onClick={recommendProducts}
                  className="ml-2 inline-flex h-8 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground shadow hover:bg-primary/90"
                >
                  重新生成
                </button>
              </CardTitle>
              <CardDescription>基于客户画像、偏好和行为自动生成的产品组合推荐</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">核心推荐</h3>
                  <p className="text-sm text-gray-600 mb-4">根据客户高频需求和主要财务目标推荐的核心产品</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="border rounded-lg p-3">
                      <div className="font-medium">混合债券基金组合</div>
                      <div className="text-sm text-gray-600">适合风险偏好: {customerData.riskTolerance}</div>
                      <div className="text-sm text-gray-600">契合客户需求: 增值 + 稳健配置</div>
                      <div className="text-xs mt-2 text-blue-600">匹配度: 92%</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="font-medium">家族财富规划咨询</div>
                      <div className="text-sm text-gray-600">适合需求: 资产配置和传承</div>
                      <div className="text-sm text-gray-600">契合生命周期: 子女教育规划</div>
                      <div className="text-xs mt-2 text-blue-600">匹配度: 88%</div>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-2">辅助推荐</h3>
                  <p className="text-sm text-gray-600 mb-4">适合客户次要需求或特定短期目标的产品</p>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="border rounded-lg p-3">
                      <div className="font-medium">高端医疗保险</div>
                      <div className="text-xs mt-2 text-blue-600">匹配度: 75%</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="font-medium">房产抵押贷款</div>
                      <div className="text-xs mt-2 text-blue-600">匹配度: 70%</div>
                    </div>
                    <div className="border rounded-lg p-3">
                      <div className="font-medium">艺术品投资咨询</div>
                      <div className="text-xs mt-2 text-blue-600">匹配度: 65%</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// 需求类型名称转换
function getNeedDisplayName(need: CustomerNeed): string {
  const nameMap: Record<CustomerNeed, string> = {
    savings: "储蓄需求",
    wealthManagement: "财富管理",
    investment: "投资理财",
    retirement: "养老规划",
    loan: "贷款需求",
    insurance: "保险需求",
    stock: "股票投资",
    businessAssociation: "商业人脉"
  };
  
  return nameMap[need] || need;
}

export default CustomerInsights;
