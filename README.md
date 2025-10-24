# EduLib - Class Library Management System

EduLib is a web-based application designed to streamline the management of a school's class library. It provides a simple and efficient way for teachers to request books for their classes and for librarians to manage the library's inventory and loan requests.

## Live Demo

[Link to live demo](https://edulib.example.com) (Note: This is a placeholder link.)

## Features

- **User Authentication:** Secure user registration and login for teachers and librarians.
- **Role-Based Access Control:** Different roles (Teacher, Librarian) have different permissions and views.
- **Book Management:** Librarians can add, update, and delete books from the library's inventory.
- **Book Catalog:** All users can browse and search the book catalog.
- **Loan Requests:** Teachers can request books for their classes.
- **Loan Management:** Librarians can approve, reject, and mark loan requests as returned.
- **Loan History:** Teachers can view their loan history, and librarians can view the loan history of all users.

## Technologies Used

### Backend

- **Node.js:** A JavaScript runtime environment.
- **Express.js:** A web application framework for Node.js.
- **MongoDB:** A NoSQL database.
- **Mongoose:** An object data modeling (ODM) library for MongoDB.
- **JSON Web Tokens (JWT):** For secure user authentication.
- **bcrypt.js:** For hashing user passwords.
- **express-rate-limit:** To prevent brute-force attacks.

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **TypeScript:** A typed superset of JavaScript.
- **Vite:** A fast build tool for modern web projects.
- **Tailwind CSS:** A utility-first CSS framework.
- **axios:** A promise-based HTTP client for the browser and Node.js.

## Getting Started

To get a local copy of the project up and running, follow these simple steps.

### Prerequisites

- Node.js (v14 or later)
- npm
- MongoDB (local installation or a cloud-based service like MongoDB Atlas)

### Installation

1.  **Clone the repository:**

    ```sh
    git clone https://github.com/your-username/edulib.git
    ```

2.  **Install backend dependencies:**

    ```sh
    cd edulib/backend
    npm install
    ```

3.  **Install frontend dependencies:**

    ```sh
    cd ../frontend
    npm install
    ```

### Configuration

1.  **Create a `.env` file in the `backend` directory.**

2.  **Add the following environment variables to the `.env` file:**

    ```
    MONGO_URI=your-mongodb-connection-string
    JWT_SECRET=your-jwt-secret
    JWT_EXPIRES_IN=7d
    ```

    - `MONGO_URI`: Your MongoDB connection string.
    - `JWT_SECRET`: A secret key for signing JWT tokens. It is recommended to use a long, random string.
    - `JWT_EXPIRES_IN`: The expiration time for JWT tokens (e.g., `7d`, `24h`, `60m`).

## Usage

1.  **Start the backend server:**

    ```sh
    cd backend
    npm start
    ```

2.  **Start the frontend development server:**

    ```sh
    cd frontend
    npm run dev
    ```

3.  **Open your browser and navigate to `http://localhost:5173`** (or the port specified in the Vite configuration).

## API Endpoints

The backend provides a RESTful API for managing users, books, and loans. The base URL for the API is `/api`.

### Authentication

- `POST /auth/register`: Register a new user.
- `POST /auth/login`: Log in a user and get a JWT token.
- `GET /auth/me`: Get the current user's information.

### Books

- `GET /books`: Get a list of all books.
- `GET /books/:id`: Get a specific book by its ID.
- `POST /books`: Add a new book (Librarian only).
- `PUT /books/:id`: Update a book (Librarian only).
- `DELETE /books/:id`: Delete a book (Librarian only).

### Loans

- `GET /loans`: Get a list of all loans (Librarian only).
- `GET /loans/my`: Get a list of the current user's loans (Teacher only).
- `GET /loans/:id`: Get a specific loan by its ID.
- `POST /loans`: Request a new loan (Teacher only).
- `PUT /loans/:id/approve`: Approve a loan request (Librarian only).
- `PUT /loans/:id/reject`: Reject a loan request (Librarian only).
- `PUT /loans/:id/return`: Mark a loan as returned (Librarian only).

## Security

The following security measures have been implemented in the application:

- **Password Hashing:** User passwords are not stored in plaintext. Instead, they are hashed using `bcrypt.js`.
- **JWT Authentication:** User authentication is handled using JSON Web Tokens (JWT). The JWT is sent in the `Authorization` header of each request.
- **Role-Based Access Control:** The application uses role-based access control to restrict access to certain endpoints and features based on the user's role (Teacher or Librarian).
- **Input Sanitization:** User input is sanitized to prevent NoSQL injection attacks.
- **Rate Limiting:** The application uses `express-rate-limit` to prevent brute-force attacks on the authentication endpoints.
- **Environment Variables:** Sensitive information, such as the database connection string and JWT secret, is stored in environment variables and not hardcoded in the source code.

## Future Improvements

- **Implement `HttpOnly` cookies for storing JWT tokens:** This would prevent the token from being accessed by client-side scripts, making it more secure against XSS attacks.
- **Implement Cross-Site Scripting (XSS) protection:** Sanitize all user-generated content before it is rendered in the browser.
- **Add more detailed error handling and feedback to the user.**
- **Implement a more advanced search and filtering system for books.**
- **Add the ability for teachers to manage their own class's loan requests.**
- **Add a notification system to inform users about the status of their loan requests.**

## Contact

Sven Fischer - sven2fischer8@gmail.com
