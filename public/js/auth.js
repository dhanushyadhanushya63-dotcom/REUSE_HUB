// ReUseHub Authentication & Session Manager

const auth = {
  getUser() {
    const raw = localStorage.getItem('reusehub_user');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return null; }
    }
    // Default demo user so all features are immediately testable
    const defaultUser = {
      id: 3,
      username: "priya_buyer",
      fullName: "Priya Raman",
      email: "buyer@reusehub.com",
      role: "ROLE_BUYER",
      city: "Chennai",
      area: "Adyar"
    };
    this.setUser(defaultUser);
    return defaultUser;
  },

  setUser(user) {
    localStorage.setItem('reusehub_user', JSON.stringify(user));
    this.updateNavUi();
    window.dispatchEvent(new CustomEvent('authChanged', { detail: { user } }));
  },

  logout() {
    localStorage.removeItem('reusehub_user');
    this.updateNavUi();
    window.location.href = 'login.html';
  },

  isLoggedIn() {
    return !!localStorage.getItem('reusehub_user');
  },

  // Switch demo account for immediate live testing
  switchAccount(role) {
    if (role === 'ROLE_BUYER') {
      this.setUser({
        id: 3,
        username: "priya_buyer",
        fullName: "Priya Raman",
        email: "buyer@reusehub.com",
        role: "ROLE_BUYER",
        city: "Chennai",
        area: "Adyar"
      });
    } else if (role === 'ROLE_SELLER') {
      this.setUser({
        id: 2,
        username: "karthik_seller",
        fullName: "Karthik Sundaram",
        email: "seller@reusehub.com",
        role: "ROLE_SELLER",
        city: "Chennai",
        area: "Tambaram"
      });
    } else if (role === 'ROLE_ADMIN') {
      this.setUser({
        id: 1,
        username: "admin",
        fullName: "Admin ReUseHub",
        email: "admin@reusehub.com",
        role: "ROLE_ADMIN",
        city: "Chennai",
        area: "Guindy"
      });
    }
    showToast(`Switched account to: ${this.getUser().fullName} (${role.replace('ROLE_', '')})`);
  },

  updateNavUi() {
    const user = this.getUser();
    const guestLinks = document.querySelectorAll('.nav-auth-guest');
    const userLinks = document.querySelectorAll('.nav-auth-user');
    const userNameDisplays = document.querySelectorAll('.nav-user-name');
    const userRoleBadges = document.querySelectorAll('.nav-user-role-badge');

    if (user) {
      guestLinks.forEach(el => el.classList.add('d-none'));
      userLinks.forEach(el => el.classList.remove('d-none'));
      userNameDisplays.forEach(el => el.textContent = user.fullName || user.username);
      userRoleBadges.forEach(el => {
        el.textContent = (user.role || 'BUYER').replace('ROLE_', '');
        el.className = `badge nav-user-role-badge ms-1 ${
          user.role === 'ROLE_ADMIN' ? 'bg-danger' : user.role === 'ROLE_SELLER' ? 'bg-warning text-dark' : 'bg-success'
        }`;
      });
    } else {
      guestLinks.forEach(el => el.classList.remove('d-none'));
      userLinks.forEach(el => el.classList.add('d-none'));
    }

    // Refresh cart and wishlist badge counts
    this.refreshBadges();
  },

  async refreshBadges() {
    const user = this.getUser();
    if (!user) return;

    try {
      const [wishlist, cart] = await Promise.all([
        window.api.getWishlist(user.id),
        window.api.getCart(user.id)
      ]);

      const wishBadges = document.querySelectorAll('.wishlist-badge');
      const cartBadges = document.querySelectorAll('.cart-badge');

      const wishCount = Array.isArray(wishlist) ? wishlist.length : 0;
      const cartCount = Array.isArray(cart) ? cart.reduce((acc, c) => acc + (c.quantity || 1), 0) : 0;

      wishBadges.forEach(b => b.textContent = wishCount);
      cartBadges.forEach(b => b.textContent = cartCount);
    } catch (e) {
      // ignore
    }
  }
};

// Global Toast Helper
function showToast(message, type = 'success') {
  let toast = document.getElementById('reusehub-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'reusehub-toast';
    toast.className = 'reusehub-toast';
    document.body.appendChild(toast);
  }

  const icon = type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-circle-fill text-danger';
  toast.innerHTML = `<i class="bi ${icon} fs-4"></i><div><strong>ReUseHub</strong><div class="small text-muted">${message}</div></div>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

window.auth = auth;
window.showToast = showToast;

document.addEventListener('DOMContentLoaded', () => {
  auth.updateNavUi();
});
