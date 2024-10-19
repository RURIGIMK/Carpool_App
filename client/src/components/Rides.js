import React, { useState, useEffect } from "react";
import RideCard from "./RideCard";

function Rides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch("/rides"); // Fetch rides from the backend
        if (response.ok) {
          const data = await response.json();
          setRides(data);
        } else {
          console.error("Failed to fetch rides:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching rides:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, []);

  if (loading) {
    return <div>Loading rides...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Rides</h1>
      {rides.length > 0 ? (
        rides.map((ride) => <RideCard key={ride.id} ride={ride} />) // Render RideCard for each ride
      ) : (
        <p>No rides available.</p>
      )}
    </div>
  );
}

export default Rides;
