import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function DriverDashboard({ user }) {
  const [vehicles, setVehicles] = useState([]); // State to hold vehicles
  const [error, setError] = useState(""); // State for error messages

  // Check if user is defined and has an ID
  const userId = user ? user.id : null;

  useEffect(() => {
    if (userId) {
      // Fetch vehicles registered to the current user
      fetch(`/vehicles?user_id=${userId}`) // Assume backend API accepts query parameters for filtering
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
    }
  }, [userId]);

  return (
    <div className="flex mt-20 h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold">Driver Dashboard</h2>
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
      <main className="flex-1 p-4 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Registered Vehicles</h1>
        {error && <p className="text-red-500">{error}</p>}{" "}
        {/* Display error message */}
        {vehicles.length === 0 && !error}{" "}
        {/* Loading state */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.length > 0
            ? vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <h2 className="font-bold text-lg">
                    {vehicle.make} {vehicle.model}
                  </h2>
                  <p>
                    <strong>Year:</strong> {vehicle.year}
                  </p>
                  <p>
                    <strong>Color:</strong> {vehicle.color}
                  </p>
                  <p>
                    <strong>Plate Number:</strong> {vehicle.plate_number}
                  </p>
                  <p>
                    <strong>Seating Capacity:</strong>{" "}
                    {vehicle.seating_capacity}
                  </p>
                  <p>
                    <strong>Sacco:</strong> {vehicle.sacco}
                  </p>
                </div>
              ))
            : !error && <p>No vehicles registered yet.</p>}
        </div>
      </main>
    </div>
  );
}

export default DriverDashboard;
