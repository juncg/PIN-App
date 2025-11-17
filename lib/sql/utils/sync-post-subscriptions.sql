UPDATE "Offer" SET current_progress = 0;

-- Update only those with actual subscribers
UPDATE "Offer" o
SET current_progress = subscriber_counts.count
FROM (
    SELECT offer_id, COUNT(*) as count
    FROM "User_Offer"
    WHERE subscribed = true
    GROUP BY offer_id
) subscriber_counts
WHERE o.id = subscriber_counts.offer_id;


UPDATE "Petition" SET current_progress = 0;

UPDATE "Petition" p
SET current_progress = subscriber_counts.count
FROM (
    SELECT petition_id, COUNT(*) as count
    FROM "User_Petition"
    WHERE subscribed = true
    GROUP BY petition_id
) subscriber_counts
WHERE p.id = subscriber_counts.petition_id;

-- View results
SELECT 'Petitions' as type, id, current_progress 
FROM "Petition"
WHERE id IN (SELECT DISTINCT petition_id FROM "User_Petition")
UNION ALL
SELECT 'Offers' as type, id, current_progress 
FROM "Offer"
WHERE id IN (SELECT DISTINCT offer_id FROM "User_Offer")
ORDER BY type, id;
