// async.js
const express = require("express");
const app = express();

function task(name, time) {
  console.log(`${name} started`);

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`${name} finished`);
      resolve();
    }, time);
  });
}

app.get("/async", async (req, res) => {
  console.log("\n--- Asynchronous Execution ---");

  const t1 = task("Task 1", 3000);
  const t2 = task("Task 2", 1000);
  const t3 = task("Task 3", 2000);

  await Promise.all([t1, t2, t3]);

  res.send("Check terminal for output");
});

app.listen(3000, () => console.log("Async server running "));