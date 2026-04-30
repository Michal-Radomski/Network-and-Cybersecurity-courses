from scapy.all import *  # noqa: F403

IPpkt = IP(dst="10.9.0.5", chksum=0)
UDPpkt = UDP(dport=9090, chksum=0)
data = "Hello, UDP server!\n"
pkt = IPpkt / UDPpkt / data

# Save the packet data to a file
with open("ip.bin", "wb") as f:
    f.write(bytes(pkt))


# from scapy.all import IP, TCP

# # Create a packet
# pkt = IP(dst="8.8.8.8") / TCP(dport=443)

# # Use the .show() method to see the "Internal Anatomy"
# pkt.show()
