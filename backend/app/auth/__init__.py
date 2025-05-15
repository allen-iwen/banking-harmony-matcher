
from flask import Blueprint

auth_bp = Blueprint('auth', __name__)

# Import routes after blueprint is defined to avoid circular imports
from app.auth import routes

# Add middleware or custom handlers for the auth blueprint
@auth_bp.before_request
def log_request_info():
    import logging
    logger = logging.getLogger('auth')
    logger.info(f'Auth API request: {auth_bp.name}')

@auth_bp.after_request
def after_request(response):
    # Add security headers
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
