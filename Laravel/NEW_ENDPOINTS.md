# Complete API Endpoints List

Base URL: `http://localhost:8000/api`

## Regions (4 endpoints)

```
GET /api/regions                          - Get all regions
GET /api/regions/{id}                     - Get region by ID
GET /api/regions/{id}/subregions          - Get subregions by region
GET /api/regions/{id}/countries           - Get countries by region
```

## Subregions (3 endpoints)

```
GET /api/subregions                       - Get all subregions
GET /api/subregions/{id}                  - Get subregion by ID
GET /api/subregions/{id}/countries        - Get countries by subregion
```

## Countries (6 endpoints)

```
GET /api/countries                        - Get all countries
GET /api/countries/code/{code}            - Get country by ISO2/ISO3 code
GET /api/countries/search                 - Search countries
GET /api/countries/{id}                   - Get country by ID
GET /api/countries/{id}/states            - Get states by country
GET /api/countries/{id}/cities            - Get cities by country
```

## States (5 endpoints)

```
GET /api/states                           - Get all states
GET /api/states/search                    - Search states
GET /api/states/{id}                      - Get state by ID
GET /api/states/{id}/cities               - Get cities by state
GET /api/states/{id}/country              - Get state's country
```

## Cities (6 endpoints)

```
GET /api/cities                           - Get all cities
GET /api/cities/search                    - Search cities
GET /api/cities/nearby                    - Find nearby cities (requires lat/long/radius)
GET /api/cities/{id}                      - Get city by ID
GET /api/cities/{id}/state                - Get city's state
GET /api/cities/{id}/country              - Get city's country
```

## Search (Alternative Format - 3 endpoints)

```
GET /api/search/countries                 - Search countries by name, iso2, iso3, region, subregion
GET /api/search/states                    - Search states by name, country_id, country_code, iso2
GET /api/search/cities                    - Search cities by name, state_id, country_id, codes
```

## Statistics (1 endpoint)

```
GET /api/stats                            - Get database statistics (counts)
```

## Total: 28 Endpoints

All endpoints support both formats:
- Resource-based: `/api/countries/search`
- Search-based: `/api/search/countries`
