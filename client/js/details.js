/**
 * 活动详情页脚本
 * 负责加载和显示单个活动的详细信息
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    await loadEventDetails();
    setupModalHandlers();
});

/**
 * 从URL获取活动ID
 */
function getEventIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

/**
 * 加载活动详情
 */
async function loadEventDetails() {
    const eventId = getEventIdFromURL();
    
    if (!eventId) {
        showError('details-error', 'Event ID not specified');
        hideLoading('details-loading');
        return;
    }

    const loadingElement = document.getElementById('details-loading');
    const errorElement = document.getElementById('details-error');
    const detailsContainer = document.getElementById('event-details');

    try {
        // 显示加载状态
        showLoading('details-loading');
        hideError('details-error');
        detailsContainer.style.display = 'none';

        // 调用API获取活动详情
        const response = await CharityEventsAPI.getEventById(eventId);

        // 隐藏加载状态
        hideLoading('details-loading');

        // Check response
        if (!response.success || !response.data) {
            showError('details-error', 'Event information not found');
            return;
        }

        // Display event details
        displayEventDetails(response.data);
        detailsContainer.style.display = 'block';

    } catch (error) {
        hideLoading('details-loading');
        showError('details-error', 'Error loading event details. Please try again later.');
        console.error('Error loading event details:', error);
    }
}

/**
 * 显示活动详情
 */
function displayEventDetails(event) {
    // Set page title
    document.title = `${event.event_name} - Charity Events Platform`;

    // Event image
    const eventImage = document.getElementById('event-image');
    eventImage.src = event.image_url || 'https://via.placeholder.com/800x400?text=Charity+Event';
    eventImage.alt = event.event_name;
    eventImage.onerror = function() {
        this.src = 'https://via.placeholder.com/800x400?text=Charity+Event';
    };

    // 活动标题和元数据
    document.getElementById('event-title').textContent = event.event_name;
    document.getElementById('event-date').textContent = formatDate(event.event_date);
    document.getElementById('event-location').textContent = `${event.city}, ${event.location}`;
    document.getElementById('event-category').textContent = event.category_name;

    // 活动描述
    document.getElementById('event-description').textContent = event.description;
    document.getElementById('event-detailed-description').textContent = 
        event.detailed_description || event.description;

    // 活动信息
    document.getElementById('event-time').textContent = formatTime(event.event_time);
    document.getElementById('event-address').textContent = event.address || event.location;
    
    // Ticket price information
    const priceElement = document.getElementById('event-price');
    if (event.is_free) {
        priceElement.innerHTML = '<span class="price-free">Free Event</span>';
    } else {
        priceElement.textContent = formatCurrency(event.ticket_price);
    }

    // Participants
    const participantsText = event.max_participants 
        ? `${event.current_participants} / ${event.max_participants}` 
        : `${event.current_participants} participants`;
    document.getElementById('event-participants').textContent = participantsText;

    // 组织信息
    document.getElementById('org-name').textContent = event.organization_name;
    document.getElementById('org-description').textContent = event.organization_description;
    document.getElementById('org-email').textContent = event.contact_email;
    document.getElementById('org-phone').textContent = event.contact_phone;
    
    const websiteLink = document.getElementById('org-website');
    websiteLink.href = event.website.startsWith('http') ? event.website : `http://${event.website}`;
    websiteLink.textContent = event.website;

    // 筹款进度
    displayFundraisingProgress(event);

    // 活动状态
    displayEventStatus(event.status);
}

/**
 * 显示筹款进度
 */
function displayFundraisingProgress(event) {
    const goal = parseFloat(event.fundraising_goal);
    const current = parseFloat(event.current_funds);
    
    document.getElementById('fundraising-goal').textContent = formatCurrency(goal);
    document.getElementById('current-funds').textContent = formatCurrency(current);

    // 计算进度百分比
    const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    
    // 更新进度条
    const progressFill = document.getElementById('progress-fill');
    progressFill.style.width = `${percentage}%`;

    // Update percentage text
    const progressText = document.getElementById('progress-percentage');
    progressText.textContent = `${percentage.toFixed(1)}% Complete`;

    // 根据进度设置颜色
    if (percentage >= 75) {
        progressFill.style.backgroundColor = '#28a745';
    } else if (percentage >= 50) {
        progressFill.style.backgroundColor = '#ffc107';
    } else {
        progressFill.style.backgroundColor = '#007bff';
    }
}

/**
 * 显示活动状态
 */
function displayEventStatus(status) {
    const statusBadge = document.getElementById('event-status-badge');
    const statusText = getStatusText(status);
    
    statusBadge.textContent = statusText;
    statusBadge.className = 'status-badge';

    // 根据状态添加样式类
    if (status === 'upcoming') {
        statusBadge.classList.add('status-upcoming');
    } else if (status === 'ongoing') {
        statusBadge.classList.add('status-ongoing');
    } else if (status === 'completed') {
        statusBadge.classList.add('status-completed');
    }
}

/**
 * 设置模态框处理器
 */
function setupModalHandlers() {
    const registerBtn = document.getElementById('register-btn');
    const modal = document.getElementById('register-modal');
    const closeBtn = document.getElementById('modal-close');
    const okBtn = document.getElementById('modal-ok');

    // 注册按钮点击 - 显示"功能建设中"模态框
    registerBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // 关闭按钮
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 确定按钮
    okBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // 点击模态框外部关闭
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}