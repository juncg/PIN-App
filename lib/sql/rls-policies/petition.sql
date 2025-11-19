alter policy "Insert for authenticated users only"
on "public"."Petition"
to authenticated
with check (
	(auth.uid() = creator_id)
);

alter policy "Read access for all users"
on "public"."Petition"
to public
using (
	true
);

alter policy "Update for authenticated users only and time"
on "public"."Petition"
to authenticated
using (
    (auth.uid() = creator_id)
)
with check (
    (auth.uid() = creator_id) AND
    -- current_progress must ALWAYS remain unchanged (regardless of time)
    current_progress = (SELECT current_progress FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id) AND
    (
        -- Within 5 minutes: allow updates to most fields
        (
            now() < (created_at + '00:05:00'::interval) AND
            -- Within 5 minutes, only these fields must remain unchanged:
            creator_id = (SELECT creator_id FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id) AND
            forum_id = (SELECT forum_id FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id)
        ) OR
        
        -- After 5 minutes: very restricted updates only
        (
            now() >= (created_at + '00:05:00'::interval) AND
            -- State: must be unchanged OR being set to 'Cancelled'
            (state = (SELECT state FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id) OR state = 'Cancelled') AND
            
            -- Comment locked state: can change freely between valid values
            (comment_locked_state IN ('Locked', 'Unlocked')) AND
            
            -- All other fields must remain unchanged
            title = (SELECT title FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id) AND
            text = (SELECT text FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id) AND
            target_progress = (SELECT target_progress FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id) AND
            forum_id = (SELECT forum_id FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id) AND
            creator_id = (SELECT creator_id FROM "Petition" AS old_petition WHERE old_petition.id = "Petition".id)
        )
    )
);
