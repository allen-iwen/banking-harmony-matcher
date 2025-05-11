
"""
测试数据生成器
用于生成测试账号和模拟数据
"""

from app import db
from app.models import User, CustomerProfile, ManagerProfile
import random

# 可选的金融需求列表
FINANCIAL_NEEDS = [
    'savings',         # 储蓄
    'investment',      # 投资
    'insurance',       # 保险
    'loan',            # 贷款
    'mortgage',        # 住房贷款
    'retirement',      # 退休规划
    'tax',             # 税务规划
    'education',       # 教育基金
    'wealthManagement' # 财富管理
]

# 可选的爱好列表
HOBBIES = [
    'travel',          # 旅行
    'sports',          # 体育
    'reading',         # 阅读
    'music',           # 音乐
    'art',             # 艺术
    'cooking',         # 烹饪
    'technology',      # 科技
    'fitness',         # 健身
    'charity',         # 慈善
    'investing',       # 投资
    'realestate',      # 房地产
    'gaming',          # 游戏
    'gardening',       # 园艺
    'cars',            # 汽车
    'fashion',         # 时尚
    'photography',     # 摄影
    'wine',            # 品酒
]

# 职业列表
OCCUPATIONS = [
    '工程师', '教师', '医生', '律师', '会计', '销售', '设计师',
    '研究员', '学生', '企业家', '公务员', '自由职业', '退休人员'
]

def generate_test_data():
    """生成测试数据"""
    print("开始生成测试数据...")
    
    # 创建管理员账号
    create_admin()
    
    # 创建客户账号
    create_customers(20)  # 创建20个客户
    
    # 创建经理账号
    create_managers(5)  # 创建5个经理
    
    db.session.commit()
    
    print("测试数据生成完成！")

def create_admin():
    """创建管理员账号"""
    # 检查是否已存在管理员账号
    if User.query.filter_by(username='admin').first():
        print("管理员账号已存在，跳过创建")
        return
        
    admin = User(
        username='admin',
        name='系统管理员',
        role='admin'
    )
    admin.password = 'admin123'
    
    db.session.add(admin)
    db.session.commit()
    
    print("已创建管理员账号: admin / admin123")

def create_customers(count):
    """创建客户账号
    
    Args:
        count: 要创建的客户数量
    """
    existing_count = User.query.filter_by(role='customer').count()
    print(f"已存在{existing_count}个客户账号")
    
    for i in range(1, count + 1):
        username = f'customer{i}'
        
        # 检查用户名是否已存在
        if User.query.filter_by(username=username).first():
            print(f"客户账号 {username} 已存在，跳过创建")
            continue
            
        # 创建客户账号
        customer = User(
            username=username,
            name=f'客户{i}',
            role='customer'
        )
        customer.password = '123456'
        
        db.session.add(customer)
        db.session.flush()  # 获取用户ID
        
        # 创建客户资料
        age = random.randint(25, 65)
        occupation = random.choice(OCCUPATIONS)
        total_assets = random.randint(10000, 1000000) * 100  # 以分为单位，10万到1000万
        
        # 随机选择2-5个需求
        needs_count = random.randint(2, 5)
        needs = random.sample(FINANCIAL_NEEDS, needs_count)
        
        # 随机选择3-7个爱好
        hobbies_count = random.randint(3, 7)
        hobbies = random.sample(HOBBIES, hobbies_count)
        
        profile = CustomerProfile(
            user_id=customer.id,
            age=age,
            occupation=occupation,
            total_assets=total_assets
        )
        profile.needs = needs
        profile.hobbies = hobbies
        
        db.session.add(profile)
    
    db.session.commit()
    print(f"已创建{count}个客户账号，密码均为: 123456")

def create_managers(count):
    """创建经理账号
    
    Args:
        count: 要创建的经理数量
    """
    existing_count = User.query.filter_by(role='manager').count()
    print(f"已存在{existing_count}个经理账号")
    
    for i in range(1, count + 1):
        username = f'manager{i}'
        
        # 检查用户名是否已存在
        if User.query.filter_by(username=username).first():
            print(f"经理账号 {username} 已存在，跳过创建")
            continue
            
        # 创建经理账号
        manager = User(
            username=username,
            name=f'经理{i}',
            role='manager'
        )
        manager.password = '123456'
        
        db.session.add(manager)
        db.session.flush()  # 获取用户ID
        
        # 创建经理资料
        # 随机选择3-7个能力
        capabilities_count = random.randint(3, 7)
        capabilities = random.sample(FINANCIAL_NEEDS, capabilities_count)
        
        # 随机选择2-5个爱好
        hobbies_count = random.randint(2, 5)
        hobbies = random.sample(HOBBIES, hobbies_count)
        
        profile = ManagerProfile(user_id=manager.id)
        profile.capabilities = capabilities
        profile.hobbies = hobbies
        
        db.session.add(profile)
    
    db.session.commit()
    print(f"已创建{count}个经理账号，密码均为: 123456")

# 直接执行此文件可以生成测试数据
if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        generate_test_data()
