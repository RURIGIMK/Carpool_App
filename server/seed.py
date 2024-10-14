from faker import Faker
import random

from config import app, db, bcrypt
from datetime import datetime, timedelta
from models import User, Booking, Ride, Payment, Review, Vehicle, Admin

fake = Faker()

def seed_data():
    with app.app_context():
        try:

            User.query.delete()
            Booking.query.delete()
            Ride.query.delete()
            Payment.query.delete()
            Review.query.delete()
            Vehicle.query.delete()
            Admin.query.delete()
            db.session.commit()

            # Create Admin
            admins = []
            admin = Admin(
                username = 'admin',
                password_hash = "AdminPassword1234!"
            )
            db.session.add(admin)
            admins.append(admin)
            db.session.commit()

            # Create Users
            users = []
            for _ in range(10):
                user = User(
                    username = fake.name(),
                    email=fake.email(),
                    password_hash = bcrypt.generate_password_hash(fake.password(length=12)).decode('utf-8'),
                    phone_number = fake.phone_number(),
                    created_at = fake.date_time_between(start_date=datetime.now() - timedelta(days=30), end_date=datetime.now()),
                    is_driver = random.choice([True, False])
                )
                db.session.add(user)
                users.append(user)
            db.session.commit()

            # Create Vehicle
            vehicles = []
            models = ['Toyota', 'Mazda', 'Honda', 'Nissan', 'BMW', 'Isuzu', 'Ford']
            for _ in range(10):
                vehicle = Vehicle(
                    make = fake.company(),
                    model = random.choice(models),
                    year = fake.year(),
                    color = fake.color_name(),
                    plate_number = fake.license_plate(),
                    seating_capacity = fake.random_int(min=4, max=8),
                    sacco = fake.company(),
                    user_id = random.choice(users).id
                )
                db.session.add(vehicle)
                vehicles.append(vehicle)
            db.session.commit()

            # Create Rides
            rides = []
            for _ in range(10):
                ride = Ride(
                    pickup_location = fake.address(),
                    dropoff_location = fake.address(),
                    pickup_time = fake.future_datetime(),
                    dropoff_time = fake.future_datetime(),
                    distance = fake.random_int(min=1, max=100),
                    estimated_cost = fake.random_int(min=10, max=50),
                    ride_status = random.choice(['pending', 'accepted', 'completed', 'cancelled']),
                    ride_type = random.choice(['regular', 'premium']),
                    driver_id = random.choice(users).id,)
                
                db.session.add(ride)
                rides.append(ride)
            db.session.commit()

            # Create Bookings
            bookings = []
            for _ in range(10):
                booking = Booking(
                    booking_status = random.choice(['pending', 'completed', 'cancelled']),
                    payment_status = random.choice(['pending', 'in_progress', 'completed']),
                    total_cost = fake.random_int(min=10, max=50),
                    user_id = random.choice(users).id,
                    ride_id = random.choice(rides).id
                )
                db.session.add(booking)
                bookings.append(booking)
            db.session.commit()

            # Create Payments
            payments = []
            for _ in range(10):
                payment = Payment(
                    amount = fake.random_int(min=10, max=50),
                    payment_status = random.choice(['pending', 'in_progress', 'completed']),
                    payment_method = random.choice(['cash', 'card', 'online']),
                    user_id = random.choice(users).id,
                    booking_id = random.choice(bookings).id,
                )
                db.session.add(payment)
                payments.append(payment)
            db.session.commit()

            # Create Reviews
            reviews = []
            for _ in range(10):
                review = Review(
                    rating = fake.random_int(min=1, max=5),
                    comment = fake.text(),
                    booking_id = random.choice(bookings).id,
                    user_id = random.choice(users).id,
                    ride_id = random.choice(rides).id
                )
                db.session.add(review)
                reviews.append(review)
            db.session.commit()

            print("Data seeded successfully!")

        except Exception as e:
                print(f"An error occurred: {e}")


if __name__ == "__main__":
    seed_data()




      

        