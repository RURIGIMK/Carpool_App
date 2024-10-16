import React from "react";
import { Link } from "react-router-dom";

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex">
      {/* Left column for the image */}
      <div className="w-1/3 pr-4">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-full h-auto rounded-lg"
        />
      </div>

      {/* Right column for the vehicle details */}
      <div className="w-2/3">
        <h2 className="font-bold text-lg mb-2">
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
          <strong>Seating Capacity:</strong> {vehicle.seating_capacity}
        </p>
        <p>
          <strong>Sacco:</strong> {vehicle.sacco}
        </p>
        <Link to={`/userdashboard/vehicles/${vehicle.id}`}>
          <button
            type="submit"
            className="w-28 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
          >
            View details
          </button>
        </Link>
      </div>
    </div>
  );
}

export default VehicleCard;
