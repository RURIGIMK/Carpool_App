from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.sql import func

from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    serialize_rules= ('-rides', '-reviews', '-payments', '-vehicles',)

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), nullable=False)
    _password_hash = db.Column(db.String(128))
    phone_number = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=func.now())
    is_driver = db.Column(db.Boolean, default=False)
    image = db.Column(db.String(50))
    

    # relationships
    bookings = db.relationship('Booking', back_populates='user', cascade='all, delete-orphan')
    rides = association_proxy('bookings', 'ride')
    reviews = db.relationship('Review', back_populates='user', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='user', cascade='all, delete-orphan')
    vehicles = db.relationship('Vehicle', back_populates='user', cascade='all, delete-orphan')


    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        if isinstance(password, bytes):
            password = password.decode('utf-8') 
        password_hash = bcrypt.generate_password_hash(
            password)
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self.password_hash, password)
    
    @validates('password_hash')
    def validate_password_hash(self, key, password_hash):
        if not password_hash:
            raise ValueError("Password is required.")
        return password_hash
    
    @validates('email')
    def validate_email(self, key, email):
        if '@' not in email:
            raise ValueError("Email format not correct.")
        return email
    
    def __repr__(self):
        return f'<User {self.username}, {self.email}, {self.phone_number}>'

class Booking(db.Model, SerializerMixin):
    __tablename__ = 'bookings'

    serialize_rules= ('-user', '-ride', '-reviews', '-payments')

    id = db.Column(db.Integer, primary_key=True)
    total_cost = db.Column(db.Integer)
    booking_status = db.Column(db.String(50), default='pending')
    payment_status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    ride_id = db.Column(db.Integer, db.ForeignKey('rides.id'))

    user = db.relationship('User', back_populates='bookings')
    ride = db.relationship('Ride', back_populates='bookings')
    reviews = db.relationship('Review', back_populates='booking', cascade='all, delete-orphan')
    payments = db.relationship('Payment', back_populates='booking', cascade='all, delete-orphan')

    @validates('booking_status')
    def validate_booking_status(self, key, booking_status):
        if booking_status not in ['pending', 'completed', 'cancelled']:
            raise ValueError("Invalid booking status.")
        return booking_status
    
    @validates('payment_status')
    def validate_payment_status(self, key, payment_status):
        if payment_status not in ['pending', 'in_progress', 'completed']:
            raise ValueError("Invalid payment status.")
        return payment_status
    

    def __repr__(self):
        return f'<Booking {self.id}, {self.user_id}, {self.ride_id}>'
    

class Ride(db.Model, SerializerMixin):
    __tablename__ = 'rides'

    serialize_rules= ('-user', '-ride', '-reviews')

    id = db.Column(db.Integer, primary_key=True)
    pickup_location = db.Column(db.String(255))
    dropoff_location = db.Column(db.String(255))
    pickup_time = db.Column(db.DateTime)
    dropoff_time = db.Column(db.DateTime)
    distance = db.Column(db.Float)
    estimated_cost = db.Column(db.Integer)
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())
    driver_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    ride_status = db.Column(db.String(50), default='pending')
    ride_type = db.Column(db.String(50), default='regular')

    bookings = db.relationship('Booking', back_populates='ride', cascade='all, delete-orphan')
    users = association_proxy('bookings', 'user')
    reviews = db.relationship('Review', back_populates='ride', cascade='all, delete-orphan')


    @validates('ride_status')
    def validate_ride_status(self, key, ride_status):
        if ride_status not in ['pending', 'accepted', 'completed', 'cancelled']:
            raise ValueError("Invalid ride status.")
        return ride_status
    
    def __repr__(self):
        return f'<Ride {self.id}, {self.driver_id}>'

class Payment(db.Model, SerializerMixin):
    __tablename__ = 'payments'

    serialize_rules= ('-booking', '-user')

    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer)
    payment_method = db.Column(db.String(50))
    payment_status = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    booking = db.relationship('Booking', back_populates='payments')
    user = db.relationship('User', back_populates='payments')

    @validates('payment_status')
    def validate_payment_status(self, key, payment_status):
        if payment_status not in ['pending', 'in_progress', 'completed']:
            raise ValueError("Invalid payment status.")
        return payment_status
    
    def __repr__(self):
        return f'<Payment {self.id}, {self.booking_id}, {self.user_id}>'
    
class Vehicle(db.Model, SerializerMixin):
    __tablename__ = 'vehicles'

    id = db.Column(db.Integer, primary_key=True)
    make = db.Column(db.String(50))
    model = db.Column(db.String(50))
    year = db.Column(db.Integer)
    color = db.Column(db.String(50))
    plate_number = db.Column(db.String(20))
    seating_capacity = db.Column(db.Integer)
    sacco = db.Column(db.String(50))
    image = db.Column(db.String(50))
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    user = db.relationship('User', back_populates='vehicles')

    def __repr__(self):
        return f'<Vehicle {self.id}, {self.plate_number}>'
    

class Admin(db.Model, SerializerMixin):
    __tablename__ = 'admins'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    _password_hash = db.Column(db.String(128))
    phone_number = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=func.now())

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        if isinstance(password, bytes):
            password = password.decode('utf-8') 
        password_hash = bcrypt.generate_password_hash(
            password)
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self.password_hash, password)
    
    @validates('password_hash')
    def validate_password_hash(self, key, password_hash):
        if not password_hash:
            raise ValueError("Password is required.")
        return password_hash
    
    def __repr__(self):
        return f'<Admin {self.username}, {self.phone_number}>'
    
class Review(db.Model, SerializerMixin):
    __tablename__ = 'Reviews'

    serialize_rules= ('-user', '-booking', '-ride', '-review')

    id = db.Column(db.Integer, primary_key=True)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(255))
    created_at = db.Column(db.DateTime, default=func.now())

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    booking_id = db.Column(db.Integer, db.ForeignKey('bookings.id'))
    ride_id = db.Column(db.Integer, db.ForeignKey('rides.id'))

    user = db.relationship('User', back_populates='reviews')
    booking = db.relationship('Booking', back_populates='reviews')
    ride = db.relationship('Ride', back_populates='reviews')

    @validates('rating')
    def validate_rating(self, key, rating):
        if rating < 1 or rating > 5:
            raise ValueError("Rating must be between 1 and 5.")
        return rating
    
    def __repr__(self):
        return f'<Review {self.id}, {self.user_id}, {self.booking_id}, {self.ride_id}>'
    



