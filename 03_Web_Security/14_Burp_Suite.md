**Burp Suite** is the industry-standard graphical tool for testing Web Application security. Developed by PortSwigger, it
acts as an **intercepting proxy** that sits between your browser and the target web server, allowing you to pause, inspect,
and modify web traffic (HTTP/S) in real-time.

Think of it as a "Man-in-the-Middle" tool that you control, used by security researchers to find vulnerabilities like SQL
injection, Cross-Site Scripting (XSS), and broken authentication.

---

## 1. Installation on Linux

Most security-focused distributions (like Kali Linux or Parrot OS) come with Burp Suite pre-installed. If you are using
Ubuntu, Fedora, or Arch, follow these steps:

1. **Download the Installer:** Go to the [PortSwigger website](https://portswigger.net/burp/communitydownload) and download
   the **Community Edition** (free) shell script (`.sh`).
2. **Make it Executable:** Open your terminal and navigate to your Downloads folder.

```bash
chmod +x burpsuite_community_linux_vXXXX.sh

```

3. **Run the Installer:**

```bash
./burpsuite_community_linux_vXXXX.sh

```

Follow the GUI wizard to complete the installation. You can then launch it by searching for "Burp Suite" in your application
menu or typing `burpsuite` in the terminal.

---

## 2. Core Modules (The Basics)

To use Burp effectively, you need to understand its primary "Tabs":

- **Proxy:** The heart of Burp. It intercepts every request and response.
- **Repeater:** Allows you to manually modify a specific request and "replay" it as many times as you want to see how the
  server reacts.
- **Intruder:** Used for automated attacks (like brute-forcing passwords or fuzzing parameters). _Note: The Community Edition
  is rate-limited here._
- **Decoder:** A utility to transform data (e.g., Base64 to Plaintext, URL encoding).
- **Comparer:** A tool to find differences between two similar HTTP responses.

---

## 3. How to Set Up and Intercept Traffic

The easiest way to start on Linux is using Burp’s **Embedded Browser**, which requires zero configuration.

### Method A: The Embedded Browser (Recommended)

1. Open Burp Suite and go to the **Proxy** tab.
2. Sub-tab **Intercept**, click **Open Browser**.
3. Type a URL in that browser.
4. Back in Burp, click the **Intercept is on** button.
5. When you click a link in the browser, the request will "hang." It is now held in Burp for you to edit or view before
   hitting **Forward**.

### Method B: Manual Configuration (System-wide)

If you prefer using your own browser (like Firefox):

1. **Proxy Settings:** Set your browser's proxy to `127.0.0.1` on port `8080`.
2. **Install CA Certificate:** Navigate to `http://burp` while the proxy is on, download the **CA Certificate**, and import
   it into your browser's "Authorities" settings. This allows you to inspect encrypted **HTTPS** traffic.

---

## 4. A Simple Workflow Example

If you wanted to test how a login form handles a different username:

1. Turn **Intercept ON**.
2. Submit the login form in your browser.
3. In Burp, right-click the intercepted request and select **"Send to Repeater"**.
4. Go to the **Repeater** tab, change the `username` value in the raw text, and click **Send**.
5. Analyze the **Response** on the right side to see if the server gave a different error message.

> **Important Security Warning:** Only use Burp Suite on applications you own or have explicit written permission to test.
> Unauthorized testing is illegal and unethical.
