
import { User, UserRole } from '@/types/types';

interface LoginResponse {
  user: User;
  token: string;
}

interface RegisterParams {
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

// This is a mock implementation - in a real app these would call an API
const authService = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock implementation - would actually call the backend API
    if (password !== 'password123') {
      throw new Error('用户名或密码错误');
    }
    
    const mockUsers: Record<string, User> = {
      'customer1': { id: '1', username: 'customer1', role: 'customer', name: '张三' },
      'manager1': { id: '2', username: 'manager1', role: 'manager', name: '李四' },
      'admin1': { id: '3', username: 'admin1', role: 'admin', name: '管理员' },
    };
    
    const user = mockUsers[username];
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // Mock JWT token
    const token = 'mock-jwt-token';
    
    return { user, token };
  },
  
  register: async (params: RegisterParams): Promise<LoginResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock implementation - would actually call the backend API
    const { username, password, role, name } = params;
    
    // Simple validation
    if (!username || !password || !role || !name) {
      throw new Error('所有字段都是必填的');
    }
    
    // In a real app, we would check if the username already exists
    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      username,
      role,
      name,
    };
    
    // Mock JWT token
    const token = 'mock-jwt-token';
    
    return { user: newUser, token };
  },
  
  logout: async (): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, we would invalidate the token on the server
    localStorage.removeItem('token');
  }
};

export default authService;
