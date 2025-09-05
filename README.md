# Freakyfashion

Freakyfashion is a fictional e-commerce web application built with **React** for the frontend and **Express + SQLite** for the backend. The project was initially started in a JavaScript 2 course and further developed in a Backend 1 course, focusing on adding full backend functionality and advanced features.

## Features

### Frontend
- Product listing and category pages
- Product detail pages
- Shopping cart functionality
- Favorites / Wishlist system
- User authentication (login, registration, profile)
- Order confirmation and order history
- Admin pages for managing products and categories
- Responsive UI with hero section, spots section, and interactive menus
- Dynamic counters for cart items and favorites

### Backend
- RESTful API built with Express
- SQLite database with tables for users, products, categories, favorites, carts, and orders
- User authentication and session handling
- Admin middleware to protect admin routes
- Image upload functionality with Multer
- Full CRUD for categories and products
- Endpoints for cart, favorites, and orders

## Tech Stack

### Frontend
- React & Vite
- JavaScript (ES6+)
- React Router
- Context API
- CSS
- React Icons
- React-Slick & Slick-Carousel (for sliders/carousels)
- React-Toastify (for notifications)
- ESLint with React plugins (for code linting and standards)

### Backend
- Node.js
- Express
- SQLite & Better SQLite3 (database)
- Connect-SQLite3 (session store for Express-session)
- Express-session (for session handling)
- Multer (for file uploads)
- Bcrypt (for password hashing)
- CORS (for cross-origin requests)
- Nodemon

### Other / Tools
- Fetch API (frontend-backend communication)
- Modern ES6+ syntax used throughout

## Getting Started

Follow these steps to get the project up and running locally:

1. Clone the repository:

git clone https://github.com/m-hellberg/Backend-utveckling1-Freakyfashion

Navigate to the project folder:

```bash
cd Freakyfashion
```
Install dependencies:

```bash
cd server
npm install

cd ../client
npm install
```
Running the Project

Start frontend and backend servers in separate terminals:

Terminal 1 (Frontend):

```bash
cd client
npm run dev
```
Terminal 2 (Backend):

```bash
cd server
npm run dev
```
Open your browser and visit http://localhost:3000

Database Setup

The database files (freakyfashion.db and sessions.db) are not included in the repository.
Instead, you can create your own local database by running the db.sql script through Node.js and Better SQLite3. This ensures everyone has a clean setup and avoids committing binary database files to version control.

Steps to set up the database:

Make sure you are in the server folder:

```bash
cd server
```
Run the database initialization script:

```bash
node initDB.js
```
The script will create freakyfashion.db if it does not already exist and execute all SQL statements from db.sql.

## License
This project is licensed under the MIT License.
