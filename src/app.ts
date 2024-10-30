import express from "express";
import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import connectorDb from "./Helper/Dbconnector";
import * as dotenv from "dotenv";
import UserRoute from "./Routes/UserRoute";
import categoryRoute from "./Routes/categoryRoutes";
import question_route from "./Routes/questionRoute";
import morgan from "morgan";
import passport from "passport";
import { initializePassport } from "./middleware/passport";
import rateLimit from "express-rate-limit"; 

const app = express();

dotenv.config();

app.use(helmet());
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.use(morgan<Request, Response>("dev"));
app.use(passport.initialize());
initializePassport(passport);

const dbConnectionString: string = process.env.DB_CONNECION ?? "";
const server_port = process.env.SERVER_PORT ?? "";

connectorDb(dbConnectionString);

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 3, 
  message: "Too many request so please wait some time",
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// User routes
app.use("/user", UserRoute);
// Category routes
app.use("/category", categoryRoute);
// Question routes
app.use("/question", question_route);

// 404 response
app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).send("Resource not found");
});

// Error handling
app.use((error: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || "There was an error while processing your request, please try again";
  return res.status(status).send({ status, message });
});

// Define a custom error type for uncaught exceptions and unhandled rejections
interface CustomError {
  name?: string;
  message?: string;
}

// Uncaught Exception and Unhandled Rejection handlers
process.on("uncaughtException", (err: unknown) => {
  const error = err as CustomError; // Type assertion to CustomError
  console.error("Uncaught Exception occurred! Shutting down...");
  console.error(error.name || "Unknown Error", error.message || "No message available");
  process.exit(1);
});

process.on("unhandledRejection", (err: unknown) => {
  const error = err as CustomError; // Type assertion to CustomError
  console.error("Unhandled Rejection occurred! Shutting down...");
  console.error(error.name || "Unknown Error", error.message || "No message available");
  server.close(() => {
    process.exit(1);
  });
});

const port = server_port || 5000;
const server = app.listen(port, () => {
  console.log(`Application started on ${port}...`);
});

export default app;
