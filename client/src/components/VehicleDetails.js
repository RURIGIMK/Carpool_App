import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";

function StarRating({ rating }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex items-center space-x-1">
      {stars.map((star) => (
        <span key={star} className="text-yellow-500 text-2xl">
          <FontAwesomeIcon icon={star <= rating ? fasStar : farStar} />
        </span>
      ))}
    </div>
  );
}

function VehicleDetails() {
  const [vehicle, setVehicle] = useState(null); // Initially, vehicle is null
  const [showDriverDetails, setShowDriverDetails] = useState(false); // State for toggling driver details
  const [showReviews, setShowReviews] = useState(false); // State for toggling reviews
  const [reviews, setReviews] = useState([]); // State to hold driver reviews
  const { id } = useParams();

  useEffect(() => {
    // Fetch vehicle data
    fetch(`/vehicles/${id}`).then((r) => {
      if (r.ok) {
        r.json().then((vehicleData) => {
          setVehicle(vehicleData); // Set vehicle data correctly
          if (vehicleData.user) {
            // Fetch reviews for the driver (user) if available
            fetch(`/users/${vehicleData.user.id}/reviews`).then((res) => {
              if (res.ok) {
                res.json().then((reviewData) => {
                  // Set review data and include user info
                  setReviews(
                    reviewData.map((review) => ({
                      ...review,
                      user: vehicleData.user, // Assuming the user data is the same for all reviews
                    }))
                  );
                });
              }
            });
          }
        });
      }
    });
  }, [id]);

  // If vehicle is still null, show a loading state or message
  if (!vehicle) {
    return <div>Loading vehicle details...</div>; // Display a loading message while fetching data
  }

  // Toggle function for driver details
  const toggleDriverDetails = () => {
    setShowDriverDetails((prev) => !prev); // Toggle the current state
  };

  // Toggle function for reviews
  const toggleReviews = () => {
    setShowReviews((prev) => !prev); // Toggle the current state
  };

  return (
    <div className="flex flex-col max-w-4xl rounded-lg shadow-lg bg-white mx-auto my-8 border border-gray-200 p-4 sm:p-6 md:p-8 mt-32 h-auto">
      <h2 className="font-bold text-4xl mb-4">
        {vehicle.make} {vehicle.model}
      </h2>
      <div className="flex justify-center mb-4 md:mb-0">
        <img
          src={vehicle.image}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="w-80 h-80 object-cover rounded-full"
        />
      </div>

      {/* Right column for the vehicle details */}
      <div className="w-full flex flex-col justify-center pl-8">
        <p className="text-lg mb-2">
          <strong>Color:</strong> {vehicle.color}
        </p>
        <p className="text-lg mb-2">
          <strong>Plate Number:</strong> {vehicle.plate_number}
        </p>
        <p className="text-lg mb-2">
          <strong>Seating Capacity:</strong> {vehicle.seating_capacity} seats
        </p>

        {/* Toggle button for driver details */}
        <button
          onClick={toggleDriverDetails}
          className="w-1/2 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
        >
          {showDriverDetails ? "Hide Driver Details" : "Show Driver Details"}
        </button>

        {/* Conditional rendering of driver details */}
        {showDriverDetails &&
          vehicle.user && ( // Ensure vehicle.user exists
            <div className="mt-4 rounded w-full">
              <h3 className="font-bold text-2xl underline mb-2">
                Driver Details:
              </h3>
              <p className="text-lg mb-2">
                <strong>Name:</strong> {vehicle.user.username}
              </p>
              <p className="text-lg mb-2">
                <strong>Email:</strong> {vehicle.user.email}
              </p>
                  <p className="text-lg mb-2">
                <strong>Phone Number:</strong> {vehicle.user.phone_number}
              </p>

              {/* Toggle button for reviews */}
              <button
                onClick={toggleReviews}
                className="w-1/2 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
              >
                {showReviews ? "Hide Reviews" : "Show Reviews"}
              </button>

              {/* Conditional rendering of reviews */}
              {showReviews && reviews.length > 0 && (
                <div className="mt-4 p-4 border border-gray-300 bg-gray-100 rounded shadow-lg">
                  <h4 className="font-bold text-xl">Reviews:</h4>
                  {reviews.map((review) => (
                    <div key={review.id} className="mt-2">
                      <p>
                        <div>
                          <FontAwesomeIcon icon={faUser} className="mr-2" />{" "}
                          {review.user.username} <br />
                        </div>
                        <strong>Rating:</strong>{" "}
                        {<StarRating rating={review.rating} />}
                        <strong>Comment:</strong> {review.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
              <hr className="my-2" />
            </div>
          )}
        <Link to="/destinations/your-destinations">
          <button
            type="button"
            className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
            // onClick={handleClick}
          >
            Book now
          </button>
        </Link>

        <Link to={`/destinations/${id}/reviews`} className="mt-4">
          <div className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4 text-center">
            Visited? Leave a review
          </div>
        </Link>
      </div>
    </div>
  );
}

export default VehicleDetails;
