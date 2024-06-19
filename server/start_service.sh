#!/bin/bash

source venv/bin/activate

ollama serve &

python3 main.py
