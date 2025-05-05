# take-home-assignment-A

## Getting Started

- copy the .env.example file into a .env file
- `docker-compose build`
- `docker-compose up`
- `npm run migrate`
- `npm run seed`
- `cd query-management`
- `npm run dev`

## Example requests

Endpoint 1: View form data and queries

```bash
curl --location 'http://127.0.0.1:8080/form-data' --header 'Content-Type: application/json'

```

Endpoint 2: Create a query

```bash
curl --location 'http://127.0.0.1:8080/query' \
--header 'Content-Type: application/json' \
--data '{
  "title": "Test title",
  "description": "test description",
  "formDataId": "312e3769-1ecf-4c30-b3cf-289a8138cff6"
}'
```

Endpoint 3: Update query- either status or description

```bash
curl --location --request PATCH 'http://127.0.0.1:8080/query/update' \
--header 'Content-Type: application/json' \
--data '{
  "formDataId": "258186a2-dbd9-450b-b088-edb9a6919612",
  "status":"test"
}'
```
