const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);

const io = require("socket.io")(server)

app.use(express.static(path.join(__dirname+"/public")));

io.on("connection", function(socket){
    socket.on("newuser",function(fullusr){
        socket.broadcast.emit("update", fullusr + " has joined.");
    });

    socket.on("exituser",function(username){
        socket.broadcast.emit("update", username + " left the chatroom");
    });

    socket.on("chat",function(message){
        socket.broadcast.emit("chat", message);
    });
});


server.listen(4999);