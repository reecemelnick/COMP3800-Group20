CREATE OR REPLACE VIEW schedule_count_view_test AS
SELECT 
    DATE_TRUNC('month', schedule)::DATE AS month, 
    COUNT(*) AS total
FROM schedule_view_test
WHERE schedule IS NOT NULL
GROUP BY month
ORDER BY month;

WITH fixed_date AS (SELECT DATE '2025-02-15' AS current_date),
expected_results (month, total) AS (
    VALUES 
        (DATE '2025-03-01', 1),
        (DATE '2025-04-01', 2),
        (DATE '2025-07-01', 1),
        (DATE '2025-10-01', 2),
        (DATE '2026-01-01', 1),
        (DATE '2026-03-01', 1),
        (DATE '2026-04-01', 2),
        (DATE '2026-07-01', 1),
        (DATE '2026-10-01', 2),
        (DATE '2027-01-01', 1)
)
SELECT actual.month, actual.total, 
       (actual.total = expected.total) AS match
FROM schedule_count_view_test actual
LEFT JOIN expected_results expected USING (month);

DROP VIEW schedule_count_view_test;
DROP VIEW schedule_view_test;
DROP TABLE dubai_clean_test;
