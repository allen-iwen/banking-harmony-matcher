
import { CustomerProfile, ManagerProfile, CustomerClass, CustomerNeed, Hobby } from '@/types/types';

// This is a mock implementation - in a real app these would call an API
const userService = {
  // Customer related services
  getCustomerProfile: async (customerId: string): Promise<CustomerProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock customer profile
    return {
      id: customerId,
      age: 35,
      occupation: '软件工程师',
      totalAssets: 500000,
      needs: ['savings', 'investment', 'retirement'] as CustomerNeed[],
      hobbies: ['fitness', 'reading', 'travel'] as Hobby[],
      customerClass: 'B' as CustomerClass,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  updateCustomerProfile: async (profile: CustomerProfile): Promise<CustomerProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app, we would send this data to the backend
    return {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
  },
  
  // Manager related services
  getManagerProfile: async (managerId: string): Promise<ManagerProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock manager profile
    return {
      id: managerId,
      capabilities: ['savings', 'investment', 'retirement', 'wealthManagement'] as CustomerNeed[],
      hobbies: ['fitness', 'reading', 'charity'] as Hobby[],
      customerCount: 38,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },
  
  updateManagerProfile: async (profile: ManagerProfile): Promise<ManagerProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app, we would send this data to the backend
    return {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
  },
  
  // Customer classification and assignment
  classifyCustomer: async (customerId: string): Promise<CustomerClass> => {
    // Simulate API delay - this would actually run a K-means algorithm on the backend
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock classification - randomly assign a class
    const classes: CustomerClass[] = ['A', 'B', 'C', 'D', 'E'];
    const randomIndex = Math.floor(Math.random() * 5);
    return classes[randomIndex];
  },
  
  assignManager: async (customerId: string, managerId: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app, we would send this data to the backend
    console.log(`Customer ${customerId} assigned to manager ${managerId}`);
  },
  
  autoAssignAllCustomers: async (): Promise<number> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In a real app, this would trigger the backend algorithm to run
    // and return the number of assignments made
    return 15; // Mock: 15 customers were assigned
  }
};

export default userService;
