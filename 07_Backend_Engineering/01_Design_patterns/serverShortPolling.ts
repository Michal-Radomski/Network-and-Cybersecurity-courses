import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

// Mock database to store job status
interface Job {
  id: string;
  status: "pending" | "processing" | "completed";
  progress: number;
}

const jobs: Record<string, Job> = {};

// 1. Endpoint to trigger a long-running task
app.post("/api/jobs", (_req: Request, res: Response) => {
  const jobId: string = Math.random().toString(36).substring(7);

  // Initialize the job
  jobs[jobId] = { id: jobId, status: "pending", progress: 0 };

  // Simulate background processing (takes 6 seconds total)
  let progress = 0;
  const interval = setInterval(() => {
    progress += 34;
    if (progress >= 100) {
      jobs[jobId].status = "completed";
      jobs[jobId].progress = 100;
      clearInterval(interval);
    } else {
      jobs[jobId].status = "processing";
      jobs[jobId].progress = progress;
    }
  }, 3000);

  // Respond immediately with the job ID so the client can start polling
  res.status(202).json({ jobId, message: "Job created. Please poll for status." });
});

// 2. Endpoint that the client will short-poll
app.get("/api/jobs/:id", (req: Request, res: Response) => {
  const jobId = req.params.id as string;
  const job = jobs[jobId];

  if (!job) {
    return res.status(404).json({ error: "Job not found" });
  }

  // Server responds instantly with the current state
  res.json(job);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
