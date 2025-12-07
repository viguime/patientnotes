# API Examples and Test Requests

This file contains example API requests you can use to test the backend.

## Health Check

```bash
curl http://localhost:3000/health
```

## Create Notes

### Initial Assessment Note

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "type": "initial",
    "content": "Patient presented with symptoms of fever (38.5°C) and persistent cough. No known allergies. Medical history includes hypertension."
  }'
```

### Interim/Progress Note

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "type": "interim",
    "content": "Day 3 of treatment. Patient showing signs of improvement. Fever reduced to 37.2°C. Cough less frequent. Continue current medication regimen."
  }'
```

### Discharge Note

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "type": "discharge",
    "content": "Patient fully recovered. No fever for 48 hours. Cough resolved. Discharged with instructions to rest and complete antibiotic course. Follow-up in 2 weeks."
  }'
```

## Retrieve Notes

### Get All Notes for a Patient

```bash
curl http://localhost:3000/notes/123e4567-e89b-12d3-a456-426614174000
```

## Error Cases

### Invalid Patient ID Format

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "invalid-id",
    "type": "initial",
    "content": "This should fail due to invalid UUID format."
  }'
```

Expected response: 400 Bad Request

### Content Too Short

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "type": "initial",
    "content": "Short"
  }'
```

Expected response: 400 Bad Request

### Invalid Note Type

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "123e4567-e89b-12d3-a456-426614174000",
    "type": "invalid-type",
    "content": "This should fail due to invalid note type."
  }'
```

Expected response: 400 Bad Request

## Multiple Patients Example

### Patient 1 Notes

```bash
# Initial
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    "type": "initial",
    "content": "Patient A: First visit. Complaining of chest pain. ECG ordered."
  }'

# Interim
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    "type": "interim",
    "content": "Patient A: ECG normal. Pain subsided. Monitoring for 24h."
  }'
```

### Patient 2 Notes

```bash
curl -X POST http://localhost:3000/notes \
  -H "Content-Type: application/json" \
  -d '{
    "patientId": "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
    "type": "initial",
    "content": "Patient B: Routine checkup. Blood pressure elevated at 145/95."
  }'
```

### Retrieve Patient 1 Notes Only

```bash
curl http://localhost:3000/notes/a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d
```

## Using jq for Pretty Output

If you have `jq` installed:

```bash
curl -s http://localhost:3000/notes/123e4567-e89b-12d3-a456-426614174000 | jq .
```

## Test Sequence Script

Save this as `test-api.sh`:

```bash
#!/bin/bash

API_URL="http://localhost:3000"
PATIENT_ID="123e4567-e89b-12d3-a456-426614174000"

echo "Testing Patient Notes API..."
echo ""

echo "1. Health Check"
curl -s "$API_URL/health" | jq .
echo ""

echo "2. Create Initial Note"
curl -s -X POST "$API_URL/notes" \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"type\": \"initial\",
    \"content\": \"Patient presented with symptoms of fever and cough.\"
  }" | jq .
echo ""

echo "3. Create Interim Note"
curl -s -X POST "$API_URL/notes" \
  -H "Content-Type: application/json" \
  -d "{
    \"patientId\": \"$PATIENT_ID\",
    \"type\": \"interim\",
    \"content\": \"Patient showing improvement after 3 days of treatment.\"
  }" | jq .
echo ""

echo "4. Get All Notes for Patient"
curl -s "$API_URL/notes/$PATIENT_ID" | jq .
echo ""

echo "Test complete!"
```

## Using Postman

Import this collection:

```json
{
  "info": {
    "name": "Patient Notes API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": "http://localhost:3000/health"
      }
    },
    {
      "name": "Create Note",
      "request": {
        "method": "POST",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"patientId\": \"123e4567-e89b-12d3-a456-426614174000\",\n  \"type\": \"initial\",\n  \"content\": \"Patient assessment notes here...\"\n}"
        },
        "url": "http://localhost:3000/notes"
      }
    },
    {
      "name": "Get Notes by Patient ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": "http://localhost:3000/notes/123e4567-e89b-12d3-a456-426614174000"
      }
    }
  ]
}
```
