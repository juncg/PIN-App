DROP FUNCTION IF EXISTS toggle_like;

CREATE OR REPLACE FUNCTION toggle_like(
    post_id bigint,
    target_table text,
    given_user_id uuid
)
RETURNS TABLE(new_like_count bigint, user_liked boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_table text;
    post_column text;
    new_liked boolean;
    delta int;
BEGIN
    -- Validate and set table names
    IF target_table = 'Petition' THEN
        user_table := 'User_Petition';
        post_column := 'petition_id';
    ELSIF target_table = 'Offer' THEN
        user_table := 'User_Offer';
        post_column := 'offer_id';
    ELSIF target_table = 'Review' THEN
        user_table := 'User_Review';
        post_column := 'review_id';
    ELSE
        RAISE EXCEPTION 'Invalid target_table';
    END IF;

    -- Atomically toggle like state with UPSERT
    EXECUTE format(
        'INSERT INTO %I (user_id, %I, liked)
         VALUES ($1, $2, true)
         ON CONFLICT (user_id, %I)
         DO UPDATE SET liked = NOT %I.liked
         RETURNING liked',
        user_table, post_column, post_column, user_table
    )
    INTO new_liked
    USING given_user_id, post_id;

    -- Calculate delta
    delta := CASE WHEN new_liked THEN 1 ELSE -1 END;

    -- Update post like count atomically
    EXECUTE format(
        'UPDATE %I SET likes = GREATEST(0, COALESCE(likes, 0) + $1) 
         WHERE id = $2 RETURNING likes',
        target_table
    )
    INTO new_like_count
    USING delta, post_id;

    RETURN QUERY SELECT new_like_count, new_liked;
END;
$$;

REVOKE ALL ON FUNCTION toggle_like FROM PUBLIC;
REVOKE ALL ON FUNCTION toggle_like FROM anon;
REVOKE ALL ON FUNCTION toggle_like FROM authenticated;
