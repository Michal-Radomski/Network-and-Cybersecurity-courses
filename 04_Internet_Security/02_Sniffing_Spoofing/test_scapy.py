# from scapy.all import IP, UDP

# IPpkt = IP(dst="10.9.0.5", chksum=0)
# UDPpkt = UDP(dport=9090, chksum=0)
# data = "Hello, UDP server!\n"
# pkt = IPpkt / UDPpkt / data

# # Save the packet data to a file
# with open("ip.bin", "wb") as f:
#     f.write(bytes(pkt))


# from scapy.all import IP, TCP

# # Create a packet
# pkt = IP(dst="8.8.8.8") / TCP(dport=443)

# # Use the .show() method to see the "Internal Anatomy"
# pkt.show()


# from scapy.all import IP, UDP, send

# # Create a packet: IP Layer + UDP Layer + Application Data
# # Notice how we can just type the fake Source IP!
# packet = IP(src="1.2.3.4", dst="127.0.0.1") / UDP(dport=5005) / "Hello from Scapy!"

# # Send it
# send(packet)


from scapy.all import IP, sniff


def process_packet(pkt):
    if pkt.haslayer(IP):
        print(f"Source: {pkt[IP].src} -> Dest: {pkt[IP].dst}")


# This one line handles the raw socket, the loop, and the decoding
sniff(prn=process_packet, count=10)
