
from flask import request, jsonify
from app import db, jwt
from app.models import User, CustomerProfile, ManagerProfile
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
        name=data['name'],
        role=data['role']
    )
    user.password = data['password']  # 使用setter方法加密密码
    
    db.session.add(user)
    db.session.commit()
    
    # 创建配套资料
    if data['role'] == 'customer':
        profile = CustomerProfile(user_id=user.id)
        db.session.add(profile)
    elif data['role'] == 'manager':
        profile = ManagerProfile(user_id=user.id)
        db.session.add(profile)
    
    db.session.commit()
    
    # 生成访问令牌
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'msg': '注册成功',
        'user': user.to_dict(),
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
    if not user or not user.verify_password(data['password']):
        return jsonify({'msg': '用户名或密码错误'}), 401
    
    # 生成访问令牌
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'msg': '登录成功',
        'user': user.to_dict(),
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
    
    return jsonify(user.to_dict()), 200

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    # JWT不需要在服务器端特别处理登出
    # 客户端只需删除存储的token即可
    return jsonify({'msg': '成功登出'}), 200
