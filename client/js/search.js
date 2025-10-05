/**
 * 搜索页面脚本
 * 负责筛选表单和搜索功能
 */

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', async () => {
    await initSearchPage();
});

/**
 * 初始化搜索页面
 */
async function initSearchPage() {
    await loadFilterOptions();
    setupEventListeners();
}

/**
 * 加载筛选选项（类别和城市）
 */
async function loadFilterOptions() {
    try {
        // 加载类别选项
        const categoriesResponse = await CharityEventsAPI.getCategories();
        if (categoriesResponse.success && categoriesResponse.data) {
            populateCategoryFilter(categoriesResponse.data);
        }

        // 加载城市选项
        const citiesResponse = await CharityEventsAPI.getCities();
        if (citiesResponse.success && citiesResponse.data) {
            populateCityFilter(citiesResponse.data);
        }

    } catch (error) {
        console.error('Error loading filter options:', error);
        showError('search-error', 'Failed to load filter options. Please refresh the page and try again.');
    }
}

/**
 * 填充类别下拉框
 */
function populateCategoryFilter(categories) {
    const categorySelect = document.getElementById('category-filter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.category_id;
        option.textContent = category.category_name;
        categorySelect.appendChild(option);
    });
}

/**
 * 填充城市下拉框
 */
function populateCityFilter(cities) {
    const citySelect = document.getElementById('city-filter');
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    });
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    const searchForm = document.getElementById('search-form');
    const clearButton = document.getElementById('clear-filters');

    // 搜索表单提交
    searchForm.addEventListener('submit', handleSearch);

    // 清除筛选按钮
    clearButton.addEventListener('click', clearFilters);
}

/**
 * 处理搜索
 */
async function handleSearch(event) {
    event.preventDefault(); // 阻止表单默认提交

    const formData = new FormData(event.target);
    const filters = {
        date: formData.get('date'),
        city: formData.get('city'),
        category: formData.get('category')
    };

    // 移除空值
    Object.keys(filters).forEach(key => {
        if (!filters[key]) {
            delete filters[key];
        }
    });

    await performSearch(filters);
}

/**
 * 执行搜索
 */
async function performSearch(filters) {
    const resultsContainer = document.getElementById('search-results');
    const loadingElement = document.getElementById('search-loading');
    const errorElement = document.getElementById('search-error');
    const noResultsElement = document.getElementById('no-results');
    const initialMessage = document.getElementById('initial-message');
    const resultsInfo = document.getElementById('results-info');
    const resultsCount = document.getElementById('results-count');

    try {
        // 显示加载状态
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        noResultsElement.style.display = 'none';
        initialMessage.style.display = 'none';
        resultsInfo.style.display = 'none';
        resultsContainer.innerHTML = '';

        // 调用搜索API
        const response = await CharityEventsAPI.searchEvents(filters);

        // 隐藏加载状态
        loadingElement.style.display = 'none';

        // 显示结果信息
        resultsInfo.style.display = 'block';

        // Check search results
        if (!response.success || !response.data || response.data.length === 0) {
            noResultsElement.style.display = 'block';
            resultsCount.textContent = 'Found 0 events';
            return;
        }

        // Display result count
        resultsCount.textContent = `Found ${response.count} event${response.count !== 1 ? 's' : ''}`;

        // Display applied filters
        if (response.filters) {
            const filterTexts = [];
            if (response.filters.date) {
                filterTexts.push(`Date: ${formatDate(response.filters.date)}`);
            }
            if (response.filters.city) {
                filterTexts.push(`City: ${response.filters.city}`);
            }
            if (response.filters.category) {
                filterTexts.push(`Category ID: ${response.filters.category}`);
            }
            
            if (filterTexts.length > 0) {
                resultsCount.innerHTML += `<br><small>Filters: ${filterTexts.join(', ')}</small>`;
            }
        }

        // 渲染搜索结果
        renderSearchResults(response.data, resultsContainer);

    } catch (error) {
        loadingElement.style.display = 'none';
        errorElement.style.display = 'block';
        errorElement.textContent = 'Error searching events. Please check your network connection or try again later.';
        console.error('Search error:', error);
    }
}

/**
 * 渲染搜索结果
 */
function renderSearchResults(events, container) {
    events.forEach(event => {
        const card = createSearchResultCard(event);
        container.appendChild(card);
    });
}

/**
 * 创建搜索结果卡片
 */
function createSearchResultCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';

    const imageUrl = event.image_url || 'https://via.placeholder.com/400x250?text=Charity+Event';
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
 * Clear filters - Demonstrates basic DOM manipulation
 */
function clearFilters() {
    // Clear form
    const searchForm = document.getElementById('search-form');
    searchForm.reset();

    // Clear result display
    const resultsContainer = document.getElementById('search-results');
    const noResultsElement = document.getElementById('no-results');
    const initialMessage = document.getElementById('initial-message');
    const resultsInfo = document.getElementById('results-info');
    const errorElement = document.getElementById('search-error');

    resultsContainer.innerHTML = '';
    noResultsElement.style.display = 'none';
    resultsInfo.style.display = 'none';
    errorElement.style.display = 'none';
    initialMessage.style.display = 'block';

    console.log('Filters cleared');
}

/**
 * 查看活动详情
 */
function viewEventDetails(eventId) {
    window.location.href = `details.html?id=${eventId}`;
}