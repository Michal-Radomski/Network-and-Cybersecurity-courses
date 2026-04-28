Yes, there is an equivalent known as **NoSQL Injection (NoSQLi)**. While MongoDB doesn’t use traditional SQL strings, it is
susceptible to attacks that manipulate the **query structure** or execute **server-side JavaScript**.

Because MongoDB queries are typically built using JSON objects or BSON, an attacker can "inject" malicious operators or
scripts if the application doesn't properly sanitize user input.

---

### 1. Operator Injection (The most common type)

In many web frameworks (like Express for Node.js), user input from a form might be passed directly into a MongoDB query. An
attacker can change the **type** of the input from a string to an object containing MongoDB operators.

**Vulnerable Code Example:**

```javascript
// A simple login query
db.users.find({ username: req.body.username, password: req.body.password });
```

**The Attack:** Instead of sending a string for the password, the attacker sends a JSON object: `{"$ne": null}` (meaning "not
equal to null").

**The Resulting Query:**

```javascript
db.users.find({ username: "admin", password: { $ne: null } });
```

The database looks for a user named "admin" where the password is "anything except null." Since almost every user has a
password, the attacker successfully bypasses the login without knowing the password.

---

### 2. JavaScript Injection (SSJI)

MongoDB has operators like `$where` and functions like `mapReduce` that allow you to run server-side JavaScript. If user
input is concatenated into these strings, it’s exactly like a classic SQL injection.

**Vulnerable Code Example:**

```javascript
db.collection.find({ $where: "this.name == '" + userInput + "'" });
```

**The Attack:** If an attacker provides the input: `'; sleep(5000); var d = '`

**The Resulting Query:**

```javascript
db.collection.find({ $where: "this.name == ''; sleep(5000); var d = ''" });
```

This would cause the database server to pause for 5 seconds (a Denial of Service test) or could be used to exfiltrate data.

---

### 3. Comparison of SQL vs. NoSQL Injection

| Feature                | SQL Injection           | NoSQL (MongoDB) Injection      |
| :--------------------- | :---------------------- | :----------------------------- |
| **Target**             | SQL Query Strings       | JSON/BSON Query Objects        |
| **Key Characters**     | `'`, `--`, `;`, `UNION` | `$`, `{`, `}`, `[`             |
| **Logic Manipulation** | `OR 1=1`                | `{"$gt": ""}`, `{"$ne": null}` |
| **Execution**          | Database Engine         | Application Layer or JS Engine |

---

### How to Prevent It

1.  **Sanitize Input:** Use libraries like `mongo-sanitize` for Node.js. It strips out any keys starting with `$`.
2.  **Use Object Data Mappers (ODM):** Tools like **Mongoose** allow you to define schemas. If a field expects a `String` and
    the attacker sends an `Object` (like `{$ne: null}`), Mongoose will cast it to a string or throw an error, neutralizing
    the attack.
3.  **Avoid `$where`:** Try to use standard query operators ($eq, $match, etc.) instead of server-side JavaScript.
4.  **Disable Server-Side Scripting:** If you don't need JavaScript execution, you can disable it in the MongoDB
    configuration:
    ```yaml
    security:
      javascriptEnabled: false
    ```

---

---

In Node.js, the most common way to prevent NoSQL injection is to ensure that user-provided input is never allowed to remain
an **Object** when it should be a **String**.

Here is how you can secure your Node.js application using two different approaches.

---

### 1. The Manual Way: `mongo-sanitize`

If you are using the native MongoDB driver, you should use a middleware or utility to "clean" the `req.body`, `req.query`, or
`req.params`. The `mongo-sanitize` library recursively searches objects and deletes any keys that begin with a `$`.

**Installation:** `npm install mongo-sanitize`

**Implementation:**

```javascript
const sanitize = require("mongo-sanitize");
const express = require("express");
const app = express();

app.post("/login", (req, res) => {
  // If the attacker sent { "password": { "$ne": null } }
  // sanitize() will turn it into { "password": null }
  const username = sanitize(req.body.username);
  const password = sanitize(req.body.password);

  db.collection("users").findOne({ username, password }, (err, user) => {
    // Now safe from operator injection
  });
});
```

---

### 2. The Structured Way: Mongoose (ODM)

Using **Mongoose** is the most effective defense because it enforces a strict **Schema**. If your schema defines a field as a
`String`, Mongoose will automatically cast any incoming object into a string.

**Secure Code with Mongoose:**

```javascript
const mongoose = require("mongoose");

// Define the Schema
const userSchema = new mongoose.Schema({
  username: String,
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/login", async (req, res) => {
  try {
    // Even if req.body.password is { "$ne": null }
    // Mongoose casts it to the literal string: "[object Object]"
    const user = await User.findOne({
      username: req.body.username,
      password: req.body.password,
    });

    if (user) {
      res.send("Logged in!");
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Server error");
  }
});
```

---

### Comparison of the Attack vs. The Fix

| Input State  | Attacker Payload            | Native Driver Result               | Mongoose Result (Secure)            |
| :----------- | :-------------------------- | :--------------------------------- | :---------------------------------- |
| **Raw JSON** | `{"password": {"$ne": ""}}` | Logic becomes "Not equal to empty" | Casts to string `"[object Object]"` |
| **Outcome**  | Bypass Authentication       | **Success (Vulnerable)**           | **Failure (Protected)**             |

### Best Practices Summary

- **Avoid `JSON.parse()` on user input:** Never manually parse strings from users directly into query objects.
- **Validate Types:** Use a validation library like **Joi** or **Zod** to ensure that `req.body.username` is actually a
  string before it hits your database logic.
- **Use `allowDiskUse: false`:** While not directly injection-related, it prevents attackers from running resource-heavy
  queries that could crash your Node.js process.
