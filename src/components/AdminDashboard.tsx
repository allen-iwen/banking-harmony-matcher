
import { useState } from 'react';
import { CustomerClass } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import DataVisualization from './DataVisualization';

// Mock customer data
const mockCustomers = [
  {
    id: '1',
    name: '张三',
    age: 35,
    occupation: '工程师',
    totalAssets: 850000,
    customerClass: 'B' as CustomerClass,
    assignedManagerId: '1',
    assignedManagerName: '李经理',
    similarity: 10, // out of 16
  },
  {
    id: '2',
    name: '李四',
    age: 42,
    occupation: '医生',
    totalAssets: 1500000,
    customerClass: 'A' as CustomerClass,
    assignedManagerId: '1',
    assignedManagerName: '李经理',
    similarity: 14, // out of 16
  },
  {
    id: '3',
    name: '王五',
    age: 29,
    occupation: '教师',
    totalAssets: 400000,
    customerClass: 'C' as CustomerClass,
    assignedManagerId: '2',
    assignedManagerName: '王经理',
    similarity: 8, // out of 16
  },
  {
    id: '4',
    name: '赵六',
    age: 55,
    occupation: '企业家',
    totalAssets: 5000000,
    customerClass: 'A' as CustomerClass,
    assignedManagerId: '3',
    assignedManagerName: '张经理',
    similarity: 13, // out of 16
  },
  {
    id: '5',
    name: '钱七',
    age: 38,
    occupation: '销售',
    totalAssets: 350000,
    customerClass: 'D' as CustomerClass,
    assignedManagerId: null,
    assignedManagerName: null,
    similarity: 5, // out of 16
  },
];

// Mock manager data
const mockManagers = [
  { id: '1', name: '李经理', customerCount: 42 },
  { id: '2', name: '王经理', customerCount: 38 },
  { id: '3', name: '张经理', customerCount: 35 },
];

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState(mockCustomers);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle class change
  const handleClassChange = (customerId: string, newClass: CustomerClass) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId ? { ...customer, customerClass: newClass } : customer
      )
    );
    
    toast({
      title: "客户等级已更新",
      description: `客户ID ${customerId} 已更新为 ${newClass} 类`,
    });
  };
  
  // Handle manager assignment
  const handleManagerAssignment = (customerId: string, managerId: string | null) => {
    setCustomers(prev => 
      prev.map(customer => {
        if (customer.id === customerId) {
          const assignedManager = managerId 
            ? mockManagers.find(m => m.id === managerId) 
            : null;
            
          return { 
            ...customer, 
            assignedManagerId: managerId,
            assignedManagerName: assignedManager?.name || null
          };
        }
        return customer;
      })
    );
    
    const managerName = managerId 
      ? mockManagers.find(m => m.id === managerId)?.name || "未知经理" 
      : "无";
      
    toast({
      title: "客户经理分配已更新",
      description: `客户ID ${customerId} 已分配给 ${managerName}`,
    });
  };
  
  // Auto assign all unassigned customers
  const handleAutoAssign = () => {
    const unassignedCount = customers.filter(c => !c.assignedManagerId).length;
    
    if (unassignedCount === 0) {
      toast({
        title: "自动分配",
        description: "所有客户已经分配了客户经理",
      });
      return;
    }
    
    setCustomers(prev => 
      prev.map(customer => {
        if (customer.assignedManagerId) return customer;
        
        // Mock auto-assignment algorithm
        // In a real app, this would use the similarity algorithm
        // For now, we'll just assign based on customer class
        let managerId;
        const managerLoad = mockManagers.map(m => ({
          id: m.id,
          count: prev.filter(c => c.assignedManagerId === m.id).length
        }));
        
        // Sort managers by lowest load
        managerLoad.sort((a, b) => a.count - b.count);
        
        // Assign to manager with lowest load
        managerId = managerLoad[0].id;
        const manager = mockManagers.find(m => m.id === managerId);
        
        return {
          ...customer,
          assignedManagerId: managerId,
          assignedManagerName: manager?.name || "未知经理"
        };
      })
    );
    
    toast({
      title: "自动分配完成",
      description: `已为 ${unassignedCount} 位客户分配客户经理`,
    });
  };
  
  // Function to get badge color based on customer class
  const getClassBadgeColor = (customerClass: CustomerClass | null) => {
    switch (customerClass) {
      case 'A': return 'bg-green-500 hover:bg-green-600';
      case 'B': return 'bg-blue-500 hover:bg-blue-600';
      case 'C': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'D': return 'bg-orange-500 hover:bg-orange-600';
      case 'E': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>管理员控制面板</CardTitle>
          <CardDescription>客户分类、分配和系统管理</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">数据概览</TabsTrigger>
              <TabsTrigger value="customers">客户管理</TabsTrigger>
              <TabsTrigger value="assignments">分配管理</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <DataVisualization />
            </TabsContent>
            
            <TabsContent value="customers">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>姓名</TableHead>
                      <TableHead>年龄</TableHead>
                      <TableHead>职业</TableHead>
                      <TableHead>总资产</TableHead>
                      <TableHead>客户等级</TableHead>
                      <TableHead className="text-right">操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>{customer.age}</TableCell>
                        <TableCell>{customer.occupation}</TableCell>
                        <TableCell>{customer.totalAssets.toLocaleString('zh-CN')}元</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={customer.customerClass}
                            onValueChange={(value) => handleClassChange(customer.id, value as CustomerClass)}
                          >
                            <SelectTrigger className="w-20">
                              <SelectValue placeholder="等级" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A">A类</SelectItem>
                              <SelectItem value="B">B类</SelectItem>
                              <SelectItem value="C">C类</SelectItem>
                              <SelectItem value="D">D类</SelectItem>
                              <SelectItem value="E">E类</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">查看详情</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="assignments">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium">客户分配管理</h3>
                  <p className="text-sm text-muted-foreground">
                    手动或自动分配客户经理
                  </p>
                </div>
                <Button onClick={handleAutoAssign}>
                  自动分配未处理客户
                </Button>
              </div>
              
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>客户姓名</TableHead>
                      <TableHead>客户等级</TableHead>
                      <TableHead>相似度</TableHead>
                      <TableHead>当前客户经理</TableHead>
                      <TableHead className="text-right">分配客户经理</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell>
                          <Badge className={getClassBadgeColor(customer.customerClass)}>
                            {customer.customerClass}类
                          </Badge>
                        </TableCell>
                        <TableCell>{customer.similarity}/16</TableCell>
                        <TableCell>
                          {customer.assignedManagerName || '未分配'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={customer.assignedManagerId || "unassigned"}
                            onValueChange={(value) => handleManagerAssignment(customer.id, value === "unassigned" ? null : value)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue placeholder="选择客户经理" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">未分配</SelectItem>
                              {mockManagers.map((manager) => (
                                <SelectItem key={manager.id} value={manager.id}>
                                  {manager.name} ({manager.customerCount})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
