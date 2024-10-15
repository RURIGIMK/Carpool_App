import React from "react";
import { Link } from "react-router-dom";

function HomePageNotLoggedIn() {
  return (
    <div className="flex items-center justify-center h-screen bg-custom-image-0 bg-cover bg-center dark:bg-grey-800">
      <div className="bg-white bg-opacity-75 p-8 sm:p-10 rounded-lg shadow-lg text-center max-w-md sm:max-w-lg md:max-w-lg">
        <h1 className="text-xl sm:text-2xl font-bold text-black mb-4">
          Welcome to RidePool!
        </h1>
        <p className="text-black mb-6 text-sm sm:text-base">
          Please log in or sign up to book a ride now.
        </p>
        <Link to="/signup">
          <button
            type="signup"
            className="w-full sm:w-40 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default HomePageNotLoggedIn;
