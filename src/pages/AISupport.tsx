
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendHorizontal } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { AIInteraction } from '@/types/types';

const AISupport = () => {
  const { toast } = useToast();
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);

  // Sample conversations for demo
  const [conversations, setConversations] = useState<AIInteraction[]>([
    {
      id: '1',
      addTime: new Date().toISOString(),
      userId: '1',
      adMind: '0',
      ask: '如何查看我的客户经理是谁？',
      reply: '您可以在"我的资料"页面查看您的客户经理信息，包括联系方式和专业特长。如果您有任何问题，可以直接通过系统与客户经理沟通。',
      isReply: 1,
      isRead: 1,
      userName: '张三',
      userImage: '',
      type: 1
    },
    {
      id: '2',
      addTime: new Date(Date.now() - 86400000).toISOString(),
      userId: '1',
      adMind: '0',
      ask: '如何更新我的个人信息？',
      reply: '您可以在"我的资料"页面点击"编辑资料"按钮，更新您的联系方式、职业信息等个人资料。更新后的信息将帮助我们为您提供更精准的服务。',
      isReply: 1,
      isRead: 1,
      userName: '张三',
      userImage: '',
      type: 1
    }
  ]);

  const handleSubmit = () => {
    if (!question.trim()) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newConversation: AIInteraction = {
        id: Date.now().toString(),
        addTime: new Date().toISOString(),
        userId: '1',
        adMind: '0',
        ask: question,
        reply: '感谢您的提问，我们的客户经理将尽快回复您的问题。您也可以通过"我的资料"页面联系您的专属客户经理获取更多帮助。',
        isReply: 1,
        isRead: 0,
        userName: '当前用户',
        userImage: '',
        type: 1
      };
      
      setConversations([newConversation, ...conversations]);
      setQuestion('');
      setLoading(false);
      
      toast({
        title: "问题提交成功",
        description: "我们的客户经理将尽快回复您的问题",
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">智能客服支持</h1>
        <p className="text-gray-600">您可以在这里提出关于银行产品、服务或系统使用的问题，我们会尽快回复您</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>提出问题</CardTitle>
              <CardDescription>请描述您的问题，我们将尽快为您解答</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="请输入您的问题..."
                className="min-h-[120px]"
              />
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSubmit} disabled={loading || !question.trim()}>
                {loading ? '提交中...' : '提交问题'}
                <SendHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <h2 className="font-semibold mb-4">常见问题</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                '如何查看我的客户经理?',
                '如何更新我的个人资料?',
                '如何查看金融产品推荐?',
                '如何评价客户经理服务?',
              ].map((q, i) => (
                <Button 
                  key={i} 
                  variant="outline" 
                  className="justify-start h-auto py-3 px-4"
                  onClick={() => setQuestion(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>历史对话</CardTitle>
              <CardDescription>您的历史问题及回复</CardDescription>
            </CardHeader>
            <CardContent className="max-h-[500px] overflow-y-auto">
              {conversations.map((conv) => (
                <div key={conv.id} className="mb-6 last:mb-0">
                  <div className="mb-3">
                    <div className="flex items-start">
                      <div className="bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                        {conv.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{conv.userName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(conv.addTime).toLocaleString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 bg-muted p-3 rounded-lg ml-10">
                      {conv.ask}
                    </div>
                  </div>
                  
                  <div className="ml-10">
                    <div className="flex items-start">
                      <div className="bg-bank-100 text-bank-800 rounded-full h-8 w-8 flex items-center justify-center mr-2">
                        客服
                      </div>
                      <div className="mt-2 bg-bank-50 p-3 rounded-lg border border-bank-100 flex-1">
                        {conv.reply}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AISupport;
