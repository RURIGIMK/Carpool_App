import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import VehicleCard from "../components/VehicleCard";
import RideCard from "../components/RideCard";

function AdminDashboard({ user }) {
  const [vehicles, setVehicles] = useState([]); // State to hold vehicles
  const [rides, setRides] = useState([]); // State to hold rides
  const [error, setError] = useState(""); // State for error messages
  const [expandedGroup, setExpandedGroup] = useState(null); // State to track the expanded vehicle group
  const [expandedRideGroup, setExpandedRideGroup] = useState(null); // State to track the expanded ride group
  const userId = user.id; // This should be set to the current user's ID

  // Fetch vehicles registered to the current user
  useEffect(() => {
    fetch("/vehicles")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch vehicles");
        }
      })
      .then((data) => setVehicles(data))
      .catch((error) => setError(error.message));
  }, [userId]);

  // Fetch rides from the backend and filter for pending rides
  useEffect(() => {
    fetch("/rides")
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Failed to fetch rides");
        }
      })
      .then((data) => {
        // Filter rides to only include those with a "pending" status
        const pendingRides = data.filter(
          (ride) => ride.ride_status === "pending"
        );
        setRides(pendingRides);
      })
      .catch((error) => setError(error.message));
  }, []);

  // Group vehicles by seating capacity
  const groupedVehicles = vehicles.reduce((acc, vehicle) => {
    const capacity = vehicle.seating_capacity;
    if (!acc[capacity]) {
      acc[capacity] = [];
    }
    acc[capacity].push(vehicle);
    return acc;
  }, {});

  // Group rides by pickup location
  const groupedRides = rides.reduce((acc, ride) => {
    const location = ride.pickup_location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(ride);
    return acc;
  }, {});

  // Toggle the visibility of vehicle cards for a specific group
  const handleGroupToggle = (capacity) => {
    setExpandedGroup((prev) => (prev === capacity ? null : capacity));
  };

  // Toggle the visibility of rides for a specific pickup location
  const handleRideGroupToggle = (location) => {
    setExpandedRideGroup((prev) => (prev === location ? null : location));
  };

  return (
    <div className="flex-col dark:bg-gray-900 min-h-screen">
      <div className='flex flex-1 h-auto'>
        <aside className="w-64 bg-gray-800 text-white p-4 flex-col min-h-screen text-center pt-20">
          <h2 className="text-xl font-bold">Admin Dashboard</h2>
          <ul className="mt-4">
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
        <div className="flex-1 p-4 bg-gray-100 dark:bg-gray-900 h-auto pt-20">
          <h1 className="text-2xl font-bold mb-4 dark:text-white text-center">
            Book Ride by Seating Capacity
          </h1>
          {error && <p className="text-red-500">{error}</p>}{" "}
          {/* Display error message */}
          {Object.keys(groupedVehicles).length > 0 ? (
            Object.entries(groupedVehicles).map(([capacity, vehicles]) => (
              <div key={capacity} className="mb-6">
                <h2
                  className="text-xl font-bold mb-2 cursor-pointer dark:text-white"
                  onClick={() => handleGroupToggle(capacity)} // Toggle vehicle cards on click
                >
                  Seating Capacity: {capacity}{" "}
                  {expandedGroup === capacity ? "▲" : "▼"}{" "}
                  {/* Add toggle icon */}
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
          <div>
            <hr />
            <br />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white text-center">
              Book Ride by Pickup Location
            </h1>
            {Object.keys(groupedRides).length > 0 ? (
              Object.entries(groupedRides).map(([location, rides]) => (
                <div key={location} className="mb-6">
                  <h2
                    className="text-xl font-bold mb-2 cursor-pointer dark:text-white"
                    onClick={() => handleRideGroupToggle(location)} // Toggle ride cards on click
                  >
                    {location} {expandedRideGroup === location ? "▲" : "▼"}{" "}
                    {/* Add toggle icon */}
                  </h2>
                  {expandedRideGroup === location && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {rides.map((ride) => (
                        <RideCard key={ride.id} ride={ride} />
                      ))}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No pending rides available yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
