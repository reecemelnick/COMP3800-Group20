# COMP3800-Group20

# Install

## MacOS
brew update
brew install pyenv

## Linux/Unix
curl -fsSL https://pyenv.run | bash

### Python

# Install
pyenv install 3.11.2

# Create virtual env
python3 -m venv venv

# Activate
source venv/bin/activate

# Install lib
pip3 install -r requirements.txt

# Deactivate
deactivate

## Run
cd src
python3 hello.py
