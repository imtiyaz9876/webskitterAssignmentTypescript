"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const body_parser_1 = __importDefault(require("body-parser"));
const Dbconnector_1 = __importDefault(require("./Helper/Dbconnector"));
const dotenv = __importStar(require("dotenv"));
// import PostRoute from "./Routes/PostRoute";
const UserRoute_1 = __importDefault(require("./Routes/UserRoute"));
const categoryRoutes_1 = __importDefault(require("./Routes/categoryRoutes"));
const questionRoute_1 = __importDefault(require("./Routes/questionRoute"));
const morgan_1 = __importDefault(require("morgan"));
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./middleware/passport"); // Import the function
const app = (0, express_1.default)();
dotenv.config();
app.use((0, helmet_1.default)());
app.use(body_parser_1.default.json());
app.use("/public", express_1.default.static("public"));
app.use((0, morgan_1.default)("dev"));
app.use(passport_1.default.initialize());
(0, passport_2.initializePassport)(passport_1.default); // Call the initialize function
const dbConnectionString = process.env.DB_CONNECION ?? "";
const server_port = process.env.SERVER_PORT ?? "";
(0, Dbconnector_1.default)(dbConnectionString);
// User routes
app.use("/user", UserRoute_1.default);
//category routes
app.use("/category", categoryRoutes_1.default);
// question routes
app.use("/question", questionRoute_1.default);
// 404 response
app.use((_req, res, _next) => {
    res.status(404).send("Resource not found");
});
// Error handling
app.use((error, _req, res, _next) => {
    const status = error.status || 500;
    const message = error.message || "There was an error while processing your request, please try again";
    return res.status(status).send({ status, message });
});
const port = server_port || 5000;
app.listen(port, () => {
    console.log(`Application started on ${port}...`);
});
exports.default = app;
