# 慈善活动管理系统

## 项目概述

这是一个为慈善活动管理开发的动态网站项目，旨在连接慈善组织与潜在参与者，提供活动查看、搜索和详情展示功能。

**开发者：** [您的姓名]  
**学号：** [您的学号]  
**课程：** PROG2002 Web Development II  
**评估：** Assessment 2 (A2)

---

## 项目结构

```
├── api/                          # API服务器（后端）
│   ├── database/
│   │   └── charityevents_db.sql  # MySQL数据库创建脚本
│   ├── event_db.js               # 数据库连接配置
│   ├── server.js                 # Express服务器和API端点
│   └── package.json              # API项目依赖
│
├── client/                       # 客户端网站（前端）
│   ├── css/
│   │   └── styles.css            # 样式表
│   ├── js/
│   │   ├── api.js                # API封装模块
│   │   ├── home.js               # 首页脚本
│   │   ├── search.js             # 搜索页脚本
│   │   └── details.js            # 详情页脚本
│   ├── index.html                # 首页
│   ├── search.html               # 搜索页面
│   └── details.html              # 活动详情页
│
└── README.md                     # 项目文档（本文件）
```

---

## 技术栈

### 后端（API）
- **Node.js** - JavaScript运行环境
- **Express.js** - Web应用框架
- **MySQL** - 关系型数据库
- **mysql2** - MySQL数据库驱动
- **CORS** - 跨域资源共享

### 前端（客户端）
- **HTML5** - 页面结构
- **CSS3** - 样式设计
- **JavaScript (ES6+)** - 交互逻辑
- **DOM API** - 页面元素操作
- **Fetch API** - HTTP请求

---

## 功能特性

### 1. 首页 (index.html)
- ✅ 展示组织使命和愿景（静态内容）
- ✅ 动态加载即将举行的活动列表
- ✅ 活动卡片展示（图片、名称、日期、地点、价格）
- ✅ 链接到活动详情页
- ✅ 联系信息展示

### 2. 搜索页面 (search.html)
- ✅ 多条件筛选表单（日期、城市、类别）
- ✅ 动态加载筛选选项（城市和类别）
- ✅ 清除筛选按钮（DOM操作演示）
- ✅ 搜索结果展示
- ✅ 错误提示和无结果处理

### 3. 活动详情页 (details.html)
- ✅ 通过URL参数传递活动ID
- ✅ 完整活动信息展示
- ✅ 筹款目标和进度可视化
- ✅ 组织信息展示
- ✅ "注册"按钮（显示"功能建设中"模态框）

### 4. RESTful API
- ✅ `GET /api/events` - 获取所有活动
- ✅ `GET /api/events/:id` - 获取活动详情
- ✅ `GET /api/categories` - 获取活动类别
- ✅ `GET /api/cities` - 获取城市列表
- ✅ `GET /api/events/search` - 搜索活动

---

## 安装和运行指南

### 前提条件

