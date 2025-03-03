CREATE OR REPLACE VIEW schedule_count_view AS
SELECT 
    DATE_TRUNC('month', schedule)::DATE AS month, 
    COUNT(*) AS total
FROM schedule_view
WHERE schedule IS NOT NULL
GROUP BY month
ORDER BY month;
