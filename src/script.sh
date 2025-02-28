psql -d test -U admin -c "\
COPY (SELECT row_to_json(t) FROM canada AS t) TO STDOUT;" > canada.json

psql -d test -U admin -c "\
COPY (SELECT row_to_json(t) FROM dubai AS t) TO STDOUT;" > dubai.json

psql -d test -U admin -c "\
COPY (SELECT row_to_json(t) FROM dubai_clean AS t) TO STDOUT;" > dubai_clean.json
