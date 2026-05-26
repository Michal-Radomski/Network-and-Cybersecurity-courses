import WebSocket, { WebSocketServer } from "ws";

// Create a WebSocket server listening on port 8080
const wss = new WebSocketServer({ port: 8080 });
console.log("Push server is running on ws://localhost:8080");

// Event: Triggered whenever a new client connects
wss.on("connection", (ws: WebSocket) => {
  console.log("A new client connected!");

  ws.send(JSON.stringify({ message: "Welcome to the real-time push server!" }));

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});

// Simulate a backend data change every 3 seconds and PUSH it to all clients
setInterval(() => {
  const payload = {
    event: "SERVER_UPDATE",
    timestamp: new Date().toISOString(),
    systemLoad: Math.random().toFixed(2), // Simulating real-time metrics
  };
  console.log("Pushing updates to clients...");

  // Broadcast the payload to every connected client
  wss.clients.forEach((client: WebSocket) => {
    // Make sure the connection is still open before sending
    if (client.readyState === 1) {
      client.send(JSON.stringify(payload));
    }
  });
}, 3000);
