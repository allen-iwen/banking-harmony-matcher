
from flask import request, jsonify, current_app
from app import db
from app.models import User, CustomerProfile, ManagerProfile, MatchHistory
from app.api import api_bp
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.utils.clustering import classify_customers, auto_assign_customers, compute_similarity_score

# 客户相关API
@api_bp.route('/customers/<int:user_id>/profile', methods=['GET'])
@jwt_required()
def get_customer_profile(user_id):
    # 获取客户资料
    customer_profile = CustomerProfile.query.filter_by(user_id=user_id).first()
    
    if not customer_profile:
        return jsonify({'msg': '未找到客户资料'}), 404
    
    return jsonify(customer_profile.to_dict()), 200

@api_bp.route('/customers/<int:user_id>/profile', methods=['PUT'])
@jwt_required()
def update_customer_profile(user_id):
    current_user_id = get_jwt_identity()
    
    # 检查权限（只有自己或管理员可以更新自己的资料）
    current_user = User.query.get(current_user_id)
    if current_user_id != user_id and current_user.role != 'admin':
        return jsonify({'msg': '无权更新此客户资料'}), 403
    
    data = request.get_json()
    customer_profile = CustomerProfile.query.filter_by(user_id=user_id).first()
    
    if not customer_profile:
        return jsonify({'msg': '未找到客户资料'}), 404
    
    # 更新资料字段
    if 'age' in data:
        customer_profile.age = data['age']
    if 'occupation' in data:
        customer_profile.occupation = data['occupation']
    if 'total_assets' in data:
        customer_profile.total_assets = data['total_assets']
    if 'needs' in data:
        customer_profile.needs = data['needs']
    if 'hobbies' in data:
        customer_profile.hobbies = data['hobbies']
    
    # 管理员可以更新分类和分配经理
    if current_user.role == 'admin':
        if 'customer_class' in data:
            customer_profile.customer_class = data['customer_class']
        if 'manager_id' in data:
            customer_profile.manager_id = data['manager_id']
    
    db.session.commit()
    
    return jsonify(customer_profile.to_dict()), 200

@api_bp.route('/customers', methods=['GET'])
@jwt_required()
def get_all_customers():
    # 获取当前用户
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 只有经理和管理员可以查看所有客户
    if current_user.role not in ['manager', 'admin']:
        return jsonify({'msg': '权限不足'}), 403
    
    # 如果是经理，只返回分配给他的客户
    if current_user.role == 'manager':
        customers_query = User.query.join(CustomerProfile).filter(
            User.role == 'customer',
            CustomerProfile.manager_id == current_user_id
        )
    else:  # 管理员可以查看所有客户
        customers_query = User.query.filter_by(role='customer')
    
    customers = customers_query.all()
    
    return jsonify([c.to_dict() for c in customers]), 200

@api_bp.route('/customers/classification', methods=['GET'])
@jwt_required()
def get_customer_classification():
    # 获取客户分类统计
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 只有管理员可以查看客户分类统计
    if current_user.role != 'admin':
        return jsonify({'msg': '权限不足'}), 403
    
    # 按类别统计客户数量
    class_stats = []
    for class_name in ['A', 'B', 'C', 'D', 'E']:
        count = CustomerProfile.query.filter_by(customer_class=class_name).count()
        class_stats.append({'class': class_name, 'count': count})
    
    return jsonify(class_stats), 200

# 经理相关API
@api_bp.route('/managers/<int:user_id>/profile', methods=['GET'])
@jwt_required()
def get_manager_profile(user_id):
    # 获取经理资料
    manager_profile = ManagerProfile.query.filter_by(user_id=user_id).first()
    
    if not manager_profile:
        return jsonify({'msg': '未找到经理资料'}), 404
    
    return jsonify(manager_profile.to_dict()), 200

