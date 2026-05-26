import axios from "axios";

const SERVER_URL = "http://localhost:3000/api/messages";

async function startLongPolling(): Promise<void> {
  let lastTimestamp = 0;
  console.log("Connected to chat. Waiting for messages...");

  while (true) {
    try {
      // Send a request and wait... (this call could take up to 30 seconds to resolve)
      const response = await axios.get(SERVER_URL, {
        params: { since: lastTimestamp },
        timeout: 35000, // Ensure client timeout is slightly higher than server timeout
      });

      const newMessages = response.data;

      if (newMessages.length > 0) {
        newMessages.forEach((msg: { text: string; timestamp: number }) => {
          console.log(`[New Message]: ${msg.text}`);
          // Update timestamp to ensure we only get *newer* messages next time
          lastTimestamp = Math.max(lastTimestamp, msg.timestamp);
        });
      } else {
        // Server timed out with no new messages; loop restarts smoothly
        console.log("[Poll Timeout] No new updates. Reconnecting...");
      }
    } catch (error: any) {
      console.error("Connection error, retrying in 5 seconds...", error.message);
      // Wait before retrying to prevent bashing the server if it goes down
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}

startLongPolling();
