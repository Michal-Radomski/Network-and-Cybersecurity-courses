import WebSocket from "ws";

// Connect to the push server
const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  console.log("Connected to server. Waiting for pushes...");
});

// Event: Triggered automatically whenever the server pushes data
ws.on("message", (data) => {
  const parsedData = JSON.parse(data.toString());
  console.log("Received Push Notification:", parsedData);
});
