import { Server } from "socket.io";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("A used connected", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
}
