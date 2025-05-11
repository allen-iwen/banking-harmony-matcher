
# React前端与Flask后端集成指南

本文档说明如何将现有的React前端与新建的Flask后端集成，包括设置开发环境、实现API通信和部署应用。

## 1. 项目架构

项目采用前后端分离架构：
- **前端**：React（当前项目）
- **后端**：Flask（需要新建）
- **数据库**：MySQL（需要设置）

### 目录结构推荐

```
银行客户画像系统/
├── frontend/             # React前端（当前项目）
├── backend/              # Flask后端（需要创建）
│   ├── app/              # Flask应用
│   ├── migrations/       # 数据库迁移文件
│   ├── requirements.txt  # Python依赖
│   └── run.py            # 应用入口
└── README.md             # 主项目README
```

## 2. 创建Flask后端

### 安装Python和依赖项

1. 确保已安装Python 3.8+
2. 创建虚拟环境并激活

```bash
# 创建backend目录
mkdir backend
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境（Windows）
venv\Scripts\activate

# 激活虚拟环境（Mac/Linux）
source venv/bin/activate
```

3. 安装必要的Python包

```bash
pip install flask flask-sqlalchemy flask-migrate flask-cors flask-jwt-extended pymysql scikit-learn pandas numpy
pip freeze > requirements.txt
```

### 创建Flask应用结构

1. 创建基本目录结构

```bash
mkdir -p app/api app/auth app/models app/utils
touch app/__init__.py app/models.py run.py
```

2. 创建Flask应用初始化文件 (app/__init__.py)

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os

# 初始化数据库
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # 配置数据库
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql+pymysql://username:password@localhost/bank_customer_portrait')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # 配置JWT
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'your-secret-key')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1小时
    
    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)
    
    # 注册蓝图
    from app.auth import auth_bp
    from app.api import api_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # 健康检查路由
    @app.route('/api/health')
    def health():
        return {'status': 'ok'}
    
    return app
```

3. 创建数据模型 (app/models.py)

```python
from app import db
from datetime import datetime
import json

# 用户模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # customer, manager, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    customer_profile = db.relationship('CustomerProfile', backref='user', uselist=False)
    manager_profile = db.relationship('ManagerProfile', backref='user', uselist=False)
    
    def __repr__(self):
        return f'<User {self.username}>'

# 客户资料模型
class CustomerProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    age = db.Column(db.Integer)
    occupation = db.Column(db.String(100))
    total_assets = db.Column(db.Integer)  # 以分为单位
    _needs = db.Column(db.Text)  # 存储为JSON字符串
    _hobbies = db.Column(db.Text)  # 存储为JSON字符串
    customer_class = db.Column(db.String(1))  # A, B, C, D, E
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def needs(self):
        return json.loads(self._needs) if self._needs else []
    
    @needs.setter
    def needs(self, value):
        self._needs = json.dumps(value)
    
    @property
    def hobbies(self):
        return json.loads(self._hobbies) if self._hobbies else []
    
    @hobbies.setter
    def hobbies(self, value):
        self._hobbies = json.dumps(value)
    
    def __repr__(self):
        return f'<CustomerProfile {self.id}>'

# 经理资料模型
class ManagerProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    _capabilities = db.Column(db.Text)  # 存储为JSON字符串
    _hobbies = db.Column(db.Text)  # 存储为JSON字符串
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def capabilities(self):
        return json.loads(self._capabilities) if self._capabilities else []
    
    @capabilities.setter
    def capabilities(self, value):
        self._capabilities = json.dumps(value)
    
    @property
    def hobbies(self):
        return json.loads(self._hobbies) if self._hobbies else []
    
    @hobbies.setter
    def hobbies(self, value):
        self._hobbies = json.dumps(value)
    
    # 获取当前管理的客户数量
    @property
    def customer_count(self):
        return CustomerProfile.query.filter_by(manager_id=self.user_id).count()
    
    def __repr__(self):
        return f'<ManagerProfile {self.id}>'
```

## 3. 实现Flask API端点

创建身份验证蓝图 (app/auth/__init__.py 和 app/auth/routes.py)

```python
# app/auth/__init__.py
from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

