import cors from "cors";
import express from "express";

const app = express();

app.use(
  cors({
    origin: [
      "https://fitora-six.vercel.app",
      "https://fitora-git-main-jaytandel27s-projects.vercel.app",
      "https://fitora.vercel.app"
    ],
    credentials: true,
  })
);
