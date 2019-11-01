const socket = io();

// client (emit) -> server (receive) - increment
// server (emit) -> client (receive) - countUpdated

// receive data from client
socket.on("countUpdated", data => {
   console.log("The count has been updated", data);
});

document.querySelector("#increment").addEventListener("click", () => {
   // emit data to server
   socket.emit("increment");
});
