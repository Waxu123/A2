# API 测试指南 - Postman

本指南帮助您使用Postman测试慈善活动管理系统的API端点。

---

## 准备工作

1. 下载并安装 [Postman](https://www.postman.com/downloads/)
2. 确保API服务器正在运行（`http://localhost:3000`）
3. 确保数据库已正确设置并包含示例数据

---

## 测试端点

### 1️⃣ 获取API信息

**请求:**
```
GET http://localhost:3000/
```

**预期响应:**
```json
{
    "message": "慈善活动管理系统 API",
    "version": "1.0.0",
    "endpoints": {
        "events": "/api/events - 获取所有当前/即将举行的活动",
        "eventById": "/api/events/:id - 获取特定活动详情",
        "categories": "/api/categories - 获取所有活动类别",
        "search": "/api/events/search - 搜索活动"
    }
}
```

**测试要点:**
- ✅ 状态码应为 200
- ✅ 返回API基本信息

---

### 2️⃣ 获取所有活动

**请求:**
```
GET http://localhost:3000/api/events
```

**预期响应:**
```json
{
    "success": true,
    "count": 10,
    "data": [
        {
            "event_id": 1,
            "event_name": "希望之光慈善晚宴2025",
            "description": "一场温馨的慈善晚宴...",
            "event_date": "2025-11-15",
            "event_time": "18:00:00",
            "location": "市中心大酒店",
            "city": "悉尼",
            "ticket_price": "150.00",
            "is_free": 0,
            "image_url": "...",
            "status": "upcoming",
            "category_name": "慈善晚宴",
            "organization_name": "爱心基金会"
        },
        ...
    ]
}
```

**测试要点:**
- ✅ 状态码应为 200
- ✅ `success` 字段为 `true`
- ✅ `count` 显示活动数量
- ✅ `data` 数组包含活动列表
- ✅ 每个活动包含所有必需字段
- ✅ 只返回未暂停的即将举行的活动

---

### 3️⃣ 获取特定活动详情

**请求:**
```
GET http://localhost:3000/api/events/1
```

**预期响应:**
```json
{
    "success": true,
    "data": {
        "event_id": 1,
        "event_name": "希望之光慈善晚宴2025",
        "description": "一场温馨的慈善晚宴...",
        "detailed_description": "加入我们的年度慈善晚宴...",
        "event_date": "2025-11-15",
        "event_time": "18:00:00",
        "location": "市中心大酒店",
        "city": "悉尼",
        "address": "123 George Street, Sydney NSW 2000",
        "category_id": 1,
        "organization_id": 1,
        "ticket_price": "150.00",
        "is_free": 0,
        "fundraising_goal": "50000.00",
        "current_funds": "32000.00",
        "max_participants": 200,
        "current_participants": 156,
        "image_url": "...",
        "is_suspended": 0,
        "status": "upcoming",
        "category_name": "慈善晚宴",
        "category_description": "...",
        "organization_name": "爱心基金会",
        "organization_description": "...",
        "contact_email": "info@lovefoundation.org",
        "contact_phone": "1300-123-456",
        "website": "www.lovefoundation.org"
    }
}
```

**测试要点:**
- ✅ 状态码应为 200
- ✅ 返回完整的活动详情
- ✅ 包含组织和类别信息

**测试不存在的活动:**
```
GET http://localhost:3000/api/events/999
```

**预期响应:**
```json
{
    "success": false,
    "message": "未找到该活动"
}
```

**测试要点:**
- ✅ 状态码应为 404
- ✅ 返回适当的错误消息

---

### 4️⃣ 获取活动类别

**请求:**
```
GET http://localhost:3000/api/categories
```

**预期响应:**
```json
{
    "success": true,
    "count": 7,
    "data": [
        {
            "category_id": 1,
            "category_name": "慈善晚宴",
            "description": "正式的筹款晚宴活动..."
        },
        {
            "category_id": 2,
            "category_name": "趣味跑",
            "description": "健康有趣的跑步活动..."
        },
        ...
    ]
}
```

**测试要点:**
- ✅ 状态码应为 200
- ✅ 返回所有活动类别
- ✅ 每个类别包含ID、名称和描述

---

### 5️⃣ 获取城市列表

**请求:**
```
GET http://localhost:3000/api/cities
```

**预期响应:**
```json
{
    "success": true,
    "count": 4,
    "data": [
        "布里斯班",
        "墨尔本",
        "珀斯",
        "悉尼"
    ]
}
```

**测试要点:**
- ✅ 状态码应为 200
- ✅ 返回不重复的城市列表
- ✅ 城市按字母顺序排序

---

### 6️⃣ 搜索活动（无筛选条件）

**请求:**
```
GET http://localhost:3000/api/events/search
```

**预期响应:**
```json
{
    "success": true,
    "count": 10,
    "filters": {
        "date": null,
        "city": null,
        "category": null
    },
    "data": [...]
}
```

**测试要点:**
- ✅ 无筛选条件时返回所有活动
- ✅ filters字段显示为null

---

### 7️⃣ 搜索活动（按城市筛选）

**请求:**
```
GET http://localhost:3000/api/events/search?city=悉尼
```

**预期响应:**
```json
{
    "success": true,
    "count": 6,
    "filters": {
        "date": null,
        "city": "悉尼",
        "category": null
    },
    "data": [
        // 只包含悉尼的活动
    ]
}
```

**测试要点:**
- ✅ 只返回指定城市的活动
- ✅ filters字段正确显示筛选条件

---

### 8️⃣ 搜索活动（按类别筛选）

**请求:**
```
GET http://localhost:3000/api/events/search?category=2
```

**预期响应:**
```json
{
    "success": true,
    "count": 2,
    "filters": {
        "date": null,
        "city": null,
        "category": "2"
    },
    "data": [
        // 只包含类别ID为2的活动
    ]
}
```

**测试要点:**
- ✅ 只返回指定类别的活动
- ✅ category_id匹配筛选条件

---

### 9️⃣ 搜索活动（按日期筛选）

**请求:**
```
GET http://localhost:3000/api/events/search?date=2025-11-15
```

**预期响应:**
```json
{
    "success": true,
    "count": 1,
    "filters": {
        "date": "2025-11-15",
        "city": null,
        "category": null
    },
    "data": [
        {
            "event_id": 1,
            "event_name": "希望之光慈善晚宴2025",
            "event_date": "2025-11-15",
            ...
        }
    ]
}
```

**测试要点:**
- ✅ 只返回指定日期的活动
- ✅ event_date匹配筛选日期

---

### 🔟 搜索活动（多条件组合）

**请求:**
```
GET http://localhost:3000/api/events/search?city=悉尼&category=2
```

**预期响应:**
```json
{
    "success": true,
    "count": 1,
    "filters": {
        "date": null,
        "city": "悉尼",
        "category": "2"
    },
    "data": [
        // 悉尼 + 类别2 的活动
    ]
}
```

**测试要点:**
- ✅ 所有筛选条件同时生效
- ✅ 结果符合所有筛选条件

---

## 创建Postman集合

### 快速导入

您可以创建一个Postman集合来保存所有测试：

1. 打开Postman
2. 点击 "New" → "Collection"
3. 命名为 "慈善活动管理系统 API"
4. 为每个端点创建请求
5. 保存集合以便重复使用

### 环境变量设置

在Postman中设置环境变量：

1. 点击右上角的齿轮图标
2. 选择 "Manage Environments"
3. 添加新环境：
   - 变量名: `base_url`
   - 初始值: `http://localhost:3000`
   - 当前值: `http://localhost:3000`

4. 在请求中使用: `{{base_url}}/api/events`

---

## 测试检查清单

使用此清单验证所有端点：

- [ ] API根路径返回正确信息
- [ ] 获取所有活动成功
- [ ] 获取单个活动详情成功
- [ ] 不存在的活动返回404
- [ ] 获取类别列表成功
- [ ] 获取城市列表成功
- [ ] 无筛选搜索返回所有活动
- [ ] 按城市筛选正常工作
- [ ] 按类别筛选正常工作
- [ ] 按日期筛选正常工作
- [ ] 多条件组合筛选正常工作
- [ ] 所有响应格式一致
- [ ] 错误处理适当

---

## 常见测试问题

### 问题1: 连接被拒绝

**错误:** `Could not get any response`

**解决:**
- 确保API服务器正在运行
- 检查URL是否正确
- 确认端口3000未被占用

### 问题2: 返回空数组

**错误:** `data: []`

**解决:**
- 检查数据库是否有数据
- 确认SQL文件已正确导入
- 检查活动日期是否都在过去

### 问题3: CORS错误

**错误:** CORS相关错误

**解决:**
- 从Postman发送请求不会有CORS问题
- 如果从浏览器测试，确保API启用了CORS

---

## 进阶测试

### 性能测试
- 测试API响应时间
- 使用Postman Runner批量测试
- 检查大量数据时的性能

### 边界测试
- 测试无效的ID（负数、超大数字）
- 测试特殊字符
- 测试SQL注入防护

---

**测试愉快！** 🧪✅

