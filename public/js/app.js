// ReUseHub Main Client Application Logic

function getCleanImg(url) {
  if (!url) return 'images/hero-sustainability-box.jpg';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return url.replace(/^\/+/, '');
}
window.getCleanImg = getCleanImg;

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize
  await loadCategories();
  await loadFeaturedProducts();
  setupEventListeners();

  // Listen for auth changes
  window.addEventListener('authChanged', () => {
    loadFeaturedProducts();
  });
});

let currentProducts = [];
let allCategories = [];
let selectedCategory = null;
let selectedCity = '';
let selectedArea = '';

// Load Categories
async function loadCategories() {
  try {
    allCategories = await window.api.getCategories();
    renderCategories();
    populateCategoryDropdowns();
  } catch (err) {
    console.error('Failed to load categories', err);
  }
}

function renderCategories() {
  const container = document.getElementById('categories-container');
  if (!container) return;

  container.innerHTML = allCategories.map(cat => `
    <div class="col-6 col-md-3 col-lg-3 mb-4">
      <div class="category-card ${selectedCategory === cat.id ? 'active' : ''}" onclick="filterByCategory(${cat.id})">
        <div class="category-icon-circle">
          <i class="bi ${cat.icon}"></i>
        </div>
        <div class="category-name">${cat.name}</div>
      </div>
    </div>
  `).join('');
}

