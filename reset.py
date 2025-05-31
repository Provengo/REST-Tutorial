import requests
import time
import subprocess
import sys
from pathlib import Path

# # Start the Flask app in the background
# app_process = subprocess.Popen([sys.executable, str(Path(__file__).parent / 'sut.py')], 
#                              stdout=subprocess.PIPE,
#                              stderr=subprocess.PIPE,
#                              text=True)

# # Wait for the app to start and get the host/port
# host = None
# port = None
# while host is None or port is None:
#     line = app_process.stdout.readline()
#     if "host=" in line:
#         host = line.split("'")[1]
#     if "port=" in line:
#         port = int(line.split("=")[1])
#     time.sleep(0.1)

host = "localhost"
port = 23242

url = f"http://{host}:{port}"

test_data = {
    'users': [{ 'id': 1, 'name': 'Test User' }],
    'books': [{ 'id': 1, 'title': 'Test Book' }]
}
requests.post(f"{url}/reset", json=test_data)
