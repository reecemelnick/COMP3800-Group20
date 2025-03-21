from pathlib import Path

import pandas as pd
from sqlalchemy import create_engine, text


class Pipeline:
    def __init__(self, columns, f_name, table_name, max_lengths):
        self.url = "postgresql+psycopg://admin:123456@localhost/test"
        self.expected_columns = columns
        self.f_name = f_name
        self.table_name = table_name.lower()
        self.create_sql = Path.joinpath(Path("sql/ddl").resolve(), f'create{table_name.capitalize()}CleanTable.sql')
        self.drop_sql = Path.joinpath(Path("sql/ddl").resolve(), f'drop{table_name.capitalize()}.sql')
        self.insert_sql = ""
        self.max_lengths = max_lengths
        self.connect()

    def connect(self):
        self.sync_engine = create_engine(self.url, isolation_level='AUTOCOMMIT')

    def createTable(self):
        with self.sync_engine.connect() as connection:
            with open(self.create_sql, "r") as file:
                connection.execute(text(file.read()))

    def cleanup(self):
        with self.sync_engine.connect() as connection:
            with open(self.drop_sql, "r") as file:
                connection.execute(text(file.read()))

    def extract(self):
        file_type = Path(self.f_name).suffix
        if file_type == ".csv":
            self.df = pd.read_csv(self.f_name, usecols=self.expected_columns)
            # self.df = pd.read_csv(self.f_name)
        elif file_type == ".xlsx":
            self.df = pd.read_excel(self.f_name)
        else:
            print("Not supported file type!")

    def transform(self):
        self.df = self.df.dropna(axis=1, how="all")
        self.df.columns = self.df.columns.str.replace(r"[^a-zA-Z0-9_]", "_", regex=True).str.lower()

        for column, max_len in self.max_lengths.items():
            # Check if any value in the column exceeds the max length
            exceeded = self.df[column].apply(lambda x: len(str(x)) > max_len)
            if exceeded.any():
                print(f"Column '{column}' has values exceeding max length of {max_len}:")
                print(self.df[column][exceeded])
        # print(self.df.head())

    def load(self):
        self.df.to_sql(name=self.table_name, con=self.sync_engine, if_exists="replace")

    def process_data(self):
        pass

    def run(self):
        try:
            self.extract()
            self.transform()
            self.load()
        except Exception as e:
            print(e)
            exit(1)

    def run_dir(self, dir_name):
        dir_path = Path(dir_name)

        # Iterate over each file in the directory
        for f_name in dir_path.iterdir():
            print(f_name)
            try:
                self.extract(f_name)
                self.transform()
                self.load(Path(f_name).stem)
                print("-" * 50)  # Separator between files
            except Exception as e:
                print(e)


class Dubai_pipeline(Pipeline):
    def __init__(self, columns, f_name, table_name, max_lengths):
        super().__init__(columns, f_name, table_name, max_lengths)

        self.insert_sql = Path.joinpath(Path("sql/dml").resolve(), f'insert{table_name.capitalize()}.sql')

    def process_data(self):
        with self.sync_engine.connect() as connection:
            with open(self.insert_sql, "r") as file:
                connection.execute(text(file.read()))
