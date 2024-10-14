import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCartShopping } from "@fortawesome/free-solid-svg-icons";

function NavBar({ user, setUser, toggleDarkMode, darkMode  }) {
  function handleLogoutClick() {
    fetch("/logout", { method: "DELETE" }).then((r) => {
      if (r.ok) {
        setUser(null);
      }
    });
  }

  return (
    <header className="bg-white p-4 flex items-center justify-between shadow-md fixed top-0 w-full h-20 z-50 dark:bg-gray-800">
  <div className="flex items-center space-x-2">
    <Link
      to="/"
      className="text-black text-4xl font-semibold hover:text-light-pink dark:text-white"
    >
      RidePool
    </Link>
  </div>

  <div className="flex-1"></div>

  <Link to="/rides">
    <div className="mr-6">
      {user ? (
        <span className="text-2xl text-black hover:text-light-pink">
          <FontAwesomeIcon icon={faCartShopping} />
        </span>
      ) : null}
    </div>
  </Link>

  <div className="mr-2">
    {user ? (
      <span className="text-2xl text-black hover:text-light-pink">
        <FontAwesomeIcon icon={faUser} />
      </span>
    ) : null}
  </div>

  <div className="font-semibold text-xl text-black">
    {user ? user.username : null}
  </div>

  <div>
    {user ? (
      <button
        onClick={handleLogoutClick}
        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-800 shadow-sm ml-4"
      >
        Logout
      </button>
    ) : null}
  </div>

  <div className="toggle-switch flex items-center ml-4">
    <input
      type="checkbox"
      id="toggle-dark-mode"
      className="sr-only"
      checked={darkMode}
      onChange={(e) => toggleDarkMode(e.target.checked)}
    />
    <label
      htmlFor="toggle-dark-mode"
      className="relative inline-flex items-center cursor-pointer"
    >
      <span className="block w-12 h-6 bg-gray-600 rounded-full transition-colors duration-300 dark:bg-gray-600"></span>
      <span
        className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          darkMode ? "translate-x-6" : ""
        }`}
      ></span>
    </label>
  </div>
</header>

  );
}

export default NavBar;
