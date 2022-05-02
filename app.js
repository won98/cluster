const express = require("express");
const http = require("http");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const process = require("process");
const { workerData } = require("worker_threads");

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);
  const worker = cluster.fork();
  //worker.send("이게 뭐임?");

  for (let i = 0; i < numCPUs; i++) {
    // cluster.fork().on("disconnect", () => {
    //   console.log("disconnect:", process.pid);
    cluster.fork().on("message", (msg, handle) => {
      console.log("message:", msg);
    });
    // });
    //console.log(worker);
  }
  //   cluster.on("exit", (worker, code, single) => {
  //     console.log(`worker ${worker.process.pid} died`);
  //   });
} else {
  http
    .createServer((req, res) => {
      res.writeHead(200);
      res.end("Hello World\n");
    })
    .listen(8000);
  process.send("from worker");

  console.log(`Worker ${process.pid} started`);
}
