
    const express = require("express");
    const app = express();

    const server = require("http").createServer(app);
    const { Server } = require("socket.io");
    const { addUser } =  require("./user/users")
     

    const io = new Server(server);


    //Routes
    app.get("/", (req,res) => {
        res.send("This is backend for whiteboard")
    });

    let roomIdGlobal,imgURLGlobal;

    io.on("connection", (socket) => {
        socket.on("userJoined",(data) => {
            const{name, userId, roomId, host, presenter} = data;
            roomIdGlobal = roomId
            socket.join(roomId) ;
            const users = addUser(data);
            socket.emit("userIsJoined", { success:true, users});
            socket.broadcast.to(roomId).emit("userJoinedMessage", name);
            socket.broadcast.to(roomId).emit("allUsers",users);
            socket.broadcast.to(roomId).emit("whiteBoardDataResponse",{
                imgURL : imgURLGlobal,
            })
        })

        socket.on("whiteboardData", (data) => {
            imgURLGlobal = data;
            socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse",{
                imgURL:data, 
            });
        });

        

        });


    const port = process.env.PORT || 5000;
    server.listen(port, () => console.log("Server is running"));
