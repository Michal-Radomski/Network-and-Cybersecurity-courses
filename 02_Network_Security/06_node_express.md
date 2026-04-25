Express.js and Node.js primarily use TCP (Transmission Control Protocol) for their core functionality. [1, 2]

## Express.js: TCP via HTTP [3]

Express.js is built specifically for creating HTTP servers. Since the HTTP protocol sits directly on top of TCP, Express runs
on TCP by default. [4, 5, 6, 7, 8]

- When you call app.listen(), Express uses the built-in [Node.js net module](https://nodejs.org/api/dgram.html) to create a
  TCP server under the hood.
- Every request in Express has an underlying TCP socket (accessible via req.socket) that manages the reliable, ordered
  delivery of data. [9, 10]

## Node.js: Supports Both [11, 12]

While Express is strictly web-focused (TCP), Node.js is a general-purpose runtime that gives you access to both protocols
through its built-in modules: [10, 13, 14, 15]

| Feature [16, 17, 18, 19, 20, 21, 22] | TCP Support                                            | UDP Support                                                      |
| ------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------- |
| Node.js Module                       | net                                                    | dgram                                                            |
| Typical Use                          | Web servers (Express), Databases, File Transfers.      | Video streaming, DNS, VoIP, Online gaming.                       |
| Reliability                          | High: Guarantees data arrives in order and error-free. | Low: "Fire and forget"; data may be lost or arrive out of order. |

In short: If you are building a standard website or API with Express, you are using TCP. You would only use UDP in Node.js if
you were building something where speed is more important than perfect accuracy, like a live voice chat or a game server. [1,
19, 23, 24, 25]

[1]
[https://www.freecodecamp.org](https://www.freecodecamp.org/news/understand-how-expressjs-works-by-building-your-own-server-multiplexer-from-scratch/)
[2] [https://medium.com](https://medium.com/@ohad2712/introduction-to-http-in-node-js-0011e49bd718) [3]
[https://www.reddit.com](https://www.reddit.com/r/node/comments/1014xjb/with_expressjs_you_need_not_worry_about_low_level/#:~:text=From%20a%20low%20level%20perspective%2C%20Express%20%28,itself%20uses%20the%20low%20level%20TCP%20protocol.)
[4]
[https://stackoverflow.com](https://stackoverflow.com/questions/42479008/what-protocol-is-served-from-express-applications)
[5] [https://medium.com](https://medium.com/@ohad2712/introduction-to-http-in-node-js-0011e49bd718) [6]
[https://developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview#:~:text=HTTP%20therefore%20relies%20on%20the%20TCP%20standard%2C,connection%2C%20a%20process%20which%20requires%20several%20round%2Dtrips.)
[7]
[https://medium.com](https://medium.com/@mohammad1105/tcp-vs-udp-when-to-use-what-and-how-tcp-relates-to-http-b6fbb10713f5#:~:text=Relationship%20Between%20HTTP%20and%20TCP%20Here%27s%20the,insight:%20HTTP%20runs%20on%20top%20of%20TCP.)
[8] [https://dev.to](https://dev.to/crit3cal/tcp-vs-udp-low-level-network-internals-behind-your-api-calls-1mk6) [9]
[https://nodevibe.substack.com](https://nodevibe.substack.com/p/tcp-and-nodejs-server-internals-a) [10]
[https://www.linkedin.com](https://www.linkedin.com/posts/alitte_nodejs-expressjs-nestjs-activity-7393539171761451008-_4mk)
[11] [https://www.youtube.com](https://www.youtube.com/watch?v=4yPnp4k8VMA) [12]
[https://os-system.com](https://os-system.com/blog/node-js-android-app-right-choice-for-backend/) [13]
[https://codenameuriel28.medium.com](https://codenameuriel28.medium.com/the-file-system-in-node-js-e87b6965edf8#:~:text=Until%20Node%20%28%20Node.js%20%29%20%2C%20Javascript,can%20be%20used%20across%20various%20application%20domains.)
[14]
[https://itstheanurag.medium.com](https://itstheanurag.medium.com/creating-a-server-in-nodejs-b1afa287dbdd#:~:text=To%20create%20a%20server%20in%20Nodejs%2C%20we,we%20will%20mainly%20focus%20on%20TCP%20servers.)
[15] [https://www.educative.io](https://www.educative.io/blog/is-expressjs-a-framework) [16]
[https://nodevibe.substack.com](https://nodevibe.substack.com/p/tcp-and-nodejs-server-internals-a) [17]
[https://dev.to](https://dev.to/kernelrb/tcp-vs-udp-with-nodejs-examples-43oc) [18]
[https://www.cosmiclearn.com](https://www.cosmiclearn.com/js/nodejs_tcp_udp.php) [19]
[https://www.youtube.com](https://www.youtube.com/watch?v=0EnarrwxTDc&t=16) [20]
[https://dev.to](https://dev.to/sudiip__17/-networking-capabilities-of-nodejs-a-complete-developers-guide-2hj7) [21]
[https://www.luisllamas.es](https://www.luisllamas.es/en/tcp-communication-nodejs/) [22]
[https://eytanmanor.medium.com](https://eytanmanor.medium.com/implementing-http-over-udp-in-node-js-385b67800182) [23]
[https://www.reddit.com](https://www.reddit.com/r/node/comments/qgtknc/tcp_functionality_alongside_express_http/) [24]
[https://www.raysync.io](https://www.raysync.io/news/tcp-over-udp/#:~:text=UDP%20is%20preferred%20in%20many%20online%20activities,downloading%20a%20file%20or%20transferring%20business%20data.)
[25]
[https://www.linkedin.com](https://www.linkedin.com/pulse/tcp-vs-udp-what-every-developer-should-know-davit-gasparyan-6hxwf#:~:text=%E2%9A%A1%20Use%20UDP%20when:%20Speed%20is%20more,games%2C%20voice%20or%20video%20calls%2C%20live%20streams)

---

In Node.js, the built-in [dgram module](https://nodejs.org/api/dgram.html) is used to create UDP datagram sockets. Unlike TCP
servers, which use .listen(), UDP servers use .bind() to start listening for incoming packets. [1, 2, 3, 4]

## Simple UDP Example

Below is a basic implementation of a server that "echoes" received messages and a client that sends a greeting. [5, 6]

## 1. The Server (server.js)

The server creates a socket, listens for a message event, and sends a reply back to the sender's specific port and address.
[5, 7]

const dgram = require('dgram');const server = dgram.createSocket('udp4'); // Use 'udp4' for IPv4

server.on('message', (msg, rinfo) => { console.log(`Server received: ${msg} from ${rinfo.address}:${rinfo.port}`);

// Echo the message back to the client const response = Buffer.from(`Echo: ${msg}`); server.send(response, rinfo.port,
rinfo.address); });

server.on('listening', () => { const address = server.address();
console.log(`Server listening on ${address.address}:${address.port}`); });

server.bind(41234); // Bind to port 41234

## 2. The Client (client.js)

The client creates its own socket and uses .send() to transmit a buffer to the server's port. [6, 7]

const dgram = require('dgram');const client = dgram.createSocket('udp4'); const message = Buffer.from('Hello UDP Server');

client.send(message, 41234, 'localhost', (err) => { if (err) { console.error('Failed to send message:', err); } else {
console.log('Message sent!'); } }); // Listen for the server's response client.on('message', (msg, rinfo) => {
console.log(`Client received: ${msg} from ${rinfo.address}:${rinfo.port}`); client.close(); // Close the client after
receiving the echo });

## Key Differences from TCP

- No Handshake: There is no client.connect() or "connection established" event; the client just starts sending data.
- Connectionless: Each packet is independent. The server doesn't "keep a connection open" for a specific user.
- Unreliable: If a packet is lost in the network, Node.js will not automatically try to send it again. [3, 8, 9, 10]

[1] [https://nodejs.org](https://nodejs.org/api/dgram.html) [2] [https://bun.com](https://bun.com/reference/node/dgram) [3]
[https://nodevibe.substack.com](https://nodevibe.substack.com/p/udp-in-nodejs-deep-technical-guide) [4]
[https://nodejs.org](https://nodejs.org/download/release/v6.3.0/docs/api/dgram.html) [5]
[https://oneuptime.com](https://oneuptime.com/blog/post/2026-03-20-udp-server-nodejs-dgram-ipv4/view) [6]
[https://www.geeksforgeeks.org](https://www.geeksforgeeks.org/node-js/nodejs-udpdatagram-module/) [7]
[https://egenedy.hashnode.dev](https://egenedy.hashnode.dev/udp-in-nodejs-application) [8]
[https://www.youtube.com](https://www.youtube.com/watch?v=1l_5-y_7nTA) [9]
[https://github.com](https://github.com/bipinparajuli/bipin-blog/blob/master/data/blog/create-udp-clinet-and-server-with-node.js.md)
[10] [https://medium.com](https://medium.com/@farhad.gulizada/udp-datagram-in-node-js-intermediate-series-e671f64e21ff)
