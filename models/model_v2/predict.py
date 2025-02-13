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

input_dict = {"gender": "Male",
            "diet": "Vegan",
            "health_concern": "Respiratory",
            "economic_status": "High",
            "health_habits": "Stress management"}

for key in list(input_dict.keys()):
    if input_dict[key] == "":
        input_dict.pop(key)

input_data = np.array([[]])

if "gender" in input_dict:
    gender = input_dict["gender"]
    gender_encoded = gender_encoder.transform([gender])[0]
    input_data = np.append(input_data, np.array([[gender_encoded]]), axis=1) 

if "diet" in input_dict:
    diet = input_dict["diet"]
    diet_encoded = diet_encoder.transform([diet])[0]
    input_data = np.append(input_data, np.array([[diet_encoded]]), axis=1) 

if "health_concern" in input_dict:
    health_concern = input_dict["health_concern"]
    health_concern_encoded = health_concern_encoder.transform([health_concern])[0]
    input_data = np.append(input_data, np.array([[health_concern_encoded]]), axis=1)

if "economic_status" in input_dict:
    economic_status = input_dict["economic_status"]
    economic_encoded = economic_encoder.transform([economic_status])[0]
    input_data = np.append(input_data, np.array([[economic_encoded]]), axis=1)

if "health_habits" in input_dict:
    health_habits = input_dict["health_habits"]
    health_habits_encoded = health_habits_encoder.transform([health_habits])[0]
    input_data = np.append(input_data, np.array([[health_habits_encoded]]), axis=1)


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