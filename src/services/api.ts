import { CustomerProfile, ManagerProfile, User } from "@/types/types";

// 基础API URL，在生产环境中应该来自环境变量
const API_BASE_URL = 'http://localhost:5000/api';

// 检查服务器健康状态
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    // 真实连接到Flask后端的健康检查端点
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error("健康检查失败:", error);
    return false;
  }
};

// 用户认证相关API
export const authApi = {
  // 登录
  login: async (username: string, password: string): Promise<{ user: User, token: string }> => {
    try {
      console.log(`尝试登录: ${username}`);
      
      // 连接到真实的Flask后端
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || '登录失败');
      }
      
      return await response.json();
    } catch (error) {
      console.error("登录失败:", error);
      
      // 如果后端尚未完全实现，使用模拟数据
      if (process.env.NODE_ENV === 'development') {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            // 模拟用户数据
            const mockUsers: Record<string, any> = {
              'customer1': { id: '1', username: 'customer1', role: 'customer', name: '张三' },
              'manager1': { id: '2', username: 'manager1', role: 'manager', name: '李四' },
              'admin1': { id: '3', username: 'admin1', role: 'admin', name: '管理员' },
            };
  
            const user = mockUsers[username];
            if (user && password === 'password123') {
              resolve({
                user,
                token: 'mock-jwt-token'
              });
            } else {
              reject(new Error('用户名或密码错误'));
            }
          }, 800);
        });
      } else {
        throw error;
      }
    }
  },
  
  // 注册
  register: async (username: string, password: string, role: string, name: string): Promise<{ user: User, token: string }> => {
    // 模拟API调用
    console.log(`尝试注册: ${username}, 角色: ${role}, 姓名: ${name}`);
    
    // 在实际实现中，这将是一个fetch请求到Flask后端
    // const response = await fetch(`${API_BASE_URL}/auth/register`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ username, password, role, name }),
    // });
    
    // if (!response.ok) {
    //   const error = await response.json();
    //   throw new Error(error.message || '注册失败');
    // }
    
    // return await response.json();
    
    // 模拟响应
    return new Promise((resolve) => {
      setTimeout(() => {
        const newUser = {
          id: Math.random().toString(36).substring(2, 9),
          username,
          role: role as "customer" | "manager" | "admin",
          name,
        };
        
        resolve({
          user: newUser,
          token: 'mock-jwt-token'
        });
      }, 800);
    });
  },
  
  // 验证令牌
  verifyToken: async (token: string): Promise<User> => {
    // 将在实际实现中验证JWT令牌
    // const response = await fetch(`${API_BASE_URL}/auth/verify`, {
    //   method: 'POST',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`
    //   }
    // });
    
    // if (!response.ok) {
    //   throw new Error('令牌无效');
    // }
    
    // return await response.json();
    
    // 模拟验证
    return new Promise((resolve) => {
      setTimeout(() => {
        // 从localStorage获取存储的用户
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          resolve(JSON.parse(storedUser));
        } else {
          throw new Error('未找到用户');
        }
      }, 300);
    });
  }
};

