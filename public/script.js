const socket = io();
const form = document.getElementById("form");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
const clearButton = document.getElementById("clear");
const cancelButton = document.getElementById("cancel");
const status = document.getElementById("status");

function appendMessage(log) {
  const item = document.createElement("li");
  item.textContent = `[${log.time}] (${log.ip}) ${log.text}`;
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

clearButton.addEventListener("click", () => {
  socket.emit("clear chat");
});

cancelButton.addEventListener("click", () => {
  input.value = "";
  status.textContent = "✖️ 入力は取り消されました";
});

socket.on("chat history", (logs) => {
  messages.innerHTML = "";
  logs.forEach(appendMessage);
});

socket.on("chat message", appendMessage);

socket.on("chat cleared", () => {
  messages.innerHTML = "";
  status.textContent = "✅ チャット履歴が全て消去されました。";
});

socket.on("click count", (remaining) => {
  status.textContent = `🕒 あと ${remaining} 回で履歴が全消去されます。`;
});
