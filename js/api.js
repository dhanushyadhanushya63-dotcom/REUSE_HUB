// ReUseHub Smart Hybrid API Client
// Works seamlessly both via backend HTTP server (port 8080)
// AND offline / LiveServer / file:// protocol with automatic localStorage persistence!

const API_BASE = '/api';

// Complete Offline / LiveServer Fallback Seed Data
const DEFAULT_LOCAL_DB = {
  users: [
    {
      id: 1,
      username: "admin",
      email: "admin@reusehub.com",
      password: "password123",
      fullName: "Admin ReUseHub",
      phone: "+91 9876543210",
      role: "ROLE_ADMIN",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Guindy",
      address: "ReUseHub HQ, Anna Salai",
      status: "ACTIVE"
    },
    {
      id: 2,
      username: "karthik_seller",
      email: "seller@reusehub.com",
      password: "password123",
      fullName: "Karthik Sundaram",
      phone: "+91 9840123456",
      role: "ROLE_SELLER",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Tambaram",
      address: "14, Gandhi Road, West Tambaram",
      status: "ACTIVE"
    },
    {
      id: 3,
      username: "priya_buyer",
      email: "buyer@reusehub.com",
      password: "password123",
      fullName: "Priya Raman",
      phone: "+91 9444123456",
      role: "ROLE_BUYER",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Adyar",
      address: "28, Lattice Bridge Road, Adyar",
      status: "ACTIVE"
    },
    {
      id: 4,
      username: "ananya_seller",
      email: "ananya@reusehub.com",
      password: "password123",
      fullName: "Ananya Natarajan",
      phone: "+91 9894123456",
      role: "ROLE_SELLER",
      state: "Tamil Nadu",
      city: "Coimbatore",
      area: "Gandhipuram",
      address: "45, Cross Cut Road, Gandhipuram",
      status: "ACTIVE"
    }
  ],
  categories: [
    { id: 1, name: "Electronics", icon: "bi-laptop", description: "Laptops, smartphones, audio and gadgets" },
    { id: 2, name: "Books & Education", icon: "bi-book", description: "Textbooks, novels, study material and exam guides" },
    { id: 3, name: "Clothing", icon: "bi-bag-heart", description: "Men, women, kids apparel and ethnic wear" },
    { id: 4, name: "Furniture", icon: "bi-lamp", description: "Chairs, study tables, beds, sofas and storage" },
    { id: 5, name: "Home Appliances", icon: "bi-tv", description: "Kitchen mixers, microwaves and household items" },
    { id: 6, name: "Sports Equipment", icon: "bi-bicycle", description: "Bicycles, gym gear, rackets and fitness items" },
    { id: 7, name: "Accessories", icon: "bi-watch", description: "Backpacks, watches, sunglasses and daily essentials" },
    { id: 8, name: "Others", icon: "bi-grid", description: "Musical instruments, craft supplies and miscellaneous" }
  ],
  products: [
    {
      id: 1,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 1,
      categoryName: "Electronics",
      title: "Dell Laptop Inspiron 15",
      description: "Dell Inspiron 15 Core i5 11th Gen, 16GB RAM, 512GB NVMe SSD, 15.6 inch FHD Display. 1.5 years old, pristine condition, battery backup 4+ hours. Original Dell 65W charger and laptop sleeve included.",
      price: 25000,
      isDonation: false,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Tambaram",
      pickupLocation: "Near Tambaram Railway Station, West Gate, Chennai",
      primaryImageUrl: "images/dell-laptop.jpg",
      featured: true,
      viewCount: 145,
      createdAt: "2026-11-20T10:30:00Z"
    },
    {
      id: 2,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 6,
      categoryName: "Sports Equipment",
      title: "Nike Sports Shoes",
      description: "Authentic Nike Revolution 6 Next Nature road running shoes, Men size UK 9 / US 10. Breathable mesh upper, cushioned foam midsole. Used for only two weeks on running track, excellent grip and cleanliness.",
      price: 1800,
      isDonation: false,
      conditionType: "GOOD",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "T. Nagar",
      pickupLocation: "Pondy Bazaar Near Naidu Hall, T. Nagar, Chennai",
      primaryImageUrl: "images/nike-shoes.jpg",
      featured: true,
      viewCount: 98,
      createdAt: "2026-11-21T11:15:00Z"
    },
    {
      id: 3,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 7,
      categoryName: "Accessories",
      title: "Skybags Backpack",
      description: "Skybags durable casual 32-litre 3-compartment college & travel backpack. Features padded laptop sleeve, water bottle holder, rain cover and ergonomic shoulder straps. Lightly used, clean and no tears.",
      price: 800,
      isDonation: false,
      conditionType: "USED",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Velachery",
      pickupLocation: "Near Phoenix MarketCity Mall, Velachery Main Road, Chennai",
      primaryImageUrl: "images/skybags-backpack.jpg",
      featured: true,
      viewCount: 75,
      createdAt: "2026-11-21T14:40:00Z"
    },
    {
      id: 4,
      sellerId: 4,
      sellerName: "Ananya Natarajan",
      categoryId: 1,
      categoryName: "Electronics",
      title: "iPhone 13 128GB",
      description: "Apple iPhone 13 128GB Midnight Blue. 90% battery health, TrueTone and FaceID fully working. Tempered glass installed since day one. Comes with original Apple Lightning cable and Spigen tough armor case.",
      price: 35000,
      isDonation: false,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Anna Nagar",
      pickupLocation: "2nd Avenue Near Roundana Metro, Anna Nagar, Chennai",
      primaryImageUrl: "images/iphone-13.jpg",
      featured: true,
      viewCount: 232,
      createdAt: "2026-11-22T09:20:00Z"
    },
    {
      id: 5,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 4,
      categoryName: "Furniture",
      title: "Office Chair",
      description: "High-back ergonomic mesh revolving chair with adjustable lumbar support, 3D armrests, pneumatic seat height adjustment and smooth caster wheels. Extremely comfortable for long work-from-home hours.",
      price: 1500,
      isDonation: false,
      conditionType: "GOOD",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Adyar",
      pickupLocation: "Near Adyar Depot, LB Road, Adyar, Chennai",
      primaryImageUrl: "images/office-chair.jpg",
      featured: true,
      viewCount: 115,
      createdAt: "2026-11-22T16:00:00Z"
    },
    {
      id: 6,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 2,
      categoryName: "Books & Education",
      title: "Engineering Books Set",
      description: "Complete set of Anna University Engineering Mathematics, Data Structures, Algorithms, plus GATE CS prep guides. Free for college students who need them. All pages intact and well maintained.",
      price: 0,
      isDonation: true,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Tambaram",
      pickupLocation: "Tambaram Sanatorium Near Bus Stop, Chennai",
      primaryImageUrl: "images/hero-sustainability-box.jpg",
      featured: true,
      viewCount: 90,
      createdAt: "2026-11-23T08:00:00Z"
    },
    {
      id: 7,
      sellerId: 4,
      sellerName: "Ananya Natarajan",
      categoryId: 5,
      categoryName: "Home Appliances",
      title: "Philips 750W Mixer Grinder",
      description: "Philips Viva Collection 750W 3-jar mixer grinder. Heavy duty motor, stainless steel jars with leak-proof lids. Ideal for chutney, wet grinding, and dry spices. Sparingly used in guest house.",
      price: 1200,
      isDonation: false,
      conditionType: "GOOD",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Coimbatore",
      area: "Gandhipuram",
      pickupLocation: "Cross Cut Road Near Power House, Gandhipuram, Coimbatore",
      primaryImageUrl: "images/dell-laptop.jpg",
      featured: false,
      viewCount: 42,
      createdAt: "2026-11-22T12:00:00Z"
    },
    {
      id: 8,
      sellerId: 4,
      sellerName: "Ananya Natarajan",
      categoryId: 3,
      categoryName: "Clothing",
      title: "Cotton Kurti & Dupatta Set",
      description: "Festive Indian cotton embroidered kurtis set, size Medium. Worn once for a family function, freshly dry cleaned. Free donation to support sustainable fashion and reuse.",
      price: 0,
      isDonation: true,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Madurai",
      area: "Anna Nagar",
      pickupLocation: "Anna Nagar 80 Feet Road, Madurai",
      primaryImageUrl: "images/ethnic-kurti.jpg",
      featured: false,
      viewCount: 62,
      createdAt: "2026-11-21T18:30:00Z"
    },
    {
      id: 9,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 3,
      categoryName: "Clothing",
      title: "Levi's Classic Denim Jacket",
      description: "Authentic Levi's trucker denim jacket in medium blue wash, size Large. Heavy duty brass buttons, four pockets, pure durable cotton denim. Lightly worn for a few months, excellent rugged style.",
      price: 1200,
      isDonation: false,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "T. Nagar",
      pickupLocation: "Pondy Bazaar Near Naidu Hall, T. Nagar, Chennai",
      primaryImageUrl: "images/denim-jacket.jpg",
      featured: true,
      viewCount: 118,
      createdAt: "2026-11-23T09:00:00Z"
    },
    {
      id: 10,
      sellerId: 4,
      sellerName: "Ananya Natarajan",
      categoryId: 3,
      categoryName: "Clothing",
      title: "Kanchipuram Pure Silk Saree",
      description: "Traditional maroon bridal Kanchipuram pure silk saree with heavy pure golden zari border and detailed temple pallu. Worn only once for wedding reception. Dry cleaned and preserved in pristine condition.",
      price: 3500,
      isDonation: false,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Mylapore",
      pickupLocation: "Near Kapaleeshwarar Temple North Mada St, Mylapore, Chennai",
      primaryImageUrl: "images/silk-saree.jpg",
      featured: true,
      viewCount: 175,
      createdAt: "2026-11-23T09:15:00Z"
    },
    {
      id: 11,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 3,
      categoryName: "Clothing",
      title: "Unisex Cotton Fleece Hoodie",
      description: "Cozy olive green winter hoodie with warm brushed fleece interior, drawstring hood, and front kangaroo pouch pocket. Size Medium, gently used, no fading or lint.",
      price: 650,
      isDonation: false,
      conditionType: "GOOD",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Velachery",
      pickupLocation: "Near Vijayanagar Bus Terminus, Velachery, Chennai",
      primaryImageUrl: "images/cotton-hoodie.jpg",
      featured: false,
      viewCount: 84,
      createdAt: "2026-11-23T09:30:00Z"
    },
    {
      id: 12,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 4,
      categoryName: "Furniture",
      title: "Solid Teak Wood Coffee Table",
      description: "Mid-century modern rectangular coffee table crafted from solid natural teak wood. Features a spacious lower slatted shelf for magazines and remotes. Smooth honey finish, sturdy construction.",
      price: 2400,
      isDonation: false,
      conditionType: "GOOD",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Anna Nagar",
      pickupLocation: "2nd Avenue Near Roundana Metro, Anna Nagar, Chennai",
      primaryImageUrl: "images/wooden-coffee-table.jpg",
      featured: true,
      viewCount: 145,
      createdAt: "2026-11-23T10:00:00Z"
    },
    {
      id: 13,
      sellerId: 4,
      sellerName: "Ananya Natarajan",
      categoryId: 4,
      categoryName: "Furniture",
      title: "Modern 3-Seater Fabric Sofa",
      description: "Contemporary 3-seater living room couch upholstered in high-density grey textured linen fabric. High-resilience foam cushioning, solid hardwood internal frame. Very well maintained in pet-free home.",
      price: 6500,
      isDonation: false,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "OMR",
      pickupLocation: "Thoraipakkam Toll Plaza, OMR Rajiv Gandhi Salai, Chennai",
      primaryImageUrl: "images/fabric-sofa.jpg",
      featured: true,
      viewCount: 210,
      createdAt: "2026-11-23T10:30:00Z"
    },
    {
      id: 14,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 4,
      categoryName: "Furniture",
      title: "4-Tier Wooden Ladder Bookshelf",
      description: "Minimalist Scandinavian design 4-tier leaning ladder shelf rack for books, decor items, and plants. Solid pine wood with water-resistant eco coat. Easy to disassemble for transport.",
      price: 1100,
      isDonation: false,
      conditionType: "LIKE_NEW",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Tambaram",
      pickupLocation: "Tambaram Sanatorium Near Bus Stop, Chennai",
      primaryImageUrl: "images/wooden-bookshelf.jpg",
      featured: true,
      viewCount: 130,
      createdAt: "2026-11-23T11:00:00Z"
    },
    {
      id: 15,
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      categoryId: 4,
      categoryName: "Furniture",
      title: "Wooden Study Table with Shelf",
      description: "Compact wooden study and laptop desk with top book organizer rack and smooth storage drawer. Free donation to support school or college student education.",
      price: 0,
      isDonation: true,
      conditionType: "GOOD",
      status: "AVAILABLE",
      state: "Tamil Nadu",
      city: "Chennai",
      area: "Porur",
      pickupLocation: "Near Porur Junction / DLF IT Park, Chennai",
      primaryImageUrl: "images/wooden-coffee-table.jpg",
      featured: false,
      viewCount: 78,
      createdAt: "2026-11-23T11:15:00Z"
    }
  ],
  wishlist: [
    { id: 1, userId: 3, productId: 1 },
    { id: 2, userId: 3, productId: 4 }
  ],
  cart: [
    { id: 1, userId: 3, productId: 3, quantity: 1 }
  ],
  purchaseRequests: [
    {
      id: 1,
      trackingNumber: "TRK-RUH-8401",
      productId: 5,
      productTitle: "Office Chair",
      productPrice: 1500,
      buyerId: 3,
      buyerName: "Priya Raman",
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      status: "ACCEPTED",
      trackingStatus: "SHIPPED",
      carrier: "ReUseHub Green Express Local Courier",
      driverName: "Murugan S (Delivery Partner)",
      driverPhone: "+91 94451 88291",
      pickupDate: "2026-11-25",
      pickupTime: "05:30 PM",
      shippedAt: "2026-11-25T08:30:00Z",
      estimatedDelivery: "2026-11-25T17:30:00Z",
      deliveredAt: null,
      deliveryAddress: "28, Lattice Bridge Road, Adyar, Chennai - 600020",
      pickupLocation: "14, Gandhi Road, Near Tambaram Railway Station, West Gate, Chennai",
      handoverOtp: "6291",
      buyerMessage: "Hello Karthik, I work near Adyar and scheduled courier pickup for Wednesday evening around 5:30 PM.",
      sellerResponse: "Accepted! Item packed and dispatched via ReUseHub Green Express.",
      createdAt: "2026-11-23T11:00:00Z",
      statusHistory: [
        {
          status: "ORDER_PLACED",
          title: "Purchase Request Placed",
          time: "Nov 23, 2026 - 11:00 AM",
          location: "Adyar, Chennai",
          desc: "Buyer Priya Raman submitted order request with delivery preference."
        },
        {
          status: "CONFIRMED",
          title: "Confirmed & Packed by Seller",
          time: "Nov 24, 2026 - 02:15 PM",
          location: "Tambaram, Chennai",
          desc: "Seller Karthik Sundaram verified item condition and prepared package."
        },
        {
          status: "SHIPPED",
          title: "Shipped & In Transit / Out for Delivery",
          "time": "Nov 25, 2026 - 08:30 AM",
          location: "Tambaram Sorting Hub, Chennai",
          desc: "Package assigned to delivery partner Murugan S (+91 94451 88291). Expected today by 05:30 PM."
        }
      ]
    },
    {
      id: 2,
      trackingNumber: "TRK-RUH-8402",
      productId: 1,
      productTitle: "Dell Laptop Inspiron 15",
      productPrice: 25000,
      buyerId: 3,
      buyerName: "Priya Raman",
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      status: "COMPLETED",
      trackingStatus: "DELIVERED",
      carrier: "ReUseHub Local Green Express",
      driverName: "Suresh Kumar (Eco Courier)",
      driverPhone: "+91 98402 11983",
      pickupDate: "2026-11-24",
      pickupTime: "02:00 PM",
      shippedAt: "2026-11-24T10:15:00Z",
      estimatedDelivery: "2026-11-24T14:30:00Z",
      deliveredAt: "2026-11-24T14:25:00Z",
      deliveryAddress: "28, Lattice Bridge Road, Adyar, Chennai - 600020",
      pickupLocation: "14, Gandhi Road, Near Tambaram Railway Station, West Gate, Chennai",
      handoverOtp: "8341",
      buyerMessage: "Confirming laptop purchase with original charger.",
      sellerResponse: "Laptop inspected and handed over with original charger and invoice.",
      createdAt: "2026-11-22T09:30:00Z",
      statusHistory: [
        {
          status: "ORDER_PLACED",
          title: "Purchase Request Placed",
          time: "Nov 22, 2026 - 09:30 AM",
          location: "Adyar, Chennai",
          desc: "Request initiated by Priya Raman."
        },
        {
          status: "CONFIRMED",
          title: "Seller Confirmed",
          time: "Nov 22, 2026 - 01:00 PM",
          location: "Tambaram, Chennai",
          desc: "Seller approved purchase request."
        },
        {
          status: "SHIPPED",
          title: "Dispatched for Handover",
          time: "Nov 24, 2026 - 10:15 AM",
          location: "South Chennai Dispatch Hub",
          desc: "Item on route with delivery partner Suresh Kumar."
        },
        {
          status: "DELIVERED",
          title: "Delivered & Handover Verified",
          time: "Nov 24, 2026 - 02:25 PM",
          location: "Adyar, Chennai",
          desc: "Successfully received by Priya Raman. OTP 8341 verified."
        }
      ]
    },
    {
      id: 3,
      trackingNumber: "TRK-RUH-8403",
      productId: 2,
      productTitle: "Nike Sports Shoes",
      productPrice: 1800,
      buyerId: 3,
      buyerName: "Priya Raman",
      sellerId: 2,
      sellerName: "Karthik Sundaram",
      status: "ACCEPTED",
      trackingStatus: "CONFIRMED",
      carrier: "ReUseHub Local Pickup Hub",
      driverName: "Awaiting Carrier Pickup",
      driverPhone: "N/A",
      pickupDate: "2026-11-26",
      pickupTime: "11:00 AM",
      shippedAt: null,
      estimatedDelivery: "2026-11-26T14:00:00Z",
      deliveredAt: null,
      deliveryAddress: "28, Lattice Bridge Road, Adyar, Chennai - 600020",
      pickupLocation: "Pondy Bazaar Near Naidu Hall, T. Nagar, Chennai",
      handoverOtp: "4912",
      buyerMessage: "Requesting sports shoes for local pickup on Thursday morning.",
      sellerResponse: "Accepted. Item packed in original box and ready for dispatch.",
      createdAt: "2026-11-25T07:15:00Z",
      statusHistory: [
        {
          status: "ORDER_PLACED",
          title: "Order Placed",
          time: "Nov 25, 2026 - 07:15 AM",
          location: "Adyar, Chennai",
          desc: "Order placed by buyer."
        },
        {
          status: "CONFIRMED",
          title: "Confirmed & Packed",
          time: "Nov 25, 2026 - 09:00 AM",
          location: "T. Nagar, Chennai",
          desc: "Packed and ready for pickup / dispatch."
        }
      ]
    }
  ],
  messages: [
    {
      id: 1,
      senderId: 3,
      senderName: "Priya Raman",
      receiverId: 2,
      receiverName: "Karthik Sundaram",
      productId: 5,
      productTitle: "Office Chair",
      messageText: "Hi Karthik! Is the office chair still available? Can you confirm if all wheels roll smoothly?",
      isRead: true,
      createdAt: "2026-11-23T10:45:00Z"
    },
    {
      id: 2,
      senderId: 2,
      senderName: "Karthik Sundaram",
      receiverId: 3,
      receiverName: "Priya Raman",
      productId: 5,
      productTitle: "Office Chair",
      messageText: "Hello Priya! Yes, absolutely. All 5 wheels roll smoothly, tilt lock works, and cushion is very clean.",
      isRead: true,
      createdAt: "2026-11-23T10:50:00Z"
    }
  ],
  reports: []
};

