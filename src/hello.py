import pandas as pd

def main():
    df = pd.read_csv("../data/canada.csv")
    print(df.head())

    df = pd.read_csv("../data/dubai.csv")
    print(df.head())

if __name__ == "__main__":
    main()
