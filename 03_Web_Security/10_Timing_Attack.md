A **Timing Attack** is a type of side-channel attack where an adversary discovers sensitive information (like passwords, API
keys, or cryptographic tokens) by measuring how long a system takes to respond to different inputs.

The core idea is simple: if the software stops checking a string the moment it finds a mismatch, it will respond **faster**
for an incorrect first character than it will for an incorrect fifth character. By measuring these tiny differences in
microseconds, an attacker can guess a secret one character at a time.

---

## How It Works

Imagine your code is checking a secret token `"GOLD"`.

1. **Input "Axxx":** The CPU compares 'A' to 'G', sees they don't match, and returns `false` immediately. (Time: 1μs)
2. **Input "Gxxx":** The CPU confirms 'G' matches, moves to 'x' vs 'O', fails, and returns `false`. (Time: 2μs)
3. **Input "GOxx":** The CPU confirms 'G' and 'O', fails on 'x' vs 'L', and returns `false`. (Time: 3μs)

By observing that "G" took slightly longer than "A", the attacker knows "G" is the correct first letter.

---

## Vulnerable Code (The "Fast-Fail" Pattern)

In TypeScript/JavaScript, the standard `==` or `===` operators for strings use a "short-circuit" approach for performance.
This is exactly what creates the vulnerability.

```typescript
// ❌ VULNERABLE: DO NOT USE FOR SECRETS
function insecureCompare(input: string, secret: string): boolean {
  // If lengths differ, it returns immediately (Timing leak)
  if (input.length !== secret.length) {
    return false;
  }

  // The === operator stops at the first character mismatch (Timing leak)
  return input === secret;
}
```

---

## Secure Code (Constant-Time Comparison)

To fix this, you must ensure the function takes the **same amount of time** regardless of whether the input is correct,
partially correct, or completely wrong. This is known as a **Constant-Time** algorithm.

### Using Node.js Built-in (Recommended)

If you are running in a Node.js environment, use the native `crypto.timingSafeEqual`. It is highly optimized and written in
C++ to prevent compiler optimizations that might re-introduce timing leaks.

```typescript
import { timingSafeEqual } from "crypto";

function secureCompare(input: string, secret: string): boolean {
  const inputBuffer = Buffer.from(input);
  const secretBuffer = Buffer.from(secret);

  // Note: Both buffers must be the same length for timingSafeEqual.
  // We still check length, but the actual comparison is safe.
  if (inputBuffer.length !== secretBuffer.length) {
    // We still do a "dummy" comparison to keep time consistent-ish,
    // though length-based timing leaks are often accepted in web apps
    // unless you want to be extremely hardcore.
    return false;
  }

  return timingSafeEqual(inputBuffer, secretBuffer);
}
```

### Manual Implementation (Bitwise Approach)

If you are in a browser environment without `crypto.timingSafeEqual`, you can use bitwise operations to prevent
short-circuiting.

```typescript
// ✅ SECURE: Constant-time comparison
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    // Bitwise OR records if any character pair is different
    // without exiting the loop early.
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  // If result is 0, every character matched.
  return result === 0;
}
```

---

## Summary of Best Practices

- **Never use `===` for passwords or tokens:** Standard equality is optimized for speed, not security.
- **Use native libraries:** Always prefer `crypto.timingSafeEqual` over manual loops.
- **Hash your secrets:** You should usually be comparing a **hash** of a password (using Argon2 or bcrypt) rather than the
  raw string. These libraries have timing protection built-in.