@api_bp.route('/managers/<int:user_id>/profile', methods=['PUT'])
@jwt_required()
def update_manager_profile(user_id):
    current_user_id = get_jwt_identity()
    
    # 检查权限（只有自己或管理员可以更新自己的资料）
    current_user = User.query.get(current_user_id)
    if current_user_id != user_id and current_user.role != 'admin':
        return jsonify({'msg': '无权更新此经理资料'}), 403
    
    data = request.get_json()
    manager_profile = ManagerProfile.query.filter_by(user_id=user_id).first()
    
    if not manager_profile:
        return jsonify({'msg': '未找到经理资料'}), 404
    
    # 更新资料字段
    if 'capabilities' in data:
        manager_profile.capabilities = data['capabilities']
    if 'hobbies' in data:
        manager_profile.hobbies = data['hobbies']
    
    db.session.commit()
    
    return jsonify(manager_profile.to_dict()), 200

@api_bp.route('/managers', methods=['GET'])
@jwt_required()
def get_all_managers():
    # 获取当前用户
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 只有管理员可以查看所有经理
    if current_user.role != 'admin':
        return jsonify({'msg': '权限不足'}), 403
    
    managers = User.query.filter_by(role='manager').all()
    
    return jsonify([m.to_dict() for m in managers]), 200

@api_bp.route('/managers/<int:manager_id>/customers', methods=['GET'])
@jwt_required()
def get_manager_customers(manager_id):
    # 获取当前用户
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 检查权限（只有自己或管理员可以查看经理的客户）
    if current_user_id != manager_id and current_user.role != 'admin':
        return jsonify({'msg': '权限不足'}), 403
    
    # 获取分配给该经理的所有客户
    customers = User.query.join(CustomerProfile).filter(
        User.role == 'customer',
        CustomerProfile.manager_id == manager_id
    ).all()
    
    return jsonify([c.to_dict() for c in customers]), 200

# 管理员相关API
@api_bp.route('/admin/dashboard', methods=['GET'])
@jwt_required()
def get_admin_dashboard():
    # 获取当前用户
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 只有管理员可以访问仪表盘
    if current_user.role != 'admin':
        return jsonify({'msg': '权限不足'}), 403
    
    # 统计各种数据
    total_customers = User.query.filter_by(role='customer').count()
    total_managers = User.query.filter_by(role='manager').count()
    unassigned_customers = CustomerProfile.query.filter_by(manager_id=None).count()
    
    # 按类别统计客户
    class_stats = []
    for class_name in ['A', 'B', 'C', 'D', 'E']:
        count = CustomerProfile.query.filter_by(customer_class=class_name).count()
        class_stats.append({'class': class_name, 'count': count})
    
    # 返回仪表盘数据
    return jsonify({
        'total_customers': total_customers,
        'total_managers': total_managers,
        'unassigned_customers': unassigned_customers,
        'customer_classes': class_stats
    }), 200

