WITH transformed AS (
    SELECT 
        a.index AS old_index,
        a.patientcode::INT AS patientcode,
        a.location AS location,
        a.date_of_birth::DATE AT TIME ZONE 'Asia/Dubai' AT TIME ZONE 'UTC' AS date_of_birth,
        a.health_habits AS health_habits,
        a.lifestyle AS lifestyle,
        CASE 
            WHEN a.gender_assigned_at_birth ILIKE 'male' THEN TRUE
            WHEN a.gender_assigned_at_birth ILIKE 'female' THEN FALSE
            ELSE NULL 
        END AS gender_assigned_at_birth,
        a.diet AS diet,
        a.socioeconomic_status AS socioeconomic_status,
        CASE 
            WHEN a.recall_frequency ILIKE '3 Months' THEN 3
            WHEN a.recall_frequency ILIKE '6 Months' THEN 6
            WHEN a.recall_frequency ILIKE 'Yearly' THEN 12
            ELSE NULL
        END AS recall_frequency,
        a.health_concerns AS health_concerns,
        NULLIF(a.date_of_last_visit, '')::TIMESTAMP AT TIME ZONE 'Asia/Dubai' AT TIME ZONE 'UTC' AS date_of_last_visit,  -- Convert to UTC
        a.referral_source2 AS referral_source2,
        a.hobbies AS hobbies,
        a.how_long_have_they_been_in_uae AS how_long_have_they_been_in_uae,
        a.occupation AS occupation,
        a.preferred_method_of_comms AS preferred_method_of_comms,
        product.purchased_product,
        NOW() AT TIME ZONE 'UTC' AS createdAt,
        NOW() AT TIME ZONE 'UTC' AS updatedAt
    FROM public.dubai a
    LEFT JOIN product ON a.patientcode = product.patientcode
)
INSERT INTO public.dubai_clean (
    patientcode, location, date_of_birth, health_habits, lifestyle, 
    gender_assigned_at_birth, diet, socioeconomic_status, recall_frequency, 
    health_concerns, date_of_last_visit, referral_source2, hobbies, 
    how_long_have_they_been_in_uae, occupation, preferred_method_of_comms,
    purchased_product, createdAt, updatedAt
)
SELECT 
    patientcode, location, date_of_birth, health_habits, lifestyle, 
    gender_assigned_at_birth, diet, socioeconomic_status, recall_frequency, 
    health_concerns, date_of_last_visit, referral_source2, hobbies, 
    how_long_have_they_been_in_uae, occupation, preferred_method_of_comms, 
    purchased_product, createdAt, updatedAt
FROM transformed;
