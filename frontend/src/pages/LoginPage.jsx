
import React, { useState } from 'react';

const LoginPage = () => {
  const [userId, setUserId] = useState('');

  const handleLogin = () => {
    // In a real application, you would make an API call to authenticate the user.
    // For this mock version, we'll just store the user ID in local storage.
    if (userId) {
      localStorage.setItem('userId', userId);
      alert(`Logged in as ${userId}`);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <p>Select a user to log in:</p>
      <select onChange={(e) => setUserId(e.target.value)} value={userId}>
        <option value="">Select User</option>
        <option value="teacher123">Teacher (teacher123)</option>
        <option value="librarian456">Librarian (librarian456)</option>
      </select>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
