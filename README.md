# Charity Events Management Platform

A dynamic web application for managing and promoting charitable events, connecting charity organizations with potential participants.

**Course:** PROG2002 Web Development II  
**Assessment:** Assignment 2 (A2)

---

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Installation Guide](#installation-guide)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)

---

## Overview

This project implements a three-tier web application that enables users to discover, search, and view detailed information about charitable events. The system consists of a MySQL database backend, a RESTful API layer built with Node.js and Express, and a client-side interface developed using HTML5, CSS3, and vanilla JavaScript.

### Project Structure

```
.
├── api/
│   ├── database/
│   │   ├── charityevents_db.sql          # Database schema and data
│   │   └── charityevents_db_english.sql  # English version
│   ├── event_db.js                       # Database connection configuration
│   ├── server.js                         # Express server and API endpoints
│   └── package.json                      # Dependencies
│
├── client/
│   ├── css/
│   │   └── styles.css                    # Application styling
│   ├── js/
│   │   ├── api.js                        # API wrapper module
│   │   ├── home.js                       # Home page functionality
│   │   ├── search.js                     # Search page functionality
│   │   └── details.js                    # Event details functionality
│   ├── index.html                        # Home page
│   ├── search.html                       # Search page
│   └── details.html                      # Event details page
│
└── README.md
```

---

## Technology Stack

### Backend
- Node.js - JavaScript runtime environment
- Express.js - Web application framework
- MySQL - Relational database management system
- mysql2 - MySQL client for Node.js with Promise support
- CORS - Cross-Origin Resource Sharing middleware

### Frontend
- HTML5 - Semantic markup structure
- CSS3 - Styling and responsive design
- JavaScript (ES6+) - Client-side logic and DOM manipulation
- Fetch API - HTTP request handling

---

## Features

### Home Page
- Displays organizational mission and contact information
- Dynamically loads and presents upcoming charity events
- Event cards showing key information (name, date, location, price, category)
- Direct navigation to event details pages

### Search Page
- Multi-criteria filtering (date, city, category)
- Dynamically populated filter options from database
- Clear filters functionality demonstrating DOM manipulation
- Search results display with error handling
- Empty state management for no results

### Event Details Page
- Comprehensive event information display
- Visual fundraising progress indicators
- Organization details and contact information
- Registration button with modal notification (feature under construction)
- URL parameter-based event identification

### RESTful API
- GET /api/events - Retrieve all current and upcoming events
- GET /api/events/:id - Retrieve specific event details
- GET /api/categories - Retrieve all event categories
- GET /api/cities - Retrieve all cities with available events
- GET /api/events/search - Search events with filters

---

## Installation Guide

### Prerequisites

Ensure the following software is installed on your system:
- Node.js (version 14.0 or higher)
- MySQL (version 8.0 or higher)
- Python 3.x (for running the client development server)

### Step 1: Database Setup

1. Start your MySQL service

2. Execute the database creation script:
```bash
mysql -u root -p < api/database/charityevents_db.sql
```

Alternatively, open and execute the SQL file in MySQL Workbench.

3. Verify successful database creation:
```sql
USE charityevents_db;
SHOW TABLES;
SELECT COUNT(*) FROM charity_events;
```

Expected output: 3 tables (charity_organizations, event_categories, charity_events) with at least 10 events.

### Step 2: Configure Database Connection

Edit `api/event_db.js` with your MySQL credentials:

```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',                    // Your MySQL username
    password: 'your_password',       // Your MySQL password
    database: 'charityevents_db'
});
```

### Step 3: Install Dependencies and Start API Server

```bash
cd api
npm install
npm start
```

The API server will start at `http://localhost:3000`

Verify the server is running by accessing: `http://localhost:3000`

### Step 4: Start Client Application

Open a new terminal window and navigate to the client directory:

```bash
cd client
python -m http.server 8080
```

The client application will be available at `http://localhost:8080`

### Step 5: Access the Application

Open your web browser and navigate to:
- Home Page: `http://localhost:8080/index.html`
- Search Page: `http://localhost:8080/search.html`

---

## Usage

### Browsing Events

1. Navigate to the home page to view all current and upcoming charity events
2. Scroll through the event listings displayed in card format
3. Click "View Details" on any event card to see comprehensive information

### Searching Events

1. Navigate to the search page from the main navigation menu
2. Apply filters based on your preferences:
   - Select a specific date using the date picker
   - Choose a city from the dropdown menu
   - Select an event category from available options
3. Click "Search Events" to retrieve filtered results
4. Click "Clear Filters" to reset all search criteria

### Viewing Event Details

1. Click on any event from the home page or search results
2. Review comprehensive event information including:
   - Event description and detailed information
   - Date, time, and location details
   - Ticket pricing information
   - Fundraising goals and current progress
   - Organization details and contact information
3. Click "Register" to see the feature notification modal

---

## API Documentation

All API endpoints return JSON responses with the following standard structure:

```json
{
    "success": boolean,
    "count": number,
    "data": array|object
}
```

### Endpoints

#### 1. Get All Events
```
GET /api/events
```

Returns all current and upcoming events (non-suspended, status: upcoming or ongoing).

**Response Example:**
```json
{
    "success": true,
    "count": 10,
    "data": [
        {
            "event_id": 1,
            "event_name": "Hope Light Charity Dinner 2025",
            "description": "A warm charity dinner fundraising for children's education",
            "event_date": "2025-11-15T00:00:00.000Z",
            "event_time": "18:00:00",
            "location": "City Center Hotel",
            "city": "Sydney",
            "ticket_price": 150.00,
            "is_free": 0,
            "category_name": "Charity Dinner",
            "organization_name": "Love Foundation"
        }
    ]
}
```

#### 2. Get Event by ID
```
GET /api/events/:id
```

Returns detailed information for a specific event.

**Parameters:**
- `id` (path parameter) - Event ID (integer)

**Response:** Single event object with complete details including organization and category information.

#### 3. Get All Categories
```
GET /api/categories
```

Returns all available event categories for filtering.

**Response Example:**
```json
{
    "success": true,
    "count": 7,
    "data": [
        {
            "category_id": 1,
            "category_name": "Charity Dinner",
            "description": "Formal fundraising dinner events"
        }
    ]
}
```

#### 4. Get All Cities
```
GET /api/cities
```

Returns distinct cities where events are available.

**Response Example:**
```json
{
    "success": true,
    "count": 4,
    "data": ["Sydney", "Melbourne", "Brisbane", "Perth"]
}
```

#### 5. Search Events
```
GET /api/events/search?date=YYYY-MM-DD&city=CityName&category=ID
```

Returns events matching specified criteria. All parameters are optional and can be combined.

**Query Parameters:**
- `date` (optional) - Event date in YYYY-MM-DD format
- `city` (optional) - City name (partial matching supported)
- `category` (optional) - Category ID (integer)

**Example Request:**
```
GET /api/events/search?city=Sydney&category=2
```

**Response:** Filtered event list with applied filters echoed in response.

---

## Database Schema

The database consists of three main tables with the following relationships:

### Tables

**charity_organizations**
- organization_id (PRIMARY KEY, AUTO_INCREMENT)
- organization_name (VARCHAR(200), NOT NULL)
- description (TEXT)
- contact_email (VARCHAR(100))
- contact_phone (VARCHAR(20))
- website (VARCHAR(200))
- created_at (TIMESTAMP)

**event_categories**
- category_id (PRIMARY KEY, AUTO_INCREMENT)
- category_name (VARCHAR(100), NOT NULL)
- description (TEXT)
- created_at (TIMESTAMP)

**charity_events**
- event_id (PRIMARY KEY, AUTO_INCREMENT)
- event_name (VARCHAR(200), NOT NULL)
- description (TEXT, NOT NULL)
- detailed_description (TEXT)
- event_date (DATE, NOT NULL)
- event_time (TIME)
- location (VARCHAR(200), NOT NULL)
- city (VARCHAR(100), NOT NULL)
- address (TEXT)
- category_id (FOREIGN KEY, NOT NULL)
- organization_id (FOREIGN KEY, NOT NULL)
- ticket_price (DECIMAL(10,2))
- is_free (BOOLEAN)
- fundraising_goal (DECIMAL(12,2))
- current_funds (DECIMAL(12,2))
- max_participants (INT)
- current_participants (INT)
- image_url (VARCHAR(300))
- is_suspended (BOOLEAN)
- status (ENUM: 'upcoming', 'ongoing', 'completed')
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### Relationships
- One organization can host many events (1:N)
- One category can contain many events (1:N)
- Each event belongs to exactly one organization and one category

### Indexes
- idx_event_date on charity_events(event_date)
- idx_event_city on charity_events(city)
- idx_event_category on charity_events(category_id)
- idx_event_status on charity_events(status)
- idx_event_suspended on charity_events(is_suspended)

---

## Testing

### API Testing with Postman

1. Import or create requests for each endpoint
2. Test with various parameters and verify responses
3. Check error handling by providing invalid inputs

### Browser Testing

1. Verify all pages load without console errors
2. Test navigation between pages
3. Confirm dynamic data loading and display
4. Test search functionality with different filter combinations
5. Verify responsive design at different viewport sizes

---

## Known Limitations

- Registration functionality displays a placeholder modal as per assignment requirements
- External image URLs may fail to load due to network conditions (fallback placeholders provided)
- Date display may vary slightly due to browser timezone settings

---

## Academic Integrity Statement

This project represents original work completed independently for academic assessment. All code is authored by the student, with external resources properly referenced where applicable. This submission adheres to Southern Cross University's academic integrity policies and guidelines.

---

**Last Updated:** October 4, 2025


