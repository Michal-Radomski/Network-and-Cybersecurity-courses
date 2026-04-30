import socket
import struct


def start_sniffer():
    # 1. Create a raw socket
    # AF_PACKET: Low-level packet interface (Linux specific)
    # SOCK_RAW: We want the raw data, not processed TCP/UDP
    # ntohs(0x0003): ETH_P_ALL - capture all Ethernet protocols
    try:
        conn = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.ntohs(0x0003))
    except PermissionError:
        print("Error: You must run this script as root (sudo)!")
        return

    print("Sniffer started... Press Ctrl+C to stop.")

    while True:
        # 2. Receive the raw data
        raw_data, addr = conn.recvfrom(65536)

        # 3. Unpack the Ethernet Header (First 14 bytes)
        # 6s = Destination MAC (6 bytes)
        # 6s = Source MAC (6 bytes)
        # H  = Ethernet Type (2 bytes)
        dest_mac, src_mac, eth_proto = struct.unpack("! 6s 6s H", raw_data[:14])

        print("\n[+] New Frame Captured!")
        print(
            f"    Target MAC: {dest_mac.hex(':')} | Source MAC: {src_mac.hex(':')} | Protocol: {eth_proto}"
        )

        # 4. Show the first 20 bytes of the IP Header (if it's an IP packet)
        if eth_proto == 8:  # 8 is the code for IPv4
            ip_header = raw_data[14:34]
            print(f"    Raw IP Header Hex: {ip_header.hex(' ')}")


if __name__ == "__main__":
    start_sniffer()
