alter policy "Insert for authenticated users only"
on "public"."Offer"
to authenticated
with check (
	(auth.uid() = creator_id)
);

alter policy "Read access for all users"
on "public"."Offer"
to public
using (
	true
);

alter policy "Update for authenticated users only"
on "public"."Offer"
to authenticated
using (
	(auth.uid() = creator_id)
);
