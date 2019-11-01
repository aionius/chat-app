const socket = io();

// client (emit) -> server (receive) - sendMessage
// server (emit) -> client (receive) - message

socket.on("message", data => {
   console.log(data);
});

document.querySelector("#formMsg").addEventListener("submit", event => {
   event.preventDefault();
   const msg = event.target.elements.msg.value;

   socket.emit("sendMessage", msg);
});

document.querySelector("#btnLocation").addEventListener("click", event => {
   event.preventDefault();

   if (!navigator.geolocation) {
      return alert("Geolocation is not supported by your browser.");
   }

   navigator.geolocation.getCurrentPosition(position => {
      const location = {
         longitude: position.coords.longitude,
         latitude: position.coords.latitude
      };

      socket.emit("sendLocation", location);
   });
});
