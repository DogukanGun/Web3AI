FROM ubuntu:latest

RUN apt-get update
RUN apt-get install git -y && apt-get install curl -y
RUN curl -fsSL https://ollama.com/install.sh | sh
RUN ollama serve &
RUN ollama pull llama3 
RUN apt-get install python3 -y
RUN apt-get install -y \
    python3-pip \
    python3.12-venv

# Set the working directory
WORKDIR /image

# Copy the requirements.txt file and install dependencies
COPY requirements.txt /image
RUN python3 -m venv venv
RUN /bin/bash -c "source venv/bin/activate && \
                  pip install -r requirements.txt"
# Copy the rest of the application code
COPY . /image

# Define the command to run the application
CMD ["./start_service.sh"]
