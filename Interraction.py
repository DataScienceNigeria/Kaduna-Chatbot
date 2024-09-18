from flask import Blueprint, request, jsonify, current_app
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
import json
from flask_cors import CORS
from pymongo import MongoClient

history_bp = Blueprint("history", __name__, template_folder="templates")
CORS(history_bp)

load_dotenv()

# Connect to MongoDB
# MONGO_NAME = os.getenv("MONGO_NAME")
# MONGO_DB = os.getenv("MONGO_DB")
# MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
# MONGO_CLUSTER = os.getenv("MONGO_CLUSTER")

# mongo_string = f"mongodb+srv://{MONGO_NAME}:{MONGO_PASSWORD}@{MONGO_CLUSTER}/?retryWrites=true&w=majority&appName={MONGO_DB}"

@history_bp.route('/interact', methods=['POST', 'GET'])
def save_chat_history():
    collection = current_app.config['mongo_collection']

    try:
        # Get JSON data from the POST request
        data = request.get_json()

        # Insert the chat history data into the MongoDB collection
        result = collection.insert_one({
            "conversationId": data["conversationId"],
            "messages": data["messages"]
        })

        # Return a success message with the inserted document's ID
        return jsonify({"message": "Chat history saved", "id": str(result.inserted_id)}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500


    # if request.method =='POST':
    #     data = request.json    
    #     # Insert data into MongoDB
    #     inserted = collection.insert_one({
    #         "conversationId": data["conversationId"],
    #         "message": data["message"]
    #     })

    # return jsonify({"success": True, "inserted_id": str(inserted.inserted_id)}), 201
    
if __name__ == '__main__':
    history_bp.run(debug=True, host="0.0.0.0", port=8000)