确保您的系统已安装以下软件：
- [Node.js](https://nodejs.org/) (版本 14 或更高)
- [MySQL](https://www.mysql.com/) (版本 8.0 或更高)

### 步骤 1: 设置数据库

1. 启动MySQL服务
2. 打开MySQL命令行或MySQL Workbench
3. 执行数据库创建脚本：
```bash
mysql -u root -p < api/database/charityevents_db.sql
```
或在MySQL Workbench中打开并运行 `charityevents_db.sql` 文件

4. 验证数据库创建成功：
```sql
USE charityevents_db;
SHOW TABLES;
SELECT COUNT(*) FROM charity_events;
```

### 步骤 2: 配置数据库连接

打开 `api/event_db.js`，根据您的MySQL配置修改以下内容：

```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',              // 修改为您的MySQL用户名
    password: '',              // 修改为您的MySQL密码
    database: 'charityevents_db'
});
```

### 步骤 3: 安装API依赖并启动服务器

```bash
# 进入API目录
cd api

# 安装依赖
npm install

# 启动服务器
npm start
```

服务器将在 `http://localhost:3000` 启动

### 步骤 4: 运行客户端网站

有多种方式运行客户端：

**选项 A: 使用VS Code Live Server扩展**
1. 在VS Code中打开 `client` 文件夹
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

**选项 B: 使用Python简单HTTP服务器**
```bash
# 进入客户端目录
cd client

# Python 3
python -m http.server 8080

# 在浏览器中访问 http://localhost:8080
```

**选项 C: 使用Node.js http-server**
```bash
# 全局安装http-server
npm install -g http-server

# 进入客户端目录
cd client

# 启动服务器
http-server -p 8080

# 在浏览器中访问 http://localhost:8080
```

### 步骤 5: 访问网站

在浏览器中打开：
- 首页: `http://localhost:8080/index.html`
- 搜索页: `http://localhost:8080/search.html`

---

## API 端点文档

### 1. 获取所有活动
```
GET /api/events
```
**响应示例:**
```json
{
    "success": true,
    "count": 10,
    "data": [
        {
            "event_id": 1,
            "event_name": "希望之光慈善晚宴2025",
            "description": "...",
            "event_date": "2025-11-15",
            ...
        }
    ]
}
```

### 2. 获取活动详情
```
GET /api/events/:id
```
**参数:** `id` - 活动ID

### 3. 获取活动类别
```
GET /api/categories
```

### 4. 获取城市列表
```
GET /api/cities
```

### 5. 搜索活动
```
GET /api/events/search?date=YYYY-MM-DD&city=城市&category=类别ID
```
**查询参数:**
- `date` (可选) - 活动日期
- `city` (可选) - 城市名称
- `category` (可选) - 类别ID

---

## 数据库设计

### 表结构

#### 1. charity_organizations (慈善组织)
- `organization_id` (主键)
- `organization_name`
- `description`
- `contact_email`
- `contact_phone`
- `website`

#### 2. event_categories (活动类别)
- `category_id` (主键)
- `category_name`
- `description`

#### 3. charity_events (慈善活动)
- `event_id` (主键)
- `event_name`
- `description`
- `detailed_description`
- `event_date`
- `event_time`
- `location`
- `city`
- `address`
- `category_id` (外键)
- `organization_id` (外键)
- `ticket_price`
- `is_free`
- `fundraising_goal`
- `current_funds`
- `max_participants`
- `current_participants`
- `image_url`
- `is_suspended`
- `status`

### 关系
- 一个慈善组织可以举办多个活动 (1:N)
- 一个活动类别可以包含多个活动 (1:N)

---

## 测试指南

### 使用Postman测试API

1. 下载并安装 [Postman](https://www.postman.com/)
2. 创建新请求集合
3. 测试以下端点：

**测试 1: 获取所有活动**
- 方法: GET
- URL: `http://localhost:3000/api/events`

**测试 2: 获取特定活动**
- 方法: GET
- URL: `http://localhost:3000/api/events/1`

**测试 3: 搜索活动**
- 方法: GET
- URL: `http://localhost:3000/api/events/search?city=悉尼`

### 浏览器测试

1. **首页测试**
   - 验证活动列表是否正确加载
   - 检查活动卡片显示是否完整
   - 点击"查看详情"按钮

2. **搜索页测试**
   - 选择不同筛选条件
   - 点击"搜索活动"
   - 点击"清除筛选"
   - 验证结果显示

3. **详情页测试**
   - 从首页或搜索页点击活动
   - 验证详情信息完整性
   - 点击"立即注册"按钮查看模态框

---

## 开发日志

### 第1周 - 数据库设计
- ✅ 设计ER图
- ✅ 创建数据库表
- ✅ 插入测试数据

### 第2周 - API开发
- ✅ 配置Express服务器
- ✅ 实现数据库连接
- ✅ 开发RESTful端点

### 第3周 - 前端开发
- ✅ 创建HTML页面结构
- ✅ 实现CSS样式
- ✅ 开发JavaScript交互

### 第4周 - 测试与优化
- ✅ API测试
- ✅ 浏览器兼容性测试
- ✅ 代码优化和注释

---

## 已知问题和限制

1. **注册功能未实现** - 按照要求，注册按钮仅显示"功能建设中"提示
2. **图片链接** - 使用外部图片URL，可能因网络问题加载失败（已提供占位图备选）
3. **时区问题** - 日期显示可能因浏览器时区设置略有偏差

---

## 未来改进计划（A3）

根据评估简报，以下功能将在评估3中实现：
- 用户注册和登录系统
- 活动报名/购票功能
- 管理员后台
- 支付集成
- 使用AngularJS重构（可选）

---

## 参考资源

- [Express.js官方文档](https://expressjs.com/)
- [MySQL官方文档](https://dev.mysql.com/doc/)
- [MDN Web文档](https://developer.mozilla.org/)
- [Node.js官方文档](https://nodejs.org/docs/)

---

## 学术诚信声明

本项目为个人独立完成的学术作业。所有代码均为原创编写，参考的外部资源已在适当位置注明。本人已阅读并理解SCU学术诚信政策，确保提交作品符合所有学术要求。

---

## 联系方式

如有问题或需要帮助，请联系：
- **学生邮箱:** [您的邮箱]
- **GitHub仓库:** [您的GitHub链接]

---

**最后更新:** 2025年10月3日

