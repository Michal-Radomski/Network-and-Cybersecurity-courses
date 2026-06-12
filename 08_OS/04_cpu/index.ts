import { Worker, isMainThread } from "worker_threads";
import os from "os";

function burnCPU(): void {
  console.log(`Worker ${process.pid} started to load the CPU...`);
  let x = 0;
  while (true) {
    // Perform intense math calculations to prevent compiler optimization
    for (let i = 0; i < 10000000; i++) {
      x += Math.sqrt(Math.random() * 123.45);
    }
  }
}

if (isMainThread) {
  // Get the number of available CPU cores
  const numCPUs = os.cpus().length;
  console.log(`Spawning ${numCPUs} workers to maximize all CPU cores...`);
  console.log("Press Ctrl+C to stop the load test.");

  // Spawn a worker for each CPU core to hit 100% total usage
  for (let i = 0; i < numCPUs; i++) {
    new Worker(__filename);
  }
} else {
  // This runs inside the worker threads
  burnCPU();
}
