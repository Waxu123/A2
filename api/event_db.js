/**
 * Database Connection Configuration File
 * Connects to MySQL database charityevents_db
 */

const mysql = require('mysql2');

// Create database connection pool configuration
const pool = mysql.createPool({
    host: 'localhost',           // Database host address
    user: 'root',                // MySQL username
    password: '123456',          // MySQL password
    database: 'charityevents_db', // Database name
    waitForConnections: true,
    connectionLimit: 10,         // Maximum number of connections in pool
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Use Promise wrapper for async/await support
const promisePool = pool.promise();

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error('   Please ensure MySQL service is running');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   Please check database username and password');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('   Please run the SQL file to create the database first');
        }
        return;
    }
    
    if (connection) {
        console.log('✅ Database connected successfully!');
        connection.release(); // Release connection back to pool
    }
});

// Gracefully close connection pool
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('Error closing database connection pool:', err);
        } else {
            console.log('Database connection pool closed');
        }
        process.exit(0);
    });
});

// Export connection pool for use by other modules
module.exports = promisePool;
