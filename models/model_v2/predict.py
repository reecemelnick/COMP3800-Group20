import numpy as np
from tensorflow.keras.models import load_model
import joblib
import sys
import json

# Load saved model and encoders
model = load_model("treatment_preference_model.h5")
gender_encoder = joblib.load("gender_encoder.pkl")
diet_encoder = joblib.load("diet_encoder.pkl")
health_concern_encoder = joblib.load("health_concern_encoder.pkl")
economic_encoder = joblib.load("economic_encoder.pkl")
health_habits_encoder = joblib.load("health_habits_encoder.pkl")
label_encoder = joblib.load("label_encoder.pkl")
scaler = joblib.load("scaler.pkl")

gender = "Female"
diet = "Carnivore"
health_concern = "Heart"
economic_status = "Low"
health_habits = "Exercise"

gender_encoded = gender_encoder.transform([gender])[0]
diet_encoded = diet_encoder.transform([diet])[0]
health_concern_encoded = health_concern_encoder.transform([health_concern])[0]
economic_encoded = economic_encoder.transform([economic_status])[0]
health_habits_encoded = health_habits_encoder.transform([health_habits])[0]

input_data = np.array([[gender_encoded, 
                        health_habits_encoded, 
                        diet_encoded,
                        health_concern_encoded,
                        economic_encoded]])
input_data = scaler.transform(input_data)

probabilities = model.predict(input_data)

probability_class_1 = probabilities[0][0]
probability_class_0 = 1 - probability_class_1

predicted_class = (probability_class_1 > 0.5).astype(int)
decoded_prediction = label_encoder.inverse_transform([predicted_class])[0]

non_predicted_class = 1 - predicted_class
decoded_non_predicted_class = label_encoder.inverse_transform([non_predicted_class])[0]

print(f"Predicted Treatment Preference: {decoded_prediction} (Class {predicted_class})")
print(f"Probability for {decoded_non_predicted_class}: {probability_class_0:.2f}")
print(f"Probability for {decoded_prediction}: {probability_class_1:.2f}")

result = {
    "predicted_class": decoded_prediction,
    "probability_for_predicted_class": round(probability_class_1, 2),
    "probability_for_non_predicted_class": round(probability_class_0, 2),
    "non_predicted_class": decoded_non_predicted_class
}