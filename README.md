# ReUseHub – Second-Hand Product Marketplace
> **Buy • Sell • Donate**  
> *Shop Smart. Reuse More. Go Green!*

A complete, modern, professional, and fully functional web application designed for the circular economy. ReUseHub enables communities across Tamil Nadu and India to buy, sell, and donate pre-loved items with smart neighborhood discovery, zero paid APIs, and a clean, responsive e-commerce interface.

---

## 🎨 Visual Design & Branding

- **Primary Dark Green**: `#176B45`
- **Light Green**: `#E8F5EC`
- **White**: `#FFFFFF`
- **Dark Text**: `#252525`
- **Orange Accent**: `#F4A340`

### Homepage Layout Structure
1. **Top Announcement Bar**: Dark green with brand message, live demo persona switcher, and English/தமிழ் language toggle.
2. **Main Navigation Bar**: Recycling leaf logo, Home, Browse Products dropdown (all 8 categories), Sell an Item, Donate (FREE badge), About Us, Search, Wishlist counter, and Shopping Cart counter.
3. **Hero Banner**:
   - **Left**: Headline *"Give Your Products a Second Life"*, search input, category dropdown, and orange search button.
   - **Right**: Sustainability visual of an open cardboard box packed with reusable goods (laptops, headphones, books, cameras, plants), floating eco badge, and *"Reuse • Reduce • Recycle"* ribbon.
4. **Browse Categories**: 8 categories with clean circular icons and hover elevations (Electronics, Books & Education, Clothing, Furniture, Home Appliances, Sports Equipment, Accessories, Others).
5. **Featured Products**: 5 cards in a single row on desktop:
   - Dell Laptop – ₹25,000 – Like New
   - Nike Sports Shoes – ₹1,800 – Good
   - Skybags Backpack – ₹800 – Used
   - iPhone 13 – ₹35,000 – Like New
   - Office Chair – ₹1,500 – Good
6. **How It Works**: 4 steps with icons (Create Account → List or Find Products → Connect → Make an Impact).
7. **Environmental Benefits**: Light green section with statistics on Landfill Waste Diverted, CO₂ Prevented, and Water Conserved.
8. **Dark Green Footer**: Full company mission, quick links, support, safety tips, Chennai HQ contact details, and social links.

---

## 📍 Manual Location Feature (Zero Paid APIs)

Sellers enter their local pickup coordinates manually:
- **State**: Tamil Nadu
- **City**: Chennai / Coimbatore / Madurai / Bengaluru
- **Area**: Tambaram / T. Nagar / Adyar / Anna Nagar / Gandhipuram
- **Specific Pickup Landmark**: e.g., *"Near Tambaram Railway Station, West Gate, Chennai"*

Buyers can:
- Filter instantly by clicking City pills (Chennai, Coimbatore, Madurai, etc.)
- Search by specific neighborhood or area
- View the seller's verified pickup landmark in the Quick View modal and product details
- No GPS permissions or paid Google Maps API keys required!

---

## 🚚 Real-Time Order & Delivery Tracking System

ReUseHub includes a complete 4-step delivery lifecycle tracker:
1. **Order Placed** (Purchase request submitted with buyer schedule preference)
2. **Packed & Confirmed** (Seller verifies item quality and prepares package)
3. **Out for Delivery / In Transit** (Assigned to local green courier or scheduled for neighborhood hub pickup)
4. **Delivered / Handover Verified** (Item handed over and verified using secure 4-digit OTP)

### Key Features:
- **Dedicated Tracking Portal** (`track.html`): Search by Tracking ID (e.g. `TRK-RUH-8401`, `TRK-RUH-8402`, `TRK-RUH-8403`).
- **Interactive Buyer Modal**: 1-click **Track** button directly on every order row in Buyer Dashboard.
- **Seller Shipping Controls**: Sellers can dispatch orders, update tracking statuses, and verify handovers.
- **Courier & OTP Security**: Live driver contact details, seller landmark, buyer address, and 4-digit verification code.

---

## 👥 Project Team & Contributors

This project is built and maintained by:

