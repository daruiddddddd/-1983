const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let chatLog = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.emit("chat history", chatLog);

  socket.on("chat message", (msg) => {
    const timestamp = new Date().toLocaleTimeString("ja-JP", { hour12: false });
    const log = { time: timestamp, text: msg };
    chatLog.push(log);
    if (chatLog.length > 100) chatLog.shift();
    io.emit("chat message", log);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});
