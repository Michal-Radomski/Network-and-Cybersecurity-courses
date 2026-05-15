While the "Big Four" you mentioned get most of the headlines, the modern web attack surface is broad and often targets the
logic of the application rather than just the input fields.

Here are some of the most critical common attacks used against web applications today:

---

## 1. Broken Object Level Authorization (BOLA / IDOR)

This is currently one of the most common and severe vulnerabilities. It occurs when an application provides direct access to
objects based on user-supplied input.

- **The Attack:** An attacker changes an ID in a URL or API request (e.g., `api/users/v1/105` to `api/users/v1/106`) to
  access data belonging to another user.
- **The Root Cause:** The server checks if the user is **logged in**, but fails to check if the user has **permission** to
  view that specific resource.

---

## 2. Server-Side Request Forgery (SSRF)

SSRF occurs when an attacker can trick a server-side application into making HTTP requests to an arbitrary domain of the
attacker's choosing.

- **The Attack:** An attacker might use a "URL preview" feature to force the server to scan its own internal network, access
  metadata services (like AWS metadata at `169.254.169.254`), or hit internal databases that aren't exposed to the internet.
- **The Risk:** It turns the trusted server into a proxy to attack the internal infrastructure.

---

## 3. Broken Authentication & Session Management

This isn't a single "exploit" but a category of failures in how an app handles user identity.

- **Credential Stuffing:** Using lists of leaked usernames/passwords from other breaches to "stuff" into your login page via
  automation.
- **Session Hijacking:** If session IDs are predictable or transmitted insecurely, an attacker can steal a "cookie" and
  impersonate the user without ever needing a password.
- **Lack of Rate Limiting:** Allowing an attacker to try millions of password combinations (Brute Force) without being locked
  out.

---

## 4. Security Misconfigurations

This is a broad category that covers "human error" during deployment.

- **Common Issues:**
- Leaving **default credentials** (admin/admin) active.
- Leaving **Directory Browsing** enabled, allowing attackers to see every file on the server.
- Exposing **Verbose Error Messages** that reveal stack traces, database versions, or internal file paths to the end user.
- Unused pages or unprotected cloud storage buckets (like AWS S3).

---

## 5. XML External Entity (XXE) Injection

If an application parses XML input, it might be vulnerable to XXE.

- **The Attack:** An attacker sends a specially crafted XML file that references an "external entity."
- **The Result:** The XML parser might be tricked into reading local files from the server (like `/etc/passwd`) or
  interacting with internal systems.

---

## 6. Vulnerable and Outdated Components

Modern apps are built like Legos, using thousands of third-party libraries (NPM packages, NuGet, etc.).

- **The Attack:** Attackers look for apps using older versions of libraries with known vulnerabilities (CVEs).
- **The Danger:** You can write "perfect" code, but if you use a version of a logging library (like the famous **Log4Shell**
  vulnerability) that has a backdoor, your entire app is compromised.

---

## 7. Business Logic Vulnerabilities

These are flaws in the "rules" of the application rather than technical coding errors.

- **Example:** A shopping cart allows you to add a negative quantity of an item to reduce the total price, or a password
  reset flow that reveals whether an email address exists in the system (Enumeration).
- **Why they are hard to stop:** Automated scanners usually can't find these because the code is technically "valid"—it’s
  just doing something the business didn't intend.

---

### Summary Table

| Attack Name               | Primary Target                  | Main Defense                                        |
| ------------------------- | ------------------------------- | --------------------------------------------------- |
| **BOLA/IDOR**             | User Data                       | Explicit authorization checks per resource          |
| **SSRF**                  | Internal Infrastructure         | Allow-listing domains and isolating the network     |
| **XXE**                   | Server Files / Internal Network | Disabling external entity resolution in XML parsers |
| **Credential Stuffing**   | User Accounts                   | Multi-Factor Authentication (MFA) and Rate Limiting |
| **Vulnerable Components** | The App Framework               | Regular dependency auditing and patching            |
