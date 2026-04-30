import socket

# 1. Define the IP and Port to listen on
# '127.0.0.1' is "localhost" (your own computer)
# Port 5005 is a random "unassigned" port
UDP_IP = "127.0.0.1"
UDP_PORT = 5005

# 2. Create the socket (AF_INET = IPv4, SOCK_DGRAM = UDP)
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
# print("sock:", sock)

# 3. Bind the socket to our IP and Port
sock.bind((UDP_IP, UDP_PORT))

print(f"Waiting for packets on {UDP_IP}:{UDP_PORT}...")

while True:
    # 4. Receive data (buffer size is 1024 bytes)
    data, addr = sock.recvfrom(1024)
    # print("data, addr:", data, addr)
    print(f"Received message: {data.decode()} from {addr}")
