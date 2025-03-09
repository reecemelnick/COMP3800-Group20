import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
import joblib
import matplotlib.pyplot as plt


data = pd.read_json('./models/model_v2/parsed_data.json')

# fill missing values in the dataset with 'unknown' to maintain consistency
data.fillna('unknown', inplace=True)
def add_unknown_to_encoder(data_column):
    # creates and fits a LabelEncoder that includes 'unknown' as a valid category.
    encoder = LabelEncoder()
    data_column = pd.concat([data_column, pd.Series(['unknown'])], ignore_index=True)
    encoder.fit(data_column)
    return encoder

# each column from the data that will be trained on is encoded with an encoder that includes an 'unknown' category.
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

# separate the features (X) and the target variable (y) from the 'data' DataFrame.

# X contains all columns except 'TREATMENT PREFERENCE' (dropped using axis=1) 
X = data.drop('TREATMENT PREFERENCE', axis=1).values
# y contains only the 'TREATMENT PREFERENCE' column as the target variable 
y = data['TREATMENT PREFERENCE'].values

print(f"Label encoding for 'GENDER ASSIGNED AT BIRTH': {gender_encoder.classes_}")
print(f"Label encoding for 'HEALTH HABITS': {health_habits_encoder.classes_}")
print(f"Label encoding for 'DIET': {diet_encoder.classes_}")
print(f"Label encoding for 'HEALTH CONCERNS': {health_concern_encoder.classes_}")
print(f"Label encoding for 'SOCIO- ECONOMIC STATUS': {economic_encoder.classes_}")
print(f"Label encoding for 'TREATMENT PREFERENCE': {label_encoder.classes_}")

# standardize the feature data (X) by scaling each feature to have zero mean and unit variance.
scaler = StandardScaler()
X = scaler.fit_transform(X)

# Split the dataset into training and testing sets.
# 'train_test_split' divides the feature data (X) and the target labels (y) into training and testing subsets.
# The test size is specified as 20% (test_size=0.2), meaning 80% of the data will be used for training and 20% for testing.
# The 'random_state' is set to 42 to ensure reproducibility of the split, so the data is split the same way each time.
# X_train and y_train will be used for training the model, while X_test and y_test will be used to evaluate the model's performance.
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define a Sequential neural network model with three layers.
# The first layer is a Dense layer with 8 units and ReLU activation, 
# and the input shape is defined by the number of features in the training data (X_train.shape[1]).
# A Dropout layer with a rate of 0.2 is added after the first Dense layer to help prevent overfitting.
# The second layer is another Dense layer with 4 units and ReLU activation, followed by another Dropout layer with a rate of 0.2.
# The final layer is a Dense layer with 1 unit and a sigmoid activation function, which outputs a probability (for binary classification).

# The model architecture is designed to perform binary classification, 
# where the sigmoid activation in the final layer outputs values between 0 and 1.
# The Dropout layers are included to regularize the model and reduce overfitting during training.
model = Sequential([
    Dense(8, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(4, activation='relu'),
    Dropout(0.2),
    Dense(1, activation='sigmoid')
])

# Compile the model by specifying the optimizer, loss function, and metrics to track during training.
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# Train the model and capture the training history
history = model.fit(X_train, y_train, epochs=15, batch_size=5, verbose=1)

# Save the model and encoders as you have done previously
model.save("treatment_preference_model.h5")
joblib.dump(health_habits_encoder, "health_habits_encoder.pkl")
joblib.dump(gender_encoder, "gender_encoder.pkl")
joblib.dump(diet_encoder, "diet_encoder.pkl")
joblib.dump(health_concern_encoder, "health_concern_encoder.pkl")
joblib.dump(economic_encoder, "economic_encoder.pkl")
joblib.dump(label_encoder, "label_encoder.pkl")
joblib.dump(scaler, "scaler.pkl")

# Evaluate the model on the test set and print the results
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.2f}")
print(f"Test Loss: {loss:.2f}")

# Plot training accuracy and loss
import matplotlib.pyplot as plt

plt.figure(figsize=(12, 6))

# Plot training accuracy
plt.subplot(1, 2, 1)
plt.plot(history.history['accuracy'], label='Training Accuracy')
plt.title('Training Accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()

# Plot training loss
plt.subplot(1, 2, 2)
plt.plot(history.history['loss'], label='Training Loss')
plt.title('Training Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

