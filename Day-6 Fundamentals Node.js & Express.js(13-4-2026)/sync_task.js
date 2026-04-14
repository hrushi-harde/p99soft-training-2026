const express = require("express");
const app = express();

function task(name, time) {
  console.log(`${name} started`);

  const start = Date.now();
  while (Date.now() - start < time) {} // blocking

  console.log(`${name} finished`);
}

app.get("/sync", (req, res) => {
  console.log("\n--- Synchronous Execution ---");

  task("Task 1", 2000);
  task("Task 2", 2000);
  task("Task 3", 2000);

  res.send("Check terminal for output");
});

app.listen(3000, () => console.log("Sync server running on port 3000"));