import cors from "cors";

app.use(
  cors({
    origin: [
      "https://fitora-six.vercel.app", // ✅ main Vercel domain
      "https://fitora-git-main-jaytandel27s-projects.vercel.app", // ✅ preview deployments
    ],
    credentials: true,
  })
);