// Match tracking record by flexible criteria (full tracking code, numeric digits, product, buyer/seller name)
function matchTrackingRecord(r, query) {
  if (!r || !query) return false;
  const qStr = query.toString().trim();
  if (!qStr) return false;

  const upperQ = qStr.toUpperCase();
  const cleanQ = upperQ.replace(/[^A-Z0-9]/g, '');
  const digitsQ = qStr.replace(/[^0-9]/g, '');

  const trk = (r.trackingNumber || ('TRK-RUH-' + r.id)).toString().toUpperCase();
  const cleanTrk = trk.replace(/[^A-Z0-9]/g, '');
  const digitsTrk = trk.replace(/[^0-9]/g, '');

  // 1. Direct tracking number match (case / hyphen insensitive)
  if (trk === upperQ || cleanTrk === cleanQ) return true;

  // 2. Substring matching in tracking code
  if (cleanQ.length >= 2 && cleanTrk.includes(cleanQ)) return true;
  if (cleanTrk.length >= 4 && cleanQ.includes(cleanTrk)) return true;

  // 3. Match numeric digits (e.g. "8401" matches "TRK-RUH-8401", "1" matches order 1)
  if (digitsQ) {
    if (digitsTrk.includes(digitsQ) && digitsQ.length >= 2) return true;
    if (r.id && r.id.toString() === digitsQ) return true;
    if (r.productId && r.productId.toString() === digitsQ) return true;
    if (r.handoverOtp && r.handoverOtp.toString() === digitsQ) return true;
  }

  // 4. Product Title match
  if (r.productTitle && r.productTitle.toUpperCase().includes(upperQ)) return true;

  // 5. Buyer or Seller Name match
  if (r.buyerName && r.buyerName.toUpperCase().includes(upperQ)) return true;
  if (r.sellerName && r.sellerName.toUpperCase().includes(upperQ)) return true;

  return false;
}

