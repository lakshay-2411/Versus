import express, { Application, Request, Response } from "express";
import "dotenv/config";
import path from "path";
import Routes from "./routes/index";
import fileUpload from "express-fileupload";
import cors from "cors";
import helmet from "helmet";
import { Server } from "socket.io";
import { createServer, Server as httpServer } from "http";
import { appLimiter } from "./config/rateLimit";
import { setupSocket } from "./socket";
// Registers the BullMQ queues and workers (email, voting, comments)
import "./jobs/index";

const PORT = process.env.PORT || 7000;
const app: Application = express();
// Running behind a reverse proxy (Render): needed for correct client IPs in rate limiting
app.set("trust proxy", 1);
const server: httpServer = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_APP_URL,
  },
});

export { io };
setupSocket(io);

app.use(express.json());
app.use(
  helmet({
    // Uploaded images are loaded cross-origin by the Vercel frontend
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use(express.static("public"));
app.use(appLimiter);

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use(Routes);

app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
