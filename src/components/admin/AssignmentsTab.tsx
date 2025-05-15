
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CustomerClass } from '@/types/types';

interface Manager {
  id: string;
  name: string;
  customerCount: number;
}

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

interface AssignmentsTabProps {
  customers: CustomerData[];
  managers: Manager[];
  onAutoAssign: () => void;
  onManagerAssignment: (customerId: string, managerId: string | null) => void;
}

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({
  customers,
  managers,
  onAutoAssign,
  onManagerAssignment
}) => {
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
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-medium">客户分配管理</h3>
          <p className="text-sm text-muted-foreground">
            手动或自动分配客户经理
          </p>
        </div>
        <Button onClick={onAutoAssign}>
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
                    onValueChange={(value) => onManagerAssignment(customer.id, value === "unassigned" ? null : value)}
                  >
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="选择客户经理" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">未分配</SelectItem>
                      {managers.map((manager) => (
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
    </>
  );
};

export default AssignmentsTab;
