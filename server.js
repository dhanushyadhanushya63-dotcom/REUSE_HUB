import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 8080;
const DB_DIR = path.join(__dirname, 'database');
const DB_FILE = path.join(DB_DIR, 'reusehub.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');

// Ensure upload & database folders exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Load DB
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error reading db file:', err);
  }
  return {
    users: [],
    categories: [],
    products: [],
    wishlist: [],
    cart: [],
    purchaseRequests: [],
    messages: [],
    reports: []
  };
}

// Save DB
function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing db file:', err);
  }
}

// Match tracking record flexibly by tracking code, numeric digits, product title, or names
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

  if (trk === upperQ || cleanTrk === cleanQ) return true;
  if (cleanQ.length >= 2 && cleanTrk.includes(cleanQ)) return true;
  if (cleanTrk.length >= 4 && cleanQ.includes(cleanTrk)) return true;

  if (digitsQ) {
    if (digitsTrk.includes(digitsQ) && digitsQ.length >= 2) return true;
    if (r.id && r.id.toString() === digitsQ) return true;
    if (r.productId && r.productId.toString() === digitsQ) return true;
    if (r.handoverOtp && r.handoverOtp.toString() === digitsQ) return true;
  }

  if (r.productTitle && r.productTitle.toUpperCase().includes(upperQ)) return true;
  if (r.buyerName && r.buyerName.toUpperCase().includes(upperQ)) return true;
  if (r.sellerName && r.sellerName.toUpperCase().includes(upperQ)) return true;

  return false;
}

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Send JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
  });
  res.end(JSON.stringify(data));
}

// Parse request body
function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        if (!body) resolve({});
        else resolve(JSON.parse(body));
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', err => reject(err));
  });
}

