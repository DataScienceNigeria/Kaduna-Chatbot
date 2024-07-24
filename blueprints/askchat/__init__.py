from flask import Blueprint

askchat_bp = Blueprint("askchat", __name__)

from . import askchat  # Import the module to register routes
