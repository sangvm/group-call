import express from "express"
import http from "http"
import { Server } from "socket.io";
import cors from "cors"
import { RoomHandler } from "./room";

const port = 8080;
const app = express()
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST" ],
    }
});

io.on("connection", (socket) => {
    console.log("User is connected");

    RoomHandler(socket);

    socket.on("disconnect", () => {
        console.log("User is disconnected");
    })
})

server.listen(port, () => {
    console.log(`Listening to server at port: ${port}`); // tslint:disable-next-line:no-console
})