-- ============================================
-- Charity Events Management System Database
-- Database: charityevents_db
-- ============================================

-- Create database
DROP DATABASE IF EXISTS charityevents_db;
CREATE DATABASE charityevents_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE charityevents_db;

-- ============================================
-- Table 1: Charity Organizations
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
-- Table 2: Event Categories
-- ============================================
CREATE TABLE event_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- Table 3: Charity Events
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
-- Insert Charity Organization Data
-- ============================================
INSERT INTO charity_organizations (organization_name, description, contact_email, contact_phone, website) VALUES
('Love Foundation', 'A nonprofit organization dedicated to helping underprivileged children access educational opportunities', 'info@lovefoundation.org', '1300-123-456', 'www.lovefoundation.org'),
('Green Earth Association', 'A charitable organization focused on environmental protection and sustainable development', 'contact@greenearth.org', '1300-234-567', 'www.greenearth.org'),
('Health Future', 'A health charity providing funding for medical research and patient support', 'support@healthfuture.org', '1300-345-678', 'www.healthfuture.org'),
('Community Care Center', 'A comprehensive charity serving local communities and helping vulnerable groups', 'hello@communitycare.org', '1300-456-789', 'www.communitycare.org');

-- ============================================
-- Insert Event Category Data
-- ============================================
INSERT INTO event_categories (category_name, description) VALUES
('Charity Gala', 'Formal fundraising dinner events, typically including fine dining, speeches, and auctions'),
('Fun Run', 'Healthy and fun running events where participants support charity through registration fees'),
('Silent Auction', 'Auction events raising funds through bidding on items'),
('Charity Concert', 'Music performance events where ticket proceeds go to charitable causes'),
('Charity Sale', 'Selling goods or services with proceeds going to charity'),
('Public Lecture', 'Educational lecture events raising public awareness and funds'),
('Sports Event', 'Sports competition events where participation fees support charity');

