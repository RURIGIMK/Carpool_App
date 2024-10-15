// VehicleCard.js
import React from 'react';

function VehicleCard({ vehicle }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
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
        <strong>Seating Capacity:</strong> {vehicle.seating_capacity}
      </p>
      <p>
        <strong>Sacco:</strong> {vehicle.sacco}
      </p>
    </div>
  );
}

export default VehicleCard;
