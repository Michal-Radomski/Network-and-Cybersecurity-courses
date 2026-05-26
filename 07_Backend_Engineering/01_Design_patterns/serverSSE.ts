import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors());

// Endpoint that serves the real-time event stream
app.get("/api/live-updates", (req: Request, res: Response) => {
  // 1. Set SSE-specific HTTP headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  console.log("Client connected to SSE stream.");

  // 2. Start pushing data to the client at an interval
  const intervalId = setInterval(() => {
    const stockUpdate = {
      ticker: "AAPL",
      price: (150 + Math.random() * 10).toFixed(2),
      timestamp: new Date().toISOString(),
    };

    // CRITICAL: SSE format requires "data: <string>\n\n" to trigger the client event
    res.write(`data: ${JSON.stringify(stockUpdate)}\n\n`);
  }, 3000); // Send updates every 3 seconds

  // 3. Clean up if the client closes the browser tab or disconnects
  req.on("close", () => {
    console.log("Client disconnected from SSE stream.");
    clearInterval(intervalId);
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`SSE Server running on http://localhost:${PORT}`);
});
