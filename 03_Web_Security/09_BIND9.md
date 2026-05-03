Installing a DNS server on Ubuntu is most commonly done using **BIND9** (Berkeley Internet Name Domain), which is the
standard for DNS software.

Depending on your needs, you can set it up as a **Caching DNS** (to speed up internet browsing) or an **Authoritative DNS**
(to host your own domain names).

---

## 1. Install BIND9

First, update your package repository and install the BIND9 service and utilities.

```bash
sudo apt update
sudo apt install bind9 bind9utils bind9-doc
```

## 2. Configure for IPv4

By default, BIND tries to use both IPv4 and IPv6. If your network doesn't use IPv6, you can force it to IPv4 to avoid minor
errors.

1. Open the configuration file: `sudo nano /etc/default/named`
2. Change the `OPTIONS` line to include `-4`:
   > `OPTIONS="-u bind -4"`

## 3. Set Up Forwarders (Caching Server)

If you want your server to resolve external websites (like google.com), you should configure **forwarders**. These are
upstream DNS servers (like Google or Cloudflare) that your server will ask if it doesn't know the answer.

1. Open the options file: `sudo nano /etc/bind/named.conf.options`
2. Find the `forwarders` section and uncomment/edit it:
   ```bash
   forwarders {
       8.8.8.8;
       8.8.4.4;
   };
   ```
3. Save and exit (Ctrl+O, Enter, Ctrl+X).

---

## 4. Configure a Local Zone (Authoritative Server)

If you want to point a custom domain (e.g., `internal.lan`) to a specific IP address in your network, you need to define a
**Zone**.

### Step A: Define the Zone

Open `sudo nano /etc/bind/named.conf.local` and add:

```bash
zone "internal.lan" {
    type master;
    file "/etc/bind/db.internal.lan";
};
```

### Step B: Create the Zone File

Copy the default template to create your new zone file:

```bash
sudo cp /etc/bind/db.local /etc/bind/db.internal.lan
sudo nano /etc/bind/db.internal.lan
```

Edit the file to map your domain to your IP. It should look something like this:

```text
;
; BIND data file for internal.lan
;
$TTL    604800
@       IN      SOA     ns1.internal.lan. admin.internal.lan. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
@       IN      NS      ns1.internal.lan.
ns1     IN      A       192.168.1.10  ; The IP of your Ubuntu server
web     IN      A       192.168.1.11  ; A dummy web server IP
```

---

## 5. Check Syntax and Restart

Before restarting, always check if your configuration files have typos.

- **Check main config:** `sudo named-checkconf`
- **Check zone file:** `sudo named-checkzone internal.lan /etc/bind/db.internal.lan`

If no errors appear, restart BIND:

```bash
sudo systemctl restart bind9
sudo systemctl enable bind9
```

## 6. Adjust the Firewall

Allow DNS traffic (Port 53) through the Ubuntu Firewall (UFW):

```bash
sudo ufw allow Bind9
```

---

## Testing Your Server

From a different machine (or the server itself), use the `dig` command to see if it responds:

```bash
dig @localhost internal.lan
```

If you see the IP address you configured in the **ANSWER SECTION**, your DNS server is officially live!
