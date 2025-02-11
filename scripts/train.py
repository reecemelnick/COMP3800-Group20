import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense
from tensorflow.keras.models import save_model
import joblib  # For saving encoders and scalers

data = pd.read_json('parsed_data.json')

location_encoder = LabelEncoder()
data['LOCATION'] = location_encoder.fit_transform(data['LOCATION'])

health_habits_encoder = LabelEncoder()
data['HEALTH HABITS'] = health_habits_encoder.fit_transform(data['HEALTH HABITS'])

label_encoder = LabelEncoder()
data['TREATMENT PREFERENCE'] = label_encoder.fit_transform(data['TREATMENT PREFERENCE'])

X = data.drop('TREATMENT PREFERENCE', axis=1).values
y = data['TREATMENT PREFERENCE'].values

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = Sequential([
    Dense(8, activation='relu', input_shape=(X_train.shape[1],)),
    Dense(4, activation='relu'),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

model.fit(X_train, y_train, epochs=15, batch_size=5, verbose=1)

model.save("treatment_preference_model.h5")
joblib.dump(location_encoder, "location_encoder.pkl")
joblib.dump(health_habits_encoder, "health_habits_encoder.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")
joblib.dump(scaler, "scaler.pkl")

loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.2f}")
