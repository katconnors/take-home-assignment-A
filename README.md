# take-home-assignment-A

## Getting Started

- copy the .env.example file into a .env file
- `cd server`
- `docker-compose build`
- `docker-compose up`
- `npm run migrate`
- `npm run seed`
- `cd ../client`
- `npm run dev`

## Example requests

Endpoint 1 example: View form data and queries

```bash
curl --location 'http://127.0.0.1:8080/form-data' --header 'Content-Type: application/json'

```

Endpoint 2 example: Create a query

```bash
curl --location 'http://127.0.0.1:8080/query' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Test title",
  "description": "test description",
  "formDataId": "f67b569e-c959-4474-9176-0eee287839a6"
}'
```

Endpoint 3 examples: Update query- either status or description

```bash
curl --location --request PATCH 'http://127.0.0.1:8080/query/update' \
--header 'Content-Type: application/json' \
--data '{
  "formDataId": "f67b569e-c959-4474-9176-0eee287839a6",
  "description": "updated description"

}'
```

```bash
curl --location --request PATCH 'http://127.0.0.1:8080/query/update' \
--header 'Content-Type: application/json' \
--data '{
  "formDataId": "f67b569e-c959-4474-9176-0eee287839a6",
  "status":"RESOLVED"
}'
```
