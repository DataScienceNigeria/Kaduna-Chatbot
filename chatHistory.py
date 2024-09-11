from flask import Blueprint, render_template, redirect, request, jsonify
from dotenv import load_dotenv
import os
import json
from flask_cors import CORS
from pymongo import MongoClient

chatHistory_bp = Blueprint("chatHistory", __name__, template_folder="templates")
CORS(chatHistory_bp)

load_dotenv()

# Connect to MongoDB
MONGO_NAME = os.getenv("MONGO_NAME")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_CLUSTER = os.getenv("MONGO_CLUSTER")

mongo_string = f"mongodb+srv://{MONGO_NAME}:{MONGO_PASSWORD}@{MONGO_CLUSTER}/?retryWrites=true&w=majority&appName={MONGO_DB}"

client = MongoClient(mongo_string)
db = client['GeoST4R-Chathistory']
collection = db['interactions']

@chatHistory_bp.route('/history', methods=['POST'])
def add_interaction():
    data = request.json
    collection.interactions.insert_one(data)
    return jsonify({'message': 'Interaction added successfully'}), 201

@chatHistory_bp.route('/get_history', methods=['GET'])
def get_interactions():
    interactions = list(db.interactions.find())
    for interaction in interactions:
        interaction['_id'] = str(interaction['_id'])  # Convert ObjectId to string for JSON
    return jsonify(interactions)

if __name__ == '__main__':
    chatHistory_bp.run(debug=True, host="0.0.0.0", port=8000)
