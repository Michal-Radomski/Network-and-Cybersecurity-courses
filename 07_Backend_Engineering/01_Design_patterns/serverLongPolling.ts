import express, { Request, Response } from "express";

const app = express();
app.use(express.json());
const PORT = 3000;

// A simple interface to track waiting clients
interface WaitingClient {
  res: Response;
  lastSeenTimestamp: number;
}

// In-memory storage for messages and open connections
const messages: { text: string; timestamp: number }[] = [];
let waitingClients: WaitingClient[] = [];

// 1. Endpoint for clients to get updates (Long Polling)
app.get("/api/messages", (req: Request, res: Response) => {
  const clientLastTimestamp = Number(req.query.since) || 0;

  // Check if there are already newer messages available
  const newMessages = messages.filter((msg) => msg.timestamp > clientLastTimestamp);

  if (newMessages.length > 0) {
    // If data exists, respond immediately
    return res.json(newMessages);
  }

  // If NO new data, hold the connection open by saving the 'res' object
  const client: WaitingClient = { res, lastSeenTimestamp: clientLastTimestamp };
  waitingClients.push(client);

  // Set a timeout (e.g., 30 seconds) so the connection doesn't hang indefinitely
  const timeoutId = setTimeout(() => {
    // Remove the client from the waiting list
    waitingClients = waitingClients.filter((c) => c !== client);
    // Respond with an empty array, prompting the client to reconnect
    if (!res.headersSent) {
      res.json([]);
    }
  }, 30000);

  // If the client disconnects prematurely, clean up resources
  req.on("close", () => {
    clearTimeout(timeoutId);
    waitingClients = waitingClients.filter((c) => c !== client);
  });
});

// 2. Endpoint to send a new message (Triggers the "Push")
app.post("/api/messages", (req: Request, res: Response) => {
  const { text } = req.body;
  const newMessage = { text, timestamp: Date.now() };

  messages.push(newMessage);

  // Alert all waiting clients immediately with the new message
  waitingClients.forEach((client) => {
    if (!client.res.headersSent) {
      client.res.json([newMessage]);
    }
  });

  // Clear the waiting list since they have all been answered
  waitingClients = [];

  res.status(201).json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Long polling server running on http://localhost:${PORT}`);
});
