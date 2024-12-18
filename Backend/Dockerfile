# Use Python as the base image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the application code
COPY . .

# Expose Flask port
EXPOSE 5000

# Start Flask
CMD ["python", "app.py"]
