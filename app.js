import { Server } from "socket.io";

import dotenv from 'dotenv'; // library to use .env file

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
    },
});

let onlineUser = []; // user online

const addUser = (userId, socketId) => {
    const userExists = onlineUser.find((user) => user.userId === userId);
    if (!userExists) {
        onlineUser.push({ userId, socketId });
    }

    console.log(onlineUser);
};

const removeUser = (socketId) => {
    onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
    return onlineUser.find((user) => user.userId === userId); // gert user by id
};

io.on("connection", (socket) => {
    socket.on("newUser", (userId) => {
        addUser(userId, socket.id); // add user by userId and socket id
    });

    socket.on("sendMessage", ({ receiverId, data }) => {
        const receiver = getUser(receiverId);
        
        // Check if receiver is defined
        if (receiver) {
            io.to(receiver.socketId).emit("getMessage", data); // send the message to the reciver 
        } else {
            console.error(`Receiver with userId ${receiverId} not found`);
        }
    });

    socket.on("disconnect", () => {
        removeUser(socket.id); 
    });
});


dotenv.config();

const PORT = process.env.PORT ; // user the port 8080 or 6013

console.log(PORT)

io.listen(PORT, () => {
    console.log(`Io is running on port ${PORT}`);
});
