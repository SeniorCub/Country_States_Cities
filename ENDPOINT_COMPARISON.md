# Endpoint Comparison: Node.js vs Laravel

## ✅ Complete Endpoint Parity Achieved

Both implementations now support the **exact same set of endpoints** with identical functionality.

---

## 📍 Regions Endpoints

| Method | Endpoint | Description | Node.js | Laravel |
|--------|----------|-------------|---------|---------|
| GET | `/api/regions` | Get all regions | ✅ | ✅ |
| GET | `/api/regions/:id` | Get region by ID | ✅ | ✅ |
| GET | `/api/regions/:id/subregions` | Get subregions by region | ✅ | ✅ |
| GET | `/api/regions/:id/countries` | Get countries by region | ✅ | ✅ |

---

## 📍 Subregions Endpoints

| Method | Endpoint | Description | Node.js | Laravel |
|--------|----------|-------------|---------|---------|
| GET | `/api/subregions` | Get all subregions | ✅ | ✅ |
| GET | `/api/subregions/:id` | Get subregion by ID | ✅ | ✅ |
| GET | `/api/subregions/:id/countries` | Get countries by subregion | ✅ | ✅ |

---

## 🌍 Countries Endpoints

| Method | Endpoint | Description | Node.js | Laravel |
|--------|----------|-------------|---------|---------|
| GET | `/api/countries` | Get all countries | ✅ | ✅ |
| GET | `/api/countries/:id` | Get country by ID | ✅ | ✅ |
| GET | `/api/countries/code/:code` | Get country by ISO2/ISO3 code | ✅ | ✅ |
| GET | `/api/countries/:id/states` | Get states by country | ✅ | ✅ |
| GET | `/api/countries/:id/cities` | Get cities by country | ✅ | ✅ |
| GET | `/api/countries/search` | Search countries | ✅ | ✅ |

---

## 🗺️ States Endpoints

| Method | Endpoint | Description | Node.js | Laravel |
|--------|----------|-------------|---------|---------|
| GET | `/api/states` | Get all states | ✅ | ✅ |
| GET | `/api/states/:id` | Get state by ID | ✅ | ✅ |
| GET | `/api/states/:id/cities` | Get cities by state | ✅ | ✅ |
| GET | `/api/states/:id/country` | Get state's country | ✅ | ✅ |
| GET | `/api/states/search` | Search states | ✅ | ✅ |

---

## 🏙️ Cities Endpoints

| Method | Endpoint | Description | Node.js | Laravel |
|--------|----------|-------------|---------|---------|
| GET | `/api/cities` | Get all cities | ✅ | ✅ |
| GET | `/api/cities/nearby` | Find nearby cities | ✅ | ✅ |
| GET | `/api/cities/:id` | Get city by ID | ✅ | ✅ |
| GET | `/api/cities/:id/state` | Get city's state | ✅ | ✅ |
| GET | `/api/cities/:id/country` | Get city's country | ✅ | ✅ |
| GET | `/api/cities/search` | Search cities | ✅ | ✅ |

---

## 🔍 Search Endpoints (Alternative Format)

| Method | Endpoint | Description | Node.js | Laravel |
|--------|----------|-------------|---------|---------|
| GET | `/api/search/countries` | Search countries | ✅ | ✅ |
| GET | `/api/search/states` | Search states | ✅ | ✅ |
| GET | `/api/search/cities` | Search cities | ✅ | ✅ |

---

## 📊 Statistics Endpoints

| Method | Endpoint | Description | Node.js | Laravel |
|--------|----------|-------------|---------|---------|
| GET | `/api/stats` | Get database statistics | ✅ | ✅ |

---

## 🔍 Search Parameters Supported

### Countries Search
- `q` or `name` - Search by country name (partial match)
- `iso2` - Filter by ISO2 code (exact match)
- `iso3` - Filter by ISO3 code (exact match)
- `region` - Filter by region (partial match)
- `subregion` - Filter by subregion (partial match)

### States Search
- `q` or `name` - Search by state name (partial match)
- `country_id` - Filter by country ID
- `country_code` - Filter by country code
- `iso2` - Filter by state ISO2 code

### Cities Search
- `q` or `name` - Search by city name (partial match)
- `state_id` - Filter by state ID
- `country_id` - Filter by country ID
- `country_code` - Filter by country code
- `state_code` - Filter by state code

### Nearby Cities
- `latitude` (required) - Latitude coordinate
- `longitude` (required) - Longitude coordinate
- `radius` (optional) - Search radius in kilometers (default: 50, max: 1000)

---

## 📦 Response Formats

### Node.js Response Format
```json
{
  "success": true,
  "data": { /* object or array */ }
}
```

### Laravel Response Format
```json
{ /* object or array directly */ }
```

Or with error:
```json
{
  "error": "Error message"
}
```

---

## 🎯 Total Endpoints

**Total: 30 Endpoints** (identical in both implementations)

- Regions: 4 endpoints
- Subregions: 3 endpoints
- Countries: 6 endpoints
- States: 5 endpoints
- Cities: 6 endpoints
- Search (alternative): 3 endpoints
- Statistics: 1 endpoint
- Documentation: 2 endpoints (/ home page)

---

## 📝 Notes

1. **Route Order**: In Node.js Express, specific routes (like `/api/cities/nearby`) must be defined before parameterized routes (like `/api/cities/:id`) to avoid conflicts.

2. **Database**: Both implementations use the same MySQL database (`countriesbox`) via LAMPP.

3. **Pagination**: Laravel supports `per_page` parameter for pagination (max 100).

4. **Response Consistency**: Node.js wraps responses in `{success, data}` while Laravel returns data directly.

5. **Error Codes**: Both return appropriate HTTP status codes (200, 404, 422, 500).

---

## ✨ New Additions Summary

### Added to Laravel:
- ✅ Region model and controller
- ✅ Subregion model and controller
- ✅ Stats controller
- ✅ 4 region endpoints
- ✅ 3 subregion endpoints
- ✅ 1 statistics endpoint
- ✅ Alternative search routes format

### Added to Node.js:
- ✅ 4 region endpoints
- ✅ 3 subregion endpoints
- ✅ 1 country by code endpoint
- ✅ 1 state's country endpoint
- ✅ 2 city relationship endpoints (state, country)
- ✅ 1 nearby cities endpoint
- ✅ Enhanced search parameters for all entities
