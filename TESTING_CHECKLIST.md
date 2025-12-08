# Testing Checklist - Verify Both APIs

Use this checklist to verify both Node.js and Laravel implementations are working correctly.

## ✅ Setup Verification

### Node.js Setup
- [ ] Navigate to `Node` directory
- [ ] Run `npm install`
- [ ] Ensure `.env` is configured with LAMPP MySQL settings
- [ ] Run `npm start`
- [ ] Verify server runs on http://localhost:9055

### Laravel Setup
- [ ] Navigate to `Laravel` directory
- [ ] Run `composer install`
- [ ] Ensure `.env` is configured with database settings
- [ ] Run `php artisan serve`
- [ ] Verify server runs on http://localhost:8000

---

## 🧪 Endpoint Testing

### 1. Regions (4 endpoints)

#### Node.js
```bash
curl http://localhost:9055/api/regions
curl http://localhost:9055/api/regions/1
curl http://localhost:9055/api/regions/1/subregions
curl http://localhost:9055/api/regions/1/countries
```

#### Laravel
```bash
curl http://localhost:8000/api/regions
curl http://localhost:8000/api/regions/1
curl http://localhost:8000/api/regions/1/subregions
curl http://localhost:8000/api/regions/1/countries
```

- [ ] All region endpoints work in Node.js
- [ ] All region endpoints work in Laravel
- [ ] Both return similar data

---

### 2. Subregions (3 endpoints)

#### Node.js
```bash
curl http://localhost:9055/api/subregions
curl http://localhost:9055/api/subregions/1
curl http://localhost:9055/api/subregions/1/countries
```

#### Laravel
```bash
curl http://localhost:8000/api/subregions
curl http://localhost:8000/api/subregions/1
curl http://localhost:8000/api/subregions/1/countries
```

- [ ] All subregion endpoints work in Node.js
- [ ] All subregion endpoints work in Laravel
- [ ] Both return similar data

---

### 3. Countries (6 endpoints)

#### Node.js
```bash
curl http://localhost:9055/api/countries
curl http://localhost:9055/api/countries/231
curl http://localhost:9055/api/countries/code/US
curl http://localhost:9055/api/countries/231/states
curl http://localhost:9055/api/countries/231/cities
curl "http://localhost:9055/api/search/countries?q=United"
```

#### Laravel
```bash
curl http://localhost:8000/api/countries
curl http://localhost:8000/api/countries/231
curl http://localhost:8000/api/countries/code/US
curl http://localhost:8000/api/countries/231/states
curl http://localhost:8000/api/countries/231/cities
curl "http://localhost:8000/api/search/countries?q=United"
```

- [ ] All country endpoints work in Node.js
- [ ] All country endpoints work in Laravel
- [ ] ISO code lookup works (US, USA, GB, etc.)
- [ ] Search with multiple parameters works

---

### 4. States (5 endpoints)

#### Node.js
```bash
curl http://localhost:9055/api/states
curl http://localhost:9055/api/states/1416
curl http://localhost:9055/api/states/1416/cities
curl http://localhost:9055/api/states/1416/country
curl "http://localhost:9055/api/search/states?q=California"
```

#### Laravel
```bash
curl http://localhost:8000/api/states
curl http://localhost:8000/api/states/1416
curl http://localhost:8000/api/states/1416/cities
curl http://localhost:8000/api/states/1416/country
curl "http://localhost:8000/api/search/states?q=California"
```

- [ ] All state endpoints work in Node.js
- [ ] All state endpoints work in Laravel
- [ ] State → Country relationship works
- [ ] State search works

---

### 5. Cities (6 endpoints)

#### Node.js
```bash
curl http://localhost:9055/api/cities
curl http://localhost:9055/api/cities/52
curl http://localhost:9055/api/cities/52/state
curl http://localhost:9055/api/cities/52/country
curl "http://localhost:9055/api/cities/nearby?latitude=34.0522&longitude=-118.2437&radius=50"
curl "http://localhost:9055/api/search/cities?q=Los%20Angeles"
```

#### Laravel
```bash
curl http://localhost:8000/api/cities
curl http://localhost:8000/api/cities/52
curl http://localhost:8000/api/cities/52/state
curl http://localhost:8000/api/cities/52/country
curl "http://localhost:8000/api/cities/nearby?latitude=34.0522&longitude=-118.2437&radius=50"
curl "http://localhost:8000/api/search/cities?q=Los%20Angeles"
```

- [ ] All city endpoints work in Node.js
- [ ] All city endpoints work in Laravel
- [ ] City → State relationship works
- [ ] City → Country relationship works
- [ ] Nearby cities with coordinates works
- [ ] City search works

---

### 6. Statistics (1 endpoint)

#### Node.js
```bash
curl http://localhost:9055/api/stats
```

