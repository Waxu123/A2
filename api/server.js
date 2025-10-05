/**
 * RESTful API Server
 * Provides data interface for charity events management website
 */

const express = require('express');
const cors = require('cors');
const db = require('./event_db');

const app = express();
const PORT = 3000;

// Middleware configuration
app.use(cors()); // Enable cross-origin requests
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// API Endpoints
// ============================================

/**
 * Root path - API information
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Charity Events Management System API',
        version: '1.0.0',
        endpoints: {
            events: '/api/events - Get all current/upcoming events',
            eventById: '/api/events/:id - Get specific event details',
            categories: '/api/categories - Get all event categories',
            search: '/api/events/search - Search events (query params: date, city, category)'
        }
    });
});

/**
 * Endpoint 1: Get all current or upcoming events
 * GET /api/events
 * Returns non-suspended events with status 'upcoming' or 'ongoing'
 */
app.get('/api/events', async (req, res) => {
    try {
        const query = `
            SELECT 
                ce.event_id,
                ce.event_name,
                ce.description,
                ce.event_date,
                ce.event_time,
                ce.location,
                ce.city,
                ce.ticket_price,
                ce.is_free,
                ce.image_url,
                ce.status,
                cat.category_name,
                org.organization_name
            FROM charity_events ce
            JOIN event_categories cat ON ce.category_id = cat.category_id
            JOIN charity_organizations org ON ce.organization_id = org.organization_id
            WHERE ce.is_suspended = FALSE 
            AND ce.status IN ('upcoming', 'ongoing')
            AND ce.event_date >= CURDATE()
            ORDER BY ce.event_date ASC
        `;
        
        const [events] = await db.query(query);
        
        res.json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        console.error('Error fetching events list:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * Endpoint 4: Search events (must be defined before :id route)
 * GET /api/events/search?date=YYYY-MM-DD&city=CityName&category=CategoryID
 * Supports single or multiple filter criteria
 */
app.get('/api/events/search', async (req, res) => {
    try {
        const { date, city, category } = req.query;
        
        // Base query
        let query = `
            SELECT 
                ce.event_id,
                ce.event_name,
                ce.description,
                ce.event_date,
                ce.event_time,
                ce.location,
                ce.city,
                ce.ticket_price,
                ce.is_free,
                ce.image_url,
                ce.status,
                cat.category_name,
                org.organization_name
            FROM charity_events ce
            JOIN event_categories cat ON ce.category_id = cat.category_id
            JOIN charity_organizations org ON ce.organization_id = org.organization_id
            WHERE ce.is_suspended = FALSE 
            AND ce.status IN ('upcoming', 'ongoing')
            AND ce.event_date >= CURDATE()
        `;
        
        const queryParams = [];
        
        // Filter by date
        if (date) {
            query += ' AND ce.event_date = ?';
            queryParams.push(date);
        }
        
        // Filter by city
        if (city) {
            query += ' AND ce.city LIKE ?';
            queryParams.push(`%${city}%`);
        }
        
        // Filter by category
        if (category) {
            query += ' AND ce.category_id = ?';
            queryParams.push(category);
        }
        
        query += ' ORDER BY ce.event_date ASC';
        
        const [events] = await db.query(query, queryParams);
        
        res.json({
            success: true,
            count: events.length,
            filters: {
                date: date || null,
                city: city || null,
                category: category || null
            },
            data: events
        });
    } catch (error) {
        console.error('Error searching events:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * Endpoint 2: Get event details by ID
 * GET /api/events/:id
 */
app.get('/api/events/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        
        const query = `
            SELECT 
                ce.*,
                cat.category_name,
                cat.description as category_description,
                org.organization_name,
                org.description as organization_description,
                org.contact_email,
                org.contact_phone,
                org.website
            FROM charity_events ce
            JOIN event_categories cat ON ce.category_id = cat.category_id
            JOIN charity_organizations org ON ce.organization_id = org.organization_id
            WHERE ce.event_id = ?
        `;
        
        const [events] = await db.query(query, [eventId]);
        
        if (events.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }
        
        res.json({
            success: true,
            data: events[0]
        });
    } catch (error) {
        console.error('Error fetching event details:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * Endpoint 3: Get all event categories
 * GET /api/categories
 */
app.get('/api/categories', async (req, res) => {
    try {
        const query = `
            SELECT 
                category_id,
                category_name,
                description
            FROM event_categories
            ORDER BY category_name ASC
        `;
        
        const [categories] = await db.query(query);
        
        res.json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        console.error('Error fetching categories list:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

/**
 * Endpoint 5: Get all cities list (for search filters)
 * GET /api/cities
 */
app.get('/api/cities', async (req, res) => {
    try {
        const query = `
            SELECT DISTINCT city
            FROM charity_events
            WHERE is_suspended = FALSE
            ORDER BY city ASC
        `;
        
        const [cities] = await db.query(query);
        
        res.json({
            success: true,
            count: cities.length,
            data: cities.map(c => c.city)
        });
    } catch (error) {
        console.error('Error fetching cities list:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Requested resource not found'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: err.message
    });
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 API Server running at: http://localhost:${PORT}`);
    console.log(`📋 API Documentation: http://localhost:${PORT}`);
    console.log('='.repeat(50));
});

module.exports = app;


