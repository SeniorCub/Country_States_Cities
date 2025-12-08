# Country States Cities API

A comprehensive geographical data API providing information about countries, states/regions, and cities. This project includes two implementations: a Node.js/Express version and a Laravel/PHP version.

## 📋 Overview

This project provides RESTful APIs to access detailed geographical data including:
- **Countries** - Complete country information with ISO codes, currencies, phone codes, capitals, and more
- **States/Regions** - State and regional data with translations
- **Cities** - City information with geographical coordinates
- **Subregions** - Subregional classifications

## 🏗️ Project Structure

```
Country_States_Cities/
├── Node/          # Node.js/Express implementation
└── Laravel/       # Laravel/PHP implementation
```

## 🚀 Implementations

### Node.js Implementation
- **Location**: `/Node`
- **Framework**: Express.js
- **Database**: SQLite
- **Port**: 9055 (default)
- **Features**:
  - Lightweight and fast
  - SQLite database for easy deployment
  - CORS enabled
  - Comprehensive region, subregion, country, state, and city endpoints

### Laravel Implementation
- **Location**: `/Laravel`
- **Framework**: Laravel 10
- **Database**: MySQL/MariaDB
- **Port**: 8000 (default)
- **Features**:
  - Full Laravel framework capabilities
  - Eloquent ORM
  - Pagination support
  - RESTful API design

## 🔧 Getting Started

### Node.js Version

1. Navigate to the Node directory:
```bash
cd Node
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The API will be available at `http://localhost:9055`

### Laravel Version

1. Navigate to the Laravel directory:
```bash
cd Laravel
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node dependencies:
```bash
npm install
```

4. Configure environment:
```bash
cp .env.example .env
# Edit .env with your database configuration
php artisan key:generate
```

5. Run migrations:
```bash
php artisan migrate
```

6. Start the server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

## 📖 API Documentation

Each implementation includes detailed API documentation:

- **Node.js**: See `/Node/API_DOCUMENTATION.md` and `/Node/ENDPOINTS.md`
- **Laravel**: See `/Laravel/API_DOCUMENTATION.md` and `/Laravel/NEW_ENDPOINTS.md`

### Quick Examples

#### Get All Countries
```bash
# Node.js
GET http://localhost:9055/api/countries

# Laravel
GET http://localhost:8000/api/countries
```

#### Get States by Country
```bash
# Node.js
GET http://localhost:9055/api/countries/{id}/states

# Laravel
GET http://localhost:8000/api/countries/{id}/states
```

#### Get Cities by State
```bash
# Node.js
GET http://localhost:9055/api/states/{id}/cities

# Laravel
GET http://localhost:8000/api/states/{id}/cities
```

## 📦 Postman Collections

Both implementations include Postman collections for easy API testing:
- **Node.js**: `Country-State-City-API.postman_collection.json`
- **Laravel**: `Location_API.postman_collection.json`

Import these collections into Postman to quickly test all available endpoints.

## 🛠️ Tech Stack

### Node.js Version
- Express.js
- SQLite (via better-sqlite3 or similar)
- CORS
- dotenv
- JWT (jsonwebtoken)
- bcrypt

### Laravel Version
- Laravel 10
- PHP 8.1+
- MySQL/MariaDB
- Laravel Sanctum
- Guzzle HTTP
- Vite

## 📄 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue in the repository.
