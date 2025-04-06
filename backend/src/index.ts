import express, { Application, Request, Response } from "express";
import "dotenv/config";
import path from "path";
import ejs from "ejs";
import Routes from "./routes/index";
const app: Application = express();
const PORT = process.env.PORT || 7000;
const __dirname = path.resolve();
console.log(__dirname);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));

// Routes
app.use(Routes);

app.get("/", async (req: Request, res: Response) => {
  try {
    const html = await ejs.renderFile(__dirname + `/views/emails/welcome.ejs`, {
      name: "Lakshay Nandwani",
    });
    // await sendEmail("gifixan327@motivue.com", "Testing SMTP", html);
    await emailQueue.add(emailQueueName, {
      to: "cilej26221@movfull.com",
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
