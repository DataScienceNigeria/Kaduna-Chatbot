from flask import Blueprint

weather_bp = Blueprint("askchat", __name__)

from . import weather  # Import the module to register routes
