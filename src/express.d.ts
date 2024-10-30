// src/@types/express.d.ts
import * as express from 'express';

// Extend the Express namespace
declare global {
    namespace Express {
        // Extend the Request interface
        interface Request {
            file?: express.Multer.File; // Define the 'file' property as optional
        }
    }
}
