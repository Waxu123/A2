/**
 * API 封装模块
 * 提供与后端API交互的函数
 */

// API基础URL配置
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * API工具类
 */
class CharityEventsAPI {
    /**
     * 发送HTTP请求的通用方法
     */
    static async request(endpoint, options = {}) {
        try {
            const url = `${API_BASE_URL}${endpoint}`;
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP错误! 状态: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API请求错误:', error);
            throw error;
        }
    }

    /**
     * 获取所有当前/即将举行的活动
     */
    static async getAllEvents() {
        return await this.request('/events');
    }

    /**
     * 根据ID获取活动详情
     */
    static async getEventById(eventId) {
        return await this.request(`/events/${eventId}`);
    }

    /**
     * 获取所有活动类别
     */
    static async getCategories() {
        return await this.request('/categories');
    }

    /**
     * 获取所有城市列表
     */
    static async getCities() {
        return await this.request('/cities');
    }

    /**
     * 搜索活动
     * @param {Object} filters - 筛选条件 {date, city, category}
     */
    static async searchEvents(filters = {}) {
        // 构建查询参数
        const params = new URLSearchParams();
        
        if (filters.date) {
            params.append('date', filters.date);
        }
        if (filters.city) {
            params.append('city', filters.city);
        }
        if (filters.category) {
            params.append('category', filters.category);
        }

        const queryString = params.toString();
        const endpoint = queryString ? `/events/search?${queryString}` : '/events/search';
        
        return await this.request(endpoint);
    }
}

/**
 * Utility function: Format date
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date.getTime() + 86400000).toLocaleDateString('en-US', options); // Add 1 day to fix timezone issue
}

/**
 * Utility function: Format time
 */
function formatTime(timeString) {
    if (!timeString) return 'Not specified';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

/**
 * Utility function: Format currency
 */
function formatCurrency(amount) {
    return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * Utility function: Get status display text
 */
function getStatusText(status) {
    const statusMap = {
        'upcoming': 'Upcoming',
        'ongoing': 'Ongoing',
        'completed': 'Completed'
    };
    return statusMap[status] || status;
}

/**
 * 工具函数：显示错误消息
 */
function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

/**
 * 工具函数：隐藏错误消息
 */
function hideError(elementId) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.style.display = 'none';
    }
}

/**
 * 工具函数：显示加载状态
 */
function showLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }
}

/**
 * 工具函数：隐藏加载状态
 */
function hideLoading(elementId) {
    const loadingElement = document.getElementById(elementId);
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
}

