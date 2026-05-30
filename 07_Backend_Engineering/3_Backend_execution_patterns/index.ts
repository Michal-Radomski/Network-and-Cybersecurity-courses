import { Worker, isMainThread, parentPort } from "node:worker_threads";

if (isMainThread) {
  // This is the Main Thread. Spin up a worker thread.
  // const worker = new Worker(__filename);
  const worker = new Worker(new URL(import.meta.url));

  // Listen for the result from the worker thread
  worker.on("message", (result) => {
    console.log(`The heavy CPU math result is: ${result}`);
  });
} else {
  // This code runs inside the isolated Worker Thread!
  let heavyCalculation = 0;
  for (let i = 0; i < 1e9; i++) {
    heavyCalculation += i;
  }

  // Send the data back to the main thread
  parentPort?.postMessage(heavyCalculation);
}
