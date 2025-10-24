import React, { useState } from "react";
import {
  authAPI,
  isAuthenticated,
} from "../lib/api";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "Teacher",
    classAssignment: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      window.location.replace("/books");
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;

      if (isLogin) {
        response = await authAPI.login(formData.username, formData.password);
      } else {
        response = await authAPI.register(
          formData.username,
          formData.password,
          formData.role,
          formData.role === "Teacher" ? formData.classAssignment : undefined
        );
      }

      // The user is now set in the in-memory cache by authAPI.login/register
      // Redirect to books page
      window.location.replace("/books");
    } catch (error) {
      console.error("Auth error:", error);
      setError(error.response?.data?.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (username, password) => {
    setFormData({ ...formData, username, password });
    setIsLoading(true);
    setError("");

    try {
      await authAPI.login(username, password);
      window.location.replace("/books");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "2rem auto",
        padding: "2rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
        {isLogin ? "Login" : "Register"}
      </h2>

      {/* Quick Login Buttons */}
      <div style={{ marginBottom: "2rem" }}>
        <h4>Quick Login (Test Users):</h4>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <button
            onClick={() => quickLogin("teacher1", "password123")}
            disabled={isLoading}
            style={{
              padding: "0.5rem",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Teacher 1 (Class 1A)
          </button>
          <button
            onClick={() => quickLogin("librarian1", "password123")}
            disabled={isLoading}
            style={{
              padding: "0.5rem",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Librarian 1
          </button>
        </div>
      </div>

      <hr style={{ margin: "1.5rem 0" }} />

      {/* Manual Login/Register Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Username:
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Password:
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            style={{
              width: "100%",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxSizing: "border-box",
            }}
          />
        </div>

        {!isLogin && (
          <>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Role:
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  boxSizing: "border-box",
                }}
              >
                <option value="Teacher">Teacher</option>
                <option value="Librarian">Librarian</option>
              </select>
            </div>

            {formData.role === "Teacher" && (
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Class Assignment:
                </label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    {[...Array(4)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                  <select
                    value={classLetter}
                    onChange={(e) => setClassLetter(e.target.value)}
                    style={{
                      flex: 1,
                      padding: "0.5rem",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                    }}
                  >
                    {["A", "B", "C", "D"].map((letter) => (
                      <option key={letter} value={letter}>
                        {letter}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div
            style={{
              color: "red",
              marginBottom: "1rem",
              padding: "0.5rem",
              backgroundColor: "#fee",
              border: "1px solid #fcc",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "0.75rem",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "1rem",
          }}
        >
          {isLoading ? "Please wait..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            background: "none",
            border: "none",
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin ? "Need to register?" : "Already have an account?"}
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
