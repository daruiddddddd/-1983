const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

let chatLog = [];
let clearClicks = {};

io.on("connection", (socket) => {
  const ip = socket.handshake.headers["x-forwarded-for"]?.split(",")[0] || socket.handshake.address;

  socket.emit("chat history", chatLog);

  socket.on("chat message", (msg) => {
    const jstTime = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    const log = { time: jstTime, ip, text: msg };
    chatLog.push(log);
    if (chatLog.length > 100) chatLog.shift();
    io.emit("chat message", log);
  });

  socket.on("clear chat", () => {
    if (!clearClicks[ip]) clearClicks[ip] = 0;
    clearClicks[ip]++;
    if (clearClicks[ip] >= 5) {
      chatLog = [];
      clearClicks = {};
      io.emit("chat cleared");
    } else {
      socket.emit("click count", 5 - clearClicks[ip]);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("listening on *:" + PORT);
});
