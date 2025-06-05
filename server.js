const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

// Grid design
let grid = Array.from({ length: 10 }, () => Array(10).fill(false));
let userCount = 0;

// socket

io.on("connection", (socket) => {
  userCount++;
  io.emit("userCount", userCount);
  socket.emit("gridState", grid);

  socket.on("toggleCell", ({ row, col }) => {
    grid[row][col] = !grid[row][col];
    io.emit("gridState", grid);
  });

  socket.on("disconnect", () => {
    userCount--;
    io.emit("userCount", userCount);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
