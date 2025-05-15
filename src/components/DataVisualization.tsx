
import { useState } from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerDistribution, ManagerAssignment } from '@/types/types';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ChartPie, ChartBar, Eye } from 'lucide-react';

// Colors for data visualization
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
const CLASS_COLORS = {
  A: '#22c55e', // green-500
  B: '#3b82f6', // blue-500
  C: '#eab308', // yellow-500
  D: '#f97316', // orange-500
  E: '#ef4444', // red-500
};

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

// Chart config for Shadcn Chart component
const chartConfig = {
  classA: { 
    label: "A类客户",
    theme: { light: CLASS_COLORS.A, dark: CLASS_COLORS.A }
  },
  classB: { 
    label: "B类客户",
    theme: { light: CLASS_COLORS.B, dark: CLASS_COLORS.B }
  },
  classC: { 
    label: "C类客户",
    theme: { light: CLASS_COLORS.C, dark: CLASS_COLORS.C }
  },
  classD: { 
    label: "D类客户",
    theme: { light: CLASS_COLORS.D, dark: CLASS_COLORS.D }
  },
  classE: { 
    label: "E类客户",
    theme: { light: CLASS_COLORS.E, dark: CLASS_COLORS.E }
  },
};

interface DataVisualizationProps {
  customerDistribution?: CustomerDistribution;
  managerAssignments?: ManagerAssignment[];
}

const DataVisualization: React.FC<DataVisualizationProps> = ({
  customerDistribution = mockCustomerDistribution,
  managerAssignments = mockManagerAssignments,
}) => {
  const [activeTab, setActiveTab] = useState('distribution');
  const { toast } = useToast();
  
  // Format data for pie chart
  const pieChartData = [
    { name: 'A类客户', value: customerDistribution.classA, fill: CLASS_COLORS.A, class: 'A' },
    { name: 'B类客户', value: customerDistribution.classB, fill: CLASS_COLORS.B, class: 'B' },
    { name: 'C类客户', value: customerDistribution.classC, fill: CLASS_COLORS.C, class: 'C' },
    { name: 'D类客户', value: customerDistribution.classD, fill: CLASS_COLORS.D, class: 'D' },
    { name: 'E类客户', value: customerDistribution.classE, fill: CLASS_COLORS.E, class: 'E' },
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

  // Format data for radar chart - average distribution of customer classes
  const radarChartData = [
    { subject: 'A类客户', A: customerDistribution.classA / (managerAssignments.length || 1), fullMark: 50 },
    { subject: 'B类客户', A: customerDistribution.classB / (managerAssignments.length || 1), fullMark: 50 },
    { subject: 'C类客户', A: customerDistribution.classC / (managerAssignments.length || 1), fullMark: 50 },
    { subject: 'D类客户', A: customerDistribution.classD / (managerAssignments.length || 1), fullMark: 50 },
    { subject: 'E类客户', A: customerDistribution.classE / (managerAssignments.length || 1), fullMark: 50 },
  ];

  // Handler for clicking on pie chart segments
  const handlePieClick = (data: any) => {
    toast({
      title: `${data.name}详情`,
      description: `总数: ${data.value}人 (${(data.percent * 100).toFixed(1)}%)`,
    });
  };

  // Get the total number of customers
  const totalCustomers = Object.values(customerDistribution).reduce((sum, val) => sum + val, 0);

  return (
    <Card className="w-full shadow-lg border-gray-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-2">
          <ChartPie className="h-6 w-6 text-blue-500" />
          <div>
            <CardTitle className="text-blue-800">数据可视化分析</CardTitle>
            <CardDescription>客户分类和经理分配情况统计</CardDescription>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {pieChartData.map((entry) => (
            <Badge 
              key={entry.class}
              className="text-white" 
              style={{ backgroundColor: entry.fill }}
            >
              {entry.name}: {entry.value}人 ({((entry.value / totalCustomers) * 100).toFixed(1)}%)
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="distribution" className="flex items-center gap-1">
              <ChartPie className="h-4 w-4" />
              <span>客户分类分布</span>
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-1">
              <ChartBar className="h-4 w-4" />
              <span>经理分配概况</span>
            </TabsTrigger>
            <TabsTrigger value="detailed" className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span>分配详细分布</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="distribution" className="space-y-4">
            <div className="h-[400px] w-full">
              <ChartContainer config={chartConfig} className="w-full h-full">
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
                      onClick={handlePieClick}
                      className="cursor-pointer"
                      animationBegin={0}
                      animationDuration={1500}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} stroke="#fff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend 
                      layout="horizontal" 
                      verticalAlign="bottom" 
                      align="center" 
                      wrapperStyle={{ paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
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
                  barGap={2}
                  barCategoryGap={20}
                >
                  <defs>
                    <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [`${value}人`, '客户数量']}
                  />
                  <Legend />
                  <Bar 
                    dataKey="客户数量" 
                    fill="url(#colorCustomers)" 
                    radius={[4, 4, 0, 0]} 
                    animationBegin={0}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-center text-sm text-gray-500">
              各客户经理负责客户数量
            </div>
          </TabsContent>
          
          <TabsContent value="detailed" className="space-y-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  barCategoryGap={20}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                    formatter={(value) => [`${value}人`, '']}
                  />
                  <Legend />
                  <Bar dataKey="A类" stackId="a" fill={CLASS_COLORS.A} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="B类" stackId="a" fill={CLASS_COLORS.B} />
                  <Bar dataKey="C类" stackId="a" fill={CLASS_COLORS.C} />
                  <Bar dataKey="D类" stackId="a" fill={CLASS_COLORS.D} />
                  <Bar dataKey="E类" stackId="a" fill={CLASS_COLORS.E} />
                </BarChart>
              </ResponsiveContainer>
              <div className="text-center text-sm text-gray-500 mt-4">
                各客户经理负责的客户类别分布
              </div>
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarChartData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
                  <Radar 
                    name="平均分配" 
                    dataKey="A" 
                    stroke="#8884d8" 
                    fill="#8884d8" 
                    fillOpacity={0.6} 
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}
                    formatter={(value) => {
                      // Fix for the TypeScript error - check if value is a number before calling toFixed
                      const formattedValue = typeof value === 'number' ? value.toFixed(1) : value;
                      return [`${formattedValue}人`, '平均每位经理'];
                    }}
                  />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
              <div className="text-center text-sm text-gray-500 mt-4">
                各类客户平均分配情况
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DataVisualization;
