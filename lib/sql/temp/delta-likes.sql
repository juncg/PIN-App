DROP FUNCTION IF EXISTS delta_likes;

CREATE OR REPLACE FUNCTION delta_likes(
    post_id bigint,
    target_table text
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_table text;
    post_column text;
    user_like_state boolean;
    delta int;
    new_count bigint;
    calling_user_id uuid;
BEGIN
    calling_user_id := auth.uid();
    IF calling_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- Validate table
    IF target_table = 'Petition' THEN
        user_table := 'User_Petition';
        post_column := 'petition_id';
    ELSIF target_table = 'Offer' THEN
        user_table := 'User_Offer';
        post_column := 'offer_id';
    ELSE
        RAISE EXCEPTION 'Invalid target_table';
    END IF;

    -- Check calling user's like state
    EXECUTE format(
        'SELECT liked FROM %I WHERE %I = $1 AND user_id = $2',
        user_table,
        post_column
    )
    INTO user_like_state
    USING post_id, calling_user_id;

    -- Determine delta based on user's state
    IF user_like_state IS NULL THEN
        RAISE EXCEPTION 'User has no like record';
    ELSIF user_like_state = true THEN
        delta := 1;
    ELSE
        delta := -1;
    END IF;

    EXECUTE format(
        'UPDATE %I SET likes = GREATEST(0, COALESCE(likes, 0) + $1) WHERE id = $2 RETURNING likes',
        target_table
    )
    INTO new_count
    USING delta, post_id;

    RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION adjust_post_counter FROM PUBLIC;
REVOKE ALL ON FUNCTION adjust_post_counter FROM anon;
REVOKE ALL ON FUNCTION adjust_post_counter FROM authenticated;