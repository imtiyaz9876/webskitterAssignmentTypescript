import express, { Router } from 'express';
import bodyParser from 'body-parser';
import * as categoryController from "../Controllers/categoryController";
const categoryRoute: Router = express.Router();
// Middleware setup
categoryRoute.use(bodyParser.urlencoded({ extended: true }));
categoryRoute.use(bodyParser.json());
categoryRoute.use(express.static('public'));
// Routes
categoryRoute.post('/createCategory', categoryController.createCategory);
categoryRoute.get('/getAllCategory', categoryController.getAllCategory);
export default categoryRoute;