from app.auth import routes
```

```python
# app/auth/routes.py
from flask import request, jsonify
from app import db, jwt
from app.models import User
from app.auth import auth_bp
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 验证必要字段
    required_fields = ['username', 'password', 'name', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify({'msg': f'缺少必要字段: {field}'}), 400
    
    # 检查用户名是否已存在
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'msg': '用户名已存在'}), 409
    
    # 检查角色是否有效
    if data['role'] not in ['customer', 'manager', 'admin']:
        return jsonify({'msg': '无效的角色类型'}), 400
    
    # 创建新用户
    user = User(
        username=data['username'],
        password=generate_password_hash(data['password']),
        name=data['name'],
        role=data['role']
    )
    
    db.session.add(user)
    db.session.commit()
    
    # 创建配套资料
    if data['role'] == 'customer':
        from app.models import CustomerProfile
        profile = CustomerProfile(user_id=user.id)
        db.session.add(profile)
    elif data['role'] == 'manager':
        from app.models import ManagerProfile
        profile = ManagerProfile(user_id=user.id)
        db.session.add(profile)
    
    db.session.commit()
    
    # 生成访问令牌
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'msg': '注册成功',
        'user': {
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'role': user.role
        },
        'token': access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # 验证必要字段
    if 'username' not in data or 'password' not in data:
        return jsonify({'msg': '缺少用户名或密码'}), 400
    
    # 查找用户
    user = User.query.filter_by(username=data['username']).first()
    
    # 验证用户和密码
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'msg': '用户名或密码错误'}), 401
    
    # 生成访问令牌
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'msg': '登录成功',
        'user': {
            'id': user.id,
            'username': user.username,
            'name': user.name,
            'role': user.role
        },
        'token': access_token
    }), 200

@auth_bp.route('/verify', methods=['POST'])
@jwt_required()
def verify_token():
    # 获取当前用户ID
    current_user_id = get_jwt_identity()
    
    # 查找用户
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'msg': '用户不存在'}), 404
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'name': user.name,
        'role': user.role
    }), 200
```

## 4. 集成React前端与Flask后端

### 配置前端API服务

1. 创建前端环境变量文件 (.env.development)

```
VITE_API_URL=http://localhost:5000/api
```

2. 更新前端API服务以使用真实后端

编辑前端的API服务文件，将模拟数据替换为实际API调用。例如:

```javascript
// 真实API实现
login: async (username, password) => {
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
}
```

### 运行集成应用

1. 启动Flask后端

```bash
cd backend
source venv/bin/activate  # 或 venv\Scripts\activate (Windows)
flask run --port=5000
```

2. 在另一个终端中启动React前端

```bash
cd frontend
npm run dev
```

现在，React前端应该能够与Flask后端通信，提供真实的数据交互。

## 5. 实现K-Means++聚类算法和自动匹配

在Flask后端实现K-Means++算法来进行客户分类和匹配：

```python
# app/utils/clustering.py
import numpy as np
from sklearn.cluster import KMeans
from app.models import CustomerProfile, ManagerProfile, User

def compute_similarity_score(customer_needs, customer_hobbies, manager_capabilities, manager_hobbies):
    """计算客户和经理之间的相似度分数"""
    # 计算需求与能力的重合数
    needs_match = len(set(customer_needs).intersection(set(manager_capabilities)))
    
    # 计算爱好的重合数
    hobbies_match = len(set(customer_hobbies).intersection(set(manager_hobbies)))
    
    # 总重合数
    total_match = needs_match + hobbies_match
    
    # 确定客户类别
    if total_match >= 13:
        customer_class = 'A'
    elif total_match >= 10:
        customer_class = 'B'
    elif total_match >= 7:
        customer_class = 'C'
    elif total_match >= 4:
        customer_class = 'D'
    else:
        customer_class = 'E'
    
    # 升级规则：如果需求重合数比爱好重合数多2及以上，客户类别自动升级
    if needs_match >= hobbies_match + 2:
        if customer_class == 'B':
            customer_class = 'A'
        elif customer_class == 'C':
            customer_class = 'B'
        elif customer_class == 'D':
            customer_class = 'C'
        elif customer_class == 'E':
            customer_class = 'D'
    
    return {
        'total_match': total_match,
        'needs_match': needs_match,
        'hobbies_match': hobbies_match,
        'customer_class': customer_class
    }

