-- Drop existing function and triggers/anything connected to it
DROP FUNCTION IF EXISTS prevent_past_target_date_offer CASCADE;

CREATE OR REPLACE FUNCTION prevent_past_target_date_offer()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if target_completition_date is being set to a past date
  IF NEW.target_completition_date IS NOT NULL AND NEW.target_completition_date < NOW() THEN
    RAISE EXCEPTION 'target_completition_date cannot be set to a past date';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


DROP TRIGGER IF EXISTS enforce_future_target_date_offer ON "Offer";

CREATE TRIGGER enforce_future_target_date_offer
  BEFORE INSERT OR UPDATE OF target_completition_date ON "Offer"
  FOR EACH ROW
  EXECUTE FUNCTION prevent_past_target_date_offer();
