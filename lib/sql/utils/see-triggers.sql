

SELECT 
    event_object_schema AS schema,
    event_object_table AS table,
    trigger_name,
    action_timing AS timing,
    event_manipulation AS event,
    action_statement AS definition
FROM information_schema.triggers
ORDER BY event_object_table, trigger_name;
