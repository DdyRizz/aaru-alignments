FROM python:3.11-slim AS builder

# Prevent Python from writing .pyc files and enable stdout buffering
ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

WORKDIR /app

# Install build tools to build wheels
RUN apt-get update && apt-get install -y --no-install-recommends \
	build-essential gcc && rm -rf /var/lib/apt/lists/*

# Copy only requirements to leverage layer caching
COPY requirements.txt ./

# Build wheels for all dependencies to avoid carrying build deps into the final image
RUN pip install --upgrade pip wheel && \
	pip wheel --wheel-dir /wheels -r requirements.txt

FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
	PYTHONUNBUFFERED=1

WORKDIR /app

# Install runtime-only system deps (if any)
RUN apt-get update && apt-get install -y --no-install-recommends \
	libpq-dev && rm -rf /var/lib/apt/lists/*

# Install Python packages from pre-built wheels
COPY --from=builder /wheels /wheels
COPY requirements.txt ./
RUN pip install --upgrade pip && \
	pip install --no-cache-dir --no-index --find-links /wheels -r requirements.txt

# Copy application source
COPY app/ ./app

# Create a non-root user and switch to it
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
