# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend-react

# Copy frontend source
COPY frontend-react/package.json frontend-react/package-lock.json* ./
RUN npm ci

COPY frontend-react/ ./
RUN npm run build

# Stage 2: Build the Python backend and serve
FROM python:3.10-slim AS backend

WORKDIR /app

# Install system dependencies needed for some Python packages (like PyMuPDF/Tesseract etc if needed)
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

# Install backend dependencies
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend source
COPY backend/ ./backend/

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend-react/dist ./frontend-react/dist

# Expose port
EXPOSE 5001

# Run the application
WORKDIR /app/backend
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:5001", "--workers", "1", "--timeout", "120"]
