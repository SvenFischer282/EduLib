import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AppLayout } from "./ui/AppLayout";
import { BooksPage } from "./pages/BooksPage";
import { TeacherLoansPage } from "./pages/TeacherLoansPage";
import { LibrarianLoansPage } from "./pages/LibrarianLoansPage";
import LoginPage from "./pages/LoginPage";
import { isAuthenticated } from "./lib/api";
import "./styles.css";

// Protected route loader function
const protectedLoader = () => {
  if (!isAuthenticated()) {
    throw new Response("", {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  }
  return null;
};

// Login route loader function
const loginLoader = () => {
  if (isAuthenticated()) {
    throw new Response("", {
      status: 302,
      headers: {
        Location: "/books",
      },
    });
  }
  return null;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    loader: loginLoader,
  },
  {
    path: "/",
    element: <AppLayout />,
    loader: protectedLoader,
    children: [
      {
        index: true,
        element: <Navigate to="/books" replace />,
      },
      {
        path: "books",
        element: <BooksPage />,
        loader: protectedLoader,
      },
      {
        path: "teacher/loans",
        element: <TeacherLoansPage />,
        loader: protectedLoader,
      },
      {
        path: "librarian/loans",
        element: <LibrarianLoansPage />,
        loader: protectedLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
