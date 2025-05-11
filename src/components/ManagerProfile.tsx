
import { useState } from 'react';
import { ManagerProfile as ManagerProfileType, CustomerNeed, Hobby } from '../types/types';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const capabilitiesOptions: { value: CustomerNeed; label: string }[] = [
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

interface ManagerProfileProps {
  initialProfile?: ManagerProfileType;
}

const ManagerProfile: React.FC<ManagerProfileProps> = ({ initialProfile }) => {
  const { updateManagerProfile } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<Partial<ManagerProfileType>>(
    initialProfile || {
      capabilities: [] as CustomerNeed[],
      hobbies: [] as Hobby[],
      customerCount: 0,
    }
  );

  const handleCapabilitiesChange = (capability: CustomerNeed, checked: boolean) => {
    setProfile(prev => {
      const currentCapabilities = prev.capabilities || [];
      return {
        ...prev,
        capabilities: checked
          ? [...currentCapabilities, capability]
          : currentCapabilities.filter(item => item !== capability),
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((profile.capabilities?.length || 0) === 0) {
      toast({
        title: "提交失败",
        description: "请至少选择一项业务能力",
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

    // Update the profile
    if (initialProfile?.id) {
      updateManagerProfile({
        ...(profile as ManagerProfileType),
        id: initialProfile.id,
        customerCount: initialProfile.customerCount || 0,
        updatedAt: new Date().toISOString(),
        createdAt: initialProfile.createdAt,
      });
      
      toast({
        title: "保存成功",
        description: "您的专业信息已更新",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>客户经理专业信息</CardTitle>
        <CardDescription>请完善您的业务能力和兴趣爱好，以便我们为您匹配合适的客户</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="capabilities" className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="capabilities">业务能力</TabsTrigger>
            <TabsTrigger value="hobbies">个人爱好</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="capabilities" className="space-y-4">
              <div className="border rounded-md p-4">
                <div className="text-sm text-gray-500 mb-4">请选择您的业务专长领域（可多选）</div>
                <div className="grid grid-cols-2 gap-4">
                  {capabilitiesOptions.map((capability) => (
                    <div key={capability.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`capability-${capability.value}`}
                        checked={(profile.capabilities || []).includes(capability.value)}
                        onCheckedChange={(checked) => handleCapabilitiesChange(capability.value, checked === true)}
                      />
                      <Label htmlFor={`capability-${capability.value}`}>{capability.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {initialProfile && (
                <div className="mt-2 p-4 bg-blue-50 rounded-md">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">当前客户数量</h3>
                  <div className="text-3xl font-bold text-blue-700">{initialProfile.customerCount || 0}</div>
                </div>
              )}
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

export default ManagerProfile;
