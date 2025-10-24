import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import BooksPage from "./pages/BooksPage";
import LoansPage from "./pages/LoansPage";
import TeacherLoansPage from "./pages/TeacherLoansPage";
import LibrarianLoansPage from "./pages/LibrarianLoansPage";
import { authAPI, isAuthenticated } from "./lib/api";
import Spinner from "./ui/Spinner";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      await authAPI.getCurrentUser();
      setLoading(false);
    };
    checkUser();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Router>
      <Routes>
        {/* Public route - Login page without layout */}
        <Route
          path="/login"
          element={
            isAuthenticated() ? <Navigate to="/books" replace /> : <LoginPage />
          }
        />

        {/* Protected routes with layout */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Navigate to="/books" replace />} />
                  <Route path="/books" element={<BooksPage />} />
                  <Route path="/loans" element={<LoansPage />} />
                  <Route path="/teacher/loans" element={<TeacherLoansPage />} />
                  <Route
                    path="/librarian/loans"
                    element={<LibrarianLoansPage />}
                  />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
