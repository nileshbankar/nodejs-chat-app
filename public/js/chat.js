const socket = io();

const inputMessage = document.querySelector("#message");
const form = document.querySelector("#message-form");
const btnSendMessage = document.querySelector("#btnSendMessage");
const btnSendLocation = document.querySelector("#send-location");

const messages = document.querySelector("#messages");

// Template
const messagesTemplate = document.querySelector("#message-template").innerHTML;
const locationtemplate = document.querySelector("#location-template").innerHTML;
const roomTemplate = document.querySelector("#room-template").innerHTML;

// Query strings
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
const autoScroll = () => {
  // New message element
  const $newMessage = messages.lastElementChild;
  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messages.offsetHeight;

  // Height of messages container
  const containerHeight = messages.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

socket.on("message", (message) => {
  const html = Mustache.render(messagesTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });

  messages.insertAdjacentHTML("beforeend", html);

  autoScroll();
});

socket.on("roomData", (room) => {
  const html = Mustache.render(roomTemplate, {
    room: room.room,
    users: room.users,
  });

  document.querySelector("#sidebar").innerHTML = html;
  autoScroll();
});

socket.on("locationMessage", (url) => {
  const html = Mustache.render(locationtemplate, {
    username: url.username,
    url: url.url,

    createdAt: moment(message.createdAt).format("h:mm a"),
  });

  messages.insertAdjacentHTML("beforeend", html);
});

document.querySelector("#message-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const message = inputMessage.value;

  btnSendMessage.setAttribute("disabled", "disabled");

  socket.emit("sendMessage", message, (error) => {
    if (error) {
      return console.log(error);
    }

    inputMessage.value = "";
    inputMessage.focus();
    btnSendMessage.removeAttribute("disabled");
  });
});

document.querySelector("#send-location").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser.");
  }

  btnSendLocation.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        console.log("Location shared!");

        btnSendLocation.removeAttribute("disabled");
      }
    );
  });
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);

    location.href = "/";
  }
});
