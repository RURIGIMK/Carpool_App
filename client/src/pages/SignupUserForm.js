import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function SignupUserForm({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isDriver, setIsDriver] = useState(false); // State to check if user is a driver or not
  const [isDriverSelected, setIsDriverSelected] = useState(false); // State to check if user is a driver or not
  const [error, setError] = useState(""); // State for error messages
  const [image, setImage] = useState(""); 

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("Password does not match");
      return;
    }

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
        is_driver: isDriver,
        image // Add profile picture field if desired
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((user) => {
            setUser(user);
            setError(""); // Clear error message on successful signup

            // Redirect based on whether the user is a driver
            if (user.is_driver) {
              navigate("/driverdashboard"); // Redirect to Driver Dashboard
            } else {
              navigate("/userdashboard"); // Redirect to User Dashboard
            }
          });
        } else {
          response.json().then((errorData) => {
            setError("Entered the wrong password"); // Set error message if signup fails
          });
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again."); // Handle network errors
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 sm:px-8 lg:px-16 dark:bg-gray-800">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
            Sign Up
          </h1>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="password_confirmation"
              className="block text-gray-700 font-semibold mb-2"
            >
              Password Confirmation
            </label>
            <input
              type="password"
              id="password_confirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <label
              htmlFor="isDriver"
              className="block text-gray-700 font-semibold mb-2 mr-14"
            >
              Sign up as a driver?
            </label>
            {!isDriverSelected && (
              <select
                id="isDriver"
                value={isDriver}
                onChange={(e) => {
                  setIsDriver(e.target.value === "true");
                  // setIsDriverSelected(true); // This will hide the dropdown after selection
                }}
                className="w-32 px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Sign Up
          </button>
         
          <p className="mt-4 text-center">
            Already have an account? &nbsp;
            <Link to="/login">
              <button
                type="button"
                className="w-full sm:w-32 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
              >
                Log In
              </button>
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupUserForm;
