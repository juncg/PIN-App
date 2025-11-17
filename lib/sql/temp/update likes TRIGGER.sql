-- Drop existing function and triggers
DROP FUNCTION IF EXISTS update_post_likes CASCADE;

-- Create the trigger function
CREATE OR REPLACE FUNCTION update_post_likes()
RETURNS TRIGGER AS $$
DECLARE
    target_table text;
    post_id_column text;
    post_id_value bigint;
BEGIN
    -- Determine target table and post ID column based on source table
    CASE TG_TABLE_NAME
        WHEN 'User_Petition' THEN
            target_table := 'Petition';
            post_id_column := 'petition_id';
        WHEN 'User_Offer' THEN
            target_table := 'Offer';
            post_id_column := 'offer_id';
        WHEN 'User_Review' THEN
            target_table := 'Review';
            post_id_column := 'review_id';
        ELSE
            RAISE EXCEPTION 'Unexpected trigger table: %', TG_TABLE_NAME;
    END CASE;

    -- Get the post ID value
    post_id_value := COALESCE(NEW[post_id_column], OLD[post_id_column]);

    -- Increment likes when transitioning to liked=true
    IF (TG_OP = 'INSERT' AND NEW.liked = true) OR
       (TG_OP = 'UPDATE' AND OLD.liked = false AND NEW.liked = true) THEN
        EXECUTE format('UPDATE %I SET likes = GREATEST(0, COALESCE(likes, 0) + 1) WHERE id = $1', target_table)
        USING post_id_value;
        
    -- Decrement likes when transitioning from liked=true to liked=false or DELETE
    ELSIF ((TG_OP = 'UPDATE' AND OLD.liked = true AND NEW.liked = false) OR 
           (TG_OP = 'DELETE' AND OLD.liked = true)) THEN
        EXECUTE format('UPDATE %I SET likes = GREATEST(0, COALESCE(likes, 0) - 1) WHERE id = $1', target_table)
        USING post_id_value;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Dynamically create triggers for all User_* tables with 'liked' column
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN 
    SELECT t.table_name
    FROM information_schema.tables t
    JOIN information_schema.columns c 
      ON t.table_name = c.table_name 
      AND t.table_schema = c.table_schema
    WHERE t.table_schema = 'public' 
      AND t.table_name LIKE 'User_%'
      AND c.column_name = 'liked'
  LOOP
    -- Drop trigger if it exists
    EXECUTE format('DROP TRIGGER IF EXISTS update_post_likes_trigger ON %I', table_record.table_name);
    
    -- Create trigger for each table
    EXECUTE format('
      CREATE TRIGGER update_post_likes_trigger
      AFTER INSERT OR UPDATE OF liked OR DELETE ON %I
      FOR EACH ROW
      EXECUTE FUNCTION update_post_likes()
    ', table_record.table_name);
    
    RAISE NOTICE 'Added like count trigger to table: %', table_record.table_name;
  END LOOP;
END $$;
