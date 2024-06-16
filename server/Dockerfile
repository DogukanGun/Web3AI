FROM ubuntu:latest

# Install necessary packages in a single RUN command to reduce layers
RUN apt-get update && \
    apt-get install -y \
    git \
    curl \
    python3 \
    python3-pip \
    python3.12-venv

# Download and install Ollama separately with retries
RUN curl -fsSL https://ollama.com/install.sh -o /tmp/install.sh && \
    bash /tmp/install.sh && \
    rm /tmp/install.sh

# Set the working directory
WORKDIR /image

# Copy the requirements.txt file first to leverage Docker cache
COPY requirements.txt /image

# Create a virtual environment and install dependencies
RUN python3 -m venv venv && \
    /bin/bash -c "source venv/bin/activate && pip install --upgrade pip setuptools wheel && pip install -r requirements.txt"

# Copy the rest of the application code
COPY . /image

# Ensure the start_service.sh script is executable
RUN chmod +x start_service.sh

# Define the entrypoint to run the application
ENTRYPOINT ["/bin/bash", "-c", "source venv/bin/activate && ./start_service.sh"]
