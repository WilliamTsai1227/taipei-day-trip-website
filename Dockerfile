# Using the Python base image
FROM python:3.11.7

# Set working directory
WORKDIR /usr/src/app

# Copy dependency files and install dependencies
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

# Install additional dependencies
RUN pip install python-multipart


# Copy project files to container
COPY . .

EXPOSE 8000

# Run application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]