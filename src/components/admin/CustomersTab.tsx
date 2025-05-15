
import React from 'react';
import { CustomerClass } from '@/types/types';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

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

interface CustomersTabProps {
  customers: CustomerData[];
  onClassChange: (customerId: string, newClass: CustomerClass) => void;
}

const CustomersTab: React.FC<CustomersTabProps> = ({ customers, onClassChange }) => {
  return (
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
                  onValueChange={(value) => onClassChange(customer.id, value as CustomerClass)}
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
  );
};

export default CustomersTab;
