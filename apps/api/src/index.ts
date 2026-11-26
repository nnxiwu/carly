import "dotenv/config";
import express from "express";
import { errorHandler, notFound } from "./middleware/errorHandler";
import { authRouter } from "./routes/auth";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({status: "ok"})
});

app.use("/auth", authRouter)

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
})