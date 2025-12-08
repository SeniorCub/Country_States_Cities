# Quick Start Guide - Country States Cities API

## 🚀 Running the Projects

### Node.js (Port 9055)
```bash
cd Node
npm install
npm start
```
Access: http://localhost:9055

### Laravel (Port 8000)
```bash
cd Laravel
composer install
php artisan serve
```
Access: http://localhost:8000

---

## 📌 Common Use Cases

### 1. Cascading Dropdown (Country → State → City)

```javascript
// Step 1: Get all countries
GET /api/countries

// Step 2: User selects country (e.g., id=231 for USA)
GET /api/countries/231/states

// Step 3: User selects state (e.g., id=1416 for California)
GET /api/states/1416/cities
```

### 2. Search for a Location

```javascript
// Find countries containing "United"
GET /api/search/countries?q=United

// Find states in USA
GET /api/search/states?country_id=231&q=New

// Find cities named "London"
GET /api/search/cities?q=London
```

### 3. Get Regional Data

```javascript
// Get all regions
GET /api/regions

// Get Asian countries (assuming region id=3)
GET /api/regions/3/countries

// Get Western European countries (assuming subregion id=18)
GET /api/subregions/18/countries
```

### 4. Find Nearby Cities

```javascript
// Find cities within 50km of New York City
GET /api/cities/nearby?latitude=40.7128&longitude=-74.0060&radius=50
```

### 5. Get Statistics

```javascript
// Get total counts
GET /api/stats

// Response:
{
  "countries": 250,
  "states": 5000,
  "cities": 150000,
  "regions": 6,
  "subregions": 22
}
```

---

## 🔍 Quick Search Examples

### Search Countries
```bash
# By name
/api/search/countries?name=Canada

# By ISO code
/api/search/countries?iso2=CA
/api/search/countries?iso3=CAN

# By region
/api/search/countries?region=Europe

# By subregion
/api/search/countries?subregion=Western Europe

# Combined
/api/search/countries?region=Asia&name=Republic
```

### Search States
```bash
# By name
/api/search/states?name=California

# By country
/api/search/states?country_id=231

# By country code
/api/search/states?country_code=US

# Combined
/api/search/states?country_code=US&name=New
```

### Search Cities
```bash
# By name
/api/search/cities?name=Paris

# By state
/api/search/cities?state_id=1416

# By country
/api/search/cities?country_id=231

# By codes
/api/search/cities?country_code=US&state_code=CA

# Combined
/api/search/cities?country_code=US&name=San
```

---

## 📊 Response Formats

### Node.js Format
```json
{
  "success": true,
  "data": [...]
}
```

### Laravel Format
```json
[...]
```

### Error Response (both)
```json
{
  "success": false,
  "error": "Error message"
}
```
or
```json
{
  "error": "Resource not found"
}
```

---

## 🎯 Endpoint Cheat Sheet

| What You Need | Endpoint |
|---------------|----------|
| All countries | `/api/countries` |
| Country by ID | `/api/countries/{id}` |
| Country by code | `/api/countries/code/US` |
| All states | `/api/states` |
| States in country | `/api/countries/{id}/states` |
| All cities | `/api/cities` |
| Cities in state | `/api/states/{id}/cities` |
| Cities in country | `/api/countries/{id}/cities` |
| All regions | `/api/regions` |
| All subregions | `/api/subregions` |
| Nearby cities | `/api/cities/nearby?lat=...&long=...` |
| Search anything | `/api/search/{countries|states|cities}?q=...` |
| Statistics | `/api/stats` |

---

## 💡 Pro Tips

1. **Route Order**: More specific routes are checked first (e.g., `/cities/nearby` before `/cities/:id`)

2. **Search Flexibility**: Use either `q` or `name` parameter for name searches

3. **Pagination**: Laravel supports `?per_page=20` (max 100)

4. **Distance**: Nearby cities radius is in kilometers (max 1000)

5. **Codes**: ISO codes are case-insensitive (US = us = Us)

6. **Relationships**: Get parent entities from children:
   - `/api/cities/{id}/state` - Get city's state
   - `/api/cities/{id}/country` - Get city's country
   - `/api/states/{id}/country` - Get state's country

---

## 🧪 Testing with cURL

```bash
# Get all countries
curl http://localhost:9055/api/countries

# Search countries by name
curl "http://localhost:9055/api/search/countries?q=United"

# Get country by ISO code
curl http://localhost:9055/api/countries/code/US

# Get states in USA (id=231)
curl http://localhost:9055/api/countries/231/states

# Find nearby cities
curl "http://localhost:9055/api/cities/nearby?latitude=34.0522&longitude=-118.2437&radius=100"

# Get statistics
curl http://localhost:9055/api/stats
```

---

## 📖 Full Documentation

- Node.js: See `Node/API_DOCUMENTATION.md`
- Laravel: See `Laravel/API_DOCUMENTATION.md`
- Comparison: See `ENDPOINT_COMPARISON.md`
- Changes: See `CHANGES_SUMMARY.md`
