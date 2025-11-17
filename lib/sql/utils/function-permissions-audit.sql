-- Check function permissions for ALL roles

SELECT 
    p.proname as function_name,
    pg_catalog.pg_get_function_arguments(p.oid) as arguments,
    r.rolname as role,
    CASE 
        WHEN has_function_privilege(r.oid, p.oid, 'EXECUTE') 
        THEN '✓ CAN EXECUTE' 
        ELSE '✗ CANNOT EXECUTE' 
    END as permission,
    CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security_type,
    pg_catalog.pg_get_userbyid(p.proowner) as owner
FROM pg_catalog.pg_proc p
LEFT JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
CROSS JOIN pg_catalog.pg_roles r
WHERE n.nspname = 'public'
-- No filter on roles - shows ALL roles
ORDER BY function_name, r.rolname;
