
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

# 初始化数据库
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # 配置数据库
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:password@localhost/bank_customer_portrait')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # 配置JWT
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'dev-secret-key-change-in-production')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 1小时
    
    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # 允许跨域请求
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # 注册蓝图
    from app.auth import auth_bp
    from app.api import api_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # 健康检查路由
    @app.route('/api/health')
    def health():
        return {'status': 'ok', 'service': 'bank-customer-portrait-api'}
    
    return app
