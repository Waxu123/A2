-- ============================================
-- 慈善活动管理系统数据库
-- Database: charityevents_db
-- ============================================

-- 创建数据库
DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- ============================================
-- 表1: 慈善组织表
-- ============================================
CREATE TABLE charity_organizations (
    organization_id INT PRIMARY KEY AUTO_INCREMENT,
    organization_name VARCHAR(200) NOT NULL,
    description TEXT,
    contact_email VARCHAR(100),
    contact_phone VARCHAR(20),
    website VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 表2: 活动类别表
-- ============================================
CREATE TABLE event_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 表3: 慈善活动表
-- ============================================
CREATE TABLE charity_events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    location VARCHAR(200) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address TEXT,
    category_id INT NOT NULL,
    organization_id INT NOT NULL,
    ticket_price DECIMAL(10, 2) DEFAULT 0.00,
    is_free BOOLEAN DEFAULT FALSE,
    fundraising_goal DECIMAL(12, 2) DEFAULT 0.00,
    current_funds DECIMAL(12, 2) DEFAULT 0.00,
    max_participants INT,
    current_participants INT DEFAULT 0,
    image_url VARCHAR(300),
    is_suspended BOOLEAN DEFAULT FALSE,
    status ENUM('upcoming', 'ongoing', 'completed') DEFAULT 'upcoming',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES event_categories(category_id),
    FOREIGN KEY (organization_id) REFERENCES charity_organizations(organization_id)
);

-- ============================================
-- 插入慈善组织数据
-- ============================================
INSERT INTO charity_organizations (organization_name, description, contact_email, contact_phone, website) VALUES
('爱心基金会', '致力于帮助贫困儿童获得教育机会的非营利组织', 'info@lovefoundation.org', '1300-123-456', 'www.lovefoundation.org'),
('绿色地球协会', '专注于环境保护和可持续发展的慈善组织', 'contact@greenearth.org', '1300-234-567', 'www.greenearth.org'),
('健康未来', '为医疗研究和患者支持提供资金的健康慈善机构', 'support@healthfuture.org', '1300-345-678', 'www.healthfuture.org'),
('社区关怀中心', '服务于当地社区，帮助弱势群体的综合性慈善组织', 'hello@communitycare.org', '1300-456-789', 'www.communitycare.org');

-- ============================================
-- 插入活动类别数据
-- ============================================
INSERT INTO event_categories (category_name, description) VALUES
('慈善晚宴', '正式的筹款晚宴活动，通常包含美食、演讲和拍卖'),
('趣味跑', '健康有趣的跑步活动，参与者通过报名费支持慈善事业'),
('无声拍卖', '通过竞拍物品筹集善款的拍卖活动'),
('慈善音乐会', '音乐表演活动，门票收入用于慈善目的'),
('义卖活动', '出售商品或服务，所得收入用于慈善'),
('公益讲座', '教育性讲座活动，提升公众意识并筹集资金'),
('体育赛事', '体育竞赛活动，参与费用用于慈善事业');

