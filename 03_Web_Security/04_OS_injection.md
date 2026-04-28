**Command Injection** (also known as OS Injection) occurs when an application passes unsafe user-supplied data (forms,
cookies, HTTP headers) to a system shell. An attacker can use this to execute arbitrary operating system commands on the
server running the application.

This is often considered more dangerous than SQL Injection because it grants the attacker direct access to the server's
operating system, potentially leading to a total system compromise.

---

## How It Works

Many programming languages have functions that allow the developer to execute system commands (e.g., `exec()`, `system()`, or
`child_process.exec()` in Node.js). If the input to these functions isn't strictly controlled, an attacker can use "shell
metacharacters" like `;`, `&`, `|`, or `&&` to chain their own commands.

### The Vulnerable Code (Node.js/Express)

Imagine an app that lets an admin check if a website is up:

```javascript
const { exec } = require("child_process");

app.get("/ping", (req, res) => {
  let url = req.query.url;
  // Dangerous: Concatenating user input directly into a shell command
  exec(`ping -c 4 ${url}`, (error, stdout) => {
    res.send(stdout);
  });
});
```

### The Attack

An attacker doesn't provide a simple URL. They provide: `google.com; cat /etc/passwd`

The server executes: `ping -c 4 google.com; cat /etc/passwd`

The semicolon (`;`) tells the Linux shell: "Finish the first command, then start the next one." The server will ping Google
and then happily send the attacker the system's sensitive user file.

---

## How to Prevent Command Injection

### 1. Avoid Shell Execution (Primary Defense)

The best way to prevent command injection is to never call OS commands directly. Most languages have built-in APIs that
perform the same task without involving a shell.

- **Instead of:** Calling `mkdir` via `exec()`.
- **Do this:** Use the language's filesystem library (e.g., `fs.mkdir()` in Node.js).

### 2. Use Argument Arrays (Parameterized Calls)

If you **must** run an external program, use functions that take arguments as an array rather than a single string. This
prevents the shell from interpreting metacharacters.

**Secure Node.js Example:**

```javascript
const { spawn } = require("child_process");

// Secure: The shell is not involved, so ';' is treated as part of the URL string
const child = spawn("ping", ["-c", "4", req.query.url]);
```

### 3. Strict Input Validation (Allow-listing)

Only allow characters that are absolutely necessary. If you expect an IP address, use a Regular Expression to ensure the
input contains **only** numbers and dots.

```javascript
const regex = /^[0-9.]+$/;
if (!regex.test(req.query.url)) {
  return res.status(400).send("Invalid Input");
}
```

### 4. Escape Shell Characters

If you cannot avoid using a shell string, you must escape all special characters (like `&`, `|`, `;`, `$`, `>`, etc.).
However, this is difficult to get right across different operating systems (Windows vs. Linux) and is generally discouraged.

---

## Comparison: SQLi vs. Command Injection

| Feature           | SQL Injection           | Command Injection                   |
| :---------------- | :---------------------- | :---------------------------------- |
| **Target**        | Database Engine         | Operating System                    |
| **Injected Into** | SQL Query               | Shell Command                       |
| **Impact**        | Data theft/modification | Full server takeover                |
| **Primary Fix**   | Parameterized Queries   | Use built-in APIs / Argument arrays |

---

---

The `system()` command is a built-in function found in many programming languages (C, C++, Python, PHP, Ruby, etc.) that
allows a program to execute a command as if it were typed directly into the operating system's terminal or command prompt.

When you call `system()`, your program pauses, starts a "shell" (like `/bin/sh` on Linux or `cmd.exe` on Windows), runs the
command you provided, and then returns control back to your program once the command finishes.

---

## How it Works Internally

Technically, calling `system("ls")` on a Linux machine performs a few specific steps:

1.  **Forks:** It creates a new process (a "child" process).
2.  **Executes Shell:** It runs the system's default shell.
3.  **Passes String:** It passes your string to that shell to be interpreted.
4.  **Returns:** It returns the "exit status" (usually `0` for success) to your main program.

---

## Examples Across Languages

### In C++

```cpp
#include <iostream>
#include <cstdlib>

int main() {
    // This tells the OS to list files in the current directory
    system("ls -la");
    return 0;
}
```

### In Python

```python
import os
# This tells Windows to open the calculator
os.system("calc.exe")
```

---

## Why it is "Dangerous"

In modern software development, `system()` is often discouraged for several major reasons:

### 1. Security (Command Injection)

As we discussed earlier, if you include user input inside a `system()` call, an attacker can use characters like `;` or `&`
to run their own malicious code. Because `system()` invokes a shell, it will interpret those special characters.

### 2. Lack of Portability

A command that works on Linux (`ls`) will fail on Windows (`dir`). If you use `system()`, your code is tied to a specific
operating system.

### 3. Performance

Starting an entirely new shell process is "expensive" for the computer. It uses more memory and CPU time than using a
language's built-in library (like using Python's `os.listdir()` instead of `system("ls")`).

### 4. Limited Control

`system()` usually only returns the success/fail code. If you want to capture the actual text output of the command to use in
your program, you usually have to use more advanced functions like `popen()` or `child_process.exec()`.

---

## The "Secure" Alternatives

If you need to interact with the OS, look for these "shell-less" alternatives:

- **File Operations:** Instead of `system("rm file.txt")`, use `unlink("file.txt")`.
- **Directory Listings:** Instead of `system("ls")`, use `opendir()`.
- **Executing Programs:** Use functions that bypass the shell and take arguments as an array (like `execve` in C or
  `subprocess.run(["ls", "-l"])` in Python).

---

---

In Node.js, there isn't a single function named `system()`, but the functionality is handled by the **`child_process`**
module.

