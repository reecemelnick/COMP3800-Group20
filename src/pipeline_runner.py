from pipeline import Blind_pipeline, Dubai_pipeline, Product_pipeline

if __name__ == "__main__":
    dubai_pipeline = Dubai_pipeline(
        [
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
        ],
        'raw_data/dubai.csv',
        'dubai',
        {
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
        },
        'product',
    )

    blind_pipeline = Blind_pipeline(
        [
            "Sex",
            "PatientCode",
            "Date Of Birth",
            "Last Completed Appt Date",
            "How did they hear about us?",
            "Hobbies",
            "How long have they been in UAE",
            "Occupation",
            "Preferred Method of Comms",
        ],
        'raw_data_market/blind_data.csv',
        'blind',
        {},
    )

    product_pipeline = Product_pipeline(
        [
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
            "Purchased Product",
        ],
        'raw_data_market/product_data.csv',
        'product',
        {
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
            'purchased_product': 20,
        },
    )
    # dubai_pipeline.cleanup()
    dubai_pipeline.createTable()
    dubai_pipeline.run()

    # blind_pipeline.cleanup()
    blind_pipeline.run()

    # product_pipeline.cleanup()
    product_pipeline.run()

    dubai_pipeline.process_data()
