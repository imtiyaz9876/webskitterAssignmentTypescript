import mongoose, { Document, Schema } from 'mongoose';

interface IQuestion extends Document {
    question: string;
    categories: string[];
}

const questionSchema: Schema = new mongoose.Schema({
    question: { type: String, required: true },
    categories: [{ type: String, required: true }],
});

questionSchema.index({ categories: 1 });
questionSchema.index({ question: 'text' });

const Question = mongoose.model<IQuestion>('Questions', questionSchema);
export default Question;
