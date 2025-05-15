
// Re-export from the hooks directory
import { useToast, toast } from "@/hooks/use-toast";

// Define a custom wrapper for system-level notifications
const systemToast = {
  success: (message: string) => toast({ 
    title: "成功", 
    description: message,
    variant: "default",
    className: "bg-green-50 border-green-200 text-green-800" 
  }),
  
  error: (message: string) => toast({ 
    title: "错误", 
    description: message,
    variant: "destructive" 
  }),
  
  warning: (message: string) => toast({ 
    title: "警告", 
    description: message,
    variant: "default",
    className: "bg-yellow-50 border-yellow-200 text-yellow-800"
  }),
  
  info: (message: string) => toast({ 
    title: "提示", 
    description: message,
    variant: "default",
    className: "bg-blue-50 border-blue-200 text-blue-800"
  })
};

export { useToast, toast, systemToast };
