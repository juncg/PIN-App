alter policy "Insert for authenticated users only"
on "public"."User_User"
to authenticated
with check (
	(auth.uid() = user_id)
);

alter policy "Read access on condition"
on "public"."User_User"
to public
using (
  (auth.uid() = user_id) OR 
  (EXISTS (
    SELECT 1
    FROM "User" u
    WHERE (u.id = "User_User".user_id) AND (u.public_user_follows = true)
  ))
);

alter policy "Update for authenticated users only"
on "public"."User_User"
to authenticated
using (
	(auth.uid() = user_id)
);
