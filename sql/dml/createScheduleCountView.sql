CREATE OR REPLACE VIEW schedule_count_view AS
SELECT 
    DATE_TRUNC('month', schedule) AS month, 
    COUNT(*) AS count
FROM schedule_view
WHERE schedule IS NOT NULL
GROUP BY month
ORDER BY month;
