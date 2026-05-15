**Server-Side Request Forgery (SSRF)** is a web security vulnerability that allows an attacker to induce the server-side
application to make requests to an unintended location.

In a typical SSRF attack, the attacker might cause the server to connect to internal-only services within the organization's
infrastructure. In other cases, they may force the server to connect to arbitrary external systems, potentially leaking
sensitive data such as authorization credentials.

---

## How SSRF Works

Normally, a server might need to fetch data from a remote URL (e.g., to import an image from another site or check a
webhook). If the application doesn't properly validate the URL provided by the user, an attacker can swap that URL with an
internal IP address or a private service.

### Common Targets

- **Cloud Metadata Services:** Attackers often target `http://169.254.169.254/`, which is a well-known internal endpoint for
  AWS, Azure, and Google Cloud. It can leak API keys, instance roles, and configuration data.
- **Internal Databases/APIs:** Services like Redis, MongoDB, or internal admin panels that aren't exposed to the public
  internet but are accessible from the web server.
- **File System:** Using protocols like `file:///etc/passwd`, an attacker might try to read local files on the server.

---

## Types of SSRF

| Type           | Description                                                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Basic SSRF** | The server returns data from the requested URL back to the attacker. This makes it easy to exfiltrate data directly.                                                  |
| **Blind SSRF** | The server does not return the response body to the attacker. The attacker must instead look for side effects, such as time delays or pings to a server they control. |

---

## Example Scenario

Imagine a web app that generates a thumbnail of a website. The request looks like this:

`POST /gen-thumbnail` `{"url": "https://example.com/logo.png"}`

An attacker changes the payload to: `{"url": "http://localhost:8080/admin/delete-all-users"}`

The server, trusting its own "internal" network, executes the request and performs the administrative action.

---

## Prevention and Mitigation

To protect against SSRF, you should implement a "defense-in-depth" strategy:

- **Network Layer:** Segment the network so the web server cannot communicate with sensitive internal services unless
  absolutely necessary.
- **Allowlisting:** Only allow requests to a predefined list of trusted domains or IP addresses. **Avoid denylists**, as
  attackers can often bypass them using encoded IP addresses (e.g., decimal or hex) or DNS rebinding.
- **Disable Unused Schemes:** Ensure the server only supports `http` and `https`, disabling dangerous protocols like
  `file://`, `gopher://`, or `ftp://`.
- **Authentication:** Never assume a request is safe just because it comes from a local IP. Every internal service should
  require its own authentication.
