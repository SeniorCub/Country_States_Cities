# Country-State-City API Documentation

## Base URL
```
http://localhost:9055
```

## Response Format
All endpoints return JSON with the following structure:
```json
{
  "success": true,
  "data": {} // or []
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

---

## Regions

### Get All Regions
```
GET /api/regions
```
Returns all regions (Africa, Americas, Asia, Europe, Oceania, Polar).

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Africa",
      "translations": {...},
      "wikiDataId": "Q15"
    }
  ]
}
```

### Get Region by ID
```
GET /api/regions/:regionId
```

### Get Subregions by Region
```
GET /api/regions/:regionId/subregions
```
Returns all subregions within a specific region.

### Get Countries by Region
```
GET /api/regions/:regionId/countries
```
Returns all countries within a specific region.

---

## Subregions

### Get All Subregions
```
GET /api/subregions
```
Returns all 22 subregions.

### Get Subregion by ID
```
GET /api/subregions/:subregionId
```

### Get Countries by Subregion
```
GET /api/subregions/:subregionId/countries
```
Returns all countries within a specific subregion.

---

## Countries

### Get All Countries
```
GET /api/countries
```
Returns all countries sorted alphabetically.

**Response includes:**
- id, name, iso2, iso3, phone_code, capital, currency
- region_id, subregion_id, region, subregion
- nationality, timezones, translations
- latitude, longitude, emoji, flag
- wikiDataId, and more

### Get Country by ID
```
GET /api/countries/:countryId
```

### Get States by Country
```
GET /api/countries/:countryId/states
```
Returns all states/provinces within a specific country.

### Get Cities by Country
```
GET /api/countries/:countryId/cities
```
Returns all cities within a specific country.

---

## States

### Get All States
```
GET /api/states
```
Returns all states/provinces sorted alphabetically.

**Response includes:**
- id, name, country_id, country_code
- state_code, iso2, type
- latitude, longitude, native
- population, timezone, translations
- wikiDataId

### Get State by ID
```
GET /api/states/:stateId
```

### Get Cities by State
```
GET /api/states/:stateId/cities
```
Returns all cities within a specific state.

---

## Cities

### Get All Cities
```
GET /api/cities
```
Returns all cities sorted alphabetically.

**Response includes:**
- id, name, state_id, state_code
- country_id, country_code
- latitude, longitude, native
- population, timezone, translations
- wikiDataId

### Get City by ID
```
GET /api/cities/:cityId
```

---

## Search

### Search Countries
```
GET /api/search/countries?q=United&iso2=US&iso3=USA
```

**Query Parameters:**
- `q` - Search by country name (partial match)
- `iso2` - Filter by ISO2 code (exact match)
- `iso3` - Filter by ISO3 code (exact match)

**Example:**
```
/api/search/countries?q=United
/api/search/countries?iso2=US
```

### Search States
```
GET /api/search/states?q=California&country_id=231
```

**Query Parameters:**
- `q` - Search by state name (partial match)
- `country_id` - Filter by country ID

**Example:**
```
/api/search/states?q=New
/api/search/states?country_id=231
```

### Search Cities
```
GET /api/search/cities?q=London&state_id=1&country_id=231
```

**Query Parameters:**
- `q` - Search by city name (partial match)
- `state_id` - Filter by state ID
- `country_id` - Filter by country ID

**Example:**
```
/api/search/cities?q=London
/api/search/cities?q=San&country_id=231
/api/search/cities?state_id=3930
```

---

## Statistics

### Get Database Statistics
```
GET /api/stats
```

Returns total counts of all entities.

**Response Example:**
```json
{
  "success": true,
  "data": {
    "countries": 250,
    "states": 5000,
    "cities": 150000,
    "regions": 6,
    "subregions": 22
  }
}
```

---

## Common Use Cases

### 1. Get a cascading dropdown (Country → State → City)
```javascript
// Step 1: Get all countries
GET /api/countries

// Step 2: Get states for selected country
GET /api/countries/231/states

// Step 3: Get cities for selected state
GET /api/states/3930/cities
```

### 2. Search for a location
```javascript
// Search for countries containing "United"
GET /api/search/countries?q=United

// Search for cities named "London"
GET /api/search/cities?q=London
```

### 3. Get regional data
```javascript
// Get all Asian countries
GET /api/regions/3/countries

// Get all European subregions
GET /api/regions/4/subregions

// Get all countries in Western Europe
GET /api/subregions/18/countries
```

### 4. Find specific location by code
```javascript
// Find country by ISO2 code
GET /api/search/countries?iso2=US

// Find country by ISO3 code
GET /api/search/countries?iso3=USA
```

---

## Error Codes

- `200` - Success
- `404` - Resource not found
- `500` - Internal server error

---

## Rate Limiting
Currently no rate limiting is implemented.

---

## CORS
CORS is enabled for `http://localhost:5173`. Update `corsOptions` in `index.js` to modify allowed origins.

---

## Database Schema

**Tables:**
- `regions` (6 records)
- `subregions` (22 records)
- `countries` (~250 records)
- `states` (~5000 records)
- `cities` (~150000 records)

**Relationships:**
```
regions → subregions → countries → states → cities
```

---

## Notes

- All list endpoints return results sorted alphabetically by name
- Search endpoints are limited to 100 results
- All responses include `success: true/false` flag
- Translations are provided in JSON format for multiple languages
- Coordinates (latitude/longitude) are included where available
