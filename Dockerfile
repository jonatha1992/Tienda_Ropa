# Railway Dockerfile for backend
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies including curl for uv
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv, a fast Python package installer
RUN curl -LsSf https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.cargo/bin:${PATH}"

# Copy requirements and install Python dependencies using uv
COPY backend/requirements.txt .
RUN uv pip install --system --no-cache -r requirements.txt

# Copy backend code (excluding sensitive files)
COPY backend/ .
RUN rm -f firebase_service_account.json  # Remove if accidentally copied

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Expose port
EXPOSE 8000

# Run migrations and start server
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
