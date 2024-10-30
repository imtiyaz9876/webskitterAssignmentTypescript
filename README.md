# webskitterAssignmentTypescript

## Overview
This project implements a MongoDB database and a set of RESTful APIs using TypeScript to manage users, categories, and questions. It includes functionalities for user authentication, profile management, category management, and bulk question addition.

## Technologies Used
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- CSV Parser
- Joi (for validation)

## Database Structure
The database consists of the following collections:
1. **Users**
   - Fields: `name`, `email`, `mobile`, `gender`, `password`, `image`, `role`

2. **Categories**
   - Fields: `name`, `description`

3. **Questions**
   - Fields: `content`, `categories` (array of category IDs)

   ## Setup Instructions
 **Clone the Repository**
 
   git clone git@github.com:imtiyaz9876/webskitterAssignmentTypescript.git
   cd repo-name
   npm install
   npm start
   postmanCollectionLink=https://documenter.getpostman.com/view/30345969/2sAY4vghY6