function populateCategoryDropdowns() {
  const dropdown = document.getElementById('hero-category-select');
  if (!dropdown) return;

  dropdown.innerHTML = `<option value="">${window.i18n.t('allCategories')}</option>` +
    allCategories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

// Load Featured Products (5 in a single row on desktop)
async function loadFeaturedProducts() {
  try {
    currentProducts = await window.api.getProducts({ featured: 'true' });
    renderFeaturedProducts();
  } catch (err) {
    console.error('Failed to load products', err);
  }
}

function renderFeaturedProducts() {
  const container = document.getElementById('featured-products-grid');
  if (!container) return;

  const lang = window.i18n.getLang();
  const user = window.auth.getUser();

  // If no products returned
  if (!currentProducts || currentProducts.length === 0) {
    container.innerHTML = `
      <div class="col-12 text-center py-5">
        <i class="bi bi-box-seam fs-1 text-muted"></i>
        <h5 class="mt-3">No products found matching your criteria</h5>
        <button class="btn btn-primary-green btn-sm mt-2" onclick="resetFilters()">View All Products</button>
      </div>
    `;
    return;
  }

  // Display products
  container.innerHTML = currentProducts.map(product => {
    const isFree = product.isDonation || product.price === 0;
    const formattedPrice = isFree 
      ? `<span class="badge bg-danger">${window.i18n.t('freeDonationBadge')}</span>` 
      : `₹${Number(product.price).toLocaleString('en-IN')}`;

    const conditionBadgeClass = {
      'LIKE_NEW': 'badge-like-new',
      'GOOD': 'badge-good',
      'USED': 'badge-used',
      'FAIR': 'badge-fair'
    }[product.conditionType] || 'badge-good';

    const conditionLabel = {
      'LIKE_NEW': window.i18n.t('conditionLikeNew'),
      'GOOD': window.i18n.t('conditionGood'),
      'USED': window.i18n.t('conditionUsed'),
      'FAIR': window.i18n.t('conditionFair')
    }[product.conditionType] || product.conditionType;

    return `
      <div class="product-card">
        <div class="product-img-wrap" onclick="openProductModal(${product.id})">
          <img src="${getCleanImg(product.primaryImageUrl)}" alt="${product.title}" loading="lazy" onerror="this.src='images/hero-sustainability-box.jpg'">
          <span class="product-condition-badge ${conditionBadgeClass}">${conditionLabel}</span>
          <button class="product-wishlist-btn" onclick="event.stopPropagation(); toggleWishlist(${product.id})" title="Save to Wishlist">
            <i class="bi bi-heart"></i>
          </button>
        </div>
        <div class="product-content">
          <div class="product-category-location">
            <span><i class="bi bi-tag text-success me-1"></i>${product.categoryName}</span>
            <span><i class="bi bi-geo-alt-fill text-danger me-1"></i>${product.area}, ${product.city}</span>
          </div>
          <h5 class="product-title" onclick="openProductModal(${product.id})" title="${product.title}">
            ${product.title}
          </h5>
          <div class="product-price-row">
            <div class="product-price ${isFree ? 'free' : ''}">${formattedPrice}</div>
            <span class="small text-muted"><i class="bi bi-eye me-1"></i>${product.viewCount || 0}</span>
          </div>
          <div class="product-actions-row">
            <button class="btn-add-cart" onclick="addToCart(${product.id})">
              <i class="bi bi-cart-plus"></i>
              <span>${window.i18n.t('addToCart')}</span>
            </button>
            <button class="btn-quick-view" onclick="openProductModal(${product.id})" title="${window.i18n.t('viewDetails')}">
              <i class="bi bi-eye"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category filter
window.filterByCategory = async function(catId) {
  if (selectedCategory === catId) {
    selectedCategory = null;
  } else {
    selectedCategory = catId;
  }
  renderCategories();
  await applyFilters();

  // Scroll smoothly to products section
  const el = document.getElementById('featured-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};

// City filter
window.filterByCity = async function(cityName) {
  selectedCity = cityName;
  document.querySelectorAll('.city-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.city === cityName);
  });
  await applyFilters();
};

// Area search filter
window.filterByArea = async function(areaName) {
  selectedArea = areaName;
  await applyFilters();
};

async function applyFilters() {
  const params = {};
  if (selectedCategory) params.category = selectedCategory;
  if (selectedCity && selectedCity !== 'All' && selectedCity !== 'All Cities') params.city = selectedCity;
  if (selectedArea) params.area = selectedArea;

  const searchInput = document.getElementById('hero-search-input');
  if (searchInput && searchInput.value.trim()) {
    params.search = searchInput.value.trim();
  }

  currentProducts = await window.api.getProducts(params);
  renderFeaturedProducts();
}

window.resetFilters = async function() {
  selectedCategory = null;
  selectedCity = '';
  selectedArea = '';
  const searchInput = document.getElementById('hero-search-input');
  if (searchInput) searchInput.value = '';
  const catSelect = document.getElementById('hero-category-select');
  if (catSelect) catSelect.value = '';
  document.querySelectorAll('.city-pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.city === 'All' || btn.dataset.city === 'All Cities');
  });
  renderCategories();
  await loadFeaturedProducts();
};

// Wishlist Toggle
window.toggleWishlist = async function(productId) {
  const user = window.auth.getUser();
  if (!user) {
    window.showToast('Please login to save to wishlist', 'error');
    return;
  }
  try {
    const res = await window.api.addToWishlist(user.id, productId);
    window.showToast(res.message || 'Saved to Wishlist!');
    window.auth.refreshBadges();
  } catch (err) {
    window.showToast('Wishlist action failed', 'error');
  }
};

// Add to Cart
window.addToCart = async function(productId) {
  const user = window.auth.getUser();
  if (!user) {
    window.showToast('Please login to add items to cart', 'error');
    return;
  }
  try {
    const res = await window.api.addToCart(user.id, productId, 1);
    window.showToast('Item added to Shopping Cart!');
    window.auth.refreshBadges();
  } catch (err) {
    window.showToast('Failed to add to cart', 'error');
  }
};

// Open Product Quick View Modal
window.openProductModal = async function(productId) {
  try {
    const product = await window.api.getProductById(productId);
    if (!product) return;

    const modalTitle = document.getElementById('productModalTitle');
    const modalBody = document.getElementById('productModalBody');

    if (modalTitle) modalTitle.textContent = product.title;

    const isFree = product.isDonation || product.price === 0;
    const formattedPrice = isFree 
      ? `<span class="badge bg-danger fs-5">${window.i18n.t('freeDonationBadge')}</span>` 
      : `₹${Number(product.price).toLocaleString('en-IN')}`;

    if (modalBody) {
      modalBody.innerHTML = `
        <div class="row g-4">
          <div class="col-md-6">
            <div class="border rounded-3 overflow-hidden shadow-sm bg-light">
              <img src="${getCleanImg(product.primaryImageUrl)}" class="img-fluid w-100" style="max-height: 380px; object-fit: cover;" alt="${product.title}" onerror="this.src='images/hero-sustainability-box.jpg'">
            </div>
            <div class="d-flex align-items-center justify-content-between mt-3 p-2 bg-light rounded-2 border">
              <div>
                <small class="text-muted d-block">${window.i18n.t('conditionLabel')}</small>
                <span class="badge bg-success">${product.conditionType}</span>
              </div>
              <div>
                <small class="text-muted d-block">Status</small>
                <span class="badge ${product.status === 'AVAILABLE' ? 'bg-primary' : 'bg-secondary'}">${product.status}</span>
              </div>
              <div>
                <small class="text-muted d-block">Category</small>
                <span class="fw-bold">${product.categoryName}</span>
              </div>
            </div>
          </div>
          <div class="col-md-6 d-flex flex-direction-column justify-content-between">
            <div>
              <div class="d-flex align-items-center justify-content-between mb-2">
                <div class="fs-3 fw-bold text-success">${formattedPrice}</div>
                <span class="text-muted small"><i class="bi bi-clock me-1"></i>Listed recently</span>
              </div>

              <h6 class="fw-bold mb-2">${window.i18n.t('descriptionLabel')}</h6>
              <p class="text-muted small mb-4" style="line-height: 1.6;">${product.description}</p>

              <!-- Location Feature Highlight Box -->
              <div class="p-3 bg-light rounded-3 border mb-3">
                <div class="d-flex align-items-center gap-2 mb-1 text-success fw-bold">
                  <i class="bi bi-geo-alt-fill text-danger fs-5"></i>
                  <span>${window.i18n.t('pickupLocationLabel')}</span>
                </div>
                <div class="fw-semibold text-dark">${product.pickupLocation}</div>
                <div class="small text-muted mt-1">
                  <i class="bi bi-pin-map me-1"></i>${product.area}, ${product.city}, ${product.state}
                </div>
              </div>

              <!-- Seller Information -->
              <div class="d-flex align-items-center gap-3 p-2 bg-white rounded-3 border mb-4">
                <div class="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style="width: 44px; height: 44px; font-size: 1.2rem;">
                  <i class="bi bi-person-check-fill"></i>
                </div>
                <div>
                  <div class="fw-bold text-dark">${product.sellerName || 'Verified Seller'}</div>
                  <div class="small text-success"><i class="bi bi-patch-check-fill me-1"></i>Verified Local Community Member</div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="d-flex gap-2">
              <button class="btn btn-primary-green flex-grow-1" onclick="openRequestModal(${product.id}, '${product.title.replace(/'/g, "\\'")}', ${product.price}, ${product.sellerId})">
                <i class="bi bi-send-check"></i>
                <span>${window.i18n.t('buyNow')}</span>
              </button>
              <button class="btn btn-outline-success" onclick="openChatModal(${product.sellerId}, '${product.sellerName}', ${product.id}, '${product.title.replace(/'/g, "\\'")}')" title="Chat with Seller">
                <i class="bi bi-chat-dots-fill"></i>
              </button>
              <button class="btn btn-light border" onclick="addToCart(${product.id})" title="Add to Cart">
                <i class="bi bi-cart-plus fs-5 text-success"></i>
              </button>
            </div>
          </div>
        </div>
      `;

      const modalEl = document.getElementById('productDetailModal');
      const bsModal = new bootstrap.Modal(modalEl);
      bsModal.show();
    }
  } catch (err) {
    console.error('Error opening product modal', err);
  }
};

// Purchase Request Modal
window.openRequestModal = function(productId, title, price, sellerId) {
  const reqModalEl = document.getElementById('purchaseRequestModal');
  if (!reqModalEl) return;

  document.getElementById('reqProductId').value = productId;
  document.getElementById('reqProductTitle').textContent = title;
  document.getElementById('reqProductPrice').textContent = price === 0 ? 'FREE / DONATION' : '₹' + price;
  document.getElementById('reqSellerId').value = sellerId;

  // Set default tomorrow date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateInput = document.getElementById('reqPickupDate');
  if (dateInput) dateInput.value = tomorrow.toISOString().split('T')[0];

  const bsModal = new bootstrap.Modal(reqModalEl);
  bsModal.show();
};

window.submitPurchaseRequest = async function(event) {
  event.preventDefault();
  const user = window.auth.getUser();
  if (!user) {
    window.showToast('Please login to send request', 'error');
    return;
  }

  const productId = parseInt(document.getElementById('reqProductId').value);
  const pickupDate = document.getElementById('reqPickupDate').value;
  const pickupTime = document.getElementById('reqPickupTime').value;
  const buyerMessage = document.getElementById('reqBuyerMessage').value;

  try {
    const res = await window.api.createPurchaseRequest(user.id, {
      productId,
      pickupDate,
      pickupTime,
      buyerMessage
    });

    window.showToast('Purchase request sent to seller successfully!');
    bootstrap.Modal.getInstance(document.getElementById('purchaseRequestModal')).hide();
  } catch (err) {
    window.showToast('Failed to send purchase request', 'error');
  }
};

// Buyer-Seller Live Chat Modal
let activeChatSellerId = null;
let activeChatProductId = null;

window.openChatModal = async function(sellerId, sellerName, productId, productTitle) {
  const user = window.auth.getUser();
  if (!user) {
    window.showToast('Please login to message the seller', 'error');
    return;
  }

  activeChatSellerId = sellerId;
  activeChatProductId = productId;

  document.getElementById('chatRecipientName').textContent = sellerName;
  document.getElementById('chatProductPill').textContent = productTitle;

  await loadConversation(user.id, sellerId);

  const modalEl = document.getElementById('chatModal');
  const bsModal = new bootstrap.Modal(modalEl);
  bsModal.show();
};

async function loadConversation(u1, u2) {
  const container = document.getElementById('chatMessagesContainer');
  if (!container) return;

  try {
    const messages = await window.api.getConversation(u1, u2);
    if (!messages || messages.length === 0) {
      container.innerHTML = `<div class="text-center text-muted small my-auto">Start the conversation with the seller about pickup & details!</div>`;
      return;
    }

    container.innerHTML = messages.map(m => {
      const isMe = m.senderId === u1;
      const timeStr = new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `
        <div class="chat-bubble ${isMe ? 'chat-bubble-sent' : 'chat-bubble-received'}">
          <div>${m.messageText}</div>
          <div class="chat-time">${timeStr}</div>
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  } catch (err) {
    console.error('Failed to load chat', err);
  }
}

