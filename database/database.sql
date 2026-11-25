-- ============================================================
-- ReUseHub – Second-Hand Product Marketplace Database Schema
-- Database: MySQL 8.0+
-- ============================================================

CREATE DATABASE IF NOT EXISTS reusehub_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reusehub_db;

-- 1. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'ROLE_BUYER'),
(2, 'ROLE_SELLER'),
(3, 'ROLE_ADMIN');

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    role_id BIGINT NOT NULL DEFAULT 1,
    state VARCHAR(100) DEFAULT 'Tamil Nadu',
    city VARCHAR(100) DEFAULT 'Chennai',
    area VARCHAR(100) DEFAULT 'Tambaram',
    address TEXT,
    avatar_url VARCHAR(255) DEFAULT '/images/avatar-default.png',
    status ENUM('ACTIVE', 'BLOCKED') DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    tamil_name VARCHAR(150) DEFAULT NULL,
    icon VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO categories (id, name, tamil_name, icon, description) VALUES
(1, 'Electronics', 'மின்னணுவியல்', 'bi-laptop', 'Laptops, smartphones, audio, cameras and gadgets'),
(2, 'Books & Education', 'புத்தகங்கள் & கல்வி', 'bi-book', 'Textbooks, novels, study material and exam guides'),
(3, 'Clothing', 'ஆடைகள்', 'bi-bag-heart', 'Men, women, kids apparel and ethnic wear'),
(4, 'Furniture', 'தளபாடங்கள்', 'bi-lamp', 'Chairs, study tables, beds, sofas and storage'),
(5, 'Home Appliances', 'வீட்டுபயோக பொருட்கள்', 'bi-tv', 'Kitchen mixers, microwaves, fans and household items'),
(6, 'Sports Equipment', 'விளையாட்டு உபகரணங்கள்', 'bi-bicycle', 'Bicycles, gym gear, rackets and fitness items'),
(7, 'Accessories', 'துணைப் பொருட்கள்', 'bi-watch', 'Backpacks, watches, sunglasses and daily essentials'),
(8, 'Others', 'பிற பொருட்கள்', 'bi-grid', 'Musical instruments, craft supplies and miscellaneous');

-- 4. Products Table (Includes Location Feature: State, City, Area, Pickup Location)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    is_donation BOOLEAN DEFAULT FALSE,
    condition_type ENUM('LIKE_NEW', 'GOOD', 'USED', 'FAIR') NOT NULL DEFAULT 'GOOD',
    status ENUM('AVAILABLE', 'RESERVED', 'SOLD', 'DONATED') NOT NULL DEFAULT 'AVAILABLE',
    state VARCHAR(100) NOT NULL DEFAULT 'Tamil Nadu',
    city VARCHAR(100) NOT NULL DEFAULT 'Chennai',
    area VARCHAR(100) NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    primary_image_url VARCHAR(255) NOT NULL,
    featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Product Images Table
