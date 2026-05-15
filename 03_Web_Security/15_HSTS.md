**HTTP Strict Transport Security (HSTS)** is a web security policy mechanism that helps protect websites against
man-in-the-middle attacks such as protocol downgrade attacks and cookie hijacking. It allows web servers to declare that web
browsers should only interact with it using secure HTTPS connections, never via HTTP.

### How HSTS Works

When a user enters a URL or clicks a link that uses `http://`, the browser typically makes an unencrypted request. A server
using HSTS responds with a specific header that tells the browser: _"From now on, do not use HTTP to talk to me. Only use
HTTPS."_

The core of this mechanism is the `Strict-Transport-Security` HTTP response header. A typical header looks like this:

`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`

- **`max-age`**: The time (in seconds) the browser should remember that the site is only to be accessed using HTTPS.
  `31536000` is one year.
- **`includeSubDomains`**: (Optional) Applies this rule to all of the site's subdomains (e.g., `blog.example.com`).
- **`preload`**: (Optional) Signals that the site owner wants to be included in the "HSTS Preload List" maintained by major
  browsers.

---

### Key Benefits

- **Prevents SSL Stripping**: In an SSL stripping attack, a hacker intercepts the request and "downgrades" the connection to
  unencrypted HTTP. HSTS prevents this because the browser will refuse to load the site over HTTP once the policy is set.
- **Protection Against Certificate Warnings**: Usually, if a site has a certificate error, browsers allow users to "Proceed
  anyway (unsafe)." If HSTS is active, the browser **disallows** the user from bypassing the warning, ensuring the connection
  is truly secure.
- **Cookie Security**: It helps prevent hackers from stealing session cookies sent over unencrypted connections.

---

### The "Trust on First Use" (TOFU) Gap

HSTS has one small vulnerability: the very first time a user visits a site, the browser doesn't know to use HSTS yet. If a
hacker intercepts that specific first request, they can still perform a downgrade attack.

To fix this, browsers use a **Preload List**. This is a hard-coded list of domains (like Google, Facebook, and many others)
built directly into the browser code. If your domain is on this list, the browser knows to use HTTPS even before it ever
visits your site for the first time.

### Implementation Checklist

To properly implement HSTS, a site owner should:

1. Ensure a valid SSL/TLS certificate is installed.
2. Redirect all HTTP traffic to HTTPS (301 Redirect).
3. Serve the `Strict-Transport-Security` header on all HTTPS responses.
4. Ensure all subdomains work correctly over HTTPS if using `includeSubDomains`.
