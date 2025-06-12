"""
Gunicorn configuration file for Claude ROI Calculator
Increases timeout to handle long-running Anthropic API calls
"""

# Server socket
import os
bind = f"0.0.0.0:{os.environ.get('PORT', 5001)}"

# Worker processes
workers = 1  # Keep it simple for now
worker_class = "sync"

# Timeout - increased to 5 minutes for Anthropic API calls
timeout = 300  # 5 minutes

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Request handling
keepalive = 5