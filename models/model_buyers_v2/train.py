import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_squared_error, r2_score

# Ridge-regression model
# USE model_buyers_v1

data = pd.read_json('./models/model_buyers_v2/parsed_data.json')

data.fillna('unknown', inplace=True)

# replace boolean values with sex
data['gender_assigned_at_birth'] = data['gender_assigned_at_birth'].replace({True: 'Male', False: 'Female'})

# encodes "unknown" as a number along with other categories of a column
def add_unknown_to_encoder(data_column):
    encoder = LabelEncoder()
    data_column = pd.concat([data_column, pd.Series(['unknown'])], ignore_index=True)
    encoder.fit(data_column)

    return encoder

# add "unknown" to the pool of possible labels
health_habits_encoder = add_unknown_to_encoder(data['health_habits'])
data['health_habits'] = health_habits_encoder.transform(data['health_habits'])

gender_encoder = add_unknown_to_encoder(data['gender_assigned_at_birth'])
data['gender_assigned_at_birth'] = gender_encoder.transform(data['gender_assigned_at_birth'])

diet_encoder = add_unknown_to_encoder(data['diet'])
data['diet'] = diet_encoder.transform(data['diet'])

health_concern_encoder = add_unknown_to_encoder(data['health_concerns'])
data['health_concerns'] = health_concern_encoder.transform(data['health_concerns'])

economic_encoder = add_unknown_to_encoder(data['socioeconomic_status'])
data['socioeconomic_status'] = economic_encoder.transform(data['socioeconomic_status'])

# encode target column: purchased_product
target_label_encoder = LabelEncoder()
data['purchased_product'] = target_label_encoder.fit_transform(data['purchased_product'])

# retrieve input features
x = data.drop('purchased_product', axis=1).values
# retrieve target variable
y = data['purchased_product'].values

# print(f"Label encoding for 'gender_assigned_at_birth': {gender_encoder.classes_}")
# print(f"Label encoding for 'health_habits': {health_habits_encoder.classes_}")
# print(f"Label encoding for 'diet': {diet_encoder.classes_}")
# print(f"Label encoding for 'health_concerns': {health_concern_encoder.classes_}")
# print(f"Label encoding for 'socioeconomic_status': {economic_encoder.classes_}")
# print(f"Label encoding for 'purchased_product': {target_label_encoder.classes_}")

# split testing and training sets
x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# scales input features to have a mean of 0 and sd of 1, ensuring features are on the same scale
scaler = StandardScaler()
x_train_scaled = scaler.fit_transform(x_train)
x_test_scaled = scaler.fit_transform(x_test)

ridge_model = Ridge(alpha=1.0)
ridge_model.fit(x_train_scaled, y_train)

y_pred = ridge_model.predict(x_test_scaled)

mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

joblib.dump(health_habits_encoder, "./models/model_buyers_v2/saved/health_habits_encoder.pkl")
joblib.dump(gender_encoder, "./models/model_buyers_v2/saved/gender_encoder.pkl")
joblib.dump(diet_encoder, "./models/model_buyers_v2/saved/diet_encoder.pkl")
joblib.dump(health_concern_encoder, "./models/model_buyers_v2/saved/health_concern_encoder.pkl")
joblib.dump(economic_encoder, "./models/model_buyers_v2/saved/economic_encoder.pkl")
joblib.dump(target_label_encoder, "./models/model_buyers_v2/saved/target_label_encoder.pkl")
joblib.dump(scaler, "./models/model_buyers_v2/saved/scaler.pkl")

# Print the results
print("Mean Squared Error (MSE):", mse)
print("R-squared (R²):", r2)

