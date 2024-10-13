# !/usr/bin/env python3
from flask import request, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import app, db, api
from models import User, Booking, Ride, Payment, Review, Vehicle, Admin

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the Carpool API!"}), 200

# User Resource
class UserResource(Resource):
    def get(self, user_id=None):
        if user_id:
            user = User.query.get_or_404(user_id)
            return jsonify(user.to_dict())
        else:
            users = User.query.all()
            return jsonify([user.to_dict() for user in users])

    def post(self):
        data = request.get_json()
        try:
            user = User(
                username=data['username'],
                email=data['email'],
                phone_number=data.get('phone_number'),
                password_hash=data['password'],
                is_driver=data.get('is_driver', False)
            )
            db.session.add(user)
            db.session.commit()
            return jsonify(user.to_dict()), 201
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "Username or email already exists"}), 400

    def put(self, user_id):
        user = User.query.get_or_404(user_id)
        data = request.get_json()
        user.username = data.get('username', user.username)
        user.email = data.get('email', user.email)
        user.phone_number = data.get('phone_number', user.phone_number)
        db.session.commit()
        return jsonify(user.to_dict())

    def delete(self, user_id):
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        return '', 204


# Booking Resource
class BookingResource(Resource):
    def get(self, booking_id=None):
        if booking_id:
            booking = Booking.query.get_or_404(booking_id)
            return jsonify(booking.to_dict())
        else:
            bookings = Booking.query.all()
            return jsonify([booking.to_dict() for booking in bookings])

    def post(self):
        data = request.get_json()
        booking = Booking(
            total_cost=data['total_cost'],
            booking_status=data.get('booking_status', 'pending'),
            payment_status=data.get('payment_status', 'pending'),
            user_id=data['user_id'],
            ride_id=data['ride_id']
        )
        db.session.add(booking)
        db.session.commit()
        return jsonify(booking.to_dict()), 201

    def put(self, booking_id):
        booking = Booking.query.get_or_404(booking_id)
        data = request.get_json()
        booking.total_cost = data.get('total_cost', booking.total_cost)
        booking.booking_status = data.get('booking_status', booking.booking_status)
        booking.payment_status = data.get('payment_status', booking.payment_status)
        db.session.commit()
        return jsonify(booking.to_dict())

    def delete(self, booking_id):
        booking = Booking.query.get_or_404(booking_id)
        db.session.delete(booking)
        db.session.commit()
        return '', 204


# Ride Resource
class RideResource(Resource):
    def get(self, ride_id=None):
        if ride_id:
            ride = Ride.query.get_or_404(ride_id)
            return jsonify(ride.to_dict())
        else:
            rides = Ride.query.all()
            return jsonify([ride.to_dict() for ride in rides])

    def post(self):
        data = request.get_json()
        ride = Ride(
            pickup_location=data['pickup_location'],
            dropoff_location=data['dropoff_location'],
            pickup_time=data['pickup_time'],
            dropoff_time=data['dropoff_time'],
            distance=data['distance'],
            estimated_cost=data['estimated_cost'],
            ride_status=data.get('ride_status', 'pending'),
            ride_type=data.get('ride_type', 'regular'),
            driver_id=data['driver_id']
        )
        db.session.add(ride)
        db.session.commit()
        return jsonify(ride.to_dict()), 201

    def put(self, ride_id):
        ride = Ride.query.get_or_404(ride_id)
        data = request.get_json()
        ride.pickup_location = data.get('pickup_location', ride.pickup_location)
        ride.dropoff_location = data.get('dropoff_location', ride.dropoff_location)
        ride.pickup_time = data.get('pickup_time', ride.pickup_time)
        ride.dropoff_time = data.get('dropoff_time', ride.dropoff_time)
        ride.ride_status = data.get('ride_status', ride.ride_status)
        db.session.commit()
        return jsonify(ride.to_dict())

    def delete(self, ride_id):
        ride = Ride.query.get_or_404(ride_id)
        db.session.delete(ride)
        db.session.commit()
        return '', 204


