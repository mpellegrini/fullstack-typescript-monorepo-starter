#!/bin/sh

set -e

echo "Loading extensions into $DB"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE EXTENSION IF NOT EXISTS citext;
select * FROM pg_extension;
EOSQL
