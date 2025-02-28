#!/bin/bash

rm dubai_clean.json
echo "[" > dubai_clean.json
psql -d test -U admin -c "\
COPY (SELECT row_to_json(t) FROM dubai_clean AS t) TO STDOUT;" | sed '$!s/$/,/' >> dubai_clean.json
echo "]" >> dubai_clean.json
