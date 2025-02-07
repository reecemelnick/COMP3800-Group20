WITH transformed AS (
    SELECT 
        index AS old_index,
        patientcode::INT AS patientcode,
        location AS location,
        date_of_birth::DATE AS date_of_birth,
        health_habits AS health_habits,
        lifestyle AS lifestyle,
        CASE 
            WHEN gender_assigned_at_birth ILIKE 'male' THEN TRUE
            WHEN gender_assigned_at_birth ILIKE 'female' THEN FALSE
            ELSE NULL 
        END AS gender_assigned_at_birth,
        diet AS diet,
        socioeconomic_status AS socioeconomic_status,
        CASE 
            WHEN recall_frequency ILIKE '3 Months' THEN 3
            WHEN recall_frequency ILIKE '6 Months' THEN 6
            WHEN recall_frequency ILIKE 'Yearly' THEN 12
            ELSE NULL
        END AS recall_frequency,
        health_concerns AS health_concerns,
        NULLIF(date_of_last_visit, '')::TIMESTAMP AS date_of_last_visit,
        referral_source2 AS referral_source2,
        hobbies AS hobbies,
        how_long_have_they_been_in_uae AS how_long_have_they_been_in_uae,
        occupation AS occupation,
        preferred_method_of_comms AS preferred_method_of_comms,
        NOW() AS createdAt,
        NOW() AS updatedAt
    FROM public.dubai
)
INSERT INTO public.dubai_clean (
    patientcode, location, date_of_birth, health_habits, lifestyle, 
    gender_assigned_at_birth, diet, socioeconomic_status, recall_frequency, 
    health_concerns, date_of_last_visit, referral_source2, hobbies, 
    how_long_have_they_been_in_uae, occupation, preferred_method_of_comms, 
    createdAt, updatedAt
)
SELECT 
    patientcode, location, date_of_birth, health_habits, lifestyle, 
    gender_assigned_at_birth, diet, socioeconomic_status, recall_frequency, 
    health_concerns, date_of_last_visit, referral_source2, hobbies, 
    how_long_have_they_been_in_uae, occupation, preferred_method_of_comms, 
    createdAt, updatedAt
FROM transformed;
