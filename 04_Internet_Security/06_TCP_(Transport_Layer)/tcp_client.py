import socket

udp = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)

udp.connect(("8.8.8.8", 80))  # doesn't actually send data
ip = udp.getsockname()[0]
print(ip)


tcp = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
tcp.connect((ip, 9091))

tcp.sendall(b"Hello Server!\n")
tcp.sendall(b"Hello Again!\n")

udp.close()
tcp.close()
