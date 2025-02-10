CREATE OR REPLACE VIEW schedule_view AS
SELECT 
    recall_frequency,
    date_of_last_visit,
    date_of_last_visit + (recall_frequency * INTERVAL '1 month') AS schedule
FROM public.dubai_clean;
