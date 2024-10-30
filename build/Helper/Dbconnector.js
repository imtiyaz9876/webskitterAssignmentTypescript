"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
exports.default = (database) => {
    const connect = () => {
        mongoose_1.default
            .connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => console.log(`Database connection successful.....`))
            .catch((error) => {
            console.log("Unable to connect to the db: " + error.message);
            return process.exit(1);
        });
        mongoose_1.default.set("useCreateIndex", true);
    };
    connect();
    mongoose_1.default.connection.on("disconnected", () => {
        console.log(`Db disconnected`);
    });
};
