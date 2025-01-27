import pandas as pd

def main():
    print("Hello, World!")

    df = pd.read_csv("../data.csv")

    print(df.head())

if __name__ == "__main__":
    main()
