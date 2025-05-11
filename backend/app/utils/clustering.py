
"""
K-Means++聚类算法和自动匹配功能
此模块包含客户分类和客户-经理匹配的算法
"""

import numpy as np
from sklearn.cluster import KMeans
from app import db
from app.models import User, CustomerProfile, ManagerProfile

def compute_similarity_score(customer_needs, customer_hobbies, manager_capabilities, manager_hobbies):
    """计算客户和经理之间的相似度分数
    
    Args:
        customer_needs: 客户的需求列表
        customer_hobbies: 客户的爱好列表
        manager_capabilities: 经理的能力列表
        manager_hobbies: 经理的爱好列表
        
    Returns:
        包含总匹配分数、需求匹配数、爱好匹配数和客户等级的字典
    """
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
    if needs_match >= hobbies_match + 2 and customer_class != 'A':
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

def feature_engineering(customers_data, managers_data):
    """将客户和经理的兴趣、需求、能力等特征转换为数值向量
    
    Args:
        customers_data: 客户数据列表，包含需求和爱好
        managers_data: 经理数据列表，包含能力和爱好
        
    Returns:
        客户特征矩阵、经理特征矩阵、特征名称列表
    """
    # 收集所有可能的标签
    all_tags = set()
    
    # 收集客户的需求和爱好
    for customer in customers_data:
        all_tags.update(customer.get('needs', []))
        all_tags.update(customer.get('hobbies', []))
        
    # 收集经理的能力和爱好
    for manager in managers_data:
        all_tags.update(manager.get('capabilities', []))
        all_tags.update(manager.get('hobbies', []))
    
    # 将标签转换为列表并排序，以确保一致性
    feature_names = sorted(list(all_tags))
    feature_count = len(feature_names)
    
    # 为客户创建特征矩阵
    customer_features = np.zeros((len(customers_data), feature_count))
    for i, customer in enumerate(customers_data):
        customer_tags = set(customer.get('needs', []) + customer.get('hobbies', []))
        for j, tag in enumerate(feature_names):
            if tag in customer_tags:
                customer_features[i, j] = 1
                
    # 为经理创建特征矩阵
    manager_features = np.zeros((len(managers_data), feature_count))
    for i, manager in enumerate(managers_data):
        manager_tags = set(manager.get('capabilities', []) + manager.get('hobbies', []))
        for j, tag in enumerate(feature_names):
            if tag in manager_tags:
                manager_features[i, j] = 1
    
    return customer_features, manager_features, feature_names

