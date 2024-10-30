import express from "express";
import { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import bodyParser from "body-parser";
import connectorDb from "./Helper/Dbconnector";
import * as dotenv from "dotenv";
// import PostRoute from "./Routes/PostRoute";
import UserRoute from "./Routes/UserRoute";
import categoryRoute from "./Routes/categoryRoutes";
import question_route from "./Routes/questionRoute";
import morgan from "morgan";
import passport from "passport";
import { initializePassport } from "./middleware/passport"; // Import the function

const app = express();

dotenv.config();

app.use(helmet());
app.use(bodyParser.json());
app.use("/public", express.static("public"));
app.use(morgan<Request, Response>("dev"));
app.use(passport.initialize());
initializePassport(passport); // Call the initialize function

const dbConnectionString: string = process.env.DB_CONNECION ?? "";
const server_port = process.env.SERVER_PORT ?? "";

connectorDb(dbConnectionString);

// User routes
app.use("/user", UserRoute);
//category routes
app.use("/category", categoryRoute);
// question routes
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

const port = server_port || 5000;
app.listen(port, () => {
  console.log(`Application started on ${port}...`);
});

export default app;
