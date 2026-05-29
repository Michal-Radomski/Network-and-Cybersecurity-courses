import { WebSocketServer, WebSocket } from "ws";

// Create a WebSocket server running on port 8080
const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server is running on ws://localhost:8080");

// Listen for new client connections
wss.on("connection", (ws: WebSocket) => {
  console.log("A new client connected!", "ws:", ws);

  // Send an immediate welcome message to the client
  ws.send(JSON.stringify({ type: "WELCOME", message: "Connected to server successfully." }));

  // Listen for messages incoming from this specific client
  ws.on("message", (data: string) => {
    try {
      // Parse the incoming data (assuming JSON structure)
      const parsedData = JSON.parse(data.toString());
      console.log(`Received from client:`, parsedData);

      // Respond back to the client
      ws.send(
        JSON.stringify({
          type: "REPLY",
          message: `Server received your message: ${parsedData.content}`,
        })
      );
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  });

  // Handle client disconnection
  ws.on("close", () => {
    console.log("Client disconnected.");
  });
});
