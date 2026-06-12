# Location API Documentation

This API provides endpoints to fetch countries, states, and cities data from the countriesbox database.

## Base URL
```
https://country-states-cities.seniorcub.name.ng/api
http://localhost:8000/api
```

## Advanced Features

### Relationship Inclusion
Most endpoints support loading related data using the `include` query parameter. This allows you to fetch multiple resources in a single request.

**Available Relationships:**
- **Countries:** `states`, `cities`, `regionModel`, `subregionModel`
- **States:** `country`, `cities`
- **Cities:** `state`, `country`

**Example:**
```
GET /api/countries/1?include=states,cities
GET /api/states/search?name=California&include=country,cities
```

### Global Search
`GET /api/search`

Search for countries, states, and cities by name in a single request.

- **Query Params:**
  - `q` (required): Search term (min 2 characters)
  - `limit`: Number of results to return per category (default: 10)

- **Example:**
```
GET /api/search?q=York
```

---

## Endpoints

### Countries

#### Get All Countries
```
GET /api/countries
```
Returns a list of all countries.

**Query Parameters:**
- `per_page` (optional) - Number of items per page (max 100)

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "United States",
    "iso3": "USA",
    "iso2": "US",
    "numeric_code": "840",
    "phone_code": "+1",
    "capital": "Washington",
    "currency": "USD",
    "currency_name": "United States dollar",
    "currency_symbol": "$",
    "tld": ".us",
    "native": "United States",
    "region": "Americas",
    "subregion": "Northern America",
    "latitude": "38.00000000",
    "longitude": "-97.00000000",
    "emoji": "🇺🇸",
    "emojiU": "U+1F1FA U+1F1F8"
  }
]
```

#### Get Single Country
```
GET /api/countries/{id}
```
Returns details of a specific country.

**Parameters:**
- `id` (required) - Country ID

**Example:**
```
GET /api/countries/1
```

#### Get Country by ISO Code
```
GET /api/countries/code/{code}
```
Returns country details by ISO2 or ISO3 code.

**Parameters:**
- `code` (required) - ISO2 (e.g., "US") or ISO3 (e.g., "USA") code

**Example:**
```
GET /api/countries/code/US
GET /api/countries/code/USA
```

#### Search Countries
```
GET /api/countries/search
```
Search countries by various criteria.

**Query Parameters:**
- `name` (optional) - Search by country name (partial match)
- `iso2` (optional) - Filter by ISO2 code
- `iso3` (optional) - Filter by ISO3 code
- `region` (optional) - Filter by region (partial match)
- `subregion` (optional) - Filter by subregion (partial match)

**Example:**
```
GET /api/countries/search?name=United
GET /api/countries/search?region=Americas
GET /api/countries/search?iso2=US
```

#### Get States of a Country
```
GET /api/countries/{id}/states
```
Returns all states/provinces of a specific country.

**Parameters:**
- `id` (required) - Country ID

**Example:**
```
GET /api/countries/1/states
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "California",
    "country_id": 1,
    "country_code": "US",
    "fips_code": "06",
    "iso2": "CA",
    "type": "state",
    "latitude": "36.77826100",
    "longitude": "-119.41793240"
  }
]
```

#### Get Cities of a Country
```
GET /api/countries/{id}/cities
```
Returns all cities of a specific country.

**Parameters:**
- `id` (required) - Country ID

**Example:**
```
GET /api/countries/1/cities
```

### States

#### Get All States
```
GET /api/states
```
Returns a list of all states/provinces.

**Query Parameters:**
- `country_id` (optional) - Filter by country ID
- `per_page` (optional) - Number of items per page (max 100)

**Example:**
```
GET /api/states?country_id=1
GET /api/states?per_page=20
```

#### Get Single State
```
GET /api/states/{id}
```
Returns details of a specific state/province with its country.

**Parameters:**
- `id` (required) - State ID

**Example:**
```
GET /api/states/1
```

#### Search States
```
GET /api/states/search
```
Search states by various criteria.

**Query Parameters:**
- `name` (optional) - Search by state name (partial match)
- `country_id` (optional) - Filter by country ID
- `country_code` (optional) - Filter by country code
- `iso2` (optional) - Filter by state ISO2 code

**Example:**
```
GET /api/states/search?name=California
GET /api/states/search?country_id=1
GET /api/states/search?country_code=US
```

#### Get Cities of a State
```
GET /api/states/{id}/cities
```
Returns all cities of a specific state/province.

**Parameters:**
- `id` (required) - State ID

**Example:**
```
GET /api/states/1/cities
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Los Angeles",
    "state_id": 1,
    "state_code": "CA",
    "country_id": 1,
    "country_code": "US",
    "latitude": "34.05223390",
    "longitude": "-118.24368490"
  }
]
```

#### Get Country of a State
```
GET /api/states/{id}/country
```
Returns the country that a state belongs to.

**Parameters:**
- `id` (required) - State ID

**Example:**
```
GET /api/states/1/country
```

### Cities

#### Get All Cities
```
GET /api/cities
```
Returns a list of all cities.

**Query Parameters:**
- `country_id` (optional) - Filter by country ID
- `state_id` (optional) - Filter by state ID
- `per_page` (optional) - Number of items per page (max 100)

**Example:**
```
GET /api/cities?state_id=1
GET /api/cities?country_id=1
GET /api/cities?per_page=50
```

#### Get Single City
```
GET /api/cities/{id}
```
Returns details of a specific city with its state and country.

**Parameters:**
- `id` (required) - City ID

**Example:**
```
GET /api/cities/1
```

#### Search Cities
```
GET /api/cities/search
```
Search cities by various criteria.

**Query Parameters:**
- `name` (optional) - Search by city name (partial match)
- `state_id` (optional) - Filter by state ID
- `country_id` (optional) - Filter by country ID
- `country_code` (optional) - Filter by country code
- `state_code` (optional) - Filter by state code

**Example:**
```
GET /api/cities/search?name=Los Angeles
GET /api/cities/search?state_id=1
GET /api/cities/search?country_code=US&state_code=CA
```

#### Find Nearby Cities
```
GET /api/cities/nearby
```
Find cities near a specific coordinate within a given radius.

**Query Parameters:**
- `latitude` (required) - Latitude coordinate
- `longitude` (required) - Longitude coordinate
- `radius` (optional) - Search radius in kilometers (default: 50, max: 1000)

**Example:**
```
GET /api/cities/nearby?latitude=34.0522&longitude=-118.2437&radius=100
```

**Example Response:**
```json
[
  {
    "id": 1,
    "name": "Los Angeles",
    "state_id": 1,
    "state_code": "CA",
    "country_id": 1,
    "country_code": "US",
    "latitude": "34.05223390",
    "longitude": "-118.24368490",
    "distance": 0.05
  }
]
```

#### Get State of a City
```
GET /api/cities/{id}/state
```
Returns the state that a city belongs to.

**Parameters:**
- `id` (required) - City ID

**Example:**
```
GET /api/cities/1/state
```

#### Get Country of a City
```
GET /api/cities/{id}/country
```
Returns the country that a city belongs to.

**Parameters:**
- `id` (required) - City ID

**Example:**
```
GET /api/cities/1/country
```

## Error Responses

### 404 Not Found
```json
{
  "error": "Country not found"
}
```

```json
{
  "error": "State not found"
}
```

```json
{
  "error": "City not found"
}
```

### 422 Validation Error
```json
{
  "message": "The latitude field is required.",
  "errors": {
    "latitude": ["The latitude field is required."]
  }
}
```

## Usage Examples

### Using cURL

```bash
# Get all countries
curl http://localhost:8000/api/countries

