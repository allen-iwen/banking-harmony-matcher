
FROM python:3.9-slim

WORKDIR /app

# 安装依赖
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 复制应用代码
COPY . .

# 设置环境变量
ENV FLASK_APP=run.py
ENV FLASK_ENV=production
ENV DATABASE_URL=mysql+pymysql://root:password@db/bank_customer_portrait
ENV JWT_SECRET_KEY=production-secret-key-please-change

# 暴露端口
EXPOSE 5000

# 运行应用
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "run:app"]
