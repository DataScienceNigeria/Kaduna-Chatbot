from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
import os
import json
from flask_cors import CORS
from pymongo import MongoClient

history_bp = Blueprint("history", __name__, template_folder="templates")
CORS(history_bp)

load_dotenv()

# Connect to MongoDB
MONGO_NAME = os.getenv("MONGO_NAME")
MONGO_DB = os.getenv("MONGO_DB")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_CLUSTER = os.getenv("MONGO_CLUSTER")

mongo_string = f"mongodb+srv://{MONGO_NAME}:{MONGO_PASSWORD}@{MONGO_CLUSTER}/?retryWrites=true&w=majority&appName={MONGO_DB}"

client = MongoClient(mongo_string)
db = client['GeoST4R-Chathistory']
collection = db["GeoST4R-Chathistory"]

@history_bp.route('/interact', methods=['POST'])
def save_chat_history():
    try:
        # Get data from the request
        data = request.json
        
        # Validate the incoming data (assuming it has 'conversationId' and 'message')
        if "conversationId" not in data or "message" not in data:
            return jsonify({"error": "Invalid data, 'conversationId' and 'message' are required"}), 400
        
        # Insert data into MongoDB
        inserted = collection.insert_one({
            "conversationId": data["conversationId"],
            "message": data["message"]
        })

        return jsonify({"success": True, "inserted_id": str(inserted.inserted_id)}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    history_bp.run(debug=True, host="0.0.0.0", port=8000)