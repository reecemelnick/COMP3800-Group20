CREATE TABLE IF NOT EXISTS public.dubai_clean_test (
    index SERIAL PRIMARY KEY,
    recall_frequency SMALLINT,
    date_of_last_visit TIMESTAMP
);

INSERT INTO public.dubai_clean_test (
    recall_frequency, 
    date_of_last_visit
) VALUES
(3, '2025-01-23 15:30:00.000'),
(6, '2023-10-20 14:30:00.000'),
(12, '2025-03-21 15:30:00.000');

CREATE OR REPLACE VIEW schedule_view_test AS
WITH RECURSIVE schedule_cte AS (
    -- Start with the first valid schedule
    SELECT 
        recall_frequency,
        date_of_last_visit AS schedule,  -- Start from the last visit
        date_of_last_visit AS original_date
    FROM public.dubai_clean_test
    WHERE date_of_last_visit <= CURRENT_DATE + INTERVAL '2 years'  -- Only consider records within 2 years range
    UNION ALL
    -- Generate future schedules
    SELECT 
        recall_frequency,
        schedule + (recall_frequency * INTERVAL '1 month'),
        original_date
    FROM schedule_cte
    WHERE 
        schedule + (recall_frequency * INTERVAL '1 month') <= CURRENT_DATE + INTERVAL '2 years' -- Stay within the 2-year window
)
-- Only include schedules that are in the valid range
SELECT original_date, schedule 
FROM schedule_cte 
WHERE schedule >= CURRENT_DATE;

WITH fixed_date AS (SELECT DATE '2025-02-15' AS current_date)
SELECT COUNT(*) = 14 AS test_passed
FROM schedule_view_test
WHERE schedule BETWEEN (SELECT current_date FROM fixed_date) 
                   AND (SELECT current_date FROM fixed_date) + INTERVAL '2 years';