#### Laravel
```bash
curl http://localhost:8000/api/stats
```

- [ ] Stats endpoint works in Node.js
- [ ] Stats endpoint works in Laravel
- [ ] Returns counts for all 5 tables

Expected response format:
```json
{
  "countries": 250,
  "states": 5000,
  "cities": 150000,
  "regions": 6,
  "subregions": 22
}
```

---

## 🔍 Advanced Search Testing

### Search Countries
```bash
# By name
curl "http://localhost:9055/api/search/countries?name=United"
curl "http://localhost:8000/api/search/countries?name=United"

# By ISO2
curl "http://localhost:9055/api/search/countries?iso2=US"
curl "http://localhost:8000/api/search/countries?iso2=US"

# By region
curl "http://localhost:9055/api/search/countries?region=Europe"
curl "http://localhost:8000/api/search/countries?region=Europe"

# Combined
curl "http://localhost:9055/api/search/countries?region=Asia&name=Republic"
curl "http://localhost:8000/api/search/countries?region=Asia&name=Republic"
```

- [ ] Country search works with all parameters in Node.js
- [ ] Country search works with all parameters in Laravel

### Search States
```bash
# By name
curl "http://localhost:9055/api/search/states?name=New"
curl "http://localhost:8000/api/search/states?name=New"

# By country
curl "http://localhost:9055/api/search/states?country_id=231"
curl "http://localhost:8000/api/search/states?country_id=231"

# By country code
curl "http://localhost:9055/api/search/states?country_code=US"
curl "http://localhost:8000/api/search/states?country_code=US"
```

- [ ] State search works with all parameters in Node.js
- [ ] State search works with all parameters in Laravel

### Search Cities
```bash
# By name
curl "http://localhost:9055/api/search/cities?name=San"
curl "http://localhost:8000/api/search/cities?name=San"

# By state
curl "http://localhost:9055/api/search/cities?state_id=1416"
curl "http://localhost:8000/api/search/cities?state_id=1416"

# By codes
curl "http://localhost:9055/api/search/cities?country_code=US&state_code=CA"
curl "http://localhost:8000/api/search/cities?country_code=US&state_code=CA"
```

- [ ] City search works with all parameters in Node.js
- [ ] City search works with all parameters in Laravel

---

## 🌍 Geolocation Testing

### Nearby Cities - Different Locations

```bash
# New York City
curl "http://localhost:9055/api/cities/nearby?latitude=40.7128&longitude=-74.0060&radius=50"
curl "http://localhost:8000/api/cities/nearby?latitude=40.7128&longitude=-74.0060&radius=50"

# Los Angeles
curl "http://localhost:9055/api/cities/nearby?latitude=34.0522&longitude=-118.2437&radius=100"
curl "http://localhost:8000/api/cities/nearby?latitude=34.0522&longitude=-118.2437&radius=100"

# London
curl "http://localhost:9055/api/cities/nearby?latitude=51.5074&longitude=-0.1278&radius=30"
curl "http://localhost:8000/api/cities/nearby?latitude=51.5074&longitude=-0.1278&radius=30"
```

- [ ] Nearby cities returns results with distance
- [ ] Results are sorted by distance
- [ ] Radius parameter works
- [ ] Works in both implementations

---

## ❌ Error Handling Testing

### Test 404 Errors
```bash
# Non-existent country
curl http://localhost:9055/api/countries/999999
curl http://localhost:8000/api/countries/999999

# Non-existent state
curl http://localhost:9055/api/states/999999
curl http://localhost:8000/api/states/999999

# Non-existent city
curl http://localhost:9055/api/cities/999999
curl http://localhost:8000/api/cities/999999
```

- [ ] Returns 404 status code
- [ ] Returns appropriate error message

### Test 422 Validation Errors
```bash
# Missing required parameters for nearby cities
curl "http://localhost:9055/api/cities/nearby"
curl "http://localhost:8000/api/cities/nearby"
```

- [ ] Returns 422 status code
- [ ] Returns validation error message

---

## 📊 Final Verification

- [ ] All 28 endpoints work in Node.js
- [ ] All 28 endpoints work in Laravel
- [ ] Both return similar data structures
- [ ] Error handling works correctly
- [ ] Search functionality is identical
- [ ] Geolocation features work
- [ ] Relationships work (parent/child navigation)

---

## 🎉 Success Criteria

✅ **PASS**: All checkboxes are checked and both APIs respond identically  
❌ **FAIL**: Any endpoint returns errors or different results

---

## 📝 Notes

- Response format differs slightly:
  - Node.js: `{ success: true, data: {...} }`
  - Laravel: Direct data `{...}`
- Both should have same data content
- Nearby cities distance may vary slightly due to floating-point calculations
