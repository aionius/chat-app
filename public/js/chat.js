const socket = io();

// elements
const $messageForm = document.querySelector("#formMsg");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $geolocationButton = document.querySelector("#btnLocation");
const $messages = document.querySelector("#messages");

// templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationMessageTemplate = document.querySelector(
   "#location-message-template"
).innerHTML;

// options
const { username, room } = Qs.parse(location.search, {
   ignoreQueryPrefix: true
});

// client (emit) -> server (receive) - sendMessage
// server (emit) -> client (receive) - message

socket.on("message", message => {
   console.log(message);
   const html = Mustache.render(messageTemplate, {
      message: message.text,
      createdAt: moment(message.createdAt).format("hh:mm A")
   });
   $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", geodata => {
   console.log(geodata);
   const html = Mustache.render(locationMessageTemplate, {
      url: geodata.url,
      createdAt: moment(geodata.createAt).format("hh:mm A")
   });
   $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", event => {
   event.preventDefault();

   // disable submit button
   $messageFormButton.setAttribute("disabled", "disabled");

   const msg = event.target.elements.msg.value;

   socket.emit("sendMessage", msg, error => {
      // enable button after sending the message
      $messageFormButton.removeAttribute("disabled");

      // remove the value from the input field and set
      // focus into it
      $messageFormInput.value = "";
      $messageFormInput.focus();

      if (error) {
         return console.log(error);
      }
      console.log("Message delivered!");
   });
});

$geolocationButton.addEventListener("click", event => {
   event.preventDefault();

   if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
   }

   // disable button just before getting the current location
   $geolocationButton.setAttribute("disabled", "disabled");

   navigator.geolocation.getCurrentPosition(position => {
      socket.emit(
         "sendLocation",
         {
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
         },
         () => {
            // enable button when acknowledgement is received
            $geolocationButton.removeAttribute("disabled");
            console.log("Location shared!");
         }
      );
   });
});

socket.emit("join", { username, room });
