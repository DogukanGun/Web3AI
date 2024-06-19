FROM ubuntu:latest

RUN apt-get update
RUN apt-get install -y git curl ca-certificates software-properties-common
RUN install -m 0755 -d /etc/apt/keyrings
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
RUN chmod a+r /etc/apt/keyrings/docker.asc
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
   tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get update
RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
RUN apt-get install python3 -y
RUN apt-get install -y \
    python3-pip \
    python3.12-venv

RUN curl -fsSL https://ollama.com/install.sh | sh


# Set the working directory
WORKDIR /image

COPY requirements.txt /image

# Create a virtual environment and install dependencies
RUN python3 -m venv venv && \
    /bin/bash -c "source venv/bin/activate && pip install --upgrade pip setuptools wheel && pip install -r requirements.txt"

# Copy the rest of the application code
COPY . /image

RUN /bin/bash -c "source venv/bin/activate"

RUN docker-compose up
