/**
 * RESTful API 服务器
 * 为慈善活动管理网站提供数据接口
 */

const express = require('express');
const cors = require('cors');
const db = require('./event_db');

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.urlencoded({ extended: true })); // 解析URL编码的请求体

// 请求日志中间件
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ============================================
// API 端点
// ============================================

/**
 * 根路径 - API信息
 */
app.get('/', (req, res) => {
    res.json({
        message: '慈善活动管理系统 API',
        version: '1.0.0',
        endpoints: {
            events: '/api/events - 获取所有当前/即将举行的活动',
            eventById: '/api/events/:id - 获取特定活动详情',
            categories: '/api/categories - 获取所有活动类别',
            search: '/api/events/search - 搜索活动 (查询参数: date, city, category)'
        }
    });
});

/**
 * 端点1: 获取所有当前或即将举行的活动
 * GET /api/events
 * 返回未暂停、状态为upcoming或ongoing的活动列表
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
        console.error('获取活动列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

/**
 * 端点4: 搜索活动 (必须在 :id 路由之前定义)
 * GET /api/events/search?date=YYYY-MM-DD&city=城市名&category=类别ID
 * 支持单个或多个筛选条件
 */
app.get('/api/events/search', async (req, res) => {
    try {
        const { date, city, category } = req.query;
        
        // 基础查询
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
        
        // 根据日期筛选
        if (date) {
            query += ' AND ce.event_date = ?';
            queryParams.push(date);
        }
        
        // 根据城市筛选
        if (city) {
            query += ' AND ce.city LIKE ?';
            queryParams.push(`%${city}%`);
        }
        
        // 根据类别筛选
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
        console.error('搜索活动错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

/**
 * 端点2: 根据ID获取活动详情
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
                message: '未找到该活动'
            });
        }
        
        res.json({
            success: true,
            data: events[0]
        });
    } catch (error) {
        console.error('获取活动详情错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

/**
 * 端点3: 获取所有活动类别
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
        console.error('获取类别列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

/**
 * 端点5: 获取所有城市列表（用于搜索筛选）
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
        console.error('获取城市列表错误:', error);
        res.status(500).json({
            success: false,
            message: '服务器错误',
            error: error.message
        });
    }
});

// 404 处理
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: '未找到请求的资源'
    });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err);
    res.status(500).json({
        success: false,
        message: '服务器内部错误',
        error: err.message
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log(`🚀 API服务器运行在: http://localhost:${PORT}`);
    console.log(`📋 API文档: http://localhost:${PORT}`);
    console.log('='.repeat(50));
});

module.exports = app;


