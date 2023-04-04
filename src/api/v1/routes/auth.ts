import express, { Router } from "express";
const router: Router = express.Router();

import auth from "../controllers/auth.controller";

router.post("/", auth.handleLogin);

export default router;
