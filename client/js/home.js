/**
 * 首页脚本
 * 负责加载和显示活动列表
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    await loadEvents();
});

/**
 * 加载活动列表
 */
async function loadEvents() {
    const container = document.getElementById('events-container');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');
    const noEvents = document.getElementById('no-events');

    try {
        // 显示加载状态
        showLoading('loading');
        hideError('error-message');
        container.innerHTML = '';
        noEvents.style.display = 'none';

        // 调用API获取活动
        const response = await CharityEventsAPI.getAllEvents();

        // 隐藏加载状态
        hideLoading('loading');

        // 检查是否有活动数据
        if (!response.success || !response.data || response.data.length === 0) {
            noEvents.style.display = 'block';
            return;
        }

        // 渲染活动卡片
        renderEventCards(response.data, container);

    } catch (error) {
        hideLoading('loading');
        showError('error-message', 'Error loading events. Please try again later. If the problem persists, please contact the administrator.');
        console.error('Error loading events:', error);
    }
}

/**
 * 渲染活动卡片
 */
function renderEventCards(events, container) {
    events.forEach(event => {
        const card = createEventCard(event);
        container.appendChild(card);
    });
}

/**
 * 创建单个活动卡片
 */
function createEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    // Handle image URL (use placeholder if no image)
    const imageUrl = event.image_url || 'https://via.placeholder.com/400x250?text=Charity+Event';

    // Handle price display
    const priceDisplay = event.is_free 
        ? '<span class="price-free">Free</span>' 
        : `<span class="price">${formatCurrency(event.ticket_price)}</span>`;

    card.innerHTML = `
        <div class="event-image">
            <img src="${imageUrl}" alt="${event.event_name}" onerror="this.src='https://via.placeholder.com/400x250?text=Charity+Event'">
            <div class="event-category-badge">${event.category_name}</div>
        </div>
        <div class="event-card-content">
            <h3 class="event-title">${event.event_name}</h3>
            <div class="event-info">
                <div class="info-row">
                    <span class="icon">📅</span>
                    <span>${formatDate(event.event_date)}</span>
                </div>
                <div class="info-row">
                    <span class="icon">📍</span>
                    <span>${event.city}, ${event.location}</span>
                </div>
                <div class="info-row">
                    <span class="icon">🏢</span>
                    <span>${event.organization_name}</span>
                </div>
            </div>
            <p class="event-description">${event.description}</p>
            <div class="event-footer">
                <div class="event-price">
                    ${priceDisplay}
                </div>
                <button class="btn btn-small btn-primary" onclick="viewEventDetails(${event.event_id})">
                    View Details →
                </button>
            </div>
        </div>
    `;

    return card;
}

/**
 * 查看活动详情
 * 通过URL参数传递活动ID
 */
function viewEventDetails(eventId) {
    window.location.href = `details.html?id=${eventId}`;
}