const socket = io();

const urlSearch = new URLSearchParams(window.location.search);

const username = urlSearch.get("username");
const room = urlSearch.get("select_room");

socket.emit("select_room", {
  username,
  room
}, (messages) => {
  const messageDiv = document.getElementById("messages");

  messages.forEach((message) => {
    generateMessageOnScreen(messageDiv, message);
  })
});

const messageDiv = document.getElementById("username");
messageDiv.innerHTML = `
  Olá ${username} - ${room}
`


document.getElementById("message_input").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const message = event.target.value;

    socket.emit("message", {
      room,
      username,
      message
    })

    event.target.value = "";
  }
});

socket.on("message", data => {
  const messageDiv = document.getElementById("messages");
  generateMessageOnScreen(messageDiv, data)
})

function goBack() {
  window.location.href = "/";
}

function generateMessageOnScreen(elementHtml, data) {
  messageDiv.innerHTML += `
  <div class="new_message">
    <label class="form-label">
      <strong>${data.username}</strong>
      <span>${data.message} - ${dayjs(data.createdAt).format("DD/MM HH:mm")}</span>
    </label>
  </div>
`
}