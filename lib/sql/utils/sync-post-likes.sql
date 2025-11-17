-- Restores likes in posts to their actual value

UPDATE "Offer" SET likes = 0;

-- Update only those with actual likes
UPDATE "Offer" o
SET likes = like_counts.count
FROM (
    SELECT offer_id, COUNT(*) as count
    FROM "User_Offer"
    WHERE liked = true
    GROUP BY offer_id
) like_counts
WHERE o.id = like_counts.offer_id;


UPDATE "Petition" SET likes = 0;

UPDATE "Petition" p
SET likes = like_counts.count
FROM (
    SELECT petition_id, COUNT(*) as count
    FROM "User_Petition"
    WHERE liked = true
    GROUP BY petition_id
) like_counts
WHERE p.id = like_counts.petition_id;


UPDATE "Review" SET likes = 0;

UPDATE "Review" r
SET likes = like_counts.count
FROM (
    SELECT review_id, COUNT(*) as count
    FROM "User_Review"
    WHERE liked = true
    GROUP BY review_id
) like_counts
WHERE r.id = like_counts.review_id;

-- View results
SELECT 'Petitions' as type, id, likes 
FROM "Petition"
WHERE id IN (SELECT DISTINCT petition_id FROM "User_Petition")
UNION ALL
SELECT 'Offers' as type, id, likes 
FROM "Offer"
WHERE id IN (SELECT DISTINCT offer_id FROM "User_Offer")
UNION ALL
SELECT 'Reviews' as type, id, likes
FROM "Review"
WHERE id IN (SELECT DISTINCT review_id FROM "User_Review")
ORDER BY type, id;
