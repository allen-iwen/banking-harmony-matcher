
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminDataProvider } from './admin/AdminDataContext';
import OverviewTab from './admin/OverviewTab';
import CustomersTab from './admin/CustomersTab';
import AssignmentsTab from './admin/AssignmentsTab';
import { useAdminData } from './admin/AdminDataContext';

// Wrapper component that uses the context
const AdminTabs = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { 
    customers, 
    managers, 
    handleClassChange, 
    handleManagerAssignment, 
    handleAutoAssign 
  } = useAdminData();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="overview">数据概览</TabsTrigger>
        <TabsTrigger value="customers">客户管理</TabsTrigger>
        <TabsTrigger value="assignments">分配管理</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <OverviewTab />
      </TabsContent>
      
      <TabsContent value="customers">
        <CustomersTab 
          customers={customers} 
          onClassChange={handleClassChange} 
        />
      </TabsContent>
      
      <TabsContent value="assignments">
        <AssignmentsTab 
          customers={customers}
          managers={managers}
          onAutoAssign={handleAutoAssign}
          onManagerAssignment={handleManagerAssignment}
        />
      </TabsContent>
    </Tabs>
  );
};

// Main AdminDashboard component
const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>管理员控制面板</CardTitle>
          <CardDescription>客户分类、分配和系统管理</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDataProvider>
            <AdminTabs />
          </AdminDataProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
