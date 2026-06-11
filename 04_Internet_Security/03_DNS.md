It can be incredibly frustrating when a security upgrade ends up tanking your browsing speed. You try to do the right thing
for your privacy, and suddenly every website feels like it's loading over 2000s dial-up.

When you enable `DNSOverTLS=yes` (DoT) and `DNSSEC=yes` in `systemd-resolved`, you are essentially adding multiple security
checks and cryptographic handshakes to **every single new domain request**.

Here is the breakdown of why this specific combination is slowing things down, and how to fix it.

---

## The Culprits: Why It slows Down

### 1. TCP and TLS Handshake Overhead (DNSOverTLS)

Traditional DNS uses UDP, which is a "fire-and-forget" protocol. Your computer asks for an IP, and the server sends it back
in a single round-trip.

When you turn on **DoT**, DNS switches to TCP and wraps the connection in TLS encryption. This introduces a massive amount of
back-and-forth communication before a single byte of actual DNS data is sent:

- **Traditional DNS (UDP):** 1 round trip.
- **DNS over TLS:** TCP handshake (1 round trip) + TLS cryptographic handshake (1-2 round trips) + DNS query/response.

If `systemd-resolved` is not reusing these connections efficiently, it performs this heavy handshake _every single time_ a
website requests a new resource (images, ads, scripts from different domains).

### 2. Cryptographic Validation Chain (DNSSEC)

`DNSSEC=yes` forces your system to cryptographically validate that the DNS records haven't been tampered with.

- Instead of just fetching the IP address, your system must fetch the DNS record, the cryptographic signature (`RRSIG`), and
  the public key (`DNSKEY`).
- It then has to build a "chain of trust" all the way up to the internet's root zone.
- This drastically increases the amount of data being downloaded and requires your CPU to do math to validate the signatures.
  If a parent zone's servers are slow, your lookup stalls.

### 3. The "Double Whammy" Interaction

When you combine both, **DNSSEC is validated over the DoT connection**. If your configured upstream DNS server (like your
ISP, Google, or Cloudflare) takes a moment to respond with the DNSSEC keys, and that data has to be encrypted and decrypted
via TLS, the latency multiplies exponentially.

Furthermore, if your upstream DNS provider doesn't perfectly support DNSSEC or DoT, `systemd-resolved` will often wait for a
timeout before retrying, causing multi-second delays.

---

## How to Fix It Without Giving Up Security

You don't have to completely sacrifice privacy for speed. Here are a few ways to optimize your `/etc/systemd/resolved.conf`
setup.

### Fix 1: Enable Connection Multiplexing (Opportunistic DoT)

Instead of forcing a strict, fresh TLS connection every time, change `DNSOverTLS=yes` to `DNSOverTLS=opportunistic`.

```ini
DNSOverTLS=opportunistic

```

> **Note:** `yes` strictly requires DoT and will fail or stall if the connection drops. `opportunistic` will attempt TLS and
> reuse open TLS sessions, but can gracefully fall back to standard DNS if a specific server is choked, preventing your
> browser from freezing.

### Fix 2: Switch to `DNSSEC=allow-downgrade`

Setting `DNSSEC=yes` forces validation on _all_ domains. However, a massive portion of the internet still doesn't properly
configure DNSSEC. When `systemd-resolved` encounters these, it can get stuck trying to validate the unvalidatable.

Change it to:

```ini
DNSSEC=allow-downgrade

```

This validates DNSSEC for domains that support it, but instantly skips the validation overhead for domains that don't.

### Fix 3: Ensure You Are Using Fast, Dedicated Upstream DNS

If you are relying on your local ISP's DNS servers, they are likely terrible at handling DoT and DNSSEC. Hardcode fast,
reliable privacy-focused servers (like Cloudflare or Quad9) directly into your config:

```ini
[Resolve]
DNS=1.1.1.1 9.9.9.9
FallbackDNS=1.0.0.1 149.112.112.112
DNSOverTLS=opportunistic
DNSSEC=allow-downgrade

```

### Apply Your Changes

After editing the file, restart the service to apply the changes:

```bash
sudo systemctl restart systemd-resolved

```
