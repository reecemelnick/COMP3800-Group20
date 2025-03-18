import sys
import json
import pandas as pd

jsonData = json.loads(sys.argv[1])

key = jsonData["key"]

data = pd.read_json("data/dubai_clean.json")

df = pd.DataFrame(data, columns=[key])

unique_values = df[key].drop_duplicates().to_list()

print(json.dumps({key: unique_values}), end="")