# Get specific country
curl http://localhost:8000/api/countries/1

# Get country by ISO code
curl http://localhost:8000/api/countries/code/US

# Search countries
curl "http://localhost:8000/api/countries/search?name=United"

# Get states of a country
curl http://localhost:8000/api/countries/1/states

# Get cities of a state
curl http://localhost:8000/api/states/1/cities

# Search cities
curl "http://localhost:8000/api/cities/search?name=Los%20Angeles"

# Find nearby cities
curl "http://localhost:8000/api/cities/nearby?latitude=34.0522&longitude=-118.2437&radius=50"

# Get paginated results
curl "http://localhost:8000/api/countries?per_page=20"
```

### Using JavaScript (Fetch API)

```javascript
// Get all countries
fetch('http://localhost:8000/api/countries')
  .then(response => response.json())
  .then(data => console.log(data));

// Search countries by region
fetch('http://localhost:8000/api/countries/search?region=Europe')
  .then(response => response.json())
  .then(data => console.log(data));

// Get states of a country
fetch('http://localhost:8000/api/countries/1/states')
  .then(response => response.json())
  .then(data => console.log(data));

// Get cities of a state
fetch('http://localhost:8000/api/states/1/cities')
  .then(response => response.json())
  .then(data => console.log(data));

// Search cities
fetch('http://localhost:8000/api/cities/search?name=New York')
  .then(response => response.json())
  .then(data => console.log(data));

// Find nearby cities
fetch('http://localhost:8000/api/cities/nearby?latitude=40.7128&longitude=-74.0060&radius=100')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Setup Instructions

1. Make sure your database connection is configured in `.env`:
   ```
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=countriesbox
   DB_USERNAME=root
   DB_PASSWORD=
   ```

2. Start the Laravel development server:
   ```bash
   php artisan serve
   ```

3. Access the API at `http://localhost:8000/api`
