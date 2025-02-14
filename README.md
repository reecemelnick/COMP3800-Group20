# COMP3800-Group20

# Install

## MacOS
brew update
brew install pyenv

## Linux/Unix
curl -fsSL https://pyenv.run | bash

### Python

# Install
pyenv install 3.12.0

# Create virtual env
python3 -m venv venv

# Activate
source venv/bin/activate

# Install lib
pip3 install -r requirements-dev.txt

# Deactivate
deactivate

## set PYTHONPATH
export PYTHONPATH="${PYTHONPATH}:/path/to/your/lambda/"

## unittest
python -m unittest tests/src/* -v

## formatter
autopep8 --in-place -r src/

# disable __pycache__
export PYTHONDONTWRITEBYTECODE=1

### Docker

# Install
install docker desktop via package manager

## Setup Database
docker compose up -d

## docker cmd
# find container id
docker ps

# cp
docker cp {source} {target}
docker cp dump.sql containerId:/

# export / import database
Go into docker and use terminal and run cmd in export.sh / import.sh

## Run
cd src
python3 pipeline.py
