// Define the structure of our expected messages for type safety
interface SocketMessage {
  type: "WELCOME" | "REPLY";
  message: string;
}

// Establish connection to the TypeScript server
const socket = new WebSocket("ws://localhost:8080");

// Event: Connection opened
socket.addEventListener("open", (event) => {
  console.log("event:", event);
  console.log("Connected to the server!");

  // Send a payload to the server
  const payload = { content: "Hello Server! 🚀" };
  socket.send(JSON.stringify(payload));
});

// Event: Listen for messages from the server
socket.addEventListener("message", (event: MessageEvent) => {
  try {
    // Parse the data incoming from the server
    const data: SocketMessage = JSON.parse(event.data);

    console.log(`Message from server [Type: ${data.type}]: ${data.message}`);
  } catch (error) {
    console.error("Error parsing server message:", error);
  }
});

// Event: Handle connection closure
socket.addEventListener("close", () => {
  console.log("Disconnected from the server.");
});

// Event: Handle errors
socket.addEventListener("error", (error) => {
  console.error("WebSocket Error:", error);
});
