import json

input_file = '../../data/canada.json' 
output_file = 'parsed_data.json'

with open(input_file, 'r') as file:
    data = json.load(file)

parsed_data = []
for entry in data:
    parsed_entry = {
        "GENDER ASSIGNED AT BIRTH": entry.get("GENDER ASSIGNED AT BIRTH"),
        "HEALTH HABITS": entry.get("HEALTH HABITS"),
        "DIET": entry.get("DIET"),
        "SOCIO- ECONOMIC STATUS": entry.get("SOCIO- ECONOMIC STATUS"),
        "HEALTH CONCERNS": entry.get("HEALTH CONCERNS"),
        "TREATMENT PREFERENCE": entry.get("TREATMENT PREFERENCE")
    }
    parsed_data.append(parsed_entry)

# Write the parsed data to the output JSON file
with open(output_file, 'w') as output:
    json.dump(parsed_data, output, indent=4)

print(f"Parsed data has been saved to '{output_file}'")
