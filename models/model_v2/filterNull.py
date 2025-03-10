input_dict = {"gender": "Male",
            "diet": "Vegan",
            "health_concern": "",
            "economic_status": "High",
            "health_habits": "Healthy Diet"}

for key in list(input_dict.keys()):
    if input_dict[key] == "":
        input_dict.pop(key)

for key in input_dict:
    print(key)

if("health_concern" in input_dict):
    print("in")
else:
    print("out")