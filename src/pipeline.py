from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text


class Pipeline:
    def __init__(self):
        self.url = "postgresql+psycopg://admin:123456@localhost/test"
        self.expected_columns = [
            "PatientCode",
            "Location",
            "Date Of Birth",
            "Health Habits",
            "Lifestyle",
            "Gender Assigned At Birth",
            "Diet",
            "Socioeconomic Status",
            "Recall Frequency",
            "Health Concerns",
            "Date of Last visit",
            "Referral Source2",
            "Hobbies",
            "How long have they been in UAE",
            "Occupation",
            "Preferred Method of Comms",
        ]
        self.connect()

    def connect(self):
        self.sync_engine = create_engine(self.url, isolation_level='AUTOCOMMIT')

    def createTable(self):
        with self.sync_engine.connect() as connection:
            with open("../sql/ddl/createDubaiTable.sql", "r") as file:
                connection.execute(text(file.read()))

    def cleanup(self):
        with self.sync_engine.connect() as connection:
            with open("../sql/ddl/dropTables.sql", "r") as file:
                connection.execute(text(file.read()))

    def extra(self, f_name):
        file_type = Path(f_name).suffix
        if file_type == ".csv":
            self.df = pd.read_csv(f_name, usecols=self.expected_columns)
        elif file_type == ".xlsx":
            self.df = pd.read_excel(f_name)
        else:
            print("Not supported file type!")

    def transform(self):
        self.df = self.df.dropna(axis=1, how="all")
        self.df.columns = self.df.columns.str.replace(r"[^a-zA-Z0-9_]", "_", regex=True).str.lower()

        max_lengths = {
            'location': 20,
            'health_habits': 20,
            'lifestyle': 10,
            'diet': 15,
            'socioeconomic_status': 10,
            'health_concerns': 20,
            'referral_source2': 20,
            'how_long_have_they_been_in_uae': 50,
            'occupation': 100,
            'preferred_method_of_comms': 15,
        }

        for column, max_len in max_lengths.items():
            # Check if any value in the column exceeds the max length
            exceeded = self.df[column].apply(lambda x: len(str(x)) > max_len)
            if exceeded.any():
                print(f"Column '{column}' has values exceeding max length of {max_len}:")
                print(self.df[column][exceeded])
        # print(self.df.head())

    def load(self, table_name):
        self.df.to_sql(name=table_name, con=self.sync_engine, if_exists="replace")

    def process_data(self):
        with self.sync_engine.connect() as connection:
            with open("../sql/dml/insertDubai.sql", "r") as file:
                connection.execute(text(file.read()))

    def run(self, f_name, table_name):
        try:
            self.extra(f_name)
            self.transform()
            self.load(table_name)
        except Exception as e:
            print(e)
            exit(1)

    def run_dir(self, dir_name):
        dir_path = Path(dir_name)

        # Iterate over each file in the directory
        for f_name in dir_path.iterdir():
            print(f_name)
            try:
                self.extra(f_name)
                self.transform()
                self.load(Path(f_name).stem)
                print("-" * 50)  # Separator between files
            except Exception as e:
                print(e)


if __name__ == "__main__":
    pipeline = Pipeline()
    pipeline.cleanup()
    pipeline.createTable()
    # pipeline.run_dir("../raw_data")
    # pipeline.run("../data/canada.csv", "canada")
    pipeline.run("../raw_data/dubai.csv", "dubai")
    pipeline.process_data()