@api_bp.route('/admin/auto-assign', methods=['POST'])
@jwt_required()
def admin_auto_assign():
    # 获取当前用户
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 只有管理员可以执行自动分配
    if current_user.role != 'admin':
        return jsonify({'msg': '权限不足'}), 403
    
    try:
        # 先对客户进行分类
        classify_results = classify_customers()
        
        # 自动分配客户给经理
        assignments = auto_assign_customers()
        
        # 记录匹配历史
        recorded_matches = 0
        for customer_id, manager_id in assignments.items():
            # 获取客户和经理资料
            customer_profile = CustomerProfile.query.filter_by(user_id=customer_id).first()
            manager = User.query.get(manager_id)
            manager_profile = ManagerProfile.query.filter_by(user_id=manager_id).first()
            
            if customer_profile and manager_profile:
                # 计算匹配分数
                similarity = compute_similarity_score(
                    customer_profile.needs, 
                    customer_profile.hobbies,
                    manager_profile.capabilities,
                    manager_profile.hobbies
                )
                
                # 记录匹配历史
                match_history = MatchHistory(
                    customer_id=customer_id,
                    manager_id=manager_id,
                    match_score=similarity['total_match'],
                    needs_match=similarity['needs_match'],
                    hobbies_match=similarity['hobbies_match'],
                    created_by=current_user_id
                )
                db.session.add(match_history)
                recorded_matches += 1
        
        db.session.commit()
        
        return jsonify({
            'msg': '自动分配成功',
            'assigned_count': len(assignments),
            'recorded_matches': recorded_matches
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"自动分配失败: {str(e)}")
        return jsonify({'msg': f'自动分配失败: {str(e)}'}), 500

@api_bp.route('/admin/manual-assign', methods=['POST'])
@jwt_required()
def admin_manual_assign():
    # 获取当前用户
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 只有管理员可以执行手动分配
    if current_user.role != 'admin':
        return jsonify({'msg': '权限不足'}), 403
    
    data = request.get_json()
    
    # 验证必要字段
    if 'customer_id' not in data or 'manager_id' not in data:
        return jsonify({'msg': '缺少客户ID或经理ID'}), 400
    
    customer_id = data['customer_id']
    manager_id = data['manager_id']
    
    try:
        # 获取客户资料
        customer_profile = CustomerProfile.query.filter_by(user_id=customer_id).first()
        
        if not customer_profile:
            return jsonify({'msg': '未找到客户资料'}), 404
        
        # 获取经理资料
        manager = User.query.get(manager_id)
        
        if not manager or manager.role != 'manager':
            return jsonify({'msg': '未找到有效的经理'}), 404
        
        manager_profile = ManagerProfile.query.filter_by(user_id=manager_id).first()
        
        # 更新客户的经理ID
        customer_profile.manager_id = manager_id
        
        # 计算匹配分数
        similarity = compute_similarity_score(
            customer_profile.needs, 
            customer_profile.hobbies,
            manager_profile.capabilities,
            manager_profile.hobbies
        )
        
        # 更新客户等级
        customer_profile.customer_class = similarity['customer_class']
        
        # 记录匹配历史
        match_history = MatchHistory(
            customer_id=customer_id,
            manager_id=manager_id,
            match_score=similarity['total_match'],
            needs_match=similarity['needs_match'],
            hobbies_match=similarity['hobbies_match'],
            created_by=current_user_id
        )
        db.session.add(match_history)
        
        db.session.commit()
        
        return jsonify({
            'msg': '手动分配成功',
            'customer_id': customer_id,
            'manager_id': manager_id,
            'similarity': similarity
        }), 200
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"手动分配失败: {str(e)}")
        return jsonify({'msg': f'手动分配失败: {str(e)}'}), 500

@api_bp.route('/admin/stats', methods=['GET'])
@jwt_required()
def get_admin_stats():
    # 获取当前用户
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)
    
    # 只有管理员可以获取统计数据
    if current_user.role != 'admin':
        return jsonify({'msg': '权限不足'}), 403
    
    # 收集各种统计数据
    total_customers = User.query.filter_by(role='customer').count()
    total_managers = User.query.filter_by(role='manager').count()
    total_matches = MatchHistory.query.count()
    
    # 客户分类统计
    class_stats = []
    for class_name in ['A', 'B', 'C', 'D', 'E']:
        count = CustomerProfile.query.filter_by(customer_class=class_name).count()
        class_stats.append({'class': class_name, 'count': count})
    
    # 经理负载统计
    manager_loads = []
    managers = User.query.filter_by(role='manager').all()
    for manager in managers:
        customer_count = CustomerProfile.query.filter_by(manager_id=manager.id).count()
        manager_loads.append({
            'manager_id': manager.id,
            'manager_name': manager.name,
            'customer_count': customer_count
        })
    
    return jsonify({
        'total_customers': total_customers,
        'total_managers': total_managers,
        'total_matches': total_matches,
        'class_stats': class_stats,
        'manager_loads': manager_loads
    }), 200
