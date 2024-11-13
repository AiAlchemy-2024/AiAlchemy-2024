import socket
import sys

import uvicorn

from app import app

def get_local_ip():
    try:
        # Create a socket connection
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Connect to an external IP address, here we use Google's DNS server
        s.connect(("8.8.8.8", 80))
        # Get the IP address of the socket connection
        ip_address = s.getsockname()[0]
        # Close the socket
        s.close()
        return ip_address
    except Exception as e:
        return str(e)

def main():
    print("ip")
    ip = get_local_ip()
    port = 8003
    print(f"Connect at {ip}:{port}")
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=port,
        reload=True
    )
if __name__ == "__main__":
    main()