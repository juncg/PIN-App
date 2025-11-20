alter policy "Insert for authenticated users only with business"
on "public"."Offer"
to authenticated
with check (
    (auth.uid() = creator_id)
    AND
    (
        -- Must be from a forum associated to a business that the user is associated with
        EXISTS (
            SELECT 1
            FROM "Forum" AS f
            JOIN "Business" AS b ON f."business_id" = b."id"
            WHERE f."id" = forum_id
            AND (
                b."owner_id" = auth.uid()
                OR EXISTS (
                    SELECT 1
                    FROM "Business_Employee" AS be
                    WHERE be."business_id" = b."id"
                    AND be."user_id" = auth.uid()
                )
            )
        )
    )
);

alter policy "Read access for all users"
on "public"."Offer"
to public
using (
    true
);

alter policy "Update for creator or forum owner"
on "public"."Offer"
to authenticated
using (
    (auth.uid() = creator_id)
    OR
    -- Allow if user is the owner of the forum the offer is in
    EXISTS (
        SELECT 1
        FROM "Forum" AS f
        WHERE f.id = forum_id
        AND f.business_id = (
            SELECT b.id
            FROM "Business" AS b
            WHERE b.owner_id = auth.uid()
            AND b.id = f.business_id
        )
    )
)
with check (
    (
        (auth.uid() = creator_id)
        OR
        EXISTS (
            SELECT 1
            FROM "Forum" AS f
            WHERE f.id = forum_id
            AND f.business_id = (
                SELECT b.id
                FROM "Business" AS b
                WHERE b.owner_id = auth.uid()
                AND b.id = f.business_id
            )
        )
    )
    AND
    (
        -- State: must be unchanged OR being set to 'Cancelled'
        (state = (SELECT state FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) OR state = 'Cancelled') AND
        
        -- Comment locked state: can change freely between valid values
        (comment_locked_state IN ('Locked', 'Unlocked')) AND
        
        -- All other fields must remain unchanged (compare with old values)
        title = (SELECT title FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) AND
        text = (SELECT text FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) AND
        fee = (SELECT fee FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) AND
        current_progress = (SELECT current_progress FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) AND
        target_progress = (SELECT target_progress FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) AND
        target_completition_date = (SELECT target_completition_date FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) AND
        forum_id = (SELECT forum_id FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id) AND
        creator_id = (SELECT creator_id FROM "Offer" AS old_offer WHERE old_offer.id = "Offer".id)
    )
);
