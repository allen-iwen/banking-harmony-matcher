
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Index() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link to="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold sm:inline-block">银行客户管理系统</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                to="/login"
                className="transition-colors hover:text-foreground/80"
              >
                登录
              </Link>
              <Link
                to="/register"
                className="transition-colors hover:text-foreground/80"
              >
                注册
              </Link>
              <Link
                to="/enhancements"
                className="transition-colors hover:text-foreground/80 text-blue-600 font-semibold"
              >
                系统优化
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  银行客户画像与客户经理分配系统
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  基于用户画像的智能客户经理匹配系统，为银行客户提供个性化服务
                </p>
              </div>
              <div className="space-x-4">
                <Link to="/login">
                  <Button>登录系统</Button>
                </Link>
                <Link to="/enhancements">
                  <Button variant="outline">查看系统优化</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">
                  智能匹配
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  精准客户画像
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  系统通过多维度数据分析，构建全面精准的客户画像，了解客户需求和行为特征
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm">
                  高效服务
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  最优经理分配
                </h2>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  基于客户画像和经理特长，实现客户与经理的最优匹配，提供高质量个性化服务
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                全新系统优化与功能增强
              </h2>
              <p className="max-w-[85%] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                我们正在不断优化系统，增添新功能，提升用户体验和服务质量
              </p>
              <Link to="/enhancements" className="mt-4">
                <Button>查看升级内容</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">
          © 2023 银行客户管理系统. 保留所有权利.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            条款
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            隐私
          </Link>
        </nav>
      </footer>
    </div>
  );
}
