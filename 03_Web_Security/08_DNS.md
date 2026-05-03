Think of DNS (Domain Name System) as the **phonebook of the internet**. While humans remember names like `google.com`,
computers only communicate using strings of numbers called **IP addresses** (like `142.250.190.46`). DNS is the service that
translates those names into numbers.

---

## 1. The Key Players

When you type a URL into your browser, four types of servers work together to find the IP address:

1.  **DNS Recursive Resolver:** Think of this as a librarian you ask to find a specific book. It’s usually managed by your
    ISP and is the first stop for your request.
2.  **Root Nameserver:** This is the first step of the actual lookup. It doesn't know the IP, but it can point the resolver
    toward the right "department" (like `.com` or `.org`).
3.  **TLD Nameserver (Top-Level Domain):** This server manages specific domain extensions. If you're looking for a `.com`
    site, the TLD server points you toward the specific records for that extension.
4.  **Authoritative Nameserver:** This is the final authority. It holds the actual IP address for the domain you're looking
    for.

---

## 2. The Step-by-Step Process

When you visit a website for the first time, the "DNS Query" follows this path:

1.  **The Request:** You type `example.com`. Your computer checks its local **cache** first. If it's not there, it sends the
    request to the **Recursive Resolver**.
2.  **The Root:** The Resolver asks the **Root Nameserver**, _"Where is the .com info?"_ The Root replies with the address of
    the `.com` TLD server.
3.  **The TLD:** The Resolver asks the **TLD Server**, _"Where is example.com?"_ The TLD replies with the address of that
    domain's **Authoritative Nameserver**.
4.  **The Answer:** The Resolver asks the **Authoritative Nameserver**, _"What is the IP for example.com?"_ The server
    returns the IP address (e.g., `93.184.216.34`).
5.  **The Connection:** The Resolver gives the IP back to your browser, and your browser initiates a connection to that
    server to load the page.

---

## 3. Caching: The "Fast Track"

To prevent the internet from slowing to a crawl, DNS information is **cached** at every level.

- **Browser/OS Cache:** Your computer remembers sites you've visited recently so it doesn't have to ask the internet at all.
- **Resolver Cache:** Your ISP's resolver keeps a copy of popular requests. If 1,000 people visit `example.com`, the resolver
  only has to do the full "Root-to-Authoritative" walk once.

Every DNS record has a **TTL (Time to Live)**, which tells the servers how long they should keep the record in their cache
before asking for a fresh copy.

---

## 4. Types of DNS Records

DNS doesn't just handle website addresses; it handles various types of data:

| Record Type     | Purpose                                                                         |
| :-------------- | :------------------------------------------------------------------------------ |
| **A Record**    | Maps a domain name to an **IPv4** address.                                      |
| **AAAA Record** | Maps a domain name to an **IPv6** address.                                      |
| **CNAME**       | Aliases one domain name to another (e.g., `www.site.com` points to `site.com`). |
| **MX Record**   | Directs **email** to the correct mail server.                                   |
| **TXT Record**  | Holds text info for security and domain verification.                           |

---

## Why does it matter?

Without DNS, you would have to memorize a string of numbers for every website you wanted to visit. It’s a massive,
distributed database that handles billions of requests every second, making the human-friendly web possible.

---

To understand how we secure the "phonebook of the internet," we have to look at two different problems: ensuring the data
hasn't been tampered with and ensuring your browsing habits remain private.

### 1. DNSSEC: Preventing "Fake" Directions

The original DNS protocol wasn't built with security in mind, making it vulnerable to **DNS Cache Poisoning**. This is where
an attacker sends a spoofed response to a resolver, tricking it into saving a malicious IP address (e.g., sending you to a
fake bank website).

**DNSSEC (Domain Name System Security Extensions)** adds a layer of trust by using digital signatures.

- It doesn't encrypt the data, but it attaches a "seal of authenticity."
- Every level of the DNS hierarchy signs its records using public-key cryptography.
- If the signature doesn't match, your browser knows the data was tampered with and refuses to connect.

---

### 2. DNS Encryption: Protecting Privacy

Standard DNS queries are sent in **plaintext**. This means your ISP, a hacker on public Wi-Fi, or even a government entity
can see every website you try to visit, even if the website itself is encrypted (HTTPS).

To solve this, two main protocols were developed to wrap DNS queries in a layer of encryption:

- **DoH (DNS over HTTPS):** Your DNS requests are hidden inside regular HTTPS traffic. This makes it look like normal web
  browsing, which helps bypass censorship and makes it much harder for third parties to track your activity.
- **DoT (DNS over TLS):** Similar to DoH, but it uses a dedicated port (853) specifically for DNS. It’s slightly more
  efficient for network administrators to manage, but easier to block.

---

### 3. The "Last Mile" Problem

Even with encryption and security, there is still a concern about the **Recursive Resolver** (the "Librarian"). Even if no
one else can see your DNS request, the resolver provider (like your ISP, Google, or Cloudflare) still sees everything.

To mitigate this, many users switch to **Privacy-Focused Resolvers** (like Quad9 or Cloudflare's 1.1.1.1) that promise not to
log user IP addresses or sell browsing data to advertisers.

### Summary Table: Security Comparison

| Feature                                | Standard DNS | DNSSEC  | DoH / DoT           |
| :------------------------------------- | :----------- | :------ | :------------------ |
| **Integrity** (Is the IP real?)        | No           | **Yes** | Yes (via HTTPS/TLS) |
| **Privacy** (Can others see my query?) | No           | No      | **Yes**             |
| **Censorship Resistance**              | Low          | Low     | **High**            |
