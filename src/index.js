const express = require("express");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

const Filter = require("bad-words");

// initialize express server and socket.io
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const {
   generateMessage,
   generateLocationMessage
} = require("./utils/messages");
const {
   addUser,
   removeUser,
   getUser,
   getUsersInRoom
} = require("./utils/users");

const publicDirPath = path.join(__dirname, "../public");

// access public folder
app.use(express.static(publicDirPath));

// server (emit) -> client (receive) - message
// client (emit) -> server (receive) - sendMessage

io.on("connection", socket => {
   socket.on("join", ({ username, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, username, room });
      if (error) {
         return callback(error);
      }

      socket.join(user.room);

      socket.emit(
         "message",
         generateMessage(
            "Admin",
            `Welcome ${user.username} to ${user.room} room!`
         )
      );

      // emit data to everyone connected to the socket
      // except the currently connected one
      socket.broadcast
         .to(user.room)
         .emit(
            "message",
            generateMessage("Admin", `${user.username} has joined!`)
         );

      // populate room with list of user
      io.to(user.room).emit("roomData", {
         room: user.room,
         users: getUsersInRoom(user.room)
      });

      callback();
   });

   socket.on("sendMessage", (message, callback) => {
      const filter = new Filter();
      if (filter.isProfane(message)) {
         return callback("Profanity is not allowed.");
      }

      const user = getUser(socket.id);

      io.to(user.room).emit("message", generateMessage(user.username, message));
      callback();
   });

   socket.on("sendLocation", (geodata, callback) => {
      const user = getUser(socket.id);
      io.to(user.room).emit(
         "locationMessage",
         generateLocationMessage(user.username, geodata)
      );
      callback();
   });

   // tell everyone connected to the socket that
   // a user disconnected from that socket
   socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if (user) {
         io.to(user.room).emit(
            "message",
            generateMessage("Admin", `${user.username} has left!`)
         );
         io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room)
         });
      }
   });
});

// set the port
const port = process.env.PORT || 3000;

// start the server
server.listen(port, () => console.log(`SERVER started at PORT: ${port}`));
