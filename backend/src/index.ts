import express, { Application, Request, Response } from "express";
import "dotenv/config";
import path from "path";
import ejs from "ejs";
import Routes from "./routes/index";
import fileUpload from "express-fileupload";
const app: Application = express();
const PORT = process.env.PORT || 7000;
const ejsPath = path.resolve(__dirname, "./views");
console.log(ejsPath);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(appLimiter);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);
app.use(express.static("public"));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.use(Routes);

app.get("/", async (req: Request, res: Response) => {
  try {
    const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, {
      name: "Lakshay Nandwani",
    });
    // await sendEmail("gifixan327@motivue.com", "Testing SMTP", html);
    await emailQueue.add(emailQueueName, {
      to: "princeyadav31000@gmail.com",
      subject: "Testing Queue email",
      body: html,
    });
    res.json({ msg: "Email sent successfully" });
  } catch (error) {
    console.log(error);
  }
});

// Queues
import "./jobs/index";
import { emailQueue, emailQueueName } from "./jobs/EmailJob";
import { appLimiter } from "./config/rateLimit";

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