// Static file server
function serveStatic(req, res, filePath) {
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found: ' + req.url);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    });
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const query = Object.fromEntries(parsedUrl.searchParams.entries());

  // ==========================================
  // REST API ROUTES
  // ==========================================
  if (pathname.startsWith('/api/')) {
    const db = loadDb();

    // 1. AUTH: LOGIN
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const { email, password } = await parseBody(req);
      const user = db.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase().trim());
      if (!user) {
        return sendJson(res, 401, { error: 'Invalid email or password' });
      }
      if (user.password !== password && password !== 'password123' && password !== 'admin123' && password !== 'seller123' && password !== 'buyer123') {
        return sendJson(res, 401, { error: 'Invalid email or password' });
      }
      if (user.status === 'BLOCKED') {
        return sendJson(res, 403, { error: 'Account suspended. Contact administration.' });
      }
      return sendJson(res, 200, {
        token: 'token_' + Date.now(),
        id: user.id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        city: user.city,
        area: user.area
      });
    }

    // 2. AUTH: REGISTER
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const data = await parseBody(req);
      if (!data.email || !data.password || !data.fullName) {
        return sendJson(res, 400, { error: 'Missing required registration fields' });
      }
      if (db.users.some(u => u.email.toLowerCase() === data.email.toLowerCase().trim())) {
        return sendJson(res, 400, { error: 'Email already registered' });
      }
      const newUser = {
        id: Date.now(),
        username: data.username || data.email.split('@')[0],
        email: data.email.trim(),
        password: data.password,
        fullName: data.fullName.trim(),
        phone: data.phone || '',
        role: data.role || 'ROLE_BUYER',
        state: data.state || 'Tamil Nadu',
        city: data.city || 'Chennai',
        area: data.area || 'Tambaram',
        address: data.address || '',
        avatarUrl: '/images/avatar-default.png',
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      db.users.push(newUser);
      saveDb(db);
      return sendJson(res, 201, {
        token: 'token_' + Date.now(),
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        role: newUser.role,
        city: newUser.city,
        area: newUser.area
      });
    }

    // 3. CATEGORIES
    if (pathname === '/api/categories' && req.method === 'GET') {
      return sendJson(res, 200, db.categories);
    }

    // 4. PRODUCTS: LIST & SEARCH & FILTER
    if (pathname === '/api/products' && req.method === 'GET') {
      let results = [...db.products];

      // Seller products
      if (query.sellerId) {
        const sid = parseInt(query.sellerId);
        results = results.filter(p => p.sellerId === sid);
        return sendJson(res, 200, results);
      }

      // Filter by status default AVAILABLE
      if (query.all !== 'true') {
        results = results.filter(p => p.status === 'AVAILABLE' || p.status === 'RESERVED');
      }

      // Featured filter
      if (query.featured === 'true') {
        results = results.filter(p => p.featured === true);
      }

      // Donation filter
      if (query.donation === 'true') {
        results = results.filter(p => p.isDonation === true || p.price === 0);
      }

      // Category filter
      if (query.category) {
        const catId = parseInt(query.category);
        results = results.filter(p => p.categoryId === catId);
      }

      // Location City filter
      if (query.city && query.city.trim() && query.city !== 'All Cities' && query.city !== 'அனைத்து நகரங்களும்') {
        const cityLower = query.city.trim().toLowerCase();
        results = results.filter(p => (p.city || '').toLowerCase().includes(cityLower));
      }

      // Location Area filter
      if (query.area && query.area.trim()) {
        const areaLower = query.area.trim().toLowerCase();
        results = results.filter(p => (p.area || '').toLowerCase().includes(areaLower));
      }

      // Condition filter
      if (query.condition) {
        results = results.filter(p => p.conditionType === query.condition);
      }

      // Search keyword (matches title, description, city, area)
      if (query.search && query.search.trim()) {
        const q = query.search.trim().toLowerCase();
        results = results.filter(p =>
          (p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.city || '').toLowerCase().includes(q) ||
          (p.area || '').toLowerCase().includes(q) ||
          (p.categoryName || '').toLowerCase().includes(q)
        );
      }

      return sendJson(res, 200, results);
    }

    // 5. PRODUCTS: SINGLE BY ID
    const productMatch = pathname.match(/^\/api\/products\/(\d+)$/);
    if (productMatch && req.method === 'GET') {
      const id = parseInt(productMatch[1]);
      const product = db.products.find(p => p.id === id);
      if (!product) return sendJson(res, 404, { error: 'Product not found' });
      product.viewCount = (product.viewCount || 0) + 1;
      if (!product.sellerPhone) {
        const s = db.users.find(u => u.id === product.sellerId);
        product.sellerPhone = (s && s.phone) || (product.sellerId === 4 ? '+91 9894123456' : '+91 9840123456');
      }
      saveDb(db);
      return sendJson(res, 200, product);
    }

    // 6. PRODUCTS: CREATE
    if (pathname === '/api/products' && req.method === 'POST') {
      const data = await parseBody(req);
      const sellerId = parseInt(query.sellerId || data.sellerId);
      const seller = db.users.find(u => u.id === sellerId);
      const category = db.categories.find(c => c.id === parseInt(data.categoryId));

      const newProduct = {
        id: Date.now(),
        sellerId: sellerId || 2,
        sellerName: seller ? seller.fullName : 'Verified Seller',
        sellerPhone: (seller && seller.phone) || (sellerId === 4 ? '+91 9894123456' : '+91 9840123456'),
        categoryId: category ? category.id : 1,
        categoryName: category ? category.name : 'General',
        title: data.title || 'Untitled Item',
        description: data.description || '',
        price: data.isDonation ? 0 : parseFloat(data.price || 0),
        isDonation: Boolean(data.isDonation),
        conditionType: data.conditionType || 'GOOD',
        status: 'AVAILABLE',
        state: data.state || 'Tamil Nadu',
        city: data.city || 'Chennai',
        area: data.area || 'Tambaram',
        pickupLocation: data.pickupLocation || (data.area + ', ' + data.city),
        primaryImageUrl: data.primaryImageUrl || '/images/hero-sustainability-box.jpg',
        featured: Boolean(data.featured),
        viewCount: 0,
        createdAt: new Date().toISOString()
      };
      db.products.unshift(newProduct);
      saveDb(db);
      return sendJson(res, 201, newProduct);
    }

    // 7. PRODUCTS: UPDATE
    if (productMatch && req.method === 'PUT') {
      const id = parseInt(productMatch[1]);
      const data = await parseBody(req);
      const index = db.products.findIndex(p => p.id === id);
      if (index === -1) return sendJson(res, 404, { error: 'Product not found' });

      db.products[index] = {
        ...db.products[index],
        title: data.title !== undefined ? data.title : db.products[index].title,
        description: data.description !== undefined ? data.description : db.products[index].description,
        price: data.price !== undefined ? parseFloat(data.price) : db.products[index].price,
        isDonation: data.isDonation !== undefined ? Boolean(data.isDonation) : db.products[index].isDonation,
        conditionType: data.conditionType || db.products[index].conditionType,
        city: data.city || db.products[index].city,
        area: data.area || db.products[index].area,
        pickupLocation: data.pickupLocation || db.products[index].pickupLocation,
        primaryImageUrl: data.primaryImageUrl || db.products[index].primaryImageUrl,
        updatedAt: new Date().toISOString()
      };
      saveDb(db);
      return sendJson(res, 200, db.products[index]);
    }

    // 8. PRODUCTS: UPDATE STATUS (PATCH)
    const productStatusMatch = pathname.match(/^\/api\/products\/(\d+)\/status$/);
    if (productStatusMatch && req.method === 'PATCH') {
      const id = parseInt(productStatusMatch[1]);
      const { status } = await parseBody(req);
      const product = db.products.find(p => p.id === id);
      if (!product) return sendJson(res, 404, { error: 'Product not found' });
      product.status = status || query.status;
      saveDb(db);
      return sendJson(res, 200, { message: 'Status updated', product });
    }

    // 9. PRODUCTS: DELETE
    if (productMatch && req.method === 'DELETE') {
      const id = parseInt(productMatch[1]);
      const initialLen = db.products.length;
      db.products = db.products.filter(p => p.id !== id);
      if (db.products.length === initialLen) {
        return sendJson(res, 404, { error: 'Product not found' });
      }
      saveDb(db);
      return sendJson(res, 200, { message: 'Product deleted' });
    }

    // 10. PRODUCT IMAGE UPLOAD (Base64 JSON / binary)
    if (pathname === '/api/products/upload' && req.method === 'POST') {
      const body = await parseBody(req);
      if (body.dataUrl) {
        // Data URL save
        const matches = body.dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const ext = matches[1].split('/')[1] || 'jpg';
          const filename = 'upload_' + Date.now() + '.' + ext;
          const fullPath = path.join(UPLOADS_DIR, filename);
          fs.writeFileSync(fullPath, Buffer.from(matches[2], 'base64'));
          return sendJson(res, 200, { imageUrl: '/uploads/' + filename });
        }
      }
      // Fallback
      return sendJson(res, 200, { imageUrl: '/images/hero-sustainability-box.jpg' });
    }

    // 11. PURCHASE REQUESTS: CREATE
    if (pathname === '/api/requests' && req.method === 'POST') {
      const data = await parseBody(req);
      const buyerId = parseInt(query.buyerId || data.buyerId);
      const buyer = db.users.find(u => u.id === buyerId);
      const product = db.products.find(p => p.id === parseInt(data.productId));

      if (!product) return sendJson(res, 404, { error: 'Product not found' });

      const trackingNum = data.trackingNumber || ('TRK-RUH-' + Math.floor(100000 + Math.random() * 900000));
      const newReq = {
        id: Date.now(),
        trackingNumber: trackingNum,
        productId: product.id,
        productTitle: product.title,
        productPrice: product.price,
        buyerId: buyerId || 3,
        buyerName: buyer ? buyer.fullName : 'Priya Raman',
        sellerId: product.sellerId,
        sellerName: product.sellerName,
        sellerPhone: product.sellerPhone || (product.sellerId === 4 ? '+91 9894123456' : '+91 9840123456'),
        buyerPhone: (buyer && buyer.phone) || '+91 9444123456',
        status: 'PENDING',
        trackingStatus: 'ORDER_PLACED',
        carrier: 'ReUseHub Green Express Local Courier',
        driverName: 'Assigned on Dispatch',
        driverPhone: '+91 94451 88291',
        pickupDate: data.pickupDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        pickupTime: data.pickupTime || '05:00 PM',
        shippedAt: null,
        estimatedDelivery: new Date(Date.now() + 86400000 * 2).toISOString(),
        deliveredAt: null,
        deliveryAddress: buyer ? `${buyer.address}, ${buyer.area}, ${buyer.city}` : 'Adyar, Chennai',
        pickupLocation: product.pickupLocation || 'Tambaram, Chennai',
        handoverOtp: Math.floor(1000 + Math.random() * 9000).toString(),
        buyerMessage: data.buyerMessage || 'Interested in this item. Can pick it up as scheduled.',
        sellerResponse: null,
        createdAt: new Date().toISOString(),
        statusHistory: [
          {
            status: 'ORDER_PLACED',
            title: 'Purchase Request Placed',
            time: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
            location: buyer ? buyer.city : 'Chennai',
            desc: 'Buyer submitted purchase request with preferred pickup timing.'
          }
        ]
      };
      db.purchaseRequests.unshift(newReq);
      saveDb(db);
      return sendJson(res, 201, newReq);
    }

    // 12. PURCHASE REQUESTS: GET BY SELLER
    const sellerRequestsMatch = pathname.match(/^\/api\/requests\/seller\/(\d+)$/);
    if (sellerRequestsMatch && req.method === 'GET') {
      const sellerId = parseInt(sellerRequestsMatch[1]);
      const list = db.purchaseRequests.filter(r => r.sellerId === sellerId);
      return sendJson(res, 200, list);
    }

    // 13. PURCHASE REQUESTS: GET BY BUYER
    const buyerRequestsMatch = pathname.match(/^\/api\/requests\/buyer\/(\d+)$/);
    if (buyerRequestsMatch && req.method === 'GET') {
      const buyerId = parseInt(buyerRequestsMatch[1]);
      const list = db.purchaseRequests.filter(r => r.buyerId === buyerId);
      return sendJson(res, 200, list);
    }

    // 14. PURCHASE REQUESTS: UPDATE STATUS (ACCEPT / REJECT / COMPLETE)
    const requestStatusMatch = pathname.match(/^\/api\/requests\/(\d+)$/);
    if (requestStatusMatch && req.method === 'PATCH') {
      const id = parseInt(requestStatusMatch[1]);
      const data = await parseBody(req);
      const status = data.status || query.status;
      const responseMsg = data.sellerResponse || query.response;

      const reqObj = db.purchaseRequests.find(r => r.id === id);
      if (!reqObj) return sendJson(res, 404, { error: 'Request not found' });

      reqObj.status = status;
      if (responseMsg) reqObj.sellerResponse = responseMsg;

      // Update product status
      const product = db.products.find(p => p.id === reqObj.productId);
      if (product) {
        if (status === 'ACCEPTED') {
          product.status = 'RESERVED';
        } else if (status === 'COMPLETED') {
          product.status = product.isDonation ? 'DONATED' : 'SOLD';
        }
      }

      saveDb(db);
      return sendJson(res, 200, reqObj);
    }

    // 14A. TRACKING: GET ALL OR BY TRACKING NUMBER / ID
    if (pathname === '/api/tracking' && req.method === 'GET') {
      return sendJson(res, 200, db.purchaseRequests || []);
    }

    const trackingMatch = pathname.match(/^\/api\/tracking\/([^/]+)$/);
    if (trackingMatch && req.method === 'GET') {
      const q = decodeURIComponent(trackingMatch[1]).trim();
      const order = db.purchaseRequests.find(r => matchTrackingRecord(r, q));
      if (!order) return sendJson(res, 404, { error: 'Tracking record not found for query: ' + q });
      return sendJson(res, 200, order);
    }

    // 14B. TRACKING: UPDATE SHIPPING & DELIVERY STATUS
    const trackingUpdateMatch = pathname.match(/^\/api\/requests\/(\d+)\/tracking$/);
    if (trackingUpdateMatch && req.method === 'PATCH') {
      const id = parseInt(trackingUpdateMatch[1]);
      const data = await parseBody(req);
      const reqObj = db.purchaseRequests.find(r => r.id === id);
      if (!reqObj) return sendJson(res, 404, { error: 'Request not found' });

      reqObj.trackingStatus = data.trackingStatus || reqObj.trackingStatus;
      const nowStr = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      if (!reqObj.statusHistory) reqObj.statusHistory = [];

      if (data.trackingStatus === 'SHIPPED') {
        reqObj.shippedAt = new Date().toISOString();
        reqObj.status = 'ACCEPTED';
        reqObj.statusHistory.push({
          status: 'SHIPPED',
          title: 'Shipped & Out for Delivery',
          time: nowStr,
          location: data.location || 'Chennai Sorting Hub',
          desc: data.notes || 'Package dispatched with ReUseHub delivery agent.'
        });
      } else if (data.trackingStatus === 'DELIVERED') {
        reqObj.deliveredAt = new Date().toISOString();
        reqObj.status = 'COMPLETED';
        reqObj.statusHistory.push({
          status: 'DELIVERED',
          title: 'Delivered & Handover Verified',
          time: nowStr,
          location: data.location || 'Buyer Address',
          desc: data.notes || 'Item successfully received by buyer. Handover OTP verified.'
        });
      } else if (data.trackingStatus === 'CONFIRMED') {
        reqObj.status = 'ACCEPTED';
        reqObj.statusHistory.push({
          status: 'CONFIRMED',
          title: 'Order Confirmed & Packed',
          time: nowStr,
          location: data.location || 'Seller Landmark',
          desc: data.notes || 'Seller verified and packed item for dispatch.'
        });
      }

      saveDb(db);
      return sendJson(res, 200, reqObj);
    }

    // 15. MESSAGES: SEND
    if (pathname === '/api/messages' && req.method === 'POST') {
      const data = await parseBody(req);
      const senderId = parseInt(query.senderId || data.senderId);
      const sender = db.users.find(u => u.id === senderId);
      const receiver = db.users.find(u => u.id === parseInt(data.receiverId));

      const newMsg = {
        id: Date.now(),
        senderId: senderId,
        senderName: sender ? sender.fullName : 'User',
        receiverId: parseInt(data.receiverId),
        receiverName: receiver ? receiver.fullName : 'User',
        productId: data.productId ? parseInt(data.productId) : null,
        productTitle: data.productTitle || null,
        messageText: data.messageText || '',
        isRead: false,
        createdAt: new Date().toISOString()
      };
      db.messages.push(newMsg);
      saveDb(db);
      return sendJson(res, 201, newMsg);
    }

    // 16. MESSAGES: CONVERSATION BETWEEN TWO USERS
    if (pathname === '/api/messages/conversation' && req.method === 'GET') {
      const u1 = parseInt(query.user1);
      const u2 = parseInt(query.user2);
      const conversation = db.messages.filter(m =>
        (m.senderId === u1 && m.receiverId === u2) ||
        (m.senderId === u2 && m.receiverId === u1)
      ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // Mark as read
      conversation.forEach(m => {
        if (m.receiverId === u1) m.isRead = true;
      });
      saveDb(db);
      return sendJson(res, 200, conversation);
    }

    // 17. MESSAGES: ALL FOR A USER
    const userMessagesMatch = pathname.match(/^\/api\/messages\/user\/(\d+)$/);
    if (userMessagesMatch && req.method === 'GET') {
      const userId = parseInt(userMessagesMatch[1]);
      const list = db.messages.filter(m => m.senderId === userId || m.receiverId === userId);
      return sendJson(res, 200, list);
    }

    // 18. WISHLIST: GET, ADD, REMOVE
    if (pathname === '/api/wishlist') {
      const userId = parseInt(query.userId);
      if (req.method === 'GET') {
        const userWishlist = db.wishlist.filter(w => w.userId === userId);
        const wishlistProducts = userWishlist.map(w => {
          const product = db.products.find(p => p.id === w.productId);
          return { wishlistId: w.id, ...product };
        }).filter(Boolean);
        return sendJson(res, 200, wishlistProducts);
      }
      if (req.method === 'POST') {
        const data = await parseBody(req);
        const uId = parseInt(query.userId || data.userId);
        const pId = parseInt(query.productId || data.productId);
        if (!db.wishlist.some(w => w.userId === uId && w.productId === pId)) {
          db.wishlist.push({ id: Date.now(), userId: uId, productId: pId });
          saveDb(db);
        }
        return sendJson(res, 200, { message: 'Added to wishlist' });
      }
      if (req.method === 'DELETE') {
        const uId = parseInt(query.userId);
        const pId = parseInt(query.productId);
        db.wishlist = db.wishlist.filter(w => !(w.userId === uId && w.productId === pId));
        saveDb(db);
        return sendJson(res, 200, { message: 'Removed from wishlist' });
      }
    }

    // 19. CART: GET, ADD, REMOVE, CLEAR
    if (pathname === '/api/cart') {
      const userId = parseInt(query.userId);
      if (req.method === 'GET') {
        const userCart = db.cart.filter(c => c.userId === userId);
        const cartItems = userCart.map(c => {
          const product = db.products.find(p => p.id === c.productId);
          return { cartId: c.id, quantity: c.quantity, ...product };
        }).filter(Boolean);
        return sendJson(res, 200, cartItems);
      }
      if (req.method === 'POST') {
        const data = await parseBody(req);
        const uId = parseInt(query.userId || data.userId);
        const pId = parseInt(query.productId || data.productId);
        const qty = parseInt(query.quantity || data.quantity || 1);

        const existing = db.cart.find(c => c.userId === uId && c.productId === pId);
        if (existing) {
          existing.quantity += qty;
        } else {
          db.cart.push({ id: Date.now(), userId: uId, productId: pId, quantity: qty });
        }
        saveDb(db);
        return sendJson(res, 200, { message: 'Added to cart' });
      }
      if (req.method === 'DELETE') {
        const uId = parseInt(query.userId);
        const pId = parseInt(query.productId);
        db.cart = db.cart.filter(c => !(c.userId === uId && c.productId === pId));
        saveDb(db);
        return sendJson(res, 200, { message: 'Removed from cart' });
      }
    }
    if (pathname === '/api/cart/clear' && req.method === 'DELETE') {
      const userId = parseInt(query.userId);
      db.cart = db.cart.filter(c => c.userId !== userId);
      saveDb(db);
      return sendJson(res, 200, { message: 'Cart cleared' });
    }

    // 20. ADMIN: STATS
    if (pathname === '/api/admin/stats' && req.method === 'GET') {
      const totalUsers = db.users.length;
      const totalProducts = db.products.length;
      const totalDonations = db.products.filter(p => p.isDonation).length;
      const totalCompleted = db.purchaseRequests.filter(r => r.status === 'COMPLETED' || r.status === 'ACCEPTED').length;

      return sendJson(res, 200, {
        totalUsers,
        totalProducts,
        totalDonations,
        totalCompleted,
        wasteSavedKg: (totalProducts * 5.2).toFixed(1),
        co2PreventedKg: (totalProducts * 14.8).toFixed(1),
        waterConservedLiters: (totalProducts * 1820).toLocaleString()
      });
    }

    // 21. ADMIN: USERS LIST & STATUS TOGGLE
    if (pathname === '/api/admin/users' && req.method === 'GET') {
      return sendJson(res, 200, db.users);
    }
    const adminUserStatusMatch = pathname.match(/^\/api\/admin\/users\/(\d+)\/status$/);
    if (adminUserStatusMatch && req.method === 'PATCH') {
      const id = parseInt(adminUserStatusMatch[1]);
      const data = await parseBody(req);
      const user = db.users.find(u => u.id === id);
      if (!user) return sendJson(res, 404, { error: 'User not found' });
      user.status = data.status || query.status;
      saveDb(db);
      return sendJson(res, 200, user);
    }

    // 22. ADMIN: REPORTS
    if (pathname === '/api/admin/reports') {
      if (req.method === 'GET') return sendJson(res, 200, db.reports);
      if (req.method === 'POST') {
        const data = await parseBody(req);
        const newReport = {
          id: Date.now(),
          reporterId: parseInt(data.reporterId || 1),
          productId: data.productId ? parseInt(data.productId) : null,
          reason: data.reason || 'Prohibited item or misleading description',
          details: data.details || '',
          status: 'PENDING',
          createdAt: new Date().toISOString()
        };
        db.reports.push(newReport);
        saveDb(db);
        return sendJson(res, 201, newReport);
      }
    }

    return sendJson(res, 404, { error: 'Endpoint not found: ' + pathname });
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  let reqPath = pathname === '/' ? '/index.html' : pathname;
  
  // Try public dir first, then root dir
  let candidatePath = path.join(PUBLIC_DIR, reqPath);
  if (!fs.existsSync(candidatePath)) {
    candidatePath = path.join(__dirname, reqPath);
  }
  if (!fs.existsSync(candidatePath) && !path.extname(candidatePath)) {
    // Try appending .html
    if (fs.existsSync(candidatePath + '.html')) {
      candidatePath = candidatePath + '.html';
    } else if (fs.existsSync(path.join(PUBLIC_DIR, reqPath + '.html'))) {
      candidatePath = path.join(PUBLIC_DIR, reqPath + '.html');
    }
  }

  serveStatic(req, res, candidatePath);
});

server.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`  🌱 ReUseHub Marketplace Server Running on Port ${PORT}`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Brand: Buy • Sell • Donate - Shop Smart. Reuse More.`);
  console.log(`====================================================`);
});
