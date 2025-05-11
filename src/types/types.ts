
// User Types
export type UserRole = "customer" | "manager" | "admin";

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
}

// Customer Types
export type CustomerNeed = 
  | "savings" 
  | "wealthManagement" 
  | "investment" 
  | "retirement" 
  | "loan" 
  | "insurance" 
  | "stock" 
  | "businessAssociation";

export type Hobby = 
  | "billiards" 
  | "fitness" 
  | "travel" 
  | "gaming" 
  | "charity" 
  | "food" 
  | "art" 
  | "reading";

export type CustomerClass = "A" | "B" | "C" | "D" | "E";

export interface CustomerProfile {
  id: string;
  age: number;
  occupation: string;
  totalAssets: number;
  needs: CustomerNeed[];
  hobbies: Hobby[];
  customerClass?: CustomerClass;
  assignedManagerId?: string;
  createdAt: string;
  updatedAt: string;
}

// Manager Types
export interface ManagerProfile {
  id: string;
  capabilities: CustomerNeed[];
  hobbies: Hobby[];
  customerCount: number;
  createdAt: string;
  updatedAt: string;
}

// Assignment Types
export interface CustomerManagerAssignment {
  id: string;
  customerId: string;
  managerId: string;
  similarityScore: number;
  customerClass: CustomerClass;
  assignmentDate: string;
  isAutoAssigned: boolean;
}

// Auth Types
export interface AuthState {
  user: User | null;
  customerProfile?: CustomerProfile;
  managerProfile?: ManagerProfile;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Analytics Types
export interface CustomerDistribution {
  classA: number;
  classB: number;
  classC: number;
  classD: number;
  classE: number;
}

export interface ManagerAssignment {
  managerId: string;
  managerName: string;
  customerCount: number;
  classDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
    E: number;
  };
}

export interface SimilarityMatrix {
  managerId: string;
  managerName: string;
  similarityScores: {
    customerId: string;
    customerName: string;
    score: number;
  }[];
}
