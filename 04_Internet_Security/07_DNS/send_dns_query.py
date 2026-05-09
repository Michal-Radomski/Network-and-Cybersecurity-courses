from scapy.all import DNS, DNSQR, IP, UDP, sr1

IPpkt = IP(dst="8.8.8.8")
UDPpkt = UDP(dport=53)

Qdsec = DNSQR(qname="www.syracuse.edu")
DNSpkt = DNS(id=100, qr=0, qdcount=1, qd=Qdsec)
Querypkt = IPpkt / UDPpkt / DNSpkt
Replypkt = sr1(Querypkt)
reply = Replypkt[DNS]
print(repr(reply))