def classify_customers():
    """对所有客户进行分类
    
    使用K-Means++算法对客户进行聚类，并根据与经理的匹配度确定客户等级
    
    Returns:
        包含客户分类结果的字典
    """
    # 获取所有客户资料
    customers = User.query.filter_by(role='customer').all()
    customer_profiles = {}
    customers_data = []
    
    for customer in customers:
        profile = CustomerProfile.query.filter_by(user_id=customer.id).first()
        if profile:
            customer_profiles[customer.id] = profile
            customers_data.append({
                'id': customer.id,
                'needs': profile.needs,
                'hobbies': profile.hobbies
            })
    
    # 获取所有经理资料
    managers = User.query.filter_by(role='manager').all()
    manager_profiles = {}
    managers_data = []
    
    for manager in managers:
        profile = ManagerProfile.query.filter_by(user_id=manager.id).first()
        if profile:
            manager_profiles[manager.id] = profile
            managers_data.append({
                'id': manager.id,
                'capabilities': profile.capabilities,
                'hobbies': profile.hobbies
            })
    
    # 如果没有客户或经理，则返回空结果
    if not customers_data or not managers_data:
        return {}
    
    # 特征工程：将客户和经理的特征转换为数值向量
    customer_features, manager_features, feature_names = feature_engineering(customers_data, managers_data)
    
    # 使用K-Means++算法对客户进行聚类
    # 聚类数量取决于经理数量，但不少于5（对应A-E五个等级）
    n_clusters = max(5, min(len(managers_data), len(customers_data) // 10 + 1))
    
    # 如果客户数量太少，则不进行聚类
    if len(customers_data) < 5:
        n_clusters = min(len(customers_data), len(managers_data))
    
    # 执行K-Means++聚类
    kmeans = KMeans(n_clusters=n_clusters, init='k-means++', random_state=42, n_init=10)
    customer_clusters = kmeans.fit_predict(customer_features)
    
    # 对每个客户计算最佳匹配
    results = {}
    
    for i, customer_data in enumerate(customers_data):
        customer_id = customer_data['id']
        customer_needs = customer_data['needs']
        customer_hobbies = customer_data['hobbies']
        
        best_match = None
        best_score = -1
        best_manager_id = None
        
        for manager_data in managers_data:
            manager_id = manager_data['id']
            manager_capabilities = manager_data['capabilities']
            manager_hobbies = manager_data['hobbies']
            
            similarity = compute_similarity_score(
                customer_needs, customer_hobbies, 
                manager_capabilities, manager_hobbies
            )
            
            if similarity['total_match'] > best_score:
                best_score = similarity['total_match']
                best_match = similarity
                best_manager_id = manager_id
        
        # 更新客户类别
        customer_profile = customer_profiles.get(customer_id)
        if customer_profile and best_match:
            customer_profile.customer_class = best_match['customer_class']
            
        results[customer_id] = {
            'cluster': int(customer_clusters[i]),
            'customer_class': best_match['customer_class'] if best_match else 'E',
            'best_manager_id': best_manager_id,
            'similarity_score': best_match
        }
    
    # 提交数据库更改
    db.session.commit()
    
    return results

def auto_assign_customers():
    """自动分配客户给经理
    
    基于客户分类和经理负载自动分配客户
    
    Returns:
        包含分配结果的字典，键为客户ID，值为经理ID
    """
    # 先对客户进行分类
    classification = classify_customers()
    
    # 获取所有客户和经理
    customers = User.query.filter_by(role='customer').all()
    customer_profiles = {c.id: CustomerProfile.query.filter_by(user_id=c.id).first() for c in customers}
    
    managers = User.query.filter_by(role='manager').all()
    
    # 初始化经理的当前分配数
    manager_load = {}
    for manager in managers:
        profile = ManagerProfile.query.filter_by(user_id=manager.id).first()
        if profile:
            customer_count = CustomerProfile.query.filter_by(manager_id=manager.id).count()
            manager_load[manager.id] = customer_count
    
    # 按客户类别排序（A, B, C, D, E）
    # 将客户ID和分类结果组合在一起
    sorted_customers = []
    for customer_id, info in classification.items():
        customer_class = info.get('customer_class', 'E')
        sorted_customers.append((customer_id, customer_class, info.get('best_manager_id')))
    
    # 按照客户类别排序
    class_priority = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4}
    sorted_customers.sort(key=lambda x: class_priority.get(x[1], 5))
    
    # 分配客户
    assignments = {}
    
    for customer_id, customer_class, best_manager_id in sorted_customers:
        # 跳过已分配的客户
        if customer_profiles.get(customer_id) and customer_profiles[customer_id].manager_id:
            continue
            
        # 找到负载最小的经理
        min_load_manager = min(manager_load.items(), key=lambda x: x[1])[0] if manager_load else None
        
        # 如果最佳匹配的经理负载过大(超过50个客户)，或者没有最佳匹配，选择负载最小的经理
        if not best_manager_id or best_manager_id not in manager_load or manager_load.get(best_manager_id, 0) >= 50:
            assigned_manager = min_load_manager
        else:
            assigned_manager = best_manager_id
        
        # 确保有可用的经理
        if assigned_manager:
            # 更新客户的经理ID
            customer_profile = customer_profiles.get(customer_id)
            if customer_profile:
                customer_profile.manager_id = assigned_manager
                manager_load[assigned_manager] = manager_load.get(assigned_manager, 0) + 1
            
            assignments[customer_id] = assigned_manager
    
    # 提交数据库更改
    db.session.commit()
    
    return assignments

def generate_customer_insights(customer_id):
    """为特定客户生成洞察
    
    基于客户数据生成洞察和建议
    
    Args:
        customer_id: 客户ID
        
    Returns:
        包含客户洞察的字典
    """
    customer_profile = CustomerProfile.query.filter_by(user_id=customer_id).first()
    
    if not customer_profile:
        return {'error': '未找到客户资料'}
    
    # 获取客户资料
    customer = User.query.get(customer_id)
    needs = customer_profile.needs
    hobbies = customer_profile.hobbies
    customer_class = customer_profile.customer_class or 'E'
    
    # 生成洞察
    insights = {
        'customer_name': customer.name,
        'customer_class': customer_class,
        'class_description': {
            'A': '优质客户，需求与银行服务高度匹配',
            'B': '高价值客户，满足大部分银行服务需求',
            'C': '中等价值客户，部分服务匹配',
            'D': '潜力客户，少量服务匹配',
            'E': '基础客户，需进一步了解需求'
        }.get(customer_class, '未知类别'),
        'needs_analysis': f'客户有{len(needs)}项明确金融需求',
        'hobbies_analysis': f'客户有{len(hobbies)}项个人兴趣爱好',
        'recommendations': []
    }
    
    # 基于客户类别和需求生成建议
    if customer_class in ['A', 'B']:
        insights['recommendations'].append('推荐优先提供个性化服务和专属产品')
        insights['recommendations'].append('定期联系并更新金融方案')
    elif customer_class == 'C':
        insights['recommendations'].append('关注核心需求，提供相关金融产品')
        insights['recommendations'].append('定期沟通，挖掘潜在需求')
    else:  # D或E
        insights['recommendations'].append('提供基础金融服务和教育')
        insights['recommendations'].append('通过问卷或访谈进一步了解需求')
    
    # 基于具体需求的建议
    financial_products = {
        'savings': '储蓄产品',
        'investment': '投资产品',
        'insurance': '保险服务',
        'loan': '贷款服务',
        'mortgage': '住房贷款',
        'retirement': '退休规划',
        'tax': '税务规划',
        'education': '教育基金',
        'wealthManagement': '财富管理',
    }
    
    for need in needs:
        if need in financial_products:
            insights['recommendations'].append(f'推荐{financial_products[need]}相关咨询和服务')
    
    return insights
