# Reset script for the REST API test environment
# Resets the database to a known state with test data

import requests

# API connection settings
host = "localhost"
port = 23242
url = f"http://{host}:{port}"

# Initial test data for database reset
test_data = {
    "users": [{"id": 1, "name": "Test User"}],
    "books": [{"id": 1, "title": "Test Book"}],
}

# Send reset request to the API
requests.post(f"{url}/reset", json=test_data)
