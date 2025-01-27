import pandas as pd
from sqlalchemy import create_engine, text

sync_engine = create_engine(
    "postgresql+psycopg://admin:123456@localhost/test",
    isolation_level='AUTOCOMMIT'
)

def main():
    try:
        with sync_engine.connect() as connection:
            # with connection.begin():
                connection.execute(text("DROP TABLE IF EXISTS canada;"))
                connection.execute(text("DROP TABLE IF EXISTS dubai;"))

        df = pd.read_csv("../data/canada.csv")
        print(df.head())

        df.to_sql(name='canada', con=sync_engine)

        df = pd.read_csv("../data/dubai.csv")
        print(df.head())

        df.to_sql(name='dubai', con=sync_engine)
    except Exception as e:
        print(e)


if __name__ == "__main__":
    main()
