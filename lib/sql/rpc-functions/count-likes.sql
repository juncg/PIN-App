DROP FUNCTION IF EXISTS count_likes;

CREATE OR REPLACE FUNCTION count_likes(
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
    new_count bigint;
BEGIN
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

    EXECUTE format(
        'SELECT COUNT(*) FROM %I WHERE %I = $1 AND liked = true',
        user_table,
        post_column
    )
    INTO new_count
    USING post_id;

    EXECUTE format(
        'UPDATE %I SET likes = $1 WHERE id = $2 RETURNING likes',
        target_table
    )
    INTO new_count
    USING new_count, post_id;

    RETURN new_count;
END;
$$;

REVOKE ALL ON FUNCTION count_likes FROM PUBLIC;
REVOKE ALL ON FUNCTION count_likes FROM anon;
REVOKE ALL ON FUNCTION count_likes FROM authenticated;
