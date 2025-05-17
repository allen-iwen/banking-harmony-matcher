import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PieChart, BarChart, RadarChart } from "@/components/ui/charts";
import { CustomerNeed, Hobby } from "@/types/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for demonstration
const mockCustomer = {
  id: "c1",
  name: "王小明",
  age: 42,
  occupation: "企业家",
  totalAssets: 8000000,
  needs: ["investment", "wealthManagement", "businessAssociation"] as CustomerNeed[],
  hobbies: ["golf", "travel", "art"] as Hobby[],
};

const mockManagers = [
  {
    id: "m1",
    name: "李经理",
    capabilities: ["investment", "wealthManagement", "stock"] as CustomerNeed[],
    hobbies: ["travel", "food", "reading"] as Hobby[],
    customerCount: 28,
    performanceScore: 92,
    experienceYears: 8,
    specialization: "高净值客户投资顾问"
  },
  {
    id: "m2",
    name: "张经理",
    capabilities: ["wealthManagement", "retirement", "insurance"] as CustomerNeed[],
    hobbies: ["art", "charity", "fitness"] as Hobby[],
    customerCount: 35,
    performanceScore: 87,
    experienceYears: 5,
    specialization: "家族财富传承规划"
  },
  {
    id: "m3",
    name: "王经理",
    capabilities: ["savings", "loan", "insurance"] as CustomerNeed[],
    hobbies: ["gaming", "reading", "food"] as Hobby[],
    customerCount: 42,
    performanceScore: 81,
    experienceYears: 3,
    specialization: "个人融资顾问"
  },
  {
    id: "m4",
    name: "赵经理",
    capabilities: ["businessAssociation", "wealthManagement", "investment"] as CustomerNeed[],
    hobbies: ["golf", "travel", "charity"] as Hobby[],
    customerCount: 22,
    performanceScore: 95,
    experienceYears: 10,
    specialization: "高端商务客户关系管理"
  },
];

// 计算匹配分数和匹配细节
const calculateMatchScores = (customer: typeof mockCustomer, managers: typeof mockManagers) => {
  return managers.map(manager => {
    // 需求匹配
    const needsMatch = customer.needs.filter(need => 
      manager.capabilities.includes(need)
    );
    
    // 爱好匹配
    const hobbiesMatch = customer.hobbies.filter(hobby => 
      manager.hobbies.includes(hobby as any)
    );
    
    // 计算匹配分数 (加权计算)
    const needsScore = (needsMatch.length / customer.needs.length) * 60; // 需求匹配占60%
    const hobbiesScore = (hobbiesMatch.length / customer.hobbies.length) * 30; // 爱好匹配占30%
    
    // 考虑经理负载情况 (客户数越少越好)
    const loadScore = (1 - (manager.customerCount / 50)) * 10; // 负载占10%
    
    // 总分
    const totalScore = Math.round(needsScore + hobbiesScore + loadScore);
    
    return {
      ...manager,
      matchScore: totalScore,
      needsMatch: needsMatch,
      needsMatchCount: needsMatch.length,
      needsMatchPercentage: Math.round((needsMatch.length / customer.needs.length) * 100),
      hobbiesMatch: hobbiesMatch,
      hobbiesMatchCount: hobbiesMatch.length,
      hobbiesMatchPercentage: Math.round((hobbiesMatch.length / customer.hobbies.length) * 100),
      loadScore: Math.round(loadScore * 10) // 转换为百分制
    };
  }).sort((a, b) => b.matchScore - a.matchScore); // 按匹配分数排序
};

const matchedManagers = calculateMatchScores(mockCustomer, mockManagers);

interface MatchingVisualizationProps {
  customerId?: string;
}