-- ============================================
-- 插入慈善活动数据（至少8个示例）
-- ============================================
INSERT INTO charity_events (
    event_name, description, detailed_description, event_date, event_time, 
    location, city, address, category_id, organization_id, 
    ticket_price, is_free, fundraising_goal, current_funds, 
    max_participants, current_participants, image_url, status
) VALUES
(
    '希望之光慈善晚宴2025',
    '一场温馨的慈善晚宴，为贫困儿童教育筹款',
    '加入我们的年度慈善晚宴，享受精美晚餐的同时，为改变孩子们的未来贡献力量。活动包括三道式晚餐、现场音乐表演和激动人心的无声拍卖。所有收益将用于为贫困地区儿童提供学习用品和奖学金。',
    '2025-11-15', '18:00:00',
    '市中心大酒店', '悉尼', '123 George Street, Sydney NSW 2000',
    1, 1,
    150.00, FALSE, 50000.00, 32000.00,
    200, 156, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    'upcoming'
),
(
    '绿色环保趣味跑',
    '5公里趣味跑活动，支持环境保护项目',
    '穿上您的运动鞋，加入我们的绿色趣味跑！这是一场适合全家参与的5公里趣味跑步活动。参与者将获得参赛T恤、完赛奖牌和健康补给包。所有报名费将用于本地森林恢复和海洋清洁项目。让我们一起为地球健康奔跑！',
    '2025-10-20', '07:00:00',
    '海德公园', '悉尼', 'Elizabeth St, Sydney NSW 2000',
    2, 2,
    35.00, FALSE, 15000.00, 8500.00,
    500, 243, 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
    'upcoming'
),
(
    '艺术品慈善拍卖之夜',
    '无声拍卖活动，竞拍本地艺术家作品',
    '欣赏并竞拍来自本地才华横溢艺术家的精美作品。本次无声拍卖展出50多件绘画、雕塑和摄影作品。所有拍卖收益将直接支持癌症研究项目。活动包含开胃酒水和现场音乐。这是一个支持艺术和医疗研究的完美夜晚！',
    '2025-12-05', '19:00:00',
    '当代艺术馆', '悉尼', '140 George St, The Rocks NSW 2000',
    3, 3,
    80.00, FALSE, 100000.00, 45000.00,
    150, 89, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
    'upcoming'
),
(
    '圣诞慈善音乐会',
    '节日音乐会，为儿童医院筹款',
    '在温馨的圣诞季节，享受本地交响乐团带来的经典节日乐曲。这场特别的音乐会将为儿童医院筹集资金，帮助购买先进医疗设备。音乐会包含圣诞颂歌合唱、器乐演奏和特别嘉宾表演。适合全家欣赏！',
    '2025-12-20', '19:30:00',
    '歌剧院音乐厅', '悉尼', 'Bennelong Point, Sydney NSW 2000',
    4, 3,
    120.00, FALSE, 80000.00, 52000.00,
    800, 645, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
    'upcoming'
),
(
    '社区手工艺品义卖',
    '售卖手工制品，收益用于社区服务项目',
    '浏览并购买精美的手工艺品、烘焙食品和二手宝贝。所有物品由社区志愿者捐赠和制作。义卖收益将用于支持本地无家可归者庇护所和食品银行。活动现场还有儿童游戏区和免费咖啡茶点。欢迎全家参与！',
    '2025-10-28', '09:00:00',
    '社区活动中心', '墨尔本', '45 Community Drive, Melbourne VIC 3000',
    5, 4,
    0.00, TRUE, 5000.00, 2800.00,
    NULL, 0, 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
    'upcoming'
),
(
    '心理健康公益讲座',
    '专家讲座，提升心理健康意识',
    '聆听心理健康专家分享关于压力管理、焦虑应对和心理健康维护的宝贵见解。讲座包括问答环节和免费咨询资源包。此活动旨在打破心理健康话题的禁忌，同时为心理健康服务筹集资金。欢迎所有对此话题感兴趣的人士参加。',
    '2025-11-08', '14:00:00',
    '市立图书馆', '布里斯班', '100 Library St, Brisbane QLD 4000',
    6, 3,
    20.00, FALSE, 3000.00, 1500.00,
    100, 67, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
    'upcoming'
),
(
    '青少年足球慈善赛',
    '足球比赛，支持青少年体育发展项目',
    '观看本地青少年足球队之间的友谊赛，支持青少年体育教育项目。比赛包括U12和U16两个组别，现场设有美食摊位和家庭娱乐活动。门票和现场募捐将用于为缺乏资源的学校提供体育器材和教练培训。',
    '2025-11-22', '10:00:00',
    '市体育场', '珀斯', '789 Sports Ave, Perth WA 6000',
    7, 4,
    15.00, FALSE, 10000.00, 4200.00,
    300, 178, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
    'upcoming'
),
(
    '夏日海滩清洁日',
    '志愿者海滩清洁活动，保护海洋生态',
    '加入我们的海滩清洁志愿活动，为海洋环境做出贡献！活动提供所有清洁工具、手套和垃圾袋。参与者将获得免费午餐和环保主题T恤。此免费活动欢迎所有年龄段参与者。虽然参与免费，但我们欢迎自愿捐款以支持持续的海洋保护项目。',
    '2025-12-10', '08:00:00',
    '邦迪海滩', '悉尼', 'Bondi Beach, Sydney NSW 2026',
    5, 2,
    0.00, TRUE, 2000.00, 850.00,
    200, 134, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    'upcoming'
),
(
    '新年慈善马拉松',
    '全程和半程马拉松，新年健康起跑',
    '以健康的方式开启新的一年！参加我们的慈善马拉松，选择全程42公里或半程21公里路线。所有参赛者将获得号码布、计时芯片、完赛奖牌和纪念T恤。比赛路线风景优美，设有多个补给站。报名费将用于支持儿童肥胖预防和健康教育项目。',
    '2026-01-01', '06:00:00',
    '滨海大道起点', '悉尼', 'Circular Quay, Sydney NSW 2000',
    7, 1,
    65.00, FALSE, 30000.00, 18500.00,
    1000, 567, 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
    'upcoming'
),
(
    '冬季慈善书展',
    '书籍义卖和作家见面会',
    '书虫们的福音！参加我们的慈善书展，购买数千本优质二手书籍，价格实惠。活动还将举办本地作家见面会和儿童故事时间。所有收益将用于支持社区扫盲项目和为偏远地区学校建立图书馆。免费入场，现场购书。',
    '2025-11-30', '10:00:00',
    '会展中心', '墨尔本', '1 Convention Centre Place, Melbourne VIC 3006',
    5, 4,
    0.00, TRUE, 8000.00, 3400.00,
    NULL, 0, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
    'upcoming'
);

-- ============================================
-- 创建索引以优化查询性能
-- ============================================
CREATE INDEX idx_event_date ON charity_events(event_date);
CREATE INDEX idx_event_city ON charity_events(city);
CREATE INDEX idx_event_category ON charity_events(category_id);
CREATE INDEX idx_event_status ON charity_events(status);
CREATE INDEX idx_event_suspended ON charity_events(is_suspended);

-- ============================================
-- 查看数据验证
-- ============================================
SELECT 
    ce.event_name,
    ce.event_date,
    ce.city,
    cat.category_name,
    org.organization_name,
    ce.ticket_price,
    ce.is_free
FROM charity_events ce
JOIN event_categories cat ON ce.category_id = cat.category_id
JOIN charity_organizations org ON ce.organization_id = org.organization_id
ORDER BY ce.event_date;


