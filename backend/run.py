
import os
import logging
from app import create_app
from flask import jsonify

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

app = create_app()

# Add global error handler
@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}", exc_info=True)
    return jsonify({
        "error": "Internal Server Error",
        "message": "The server encountered an unexpected condition",
    }), 500

# Add health check endpoint
@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "version": "1.0.0",
        "service": "bank-customer-portrait-backend"
    })

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    logger.info(f"Starting server on {host}:{port}")
    app.run(host=host, port=port)
