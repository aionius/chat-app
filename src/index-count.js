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

let count = 0;

// server (emit) -> client (receive) - countUpdated
// client (emit) -> server (receive) - increment

io.on("connection", socket => {
   // emit data to client
   socket.emit("countUpdated", count);

   // receive from client
   socket.on("increment", () => {
      count++;
      // this will only emit to a specific connection
      // io.emit connects to all connected clients
      // socket.emit("countUpdated", count);
      io.emit("countUpdated", count);
   });
});

// set the port
const port = process.env.PORT || 3000;

// start the server
server.listen(port, () => console.log(`SERVER started at PORT: ${port}`));
