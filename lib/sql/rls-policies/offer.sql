alter policy "Insert for authenticated users only with business"
on "public"."Offer"
to authenticated
with check (
    (auth.uid() = creator_id)
    AND (
        -- Either employee of a business
        EXISTS (
            SELECT 1 
            FROM "Business_Employee" 
            WHERE user_id = auth.uid()
        )
        OR
        -- Or owner of a business
        EXISTS (
            SELECT 1
            FROM "Business"
            WHERE owner_id = auth.uid()
        )
    )
);

alter policy "Read access for all users"
on "public"."Offer"
to public
using (
    true
);

alter policy "Update for authenticated users only on condition"
on "public"."Offer"
to authenticated
using (
    (auth.uid() = creator_id)
    AND (
        -- Either employee of a business
        EXISTS (
            SELECT 1 
            FROM "Business_Employee" 
            WHERE user_id = auth.uid()
        )
        OR
        -- Or owner of a business
        EXISTS (
            SELECT 1
            FROM "Business"
            WHERE owner_id = auth.uid()
        )
    )
)
with check (
    (auth.uid() = creator_id) AND
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
