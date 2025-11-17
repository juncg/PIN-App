DROP FUNCTION IF EXISTS toggle_subscription;

CREATE OR REPLACE FUNCTION toggle_subscription(
    post_id bigint,
    target_table text,
    given_user_id uuid
)
RETURNS TABLE(new_subscription_count bigint, user_subscribed boolean)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_table text;
    post_column text;
    old_subscribed boolean;
    new_subscribed boolean;
    delta int;
BEGIN
    -- Validate and set table names
    IF target_table = 'Petition' THEN
        user_table := 'User_Petition';
        post_column := 'petition_id';
    ELSIF target_table = 'Offer' THEN
        user_table := 'User_Offer';
        post_column := 'offer_id';
    ELSE
        RAISE EXCEPTION 'Invalid target_table';
    END IF;

    -- Atomically toggle subscription state with UPSERT
    -- For Offers: once subscribed, cannot unsubscribe (subscribed stays true)
    -- For Petitions: can toggle freely
    IF target_table = 'Offer' THEN
        -- Check if already subscribed (lock the row to prevent race conditions)
        EXECUTE format(
            'SELECT subscribed FROM %I WHERE user_id = $1 AND %I = $2 FOR UPDATE',
            user_table, post_column
        )
        INTO old_subscribed
        USING given_user_id, post_id;
        
        EXECUTE format(
            'INSERT INTO %I (user_id, %I, subscribed)
             VALUES ($1, $2, true)
             ON CONFLICT (user_id, %I)
             DO UPDATE SET subscribed = true
             RETURNING subscribed',
            user_table, post_column, post_column, user_table
        )
        INTO new_subscribed
        USING given_user_id, post_id;

    	delta := CASE WHEN old_subscribed THEN 0 ELSE 1 END;

    ELSE
        -- Petition: allow toggle
        EXECUTE format(
            'INSERT INTO %I (user_id, %I, subscribed)
             VALUES ($1, $2, true)
             ON CONFLICT (user_id, %I)
             DO UPDATE SET subscribed = NOT %I.subscribed
             RETURNING subscribed',
            user_table, post_column, post_column, user_table
        )
        INTO new_subscribed
        USING given_user_id, post_id;

    	delta := CASE WHEN new_subscribed THEN 1 ELSE -1 END;
    END IF;

    -- Update post subscription count atomically
    EXECUTE format(
        'UPDATE %I SET current_progress = GREATEST(0, COALESCE(current_progress, 0) + $1) 
         WHERE id = $2 RETURNING current_progress',
        target_table
    )
    INTO new_subscription_count
    USING delta, post_id;

    RETURN QUERY SELECT new_subscription_count, new_subscribed;
END;
$$;

REVOKE ALL ON FUNCTION toggle_subscription FROM PUBLIC;
REVOKE ALL ON FUNCTION toggle_subscription FROM anon;
REVOKE ALL ON FUNCTION toggle_subscription FROM authenticated;
