import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function VehicleRegistrationForm() {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [seatingCapacity, setSeatingCapacity] = useState("");
  const [sacco, setSacco] = useState("");
  const [error, setError] = useState(""); // State for error messages

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (
      !make ||
      !model ||
      !year ||
      !color ||
      !plateNumber ||
      !seatingCapacity ||
      !sacco
    ) {
      setError("All fields must be filled out");
      return;
    }

    fetch("/vehicles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        make,
        model,
        year,
        color,
        plate_number: plateNumber,
        seating_capacity: seatingCapacity,
        sacco,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((vehicle) => {
            // setVehicle(vehicle);
            alert("Vehicle registered successfully!");
            navigate("/driverdashboard");
            setError(""); // Clear error message on successful registration
          });
        } else {
          response.json().then((errorData) => {
            setError("Error in vehicle registration"); // Set error message if registration fails
          });
        }
      })
      .catch(() => {
        setError("An error occurred. Please try again."); // Handle network errors
      });
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 mt-20 mb-8 sm:px-8 lg:px-16 dark:bg-gray-800">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">
            Vehicle Registration
          </h1>

          <div className="text-lg sm:text-xl font-semibold text-center text-gray-700 mb-6">
            To Register as a Driver, please enter the vehicle details
          </div>

          {error && (
            <p className="text-red-500 text-center mb-4">{error}</p> // Display error message
          )}

          <div className="mb-4">
            <label
              htmlFor="make"
              className="block text-gray-700 font-semibold mb-2"
            >
              Make
            </label>
            <input
              type="text"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="model"
              className="block text-gray-700 font-semibold mb-2"
            >
              Model
            </label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="year"
              className="block text-gray-700 font-semibold mb-2"
            >
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="color"
              className="block text-gray-700 font-semibold mb-2"
            >
              Color
            </label>
            <input
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="plateNumber"
              className="block text-gray-700 font-semibold mb-2"
            >
              Plate Number
            </label>
            <input
              type="text"
              id="plateNumber"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="seatingCapacity"
              className="block text-gray-700 font-semibold mb-2"
            >
              Seating Capacity
            </label>
            <input
              type="number"
              id="seatingCapacity"
              value={seatingCapacity}
              onChange={(e) => setSeatingCapacity(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="sacco"
              className="block text-gray-700 font-semibold mb-2"
            >
              Sacco
            </label>
            <input
              type="text"
              id="sacco"
              value={sacco}
              onChange={(e) => setSacco(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
          >
            Register Vehicle
          </button>
        </form>
      </div>
    </div>
  );
}

export default VehicleRegistrationForm;
