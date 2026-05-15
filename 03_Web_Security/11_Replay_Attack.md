In the world of cybersecurity, a **Replay Attack** is a form of network attack where a valid data transmission is maliciously
or fraudulently repeated or delayed.

Think of it like a "digital recording." The attacker doesn't necessarily need to crack your password or decrypt your data;
they simply capture a legitimate "handshake" or command and play it back later to trick the system into thinking they are the
authorized user.

---

### How a Replay Attack Works

Imagine you use a remote key fob to unlock your car.

1. **Capture:** An attacker hiding nearby uses a device to intercept and record the radio signal sent from your fob to the
   car.
2. **Replay:** After you walk away, the attacker broadcasts that same recorded signal.
3. **Access:** The car’s computer recognizes the "valid" signal and unlocks the doors for the attacker.

### The Technical Process

In a digital network environment, the process usually follows these steps:

- **Interception:** The attacker uses a "sniffer" tool to monitor network traffic between a client (like your laptop) and a
  server.
- **Data Collection:** They identify a specific packet—such as an authentication request or a funds transfer command—and save
  it.
- **Resending:** The attacker sends that exact same packet to the destination server at a later time.
- **Execution:** Because the packet contains the correct encrypted credentials or session tokens from the original session,
  the server treats it as a legitimate request.

---

### Why is it Dangerous?

The primary danger of a replay attack is that the attacker **does not need to know what the data actually says.** Even if the
message is encrypted, if the system isn't designed to check _when_ or _how many times_ a message is sent, the encrypted
"blob" remains a valid "key" every time it is presented. This can lead to unauthorized access, duplicate financial
transactions, or the bypassing of multi-factor authentication.

---

### Common Defenses

Modern systems use several strategies to prevent these attacks:

| Method                       | How it Works                                                                                                                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Session Tokens**           | The server issues a unique, temporary ID for each session. Once the session ends, that token is useless.                                                                                      |
| **Timestamps**               | Each packet includes the time it was sent. If the server receives a packet that is "too old" (e.g., sent more than 5 seconds ago), it rejects it.                                             |
| **Nonces**                   | A "Number used Once." The server sends a random string to the client; the client must include this string in its response. The server then retires that number so it can never be used again. |
| **One-Time Passwords (OTP)** | Using codes that expire immediately after a single use ensures that "replaying" the code does nothing.                                                                                        |

---

### Summary

A replay attack is essentially **identity theft via impersonation of a past event.** While it is a simple concept, it remains
a serious threat to any system that relies on static authentication methods without time-sensitive or unique-use safeguards.
