
#!/bin/bash

# 确保数据库已启动
echo "等待MySQL启动..."
sleep 10

# 初始化数据库
echo "初始化数据库..."
flask db init
flask db migrate -m "初始化数据库"
flask db upgrade

# 生成测试数据
echo "生成测试数据..."
python -c "from app.utils.data_generator import generate_test_data; generate_test_data()"

echo "初始化完成！"