const MatchingVisualization: React.FC<MatchingVisualizationProps> = ({ customerId }) => {
  const [selectedManager, setSelectedManager] = useState(matchedManagers[0]);
  
  // 在实际应用中，我们会根据customerId获取真实数据
  const customer = mockCustomer;
  const managers = matchedManagers;
  
  // 准备详细匹配图表数据
  const detailedMatchData = {
    labels: ['需求匹配度', '爱好匹配度', '负载情况'],
    datasets: managers.map((manager, index) => ({
      label: manager.name,
      data: [
        manager.needsMatchPercentage, 
        manager.hobbiesMatchPercentage, 
        manager.loadScore
      ],
      backgroundColor: `rgba(${75 + index * 50}, ${192 - index * 30}, ${192}, 0.2)`,
      borderColor: `rgba(${75 + index * 50}, ${192 - index * 30}, ${192}, 1)`,
      borderWidth: 2,
      pointBackgroundColor: `rgba(${75 + index * 50}, ${192 - index * 30}, ${192}, 1)`,
    }))
  };
  
  // 准备最佳经理匹配详情
  const bestMatchRadarData = {
    labels: ['需求匹配', '爱好匹配', '客户负载', '绩效评分', '经验年限'],
    datasets: [
      {
        label: selectedManager.name,
        data: [
          selectedManager.needsMatchPercentage,
          selectedManager.hobbiesMatchPercentage,
          100 - (selectedManager.customerCount * 2), // 转换为0-100的评分
          selectedManager.performanceScore,
          Math.min(selectedManager.experienceYears * 10, 100) // 转换为0-100的评分
        ],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      }
    ]
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">客户经理智能匹配可视化</CardTitle>
          <CardDescription>
            系统基于客户需求、爱好与经理专长的匹配度评分，帮助实现最优分配
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">客户资料</h3>
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <div className="bg-primary text-primary-foreground rounded-full h-full w-full flex items-center justify-center text-lg font-semibold">
                        {customer.name.charAt(0)}
                      </div>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">{customer.occupation} | {customer.age}岁</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium mb-1">金融需求</div>
                      <div className="flex flex-wrap gap-1">
                        {customer.needs.map(need => (
                          <Badge key={need} variant="outline">{getNeedDisplayName(need)}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium mb-1">兴趣爱好</div>
                      <div className="flex flex-wrap gap-1">
                        {customer.hobbies.map((hobby, index) => (
                          <Badge key={index} variant="secondary">{hobby}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">匹配评分排名</h3>
                <div className="border rounded-lg p-4 space-y-4">
                  {managers.map((manager, index) => (
                    <div 
                      key={manager.id} 
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${selectedManager.id === manager.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      onClick={() => setSelectedManager(manager)}
                    >
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-lg">{index + 1}</div>
                        <div>
                          <div>{manager.name}</div>
                          <div className="text-sm text-gray-500">匹配分: {manager.matchScore}</div>
                        </div>
                      </div>
                      <Button variant={selectedManager.id === manager.id ? "default" : "outline"} size="sm">
                        查看
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="col-span-2">
              <Tabs defaultValue="comparison">
                <TabsList className="mb-4">
                  <TabsTrigger value="comparison">经理对比</TabsTrigger>
                  <TabsTrigger value="detail">匹配详情</TabsTrigger>
                </TabsList>
                
                <TabsContent value="comparison">
                  <Card>
                    <CardHeader>
                      <CardTitle>经理匹配度对比</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <RadarChart 
                          data={detailedMatchData}
                          options={{
                            scales: {
                              r: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                  stepSize: 20
                                }
                              }
                            }
                          }}
                        />
                      </div>
                      
                      <div className="mt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>经理</TableHead>
                              <TableHead>需求匹配</TableHead>
                              <TableHead>爱好匹配</TableHead>
                              <TableHead>负载情况</TableHead>
                              <TableHead>总分</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {managers.map(manager => (
                              <TableRow key={manager.id}>
                                <TableCell>{manager.name}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={manager.needsMatchPercentage} className="h-2 w-20" />
                                    <span>{manager.needsMatchPercentage}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={manager.hobbiesMatchPercentage} className="h-2 w-20" />
                                    <span>{manager.hobbiesMatchPercentage}%</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Progress value={manager.loadScore} className="h-2 w-20" />
                                    <span>{manager.loadScore}%</span>
                                  </div>
                                </TableCell>
                                <TableCell className="font-bold">{manager.matchScore}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="detail">
                  <Card>
                    <CardHeader>
                      <CardTitle>{selectedManager.name} - 匹配详情</CardTitle>
                      <CardDescription>{selectedManager.specialization}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="font-medium mb-2">匹配维度评分</h3>
                          <div className="h-[300px]">
                            <RadarChart 
                              data={bestMatchRadarData}
                              options={{
                                scales: {
                                  r: {
                                    beginAtZero: true,
                                    max: 100,
                                    ticks: {
                                      stepSize: 20
                                    }
                                  }
                                }
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-medium mb-2">需求匹配点</h3>
                            <div className="border rounded-lg p-3">
                              <div className="grid grid-cols-2 gap-2">
                                {customer.needs.map(need => {
                                  const isMatched = selectedManager.needsMatch.includes(need);
                                  return (
                                    <Badge 
                                      key={need}
                                      variant={isMatched ? "default" : "outline"}
                                      className={isMatched ? "" : "text-gray-500"}
                                    >
                                      {getNeedDisplayName(need)}
                                      {isMatched && " ✓"}
                                    </Badge>
                                  );
                                })}
                              </div>
                              <div className="mt-2 text-sm">
                                匹配率: {selectedManager.needsMatchCount}/{customer.needs.length} ({selectedManager.needsMatchPercentage}%)
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">爱好匹配点</h3>
                            <div className="border rounded-lg p-3">
                              <div className="grid grid-cols-2 gap-2">
                                {customer.hobbies.map((hobby, index) => {
                                  const isMatched = selectedManager.hobbiesMatch.includes(hobby as any);
                                  return (
                                    <Badge 
                                      key={index}
                                      variant={isMatched ? "secondary" : "outline"}
                                      className={isMatched ? "" : "text-gray-500"}
                                    >
                                      {hobby}
                                      {isMatched && " ✓"}
                                    </Badge>
                                  );
                                })}
                              </div>
                              <div className="mt-2 text-sm">
                                匹配率: {selectedManager.hobbiesMatchCount}/{customer.hobbies.length} ({selectedManager.hobbiesMatchPercentage}%)
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="font-medium mb-2">经理详细信息</h3>
                            <div className="border rounded-lg p-3 space-y-2">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>经验年限: <span className="font-medium">{selectedManager.experienceYears}年</span></div>
                                <div>绩效得分: <span className="font-medium">{selectedManager.performanceScore}</span></div>
                                <div>当前客户数: <span className="font-medium">{selectedManager.customerCount}</span></div>
                                <div>负载状况: <span className="font-medium">{
                                  selectedManager.customerCount < 25 ? "轻松" :
                                  selectedManager.customerCount < 35 ? "适中" : "繁忙"
                                }</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex justify-end">
                        <Button>确认分配给该经理</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
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

export default MatchingVisualization;