// Local storage DB helper
function getLocalDb() {
  let db = null;
  const raw = localStorage.getItem('reusehub_local_db_v2');
  if (raw) {
    try { db = JSON.parse(raw); } catch (e) {}
  }
  if (!db) {
    db = JSON.parse(JSON.stringify(DEFAULT_LOCAL_DB));
  }

  // CRITICAL: Ensure demo purchase requests with tracking are ALWAYS present!
  if (!db.purchaseRequests || !Array.isArray(db.purchaseRequests) || db.purchaseRequests.length === 0) {
    db.purchaseRequests = JSON.parse(JSON.stringify(DEFAULT_LOCAL_DB.purchaseRequests || []));
  } else {
    // Make sure each demo tracking order is merged if missing
    (DEFAULT_LOCAL_DB.purchaseRequests || []).forEach(demoReq => {
      const hasReq = db.purchaseRequests.some(r => 
        (r.trackingNumber && r.trackingNumber === demoReq.trackingNumber) ||
        (r.id && r.id === demoReq.id)
      );
      if (!hasReq) {
        db.purchaseRequests.push(demoReq);
      }
    });
  }

  if (db && Array.isArray(db.products)) {
    db.products.forEach(p => {
      if (!p.sellerPhone) p.sellerPhone = p.sellerId === 4 ? '+91 9894123456' : '+91 9840123456';
    });
  }
  if (db && Array.isArray(db.purchaseRequests)) {
    db.purchaseRequests.forEach(r => {
      if (!r.sellerPhone) r.sellerPhone = r.sellerId === 4 ? '+91 9894123456' : '+91 9840123456';
      if (!r.buyerPhone) r.buyerPhone = '+91 9444123456';
      if (!r.trackingNumber) r.trackingNumber = 'TRK-RUH-' + (r.id || Math.floor(1000 + Math.random() * 9000));
    });
  }
  saveLocalDb(db);
  return db;
}

