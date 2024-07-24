from flask import Blueprint

microplan_bp_ = Blueprint("microplan", __name__)

from . import microplan  # Import the module to register routes
