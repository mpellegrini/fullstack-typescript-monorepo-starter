#!/bin/sh

set -e

echo "Loading extensions into $DB"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
# must quote extension names or else symbolic error will be thrown.
CREATE EXTENSION IF NOT EXISTS 'citext';
select * FROM pg_extension;
EOSQL