function saveLocalDb(data) {
  localStorage.setItem('reusehub_local_db_v2', JSON.stringify(data));
}

// Ensure relative image path
function fixImg(url) {
  if (!url) return 'images/hero-sustainability-box.jpg';
  if (url.startsWith('/images/')) return url.substring(1);
  return url;
}

const api = {
  // Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback Local
    const db = getLocalDb();
    const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
    if (!user) return { error: 'Invalid email or password' };
    return {
      token: 'local_token_' + Date.now(),
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      city: user.city,
      area: user.area
    };
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback Local
    const db = getLocalDb();
    const newUser = {
      id: Date.now(),
      username: userData.username || userData.email.split('@')[0],
      email: userData.email,
      fullName: userData.fullName,
      phone: userData.phone || '',
      role: userData.role || 'ROLE_BUYER',
      city: userData.city || 'Chennai',
      area: userData.area || 'Tambaram',
      address: userData.address || '',
      status: 'ACTIVE'
    };
    db.users.push(newUser);
    saveLocalDb(db);
    return {
      token: 'local_token_' + Date.now(),
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      role: newUser.role,
      city: newUser.city,
      area: newUser.area
    };
  },

  // Categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return getLocalDb().categories;
  },

  // Products
  async getProducts(params = {}) {
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${qs}`);
      if (res.ok) {
        const list = await res.json();
        return list.map(p => ({ ...p, primaryImageUrl: fixImg(p.primaryImageUrl) }));
      }
    } catch (e) {}

    // Fallback Local Filtering
    const db = getLocalDb();
    let results = db.products.map(p => ({ ...p, primaryImageUrl: fixImg(p.primaryImageUrl) }));

    if (params.sellerId) {
      const sid = parseInt(params.sellerId);
      return results.filter(p => p.sellerId === sid);
    }
    if (params.featured === 'true') {
      results = results.filter(p => p.featured === true);
    }
    if (params.donation === 'true') {
      results = results.filter(p => p.isDonation === true || p.price === 0);
    }
    if (params.category) {
      const catId = parseInt(params.category);
      results = results.filter(p => p.categoryId === catId);
    }
    if (params.city && params.city !== 'All Cities' && params.city !== 'All') {
      results = results.filter(p => (p.city || '').toLowerCase().includes(params.city.toLowerCase()));
    }
    if (params.area) {
      results = results.filter(p => (p.area || '').toLowerCase().includes(params.area.toLowerCase()));
    }
    if (params.condition) {
      results = results.filter(p => p.conditionType === params.condition);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      results = results.filter(p =>
        (p.title || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.city || '').toLowerCase().includes(q) ||
        (p.area || '').toLowerCase().includes(q)
      );
    }

    return results;
  },

  async getProductById(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`);
      if (res.ok) {
        const p = await res.json();
        return { ...p, primaryImageUrl: fixImg(p.primaryImageUrl) };
      }
    } catch (e) {}

    const db = getLocalDb();
    const p = db.products.find(item => item.id === parseInt(id));
    if (p) return { ...p, primaryImageUrl: fixImg(p.primaryImageUrl) };
    return null;
  },

  async createProduct(sellerId, productData) {
    try {
      const res = await fetch(`${API_BASE}/products?sellerId=${sellerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const seller = db.users.find(u => u.id === parseInt(sellerId));
    const category = db.categories.find(c => c.id === parseInt(productData.categoryId));
    const newProduct = {
      id: Date.now(),
      sellerId: parseInt(sellerId),
      sellerName: seller ? seller.fullName : "Verified Seller",
      categoryId: parseInt(productData.categoryId),
      categoryName: category ? category.name : "General",
      title: productData.title,
      description: productData.description || "",
      price: productData.isDonation ? 0 : parseFloat(productData.price || 0),
      isDonation: Boolean(productData.isDonation),
      conditionType: productData.conditionType || "GOOD",
      status: "AVAILABLE",
      state: productData.state || "Tamil Nadu",
      city: productData.city || "Chennai",
      area: productData.area || "Tambaram",
      pickupLocation: productData.pickupLocation || "",
      primaryImageUrl: fixImg(productData.primaryImageUrl),
      featured: true,
      viewCount: 0,
      createdAt: new Date().toISOString()
    };
    db.products.unshift(newProduct);
    saveLocalDb(db);
    return newProduct;
  },

  async updateProduct(id, sellerId, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}?sellerId=${sellerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const idx = db.products.findIndex(p => p.id === parseInt(id));
    if (idx !== -1) {
      db.products[idx] = { ...db.products[idx], ...productData };
      saveLocalDb(db);
      return db.products[idx];
    }
    return { error: 'Not found' };
  },

  async updateProductStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const p = db.products.find(item => item.id === parseInt(id));
    if (p) {
      p.status = status;
      saveLocalDb(db);
    }
    return { message: 'Status updated' };
  },

  async deleteProduct(id, sellerId) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}?sellerId=${sellerId}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    db.products = db.products.filter(p => p.id !== parseInt(id));
    saveLocalDb(db);
    return { message: 'Deleted' };
  },

  async uploadImage(dataUrl) {
    try {
      const res = await fetch(`${API_BASE}/products/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl })
      });
      if (res.ok) return await res.json();
    } catch (e) {}
    return { imageUrl: dataUrl };
  },

  // Wishlist
  async getWishlist(userId) {
    try {
      const res = await fetch(`${API_BASE}/wishlist?userId=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const userWishlist = db.wishlist.filter(w => w.userId === parseInt(userId));
    return userWishlist.map(w => {
      const p = db.products.find(item => item.id === w.productId);
      return p ? { wishlistId: w.id, ...p, primaryImageUrl: fixImg(p.primaryImageUrl) } : null;
    }).filter(Boolean);
  },

  async addToWishlist(userId, productId) {
    try {
      const res = await fetch(`${API_BASE}/wishlist?userId=${userId}&productId=${productId}`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const uId = parseInt(userId);
    const pId = parseInt(productId);
    if (!db.wishlist.some(w => w.userId === uId && w.productId === pId)) {
      db.wishlist.push({ id: Date.now(), userId: uId, productId: pId });
      saveLocalDb(db);
    }
    return { message: 'Added to wishlist' };
  },

  async removeFromWishlist(userId, productId) {
    try {
      const res = await fetch(`${API_BASE}/wishlist?userId=${userId}&productId=${productId}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    db.wishlist = db.wishlist.filter(w => !(w.userId === parseInt(userId) && w.productId === parseInt(productId)));
    saveLocalDb(db);
    return { message: 'Removed' };
  },

  // Cart
  async getCart(userId) {
    try {
      const res = await fetch(`${API_BASE}/cart?userId=${userId}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const userCart = db.cart.filter(c => c.userId === parseInt(userId));
    return userCart.map(c => {
      const p = db.products.find(item => item.id === c.productId);
      return p ? { cartId: c.id, quantity: c.quantity, ...p, primaryImageUrl: fixImg(p.primaryImageUrl) } : null;
    }).filter(Boolean);
  },

  async addToCart(userId, productId, quantity = 1) {
    try {
      const res = await fetch(`${API_BASE}/cart?userId=${userId}&productId=${productId}&quantity=${quantity}`, { method: 'POST' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const uId = parseInt(userId);
    const pId = parseInt(productId);
    const existing = db.cart.find(c => c.userId === uId && c.productId === pId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      db.cart.push({ id: Date.now(), userId: uId, productId: pId, quantity });
    }
    saveLocalDb(db);
    return { message: 'Added to cart' };
  },

  async removeFromCart(userId, productId) {
    try {
      const res = await fetch(`${API_BASE}/cart?userId=${userId}&productId=${productId}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    db.cart = db.cart.filter(c => !(c.userId === parseInt(userId) && c.productId === parseInt(productId)));
    saveLocalDb(db);
    return { message: 'Removed' };
  },

  async clearCart(userId) {
    try {
      const res = await fetch(`${API_BASE}/cart/clear?userId=${userId}`, { method: 'DELETE' });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    db.cart = db.cart.filter(c => c.userId !== parseInt(userId));
    saveLocalDb(db);
    return { message: 'Cart cleared' };
  },

  // Purchase Requests & Tracking
  async createPurchaseRequest(buyerId, requestData) {
    const trackingNum = 'TRK-RUH-' + Math.floor(100000 + Math.random() * 900000);
    const trackingPayload = {
      ...requestData,
      trackingNumber: trackingNum,
      trackingStatus: 'ORDER_PLACED',
      carrier: 'ReUseHub Green Express Local Courier',
      deliveryAddress: requestData.deliveryAddress || 'Local Area, Chennai',
      handoverOtp: Math.floor(1000 + Math.random() * 9000).toString()
    };
    try {
      const res = await fetch(`${API_BASE}/requests?buyerId=${buyerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackingPayload)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const product = db.products.find(p => p.id === parseInt(requestData.productId));
    const buyer = db.users.find(u => u.id === parseInt(buyerId));
    const nowIso = new Date().toISOString();
    const newReq = {
      id: Date.now(),
      trackingNumber: trackingNum,
      productId: product ? product.id : requestData.productId,
      productTitle: product ? product.title : 'Item',
      productPrice: product ? product.price : 0,
      buyerId: parseInt(buyerId),
      buyerName: buyer ? buyer.fullName : 'Priya Raman',
      sellerId: product ? product.sellerId : 2,
      sellerName: product ? product.sellerName : 'Karthik Sundaram',
      sellerPhone: (product && product.sellerPhone) || (product && product.sellerId === 4 ? '+91 9894123456' : '+91 9840123456'),
      buyerPhone: (buyer && buyer.phone) || '+91 9444123456',
      status: 'PENDING',
      trackingStatus: 'ORDER_PLACED',
      carrier: 'ReUseHub Green Express Local Courier',
      driverName: 'Assigned on Dispatch',
      driverPhone: '+91 94451 88291',
      pickupDate: requestData.pickupDate || new Date().toISOString().split('T')[0],
      pickupTime: requestData.pickupTime || '05:30 PM',
      shippedAt: null,
      estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
      deliveredAt: null,
      deliveryAddress: buyer ? `${buyer.address}, ${buyer.area}, ${buyer.city}` : 'Adyar, Chennai',
      pickupLocation: product ? product.pickupLocation : 'Tambaram, Chennai',
      handoverOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      buyerMessage: requestData.buyerMessage || 'Interested in this item.',
      sellerResponse: null,
      createdAt: nowIso,
      statusHistory: [
        {
          status: 'ORDER_PLACED',
          title: 'Order Request Placed',
          time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
          location: buyer ? buyer.city : 'Chennai',
          desc: 'Buyer submitted purchase request with preferred pickup timing.'
        }
      ]
    };
    db.purchaseRequests.unshift(newReq);
    saveLocalDb(db);
    return newReq;
  },

  async getTracking(query) {
    if (!query) return null;
    const cleanQ = query.toString().trim();
    try {
      const res = await fetch(`${API_BASE}/tracking/${encodeURIComponent(cleanQ)}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const order = db.purchaseRequests.find(r => matchTrackingRecord(r, cleanQ));
    return order || null;
  },

  async getAllTrackingOrders() {
    try {
      const res = await fetch(`${API_BASE}/tracking`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    return db.purchaseRequests || [];
  },

  async updateTrackingStatus(requestId, trackingStatus, notes = '', location = 'Chennai Sorting Hub') {
    try {
      const res = await fetch(`${API_BASE}/requests/${requestId}/tracking`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackingStatus, notes, location })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const reqObj = db.purchaseRequests.find(r => r.id === parseInt(requestId));
    if (reqObj) {
      reqObj.trackingStatus = trackingStatus;
      const nowStr = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      if (!reqObj.statusHistory) reqObj.statusHistory = [];
      
      if (trackingStatus === 'SHIPPED') {
        reqObj.shippedAt = new Date().toISOString();
        reqObj.status = 'ACCEPTED';
        reqObj.statusHistory.push({
          status: 'SHIPPED',
          title: 'Shipped & Out for Delivery',
          time: nowStr,
          location: location,
          desc: notes || 'Package dispatched with ReUseHub delivery agent.'
        });
      } else if (trackingStatus === 'DELIVERED') {
        reqObj.deliveredAt = new Date().toISOString();
        reqObj.status = 'COMPLETED';
        reqObj.statusHistory.push({
          status: 'DELIVERED',
          title: 'Delivered & Handover Verified',
          time: nowStr,
          location: location,
          desc: notes || 'Item successfully received by buyer. Handover OTP verified.'
        });
      } else if (trackingStatus === 'CONFIRMED') {
        reqObj.status = 'ACCEPTED';
        reqObj.statusHistory.push({
          status: 'CONFIRMED',
          title: 'Order Confirmed & Packed',
          time: nowStr,
          location: location,
          desc: notes || 'Seller verified and packed item for dispatch.'
        });
      }
      saveLocalDb(db);
    }
    return reqObj;
  },

  async getSellerRequests(sellerId) {
    try {
      const res = await fetch(`${API_BASE}/requests/seller/${sellerId}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    return db.purchaseRequests.filter(r => r.sellerId === parseInt(sellerId));
  },

  async getBuyerRequests(buyerId) {
    try {
      const res = await fetch(`${API_BASE}/requests/buyer/${buyerId}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    return db.purchaseRequests.filter(r => r.buyerId === parseInt(buyerId));
  },

  async updateRequestStatus(requestId, status, sellerResponse = '') {
    try {
      const res = await fetch(`${API_BASE}/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, sellerResponse })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const reqObj = db.purchaseRequests.find(r => r.id === parseInt(requestId));
    if (reqObj) {
      reqObj.status = status;
      if (sellerResponse) reqObj.sellerResponse = sellerResponse;
      saveLocalDb(db);
    }
    return reqObj;
  },

  // Messages
  async sendMessage(senderId, messageData) {
    try {
      const res = await fetch(`${API_BASE}/messages?senderId=${senderId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData)
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const newMsg = {
      id: Date.now(),
      senderId: parseInt(senderId),
      receiverId: parseInt(messageData.receiverId),
      productId: messageData.productId ? parseInt(messageData.productId) : null,
      messageText: messageData.messageText,
      createdAt: new Date().toISOString()
    };
    db.messages.push(newMsg);
    saveLocalDb(db);
    return newMsg;
  },

  async getConversation(user1, user2) {
    try {
      const res = await fetch(`${API_BASE}/messages/conversation?user1=${user1}&user2=${user2}`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const u1 = parseInt(user1);
    const u2 = parseInt(user2);
    return db.messages.filter(m =>
      (m.senderId === u1 && m.receiverId === u2) ||
      (m.senderId === u2 && m.receiverId === u1)
    );
  },

  // Admin
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    return {
      totalUsers: db.users.length,
      totalProducts: db.products.length,
      totalDonations: db.products.filter(p => p.isDonation).length,
      totalCompleted: db.purchaseRequests.filter(r => r.status === 'COMPLETED' || r.status === 'ACCEPTED').length,
      wasteSavedKg: (db.products.length * 5.2).toFixed(1),
      co2PreventedKg: (db.products.length * 14.8).toFixed(1),
      waterConservedLiters: (db.products.length * 1820).toLocaleString()
    };
  },

  async getAdminUsers() {
    try {
      const res = await fetch(`${API_BASE}/admin/users`);
      if (res.ok) return await res.json();
    } catch (e) {}
    return getLocalDb().users;
  },

  async updateAdminUserStatus(userId, status) {
    try {
      const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch (e) {}

    const db = getLocalDb();
    const u = db.users.find(item => item.id === parseInt(userId));
    if (u) {
      u.status = status;
      saveLocalDb(db);
    }
    return u;
  }
};

window.api = api;