window.sendChatMessage = async function(event) {
  event.preventDefault();
  const user = window.auth.getUser();
  const input = document.getElementById('chatInputText');
  if (!user || !input || !input.value.trim() || !activeChatSellerId) return;

  const text = input.value.trim();
  input.value = '';

  try {
    await window.api.sendMessage(user.id, {
      receiverId: activeChatSellerId,
      productId: activeChatProductId,
      messageText: text
    });

    await loadConversation(user.id, activeChatSellerId);
  } catch (err) {
    window.showToast('Failed to send message', 'error');
  }
};

// Wishlist & Cart Offcanvas Renderers
window.openWishlistDrawer = async function() {
  const user = window.auth.getUser();
  const container = document.getElementById('wishlistDrawerContent');
  if (!user || !container) return;

  try {
    const list = await window.api.getWishlist(user.id);
    if (!list || list.length === 0) {
      container.innerHTML = `<div class="text-center py-5 text-muted"><i class="bi bi-heart fs-1"></i><p class="mt-2">${window.i18n.t('wishlistEmpty')}</p></div>`;
      return;
    }

    container.innerHTML = list.map(item => `
      <div class="d-flex align-items-center gap-3 p-3 border-bottom">
        <img src="${getCleanImg(item.primaryImageUrl)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" alt="${item.title}" onerror="this.src='images/hero-sustainability-box.jpg'">
        <div class="flex-grow-1">
          <h6 class="mb-1 text-truncate" style="max-width: 180px;">${item.title}</h6>
          <div class="text-success fw-bold">₹${Number(item.price).toLocaleString('en-IN')}</div>
          <div class="small text-muted"><i class="bi bi-geo-alt"></i> ${item.city}</div>
        </div>
        <div class="d-flex flex-column gap-1">
          <button class="btn btn-sm btn-outline-success" onclick="addToCart(${item.id})" title="Move to Cart"><i class="bi bi-cart-plus"></i></button>
          <button class="btn btn-sm btn-outline-danger" onclick="removeWishlistItem(${item.id})" title="Remove"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    `).join('');

    const drawer = new bootstrap.Offcanvas(document.getElementById('wishlistOffcanvas'));
    drawer.show();
  } catch (e) {
    console.error(e);
  }
};

