import React from "react";

function RideCard({ ride}) {
  return (
    <div>
      <div key={ride.id} className="p-4 bg-white shadow rounded-lg">
        <p>
          <strong>Pickup Time:</strong>{" "}
          {new Date(ride.pickup_time).toLocaleString()}
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
        <button
          type="button"
          className="w-full sm:w-32 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-3"
        >
          View details
        </button>
      </div>
    </div>
  );
}

export default RideCard;
