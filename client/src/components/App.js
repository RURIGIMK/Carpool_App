import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
import DriverDashboard from "../pages/DriverDashboard";
import Rides from "./Rides";
import SignupUserForm from "../pages/SignupUserForm";
import SignupAdminForm from "../pages/SignupAdminForm";
import Login from "../pages/Login";
import HomePageNotLoggedIn from "../pages/HomePageNotLoggedIn";
import Footer from "./Footer";
import SignupDashboard from "../pages/SignupDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [rides, setRides] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode); // Simply toggle the dark mode state
  };

  useEffect(() => {
    fetch("/check_session").then((r) => {
      if (r.ok) {
        r.json().then((user) => setUser(user));
      }
    });
  }, []);

  // useEffect(() => {
  //   fetch("/rides").then((r) => {
  //     if (r.ok) {
  //       r.json().then((data) => setRides(data));
  //     }
  //   });
  // }, []);


  return (
    <div className={darkMode ? "dark" : ""}>
      <NavBar
        user={user}
        setUser={setUser}
        toggleDarkMode={toggleDarkMode}
        darkMode={darkMode}
      />
      <main className="dark:bg-gray-900">
        <Routes>
          {user ? (
            <>
              {user.is_driver && (
                <>
                  <Route
                    exact
                    path="/driverdashboard"
                    element={<DriverDashboard />}
                  />
                </>
              )}
              <Route path="/rides" element={<Rides rides={rides} />} />

            </>
          ) : (
            <>
              <Route path="/signup" element={<SignupUserForm setUser={setUser} />} />
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route
                path="*"
                element={
                  <HomePageNotLoggedIn
                    toggleDarkMode={toggleDarkMode}
                    darkMode={darkMode}
                  />
                }
              />
              <Route path='signup_dashboard' element={<SignupDashboard setUser={setUser} />}/>
            </>
          )}
        </Routes>
      </main>
      <Footer/>
    </div>
  );
}

export default App;
