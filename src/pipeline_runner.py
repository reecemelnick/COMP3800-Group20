import sys

from pipeline import Dubai_pipeline

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
            "Purchased Product",
        ],
        sys.argv[1],
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
            'purchased_product': 20,
        },
    )
    # dubai_pipeline.cleanup()
    dubai_pipeline.run()

    dubai_pipeline.createTable()
    dubai_pipeline.process_data()
