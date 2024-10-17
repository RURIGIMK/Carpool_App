import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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

function VehicleDetails({ onAddToBookedVehicles }) {
  const [vehicle, setVehicle] = useState(null);
  const [showDriverDetails, setShowDriverDetails] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [pendingRides, setPendingRides] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    // Fetch vehicle data
    fetch(`/vehicles/${id}`).then((r) => {
      if (r.ok) {
        r.json().then((vehicleData) => {
          setVehicle(vehicleData); // Set vehicle data correctly
          if (vehicleData.user && vehicleData.user.is_driver === true) {
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
  
            // Fetch pending rides for the driver
            fetch(`/rides?driver_id=${vehicleData.user.id}&ride_status=pending`) // Updated fetch
              .then((res) => {
                if (res.ok) {
                  res.json().then((rideData) => {
                    console.log(rideData);
                    setPendingRides(rideData); // Set pending rides for the driver
                  });
                } else {
                  console.error('Failed to fetch pending rides:', res.statusText);
                }
              })
              .catch((error) => {
                console.error('Error fetching pending rides:', error);
              });
          }
        });
      }
    });
  }, [id]);
  

  if (!vehicle) {
    return <div>Loading vehicle details...</div>;
  }

  // Toggle function for driver details
  const toggleDriverDetails = () => {
    setShowDriverDetails((prev) => !prev);
  };

  // Toggle function for reviews
  const toggleReviews = () => {
    setShowReviews((prev) => !prev);
  };

  const handleClick = () => {
    if (vehicle) {
      onAddToBookedVehicles(vehicle);
    } else {
      console.error("Vehicle is not selected or available");
    }
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

        <button
          onClick={toggleDriverDetails}
          className="w-1/2 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
        >
          {showDriverDetails ? "Hide Driver Details" : "Show Driver Details"}
        </button>

        {showDriverDetails && vehicle.user && (
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

            <button
              onClick={toggleReviews}
              className="w-1/2 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
            >
              {showReviews ? "Hide Reviews" : "Show Reviews"}
            </button>

            {showReviews && reviews.length > 0 && (
              <div className="mt-4 p-4 border border-gray-300 bg-gray-100 rounded shadow-lg">
                <h4 className="font-bold text-xl">Reviews:</h4>
                {reviews.map((review) => (
                  <div key={review.id} className="mt-2">
                    <p>
                      <div>
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        {review.user.username} <br />
                      </div>
                      <strong>Rating:</strong>
                      <StarRating rating={review.rating} />
                      <strong>Comment:</strong> {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {pendingRides.length > 0 && (
              <div className="mt-4 p-4 border border-gray-300 bg-gray-100 rounded shadow-lg">
                <h4 className="font-bold text-xl">Pending Rides:</h4>
                {pendingRides.map((ride) => (
                  <div key={ride.id} className="mt-2">
                    <p>
                      <strong>Pickup Location:</strong> {ride.pickup_location}
                    </p>
                    <p>
                      <strong>Dropoff Location:</strong> {ride.dropoff_location}
                    </p>
                    <p>
                      <strong>Estimated Cost:</strong> ${ride.estimated_cost}
                    </p>
                    
                    <button className="w-1/4 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4">
                      Book Now
                    </button>
                  </div>
                ))}
              </div>
            )}

            <hr className="my-2" />
          </div>
        )}
        <Link to="/vehicles/your-vehicles">
          <button
            type="button"
            className="w-full bg-black text-white py-4 rounded-lg hover:bg-gray-800 transition-colors shadow-sm mt-4"
            onClick={handleClick}
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
