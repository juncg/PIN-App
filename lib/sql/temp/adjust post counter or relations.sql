DROP FUNCTION IF EXISTS adjust_post_counter;

CREATE OR REPLACE FUNCTION adjust_post_counter(
    p_post_id bigint,
    p_target_table text,
    p_target_column text,
    p_increment boolean
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_new_count bigint;
BEGIN
    -- Atomically increment or decrement
    EXECUTE format(
        'UPDATE %I SET %I = GREATEST(0, COALESCE(%I,0) + $1) WHERE id = $2 RETURNING %I',
        p_target_table, p_target_column, p_target_column, p_target_column
    )
    INTO v_new_count
    USING CASE WHEN p_increment THEN 1 ELSE -1 END, p_post_id;

    RETURN v_new_count;
END;
$$;

REVOKE ALL ON FUNCTION adjust_post_counter FROM PUBLIC;
REVOKE ALL ON FUNCTION adjust_post_counter FROM anon;
REVOKE ALL ON FUNCTION adjust_post_counter FROM authenticated;


/*	// overcomplication for doing everything in sql (likely still has race conditions)
DROP FUNCTION IF EXISTS toggle_user_relation;

CREATE OR REPLACE FUNCTION toggle_user_relation(
    p_post_id bigint,
    p_target_table text,
    p_target_column text
)
RETURNS TABLE(state boolean, count bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_current_state boolean;
    v_user_id uuid;
    v_new_target_column_value bigint;
    v_user_table text;
    v_post_id_column text;
BEGIN
    -- Get authenticated user
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;

    -- Set table and column names
    v_user_table := 'User_' || p_target_table;
    v_post_id_column := LOWER(p_target_table) || '_id';

    -- Lock the main post row FIRST to prevent race conditions on target_column
    EXECUTE format('SELECT 1 FROM %I WHERE id = $1 FOR UPDATE', p_target_table)
    USING p_post_id;

    -- Check current state in user relation table
    EXECUTE format(
        'SELECT %I FROM %I WHERE %I = $1 AND user_id = $2 FOR UPDATE',
        p_target_column, v_user_table, v_post_id_column
    )
    INTO v_current_state 
    USING p_post_id, v_user_id;

    IF v_current_state IS NULL THEN
        -- Create new relation with state = true
        EXECUTE format(
            'INSERT INTO %I (%I, user_id, %I) VALUES ($1, $2, TRUE)
             ON CONFLICT (%I, user_id) DO UPDATE SET %I = TRUE
             RETURNING %I',
            v_user_table, v_post_id_column, p_target_column,
            v_post_id_column, p_target_column, p_target_column
        )
        INTO v_current_state
        USING p_post_id, v_user_id;
        
        -- Increment target_column
        EXECUTE format(
			'UPDATE %I SET %I = GREATEST(0, COALESCE(%I, 0) + 1) WHERE id = $1 RETURNING %I',
			p_target_table, p_target_column, p_target_column, p_target_column
		)
		INTO v_new_target_column_value 
		USING p_post_id;
        
    ELSE
        -- Toggle existing state
        EXECUTE format(
            'UPDATE %I SET %I = NOT %I WHERE %I = $1 AND user_id = $2 RETURNING %I',
            v_user_table, p_target_column, p_target_column, v_post_id_column, p_target_column
        )
        INTO v_current_state 
        USING p_post_id, v_user_id;
        
        -- Update target_column based on new state
        IF v_current_state THEN
            EXECUTE format(
                'UPDATE %I SET %I = GREATEST(0, COALESCE(%I, 0) + 1) WHERE id = $1 RETURNING %I',
                p_target_table, p_target_column, p_target_column, p_target_column
            )
            INTO v_new_target_column_value 
            USING p_post_id;
        ELSE
            EXECUTE format(
                'UPDATE %I SET %I = GREATEST(0, COALESCE(%I, 0) - 1) WHERE id = $1 RETURNING %I',
                p_target_table, p_target_column, p_target_column, p_target_column
            )
            INTO v_new_target_column_value 
            USING p_post_id;
        END IF;
    END IF;

    RETURN QUERY SELECT v_current_state, v_new_target_column_value;
END;
$$;

REVOKE ALL ON FUNCTION adjust_post_counter FROM PUBLIC;
REVOKE ALL ON FUNCTION adjust_post_counter FROM anon;
REVOKE ALL ON FUNCTION adjust_post_counter FROM authenticated;
*/