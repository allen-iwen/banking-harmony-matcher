
import { useState } from 'react';
import { CustomerProfile as CustomerProfileType, CustomerNeed, Hobby } from '../types/types';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const needsOptions: { value: CustomerNeed; label: string }[] = [
  { value: 'savings', label: '储蓄' },
  { value: 'wealthManagement', label: '理财' },
  { value: 'investment', label: '投资' },
  { value: 'retirement', label: '养老' },
  { value: 'loan', label: '借贷' },
  { value: 'insurance', label: '保险' },
  { value: 'stock', label: '股票' },
  { value: 'businessAssociation', label: '商会' },
];

const hobbiesOptions: { value: Hobby; label: string }[] = [
  { value: 'billiards', label: '台球' },
  { value: 'fitness', label: '健身' },
  { value: 'travel', label: '旅游' },
  { value: 'gaming', label: '游戏' },
  { value: 'charity', label: '公益活动' },
  { value: 'food', label: '美食' },
  { value: 'art', label: '艺术展览' },
  { value: 'reading', label: '阅读' },
];

interface CustomerProfileProps {
  initialProfile?: CustomerProfileType;
}

const CustomerProfile: React.FC<CustomerProfileProps> = ({ initialProfile }) => {
  const { updateCustomerProfile } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Partial<CustomerProfileType>>(
    initialProfile || {
      age: 30,
      occupation: '',
      totalAssets: 0,
      needs: [] as CustomerNeed[],
      hobbies: [] as Hobby[],
    }
  );

  const handleNeedsChange = (need: CustomerNeed, checked: boolean) => {
    setProfile(prev => {
      const currentNeeds = prev.needs || [];
      return {
        ...prev,
        needs: checked
          ? [...currentNeeds, need]
          : currentNeeds.filter(item => item !== need),
      };
    });
  };

  const handleHobbiesChange = (hobby: Hobby, checked: boolean) => {
    setProfile(prev => {
      const currentHobbies = prev.hobbies || [];
      return {
        ...prev,
        hobbies: checked
          ? [...currentHobbies, hobby]
          : currentHobbies.filter(item => item !== hobby),
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'totalAssets' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile.age || !profile.occupation) {
      toast({
        title: "提交失败",
        description: "请完善个人信息",
        variant: "destructive",
      });
      return;
    }
    
    if ((profile.needs?.length || 0) === 0) {
      toast({
        title: "提交失败",
        description: "请至少选择一项需求",
        variant: "destructive",
      });
      return;
    }

    if ((profile.hobbies?.length || 0) === 0) {
      toast({
        title: "提交失败",
        description: "请至少选择一项爱好",
        variant: "destructive",
      });
      return;
    }

    // Update the profile in context
    if (initialProfile?.id) {
      updateCustomerProfile({
        ...(profile as CustomerProfileType),
        id: initialProfile.id,
        updatedAt: new Date().toISOString(),
        createdAt: initialProfile.createdAt,
      });

      toast({
        title: "保存成功",
        description: "您的个人信息已更新",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>客户个人资料</CardTitle>
        <CardDescription>请完善您的个人信息，以便我们为您提供更好的服务</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="personal">基本信息</TabsTrigger>
            <TabsTrigger value="needs">金融需求</TabsTrigger>
            <TabsTrigger value="hobbies">个人爱好</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">年龄</Label>
                  <Input
                    id="age"
                    name="age"
                    type="number"
                    value={profile.age || ''}
                    onChange={handleInputChange}
                    placeholder="请输入年龄"
                    min={18}
                    max={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation">职业</Label>
                  <Input
                    id="occupation"
                    name="occupation"
                    type="text"
                    value={profile.occupation || ''}
                    onChange={handleInputChange}
                    placeholder="请输入职业"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="totalAssets">总资产（元）</Label>
                <Input
                  id="totalAssets"
                  name="totalAssets"
                  type="number"
                  value={profile.totalAssets || ''}
                  onChange={handleInputChange}
                  placeholder="请输入总资产"
                  min={0}
                />
              </div>
              
              {initialProfile?.customerClass && (
                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">您的客户等级</h3>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-blue-700 mr-3">{initialProfile.customerClass}</div>
                    <div className="text-sm text-blue-600">
                      {initialProfile.assignedManagerId ? "已分配客户经理" : "等待分配客户经理"}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="needs" className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="text-sm text-gray-500 mb-4">请选择您的金融需求（可多选）</div>
                <div className="grid grid-cols-2 gap-4">
                  {needsOptions.map((need) => (
                    <div key={need.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`need-${need.value}`}
                        checked={(profile.needs || []).includes(need.value)}
                        onCheckedChange={(checked) => handleNeedsChange(need.value, checked === true)}
                      />
                      <Label htmlFor={`need-${need.value}`}>{need.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hobbies" className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="text-sm text-gray-500 mb-4">请选择您的个人爱好（可多选）</div>
                <div className="grid grid-cols-2 gap-4">
                  {hobbiesOptions.map((hobby) => (
                    <div key={hobby.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`hobby-${hobby.value}`}
                        checked={(profile.hobbies || []).includes(hobby.value)}
                        onCheckedChange={(checked) => handleHobbiesChange(hobby.value, checked === true)}
                      />
                      <Label htmlFor={`hobby-${hobby.value}`}>{hobby.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <CardFooter className="flex justify-end pt-4">
              <Button type="submit">保存信息</Button>
            </CardFooter>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CustomerProfile;