-- ============================================
-- Insert Charity Events Data (At least 8 examples)
-- ============================================
INSERT INTO charity_events (
    event_name, description, detailed_description, event_date, event_time, 
    location, city, address, category_id, organization_id, 
    ticket_price, is_free, fundraising_goal, current_funds, 
    max_participants, current_participants, image_url, status
) VALUES
(
    'Light of Hope Charity Gala 2025',
    'A warm charity dinner to raise funds for children\'s education',
    'Join our annual charity gala and contribute to changing children\'s futures while enjoying an exquisite dinner. The event includes a three-course meal, live music, and an exciting silent auction. All proceeds will provide school supplies and scholarships for children in impoverished areas.',
    '2025-11-15', '18:00:00',
    'Central Hotel', 'Sydney', '123 George Street, Sydney NSW 2000',
    1, 1,
    150.00, FALSE, 50000.00, 32000.00,
    200, 156, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622',
    'upcoming'
),
(
    'Green Environment Fun Run',
    '5km fun run supporting environmental protection projects',
    'Lace up your running shoes and join our Green Fun Run! This is a family-friendly 5km fun run event. Participants will receive a race t-shirt, finisher medal, and healthy snack pack. All registration fees will support local forest restoration and ocean cleanup projects. Let\'s run together for Earth\'s health!',
    '2025-10-20', '07:00:00',
    'Hyde Park', 'Sydney', 'Elizabeth St, Sydney NSW 2000',
    2, 2,
    35.00, FALSE, 15000.00, 8500.00,
    500, 243, 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
    'upcoming'
),
(
    'Art Charity Auction Night',
    'Silent auction event bidding on local artists\' works',
    'Appreciate and bid on stunning works from talented local artists. This silent auction features over 50 paintings, sculptures, and photographs. All auction proceeds will directly support cancer research projects. The event includes aperitifs and live music. A perfect evening supporting both art and medical research!',
    '2025-12-05', '19:00:00',
    'Contemporary Art Museum', 'Sydney', '140 George St, The Rocks NSW 2000',
    3, 3,
    80.00, FALSE, 100000.00, 45000.00,
    150, 89, 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b',
    'upcoming'
),
(
    'Christmas Charity Concert',
    'Holiday concert raising funds for children\'s hospital',
    'Enjoy classic holiday music performed by our local symphony orchestra in this warm Christmas season. This special concert will raise funds for the children\'s hospital to help purchase advanced medical equipment. The concert includes Christmas carols, instrumental performances, and special guest appearances. Perfect for the whole family!',
    '2025-12-20', '19:30:00',
    'Opera House Concert Hall', 'Sydney', 'Bennelong Point, Sydney NSW 2000',
    4, 3,
    120.00, FALSE, 80000.00, 52000.00,
    800, 645, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4',
    'upcoming'
),
(
    'Community Craft Fair',
    'Selling handmade items with proceeds supporting community projects',
    'Browse and purchase beautiful handcrafted items, baked goods, and second-hand treasures. All items are donated and made by community volunteers. Fair proceeds will support local homeless shelters and food banks. There\'s also a children\'s play area and free coffee and tea on site. Welcome to the whole family!',
    '2025-10-28', '09:00:00',
    'Community Center', 'Melbourne', '45 Community Drive, Melbourne VIC 3000',
    5, 4,
    0.00, TRUE, 5000.00, 2800.00,
    NULL, 0, 'https://images.unsplash.com/photo-1607083206968-13611e3d76db',
    'upcoming'
),
(
    'Mental Health Awareness Lecture',
    'Expert lecture raising mental health awareness',
    'Hear mental health experts share valuable insights on stress management, anxiety coping, and mental health maintenance. The lecture includes a Q&A session and free consultation resource pack. This event aims to break the taboo around mental health topics while raising funds for mental health services. All interested individuals are welcome.',
    '2025-11-08', '14:00:00',
    'City Library', 'Brisbane', '100 Library St, Brisbane QLD 4000',
    6, 3,
    20.00, FALSE, 3000.00, 1500.00,
    100, 67, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678',
    'upcoming'
),
(
    'Youth Football Charity Match',
    'Football match supporting youth sports development programs',
    'Watch friendly matches between local youth football teams and support youth sports education programs. Matches include U12 and U16 divisions with food stalls and family entertainment activities. Ticket sales and on-site donations will provide sports equipment and coaching training for under-resourced schools.',
    '2025-11-22', '10:00:00',
    'City Stadium', 'Perth', '789 Sports Ave, Perth WA 6000',
    7, 4,
    15.00, FALSE, 10000.00, 4200.00,
    300, 178, 'https://images.unsplash.com/photo-1574629810360-7efbbe195018',
    'upcoming'
),
(
    'Summer Beach Cleanup Day',
    'Volunteer beach cleanup activity protecting marine ecology',
    'Join our beach cleanup volunteer activity and contribute to marine environment! The activity provides all cleaning tools, gloves, and trash bags. Participants will receive free lunch and eco-themed t-shirts. This free event welcomes participants of all ages. While participation is free, we welcome voluntary donations to support ongoing ocean protection projects.',
    '2025-12-10', '08:00:00',
    'Bondi Beach', 'Sydney', 'Bondi Beach, Sydney NSW 2026',
    5, 2,
    0.00, TRUE, 2000.00, 850.00,
    200, 134, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    'upcoming'
),
(
    'New Year Charity Marathon',
    'Full and half marathon, healthy start to the new year',
    'Start the new year in a healthy way! Join our charity marathon and choose between full 42km or half 21km routes. All runners will receive race bibs, timing chips, finisher medals, and commemorative t-shirts. The scenic route includes multiple aid stations. Registration fees will support childhood obesity prevention and health education programs.',
    '2026-01-01', '06:00:00',
    'Waterfront Starting Point', 'Sydney', 'Circular Quay, Sydney NSW 2000',
    7, 1,
    65.00, FALSE, 30000.00, 18500.00,
    1000, 567, 'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3',
    'upcoming'
),
(
    'Winter Charity Book Fair',
    'Book sale and author meet-and-greet',
    'A paradise for book lovers! Join our charity book fair and purchase thousands of quality used books at affordable prices. The event will also feature local author meet-and-greets and children\'s story time. All proceeds will support community literacy programs and establish libraries for schools in remote areas. Free admission, on-site book purchases.',
    '2025-11-30', '10:00:00',
    'Convention Center', 'Melbourne', '1 Convention Centre Place, Melbourne VIC 3006',
    5, 4,
    0.00, TRUE, 8000.00, 3400.00,
    NULL, 0, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5470',
    'upcoming'
);

-- ============================================
-- Create Indexes for Query Performance
-- ============================================
CREATE INDEX idx_event_date ON charity_events(event_date);
CREATE INDEX idx_event_city ON charity_events(city);
CREATE INDEX idx_event_category ON charity_events(category_id);
CREATE INDEX idx_event_status ON charity_events(status);
CREATE INDEX idx_event_suspended ON charity_events(is_suspended);

-- ============================================
-- Verify Data
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

