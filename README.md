# take-home-assignment-A

## Example requests

```bash
curl --location 'http://127.0.0.1:8080/form-data' --header 'Content-Type: application/json'

```

```bash
curl --location 'http://127.0.0.1:8080/query' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Test title",
  "description": "test description",
  "formDataId": "312e3769-1ecf-4c30-b3cf-289a8138cff6"
}'
```

```bash
curl --location --request PATCH 'http://127.0.0.1:8080/query/update' \
--header 'Content-Type: application/json' \
--data '{
  "formDataId": "258186a2-dbd9-450b-b088-edb9a6919612",
  "status":"test"
}'
```
