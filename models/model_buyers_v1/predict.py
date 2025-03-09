import numpy as np
from tensorflow.keras.models import load_model
import joblib
import sys
import json

# Load saved model and encoders
model = load_model("models/model_buyers_v1/saved/buyers_probability.keras")
gender_encoder = joblib.load("models/model_buyers_v1/saved/gender_encoder.pkl")
diet_encoder = joblib.load("models/model_buyers_v1/saved/diet_encoder.pkl")
health_concern_encoder = joblib.load("models/model_buyers_v1/saved/health_concern_encoder.pkl")
economic_encoder = joblib.load("models/model_buyers_v1/saved/economic_encoder.pkl")
health_habits_encoder = joblib.load("models/model_buyers_v1/saved/health_habits_encoder.pkl")
label_encoder = joblib.load("models/model_buyers_v1/saved/target_label_encoder.pkl")
scaler = joblib.load("models/model_buyers_v1/saved/scaler.pkl")

# print(sys.argv[1])
# formData = json.loads(sys.argv[1])
# print(formData)
formData = {
    "gender": "Female",
    "diet": "unknown",
    "health_concern": "unknown",
    "economic_status": "unknown",
    "health_habits": "unknown"
}

input_dict = {"gender": formData["gender"],
            "diet": formData["diet"],
            "health_concern": formData["health_concern"],
            "economic_status": formData["economic_status"],
            "health_habits": formData["health_habits"] }

# Remove any empty strings
for key in list(input_dict.keys()):
    if input_dict[key] == "":
        input_dict.pop(key)

# Empty 2D array to concatenate encoded features
input_data = np.array([[]])  

# Encodes features and adds them as columns to input_data
if "gender" in input_dict:
    gender_encoded = gender_encoder.transform([input_dict["gender"]])[0]
    input_data = np.hstack((input_data, np.array([[gender_encoded]])))

if "diet" in input_dict:
    diet_encoded = diet_encoder.transform([input_dict["diet"]])[0]
    input_data = np.hstack((input_data, np.array([[diet_encoded]])))

if "health_concern" in input_dict:
    health_concern_encoded = health_concern_encoder.transform([input_dict["health_concern"]])[0]
    input_data = np.hstack((input_data, np.array([[health_concern_encoded]])))

if "economic_status" in input_dict:
    economic_encoded = economic_encoder.transform([input_dict["economic_status"]])[0]
    input_data = np.hstack((input_data, np.array([[economic_encoded]])))

if "health_habits" in input_dict:
    health_habits_encoded = health_habits_encoder.transform([input_dict["health_habits"]])[0]
    input_data = np.hstack((input_data, np.array([[health_habits_encoded]])))

# Scale the input data
input_data = scaler.transform(input_data)

# Makes prediction and retrieves the row of each class's probabilities 
probabilities = model.predict(input_data)[0]

# Get index of the class with the highest probability
predicted_class_index = np.argmax(probabilities)
# Converts class with the highest probability to its original label
decoded_prediction = label_encoder.inverse_transform([predicted_class_index])[0]

# Prepare probability results
class_probabilities = {}

# Loop through each class index
for i in range(len(probabilities)):
    # Convert index to class label
    class_label = label_encoder.inverse_transform([i])[0]
    # Store the class label with its probability into the dictionary
    class_probabilities[class_label] = float(probabilities[i])

# Sort probabilities from highest to lowest
class_labels = list(class_probabilities.keys())
class_values = list(class_probabilities.values())
sorted_value_index = np.argsort(-np.array(class_values)) # - sorts the array in descending order, needed to convert list to array too
sorted_probabilities = {class_labels[i]: class_values[i] for i in sorted_value_index}

# Print results
print(f"Predicted Class: {decoded_prediction}") # highest probability
print(f"Class Probabilities: {json.dumps(sorted_probabilities, indent=2)}")

# Prepare final result JSON
result = {
    "predicted_class": decoded_prediction,
    "class_probabilities": sorted_probabilities
}

print(json.dumps(result), end="")
