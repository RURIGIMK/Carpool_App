import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State to manage error messages
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            setUser(user);
            setError(""); // Clear error message on successful login
            // Redirect based on user role
            if (user.username === "admin") {
              navigate("/admindashboard"); // Redirect to Admin Dashboard
            } else if (user.is_driver) {
              navigate("/driverdashboard"); // Redirect to Driver Dashboard
            } else {
              navigate("/userdashboard"); // Redirect to User Dashboard
            }
          });
        } else {
          response.json().then((errorData) => {
            setError(errorData.message || "Login failed. Please try again.");
          });
        }
      })
      .catch(() => {
        setError("Network error. Please check your connection and try again.");
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-8 lg:px-16 dark:bg-gray-800">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md w-full max-w-xs sm:max-w-sm lg:max-w-md dark:bg-gray-700">
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
            Login
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              aria-label="username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              aria-label="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
