To secure your home network with an IDS/IPS like Snort or Suricata, the most critical factor is placement. You need to put
the software where it can "see" all the traffic entering and leaving your house.

## 1. Where to Install

You have two main options depending on your technical comfort level:

- Option A: The "All-in-One" Router (Recommended) Replace your current router (or put your ISP modem in "Bridge Mode") with a
  dedicated machine running a firewall OS like pfSense or OPNsense.
- Why: These systems have Snort and Suricata available as plugins. You can install them with a single click, and they are
  already positioned perfectly to act as your network's gateway.
- Option B: The "Transparent Bridge" (Advanced) Install Ubuntu on a small PC with two network ports. You place this box
  physically between your existing router and your main network switch.
- Why: This allows you to add security without changing your existing router settings. The box acts like an "invisible
  filter" that scans traffic as it passes through.

---

## 2. How to Connect it to the Network

To actually monitor the traffic, you need to "tap" into the data stream. There are three ways to do this:

## Method 1: In-Line (IPS Mode)

The device sits directly in the path of the traffic.

- Setup: Internet → Modem → Suricata Box (Port 1 IN / Port 2 OUT) → WiFi Router/Switch.
- Result: This allows the software to block (drop) malicious packets immediately because the data must pass through the
  software to reach your devices.

## Method 2: SPAN/Mirror Port (IDS Mode)

If you have a "Managed Switch," you can tell it to copy all traffic from one port and send it to another.

- Setup: Plug your Ubuntu box into a specific port on your switch. In the switch settings, enable Port Mirroring (or SPAN) to
  copy all traffic to that port.
- Result: This is safer for beginners. If the Ubuntu box crashes, your internet doesn't go down, but the IDS can only alert
  you—it cannot block the traffic because it's only looking at a copy.

## Method 3: Network TAP

## A physical hardware device (like a Throwing Star LAN Tap) that you plug between two cables. It physically splits the signal.

## 3. Getting Started Checklist

1.  Hardware: Get a low-power PC (like a Protectli or an old Intel NUC) with at least two Intel NICs (Network Interface
    Cards).
2.  Software: I highly recommend starting with pfSense.

- Go to Services -> Snort/Suricata.
  - Select the WAN interface to watch attacks coming from the internet.
  - Select the LAN interface to watch for infected devices inside your house.

3.  Rules: Enable the Emerging Threats (ET) Open ruleset—it’s free and very effective for home use.
