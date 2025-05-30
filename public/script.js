const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

function appendMessage(log) {
  const item = document.createElement("li");
  item.textContent = `[${log.time}] ${log.text}`;
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  if (input.value) {
    socket.emit("chat message", input.value);
    input.value = "";
  }
});

socket.on("chat history", (logs) => {
  messages.innerHTML = "";
  logs.forEach(appendMessage);
});

socket.on("chat message", appendMessage);
