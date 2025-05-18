from app import db
from datetime import datetime
import json
from werkzeug.security import generate_password_hash, check_password_hash

# 用户模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # customer, manager, admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 关系
    customer_profile = db.relationship('CustomerProfile', backref='user', uselist=False, 
                                       cascade='all, delete-orphan', foreign_keys='CustomerProfile.user_id')
    manager_profile = db.relationship('ManagerProfile', backref='user', uselist=False, 
                                      cascade='all, delete-orphan', foreign_keys='ManagerProfile.user_id')
    
    def __repr__(self):
        return f'<User {self.username}>'
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
        
    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def verify_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'name': self.name,
            'role': self.role,
            'created_at': self.created_at.isoformat()
        }

# 客户资料模型
class CustomerProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    age = db.Column(db.Integer, nullable=True)
    occupation = db.Column(db.String(100), nullable=True)
    total_assets = db.Column(db.Integer, nullable=True)  # 以分为单位
    _needs = db.Column(db.Text, nullable=True)  # 存储为JSON字符串
    _hobbies = db.Column(db.Text, nullable=True)  # 存储为JSON字符串
    customer_class = db.Column(db.String(1), nullable=True)  # A, B, C, D, E
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 定义关系
    manager = db.relationship('User', foreign_keys=[manager_id], backref=db.backref('managed_customers', lazy='dynamic'))
    
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
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'age': self.age,
            'occupation': self.occupation,
            'total_assets': self.total_assets,
            'needs': self.needs,
            'hobbies': self.hobbies,
            'customer_class': self.customer_class,
            'manager_id': self.manager_id,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# 经理资料模型
class ManagerProfile(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    _capabilities = db.Column(db.Text, nullable=True)  # 存储为JSON字符串
    _hobbies = db.Column(db.Text, nullable=True)  # 存储为JSON字符串
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
        from app.models import CustomerProfile
        return CustomerProfile.query.filter_by(manager_id=self.user_id).count()
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'capabilities': self.capabilities,
            'hobbies': self.hobbies,
            'customer_count': self.customer_count,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

# 匹配历史记录
class MatchHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    manager_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    match_score = db.Column(db.Float, nullable=False)  # 匹配分数
    needs_match = db.Column(db.Integer, nullable=False)  # 需求匹配数
    hobbies_match = db.Column(db.Integer, nullable=False)  # 爱好匹配数
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # 创建人（系统或管理员）
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # 定义关系
    customer = db.relationship('User', foreign_keys=[customer_id])
    manager = db.relationship('User', foreign_keys=[manager_id])
    creator = db.relationship('User', foreign_keys=[created_by])
    
    def to_dict(self):
        return {
            'id': self.id,
            'customer_id': self.customer_id,
            'manager_id': self.manager_id,
            'match_score': self.match_score,
            'needs_match': self.needs_match,
            'hobbies_match': self.hobbies_match,
            'created_by': self.created_by,
            'created_at': self.created_at.isoformat(),
            'customer': self.customer.to_dict() if self.customer else None,
            'manager': self.manager.to_dict() if self.manager else None
        }

# 人工智能表
class AIInteraction(db.Model):
    id = db.Column(db.BigInteger, primary_key=True)
    add_time = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    user_id = db.Column(db.BigInteger, nullable=False)
    ad_mind = db.Column(db.BigInteger, nullable=False)  # admin_id
    ask = db.Column(db.Text, nullable=False)  # 提问
    reply = db.Column(db.Text, nullable=False)  # 回复
    is_reply = db.Column(db.Integer, nullable=False, default=0)  # 是否回复
    is_read = db.Column(db.Integer, nullable=True)  # 已读/未读
    user_name = db.Column(db.String(12), nullable=False)  # 用户名
    user_image = db.Column(db.Text, nullable=False)  # 用户头像
    type = db.Column(db.Integer, nullable=False)  # 内容类型
    
    def __repr__(self):
        return f'<AIInteraction {self.id}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'add_time': self.add_time.isoformat(),
            'user_id': self.user_id,
            'ad_mind': self.ad_mind,
            'ask': self.ask,
            'reply': self.reply,
            'is_reply': self.is_reply,
            'is_read': self.is_read,
            'user_name': self.user_name,
            'user_image': self.user_image,
            'type': self.type
        }
