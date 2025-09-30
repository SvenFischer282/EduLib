## 🚀 Class Library Management System (CLMS) Description

The **Class Library Management System (CLMS)** is a web-based application designed to streamline the bulk borrowing process for a school library, specifically enabling **class teachers** to efficiently check out and return large quantities of books for their entire classes.

---

### 1. Architectural Overview

* **Model:** Three-Tier Architecture, implemented using the **MERN Stack** (MongoDB, Express.js, React, Node.js).
* **Data Model:** A flexible, document-based approach centered on three main collections:
    * **Users:** Stores roles (`Teacher`, `Librarian`), authentication details, and class assignments.
    * **Books:** Stores catalog data (ISBN, Title, Author) and inventory status (`TotalCopies`, `AvailableCopies`).
    * **ClassLoans:** The core document, detailing the transaction. It embeds an array of **Loan Items** (Book ID, Quantity), Teacher ID, Due Date, and Status (Requested, Active, Overdue, Closed).

---

### 2. Technology Stack

| Tier | Component | Technology | Role/Purpose |
| :--- | :--- | :--- | :--- |
| **Presentation** | Frontend | **React.js** | Single-Page Application (SPA) for dynamic, role-specific user interfaces (Teacher Portal & Librarian Portal). |
| **Application** | Backend API | **Node.js with Express.js** | Provides a robust **RESTful API** to handle business logic, manage authentication via **JWT**, and route all requests. |
| **Data** | Database | **MongoDB** | A NoSQL database used for flexible, scalable storage of catalog and loan transaction data. |
| **Authentication**| Security | **JSON Web Tokens (JWT)** | Stateless, secure authentication and authorization management based on user roles. |

---

### 3. Core Functionality by Role

The application features two distinct user portals, each granting specific permissions governed by the **Authentication & Authorization Service (AAS)**.

#### A. Teacher Portal (Borrower)

The teacher interface is focused on ease of borrowing and tracking.

1.  **Catalog Search & Request:**
    * Teachers can search the entire book inventory (`/api/books`).
    * They create a new `ClassLoan` document by selecting a book and specifying the desired **quantity** (e.g., 30 copies of *The Giver*).
    * The request is submitted with the status `Requested`.
2.  **Loan Tracking Dashboard:**
    * View all current and past loans.
    * The status updates dynamically (e.g., `Active`, `Approved`, `Overdue`).
    * Receive automated in-app or external (email/SMS) notifications regarding due dates and status changes.
3.  **No Direct Inventory Management:** Teachers have read-only access to the inventory service.

#### B. Librarian Portal (Manager)

The librarian interface is focused on inventory control, transaction approval, and auditing.

1.  **Loan Approval Dashboard:**
    * View all `ClassLoan` documents with the status `Requested`.
    * Librarian **approves** or **rejects** the request.
    * **Approval Logic:** Upon approval, the **Loan Management Service (LMS)** checks the **Book Inventory Service (BIS)** availability. If sufficient copies exist, the status is set to `Active`, and the `AvailableCopies` count in the `Books` collection is atomically decremented.
2.  **Inventory Management (CRUD):**
    * Full Create, Read, Update, Delete access to the `Books` collection.
    * Manually log the physical **return** of a class loan. The LMS updates the loan status to `Closed` and atomically increments the `AvailableCopies` count.
3.  **Reporting & Audit:**
    * Generate reports on overdue loans, high-demand books, and historical borrowing patterns.

---

### 4. Key Business Logic and Data Flow

1.  **Loan Initiation (Teacher):**
    * **Action:** Teacher submits a form via React Frontend.
    * **API Call:** `POST /api/loans` (contains Teacher ID, Book ID, Quantity, Due Date).
    * **Database:** A new `ClassLoan` document is created in MongoDB with `Status: Requested`.

2.  **Loan Approval (Librarian):**
    * **Action:** Librarian clicks "Approve" via React Frontend.
    * **API Call:** `PUT /api/loans/:id/approve`.
    * **Database Logic (Transactional):**
        1.  Verify the Librarian's role (Authorization).
        2.  Check `Books` collection availability for the requested quantity.
        3.  If available, update `ClassLoan` status to `Active`.
        4.  Update the corresponding `Books` document: `Books.AvailableCopies = Books.AvailableCopies - Quantity`. **(Crucial: This requires robust concurrency control or atomic operations.)**

3.  **Loan Return (Librarian):**
    * **Action:** Librarian logs the return of the entire class set.
    * **API Call:** `PUT /api/loans/:id/return`.
    * **Database Logic:**
        1.  Update `ClassLoan` status to `Closed`.
        2.  Update the corresponding `Books` document: `Books.AvailableCopies = Books.AvailableCopies + Quantity`.

This structure ensures clear separation of concerns, strong security based on roles, and a resilient, scalable backend built on Node.js and MongoDB.