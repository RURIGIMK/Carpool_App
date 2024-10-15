// UserDashboard.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VehicleCard from "../components/VehicleCard";


function UserDashboard({ user }) {
  const [vehicles, setVehicles] = useState([]); // State to hold vehicles
  const [error, setError] = useState(""); // State for error messages
  const [expandedGroup, setExpandedGroup] = useState(null); // State to track the expanded group
  const userId = user.id; // This should be set to the current user's ID

  useEffect(() => {
    // Fetch vehicles registered to the current user
    fetch("/vehicles") // Assume backend API accepts query parameters for filtering
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch vehicles");
        }
      })
      .then((data) => {
        setVehicles(data);
      })
      .catch((error) => {
        setError(error.message); // Handle errors appropriately
      });
  }, [userId]);

  // Group vehicles by seating capacity
  const groupedVehicles = vehicles.reduce((acc, vehicle) => {
    const capacity = vehicle.seating_capacity;
    if (!acc[capacity]) {
      acc[capacity] = [];
    }
    acc[capacity].push(vehicle);
    return acc;
  }, {});

  // Toggle the visibility of vehicle cards for a specific group
  const handleGroupToggle = (capacity) => {
    setExpandedGroup((prev) => (prev === capacity ? null : capacity));
  };

  return (
    <div className="flex mt-20 dark:bg-gray-900 h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">User Dashboard</h2>
        <ul className="mt-4">
          <li>
            <Link
              to="/registered-vehicles"
              className="block py-2 hover:bg-gray-700"
            >
              View Registered Vehicles
            </Link>
          </li>
          <li>
            <Link to="/rides" className="block py-2 hover:bg-gray-700">
              My Rides
            </Link>
          </li>
          <li>
            <Link to="/bookings" className="block py-2 hover:bg-gray-700">
              My Bookings
            </Link>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-4 bg-gray-100 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-4 dark:text-white">
          Book Ride by Seating Capacity
        </h1>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message */}
        {Object.keys(groupedVehicles).length > 0 ? (
          Object.entries(groupedVehicles).map(([capacity, vehicles]) => (
            <div key={capacity} className="mb-6">
              <h2
                className="text-xl font-bold mb-2 cursor-pointer"
                onClick={() => handleGroupToggle(capacity)} // Toggle vehicle cards on click
              >
                Seating Capacity: {capacity}{" "}
                {expandedGroup === capacity ? "▲" : "▼"} {/* Add toggle icon */}
              </h2>
              {expandedGroup === capacity && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {vehicles.map((vehicle) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} /> // Use VehicleCard for each vehicle
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No vehicles registered yet.</p>
        )}
      </main>
    </div>
  );
}

export default UserDashboard;
