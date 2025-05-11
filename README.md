
# 银行客户画像及客户经理分配系统

## 项目介绍

本系统是一个银行客户画像及客户经理智能分配平台，旨在通过数据分析和智能算法，实现客户与客户经理的最优匹配，提升银行的客户服务质量和管理效率。

## 技术栈

### 后端技术
- Python Flask：Web框架
- SQLAlchemy：ORM框架
- JWT：用户认证
- scikit-learn：机器学习算法
- MySQL：数据库

### 前端技术
- React：前端框架
- Tailwind CSS：UI样式库
- React Router：路由管理
- Recharts：数据可视化

## 系统功能

- 多角色用户系统：客户、客户经理、管理员
- 客户画像管理：个人信息、需求分析、爱好记录
- 智能匹配系统：K-Means++聚类算法、相似度评分
- 数据分析和可视化：客户分布、匹配效果统计

## 快速开始

### 使用Docker部署（推荐）

1. 确保已安装 Docker 和 Docker Compose

2. 克隆项目
```bash
git clone <项目地址>
cd 银行客户画像系统
```

3. 启动应用
```bash
docker-compose up -d
```

4. 初始化数据库和测试数据
```bash
docker-compose exec backend bash setup.sh
```

5. 访问应用
   - 前端: http://localhost:3000
   - 后端API: http://localhost:5000/api/health

### 手动设置

#### 后端设置

1. 创建虚拟环境并激活
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

2. 安装依赖
```bash
pip install -r requirements.txt
```

3. 配置环境变量
   - 复制 `.env.example` 为 `.env`
   - 根据本地环境修改 `.env` 中的配置

4. 创建数据库
```sql
CREATE DATABASE bank_customer_portrait CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. 初始化数据库
```bash
flask db init
flask db migrate -m "初始化数据库"
flask db upgrade
```

6. 生成测试数据
```bash
python -c "from app.utils.data_generator import generate_test_data; generate_test_data()"
```

7. 启动后端服务
```bash
flask run
```

#### 前端设置

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器
```bash
npm run dev
```

## 测试账号

系统会自动生成以下测试账号：

- 管理员：username=admin, password=admin123
- 客户：username=customer1-20, password=123456
- 客户经理：username=manager1-5, password=123456

## 系统架构

### 后端架构
- RESTful API设计
- 基于Flask蓝图的模块化结构
- 数据库迁移管理
- JWT身份认证
- 机器学习算法集成

### 前端架构
- 组件化设计
- 响应式布局
- 状态管理
- API服务层
- 数据可视化组件

### 数据库设计
- 用户表：认证和角色管理
- 客户资料表：客户画像信息
- 经理资料表：经理能力和特长
- 匹配记录表：历史匹配数据

## 项目结构

```
银行客户画像系统/
├── backend/                 # Flask后端
│   ├── app/                 # Flask应用
│   │   ├── api/             # API蓝图
│   │   ├── auth/            # 认证蓝图
│   │   ├── models.py        # 数据模型
│   │   ├── utils/           # 工具函数
│   │   └── __init__.py      # 应用初始化
│   ├── migrations/          # 数据库迁移文件
│   ├── .env                 # 环境变量
│   ├── Dockerfile           # 后端Docker配置
│   ├── requirements.txt     # Python依赖
│   └── run.py               # 应用入口
├── src/                     # React前端源码
│   ├── components/          # UI组件
│   ├── context/             # 上下文管理
│   ├── hooks/               # 自定义钩子
│   ├── pages/               # 页面组件
│   ├── services/            # API服务
│   └── types/               # TypeScript类型
├── docker-compose.yml       # Docker Compose配置
├── Dockerfile               # 前端Docker配置
├── nginx.conf               # Nginx配置
└── README.md                # 项目说明
```

## API文档

主要API端点：

- 认证: `/api/auth/login`, `/api/auth/register`, `/api/auth/verify`
- 客户: `/api/customers/:id/profile`, `/api/customers`
- 经理: `/api/managers/:id/profile`, `/api/managers`
- 管理: `/api/admin/dashboard`, `/api/admin/auto-assign`, `/api/admin/manual-assign`
- 健康检查: `/api/health`
