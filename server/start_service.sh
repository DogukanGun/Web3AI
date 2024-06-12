#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Run ollama serve
ollama serve &

# Pull the 'llama2' model
ollama pull llama3

# Run the 'llama2' model
ollama run llama3

# Run the application
python3 main.py