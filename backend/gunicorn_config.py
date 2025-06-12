"""
Gunicorn configuration file for Claude ROI Calculator
Increases timeout to handle long-running Anthropic API calls
"""

# Server socket
bind = "0.0.0.0:5001"

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