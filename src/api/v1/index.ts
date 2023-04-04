import express, { Router, Request, Response } from "express";
const router: Router = express.Router();

import auth from "./routes/auth";

router.use("/auth", auth);

router.all("*", (req: Request, res: Response) => {
  res.status(404).send({ message: "Not Found" });
});

export default router;
