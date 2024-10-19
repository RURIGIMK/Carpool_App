import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function RideDetails() {
  const { rideId } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRideDetails = async () => {
      try {
        const response = await fetch(`/rides/${rideId}`); // Fetch ride details from the backend
        if (response.ok) {
          const data = await response.json();
          setRide(data);
        } else {
          console.error("Failed to fetch ride details:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching ride details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [rideId]);

  if (loading) {
    return <div>Loading ride details...</div>;
  }

  if (!ride) {
    return <div>Ride not found.</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Ride Details</h2>
      <p>
        <strong>Pickup Time:</strong> {new Date(ride.pickup_time).toLocaleString()}
      </p>
      <p>
        <strong>Dropoff Location:</strong> {ride.dropoff_location}
      </p>
      <p>
        <strong>Estimated Cost:</strong> {ride.estimated_cost} KES
      </p>
      <p>
        <strong>Status:</strong> {ride.ride_status}
      </p>
      <Link
        to={`/userdashboard/rides`}
        className="mt-4 inline-block bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors"
      >
        Back to Rides
      </Link>
    </div>
  );
}

export default RideDetails;
