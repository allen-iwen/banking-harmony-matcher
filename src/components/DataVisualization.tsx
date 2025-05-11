
import { useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerDistribution, ManagerAssignment } from '@/types/types';

// Mock data for demonstration
const CUSTOMER_CLASSES = ['A', 'B', 'C', 'D', 'E'];
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Mock customer distribution data
const mockCustomerDistribution: CustomerDistribution = {
  classA: 25,
  classB: 35,
  classC: 20,
  classD: 15,
  classE: 5,
};

// Mock manager assignments
const mockManagerAssignments: ManagerAssignment[] = [
  {
    managerId: '1',
    managerName: '李经理',
    customerCount: 42,
    classDistribution: { A: 10, B: 15, C: 10, D: 5, E: 2 },
  },
  {
    managerId: '2',
    managerName: '王经理',
    customerCount: 38,
    classDistribution: { A: 8, B: 12, C: 10, D: 6, E: 2 },
  },
  {
    managerId: '3',
    managerName: '张经理',
    customerCount: 35,
    classDistribution: { A: 7, B: 8, C: 10, D: 8, E: 2 },
  },
];

interface DataVisualizationProps {
  customerDistribution?: CustomerDistribution;
  managerAssignments?: ManagerAssignment[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  customerDistribution = mockCustomerDistribution,
  managerAssignments = mockManagerAssignments,
}) => {
  const [activeTab, setActiveTab] = useState('distribution');
  
  // Format data for pie chart
  const pieChartData = [
    { name: 'A类客户', value: customerDistribution.classA },
    { name: 'B类客户', value: customerDistribution.classB },
    { name: 'C类客户', value: customerDistribution.classC },
    { name: 'D类客户', value: customerDistribution.classD },
    { name: 'E类客户', value: customerDistribution.classE },
  ];
  
  // Format data for bar chart - total customers per manager
  const barChartData = managerAssignments.map(manager => ({
    name: manager.managerName,
    客户数量: manager.customerCount,
  }));
  
  // Format data for stacked bar chart - class distribution per manager
  const stackedBarChartData = managerAssignments.map(manager => ({
    name: manager.managerName,
    A类: manager.classDistribution.A,
    B类: manager.classDistribution.B,
    C类: manager.classDistribution.C,
    D类: manager.classDistribution.D,
    E类: manager.classDistribution.E,
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>数据可视化分析</CardTitle>
        <CardDescription>客户分类和经理分配情况统计</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="distribution">客户分类分布</TabsTrigger>
            <TabsTrigger value="assignment">经理分配概况</TabsTrigger>
            <TabsTrigger value="detailed">分配详细分布</TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}人`, '客户数量']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-gray-500">
              各类客户占比分布情况
            </div>
          </TabsContent>
          
          <TabsContent value="assignment" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="客户数量" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-gray-500">
              各客户经理负责客户数量
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-4">
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stackedBarChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="A类" stackId="a" fill="#0088FE" />
                  <Bar dataKey="B类" stackId="a" fill="#00C49F" />
                  <Bar dataKey="C类" stackId="a" fill="#FFBB28" />
                  <Bar dataKey="D类" stackId="a" fill="#FF8042" />
                  <Bar dataKey="E类" stackId="a" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-gray-500">
              各客户经理负责的客户类别分布
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
