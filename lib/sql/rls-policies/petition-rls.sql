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
	((auth.uid() = creator_id) AND (now() < (created_at + '00:05:00'::interval)))
);