CREATE TABLE IF NOT EXISTS product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_wishlist (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Cart Table
CREATE TABLE IF NOT EXISTS cart (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_cart (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Purchase Requests Table (Order / Handover Negotiation)
CREATE TABLE IF NOT EXISTS purchase_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    tracking_number VARCHAR(50) UNIQUE,
    tracking_status ENUM('ORDER_PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED') DEFAULT 'ORDER_PLACED',
    carrier VARCHAR(100) DEFAULT 'ReUseHub Green Express',
    driver_name VARCHAR(100) DEFAULT 'Murugan S (Delivery Partner)',
    driver_phone VARCHAR(30) DEFAULT '+91 94451 88291',
    shipped_at TIMESTAMP NULL,
    estimated_delivery TIMESTAMP NULL,
    delivered_at TIMESTAMP NULL,
    delivery_address TEXT,
    handover_otp VARCHAR(10) DEFAULT '4829',
    pickup_date DATE,
    pickup_time VARCHAR(50),
    buyer_message TEXT,
    seller_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Messages Table (Buyer-Seller Direct Communication)
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    sender_id BIGINT NOT NULL,
    receiver_id BIGINT NOT NULL,
    product_id BIGINT,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    product_id BIGINT,
    reason VARCHAR(100) NOT NULL,
    details TEXT,
    status ENUM('PENDING', 'RESOLVED', 'DISMISSED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Seed Sample Users
-- Passwords are encrypted / plain fallback: 'password123'
-- ============================================================
INSERT IGNORE INTO users (id, username, email, password, full_name, phone, role_id, state, city, area, address, status) VALUES
(1, 'admin', 'admin@reusehub.com', '$2a$10$wT3wW8R5aU3jRkl0Xf6BaeoR7m2Xm8aZ9sF0aR8N0Ew2D5L7N3Zmi', 'Admin ReUseHub', '+91 9876543210', 3, 'Tamil Nadu', 'Chennai', 'Guindy', 'ReUseHub HQ, Anna Salai', 'ACTIVE'),
(2, 'karthik_seller', 'seller@reusehub.com', '$2a$10$wT3wW8R5aU3jRkl0Xf6BaeoR7m2Xm8aZ9sF0aR8N0Ew2D5L7N3Zmi', 'Karthik Sundaram', '+91 9840123456', 2, 'Tamil Nadu', 'Chennai', 'Tambaram', '14, Gandhi Road, West Tambaram', 'ACTIVE'),
(3, 'priya_buyer', 'buyer@reusehub.com', '$2a$10$wT3wW8R5aU3jRkl0Xf6BaeoR7m2Xm8aZ9sF0aR8N0Ew2D5L7N3Zmi', 'Priya Raman', '+91 9444123456', 1, 'Tamil Nadu', 'Chennai', 'Adyar', '28, Lattice Bridge Road, Adyar', 'ACTIVE'),
(4, 'ananya_seller', 'ananya@reusehub.com', '$2a$10$wT3wW8R5aU3jRkl0Xf6BaeoR7m2Xm8aZ9sF0aR8N0Ew2D5L7N3Zmi', 'Ananya Natarajan', '+91 9894123456', 2, 'Tamil Nadu', 'Coimbatore', 'Gandhipuram', '45, Cross Cut Road, Gandhipuram', 'ACTIVE');

-- ============================================================
-- Seed Sample Products Matching Requirements
-- ============================================================
INSERT IGNORE INTO products (id, seller_id, category_id, title, description, price, is_donation, condition_type, status, state, city, area, pickup_location, primary_image_url, featured) VALUES
(1, 2, 1, 'Dell Laptop Inspiron 15', 'Dell Inspiron 15 Core i5 11th Gen, 16GB RAM, 512GB NVMe SSD, 15.6 inch FHD Display. 1.5 years old, pristine condition, battery backup 4+ hours. Original Dell 65W charger and laptop sleeve included.', 25000.00, FALSE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Tambaram', 'Near Tambaram Railway Station, West Gate, Chennai', '/images/dell-laptop.jpg', TRUE),
(2, 2, 6, 'Nike Sports Shoes', 'Authentic Nike Revolution 6 Next Nature road running shoes, Men size UK 9 / US 10. Breathable mesh upper, cushioned foam midsole. Used for only two weeks on running track, excellent grip and cleanliness.', 1800.00, FALSE, 'GOOD', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'T. Nagar', 'Pondy Bazaar Near Naidu Hall, T. Nagar, Chennai', '/images/nike-shoes.jpg', TRUE),
(3, 2, 7, 'Skybags Backpack', 'Skybags durable casual 32-litre 3-compartment college & travel backpack. Features padded laptop sleeve, water bottle holder, rain cover and ergonomic shoulder straps. Lightly used, clean and no tears.', 800.00, FALSE, 'USED', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Velachery', 'Near Phoenix MarketCity Mall, Velachery Main Road, Chennai', '/images/skybags-backpack.jpg', TRUE),
(4, 4, 1, 'iPhone 13 128GB Midnight', 'Apple iPhone 13 128GB Midnight Blue. 90% battery health, TrueTone and FaceID fully working. Tempered glass installed since day one. Comes with original Apple Lightning cable and Spigen tough armor case.', 35000.00, FALSE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Anna Nagar', '2nd Avenue Near Roundana Metro, Anna Nagar, Chennai', '/images/iphone-13.jpg', TRUE),
(5, 2, 4, 'Office Chair Ergonomic Mesh', 'High-back ergonomic mesh revolving chair with adjustable lumbar support, 3D armrests, pneumatic seat height adjustment and smooth caster wheels. Extremely comfortable for long work-from-home hours.', 1500.00, FALSE, 'GOOD', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Adyar', 'Near Adyar Depot, LB Road, Adyar, Chennai', '/images/office-chair.jpg', TRUE),
(6, 2, 2, 'Engineering & Competitive Exam Books Set', 'Complete set of Anna University Engineering Mathematics, Data Structures, Algorithms, plus GATE CS prep guides. Free for college students who need them. All pages intact and well maintained.', 0.00, TRUE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Tambaram', 'Tambaram Sanatorium Near Bus Stop, Chennai', '/images/books-donation.jpg', TRUE),
(7, 4, 5, 'Philips 750W Mixer Grinder', 'Philips Viva Collection 750W 3-jar mixer grinder. Heavy duty motor, stainless steel jars with leak-proof lids. Ideal for chutney, wet grinding, and dry spices. Sparingly used in guest house.', 1200.00, FALSE, 'GOOD', 'AVAILABLE', 'Tamil Nadu', 'Coimbatore', 'Gandhipuram', 'Cross Cut Road Near Power House, Gandhipuram, Coimbatore', '/images/mixer-grinder.jpg', FALSE),
(8, 4, 3, 'Cotton Ethnic Kurti & Dupatta Set', 'Festive Indian cotton embroidered kurtis set, size Medium. Worn once for a family function, freshly dry cleaned. Free donation to support sustainable fashion and reuse.', 0.00, TRUE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Madurai', 'Anna Nagar', 'Anna Nagar 80 Feet Road, Madurai', '/images/ethnic-kurti.jpg', FALSE),
(9, 2, 3, 'Levi''s Classic Denim Jacket', 'Authentic Levi''s trucker denim jacket in medium blue wash, size Large. Heavy duty brass buttons, four pockets, pure durable cotton denim. Lightly worn for a few months, excellent rugged style.', 1200.00, FALSE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'T. Nagar', 'Pondy Bazaar Near Naidu Hall, T. Nagar, Chennai', '/images/denim-jacket.jpg', TRUE),
(10, 4, 3, 'Kanchipuram Pure Silk Saree', 'Traditional maroon bridal Kanchipuram pure silk saree with heavy pure golden zari border and detailed temple pallu. Worn only once for wedding reception. Dry cleaned and preserved in pristine condition.', 3500.00, FALSE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Mylapore', 'Near Kapaleeshwarar Temple North Mada St, Mylapore, Chennai', '/images/silk-saree.jpg', TRUE),
(11, 2, 3, 'Unisex Cotton Fleece Hoodie', 'Cozy olive green winter hoodie with warm brushed fleece interior, drawstring hood, and front kangaroo pouch pocket. Size Medium, gently used, no fading or lint.', 650.00, FALSE, 'GOOD', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Velachery', 'Near Vijayanagar Bus Terminus, Velachery, Chennai', '/images/cotton-hoodie.jpg', FALSE),
(12, 2, 4, 'Solid Teak Wood Coffee Table', 'Mid-century modern rectangular coffee table crafted from solid natural teak wood. Features a spacious lower slatted shelf for magazines and remotes. Smooth honey finish, sturdy construction.', 2400.00, FALSE, 'GOOD', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Anna Nagar', '2nd Avenue Near Roundana Metro, Anna Nagar, Chennai', '/images/wooden-coffee-table.jpg', TRUE),
(13, 4, 4, 'Modern 3-Seater Fabric Sofa', 'Contemporary 3-seater living room couch upholstered in high-density grey textured linen fabric. High-resilience foam cushioning, solid hardwood internal frame. Very well maintained in pet-free home.', 6500.00, FALSE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'OMR', 'Thoraipakkam Toll Plaza, OMR Rajiv Gandhi Salai, Chennai', '/images/fabric-sofa.jpg', TRUE),
(14, 2, 4, '4-Tier Wooden Ladder Bookshelf', 'Minimalist Scandinavian design 4-tier leaning ladder shelf rack for books, decor items, and plants. Solid pine wood with water-resistant eco coat. Easy to disassemble for transport.', 1100.00, FALSE, 'LIKE_NEW', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Tambaram', 'Tambaram Sanatorium Near Bus Stop, Chennai', '/images/wooden-bookshelf.jpg', TRUE),
(15, 2, 4, 'Solid Wood Study & Work Desk', 'Sturdy wooden desk with smooth teak finish, 2 smooth gliding utility drawers, cable grommet and footrest rail. Perfect for laptop workstation or student study desk.', 2200.00, FALSE, 'GOOD', 'AVAILABLE', 'Tamil Nadu', 'Chennai', 'Porur', 'Near Porur Junction / DLF IT Park, Chennai', '/images/wooden-coffee-table.jpg', FALSE);
