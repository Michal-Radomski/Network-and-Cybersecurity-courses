import socket

udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

udp.connect(("8.8.8.8", 80))  # doesn't actually send data
ip = udp.getsockname()[0]
print(ip)

data = b"Hello, Server\n"
udp.sendto(data, (ip, 9090))

udp.close()
