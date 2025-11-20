
-- Create update policy for soft delete with data nullification
create policy "Soft delete own account with restrictions"
on "public"."User"
for update
to authenticated
using (
    (auth.uid() = id)
    AND deleted_at IS NULL
    AND NOT EXISTS (
        SELECT 1
        FROM "Offer"
        WHERE creator_id = auth.uid()
        AND state = 'Posted'
    )
)
with check (
    (auth.uid() = id)
    AND (
        -- Allow setting deleted_at and nullifying personal data
        deleted_at IS NOT NULL
        AND username IS NULL
        AND email IS NULL
        AND profile_image_url IS NULL
        AND description IS NULL
        -- public_user_follows can remain as it's not personal data
    )
);

-- Read policy to show deleted users differently
create policy "Read access for all users"
on "public"."User"
for select
to public
using (true);
