import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dotenv from "dotenv";
dotenv.config();

import apiV1 from "./api/v1";
import { logger } from "./api/middleware/logEvent";

const PORT: string = process.env.PORT || "3000";

const app: Application = express();

app.use(cors({ origin: ["http://localhost:3000"] }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(logger);

app.get("/api", (req: Request, res: Response) => {
  res.send({ message: "Express + TypeScript Server" });
});

app.get("/api/text", (req: Request, res: Response) => {
  const { text } = req.query;
  res.send({ text: text });
});

app.use("/api/v1", apiV1);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT} `);
});
