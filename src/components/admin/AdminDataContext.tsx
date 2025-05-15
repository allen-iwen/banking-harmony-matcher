
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { CustomerClass } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

// Mock data types
interface CustomerData {
  id: string;
  name: string;
  age: number;
  occupation: string;
  totalAssets: number;
  customerClass: CustomerClass;
  assignedManagerId: string | null;
  assignedManagerName: string | null;
  similarity: number;
}

interface ManagerData {
  id: string;
  name: string;
  customerCount: number;
}

// Context type
interface AdminDataContextType {
  customers: CustomerData[];
  managers: ManagerData[];
  handleClassChange: (customerId: string, newClass: CustomerClass) => void;
  handleManagerAssignment: (customerId: string, managerId: string | null) => void;
  handleAutoAssign: () => void;
}

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

// Create context
const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export const AdminDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState(mockCustomers);
  
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
  
  const value = {
    customers,
    managers: mockManagers,
    handleClassChange,
    handleManagerAssignment,
    handleAutoAssign,
  };
  
  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
