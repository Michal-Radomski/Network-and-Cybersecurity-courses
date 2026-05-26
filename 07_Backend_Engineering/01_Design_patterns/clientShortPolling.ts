import axios from "axios";

const SERVER_URL = "http://localhost:3000/api/jobs";
const POLLING_INTERVAL_MS = 3000;

interface JobResponse {
  id: string;
  status: "pending" | "processing" | "completed";
  progress: number;
}

async function pollJobStatus(jobId: string): Promise<void> {
  console.log(`Started polling for Job: ${jobId}`);

  // Set up the short polling interval
  const intervalId = setInterval(async () => {
    try {
      // Send a request to check current status
      const response = await axios.get<JobResponse>(`${SERVER_URL}/${jobId}`);
      const { status, progress } = response.data;

      console.log(`[Poll] Status: ${status} | Progress: ${progress}%`);

      // Break condition: Stop polling once the job is completed
      if (status === "completed") {
        console.log("🎉 Task successfully finished! Stopping polling.");
        clearInterval(intervalId);
      }
    } catch (error) {
      console.error("Error during polling:", error);
      clearInterval(intervalId); // Clear interval on severe errors to avoid infinite loops
    }
  }, POLLING_INTERVAL_MS);
}

async function startWorkflow(): Promise<void> {
  try {
    // 1. Kick off the task
    const initResponse = await axios.post<{ jobId: string }>(SERVER_URL);
    const jobId = initResponse.data.jobId;

    // 2. Begin short polling
    pollJobStatus(jobId);
  } catch (error) {
    console.error("Failed to start workflow:", error);
  }
}

startWorkflow();
