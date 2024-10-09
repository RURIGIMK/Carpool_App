#!/usr/bin/env python3
import json

from flask import request, session, jsonify
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

from config import app, db, api, bcrypt
from models import User, Booking, Ride, Payment, Review, Vehicle, Admin


if __name__ == '__main__':
    app.run(port=5555, debug=True)
    
