import React, { useState } from "react";
import { Link } from "react-router-dom";
import SignupUserForm from "./SignupUserForm"; // Your form component for users
import SignupDriverForm from "./SignupDriverForm"; // Your form component for drivers

function SignupDashboard({ setUser }) {
  const [selectedRole, setSelectedRole] = useState(null); // Track selected role

  return (
    <div className="flex">
      {/* Sidebar Dashboard */}
      <div className="w-1/3 bg-black text-white p-6 flex flex-col justify-between">
        {/* Sign-up Section */}
        <div className="space-y-6 mt-24">
          <h1 className="text-3xl font-bold mb-6">Welcome to RidePool</h1>
          <div className="space-y-4">
            {/* Sign up as User */}
            <button
              onClick={() => setSelectedRole("user")}
              className={`w-full p-4 rounded-md bg-gray-700 text-white text-lg font-semibold hover:bg-gray-600 transition-colors ${
                selectedRole === "user" ? "ring-4 ring-gray-500" : ""
              }`}
            >
              Sign Up as User
            </button>

            {/* Sign up as Driver */}
            <button
              onClick={() => setSelectedRole("driver")}
              className={`w-full p-4 rounded-md bg-gray-700 text-white text-lg font-semibold hover:bg-gray-600 transition-colors ${
                selectedRole === "driver" ? "ring-4 ring-gray-500" : ""
              }`}
            >
              Sign Up as Driver
            </button>
          </div>
        </div>

        {/* Admin Signup Button */}
        <div className="flex justify-end mt-12">
          <Link
            to="/signup_admin"
            className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm"
          >
            Admin
          </Link>
        </div>
      </div>

      {/* Dynamic Content Section */}
      <div className="flex-1 bg-gray-100 p-8 mt-20 dark:bg-gray-800">
        {/* Dynamic form based on selected role */}
        <h2 className="text-2xl font-bold text-black dark:text-white">
          {selectedRole
            ? `Sign up as a ${
                selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)
              }`
            : "Please select a role to sign up"}
        </h2>
        <p className="text-gray-600 mt-4 dark:text-white">
          {selectedRole
            ? `Complete the form to sign up as a ${selectedRole}.`
            : "Choose whether you want to sign up as a User or Driver."}
        </p>

        {/* Conditionally render forms based on the selected role */}
        <div className="-mt-16">
          {selectedRole === "user" ? (
            <SignupUserForm setUser={setUser} />
          ) : selectedRole === "driver" ? (
            <SignupDriverForm setUser={setUser} />
          ) : (
            <p className="text-gray-500 dark:text-gray-300">
              Please select a role to see the signup form.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default SignupDashboard;
