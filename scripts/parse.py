import json

input_file = 'canada.json' 
output_file = 'parsed_data.json'

with open(input_file, 'r') as file:
    data = json.load(file)

parsed_data = []
for entry in data:
    parsed_entry = {
        "LOCATION": entry.get("LOCATION"),
        "HEALTH HABITS": entry.get("HEALTH HABITS"),
        "TREATMENT PREFERENCE": entry.get("TREATMENT PREFERENCE")
    }
    parsed_data.append(parsed_entry)

# Write the parsed data to the output JSON file
with open(output_file, 'w') as output:
    json.dump(parsed_data, output, indent=4)

print(f"Parsed data has been saved to '{output_file}'")
