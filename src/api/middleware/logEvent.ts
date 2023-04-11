import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { promises as fsPromises } from "fs";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

import path from "path";

const logEvents = async (message: string, logName: string) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuidv4()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "../../../", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "../../../", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "../../../", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req: Request, res: Response, next: NextFunction) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logger, logEvents };
