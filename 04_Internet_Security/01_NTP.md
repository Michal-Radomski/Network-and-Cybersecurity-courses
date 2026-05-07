The **Network Time Protocol (NTP)** is one of the oldest and most essential internet protocols still in use. Its primary job
is to synchronize the clocks of computers over a network to within a few milliseconds of Coordinated Universal Time (UTC).

### How NTP Works

NTP operates on a **hierarchical strategy** known as "strata." This ensures that time is distributed efficiently without
overloading the most accurate sources.

- **Stratum 0:** High-precision timekeeping devices like atomic clocks, GPS, or radio clocks. They aren't connected to the
  network directly but are attached to computers.
- **Stratum 1:** Servers directly linked to Stratum 0 devices. These are the primary network time standards.
- **Stratum 2:** Servers that synchronize with Stratum 1 servers. Most enterprise NTP servers sit at this level.
- **Stratum 3 and below:** Devices that sync with the level above them.

The protocol uses **UDP port 123** and employs complex algorithms to account for "network jitter"—the variable delay in
packet travel—to ensure the local clock is adjusted smoothly rather than jumping abruptly.

---

### Setting Up an NTP Server on Ubuntu

While Ubuntu now uses `systemd-timesyncd` by default for simple client-side syncing, setting up a full **NTP server** (to
serve time to other machines) is best handled by the `chrony` or `ntp` daemon. **Chrony** is the modern recommendation for
its speed and accuracy.

#### Step 1: Install Chrony

Open your terminal and update your package list, then install the service:

```bash
sudo apt update
sudo apt install chrony
```

#### Step 2: Configure the Server

You need to tell your server which "upstream" sources to trust and which clients are allowed to ask it for the time. Open the
configuration file:

```bash
sudo nano /etc/chrony/chrony.conf
```

**Key configurations to check/add:**

1.  **Pools:** Ensure there are reliable sources. Ubuntu usually pre-configures these: `pool ntp.ubuntu.com iburst`
2.  **Allow Clients:** By default, Chrony doesn't answer network requests. To allow your local network (e.g.,
    `192.168.1.0/24`), add this line: `allow 192.168.1.0/24`

#### Step 3: Restart and Enable

Save the file (Ctrl+O, Enter) and exit (Ctrl+X). Restart the service to apply changes:

```bash
sudo systemctl restart chrony
sudo systemctl enable chrony
```

#### Step 4: Adjust the Firewall

If you have `ufw` enabled, you must allow NTP traffic:

```bash
sudo ufw allow ntp
```

---

### Verifying the Setup

To see if your server is successfully talking to the "outside world," use the following command:

```bash
chronyc sources -v
```

A **`*`** next to a source name indicates that your server has successfully synced with that source.

> **Why bother?** Accurate time is critical for security logs, Kerberos authentication (which fails if clocks differ by more
> than 5 minutes), and database transaction sequencing. Without it, your digital world can get very messy, very fast.