window.removeWishlistItem = async function(productId) {
  const user = window.auth.getUser();
  if (!user) return;
  await window.api.removeFromWishlist(user.id, productId);
  window.auth.refreshBadges();
  openWishlistDrawer();
};

window.openCartDrawer = async function() {
  const user = window.auth.getUser();
  const container = document.getElementById('cartDrawerContent');
  const subtotalEl = document.getElementById('cartDrawerSubtotal');
  if (!user || !container) return;

  try {
    const list = await window.api.getCart(user.id);
    if (!list || list.length === 0) {
      container.innerHTML = `<div class="text-center py-5 text-muted"><i class="bi bi-cart-x fs-1"></i><p class="mt-2">${window.i18n.t('cartEmpty')}</p></div>`;
      if (subtotalEl) subtotalEl.textContent = '₹0';
      return;
    }

    let subtotal = 0;
    container.innerHTML = list.map(item => {
      const price = Number(item.price || 0);
      const total = price * (item.quantity || 1);
      subtotal += total;

      return `
        <div class="d-flex align-items-center gap-3 p-3 border-bottom">
          <img src="${getCleanImg(item.primaryImageUrl)}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" alt="${item.title}" onerror="this.src='images/hero-sustainability-box.jpg'">
          <div class="flex-grow-1">
            <h6 class="mb-1 text-truncate" style="max-width: 170px;">${item.title}</h6>
            <div class="text-success fw-bold">₹${price.toLocaleString('en-IN')} × ${item.quantity}</div>
            <div class="small text-muted">Pickup: ${item.area}</div>
          </div>
          <button class="btn btn-sm btn-outline-danger" onclick="removeCartItem(${item.id})" title="Remove"><i class="bi bi-trash"></i></button>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = '₹' + subtotal.toLocaleString('en-IN');

    const drawer = new bootstrap.Offcanvas(document.getElementById('cartOffcanvas'));
    drawer.show();
  } catch (e) {
    console.error(e);
  }
};

window.removeCartItem = async function(productId) {
  const user = window.auth.getUser();
  if (!user) return;
  await window.api.removeFromCart(user.id, productId);
  window.auth.refreshBadges();
  openCartDrawer();
};

window.proceedCheckout = async function() {
  const user = window.auth.getUser();
  if (!user) return;
  const list = await window.api.getCart(user.id);
  if (!list || list.length === 0) return;

  // Create purchase request for each item
  for (const item of list) {
    await window.api.createPurchaseRequest(user.id, {
      productId: item.id,
      pickupDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      pickupTime: '05:00 PM',
      buyerMessage: 'Purchase request via Cart Checkout.'
    });
  }

  await window.api.clearCart(user.id);
  window.auth.refreshBadges();
  bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas')).hide();
  window.showToast('All items booked! Check your Buyer Dashboard for status.');
};

// Event Listeners
function setupEventListeners() {
  const searchForm = document.getElementById('hero-search-form');
  if (searchForm) {
    searchForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const catSelect = document.getElementById('hero-category-select');
      if (catSelect && catSelect.value) {
        selectedCategory = parseInt(catSelect.value);
      }
      await applyFilters();
      const el = document.getElementById('featured-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }
}
