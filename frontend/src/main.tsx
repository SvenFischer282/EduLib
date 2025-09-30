import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppLayout } from "./ui/AppLayout";
import { BooksPage } from "./pages/BooksPage";
import { TeacherLoansPage } from "./pages/TeacherLoansPage";
import { LibrarianLoansPage } from "./pages/LibrarianLoansPage";
import "./styles.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <BooksPage /> },
      { path: "teacher/loans", element: <TeacherLoansPage /> },
      { path: "librarian/loans", element: <LibrarianLoansPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
