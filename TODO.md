# Security Vulnerabilities Todo List

This document outlines the security vulnerabilities found in the EduLib application.

## Backend

### Authentication (`auth.controller.js`)

- [x] **Hardcoded JWT Secret:** The JWT secret has a hardcoded fallback value, which is a significant security risk. If the `JWT_SECRET` environment variable is not set, a weak, predictable secret will be used, making it easy to forge tokens.
- [x] **Weak Password Policy:** There is no password complexity enforcement, allowing users to choose weak passwords.
- [x] **User Enumeration:** The registration endpoint confirms whether a username already exists, which can be used to enumerate users.
- [x] **No Input Sanitization:** User input is not sanitized, which could lead to NoSQL injection attacks.

### Loan Management (`loan.controller.js`)

- [x] **Insecure Direct Object Reference (IDOR):** Several endpoints (`getLoanById`, `approveLoan`, `returnLoan`, `rejectLoan`) take a loan ID directly from the request parameters without verifying if the user has the necessary permissions to access or modify the loan.
- [x] **Lack of Authorization:** The `getAllLoans` endpoint exposes all loan data to any authenticated user, regardless of their role.

### Book Management (`book.controller.js`)

- [x] **Missing Authorization:** The `addBook`, `updateBook`, and `deleteBook` endpoints lack authorization checks, allowing any authenticated user to modify the book catalog.
- [x] **NoSQL Injection:** The `getAllBooks` endpoint is vulnerable to NoSQL injection through the use of unsanitized user input in a `$regex` query.
- [x] **Insecure Direct Object Reference (IDOR):** The `getBookById`, `updateBook`, `deleteBook`, and `getBookCover` endpoints take a book ID directly from the request parameters without proper authorization checks.

## Frontend

- [ ] **Missing `HttpOnly` Flag:** The JWT token is stored in local storage, which is accessible to JavaScript. This makes it vulnerable to XSS attacks. The `HttpOnly` flag should be set on the cookie to prevent client-side scripts from accessing it.
- [ ] **Cross-Site Scripting (XSS):** The application does not appear to sanitize user-generated content before rendering it, which could lead to XSS attacks.
- [x] **Lack of Rate Limiting:** There is no rate limiting on the login or registration endpoints, making them vulnerable to brute-force attacks.