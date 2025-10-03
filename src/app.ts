/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Application, Request, Response, NextFunction } from "express";
import httpStatus from "http-status";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

const app: Application = express();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/v1", router);

//Testing
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.OK).json({
    success: true,
    message: "Welcome to Kickoff Node TS",
  });
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use(notFound);

export default app;