- **Dhanushya M** — [@dhanushyadhanushya63-dotcom](https://github.com/dhanushyadhanushya63-dotcom)  
  *Frontend Architecture, Homepage Design, Hero Banner & Category Engine*
- **Dhivya Murugesan** — [@dhivyamurugesan20](https://github.com/dhivyamurugesan20)  
  *Product Catalog, Browse & Filtering, Donation Corner & Safety Guidelines*
- **Devasri Anandhababu** — [@devasri30anandhababu-dotcom](https://github.com/devasri30anandhababu-dotcom)  
  *Multi-Role Authentication, Buyer/Seller/Admin Dashboards & Responsive Styling*

---

## 🎨 Clean & Modern User Experience

- Clean English e-commerce interface matching modern startup standards.
- Responsive design tailored for mobile, tablet, and desktop viewports.
- Internal translation and localization dictionary engine in `public/js/i18n.js`.
- Zero dependencies on paid translation APIs.

---

## 🛠️ Technology Stack

### Frontend
- **HTML5 & CSS3** (Custom responsive stylesheet with CSS variables)
- **Bootstrap 5.3.3 & Bootstrap Icons 1.11.3**
- **JavaScript (ES6 Modules)**: Modular architecture (`api.js`, `auth.js`, `i18n.js`, `app.js`)

### Backend (Dual Implementation for Maximum Flexibility)
1. **Java Spring Boot 3.2.5** (Located in `/backend`):
   - **Framework**: Spring Web MVC, Spring Data JPA, Spring Security (BCrypt)
   - **Database**: MySQL 8.0+ (Connector/J), optional H2 fallback
   - **Architecture**: Complete Entities, Repositories, Services, DTOs, and REST Controllers
   - **Build Tool**: Apache Maven (`pom.xml`)
2. **Lightweight Node.js REST API Server** (`server.js`):
   - Zero-dependency built-in server running on port `8080`
   - Exposes identical `/api/...` endpoints and static file serving
   - Full persistence in `database/reusehub.json`
   - Instant 1-click startup without external dependencies

### Database (MySQL 8.0+)
Complete schema with relational constraints in `database/database.sql`:
- `roles`
- `users`
- `categories`
- `products`
- `product_images`
- `wishlist`
- `cart`
- `purchase_requests`
- `messages`
- `reports`

---

## 🚀 How to Run the Application

### Option A: Instant Node.js Web Server (Zero Setup)
From the project root `d:\REUSE_HUB`:
```powershell
# Double-click run-server.bat OR run in terminal:
node server.js
```
Open your browser at:
👉 **`http://localhost:8080`**

### Option B: Java Spring Boot + MySQL Backend
1. **Initialize MySQL**:
   Open MySQL Workbench or CLI and run:
   ```sql
   source d:/REUSE_HUB/database/database.sql
   ```
2. **Configure Database Credentials**:
   Check `backend/src/main/resources/application.properties` and verify your MySQL password (`root`/`root` by default).
3. **Start Spring Boot**:
   ```powershell
   cd backend
   mvn spring-boot:run
   ```
   The backend REST API will run on `http://localhost:8080`.

---

## 👥 Demo User Personas for Instant Testing

Use the **Demo Role** dropdown in the top bar, or login on `/login.html`:

| Role | Name | Email | Password | City / Area |
|---|---|---|---|---|
| **Buyer** | Priya Raman | `buyer@reusehub.com` | `password123` | Chennai (Adyar) |
| **Seller** | Karthik Sundaram | `seller@reusehub.com` | `password123` | Chennai (Tambaram) |
| **Admin** | HQ Manager | `admin@reusehub.com` | `password123` | Chennai (Guindy) |

---

## 📱 Page Sitemap & Features

| File | Page Name | Key Features |
|---|---|---|
| `index.html` | **Homepage** | Matches reference layout, hero search, 8 category cards, 5-column featured products, How It Works, Eco Benefits, dark-green footer |
| `browse.html` | **Browse Products** | Category filter sidebar, city & area filters, condition filters, sort by price/date, quick search |
| `sell.html` | **Sell an Item** | Listing form with photo upload, condition picker, price / donate switch, and pickup landmark |
| `donate.html` | **Donation Corner** | 100% free giveaway listings, claim donation workflow, impact tracker |
| `dashboard.html` | **Unified Dashboard** | Multi-role tabs: Buyer (requests, wishlist, cart), Seller (listings, incoming requests, accept/reject), Admin (users, moderation) |
| `login.html` | **Unified Login Hub** | Multi-role portal switcher, buyer/seller registration |
| `buyer-login.html` | **Buyer Portal Login** | Dedicated login interface for verified buyers |
| `seller-login.html` | **Seller Portal Login** | Dedicated login interface for sellers & donors |
| `admin-login.html` | **Admin Portal Login** | Dedicated security interface for platform administrators |
| `about.html` | **About Us** | Mission statement, circular economy pillars, in-person pickup safety tips, FAQs |
| `track.html` | **Track Order & Delivery** | 4-step visual stepper, tracking ID search, live courier details, handover OTP, milestone event timeline |

---

## 📄 License
MIT License. Built for sustainability, circular economy, and community empowerment.
