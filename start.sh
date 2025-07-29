#!/bin/bash

# Make script exit on any error
set -e

echo "=== Starting Inventory Management API ==="

# Initialize database (create indexes)
echo "Initializing database..."
python init_db.py

if [ $? -eq 0 ]; then
    echo "✓ Database initialization completed"
else
    echo "✗ Database initialization failed"
    exit 1
fi

# Start the FastAPI application
echo "Starting FastAPI application on port ${PORT:-8000}..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info