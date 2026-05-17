import net from "net";

// Create the server instance
const server = net.createServer((socket: net.Socket) => {
  console.log("Client connected.");
  console.log("TCP handshake successful with " + socket.remoteAddress + ":" + socket.remotePort);

  // Send a welcome message to the client
  socket.write("Welcome to the Node.js TCP Server!\n");

  // Handle incoming data from the client
  socket.on("data", (data) => {
    console.log(`Received from client: ${data.toString().trim()}`);

    // Echo the data back to the client
    socket.write(`Server echoed: ${data}`);
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log("Client disconnected.");
  });

  // Handle socket errors
  socket.on("error", (err) => {
    console.error(`Socket error: ${err.message}`);
  });
});

// Start listening on port 3000
server.listen(3000, "127.0.0.1", () => {
  console.log("TCP Server is listening on 127.0.0.1:3000");
});
