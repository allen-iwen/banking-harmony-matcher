
from flask import Blueprint

api_bp = Blueprint('api', __name__)

from app.api import routes

# 注册健康检查端点
@api_bp.route('/health', methods=['GET'])
def health_check():
    return {'status': 'healthy', 'version': '1.0.0'}
