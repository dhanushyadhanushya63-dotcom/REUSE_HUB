// ReUseHub Internationalization Dictionary (English Standard)

const translations = {
  en: {
    // Top Bar
    brandTagline: "Shop Smart. Reuse More. Go Green!",
    loginText: "Login",
    registerText: "Register",
    logoutText: "Logout",
    myDashboard: "My Dashboard",

    // Navbar
    navHome: "Home",
    navBrowse: "Browse Products",
    navSell: "Sell an Item",
    navDonate: "Donate",
    navAbout: "About Us",
    navCategories: "Categories",
    allCategories: "All Categories",

    // Hero Section
    heroTitle: "Give Your Products a Second Life",
    heroSubtitle: "Buy, sell or donate used products and help build a sustainable future together.",
    heroSearchPlaceholder: "What are you looking for? (e.g. Laptop, Chair, Shoes)",
    allCategoriesDropdown: "All Categories",
    searchBtn: "Search",
    reuseReduceRecycle: "Reuse • Reduce • Recycle",
    verifiedCommunity: "Verified Community",
    itemsReusedStat: "12,450+ Items Reused",
    zeroListingFees: "100% Free to List",
    co2SavedHero: "🌱 14.8 Tons CO₂ Diverted",

    // Categories
    categoriesHeading: "Browse by Category",
    categoriesSubheading: "Explore thousands of quality pre-owned goods across top categories",
    catElectronics: "Electronics",
    catBooks: "Books & Education",
    catClothing: "Clothing",
    catFurniture: "Furniture",
    catAppliances: "Home Appliances",
    catSports: "Sports Equipment",
    catAccessories: "Accessories",
    catOthers: "Others",

    // Featured Products
    featuredHeading: "Featured Products",
    featuredSubheading: "Curated pre-loved deals verified for quality and immediate local pickup",
    viewAll: "View All Products",
    addToCart: "Add to Cart",
    buyNow: "Purchase Request",
    freeDonationBadge: "FREE / DONATE",
    conditionLikeNew: "Like New",
    conditionGood: "Good",
    conditionUsed: "Used",
    conditionFair: "Fair",
    pickupAt: "Pickup",
    viewDetails: "Quick View",

    // Location Filter
    locationFilterTitle: "Filter by Location",
    selectCity: "Select City",
    enterArea: "Enter Area / Locality",
    allCities: "All Cities",
    clearFilter: "Clear",
    applyFilter: "Apply Location Filter",

    // How It Works
    howItWorksHeading: "How It Works",
    howItWorksSubheading: "Easy, transparent, and eco-friendly in four simple steps",
    step1Title: "Create Account",
    step1Desc: "Sign up as a Buyer or Seller in under 30 seconds with your local pickup details.",
    step2Title: "List or Find Products",
    step2Desc: "Discover verified pre-owned treasures or list your unused items in few clicks.",
    step3Title: "Connect",
    step3Desc: "Chat directly with local sellers and buyers to agree on price and convenient pickup.",
    step4Title: "Make an Impact",
    step4Desc: "Complete handover safely, save money, and keep usable items out of landfills.",

    // Environmental Benefits
    benefitsHeading: "Environmental Benefits",
    benefitsSubheading: "Every second-hand purchase actively protects our planet and saves natural resources",
    reduceWasteTitle: "Reduce Waste",
    reduceWasteDesc: "Prevent perfectly good items from ending up in landfills by keeping them in circular use.",
    conserveResourcesTitle: "Conserve Resources",
    conserveResourcesDesc: "Save raw materials, energy, and water required to manufacture brand new goods.",
    greenerTomorrowTitle: "Build a Greener Tomorrow",
    greenerTomorrowDesc: "Every transaction directly prevents greenhouse emissions and supports eco-living.",
    statLandfillDiverted: "74,200+ kg Waste Diverted",
    statCo2Prevented: "210+ Tons CO₂ Avoided",
    statWaterSaved: "1.8M Liters Water Saved",

    // Footer
    footerBrandDesc: "ReUseHub is India's leading community-driven circular marketplace for second-hand goods. Buy with confidence, sell with ease, and donate generously.",
    quickLinks: "Quick Links",
    supportHelp: "Support & Help",
    safetyTips: "Safety & Pickup Tips",
    communityGuidelines: "Community Guidelines",
    faqs: "FAQs",
    contactUs: "Contact Us",
    allRightsReserved: "All rights reserved.",
    ecoFriendlyInitiative: "A Zero-Waste Circular Economy Initiative",

    // Modals and Drawers
    conditionLabel: "Condition",
    priceLabel: "Price",
    pickupLocationLabel: "Seller Pickup Location",
    sellerLabel: "Seller",
    cartTitle: "Shopping Cart",
    wishlistTitle: "My Wishlist",
    cartEmpty: "Your cart is currently empty.",
    wishlistEmpty: "Your wishlist is currently empty.",
    checkoutBtn: "Proceed to Request All",
    subtotal: "Subtotal"
  }
};

class I18nManager {
  constructor() {
    // Clear any previous language preference
    localStorage.removeItem('reusehub_lang');
    this.currentLang = 'en';
  }

  getLang() {
    return 'en';
  }

  setLang(lang) {
    this.currentLang = 'en';
  }

  t(key) {
    return translations.en[key] || key;
  }

  applyTranslations() {
    document.documentElement.lang = 'en';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const text = this.t(key);
      if (text) el.placeholder = text;
    });
  }
}

// Global instance
window.i18n = new I18nManager();

document.addEventListener('DOMContentLoaded', () => {
  window.i18n.applyTranslations();
});
