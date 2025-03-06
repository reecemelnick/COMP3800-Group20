import json

# Note: run this in venv or change paths accordingly

input_file = './data/dubai_clean.json' 
output_file = './models/model_buyers_v1/parsed_data.json'

# opens file in read mode
with open(input_file, 'r') as file:
    # reads and parses json data from file into an object
    data = json.load(file)

parsed_data = []
for entry in data:
    parsed_entry = {
        "gender_assigned_at_birth": entry.get("gender_assigned_at_birth"),
        "health_habits": entry.get("health_habits"),
        "diet": entry.get("diet"),
        "socioeconomic_status": entry.get("socioeconomic_status"),
        "health_concerns": entry.get("health_concerns"),
        "purchased_product": entry.get("purchased_product")
    }
    parsed_data.append(parsed_entry)

# write parsed data to file with indentation
with open(output_file, 'w') as output:
    json.dump(parsed_data, output, indent=4)

print(f"Parsed data has been saved to '{output_file}'")
