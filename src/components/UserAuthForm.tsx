
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface UserAuthFormProps {
  mode: 'login' | 'register';
}

const UserAuthForm: React.FC<UserAuthFormProps> = ({ mode }) => {
  const navigate = useNavigate();
  const { login, register, state } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'login') {
      await login(username, password);
    } else {
      await register(username, password, role, name);
    }
    
    if (!state.error && mode === 'register') {
      navigate('/dashboard');
    } else if (!state.error) {
      navigate('/dashboard');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === 'login' ? '用户登录' : '用户注册'}
        </CardTitle>
        <CardDescription>
          {mode === 'login' 
            ? '请输入您的账号和密码登录系统' 
            : '请完成注册以使用系统服务'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
          
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">姓名</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的姓名"
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="username">用户名</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="请输入用户名"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="请输入密码"
              required
            />
          </div>
          
          {mode === 'register' && (
            <div className="space-y-2">
              <Label>用户类型</Label>
              <RadioGroup value={role} onValueChange={setRole} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="customer" id="customer" />
                  <Label htmlFor="customer">客户</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="manager" id="manager" />
                  <Label htmlFor="manager">客户经理</Label>
                </div>
                {/* Admin registration might be restricted in a real app */}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin">管理员</Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={state.loading}>
            {state.loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === 'login' ? '登录' : '注册'}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        {mode === 'login' ? (
          <p className="text-sm text-center text-gray-500">
            还没有账号？{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/register')}>
              立即注册
            </Button>
          </p>
        ) : (
          <p className="text-sm text-center text-gray-500">
            已有账号？{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/login')}>
              立即登录
            </Button>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserAuthForm;
