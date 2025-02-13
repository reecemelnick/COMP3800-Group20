import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
import joblib

data = pd.read_json('parsed_data.json')

data.fillna('unknown', inplace=True)

def add_unknown_to_encoder(data_column):
    encoder = LabelEncoder()
    data_column = pd.concat([data_column, pd.Series(['unknown'])], ignore_index=True)
    encoder.fit(data_column)

    return encoder

health_habits_encoder = add_unknown_to_encoder(data['HEALTH HABITS'])
data['HEALTH HABITS'] = health_habits_encoder.transform(data['HEALTH HABITS'])

gender_encoder = add_unknown_to_encoder(data['GENDER ASSIGNED AT BIRTH'])
data['GENDER ASSIGNED AT BIRTH'] = gender_encoder.transform(data['GENDER ASSIGNED AT BIRTH'])

diet_encoder = add_unknown_to_encoder(data['DIET'])
data['DIET'] = diet_encoder.transform(data['DIET'])

health_concern_encoder = add_unknown_to_encoder(data['HEALTH CONCERNS'])
data['HEALTH CONCERNS'] = health_concern_encoder.transform(data['HEALTH CONCERNS'])

economic_encoder = add_unknown_to_encoder(data['SOCIO- ECONOMIC STATUS'])
data['SOCIO- ECONOMIC STATUS'] = economic_encoder.transform(data['SOCIO- ECONOMIC STATUS'])

label_encoder = LabelEncoder()
data['TREATMENT PREFERENCE'] = label_encoder.fit_transform(data['TREATMENT PREFERENCE'])

X = data.drop('TREATMENT PREFERENCE', axis=1).values
y = data['TREATMENT PREFERENCE'].values

print(f"Label encoding for 'GENDER ASSIGNED AT BIRTH': {gender_encoder.classes_}")
print(f"Label encoding for 'HEALTH HABITS': {health_habits_encoder.classes_}")
print(f"Label encoding for 'DIET': {diet_encoder.classes_}")
print(f"Label encoding for 'HEALTH CONCERNS': {health_concern_encoder.classes_}")
print(f"Label encoding for 'SOCIO- ECONOMIC STATUS': {economic_encoder.classes_}")
print(f"Label encoding for 'TREATMENT PREFERENCE': {label_encoder.classes_}")

scaler = StandardScaler()
X = scaler.fit_transform(X)

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = Sequential([
    Dense(8, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(4, activation='relu'),
    Dropout(0.2),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

model.fit(X_train, y_train, epochs=15, batch_size=5, verbose=1)

model.save("treatment_preference_model.h5")
joblib.dump(health_habits_encoder, "health_habits_encoder.pkl")
joblib.dump(gender_encoder, "gender_encoder.pkl")
joblib.dump(diet_encoder, "diet_encoder.pkl")
joblib.dump(health_concern_encoder, "health_concern_encoder.pkl")
joblib.dump(economic_encoder, "economic_encoder.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")
joblib.dump(scaler, "scaler.pkl")

loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.2f}")
