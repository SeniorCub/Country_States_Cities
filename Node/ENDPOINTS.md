# Complete API Endpoints List

Base URL: `http://localhost:9055`

## Regions (4 endpoints)

```
GET /api/regions                          - Get all regions
GET /api/regions/:regionId                - Get region by ID
GET /api/regions/:regionId/subregions     - Get subregions by region
GET /api/regions/:regionId/countries      - Get countries by region
```

## Subregions (3 endpoints)

```
GET /api/subregions                       - Get all subregions
GET /api/subregions/:subregionId          - Get subregion by ID
GET /api/subregions/:subregionId/countries - Get countries by subregion
```

## Countries (6 endpoints)

```
GET /api/countries                        - Get all countries
GET /api/countries/code/:code             - Get country by ISO2/ISO3 code
GET /api/countries/:countryId             - Get country by ID
GET /api/countries/:countryId/states      - Get states by country
GET /api/countries/:countryId/cities      - Get cities by country
GET /api/countries/search                 - Search countries (use /api/search/countries)
```

## States (5 endpoints)

```
GET /api/states                           - Get all states
GET /api/states/:stateId                  - Get state by ID
GET /api/states/:stateId/cities           - Get cities by state
GET /api/states/:stateId/country          - Get state's country
GET /api/states/search                    - Search states (use /api/search/states)
```

## Cities (6 endpoints)

```
GET /api/cities                           - Get all cities
GET /api/cities/nearby                    - Find nearby cities (requires lat/long/radius)
GET /api/cities/:cityId                   - Get city by ID
GET /api/cities/:cityId/state             - Get city's state
GET /api/cities/:cityId/country           - Get city's country
GET /api/cities/search                    - Search cities (use /api/search/cities)
```

## Search (3 endpoints)

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