def classify_customers():
    """对所有客户进行分类"""
    # 获取所有客户资料
    customers = User.query.filter_by(role='customer').all()
    customer_profiles = {c.id: c.customer_profile for c in customers if c.customer_profile}
    
    # 获取所有经理资料
    managers = User.query.filter_by(role='manager').all()
    manager_profiles = {m.id: m.manager_profile for m in managers if m.manager_profile}
    
    # 对每个客户计算最佳匹配
    results = {}
    
    for customer_id, profile in customer_profiles.items():
        if not profile:
            continue
            
        customer_needs = profile.needs
        customer_hobbies = profile.hobbies
        
        best_match = None
        best_score = -1
        best_manager_id = None
        
        for manager_id, manager_profile in manager_profiles.items():
            if not manager_profile:
                continue
                
            manager_capabilities = manager_profile.capabilities
            manager_hobbies = manager_profile.hobbies
            
            similarity = compute_similarity_score(
                customer_needs, customer_hobbies, 
                manager_capabilities, manager_hobbies
            )
            
            if similarity['total_match'] > best_score:
                best_score = similarity['total_match']
                best_match = similarity
                best_manager_id = manager_id
        
        # 更新客户类别
        if best_match:
            profile.customer_class = best_match['customer_class']
            
        results[customer_id] = {
            'customer_class': profile.customer_class if best_match else 'E',
            'best_manager_id': best_manager_id,
            'similarity_score': best_match
        }
    
    return results

def auto_assign_customers():
    """自动分配客户给经理"""
    # 先对客户进行分类
    classification = classify_customers()
    
    # 按客户类别排序（A, B, C, D, E）
    sorted_customers = sorted(
        classification.items(), 
        key=lambda x: {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}.get(x[1]['customer_class'], 5)
    )
    
    # 获取所有经理
    managers = User.query.filter_by(role='manager').all()
    
    # 初始化经理的当前分配数
    manager_load = {m.id: m.manager_profile.customer_count if m.manager_profile else 0 for m in managers}
    
    # 分配客户
    assignments = {}
    
    for customer_id, info in sorted_customers:
        best_manager_id = info['best_manager_id']
        
        # 找到负载最小的经理
        min_load_manager = min(manager_load.items(), key=lambda x: x[1])[0]
        
        # 如果最佳匹配的经理负载超过50，或者没有最佳匹配，选择负载最小的经理
        if not best_manager_id or manager_load.get(best_manager_id, 0) >= 50:
            assigned_manager = min_load_manager
        else:
            assigned_manager = best_manager_id
        
        # 更新客户的经理ID
        customer_profile = CustomerProfile.query.filter_by(user_id=customer_id).first()
        if customer_profile:
            customer_profile.manager_id = assigned_manager
            manager_load[assigned_manager] = manager_load.get(assigned_manager, 0) + 1
        
        assignments[customer_id] = assigned_manager
    
    return assignments
```

## 6. 部署应用

### 使用Docker部署

1. 为Flask后端创建Dockerfile

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV DATABASE_URL=mysql+pymysql://username:password@db/bank_customer_portrait
ENV JWT_SECRET_KEY=your-production-secret-key

EXPOSE 5000

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
```

2. 为React前端创建Dockerfile

```dockerfile
FROM node:16 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

3. 创建docker-compose.yml

```yaml
version: '3'

services:
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=mysql+pymysql://root:password@db/bank_customer_portrait
      - JWT_SECRET_KEY=your-production-secret-key
    depends_on:
      - db
    networks:
      - app-network

  db:
    image: mysql:5.7
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=bank_customer_portrait
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - app-network

networks:
  app-network:

volumes:
  db-data:
```

4. 使用docker-compose启动应用

```bash
docker-compose up -d
```

### 手动部署

1. 设置MySQL数据库
2. 部署Flask后端到服务器
3. 构建React前端并部署到Web服务器
4. 配置CORS和其他安全设置

## 7. 测试

### 单元测试

为Flask API创建单元测试用例。

### 集成测试

测试前后端通信和数据流。

### 性能测试

测试API响应时间和并发处理能力。

## 结论

按照上述步骤，您可以将React前端和Flask后端集成为一个完整的银行客户画像与客户经理分配系统。这种前后端分离的架构不仅方便开发，还提高了应用的可维护性和可扩展性。

后续可考虑添加更多特性，如:
- 更复杂的推荐算法
- 数据导入/导出功能
- 多语言支持
- 更详细的报表和分析
