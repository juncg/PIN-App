alter policy "Insert for authenticated users only"
on "public"."User_Offer"
to authenticated
with check (
	(auth.uid() = user_id)
);

alter policy "Read access for authenticated users"
on "public"."User_Offer"
to authenticated
using (
	(auth.uid() = user_id)
);

alter policy "Update for authenticated users on condition"
on "public"."User_Offer"
to authenticated
using (
	(auth.uid() = user_id)
) with check (
	(auth.uid() = user_id) AND
  	(liked IS NOT DISTINCT FROM (SELECT liked FROM "User_Offer" WHERE offer_id = "User_Offer".offer_id AND user_id = auth.uid())) AND
  	(subscribed IS NOT DISTINCT FROM (SELECT subscribed FROM "User_Offer" WHERE offer_id = "User_Offer".offer_id AND user_id = auth.uid()))
);
