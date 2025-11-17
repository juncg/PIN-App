-- Drop existing function and triggers/anything connected to it
DROP FUNCTION IF EXISTS prevent_created_at_update() CASCADE;

CREATE OR REPLACE FUNCTION prevent_created_at_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent any changes to created_at
  NEW.created_at = OLD.created_at;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with created_at column
DO $$
DECLARE
  table_record RECORD;
BEGIN
  FOR table_record IN 
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public' 
      AND column_name = 'created_at'
  LOOP
    -- Drop trigger if it exists (to avoid errors on re-run)
    EXECUTE format('DROP TRIGGER IF EXISTS enforce_created_at_immutable ON %I', table_record.table_name);
    
    -- Create trigger for each table
    EXECUTE format('
      CREATE TRIGGER enforce_created_at_immutable
        BEFORE UPDATE OF created_at ON %I
        FOR EACH ROW
        EXECUTE FUNCTION prevent_created_at_update()
    ', table_record.table_name);
    
    RAISE NOTICE 'Added trigger to table: %', table_record.table_name;
  END LOOP;
END $$;