# Payment Resource
class PaymentResource(Resource):
    def get(self, payment_id=None):
        if payment_id:
            payment = Payment.query.get_or_404(payment_id)
            return jsonify(payment.to_dict())
        else:
            payments = Payment.query.all()
            return jsonify([payment.to_dict() for payment in payments])

    def post(self):
        data = request.get_json()
        payment = Payment(
            amount=data['amount'],
            payment_method=data['payment_method'],
            payment_status=data.get('payment_status', 'pending'),
            booking_id=data['booking_id'],
            user_id=data['user_id']
        )
        db.session.add(payment)
        db.session.commit()
        return jsonify(payment.to_dict()), 201

    def put(self, payment_id):
        payment = Payment.query.get_or_404(payment_id)
        data = request.get_json()
        payment.amount = data.get('amount', payment.amount)
        payment.payment_status = data.get('payment_status', payment.payment_status)
        db.session.commit()
        return jsonify(payment.to_dict())

    def delete(self, payment_id):
        payment = Payment.query.get_or_404(payment_id)
        db.session.delete(payment)
        db.session.commit()
        return '', 204


# Vehicle Resource
class VehicleResource(Resource):
    def get(self, vehicle_id=None):
        if vehicle_id:
            vehicle = Vehicle.query.get_or_404(vehicle_id)
            return jsonify(vehicle.to_dict())
        else:
            vehicles = Vehicle.query.all()
            return jsonify([vehicle.to_dict() for vehicle in vehicles])

    def post(self):
        data = request.get_json()
        vehicle = Vehicle(
            make=data['make'],
            model=data['model'],
            year=data['year'],
            color=data['color'],
            plate_number=data['plate_number'],
            seating_capacity=data['seating_capacity'],
            sacco=data.get('sacco'),
            user_id=data['user_id']
        )
        db.session.add(vehicle)
        db.session.commit()
        return jsonify(vehicle.to_dict()), 201

    def put(self, vehicle_id):
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        data = request.get_json()
        vehicle.make = data.get('make', vehicle.make)
        vehicle.model = data.get('model', vehicle.model)
        vehicle.year = data.get('year', vehicle.year)
        vehicle.color = data.get('color', vehicle.color)
        vehicle.seating_capacity = data.get('seating_capacity', vehicle.seating_capacity)
        db.session.commit()
        return jsonify(vehicle.to_dict())

    def delete(self, vehicle_id):
        vehicle = Vehicle.query.get_or_404(vehicle_id)
        db.session.delete(vehicle)
        db.session.commit()
        return '', 204


# Review Resource
class ReviewResource(Resource):
    def get(self, review_id=None):
        if review_id:
            review = Review.query.get_or_404(review_id)
            return jsonify(review.to_dict())
        else:
            reviews = Review.query.all()
            return jsonify([review.to_dict() for review in reviews])

    def post(self):
        data = request.get_json()
        review = Review(
            rating=data['rating'],
            comment=data.get('comment'),
            user_id=data['user_id'],
            booking_id=data['booking_id'],
            ride_id=data['ride_id']
        )
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict()), 201

    def put(self, review_id):
        review = Review.query.get_or_404(review_id)
        data = request.get_json()
        review.rating = data.get('rating', review.rating)
        review.comment = data.get('comment', review.comment)
        db.session.commit()
        return jsonify(review.to_dict())

    def delete(self, review_id):
        review = Review.query.get_or_404(review_id)
        db.session.delete(review)
        db.session.commit()
        return '', 204


# Admin Resource
class AdminResource(Resource):
    def get(self, admin_id=None):
        if admin_id:
            admin = Admin.query.get_or_404(admin_id)
            return jsonify(admin.to_dict())
        else:
            admins = Admin.query.all()
            return jsonify([admin.to_dict() for admin in admins])

    def post(self):
        data = request.get_json()
        admin = Admin(
            username=data['username'],
            password_hash=data['password'],
            phone_number=data.get('phone_number')
        )
        db.session.add(admin)
        db.session.commit()
        return jsonify(admin.to_dict()), 201

    def put(self, admin_id):
        admin = Admin.query.get_or_404(admin_id)
        data = request.get_json()
        admin.username = data.get('username', admin.username)
        admin.phone_number = data.get('phone_number', admin.phone_number)
        db.session.commit()
        return jsonify(admin.to_dict())

    def delete(self, admin_id):
        admin = Admin.query.get_or_404(admin_id)
        db.session.delete(admin)
        db.session.commit()
        return '', 204


# Register Resources with the API
api.add_resource(UserResource, '/users', '/users/<int:user_id>')
api.add_resource(BookingResource, '/bookings', '/bookings/<int:booking_id>')
api.add_resource(RideResource, '/rides', '/rides/<int:ride_id>')
api.add_resource(PaymentResource, '/payments', '/payments/<int:payment_id>')
api.add_resource(VehicleResource, '/vehicles', '/vehicles/<int:vehicle_id>')
api.add_resource(ReviewResource, '/reviews', '/reviews/<int:review_id>')
api.add_resource(AdminResource, '/admins', '/admins/<int:admin_id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)


