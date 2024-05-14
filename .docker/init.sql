SET search_path TO public;

-- Extension Creations

CREATE EXTENSION IF NOT EXISTS citext SCHEMA public;

select * FROM pg_extension;
