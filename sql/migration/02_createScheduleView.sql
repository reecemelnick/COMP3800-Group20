CREATE OR REPLACE VIEW schedule_view AS
WITH RECURSIVE schedule_cte AS (
    -- Start with the first valid schedule
    SELECT 
        recall_frequency,
        date_of_last_visit AS schedule,  -- Start from the last visit
        date_of_last_visit AS original_date
    FROM public.dubai_clean
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
