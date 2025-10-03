/**
 * 数据库连接配置文件
 * 用于连接MySQL数据库 charityevents_db
 */

const mysql = require('mysql2');

// 创建数据库连接池配置
const pool = mysql.createPool({
    host: 'localhost',           // 数据库主机地址
    user: 'root',                // MySQL用户名
    password: '123456',          // MySQL密码
    database: 'charityevents_db', // 数据库名称
    waitForConnections: true,
    connectionLimit: 10,         // 连接池最大连接数
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// 使用Promise包装，便于使用async/await
const promisePool = pool.promise();

// 测试数据库连接
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ 数据库连接失败:', err.message);
        if (err.code === 'ECONNREFUSED') {
            console.error('   请确保MySQL服务正在运行');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('   请检查数据库用户名和密码');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.error('   请先运行SQL文件创建数据库');
        }
        return;
    }
    
    if (connection) {
        console.log('✅ 数据库连接成功！');
        connection.release(); // 释放连接回连接池
    }
});

// 优雅关闭连接池
process.on('SIGINT', () => {
    pool.end((err) => {
        if (err) {
            console.error('关闭数据库连接池时出错:', err);
        } else {
            console.log('数据库连接池已关闭');
        }
        process.exit(0);
    });
});

// 导出连接池供其他模块使用
module.exports = promisePool;

