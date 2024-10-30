"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const questionSchema = new mongoose_1.default.Schema({
    question: { type: String, required: true },
    categories: [{ type: String, required: true }],
});
questionSchema.index({ categories: 1 });
questionSchema.index({ question: 'text' });
const Question = mongoose_1.default.model('Questions', questionSchema);
exports.default = Question;
