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

// Simple In-Memory LRU Cache for API routes
const apiCache = new Map();
app.use('/api', (req, res, next) => {
    if (req.method !== 'GET') return next();
    
    // Don't cache search with specific parameters to prevent memory bloat, 
    // except for simple global search or no-param requests.
    const key = req.originalUrl;
    
    if (apiCache.has(key)) {
        res.setHeader('X-Cache', 'HIT');
        return res.json(apiCache.get(key));
    }
    
    const originalJson = res.json.bind(res);
    res.json = (body) => {
        if (body.success) {
            // Cap memory limit to 500 distinct requests
            if (apiCache.size >= 500) {
                const firstKey = apiCache.keys().next().value;
                apiCache.delete(firstKey);
            }
            apiCache.set(key, body);
        }
        res.setHeader('X-Cache', 'MISS');
        originalJson(body);
    };
    next();
});

// Serve API documentation page
app.get('/', (req, res) => {
    try {
        const docPath = path.join(__dirname, 'API_DOCUMENTATION.md');
        let markdown = 'Documentation file not found.';
        
        if (fs.existsSync(docPath)) {
            markdown = fs.readFileSync(docPath, 'utf-8');
        }

        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Country-State-City API Documentation</title>
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .markdown-body { padding: 2rem; color: #374151; }
        .markdown-body h1 { font-size: 2.25rem; font-weight: 800; color: #111827; margin-bottom: 1.5rem; border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
        .markdown-body h2 { font-size: 1.75rem; font-weight: 700; color: #1f2937; margin-top: 3rem; margin-bottom: 1rem; }
        .markdown-body h3 { font-size: 1.25rem; font-weight: 600; color: #374151; margin-top: 2rem; margin-bottom: 0.75rem; }
        .markdown-body p { margin-bottom: 1rem; line-height: 1.7; }
        .markdown-body ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.5rem; }
        .markdown-body li { margin-bottom: 0.5rem; }
        .markdown-body code:not(pre code) { background-color: #f3f4f6; color: #ef4444; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; font-family: monospace; }
        .markdown-body pre { background-color: #1f2937; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin-bottom: 1.5rem; }
        .markdown-body pre code { color: #e5e7eb; font-family: monospace; font-size: 0.875em; }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1e293b; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #64748b; }
    </style>
</head>
<body class="bg-gray-50 min-h-screen font-sans">
    <nav class="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <div class="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <h1 class="text-xl font-bold flex items-center gap-2">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Location API Explorer
            </h1>
            <span class="bg-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">Interactive Mode</span>
        </div>
    </nav>

    <div class="max-w-5xl mx-auto bg-white my-8 shadow-sm border border-gray-200 rounded-xl overflow-hidden">
        <div id="content" class="markdown-body"></div>
    </div>

    <script>
        // Safely pass the markdown content to the client
        const rawMarkdown = ${JSON.stringify(markdown)};
        document.getElementById('content').innerHTML = marked.parse(rawMarkdown);

        // Inject Interactive API Tester
        document.querySelectorAll('pre code').forEach(block => {
            const text = block.innerText.trim();
            if (text.startsWith('GET /api/')) {
                const lines = text.split('\\n');
                const urlPath = lines[0].replace('GET ', '').trim();
                
                const container = document.createElement('div');
                container.className = 'bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2 mb-8 shadow-sm';
                container.innerHTML = \`
                    <div class="flex flex-col sm:flex-row items-center gap-3 mb-3">
                        <span class="bg-emerald-500 text-white px-3 py-1.5 rounded text-sm font-bold shadow-sm">GET</span>
                        <div class="flex-1 w-full flex bg-white border border-gray-300 rounded overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
                            <span class="bg-gray-100 text-gray-500 px-3 py-2 text-sm border-r border-gray-300 hidden sm:block select-none">\${window.location.origin}</span>
                            <input type="text" class="api-url flex-1 px-3 py-2 text-sm font-mono text-gray-700 outline-none w-full" value="\${urlPath}">
                        </div>
                        <button class="send-btn w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-semibold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
                            <span>Send Request</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </button>
                    </div>
                    <div class="response-container hidden">
                        <div class="flex justify-between items-center mb-2 px-1">
                            <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Response Data</span>
                            <span class="status-code text-xs font-bold px-2 py-1 rounded-full"></span>
                        </div>
                        <div class="relative group">
                            <pre class="bg-gray-900 text-emerald-400 p-4 rounded-md overflow-x-auto text-sm max-h-96 custom-scrollbar m-0"><code class="response-body font-mono"></code></pre>
                        </div>
                    </div>
                \`;
                
                // Hide the original block and insert the interactive one
                block.parentElement.style.display = 'none';
                block.parentElement.insertAdjacentElement('beforebegin', container);

                const btn = container.querySelector('.send-btn');
                const input = container.querySelector('.api-url');
                const resContainer = container.querySelector('.response-container');
                const resBody = container.querySelector('.response-body');
                const statusCode = container.querySelector('.status-code');

                btn.addEventListener('click', async () => {
                    const originalBtnContent = btn.innerHTML;
                    btn.innerHTML = '<svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg><span>Executing...</span>';
                    btn.disabled = true;
                    resContainer.classList.remove('hidden');
                    
                    try {
                        const startTime = performance.now();
                        let fetchUrl = input.value;
                        if (!fetchUrl.startsWith('/')) fetchUrl = '/' + fetchUrl;
                        
                        const res = await fetch(fetchUrl);
                        const isJson = res.headers.get('content-type')?.includes('application/json');
                        const data = isJson ? await res.json() : await res.text();
                        
                        const endTime = performance.now();
                        const timeTaken = Math.round(endTime - startTime);
                        
                        statusCode.innerText = \`\${res.status} \${res.statusText} • \${timeTaken}ms\`;
                        statusCode.className = \`status-code text-xs font-bold px-2 py-1 rounded-full \${res.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}\`;
                        
                        resBody.innerText = isJson ? JSON.stringify(data, null, 2) : data;
                    } catch (err) {
                        statusCode.innerText = 'Network Error';
                        statusCode.className = 'status-code text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-800';
                        resBody.innerText = String(err);
                    } finally {
                        btn.innerHTML = originalBtnContent;
                        btn.disabled = false;
                    }
                });
            }
        });
    </script>
</body>
</html>
        `;
        res.send(html);
    } catch (err) {
        res.status(500).send('<h1>Internal Server Error</h1><p>' + err.message + '</p>');
    }
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
    const { q, name, iso2, iso3, region, subregion, page = 1, limit = 15 } = req.query;
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

        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' ORDER BY name LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await connect.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Search states by name
app.get('/api/search/states', async (req, res) => {
    const { q, name, country_id, country_code, iso2, page = 1, limit = 15 } = req.query;
    try {
        let query = 'SELECT s.*, c.name as country_name FROM states s JOIN countries c ON s.country_id = c.id WHERE 1=1';
        const params = [];

        const searchTerm = q || name;
        if (searchTerm) {
            query += ' AND s.name LIKE ?';
            params.push(`%${searchTerm}%`);
        }
        if (country_id) {
            query += ' AND s.country_id = ?';
            params.push(country_id);
        }
        if (country_code) {
            query += ' AND s.country_code = ?';
            params.push(country_code.toUpperCase());
        }
        if (iso2) {
            query += ' AND s.iso2 = ?';
            params.push(iso2.toUpperCase());
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' ORDER BY s.name LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await connect.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// Search cities by name
app.get('/api/search/cities', async (req, res) => {
    const { q, name, state_id, country_id, country_code, state_code, page = 1, limit = 15 } = req.query;
    try {
        let query = 'SELECT ci.*, s.name as state_name, co.name as country_name FROM cities ci JOIN states s ON ci.state_id = s.id JOIN countries co ON ci.country_id = co.id WHERE 1=1';
        const params = [];

        const searchTerm = q || name;
        if (searchTerm) {
            query += ' AND ci.name LIKE ?';
            params.push(`%${searchTerm}%`);
        }
        if (state_id) {
            query += ' AND ci.state_id = ?';
            params.push(state_id);
        }
        if (country_id) {
            query += ' AND ci.country_id = ?';
            params.push(country_id);
        }
        if (country_code) {
            query += ' AND ci.country_code = ?';
            params.push(country_code.toUpperCase());
        }
        if (state_code) {
            query += ' AND ci.state_code = ?';
            params.push(state_code.toUpperCase());
        }

        const offset = (parseInt(page) - 1) * parseInt(limit);
        query += ' ORDER BY ci.name LIMIT ? OFFSET ?';
        params.push(parseInt(limit), offset);

        const [rows] = await connect.query(query, params);
        res.json({ success: true, data: rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== GLOBAL SEARCH ENDPOINT ==========

app.get('/api/search', async (req, res) => {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.length < 2) {
        res.status(422).json({ 
            success: false, 
            error: 'The q parameter is required and must be at least 2 characters.' 
        });
        return;
    }

    try {
        const numLimit = parseInt(limit);
        
        const [countries] = await connect.query(
            'SELECT * FROM countries WHERE name LIKE ? LIMIT ?', 
            [`%${q}%`, numLimit]
        );
        
        const [states] = await connect.query(
            'SELECT s.*, c.name as country_name FROM states s JOIN countries c ON s.country_id = c.id WHERE s.name LIKE ? LIMIT ?', 
            [`%${q}%`, numLimit]
        );
        
        const [cities] = await connect.query(
            'SELECT ci.*, s.name as state_name, co.name as country_name FROM cities ci JOIN states s ON ci.state_id = s.id JOIN countries co ON ci.country_id = co.id WHERE ci.name LIKE ? LIMIT ?', 
            [`%${q}%`, numLimit]
        );

        res.json({
            success: true,
            data: {
                countries,
                states,
                cities
            }
        });
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

// Only listen when not on Vercel
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
        const networkIp = getNetworkIp();
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Network: http://${networkIp}:${PORT}`);
    });
}

export default app;
