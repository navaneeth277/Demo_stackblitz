const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://j4jl6y-3000.csb.app",
    methods: ["GET", "POST"],
  },
});

let activeUsers = new Map(); // Track active users with socket IDs

app.get("/", (req, res) => {
  res.send("Socket.io chat server running");
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("setUserName", (name) => {
    activeUsers.set(socket.id, name); // Add the user to activeUsers
    io.emit("activeUsers", Array.from(activeUsers.values())); // Broadcast updated user list
    console.log(`${name} joined the chat`);
  });

  socket.on("chatMessage", (msg) => {
    const userName = activeUsers.get(socket.id) || "Anonymous";
    io.emit("chatMessage", { user: userName, message: msg });
  });

  socket.on("disconnect", () => {
    const userName = activeUsers.get(socket.id);
    activeUsers.delete(socket.id); // Remove user from activeUsers
    io.emit("activeUsers", Array.from(activeUsers.values())); // Broadcast updated user list
    console.log(`${userName} disconnected`);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
