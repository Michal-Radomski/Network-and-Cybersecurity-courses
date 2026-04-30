import socket

# 1. Define the destination (must match the receiver)
UDP_IP = "127.0.0.1"
UDP_PORT = 5005
MESSAGE = b"Hello! This is a network packet."

print(f"Target IP: {UDP_IP}")
print(f"Target Port: {UDP_PORT}")

# 2. Create the socket
sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
print("sock:", sock)

# 3. Send the packet
sock.sendto(MESSAGE, (UDP_IP, UDP_PORT))

print("Packet sent!")
