from flask import Blueprint, render_template, redirect, request, jsonify
from dotenv import load_dotenv
import os
import json
from pymongo import MongoClient

chatHistory_bp = Blueprint("chatHistory", __name__, template_folder="templates")

load_dotenv()

# Connect to MongoDB
mongo_string = os.getenv("MONGO_STRING")
if not mongo_string:
    raise ValueError("MONGO_STRING environment variable is not set")

client = MongoClient(mongo_string)
db = client['GeoST4R-Chathistory']

@chatHistory_bp.route('/history')
def add_interaction():
    data = request.json
    db.interactions.insert_one({
        'counter': data.get('counter'),
        'botMessage': data.get('botMessage'),
        'userMessage': data.get('userMessage'),
        'timestamp': data.get('timestamp')
    })
    return jsonify({'message': 'Interaction added successfully'}), 201


@chatHistory_bp.route('/get_history', methods=['GET'])
def get_interactions():
    interactions = list(db.interactions.find())
    for interaction in interactions:
        interaction['_id'] = str(interaction['_id'])  # Convert ObjectId to string for JSON
    return jsonify(interactions)


if __name__ == '__main__':
    chatHistory_bp.run(debug=True, host="0.0.0.0", port=8000)