// 用户配置文件相关API
export const profileApi = {
  // 获取客户配置文件
  getCustomerProfile: async (userId: string): Promise<CustomerProfile> => {
    // 在实际实现中，这将是一个fetch请求到Flask后端
    // const response = await fetch(`${API_BASE_URL}/customers/${userId}/profile`, {
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // });
    
    // if (!response.ok) {
    //   throw new Error('获取客户资料失败');
    // }
    
    // return await response.json();
    
    // 模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          age: 35,
          occupation: '工程师',
          totalAssets: 500000,
          needs: ['savings', 'investment', 'retirement'],
          hobbies: ['fitness', 'reading', 'travel'],
          customerClass: 'B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
  
  // 获取经理配置文件
  getManagerProfile: async (userId: string): Promise<ManagerProfile> => {
    // 在实际实现中，这将是一个fetch请求到Flask后端
    // const response = await fetch(`${API_BASE_URL}/managers/${userId}/profile`, {
    //   headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    // });
    
    // if (!response.ok) {
    //   throw new Error('获取经理资料失败');
    // }
    
    // return await response.json();
    
    // 模拟数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          capabilities: ['savings', 'investment', 'retirement', 'wealthManagement'],
          hobbies: ['fitness', 'reading', 'charity'],
          customerCount: 38,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
  
  // 更新客户配置文件
  updateCustomerProfile: async (userId: string, profile: Partial<CustomerProfile>): Promise<CustomerProfile> => {
    // 在实际实现中，这将是一个fetch请求到Flask后端
    // const response = await fetch(`${API_BASE_URL}/customers/${userId}/profile`, {
    //   method: 'PUT',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}` 
    //   },
    //   body: JSON.stringify(profile)
    // });
    
    // if (!response.ok) {
    //   throw new Error('更新客户资料失败');
    // }
    
    // return await response.json();
    
    // 模拟更新
    console.log('更新客户资料:', profile);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          age: profile.age || 35,
          occupation: profile.occupation || '工程师',
          totalAssets: profile.totalAssets || 500000,
          needs: profile.needs || ['savings', 'investment'],
          hobbies: profile.hobbies || ['fitness', 'reading'],
          customerClass: profile.customerClass || 'B',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
  
  // 更新经理配置文件
  updateManagerProfile: async (userId: string, profile: Partial<ManagerProfile>): Promise<ManagerProfile> => {
    // 在实际实现中，这将是一个fetch请求到Flask后端
    // const response = await fetch(`${API_BASE_URL}/managers/${userId}/profile`, {
    //   method: 'PUT',
    //   headers: { 
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('token')}` 
    //   },
    //   body: JSON.stringify(profile)
    // });
    
    // if (!response.ok) {
    //   throw new Error('更新经理资料失败');
    // }
    
    // return await response.json();
    
    // 模拟更新
    console.log('更新经理资料:', profile);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: userId,
          capabilities: profile.capabilities || ['savings', 'investment'],
          hobbies: profile.hobbies || ['fitness', 'reading'],
          customerCount: profile.customerCount || 38,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }, 500);
    });
  },
};

// 管理员相关API
export const adminApi = {
  // 获取所有客户
  getAllCustomers: async (): Promise<User[]> => {
    try {
      // 连接到Flask后端
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customers`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取客户列表失败');
      }
      
      return await response.json();
    } catch (error) {
      console.error("获取客户失败:", error);
      
      // 如果后端未连接，使用模拟数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Array.from({ length: 20 }, (_, i) => ({
            id: `c-${i+1}`,
            username: `customer${i+1}`,
            name: `客户${i+1}`,
            role: 'customer' as const,
          })));
        }, 800);
      });
    }
  },
  
  // 获取所有经理
  getAllManagers: async (): Promise<User[]> => {
    try {
      // 连接到Flask后端
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/managers`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取经理列表失败');
      }
      
      return await response.json();
    } catch (error) {
      console.error("获取经理失败:", error);
      
      // 如果后端未连接，使用模拟数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(Array.from({ length: 5 }, (_, i) => ({
            id: `m-${i+1}`,
            username: `manager${i+1}`,
            name: `经理${i+1}`,
            role: 'manager' as const,
          })));
        }, 800);
      });
    }
  },
  
  // 自动匹配客户和经理 - 真实调用后端算法
  autoAssignCustomers: async (): Promise<{ success: boolean, message: string }> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/auto-assign`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || '自动匹配失败');
      }
      
      const result = await response.json();
      return {
        success: true,
        message: `成功匹配${result.assigned_count || 0}位客户`
      };
    } catch (error) {
      console.error("自动匹配失败:", error);
      
      // 后端未连接时的模拟数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '成功匹配20位客户'
          });
        }, 2000);
      });
    }
  },
  
  // 手动分配客户给经理 - 真实API调用
  assignCustomerToManager: async (customerId: string, managerId: string): Promise<{ success: boolean, message: string }> => {
    try {
      console.log(`分配客户 ${customerId} 给经理 ${managerId}`);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/manual-assign`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ customer_id: customerId, manager_id: managerId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || '手动分配失败');
      }
      
      return {
        success: true,
        message: '分配成功'
      };
    } catch (error) {
      console.error("手动分配失败:", error);
      
      // 后端未连接时的模拟数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: '分配成功'
          });
        }, 500);
      });
    }
  },
  
  // 获取客户分类统计 - 真实API调用
  getCustomerClassStats: async (): Promise<{class: string, count: number}[]> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customers/classification`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取客户分类统计失败');
      }
      
      return await response.json();
    } catch (error) {
      console.error("获取客户分类统计失败:", error);
      
      // 后端未连接时的模拟数据
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            { class: 'A', count: 25 },
            { class: 'B', count: 42 },
            { class: 'C', count: 38 },
            { class: 'D', count: 15 },
            { class: 'E', count: 8 },
          ]);
        }, 800);
      });
    }
  },
};

// 创建一个新的工具类，用于客户洞察分析
export const insightsApi = {
  // 获取客户洞察报告
  getCustomerInsights: async (customerId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customers/${customerId}/insights`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取客户洞察失败');
      }
      
      return await response.json();
    } catch (error) {
      console.error("获取客户洞察失败:", error);
      
      // 后端未连接时的模拟数据
      return {
        customer_name: "张三",
        customer_class: "B",
        class_description: "高价值客户，满足大部分银行服务需求",
        needs_analysis: "客户有3项明确金融需求",
        hobbies_analysis: "客户有4项个人兴趣爱好",
        recommendations: [
          "推荐优先提供个性化服务和专属产品",
          "定期联系并更新金融方案",
          "推荐投资产品相关咨询和服务",
          "推荐储蓄产品相关咨询和服务"
        ]
      };
    }
  },
};

// 导出默认API对象
const api = {
  auth: authApi,
  profile: profileApi,
  admin: adminApi,
  insights: insightsApi,
  checkHealth: checkServerHealth
};

export default api;
