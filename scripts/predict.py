import numpy as np
from tensorflow.keras.models import load_model
import joblib
import sys
import json
# Load saved model and encoders
model = load_model("src/treatment_preference_model.h5")
location_encoder = joblib.load("src/location_encoder.pkl")
health_habits_encoder = joblib.load("src/health_habits_encoder.pkl")
label_encoder = joblib.load("src/label_encoder.pkl")
scaler = joblib.load("src/scaler.pkl")

formData = json.loads(sys.argv[1])
# print(f"{formData}")
# print(f"Form Data: {formData["health_habits"]}")

# location = formData["location"]
# health_habits = formData["health_habits"]

location = "Vancouver"
health_habits = "Exercise"

location_encoded = location_encoder.transform([location])[0]
health_habits_encoded = health_habits_encoder.transform([health_habits])[0]

input_data = np.array([[location_encoded, health_habits_encoded]])
input_data = scaler.transform(input_data)

probabilities = model.predict(input_data)

probability_class_1 = probabilities[0][0]
probability_class_0 = 1 - probability_class_1

predicted_class = (probability_class_1 > 0.5).astype(int)
decoded_prediction = label_encoder.inverse_transform([predicted_class])[0]

non_predicted_class = 1 - predicted_class
decoded_non_predicted_class = label_encoder.inverse_transform([non_predicted_class])[0]

# print(f"Predicted Treatment Preference: {decoded_prediction} (Class {predicted_class})")
# print(f"Probability for {decoded_non_predicted_class}: {probability_class_0:.2f}")
# print(f"Probability for {decoded_prediction}: {probability_class_1:.2f}")

# converts to standard python float type
probability_class_1 = float(probability_class_1) 
probability_class_0 = float(probability_class_0)

result = {
    "predicted_class": decoded_prediction,
    "probability_for_predicted_class": round(probability_class_1, 2),
    "probability_for_non_predicted_class": round(probability_class_0, 2),
    "non_predicted_class": decoded_non_predicted_class
}

# print("Content-Type: application/json") 
# print()
print(json.dumps(result), end="")