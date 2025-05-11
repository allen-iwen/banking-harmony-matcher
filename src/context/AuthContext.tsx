
import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthState, User, CustomerProfile, ManagerProfile } from '../types/types';

// Define Auth Context Actions
type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; customerProfile?: CustomerProfile; managerProfile?: ManagerProfile } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_CUSTOMER_PROFILE'; payload: CustomerProfile }
  | { type: 'UPDATE_MANAGER_PROFILE'; payload: ManagerProfile };

// Initial state
const initialState: AuthState = {
  user: null,
  customerProfile: undefined,
  managerProfile: undefined,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Create Context
const AuthContext = createContext<{
  state: AuthState;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: string, name: string) => Promise<void>;
  logout: () => void;
  updateCustomerProfile: (profile: CustomerProfile) => void;
  updateManagerProfile: (profile: ManagerProfile) => void;
}>({
  state: initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateCustomerProfile: () => {},
  updateManagerProfile: () => {},
});

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        customerProfile: action.payload.customerProfile,
        managerProfile: action.payload.managerProfile,
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...initialState,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'UPDATE_CUSTOMER_PROFILE':
      return {
        ...state,
        customerProfile: action.payload,
      };
    case 'UPDATE_MANAGER_PROFILE':
      return {
        ...state,
        managerProfile: action.payload,
      };
    default:
      return state;
  }
};

// Auth Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Mock login - In a real app, this would call an API
  const login = async (username: string, password: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Mock API call
      // In a real app, this would be an actual API call
      const mockUsers = {
        'customer1': { id: '1', username: 'customer1', role: 'customer', name: '张三' },
        'manager1': { id: '2', username: 'manager1', role: 'manager', name: '李四' },
        'admin1': { id: '3', username: 'admin1', role: 'admin', name: '管理员' },
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (password !== 'password123') {
        throw new Error('密码错误');
      }

      const mockUser = mockUsers[username as keyof typeof mockUsers];
      
      if (!mockUser) {
        throw new Error('用户不存在');
      }

      let customerProfile;
      let managerProfile;

      if (mockUser.role === 'customer') {
        // Mock customer profile
        customerProfile = {
          id: mockUser.id,
          age: 35,
          occupation: '工程师',
          totalAssets: 500000,
          needs: ['savings', 'investment', 'retirement'],
          hobbies: ['fitness', 'reading', 'travel'],
          customerClass: 'B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (mockUser.role === 'manager') {
        // Mock manager profile
        managerProfile = {
          id: mockUser.id,
          capabilities: ['savings', 'investment', 'retirement', 'wealthManagement'],
          hobbies: ['fitness', 'reading', 'charity'],
          customerCount: 38,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: mockUser as User,
          customerProfile,
          managerProfile,
        },
      });

      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : '登录失败',
      });
    }
  };

  // Mock register
  const register = async (username: string, password: string, role: string, name: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      // Mock API call - in a real app, this would create a new user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Math.random().toString(36).substring(2, 9),
        username,
        role: role as "customer" | "manager" | "admin",
        name,
      };

      let customerProfile;
      let managerProfile;

      if (role === 'customer') {
        customerProfile = {
          id: newUser.id,
          age: 30, // Default values
          occupation: '',
          totalAssets: 0,
          needs: [],
          hobbies: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } else if (role === 'manager') {
        managerProfile = {
          id: newUser.id,
          capabilities: [],
          hobbies: [],
          customerCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: newUser,
          customerProfile,
          managerProfile,
        },
      });

      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error instanceof Error ? error.message : '注册失败',
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateCustomerProfile = (profile: CustomerProfile) => {
    dispatch({ type: 'UPDATE_CUSTOMER_PROFILE', payload: profile });
  };

  const updateManagerProfile = (profile: ManagerProfile) => {
    dispatch({ type: 'UPDATE_MANAGER_PROFILE', payload: profile });
  };

  // Check for stored user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { user },
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        register,
        logout,
        updateCustomerProfile,
        updateManagerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);
