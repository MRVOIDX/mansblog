"""
Simple run script for the MANS University Blog
"""
from main import app

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)