const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const Filter = require("bad-words");
const filter = new Filter();

// initialize express server and socket.io
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {
   generateMessage,
   generateLocationMessage
} = require("./utils/messages");

const publicDirPath = path.join(__dirname, "../public");

// access public folder
app.use(express.static(publicDirPath));

// server (emit) -> client (receive) - message
// client (emit) -> server (receive) - sendMessage

io.on("connection", socket => {
   socket.on("join", ({ username, room }) => {
      socket.join(room);

      socket.emit("message", generateMessage("Welcome!"));

      // emit data to everyone connected to the socket
      // except the currently connected one
      socket.broadcast
         .to(room)
         .emit("message", generateMessage(`${username} has joined!`));
   });

   socket.on("sendMessage", (message, callback) => {
      if (filter.isProfane(message)) {
         return callback("Profanity is not allowed.");
      }

      io.to("Newton").emit("message", generateMessage(message));
      callback();
   });

   socket.on("sendLocation", (geodata, callback) => {
      io.emit("locationMessage", generateLocationMessage(geodata));
      callback();
   });

   // tell everyone connected to the socket that
   // a user disconnected from that socket
   socket.on("disconnect", () => {
      io.emit("message", generateMessage("A user has left"));
   });
});

// set the port
const port = process.env.PORT || 3000;

// start the server
server.listen(port, () => console.log(`SERVER started at PORT: ${port}`));
