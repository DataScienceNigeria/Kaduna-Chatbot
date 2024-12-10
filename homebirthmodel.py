from flask import Blueprint, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

homebirth_bp = Blueprint("homebirth", __name__, template_folder="templates")
CORS(homebirth_bp)

# Load the model from a .pickle file
with open('encoders.pkl', 'rb') as file:
    model = pickle.load(file)

@homebirth_bp.route('/homebirth', methods=['POST'])
def predict_outcome():
    # Get the JSON data from the POST request
    data = request.get_json()

    # Extract the features from the request data
    last_birth_caesarean = int(data.get('last_birth_caesarean'))
    religion = int(data.get('religion'))
    num_living_children = int(data.get('num_living_children'))
    wanted_last_child = int(data.get('wanted_last_child'))
    assistance_tba = int(data.get('assistance_tba'))
    num_antenatal_visits = int(data.get('num_antenatal_visits'))
    residing_with_partner = int(data.get('residing_with_partner'))
    fertility_preference = int(data.get('fertility_preference'))
    health_care_decision = int(data.get('health_care_decision'))
    beating_justified_out = int(data.get('beating_justified_out'))
    husband_education = int(data.get('husband_education'))
    residence_type = int(data.get('residence_type'))
    assistance_tba = int(data.get('assistance_tba'))
    assistance_tba = int(data.get('assistance_tba'))
    beating_justified_argue = int(data.get('beating_justified_argue'))
    husband_occupation = int(data.get('husband_occupation'))
    education_years = int(data.get('education_years'))
    education_group = int(data.get('education_group'))
    house_ownership = init(data.get('house_ownership'))

    # Hardcode fixed values

    # Combine all inputs into a feature array
    features = np.array([
        religion,
        residence_type,
        last_birth_caesarean,
        wanted_last_child,
        assistance_tba,
        num_living_children,
        living_with_partner,
        num_antenatal_visits,
        beating_justified_out,
        beating_justified_argue,
        health_care_decision,
        husband_education,
        education_years,
        education_group,
        husband_occupation,
        fertility_preference,
        house_ownership,
    ]).reshape(1, -1)

    # Make prediction using the trained model
    prediction = model.predict(features)

    # Convert NumPy prediction to native Python type
    prediction_result = int(prediction[0])

    # Return the prediction as JSON
    return jsonify({'prediction': prediction_result})

if __name__ == '__main__':
    homebirth_bp.run(debug=True, host="0.0.0.0", port=8000)
