const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

// initialize express server and socket.io
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const publicDirPath = path.join(__dirname, "../public");

// access public folder
app.use(express.static(publicDirPath));

// server (emit) -> client (receive) - message
// client (emit) -> server (receive) - sendMessage

io.on("connection", socket => {
   const welcomeMessage = "Welcome!";
   socket.emit("message", welcomeMessage);

   // emit data to everyone connected to the socket
   // except the currently connected one
   socket.broadcast.emit("message", "A new user has joined!");

   socket.on("sendMessage", data => {
      io.emit("message", data);
   });

   socket.on("sendLocation", data => {
      io.emit(
         "message",
         `https://google.com/maps?q=${data.latitude},${data.longitude}`
      );
   });

   // tell everyone connected to the socket that
   // a user disconnected from that socket
   socket.on("disconnect", () => {
      io.emit("message", "User has left");
   });
});

// set the port
const port = process.env.PORT || 3000;

// start the server
server.listen(port, () => console.log(`SERVER started at PORT: ${port}`));
