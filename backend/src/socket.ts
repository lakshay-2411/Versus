import { Server } from "socket.io";
import { votingQueue, votingQueueName } from "./jobs/VotingJob";
import { commentQueue, commentQueueName } from "./jobs/CommentJob";

export function setupSocket(io: Server) {
  io.on("connection", (socket) => {
    console.log("A user connected", socket.id);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });

    // Listen events
    socket.onAny(async (eventName: string, data: any) => {
      if (eventName.startsWith("versus-")) {
        console.log("Vote data is: ", data);
        await votingQueue.add(votingQueueName, data);
        socket.broadcast.emit(`versus-${data?.versusId}`, data);
      } else if (eventName.startsWith("versus_comment-")) {
        console.log("Comment data is: ", data);
        await commentQueue.add(commentQueueName, data);
        socket.broadcast.emit(`versus_comment-${data?.id}`, data);
      }
    });
  });
}