Because Node.js is asynchronous by nature, it provides several ways to achieve this, depending on whether you want the
"dangerous" shell version or the "secure" direct version.

---

## 1. The "Dangerous" Equivalent: `exec()`

This is the closest match to `system()`. It spawns a shell and executes the command string you provide.

- **Behavior:** It buffers the entire output in memory.
- **Security Risk:** Highly vulnerable to **Command Injection** if you include user input.

```javascript
const { exec } = require("child_process");

// Runs in a shell (/bin/sh or cmd.exe)
exec("ls -lh", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  console.log(`Output: ${stdout}`);
});
```

---

## 2. The "Secure" Equivalent: `execFile()`

This is what you should use if you are running an external program. It does **not** spawn a shell by default.

- **Behavior:** You pass the command and the arguments as an **array**.
- **Security:** Because there is no shell, characters like `;` or `&` are treated as literal text, not command separators.

```javascript
const { execFile } = require("child_process");

// No shell involved. Arguments are isolated.
execFile("node", ["--version"], (error, stdout) => {
  console.log(stdout);
});
```

---

## 3. The "Pro" Equivalent: `spawn()`

For long-running processes or large amounts of data, `spawn` is the best choice.

- **Behavior:** It uses **Streams**. It sends data back in chunks rather than waiting for the process to finish.
- **Use Case:** Running a web server, a long build process, or streaming video/audio.

```javascript
const { spawn } = require("child_process");

const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => {
  console.log(`Chunk: ${data}`);
});
```

---

## 4. The "Blocking" Equivalent: `execSync()`

If you need your Node.js app to **stop and wait** until the command is finished (exactly like the original C++ `system()`
command), use the Sync versions.

- **Warning:** This blocks the entire Node.js event loop. No other users can connect to your server until this command
  finishes. Use sparingly!

```javascript
const { execSync } = require("child_process");

try {
  const output = execSync("uptime");
  console.log(output.toString());
} catch (error) {
  console.error("Command failed");
}
```

---

## Summary Table

| Node.js Function | Shell? | Data Handling         | Safety                   |
| :--------------- | :----- | :-------------------- | :----------------------- |
| **`exec()`**     | Yes    | Buffer (Whole string) | **Low** (Injection Risk) |
| **`execFile()`** | No     | Buffer (Whole string) | **High**                 |
| **`spawn()`**    | No     | Stream (Chunks)       | **High**                 |
| **`execSync()`** | Yes    | Blocks Loop           | **Low**                  |

### Recommendations for your Express/PM2 App:

- **Avoid `exec`** if the command includes anything a user typed.
- **Use `spawn` or `execFile`** for better performance and security.
- **Never use `execSync`** in a route handler (like `app.get(...)`), or your website will freeze for every other user while
  that one command runs!

---

---

The main difference between `exec()` and `spawn()` lies in **how they handle data** and **whether they use a shell**. Think
of `exec()` as a "one-and-done" buffer, while `spawn()` is a continuous "stream."

---

## 1. `exec()`: The Buffered Approach

When you use `exec()`, Node.js runs the command and waits until it is completely finished. It then collects all the output
(stdout and stderr) and puts it into a single buffer.

- **Output:** Returns a buffer (usually a string).
- **Shell:** It **spawns a shell** (like `/bin/sh` or `cmd.exe`). This makes it easy to use pipes (`|`) or redirects (`>`) in
  your command string.
- **Limit:** Since it stores the output in memory, it has a default limit (usually 1MB). If your command generates 2MB of
  text, `exec()` will crash with an "Error: maxBuffer exceeded."

**Best for:** Small, quick commands where you just need the final result (e.g., checking a version number or a simple file
count).

---

## 2. `spawn()`: The Streaming Approach

`spawn()` is designed for heavy lifting. It sends data back to your main Node.js process in small chunks while the command is
still running.

- **Output:** Returns a **Stream**. You can listen to the `data` event and process it piece by piece.
- **Shell:** By default, it **does not spawn a shell**. You must provide the command and the arguments separately. This makes
  it significantly more secure against injection attacks.
- **Limit:** There is no buffer limit because the data isn't stored; it just passes through.

**Best for:** Large amounts of data, long-running processes, or when security is a priority (e.g., image processing,
streaming video, or running a secondary server).

---

## Key Comparison Table

| Feature               | `exec()`                                                     | `spawn()`                                          |
| :-------------------- | :----------------------------------------------------------- | :------------------------------------------------- |
| **Data Handling**     | **Buffered:** Waits for completion, returns a single string. | **Streaming:** Sends data in chunks as it happens. |
| **Shell Environment** | **Yes:** Spawns a shell by default.                          | **No:** Executes the binary directly.              |
| **Arguments**         | Passed as part of one long string.                           | Passed as an array of strings.                     |
| **Performance**       | Slower (Shell overhead + memory buffering).                  | Faster (Direct execution + memory efficient).      |
| **Max Data Size**     | Limited by `maxBuffer` (default ~1MB).                       | Theoretically unlimited.                           |

---

## Quick Code Comparison

### `exec()` Example

```javascript
const { exec } = require("child_process");

// Easy to write, but captures everything at once
exec("ls -lh /usr", (error, stdout, stderr) => {
  console.log(stdout); // The entire list prints at once
});
```

### `spawn()` Example

```javascript
const { spawn } = require("child_process");

// More verbose, but much more efficient for large directories
const ls = spawn("ls", ["-lh", "/usr"]);

ls.stdout.on("data", (data) => {
  console.log(`Received a chunk: ${data}`); // Prints as the data arrives
});
```

### Which should you use for your React/Express app?

If you are running a script via a route in your Express backend, **use `spawn()`** or **`execFile()`**. They are safer
because they don't involve the shell, meaning an attacker can't easily chain malicious commands using `;` or `&&`.
