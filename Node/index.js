import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connect from './database.js';
import path from 'path';
import { fileURLToPath } from 'url';
import os from 'os';
import fs from 'fs';

dotenv.config(); // Load environment variables

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};
app.use(cors(corsOptions));

// Serve API documentation page
app.get('/', (req, res) => {
    const docPath = path.join(__dirname, 'API_DOCUMENTATION.md');
    const markdown = fs.readFileSync(docPath, 'utf-8');

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Country-State-City API Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
        .container { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; border-bottom: 2px solid #ecf0f1; padding-bottom: 8px; }
        h3 { color: #7f8c8d; }
        code { background: #f8f9fa; padding: 2px 6px; border-radius: 3px; font-family: 'Courier New', monospace; color: #e74c3c; }
        pre { background: #2c3e50; color: #ecf0f1; padding: 15px; border-radius: 5px; overflow-x: auto; }
        pre code { background: transparent; color: #ecf0f1; padding: 0; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
        table { border-collapse: collapse; width: 100%; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
        th { background: #3498db; color: white; }
        .endpoint { background: #e8f4f8; padding: 10px; border-left: 4px solid #3498db; margin: 10px 0; border-radius: 3px; }
    </style>
</head>
<body>
    <div class="container">
        <div id="content"></div>
    </div>
    <script>
        const markdown = ${JSON.stringify(markdown)};
        document.getElementById('content').innerHTML = marked.parse(markdown);
    </script>
</body>
</html>
    `;

    res.send(html);
});

// ========== REGIONS ENDPOINTS ==========

// Get all regions
app.get('/api/regions', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM regions ORDER BY name');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get region by ID
app.get('/api/regions/:regionId', async (req, res) => {
    const { regionId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM regions WHERE id = ?', [regionId]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, error: 'Region not found' });
            return;
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get subregions by region
app.get('/api/regions/:regionId/subregions', async (req, res) => {
    const { regionId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM subregions WHERE region_id = ? ORDER BY name', [regionId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get countries by region
app.get('/api/regions/:regionId/countries', async (req, res) => {
    const { regionId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM countries WHERE region_id = ? ORDER BY name', [regionId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== SUBREGIONS ENDPOINTS ==========

// Get all subregions
app.get('/api/subregions', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM subregions ORDER BY name');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get subregion by ID
app.get('/api/subregions/:subregionId', async (req, res) => {
    const { subregionId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM subregions WHERE id = ?', [subregionId]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, error: 'Subregion not found' });
            return;
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get countries by subregion
app.get('/api/subregions/:subregionId/countries', async (req, res) => {
    const { subregionId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM countries WHERE subregion_id = ? ORDER BY name', [subregionId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== COUNTRIES ENDPOINTS ==========

// Endpoint to get all countries
app.get('/api/countries', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM countries ORDER BY name');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get country by ISO code (must be before :countryId route)
app.get('/api/countries/code/:code', async (req, res) => {
    const { code } = req.params;
    const upperCode = code.toUpperCase();
    try {
        const [rows] = await connect.query(
            'SELECT * FROM countries WHERE iso2 = ? OR iso3 = ?', 
            [upperCode, upperCode]
        );
        if (rows.length === 0) {
            res.status(404).json({ success: false, error: 'Country not found' });
            return;
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to get a single country by ID
app.get('/api/countries/:countryId', async (req, res) => {
    const { countryId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM countries WHERE id = ?', [countryId]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, error: 'Country not found' });
            return;
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to get all states
app.get('/api/states', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM states ORDER BY name');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to get all states for a given country
app.get('/api/countries/:countryId/states', async (req, res) => {
    const { countryId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM states WHERE country_id = ? ORDER BY name', [countryId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to get a single state by ID
app.get('/api/states/:stateId', async (req, res) => {
    const { stateId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM states WHERE id = ?', [stateId]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, error: 'State not found' });
            return;
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get state's country
app.get('/api/states/:stateId/country', async (req, res) => {
    const { stateId } = req.params;
    try {
        const [states] = await connect.query('SELECT country_id FROM states WHERE id = ?', [stateId]);
        if (states.length === 0) {
            res.status(404).json({ success: false, error: 'State not found' });
            return;
        }
        const [country] = await connect.query('SELECT * FROM countries WHERE id = ?', [states[0].country_id]);
        if (country.length === 0) {
            res.status(404).json({ success: false, error: 'Country not found' });
            return;
        }
        res.json({ success: true, data: country[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to get all cities
app.get('/api/cities', async (req, res) => {
    try {
        const [rows] = await connect.query('SELECT * FROM cities ORDER BY name');
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Find nearby cities (must be before :cityId route)
app.get('/api/cities/nearby', async (req, res) => {
    const { latitude, longitude, radius = 50 } = req.query;
    
    if (!latitude || !longitude) {
        res.status(422).json({ 
            success: false, 
            error: 'The latitude and longitude fields are required.' 
        });
        return;
    }

    const numRadius = Math.min(parseFloat(radius), 1000);
    
    try {
        const [rows] = await connect.query(`
            SELECT *,
                (6371 * acos(cos(radians(?)) 
                * cos(radians(latitude)) 
                * cos(radians(longitude) - radians(?)) 
                + sin(radians(?)) 
                * sin(radians(latitude)))) AS distance
            FROM cities
            WHERE latitude IS NOT NULL 
                AND longitude IS NOT NULL
            HAVING distance <= ?
            ORDER BY distance
            LIMIT 50
        `, [latitude, longitude, latitude, numRadius]);
        
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to get all cities for a given state
app.get('/api/states/:stateId/cities', async (req, res) => {
    const { stateId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM cities WHERE state_id = ? ORDER BY name', [stateId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Endpoint to get a single city by ID
app.get('/api/cities/:cityId', async (req, res) => {
    const { cityId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM cities WHERE id = ?', [cityId]);
        if (rows.length === 0) {
            res.status(404).json({ success: false, error: 'City not found' });
            return;
        }
        res.json({ success: true, data: rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get city's state
app.get('/api/cities/:cityId/state', async (req, res) => {
    const { cityId } = req.params;
    try {
        const [cities] = await connect.query('SELECT state_id FROM cities WHERE id = ?', [cityId]);
        if (cities.length === 0) {
            res.status(404).json({ success: false, error: 'City not found' });
            return;
        }
        const [state] = await connect.query('SELECT * FROM states WHERE id = ?', [cities[0].state_id]);
        if (state.length === 0) {
            res.status(404).json({ success: false, error: 'State not found' });
            return;
        }
        res.json({ success: true, data: state[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get city's country
app.get('/api/cities/:cityId/country', async (req, res) => {
    const { cityId } = req.params;
    try {
        const [cities] = await connect.query('SELECT country_id FROM cities WHERE id = ?', [cityId]);
        if (cities.length === 0) {
            res.status(404).json({ success: false, error: 'City not found' });
            return;
        }
        const [country] = await connect.query('SELECT * FROM countries WHERE id = ?', [cities[0].country_id]);
        if (country.length === 0) {
            res.status(404).json({ success: false, error: 'Country not found' });
            return;
        }
        res.json({ success: true, data: country[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get cities by country ID
app.get('/api/countries/:countryId/cities', async (req, res) => {
    const { countryId } = req.params;
    try {
        const [rows] = await connect.query('SELECT * FROM cities WHERE country_id = ? ORDER BY name', [countryId]);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== SEARCH ENDPOINTS ==========

// Search countries by name
app.get('/api/search/countries', async (req, res) => {
    const { q, name, iso2, iso3, region, subregion } = req.query;
    try {
        let query = 'SELECT * FROM countries WHERE 1=1';
        const params = [];

        const searchTerm = q || name;
        if (searchTerm) {
            query += ' AND name LIKE ?';
            params.push(`%${searchTerm}%`);
        }
        if (iso2) {
            query += ' AND iso2 = ?';
            params.push(iso2.toUpperCase());
        }
        if (iso3) {
            query += ' AND iso3 = ?';
            params.push(iso3.toUpperCase());
        }
        if (region) {
            query += ' AND region LIKE ?';
            params.push(`%${region}%`);
        }
        if (subregion) {
            query += ' AND subregion LIKE ?';
            params.push(`%${subregion}%`);
        }

        query += ' ORDER BY name LIMIT 100';
        const [rows] = await connect.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Search states by name
app.get('/api/search/states', async (req, res) => {
    const { q, name, country_id, country_code, iso2 } = req.query;
    try {
        let query = 'SELECT * FROM states WHERE 1=1';
        const params = [];

        const searchTerm = q || name;
        if (searchTerm) {
            query += ' AND name LIKE ?';
            params.push(`%${searchTerm}%`);
        }
        if (country_id) {
            query += ' AND country_id = ?';
            params.push(country_id);
        }
        if (country_code) {
            query += ' AND country_code = ?';
            params.push(country_code.toUpperCase());
        }
        if (iso2) {
            query += ' AND iso2 = ?';
            params.push(iso2.toUpperCase());
        }

        query += ' ORDER BY name LIMIT 100';
        const [rows] = await connect.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Search cities by name
app.get('/api/search/cities', async (req, res) => {
    const { q, name, state_id, country_id, country_code, state_code } = req.query;
    try {
        let query = 'SELECT * FROM cities WHERE 1=1';
        const params = [];

        const searchTerm = q || name;
        if (searchTerm) {
            query += ' AND name LIKE ?';
            params.push(`%${searchTerm}%`);
        }
        if (state_id) {
            query += ' AND state_id = ?';
            params.push(state_id);
        }
        if (country_id) {
            query += ' AND country_id = ?';
            params.push(country_id);
        }
        if (country_code) {
            query += ' AND country_code = ?';
            params.push(country_code.toUpperCase());
        }
        if (state_code) {
            query += ' AND state_code = ?';
            params.push(state_code.toUpperCase());
        }

        query += ' ORDER BY name LIMIT 100';
        const [rows] = await connect.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== STATISTICS ENDPOINTS ==========

// Get statistics
app.get('/api/stats', async (req, res) => {
    try {
        const [countries] = await connect.query('SELECT COUNT(*) as count FROM countries');
        const [states] = await connect.query('SELECT COUNT(*) as count FROM states');
        const [cities] = await connect.query('SELECT COUNT(*) as count FROM cities');
        const [regions] = await connect.query('SELECT COUNT(*) as count FROM regions');
        const [subregions] = await connect.query('SELECT COUNT(*) as count FROM subregions');

        res.json({
            success: true,
            data: {
                countries: countries[0].count,
                states: states[0].count,
                cities: cities[0].count,
                regions: regions[0].count,
                subregions: subregions[0].count
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});


const PORT = process.env.PORT || 9055; // Changed to match your network service port

// Function to get network IP
function getNetworkIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over non-IPv4 and internal (loopback) addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '0.0.0.0'; // Default fallback
}

app.listen(PORT, '0.0.0.0', () => {
    const networkIp = getNetworkIp();
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Network: http://${networkIp}:${PORT}`);
});
