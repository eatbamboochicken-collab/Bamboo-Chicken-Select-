/**
 * BAMBOO CHICKEN SELECT — STATIC CLIENT APPLICATION
 * 100% Pure Vanilla JavaScript (ES6+)
 * Zero dependencies, zero build step, zero framework code.
 * Mobile-First Menu Architecture & Configurable Pricing Engine
 */

// ==========================================
// 1. CONFIGURABLE PRICING & PRODUCT CATALOG
// ==========================================

// Configurable Finish-at-Home bulk discount strategy (pending Ronald's final confirmation)
const DISCOUNT_CONFIG = {
  thresholdBoxes: 3,
  // Options: 'flat_per_box_50' | 'none'
  activePolicy: 'flat_per_box_50',
  policies: {
    flat_per_box_50: {
      id: 'flat_per_box_50',
      label: 'Provisional Tier: $0.50 off per box',
      discountPerBox: 0.50,
      calculate: (boxQty, basePrice) => {
        if (boxQty >= 3) {
          const unitPrice = basePrice - 0.50;
          const discountTotal = boxQty * 0.50;
          return {
            applied: true,
            unitPrice,
            discountTotal,
            note: "Provisional bulk tier applied ($0.50 off/box for 3+ boxes — pending Ronald's confirmation)"
          };
        }
        return {
          applied: false,
          unitPrice: basePrice,
          discountTotal: 0,
          note: 'Add 3 or more boxes to activate bulk savings'
        };
      }
    },
    none: {
      id: 'none',
      label: 'Standard Pricing (No discount)',
      discountPerBox: 0,
      calculate: (boxQty, basePrice) => ({
        applied: false,
        unitPrice: basePrice,
        discountTotal: 0,
        note: 'Standard box pricing'
      })
    }
  }
};

// Configurable Soy Sauce product configuration (pending Ronald's final confirmation)
const SOY_SAUCE_CONFIG = {
  provisionalPrice: 3.00,
  volumeConfirmed: false,
  format: 'Full Bottle'
};

// Menu Sections Definition (Structured grouping for All Items and individual filters)
const MENU_SECTIONS = [
  {
    id: 'signature-meals',
    title: 'Signature Meals',
    badge: 'Signature',
    description: 'Bamboo Chicken skewers and golden savoury pie.'
  },
  {
    id: 'chicken-and-more',
    title: 'Chicken & More',
    badge: 'Hot & Ready',
    description: 'Crispy bite-sized chicken nuggets prepared for a quick meal.'
  },
  {
    id: 'cooked-dumplings',
    title: 'Cooked Dumplings',
    badge: 'Pack of 5',
    description: 'Freshly cooked dumplings served hot and ready to enjoy. $5.00 per pack of 5.'
  },
  {
    id: 'finish-at-home',
    title: 'Finish-at-Home',
    badge: 'Box of 10',
    description: 'Chilled boxes of 10 dumplings to cook at home. Bulk savings begin at 3 boxes.'
  },
  {
    id: 'drinks-extras',
    title: 'Drinks & Extras',
    badge: 'Chilled & Bottled',
    description: 'Chilled iced tea and full-bottle savoury soy sauce.'
  }
];

// Master 9-Product Catalogue for Bamboo Chicken Select
// Realistic, authentic descriptions aligned strictly with Bamboo Chicken's actual menu
const SELECT_CATALOG = [
  // 1. SIGNATURE MEALS
  {
    id: 'bamboo-chicken-select',
    sectionId: 'signature-meals',
    category: 'signature-meals',
    name: 'Bamboo Chicken',
    price: 3.00,
    unit: '1 stick',
    badge: 'Signature Skewer',
    aspectClass: 'aspect-wide',
    image: 'https://pub-1d12d1bcd0c54b5282f7b9e9eec3ba59.r2.dev/assets/images/website/bamboo_chicken_3_sticks.webp',
    alt: 'Signature Bamboo Chicken on a skewer',
    description: 'Our signature Bamboo Chicken, prepared and served with the flavour customers know from Bamboo Chicken.'
  },
  {
    id: 'bamboo-pie-select',
    sectionId: 'signature-meals',
    category: 'signature-meals',
    name: 'Bamboo Pie',
    price: 3.00,
    unit: 'per pie',
    badge: 'Savoury Pie',
    aspectClass: 'aspect-standard',
    image: 'https://pub-1d12d1bcd0c54b5282f7b9e9eec3ba59.r2.dev/assets/images/menu/bamboo_pie_3.webp',
    alt: 'Golden savoury Bamboo Pie',
    description: 'A golden, savoury pie with a filling inspired by Bamboo Chicken’s menu.'
  },

  // 2. CHICKEN & MORE
  {
    id: 'chicken-nuggets-select',
    sectionId: 'chicken-and-more',
    category: 'chicken-and-more',
    name: 'Chicken Nuggets',
    price: 3.00,
    portion: '100g',
    unit: '100g portion',
    badge: '100g Portion',
    aspectClass: 'aspect-standard',
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    alt: 'Crispy bite-sized chicken nuggets, 100g portion',
    description: '100g of bite-sized chicken nuggets, prepared for an easy and satisfying meal.'
  },

  // 3. COOKED DUMPLINGS (Pack of 5, $5.00 each, strictly NO bulk discount)
  {
    id: 'chicken-dumplings-cooked',
    sectionId: 'cooked-dumplings',
    category: 'cooked-dumplings',
    name: 'Chicken Dumplings',
    price: 5.00,
    isBox: false,
    dumplingsPerPack: 5,
    unit: 'pack of 5',
    badge: 'Ready to Eat',
    aspectClass: 'aspect-standard',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=600&q=80',
    alt: 'Five freshly cooked chicken dumplings, pack of 5',
    description: 'Five chicken dumplings filled with seasoned chicken and served hot, ready to enjoy.'
  },
  {
    id: 'beef-dumplings-cooked',
    sectionId: 'cooked-dumplings',
    category: 'cooked-dumplings',
    name: 'Beef Dumplings',
    price: 5.00,
    isBox: false,
    dumplingsPerPack: 5,
    unit: 'pack of 5',
    badge: 'Ready to Eat',
    aspectClass: 'aspect-standard',
    image: 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?auto=format&fit=crop&w=600&q=80',
    alt: 'Five freshly cooked beef dumplings, pack of 5',
    description: 'Five beef dumplings filled with seasoned minced beef and served hot, ready to enjoy.'
  },

  // 4. FINISH-AT-HOME (10 dumplings per box, $10.00/box, bulk savings from 3 boxes)
  {
    id: 'chicken-dumpling-box-10',
    sectionId: 'finish-at-home',
    category: 'finish-at-home',
    name: 'Finish-at-Home Chicken Dumpling Box',
    price: 10.00,
    isBox: true,
    dumplingsPerBox: 10,
    unit: 'box of 10',
    badge: 'Box of 10',
    aspectClass: 'aspect-box',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    alt: 'Finish-at-Home Chicken Dumpling Box with 10 chilled dumplings',
    description: 'A box of 10 chilled chicken dumplings to cook at home. Bulk savings begin at 3 boxes.'
  },
  {
    id: 'beef-dumpling-box-10',
    sectionId: 'finish-at-home',
    category: 'finish-at-home',
    name: 'Finish-at-Home Beef Dumpling Box',
    price: 10.00,
    isBox: true,
    dumplingsPerBox: 10,
    unit: 'box of 10',
    badge: 'Box of 10',
    aspectClass: 'aspect-box',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    alt: 'Finish-at-Home Beef Dumpling Box with 10 chilled dumplings',
    description: 'A box of 10 chilled beef dumplings to cook at home. Bulk savings begin at 3 boxes.'
  },

  // 5. DRINKS & EXTRAS
  {
    id: 'ice-tea-select',
    sectionId: 'drinks-extras',
    category: 'drinks-extras',
    name: 'Select Ice Tea',
    price: 3.00,
    unit: 'per bottle',
    badge: 'Chilled Bottle',
    aspectClass: 'aspect-bottle',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80',
    alt: 'Chilled bottle of Select Ice Tea',
    description: 'Chilled iced tea brewed with a touch of citrus flavour. A refreshing companion to any meal.'
  },
  {
    id: 'select-soy-sauce',
    sectionId: 'drinks-extras',
    category: 'drinks-extras',
    name: 'Soy Sauce',
    price: SOY_SAUCE_CONFIG.provisionalPrice,
    unit: 'full bottle',
    badge: 'Full Bottle',
    aspectClass: 'aspect-bottle',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
    alt: 'Full bottle of Soy Sauce',
    description: 'A full bottle of rich savoury soy sauce, suited for dipping dumplings or seasoning meals at home.'
  }
];

// ==========================================
// 2. STATE MANAGEMENT
// ==========================================

const appState = {
  cart: [],
  cardQuantities: {}, // Tracks stepper count per card [item.id]: number
  activeCategory: 'all'
};

// Initialize per-card quantities to 1
SELECT_CATALOG.forEach(item => {
  appState.cardQuantities[item.id] = 1;
});

// ==========================================
// 3. INITIALIZATION & LIFECYCLE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  setupEventListeners();
  setupFooterInteraction();
  updateCartUI();
});

// Setup Event Listeners
function setupEventListeners() {
  // Category filter buttons
  const categoryButtons = document.querySelectorAll('.cat-filter-btn');
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      
      const cat = btn.getAttribute('data-category');
      appState.activeCategory = cat;
      renderMenu();

      // Ensure active category pill is visible on horizontal scroll without shifting the page
      btn.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    });
  });

  // Cart Drawer open/close buttons
  const openCartBtn = document.getElementById('open-cart-btn');
  const floatingCartBtn = document.getElementById('floating-cart-btn');
  const closeCartBtn = document.getElementById('close-cart-btn');
  const drawerBackdrop = document.getElementById('cart-drawer');

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (floatingCartBtn) floatingCartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', (e) => {
      if (e.target === drawerBackdrop) closeCart();
    });
  }

  // Proceed to Checkout button
  const proceedBtn = document.getElementById('proceed-to-checkout-btn');
  if (proceedBtn) {
    proceedBtn.addEventListener('click', () => {
      if (!appState.cart || appState.cart.length === 0) {
        showToastNotification("Your bag is empty. Please select items first.");
        return;
      }
      closeCart();
      openCheckout(1);
    });
  }

  // Checkout modal close listeners
  const closeCheckoutBtn = document.getElementById('close-checkout-btn');
  const checkoutBackdrop = document.getElementById('checkout-modal');
  if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
  if (checkoutBackdrop) {
    checkoutBackdrop.addEventListener('click', (e) => {
      if (e.target === checkoutBackdrop) closeCheckout();
    });
  }
}

function openCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.add('active');
}

function closeCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.classList.remove('active');
}

// Subtle, unobtrusive footer interaction for developer inquiries
function setupFooterInteraction() {
  const modelBtn = document.getElementById('experience-model-btn');
  if (!modelBtn) return;

  // Track touch position to prevent accidental triggering during mobile scrolling
  let touchStartY = 0;
  let touchStartX = 0;
  let isScrollGesture = false;

  modelBtn.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
      isScrollGesture = false;
    }
  }, { passive: true });

  modelBtn.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
      if (deltaY > 8 || deltaX > 8) {
        isScrollGesture = true;
      }
    }
  }, { passive: true });

  modelBtn.addEventListener('click', (e) => {
    // If the tap was actually a page scroll gesture, ignore
    if (isScrollGesture) {
      isScrollGesture = false;
      return;
    }
    e.preventDefault();

    // Developer recipient number remains completely hidden from the visible DOM/UI
    const recipientDigits = ['0', '7', '7', '9', '3', '8', '8', '5', '6', '0'].join('');
    const inquiryDraft = 'Hi, I would like to enquire about the Warstreet Experience Model for an application.';

    // Create platform-compatible SMS link without automatically sending
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const smsHref = isIOS 
      ? `sms:${recipientDigits}&body=${encodeURIComponent(inquiryDraft)}`
      : `sms:${recipientDigits}?body=${encodeURIComponent(inquiryDraft)}`;

    try {
      window.location.href = smsHref;
    } catch (err) {
      // Gracefully silent fallback if device does not support SMS dispatch
      console.log('Inquiry dispatch handled.');
    }
  });
}

// ==========================================
// 4. MENU RENDERING (ORGANIZED SECTIONS)
// ==========================================

function renderMenu() {
  const container = document.getElementById('menu-items-list');
  if (!container) return;

  // Determine which sections to render
  const sectionsToRender = appState.activeCategory === 'all'
    ? MENU_SECTIONS
    : MENU_SECTIONS.filter(section => section.id === appState.activeCategory);

  if (sectionsToRender.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
        <p>No items found in this category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = sectionsToRender.map(section => {
    // Get products belonging to this section
    const sectionProducts = SELECT_CATALOG.filter(item => item.sectionId === section.id);

    if (sectionProducts.length === 0) return '';

    const cardsHtml = sectionProducts.map(item => renderProductCard(item)).join('');

    return `
      <section class="menu-catalog-section" id="section-${section.id}" aria-labelledby="heading-${section.id}">
        <!-- Section Header -->
        <div class="menu-section-header">
          <span class="menu-section-pill">${section.badge}</span>
          <h2 class="menu-section-title" id="heading-${section.id}">${section.title}</h2>
          <p class="menu-section-desc">${section.description}</p>
        </div>

        <!-- Section Product Grid -->
        <div class="product-grid">
          ${cardsHtml}
        </div>
      </section>
    `;
  }).join('');
}

// Render individual product card
function renderProductCard(item) {
  const cardQty = appState.cardQuantities[item.id] || 1;
  const cartItem = appState.cart.find(c => c.id === item.id);
  const inBagQty = cartItem ? cartItem.quantity : 0;

  // Pricing calculation and tags
  let priceDisplay = `$${item.price.toFixed(2)}`;
  let subDisplay = item.unit;
  let promoBadge = '';

  if (item.isBox) {
    const policy = DISCOUNT_CONFIG.policies[DISCOUNT_CONFIG.activePolicy];
    const calculation = policy.calculate(cardQty, item.price);
    if (calculation.applied) {
      priceDisplay = `$${calculation.unitPrice.toFixed(2)}`;
      subDisplay = `Total: $${(calculation.unitPrice * cardQty).toFixed(2)} (${cardQty} boxes)`;
      promoBadge = `<div class="bulk-promo-tag">Bulk Tier: Save $0.50/box (${cardQty} boxes)</div>`;
    } else {
      promoBadge = `<div class="bulk-promo-tag">Bulk savings begin at 3 boxes</div>`;
    }
  }

  return `
    <article class="select-product-card ${item.isBox ? 'finish-box-card' : ''}" id="product-card-${item.id}">
      <!-- 1. Product Image -->
      <div class="select-card-media ${item.aspectClass || ''}">
        <img 
          src="${item.image}" 
          alt="${item.alt}" 
          loading="lazy" 
          decoding="async"
          onerror="this.src='https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=600&q=80'"
        />
        ${item.badge ? `<span class="media-tag-badge">${item.badge}</span>` : ''}
      </div>

      <!-- Information & Ordering Controls -->
      <div class="select-card-content">
        <div class="select-card-header">
          <!-- 2. Product Name -->
          <h3 class="select-card-title">${item.name}</h3>
          <!-- 3. Short, Truthful Description -->
          <p class="select-card-desc">${item.description}</p>
          ${promoBadge}
        </div>

        <!-- 4. Price & Unit, 5. Stepper, 6. Add to Order -->
        <div class="select-card-footer">
          <div class="select-price-block">
            <div class="select-price-row">
              <span class="select-price-amount" id="price-display-${item.id}">${priceDisplay}</span>
              <span class="select-price-sub" id="unit-display-${item.id}">${subDisplay}</span>
            </div>
            ${inBagQty > 0 ? `<span class="in-bag-count-badge">In Bag: ${inBagQty}</span>` : ''}
          </div>

          <div class="select-action-cluster">
            <!-- 5. Quantity Stepper [- 1 +] -->
            <div class="card-stepper" aria-label="Quantity selector for ${item.name}">
              <button 
                type="button" 
                class="stepper-btn" 
                onclick="adjustCardQuantity('${item.id}', -1)"
                aria-label="Decrease quantity"
              >&minus;</button>
              <span class="stepper-val" id="stepper-val-${item.id}">${cardQty}</span>
              <button 
                type="button" 
                class="stepper-btn" 
                onclick="adjustCardQuantity('${item.id}', 1)"
                aria-label="Increase quantity"
              >&plus;</button>
            </div>

            <!-- 6. Add to Order Button -->
            <button 
              type="button" 
              class="btn-card-add" 
              onclick="addCurrentCardToCart('${item.id}')"
              aria-label="Add ${cardQty} ${item.name} to order"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                <path d="M3 6h18"></path>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Order</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  `;
}

// ==========================================
// 5. CARD STEPPER CONTROLS
// ==========================================

function adjustCardQuantity(itemId, delta) {
  const current = appState.cardQuantities[itemId] || 1;
  const newQty = Math.max(1, current + delta);
  appState.cardQuantities[itemId] = newQty;

  // Update UI values immediately for smooth response
  const stepperValEl = document.getElementById(`stepper-val-${itemId}`);
  if (stepperValEl) {
    stepperValEl.textContent = newQty;
  }

  // If Finish-at-Home box, update bulk tier preview dynamically on the card
  const item = SELECT_CATALOG.find(i => i.id === itemId);
  if (item && item.isBox) {
    const policy = DISCOUNT_CONFIG.policies[DISCOUNT_CONFIG.activePolicy];
    const calculation = policy.calculate(newQty, item.price);
    const priceDisplay = document.getElementById(`price-display-${itemId}`);
    const unitDisplay = document.getElementById(`unit-display-${itemId}`);

    if (priceDisplay && unitDisplay) {
      if (calculation.applied) {
        priceDisplay.textContent = `$${calculation.unitPrice.toFixed(2)}`;
        unitDisplay.textContent = `Total: $${(calculation.unitPrice * newQty).toFixed(2)} (${newQty} boxes)`;
      } else {
        priceDisplay.textContent = `$${item.price.toFixed(2)}`;
        unitDisplay.textContent = `${item.unit}`;
      }
    }
  }
}

// Add the selected quantity on the card into the bag
function addCurrentCardToCart(itemId) {
  const item = SELECT_CATALOG.find(i => i.id === itemId);
  if (!item) return;

  const qtyToAdd = appState.cardQuantities[itemId] || 1;
  const existing = appState.cart.find(c => c.id === itemId);

  if (existing) {
    existing.quantity += qtyToAdd;
  } else {
    appState.cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      basePrice: item.price,
      isBox: !!item.isBox,
      isProvisional: !!item.isProvisional,
      quantity: qtyToAdd,
      image: item.image,
      unit: item.unit || '',
      description: item.description || ''
    });
  }

  // Reset card stepper back to 1
  appState.cardQuantities[itemId] = 1;
  renderMenu();
  updateCartUI();

  showToastNotification(`Added ${qtyToAdd}x ${item.name} to your Select Bag`);
}

function removeItemFromCart(itemId) {
  appState.cart = appState.cart.filter(c => c.id !== itemId);
  renderMenu();
  updateCartUI();
  if (checkoutState.isOpen && checkoutState.currentStep === 1) {
    renderCheckoutStep(1);
  }
}

// ==========================================
// 6. CART MANAGEMENT & BULK PRICING ENGINE
// ==========================================

function updateCartUI() {
  // 1. Calculate finish-at-home bulk discount across all boxes in the cart
  const totalBoxCount = appState.cart
    .filter(item => item.isBox)
    .reduce((sum, item) => sum + item.quantity, 0);

  const policy = DISCOUNT_CONFIG.policies[DISCOUNT_CONFIG.activePolicy];
  const boxCalculation = policy.calculate(totalBoxCount, 10.00);

  let subtotal = 0;
  let totalItemsCount = 0;
  let totalDiscountSavings = 0;

  const itemizedListHtml = appState.cart.map(cartItem => {
    let effectiveUnitPrice = cartItem.basePrice;
    let isBoxDiscounted = false;

    // Apply bulk tier ONLY if item is a Finish-at-Home box and total box count reaches threshold
    if (cartItem.isBox && boxCalculation.applied) {
      effectiveUnitPrice = boxCalculation.unitPrice;
      const lineSavings = (cartItem.basePrice - effectiveUnitPrice) * cartItem.quantity;
      totalDiscountSavings += lineSavings;
      isBoxDiscounted = true;
    }

    const lineTotal = effectiveUnitPrice * cartItem.quantity;
    subtotal += lineTotal;
    totalItemsCount += cartItem.quantity;

    return `
      <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 14px; padding-bottom: 14px; border-bottom: 1px solid var(--border-subtle);">
        <img src="${cartItem.image}" alt="${cartItem.name}" style="width: 52px; height: 52px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border-subtle); flex-shrink: 0;" />
        <div style="flex: 1; min-width: 0;">
          <div style="font-weight: 700; font-size: 0.92rem; color: #141416; line-height: 1.25;">${cartItem.name}</div>
          <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
            $${effectiveUnitPrice.toFixed(2)} each 
            ${isBoxDiscounted ? `<span style="color:#B45309; font-weight:700;">(Bulk Tier: 3+ boxes)</span>` : ''}
            ${cartItem.isProvisional ? `<span style="color:#64748B; font-weight:600;">(Full Bottle • Vol. pending)</span>` : ''}
          </div>
        </div>
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" onclick="modifyCartItemQty('${cartItem.id}', -1)" style="width: 26px; height: 26px; border: 1px solid #CBD5E1; background: white; border-radius: 6px; font-weight: 700; cursor: pointer;">-</button>
          <span style="font-weight: 800; font-size: 0.88rem; min-width: 18px; text-align: center;">${cartItem.quantity}</span>
          <button type="button" onclick="modifyCartItemQty('${cartItem.id}', 1)" style="width: 26px; height: 26px; border: 1px solid #CBD5E1; background: white; border-radius: 6px; font-weight: 700; cursor: pointer;">+</button>
          <div style="font-weight: 800; font-size: 0.95rem; min-width: 55px; text-align: right; color: #141416;">$${lineTotal.toFixed(2)}</div>
        </div>
      </div>
    `;
  }).join('');

  // 2. Update Header Badge
  const headerCountEl = document.getElementById('cart-count');
  if (headerCountEl) headerCountEl.textContent = totalItemsCount;

  // 3. Update Floating Mobile Cart Pill
  const floatingBtn = document.getElementById('floating-cart-btn');
  const floatingBadge = document.getElementById('floating-cart-badge');
  const floatingTotal = document.getElementById('floating-cart-total');

  if (floatingBadge) floatingBadge.textContent = totalItemsCount;
  if (floatingTotal) floatingTotal.textContent = `$${subtotal.toFixed(2)}`;
  if (floatingBtn) {
    floatingBtn.style.display = totalItemsCount > 0 ? 'flex' : 'none';
  }

  // 4. Update Drawer Content
  const listContainer = document.getElementById('cart-items-list');
  const totalAmountEl = document.getElementById('cart-total-amount');
  const discountRowEl = document.getElementById('cart-discount-row');

  if (listContainer) {
    if (appState.cart.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 12px;">🛍️</div>
          <p style="font-size: 0.95rem; font-weight: 600; margin-bottom: 4px;">Your Select Bag is empty</p>
          <p style="font-size: 0.82rem;">Select ready-to-eat skewers, freshly steamed dumplings, or finish-at-home boxes above.</p>
        </div>
      `;
    } else {
      listContainer.innerHTML = itemizedListHtml;
    }
  }

  if (totalAmountEl) {
    totalAmountEl.textContent = `$${subtotal.toFixed(2)}`;
  }

  if (discountRowEl) {
    if (totalDiscountSavings > 0) {
      discountRowEl.style.display = 'flex';
      discountRowEl.innerHTML = `
        <span style="color: #059669; font-weight: 700; font-size: 0.85rem;">Provisional Bulk Savings:</span>
        <span style="color: #059669; font-weight: 800; font-size: 0.9rem;">-$${totalDiscountSavings.toFixed(2)}</span>
      `;
    } else {
      discountRowEl.style.display = 'none';
    }
  }
}

function modifyCartItemQty(itemId, delta) {
  const item = appState.cart.find(c => c.id === itemId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    appState.cart = appState.cart.filter(c => c.id !== itemId);
  }

  renderMenu();
  updateCartUI();

  // If checkout step 1 is currently active, re-render it so items and totals reflect live changes
  if (checkoutState.isOpen && checkoutState.currentStep === 1) {
    renderCheckoutStep(1);
  }
}

// Toast notification helper
function showToastNotification(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;

  toast.textContent = message;
  toast.style.display = 'flex';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.display = 'none';
  }, 2400);
}

// ==========================================
// 6. STEP-BY-STEP CHECKOUT & ORDER ENGINE
// ==========================================

const API_BASE = "https://bamboo-orders-api.warstreett.workers.dev";
const BAMBOO_CONTACT_NUMBER = "0790040778";

const checkoutState = {
  isOpen: false,
  currentStep: 1, // 1: Review, 2: Customer, 3: Delivery, 4: Payment, 5: Confirm
  highestStepReached: 1,
  customerName: localStorage.getItem('bamboo_select_customer_name') || '',
  customerPhone: localStorage.getItem('bamboo_select_customer_phone') || '',
  additionalContact: localStorage.getItem('bamboo_select_additional_contact') || '',
  deliveryLocation: localStorage.getItem('bamboo_select_delivery_location') || '',
  nearbyLandmark: localStorage.getItem('bamboo_select_nearby_landmark') || '',
  deliveryInstructions: localStorage.getItem('bamboo_select_delivery_instructions') || '',
  paymentMethod: 'Cash on Delivery',
  confirmedCheckbox: false,
  isSubmitting: false,
  confirmedOrder: null,
  validationErrors: {}
};

/**
 * Calculates item totals, bulk box discounts, and order totals.
 * Safe fallback for both basePrice and price properties.
 */
function calculateCheckoutFinancials() {
  const policy = DISCOUNT_CONFIG.policies[DISCOUNT_CONFIG.activePolicy];
  const totalBoxCount = appState.cart
    .filter(item => item.isBox)
    .reduce((sum, item) => sum + item.quantity, 0);

  const boxCalculation = policy ? policy.calculate(totalBoxCount, 10.00) : { applied: false, unitPrice: 10.00, discountTotal: 0 };

  let subtotal = 0;
  let totalItemsCount = 0;
  let totalDiscountSavings = 0;

  const items = appState.cart.map(cartItem => {
    const rawPrice = Number(cartItem.basePrice ?? cartItem.price ?? 0);
    let effectiveUnitPrice = rawPrice;
    let isBoxDiscounted = false;

    if (cartItem.isBox && boxCalculation.applied) {
      effectiveUnitPrice = boxCalculation.unitPrice;
      const savings = (rawPrice - effectiveUnitPrice) * cartItem.quantity;
      totalDiscountSavings += savings;
      isBoxDiscounted = true;
    }

    const lineTotal = effectiveUnitPrice * cartItem.quantity;
    subtotal += lineTotal;
    totalItemsCount += cartItem.quantity;

    return {
      ...cartItem,
      rawPrice,
      effectiveUnitPrice,
      isBoxDiscounted,
      lineTotal
    };
  });

  const grandTotal = subtotal;

  return {
    items,
    subtotal,
    discountSavings: totalDiscountSavings,
    grandTotal,
    totalItemsCount,
    deliveryFeeLabel: "To be confirmed"
  };
}

/**
 * Open Checkout Modal
 */
function openCheckout(step = 1) {
  if (!appState.cart || appState.cart.length === 0) {
    showToastNotification("Your bag is empty. Please select items first.");
    return;
  }

  checkoutState.isOpen = true;
  checkoutState.currentStep = step;
  checkoutState.highestStepReached = Math.max(checkoutState.highestStepReached, step);
  checkoutState.validationErrors = {};

  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('active');

  const progressBar = document.getElementById('checkout-progress-bar');
  if (progressBar && !checkoutState.confirmedOrder) {
    progressBar.style.display = 'flex';
  }

  renderCheckoutProgress(step);
  renderCheckoutStep(step);
}

/**
 * Close Checkout Modal
 */
function closeCheckout() {
  if (checkoutState.isSubmitting) return; // Guard during submission

  if (checkoutState.confirmedOrder) {
    startNewOrder();
    return;
  }

  checkoutState.isOpen = false;
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.remove('active');
}

/**
 * Step navigation with validation guards
 */
function setCheckoutStep(step) {
  if (checkoutState.isSubmitting) return;

  // Validate Step 2 if moving forward from step 2
  if (checkoutState.currentStep === 2 && step > 2) {
    if (!validateStep2Fields()) {
      renderCheckoutStep(2);
      return;
    }
  }

  // Validate Step 3 if moving forward from step 3
  if (checkoutState.currentStep === 3 && step > 3) {
    if (!validateStep3Fields()) {
      renderCheckoutStep(3);
      return;
    }
  }

  checkoutState.currentStep = step;
  checkoutState.highestStepReached = Math.max(checkoutState.highestStepReached, step);
  renderCheckoutProgress(step);
  renderCheckoutStep(step);

  const modalBody = document.getElementById('checkout-modal-body');
  if (modalBody) modalBody.scrollTop = 0;
}

/**
 * Validate customer contact information (Step 2)
 */
function validateStep2Fields() {
  const errors = {};
  const name = (checkoutState.customerName || '').trim();
  const phone = (checkoutState.customerPhone || '').trim();

  if (!name) {
    errors.customerName = "Please enter your full name.";
  }

  if (!phone) {
    errors.customerPhone = "Please enter your phone number.";
  } else {
    const cleanedDigits = phone.replace(/[^0-9+]/g, '');
    if (cleanedDigits.length < 9) {
      errors.customerPhone = "Please enter a valid phone number (e.g. 077 123 4567).";
    }
  }

  checkoutState.validationErrors = errors;
  return Object.keys(errors).length === 0;
}

/**
 * Validate delivery address and landmark (Step 3)
 */
function validateStep3Fields() {
  const errors = {};
  const location = (checkoutState.deliveryLocation || '').trim();
  const landmark = (checkoutState.nearbyLandmark || '').trim();

  if (!location) {
    errors.deliveryLocation = "Please enter your delivery area, street, or location.";
  }

  if (!landmark) {
    errors.nearbyLandmark = "Please provide a recognizable nearby landmark (e.g. Near Sam Levy's or Meikles Hotel).";
  }

  checkoutState.validationErrors = errors;
  return Object.keys(errors).length === 0;
}

/**
 * Render Step Progression Nodes & Connectors
 */
function renderCheckoutProgress(step) {
  const progressBar = document.getElementById('checkout-progress-bar');
  if (!progressBar) return;

  if (checkoutState.confirmedOrder) {
    progressBar.style.display = 'none';
    return;
  }

  progressBar.style.display = 'flex';

  for (let i = 1; i <= 5; i++) {
    const node = document.getElementById(`step-node-${i}`);
    if (node) {
      if (i < step) {
        node.className = 'checkout-step-node completed';
        node.style.cursor = 'pointer';
        node.onclick = () => setCheckoutStep(i);
      } else if (i === step) {
        node.className = 'checkout-step-node active';
        node.style.cursor = 'default';
        node.onclick = null;
      } else {
        node.className = 'checkout-step-node';
        if (i <= checkoutState.highestStepReached) {
          node.style.cursor = 'pointer';
          node.onclick = () => setCheckoutStep(i);
        } else {
          node.style.cursor = 'default';
          node.onclick = null;
        }
      }
    }

    if (i < 5) {
      const conn = document.getElementById(`conn-${i}-${i+1}`);
      if (conn) {
        conn.className = i < step ? 'step-connector completed' : 'step-connector';
      }
    }
  }
}

/**
 * Main Step Router
 */
function renderCheckoutStep(step) {
  const titleEl = document.getElementById('checkout-step-title');
  const bodyEl = document.getElementById('checkout-modal-body');
  const footerEl = document.getElementById('checkout-modal-footer');
  if (!bodyEl || !footerEl) return;

  if (checkoutState.confirmedOrder) {
    renderConfirmationView(bodyEl, footerEl, titleEl);
    return;
  }

  const financials = calculateCheckoutFinancials();

  switch (step) {
    case 1:
      renderStep1(bodyEl, footerEl, titleEl, financials);
      break;
    case 2:
      renderStep2(bodyEl, footerEl, titleEl);
      break;
    case 3:
      renderStep3(bodyEl, footerEl, titleEl, financials);
      break;
    case 4:
      renderStep4(bodyEl, footerEl, titleEl, financials);
      break;
    case 5:
      renderStep5(bodyEl, footerEl, titleEl, financials);
      break;
    default:
      renderStep1(bodyEl, footerEl, titleEl, financials);
  }
}

/**
 * STEP 1: REVIEW YOUR ORDER
 */
function renderStep1(bodyEl, footerEl, titleEl, financials) {
  if (titleEl) titleEl.textContent = "Review Your Order";

  if (!financials.items || financials.items.length === 0) {
    bodyEl.innerHTML = `
      <div style="text-align: center; padding: 44px 16px; color: #6B7280;">
        <div style="font-size: 2.8rem; margin-bottom: 14px;">🛍️</div>
        <h3 style="font-family: var(--font-display); font-size: 1.2rem; font-weight: 800; color: #111827; margin: 0 0 6px 0;">Your Bag is Empty</h3>
        <p style="font-size: 0.88rem; line-height: 1.45; margin: 0 0 24px 0;">Select your ready-to-eat skewers or finish-at-home boxes from the menu to continue.</p>
        <button type="button" class="btn-checkout-back" onclick="closeCheckout();" style="width: auto; padding: 10px 24px;">← Back to Menu</button>
      </div>
    `;
    footerEl.innerHTML = `
      <button type="button" class="btn-checkout-back" onclick="closeCheckout();">← Back to Menu</button>
      <button type="button" class="btn-checkout-next" disabled>Continue to Customer Details →</button>
    `;
    return;
  }

  const itemsHtml = financials.items.map(item => `
    <div style="display: flex; gap: 12px; align-items: flex-start; padding: 14px 0; border-bottom: 1px solid #F3F4F6;">
      <img src="${item.image}" alt="${escapeHtml(item.name)}" style="width: 56px; height: 56px; border-radius: 10px; object-fit: cover; border: 1px solid #E5E7EB; flex-shrink: 0;" />
      <div style="flex: 1; min-width: 0;">
        <div style="font-weight: 700; font-size: 0.95rem; color: #111827; line-height: 1.25;">${escapeHtml(item.name)}</div>
        <div style="font-size: 0.78rem; color: #6B7280; margin-top: 2px;">
          ${escapeHtml(item.unit || item.description || '')}
        </div>
        <div style="font-size: 0.82rem; color: #374151; font-weight: 600; margin-top: 4px;">
          $${item.effectiveUnitPrice.toFixed(2)} each
          ${item.isBoxDiscounted ? `<span style="color:#B45309; font-weight:700;">(Bulk tier: -$0.50/box)</span>` : ''}
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <button type="button" onclick="modifyCartItemQty('${item.id}', -1)" style="width: 30px; height: 30px; border: 1.5px solid #CBD5E1; background: white; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;" aria-label="Decrease quantity">-</button>
          <span style="font-weight: 800; font-size: 0.95rem; min-width: 22px; text-align: center;">${item.quantity}</span>
          <button type="button" onclick="modifyCartItemQty('${item.id}', 1)" style="width: 30px; height: 30px; border: 1.5px solid #CBD5E1; background: white; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;" aria-label="Increase quantity">+</button>
        </div>
        <div style="font-weight: 800; font-size: 1rem; color: #111827; margin-top: 2px;">$${item.lineTotal.toFixed(2)}</div>
        <button type="button" class="btn-item-remove" onclick="removeItemFromCart('${item.id}')" aria-label="Remove item">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          Remove
        </button>
      </div>
    </div>
  `).join('');

  bodyEl.innerHTML = `
    <div>
      <p style="font-size: 0.88rem; color: #4B5563; margin-bottom: 14px;">
        Check your items before continuing.
      </p>

      <div style="background: #FFFFFF; border-radius: 12px; margin-bottom: 16px;">
        ${itemsHtml}
      </div>

      <div style="background: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 14px; padding: 16px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #4B5563; margin-bottom: 8px;">
          <span>Subtotal (${financials.totalItemsCount} items)</span>
          <span style="font-weight: 600; color: #111827;">$${financials.subtotal.toFixed(2)}</span>
        </div>
        ${financials.discountSavings > 0 ? `
          <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: #059669; font-weight: 700; margin-bottom: 8px;">
            <span>Finish-at-Home Bulk Savings (3+ boxes)</span>
            <span>-$${financials.discountSavings.toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: #4B5563; margin-bottom: 8px;">
          <span>Delivery fee</span>
          <span class="delivery-fee-badge">To be confirmed</span>
        </div>
        <div style="font-size: 0.75rem; color: #6B7280; margin-bottom: 10px; line-height: 1.35;">
          Direct courier delivery is arranged across Harare. Final delivery fee is confirmed upon courier dispatch.
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 1.25rem; font-weight: 800; color: #111827; padding-top: 10px; border-top: 1.5px solid #E5E7EB;">
          <span style="font-family: var(--font-display);">Total</span>
          <span style="font-family: var(--font-display); color: #121214;">$${financials.grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;

  footerEl.innerHTML = `
    <button type="button" class="btn-checkout-back" onclick="closeCheckout();">← Back to Menu</button>
    <button type="button" class="btn-checkout-next" onclick="setCheckoutStep(2);">Continue to Customer Details →</button>
  `;
}

/**
 * STEP 2: CUSTOMER DETAILS
 */
function renderStep2(bodyEl, footerEl, titleEl) {
  if (titleEl) titleEl.textContent = "Your Details";
  const errs = checkoutState.validationErrors || {};

  bodyEl.innerHTML = `
    <div>
      <p style="font-size: 0.88rem; color: #4B5563; margin-bottom: 16px;">
        Tell us who to contact about your delivery.
      </p>

      <div class="form-group">
        <label class="form-label" for="checkout-name-input">
          Full Name <span class="required-star">*</span>
        </label>
        <input 
          type="text" 
          id="checkout-name-input" 
          class="form-input ${errs.customerName ? 'error' : ''}" 
          placeholder="Enter your full name"
          value="${escapeHtml(checkoutState.customerName)}"
          autocomplete="name"
        />
        <div class="form-error-msg ${errs.customerName ? 'visible' : ''}">
          ${errs.customerName || ''}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="checkout-phone-input">
          Phone Number <span class="required-star">*</span>
        </label>
        <input 
          type="tel" 
          id="checkout-phone-input" 
          class="form-input ${errs.customerPhone ? 'error' : ''}" 
          placeholder="e.g. 0771234567"
          value="${escapeHtml(checkoutState.customerPhone)}"
          autocomplete="tel"
        />
        <div class="form-help-text">Our delivery team will contact you on this number when dispatching and delivering.</div>
        <div class="form-error-msg ${errs.customerPhone ? 'visible' : ''}">
          ${errs.customerPhone || ''}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="checkout-alt-phone-input">
          Additional Contact Information <span style="font-weight: 500; color: #6B7280;">(Optional)</span>
        </label>
        <input 
          type="text" 
          id="checkout-alt-phone-input" 
          class="form-input" 
          placeholder="e.g. Alternate phone or WhatsApp number"
          value="${escapeHtml(checkoutState.additionalContact)}"
        />
        <div class="form-help-text">Optional secondary contact if your primary phone is busy.</div>
      </div>
    </div>
  `;

  const nameInput = document.getElementById('checkout-name-input');
  const phoneInput = document.getElementById('checkout-phone-input');
  const altInput = document.getElementById('checkout-alt-phone-input');

  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      checkoutState.customerName = e.target.value;
      localStorage.setItem('bamboo_select_customer_name', checkoutState.customerName);
      if (checkoutState.validationErrors.customerName) {
        delete checkoutState.validationErrors.customerName;
        e.target.classList.remove('error');
      }
    });
  }

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      checkoutState.customerPhone = e.target.value;
      localStorage.setItem('bamboo_select_customer_phone', checkoutState.customerPhone);
      if (checkoutState.validationErrors.customerPhone) {
        delete checkoutState.validationErrors.customerPhone;
        e.target.classList.remove('error');
      }
    });
  }

  if (altInput) {
    altInput.addEventListener('input', (e) => {
      checkoutState.additionalContact = e.target.value;
      localStorage.setItem('bamboo_select_additional_contact', checkoutState.additionalContact);
    });
  }

  footerEl.innerHTML = `
    <button type="button" class="btn-checkout-back" onclick="setCheckoutStep(1);">← Back to Order Review</button>
    <button type="button" class="btn-checkout-next" onclick="setCheckoutStep(3);">Continue to Delivery Details →</button>
  `;
}

/**
 * STEP 3: DELIVERY DETAILS (DELIVERY-ONLY)
 */
function renderStep3(bodyEl, footerEl, titleEl, financials) {
  if (titleEl) titleEl.textContent = "Where Should We Deliver?";
  const errs = checkoutState.validationErrors || {};

  bodyEl.innerHTML = `
    <div>
      <div class="delivery-notice-banner">
        <div class="icon">🛵</div>
        <div>
          <div class="text-title">Delivery Only</div>
          <div class="text-desc">
            Bamboo Chicken Select is delivery only. Pickup, collection, or store pickup is not available. Provide a clear location so our team can arrange your delivery.
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="checkout-location-input">
          Delivery Location <span class="required-star">*</span>
        </label>
        <input 
          type="text" 
          id="checkout-location-input" 
          class="form-input ${errs.deliveryLocation ? 'error' : ''}" 
          placeholder="Enter your area, street, or location"
          value="${escapeHtml(checkoutState.deliveryLocation)}"
          autocomplete="street-address"
        />
        <div class="form-error-msg ${errs.deliveryLocation ? 'visible' : ''}">
          ${errs.deliveryLocation || ''}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="checkout-landmark-input">
          Nearby Landmark <span class="required-star">*</span>
        </label>
        <input 
          type="text" 
          id="checkout-landmark-input" 
          class="form-input ${errs.nearbyLandmark ? 'error' : ''}" 
          placeholder="e.g. Near Sam Levy's / Opposite Meikles Hotel"
          value="${escapeHtml(checkoutState.nearbyLandmark)}"
        />
        <div class="form-help-text">A well-known building, school, shop, or intersection helps our courier locate you without delay.</div>
        <div class="form-error-msg ${errs.nearbyLandmark ? 'visible' : ''}">
          ${errs.nearbyLandmark || ''}
        </div>
      </div>

      <div class="form-group">
        <label class="form-label" for="checkout-instructions-input">
          Delivery Instructions <span style="font-weight: 500; color: #6B7280;">(Optional)</span>
        </label>
        <textarea 
          id="checkout-instructions-input" 
          rows="2" 
          class="form-textarea" 
          placeholder="Gate details, directions, preferred contact instructions, or other useful information."
        >${escapeHtml(checkoutState.deliveryInstructions)}</textarea>
      </div>

      <!-- Compact Delivery Summary -->
      <div class="review-summary-box">
        <div class="review-summary-header">
          <span class="review-summary-title">Delivery Summary</span>
          <span class="payment-badge payment-badge-active" style="margin-left: 0;">Delivery only</span>
        </div>
        <div style="font-size: 0.88rem; color: #111827; margin-bottom: 4px;">
          👤 Recipient: <strong>${escapeHtml(checkoutState.customerName || 'Pending entry')}</strong> • 📞 <strong>${escapeHtml(checkoutState.customerPhone || 'Pending entry')}</strong>
        </div>
        <div style="font-size: 0.84rem; color: #4B5563; margin-top: 6px;">
          📍 Delivery Location: <strong>${escapeHtml(checkoutState.deliveryLocation || 'Pending entry')}</strong>
        </div>
        <div style="font-size: 0.84rem; color: #4B5563; margin-top: 2px;">
          🏛️ Landmark: <strong>${escapeHtml(checkoutState.nearbyLandmark || 'Pending entry')}</strong>
        </div>
        ${checkoutState.deliveryInstructions ? `
          <div style="font-size: 0.82rem; color: #6B7280; margin-top: 4px;">
            📝 Instructions: ${escapeHtml(checkoutState.deliveryInstructions)}
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed #E5E7EB; padding-top: 8px; margin-top: 8px; font-size: 0.84rem;">
          <span style="color: #6B7280;">Delivery fee:</span>
          <span class="delivery-fee-badge">To be confirmed</span>
        </div>
      </div>
    </div>
  `;

  const locationInput = document.getElementById('checkout-location-input');
  const landmarkInput = document.getElementById('checkout-landmark-input');
  const instructionsInput = document.getElementById('checkout-instructions-input');

  if (locationInput) {
    locationInput.addEventListener('input', (e) => {
      checkoutState.deliveryLocation = e.target.value;
      localStorage.setItem('bamboo_select_delivery_location', checkoutState.deliveryLocation);
      if (checkoutState.validationErrors.deliveryLocation) {
        delete checkoutState.validationErrors.deliveryLocation;
        e.target.classList.remove('error');
      }
    });
  }

  if (landmarkInput) {
    landmarkInput.addEventListener('input', (e) => {
      checkoutState.nearbyLandmark = e.target.value;
      localStorage.setItem('bamboo_select_nearby_landmark', checkoutState.nearbyLandmark);
      if (checkoutState.validationErrors.nearbyLandmark) {
        delete checkoutState.validationErrors.nearbyLandmark;
        e.target.classList.remove('error');
      }
    });
  }

  if (instructionsInput) {
    instructionsInput.addEventListener('input', (e) => {
      checkoutState.deliveryInstructions = e.target.value;
      localStorage.setItem('bamboo_select_delivery_instructions', checkoutState.deliveryInstructions);
    });
  }

  footerEl.innerHTML = `
    <button type="button" class="btn-checkout-back" onclick="setCheckoutStep(2);">← Back to Customer Details</button>
    <button type="button" class="btn-checkout-next" onclick="setCheckoutStep(4);">Continue to Payment →</button>
  `;
}

/**
 * STEP 4: PAYMENT METHOD
 */
function renderStep4(bodyEl, footerEl, titleEl, financials) {
  if (titleEl) titleEl.textContent = "Choose Payment Method";

  bodyEl.innerHTML = `
    <div>
      <p style="font-size: 0.88rem; color: #4B5563; margin-bottom: 16px;">
        Select how you would like to pay for your delivery.
      </p>

      <!-- Option 1: Cash on Delivery (Active & Operational) -->
      <div 
        class="payment-card-option ${checkoutState.paymentMethod === 'Cash on Delivery' ? 'selected' : ''}" 
        onclick="selectPaymentMethod('Cash on Delivery')"
        id="payment-option-cod"
      >
        <input 
          type="radio" 
          name="payment_choice" 
          id="pay-cod" 
          class="payment-radio" 
          ${checkoutState.paymentMethod === 'Cash on Delivery' ? 'checked' : ''} 
        />
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <label for="pay-cod" style="font-weight: 700; font-size: 0.95rem; color: #111827; cursor: pointer;">
              Cash on Delivery
            </label>
            <span class="payment-badge payment-badge-active">Available</span>
          </div>
          <div style="font-size: 0.82rem; color: #4B5563; line-height: 1.4;">
            Pay the delivery team when your order arrives. Exact change is appreciated.
          </div>
        </div>
      </div>

      <!-- Option 2: EcoCash (Placeholder / Coming Soon) -->
      <div 
        class="payment-card-option disabled" 
        onclick="selectPaymentMethod('EcoCash')"
        id="payment-option-ecocash"
      >
        <input 
          type="radio" 
          name="payment_choice" 
          id="pay-ecocash" 
          class="payment-radio" 
          disabled 
        />
        <div style="flex: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <label for="pay-ecocash" style="font-weight: 700; font-size: 0.95rem; color: #6B7280; cursor: not-allowed;">
              EcoCash
            </label>
            <span class="payment-badge payment-badge-pending">Coming Soon</span>
          </div>
          <div style="font-size: 0.82rem; color: #6B7280; line-height: 1.4;">
            EcoCash payments will be enabled once the merchant details are confirmed.
          </div>
        </div>
      </div>

      <!-- Selected Payment Summary -->
      <div style="background: #F9FAFB; border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 14px 16px; margin-top: 18px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <span style="font-size: 0.85rem; color: #6B7280; font-weight: 600;">Selected Payment Method:</span>
          <span style="font-weight: 800; font-size: 0.92rem; color: #111827;">💵 ${escapeHtml(checkoutState.paymentMethod)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: baseline;">
          <span style="font-size: 0.85rem; color: #6B7280; font-weight: 600;">Amount Due on Delivery:</span>
          <span style="font-family: var(--font-display); font-size: 1.3rem; font-weight: 800; color: #111827;">$${financials.grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;

  footerEl.innerHTML = `
    <button type="button" class="btn-checkout-back" onclick="setCheckoutStep(3);">← Back to Delivery Details</button>
    <button type="button" class="btn-checkout-next" onclick="setCheckoutStep(5);">Review Final Order →</button>
  `;
}

function selectPaymentMethod(method) {
  if (method === 'EcoCash') {
    showToastNotification("EcoCash payments will be enabled once the merchant details are confirmed. Please use Cash on Delivery.");
    return;
  }
  checkoutState.paymentMethod = method;
  renderCheckoutStep(4);
}

/**
 * STEP 5: CONFIRM AND PLACE ORDER
 */
function renderStep5(bodyEl, footerEl, titleEl, financials) {
  if (titleEl) titleEl.textContent = "Confirm Your Order";

  const itemsHtml = financials.items.map(item => `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 8px 0; border-bottom: 1px dashed #E5E7EB; font-size: 0.88rem;">
      <div style="flex: 1; padding-right: 8px;">
        <span style="font-weight: 700; color: #111827;">${item.quantity}x</span>
        <span style="color: #374151; margin-left: 4px; font-weight: 600;">${escapeHtml(item.name)}</span>
        ${item.unit ? `<span style="font-size: 0.78rem; color: #6B7280;">(${escapeHtml(item.unit)})</span>` : ''}
        ${item.isBoxDiscounted ? `<span style="font-size: 0.75rem; color: #B45309; font-weight: 700;">(Bulk Tier)</span>` : ''}
        <div style="font-size: 0.75rem; color: #6B7280;">$${item.effectiveUnitPrice.toFixed(2)} each</div>
      </div>
      <div style="font-weight: 800; color: #111827;">
        $${item.lineTotal.toFixed(2)}
      </div>
    </div>
  `).join('');

  bodyEl.innerHTML = `
    <div>
      <p style="font-size: 0.88rem; color: #4B5563; margin-bottom: 14px;">
        Please check your details carefully before placing your order.
      </p>

      <!-- SECTION A: ORDER SUMMARY -->
      <div class="review-summary-box">
        <div class="review-summary-header">
          <span class="review-summary-title">Section A — Order Summary</span>
          <button type="button" class="review-edit-link" onclick="setCheckoutStep(1);">Edit Items</button>
        </div>
        <div style="margin-bottom: 10px;">
          ${itemsHtml}
        </div>
        <div style="border-top: 1.5px solid #E5E7EB; padding-top: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 0.86rem; color: #4B5563; margin-bottom: 4px;">
            <span>Subtotal</span>
            <span style="font-weight: 600; color: #111827;">$${financials.subtotal.toFixed(2)}</span>
          </div>
          ${financials.discountSavings > 0 ? `
            <div style="display: flex; justify-content: space-between; font-size: 0.86rem; color: #059669; font-weight: 700; margin-bottom: 4px;">
              <span>Bulk Savings (3+ boxes)</span>
              <span>-$${financials.discountSavings.toFixed(2)}</span>
            </div>
          ` : ''}
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.86rem; color: #4B5563; margin-bottom: 6px;">
            <span>Delivery fee</span>
            <span class="delivery-fee-badge">To be confirmed</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 1.15rem; font-weight: 800; color: #111827; border-top: 1px solid #E5E7EB; padding-top: 8px;">
            <span style="font-family: var(--font-display);">Final Total</span>
            <span style="font-family: var(--font-display); color: #121214;">$${financials.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- SECTION B: CUSTOMER -->
      <div class="review-summary-box">
        <div class="review-summary-header">
          <span class="review-summary-title">Section B — Customer</span>
          <button type="button" class="review-edit-link" onclick="setCheckoutStep(2);">Edit</button>
        </div>
        <div style="font-size: 0.92rem; font-weight: 700; color: #111827; margin-bottom: 2px;">
          👤 ${escapeHtml(checkoutState.customerName)}
        </div>
        <div style="font-size: 0.86rem; color: #4B5563;">
          📞 ${escapeHtml(checkoutState.customerPhone)}
        </div>
        ${checkoutState.additionalContact ? `
          <div style="font-size: 0.82rem; color: #6B7280; margin-top: 2px;">
            Alternate: ${escapeHtml(checkoutState.additionalContact)}
          </div>
        ` : ''}
      </div>

      <!-- SECTION C: DELIVERY -->
      <div class="review-summary-box">
        <div class="review-summary-header">
          <span class="review-summary-title">Section C — Delivery</span>
          <button type="button" class="review-edit-link" onclick="setCheckoutStep(3);">Edit</button>
        </div>
        <div style="display: inline-block; margin-bottom: 6px;">
          <span class="payment-badge payment-badge-active" style="margin-left: 0;">Delivery only</span>
        </div>
        <div style="font-size: 0.88rem; color: #111827; font-weight: 700; margin-bottom: 2px;">
          📍 ${escapeHtml(checkoutState.deliveryLocation)}
        </div>
        <div style="font-size: 0.84rem; color: #4B5563; margin-bottom: 2px;">
          🏛️ Landmark: ${escapeHtml(checkoutState.nearbyLandmark)}
        </div>
        ${checkoutState.deliveryInstructions ? `
          <div style="font-size: 0.82rem; color: #6B7280; margin-top: 3px;">
            📝 Instructions: ${escapeHtml(checkoutState.deliveryInstructions)}
          </div>
        ` : ''}
      </div>

      <!-- SECTION D: PAYMENT -->
      <div class="review-summary-box">
        <div class="review-summary-header">
          <span class="review-summary-title">Section D — Payment</span>
          <button type="button" class="review-edit-link" onclick="setCheckoutStep(4);">Edit</button>
        </div>
        <div style="font-weight: 700; color: #111827; font-size: 0.92rem; margin-bottom: 3px;">
          💵 ${escapeHtml(checkoutState.paymentMethod)}
        </div>
        <div style="font-size: 0.82rem; color: #4B5563;">
          Payment will be made when your order is delivered.
        </div>
      </div>

      <!-- Customer Confirmation Checkbox -->
      <div class="checkout-confirm-check-group ${checkoutState.validationErrors.confirmCheck ? 'has-error' : ''}" id="confirm-check-wrapper" onclick="toggleConfirmCheckbox()">
        <input 
          type="checkbox" 
          id="confirm-order-checkbox" 
          class="checkout-confirm-checkbox" 
          ${checkoutState.confirmedCheckbox ? 'checked' : ''} 
          onclick="event.stopPropagation(); toggleConfirmCheckbox();"
        />
        <label for="confirm-order-checkbox" class="checkout-confirm-label" onclick="event.stopPropagation(); toggleConfirmCheckbox();">
          I confirm that my order details and delivery information are correct.
        </label>
      </div>
      <div class="form-error-msg ${checkoutState.validationErrors.confirmCheck ? 'visible' : ''}" id="confirm-check-error" style="margin-bottom: 12px;">
        Please confirm that your order details and delivery information are correct before placing your order.
      </div>
    </div>
  `;

  footerEl.innerHTML = `
    <button type="button" class="btn-checkout-back" onclick="setCheckoutStep(4);" ${checkoutState.isSubmitting ? 'disabled' : ''}>← Back to Payment</button>
    <button type="button" class="btn-checkout-next" id="place-order-submit-btn" onclick="executeOrderSubmission();" ${checkoutState.isSubmitting ? 'disabled' : ''} style="background: #121214; color: white;">
      ${checkoutState.isSubmitting ? 'Placing Order…' : `Place Order ($${financials.grandTotal.toFixed(2)})`}
    </button>
  `;
}

function toggleConfirmCheckbox() {
  const checkbox = document.getElementById('confirm-order-checkbox');
  const wrapper = document.getElementById('confirm-check-wrapper');
  const errorMsg = document.getElementById('confirm-check-error');

  checkoutState.confirmedCheckbox = !checkoutState.confirmedCheckbox;
  if (checkbox) checkbox.checked = checkoutState.confirmedCheckbox;

  if (checkoutState.confirmedCheckbox) {
    if (wrapper) wrapper.classList.remove('has-error');
    if (errorMsg) errorMsg.classList.remove('visible');
    delete checkoutState.validationErrors.confirmCheck;
  }
}

/**
 * ORDER SUBMISSION TO WORKER API & D1
 */
async function executeOrderSubmission() {
  if (checkoutState.isSubmitting) return;

  // Validation checks
  if (!appState.cart || appState.cart.length === 0) {
    showToastNotification("Your bag is empty. Please select items first.");
    setCheckoutStep(1);
    return;
  }

  if (!validateStep2Fields()) {
    showToastNotification("Please complete all required customer details.");
    setCheckoutStep(2);
    return;
  }

  if (!validateStep3Fields()) {
    showToastNotification("Please provide your delivery location and landmark.");
    setCheckoutStep(3);
    return;
  }

  if (!checkoutState.confirmedCheckbox) {
    checkoutState.validationErrors.confirmCheck = true;
    const wrapper = document.getElementById('confirm-check-wrapper');
    const errorMsg = document.getElementById('confirm-check-error');
    if (wrapper) wrapper.classList.add('has-error');
    if (errorMsg) errorMsg.classList.add('visible');
    showToastNotification("Please confirm that your order details are correct.");
    return;
  }

  const financials = calculateCheckoutFinancials();
  checkoutState.isSubmitting = true;

  const submitBtn = document.getElementById('place-order-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Placing Order…';
  }

  // Format notes field to contain delivery location, landmark, instructions, and alt contact
  const notesLines = [
    `Delivery Location: ${checkoutState.deliveryLocation.trim()}`,
    `Landmark: ${checkoutState.nearbyLandmark.trim()}`
  ];
  if (checkoutState.deliveryInstructions.trim()) {
    notesLines.push(`Instructions: ${checkoutState.deliveryInstructions.trim()}`);
  }
  if (checkoutState.additionalContact.trim()) {
    notesLines.push(`Alt Contact: ${checkoutState.additionalContact.trim()}`);
  }
  const notesText = notesLines.join('\n');

  const apiPayload = {
    customer_name: checkoutState.customerName.trim(),
    phone: checkoutState.customerPhone.trim(),
    items: financials.items.map(item => ({
      name: item.name,
      qty: item.quantity,
      quantity: item.quantity,
      price: parseFloat(item.effectiveUnitPrice.toFixed(2)),
      options: item.unit || item.description || ""
    })),
    total: parseFloat(financials.grandTotal.toFixed(2)),
    delivery_fee: 0.00,
    notes: notesText,
    payment_method: checkoutState.paymentMethod,
    type: "delivery",
    order_status: "new",
    status: "new",
    payment_status: "pending"
  };

  try {
    console.log("Submitting order to Cloudflare Worker API:", `${API_BASE}/orders`);
    const postResponse = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiPayload)
    });

    if (!postResponse.ok) {
      throw new Error(`Worker API returned status ${postResponse.status}`);
    }

    const postJson = await postResponse.json().catch(() => ({}));
    if (postJson && postJson.success === false) {
      throw new Error(postJson.error || "Order submission failed on server");
    }

    // Retrieve confirmed Order ID from D1
    let confirmedOrderId = null;
    try {
      const getRes = await fetch(`${API_BASE}/orders?_t=${Date.now()}`);
      if (getRes.ok) {
        const ordersList = await getRes.json();
        if (Array.isArray(ordersList) && ordersList.length > 0) {
          const match = ordersList.find(o => o.phone === checkoutState.customerPhone.trim()) || ordersList[0];
          if (match && match.id) {
            confirmedOrderId = String(match.id).startsWith('BC-') ? String(match.id) : `BC-${match.id}`;
          }
        }
      }
    } catch (fetchErr) {
      console.warn("Could not query assigned order ID from D1:", fetchErr);
    }

    if (!confirmedOrderId) {
      confirmedOrderId = `BC-${Date.now().toString().slice(-4)}`;
    }

    // Save confirmed order record
    checkoutState.confirmedOrder = {
      orderId: confirmedOrderId,
      customerName: checkoutState.customerName,
      customerPhone: checkoutState.customerPhone,
      deliveryLocation: checkoutState.deliveryLocation,
      nearbyLandmark: checkoutState.nearbyLandmark,
      deliveryInstructions: checkoutState.deliveryInstructions,
      paymentMethod: checkoutState.paymentMethod,
      grandTotal: financials.grandTotal,
      items: financials.items,
      createdAt: new Date().toISOString()
    };

    // Clear cart and card steppers
    appState.cart = [];
    SELECT_CATALOG.forEach(item => {
      appState.cardQuantities[item.id] = 1;
    });
    renderMenu();
    updateCartUI();

    checkoutState.isSubmitting = false;
    renderCheckoutProgress(5);
    renderCheckoutStep(5);

  } catch (error) {
    console.error("Order submission failed:", error);
    checkoutState.isSubmitting = false;
    showToastNotification("We could not submit your order. Please check your network connection and try again.");

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `Place Order ($${financials.grandTotal.toFixed(2)})`;
    }
  }
}

/**
 * Copy Order ID with visual feedback and fallback
 */
function copyOrderId(orderId) {
  if (!orderId) return;
  const textToCopy = orderId.startsWith('#') ? orderId : `#${orderId}`;
  const copyBtn = document.getElementById('copy-order-id-btn');

  const onCopied = () => {
    if (copyBtn) {
      copyBtn.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Copied!</span>
      `;
      copyBtn.classList.add('copied');
      setTimeout(() => {
        if (copyBtn) {
          copyBtn.innerHTML = `
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          `;
          copyBtn.classList.remove('copied');
        }
      }, 2200);
    }
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(textToCopy).then(onCopied).catch(() => {
      fallbackCopy(textToCopy, onCopied);
    });
  } else {
    fallbackCopy(textToCopy, onCopied);
  }
}

function fallbackCopy(text, callback) {
  try {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    if (callback) callback();
  } catch (e) {
    console.warn("Fallback copy failed:", e);
  }
}

/**
 * PREMIUM ORDER SUCCESS SCREEN (Confirmation View)
 */
function renderConfirmationView(bodyEl, footerEl, titleEl) {
  const order = checkoutState.confirmedOrder;
  if (!order) return;

  // Remove the cluttered 5-step progress bar from the success screen
  const progressBar = document.getElementById('checkout-progress-bar');
  if (progressBar) progressBar.style.display = 'none';

  // Update modal header state to reflect completion
  const brandBadge = document.querySelector('.checkout-brand-badge');
  if (brandBadge) brandBadge.textContent = 'Bamboo Chicken Select';
  if (titleEl) titleEl.textContent = 'Order Confirmed';

  // Format Order ID
  const cleanId = String(order.orderId || '').replace(/^#+/, '');
  const displayId = cleanId.startsWith('BC-') ? cleanId : `BC-${cleanId}`;

  // Format Items list
  const totalItemCount = order.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const itemsHtml = order.items.map(item => {
    const unitPrice = typeof item.effectiveUnitPrice === 'number' ? item.effectiveUnitPrice : item.price;
    const lineTotal = typeof item.lineTotal === 'number' ? item.lineTotal : (unitPrice * item.quantity);
    return `
      <div class="success-item-row">
        <div class="success-item-left">
          <span class="success-item-qty">${item.quantity}×</span>
          <div class="success-item-meta">
            <span class="success-item-name">${escapeHtml(item.name)}</span>
            ${item.unit ? `<span class="success-item-desc">${escapeHtml(item.unit)}</span>` : ''}
          </div>
        </div>
        <div class="success-item-right">
          <span class="success-item-subtotal">$${lineTotal.toFixed(2)}</span>
          <span class="success-item-each">$${unitPrice.toFixed(2)} ea</span>
        </div>
      </div>
    `;
  }).join('');

  // Payment method explanation
  let paymentExplanation = "Pay when your order arrives.";
  if (order.paymentMethod && order.paymentMethod.toLowerCase().includes('ecocash')) {
    paymentExplanation = "Payment pending cashier verification.";
  }

  bodyEl.innerHTML = `
    <div class="confirmation-view-wrapper">
      <!-- 1. Success Hero Header -->
      <div class="success-hero-header">
        <div class="success-icon-badge" aria-hidden="true">
          <div class="success-icon-inner">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        </div>

        <div class="success-status-pill">
          <span class="status-pulse-dot"></span>
          <span>ORDER RECEIVED</span>
        </div>

        <h2 class="success-title">Your Order Is In.</h2>

        <p class="success-subtitle">
          Your order has been successfully sent to Bamboo Chicken. Our team will review it and arrange your delivery.
        </p>
      </div>

      <!-- 2. Order Number Section (Prominent & Elegant) -->
      <div class="success-order-card">
        <div class="order-card-top">
          <span class="order-number-tag">YOUR ORDER NUMBER</span>
          <button type="button" class="btn-copy-order-id" id="copy-order-id-btn" onclick="copyOrderId('${displayId}')" aria-label="Copy Order Number">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <span>Copy</span>
          </button>
        </div>
        <div class="order-id-main-value">#${escapeHtml(displayId)}</div>
        <p class="order-id-instruction">Keep this number for order confirmation or delivery questions.</p>
      </div>

      <!-- 3. Structured Order Summary -->
      <div class="success-summary-card">
        <div class="summary-card-header">
          <div class="summary-header-title">
            <span>Order Summary</span>
          </div>
          <span class="summary-delivery-badge">Delivery only</span>
        </div>

        <div class="summary-grid">
          <!-- Customer -->
          <div class="summary-info-block">
            <div class="info-block-label">Customer</div>
            <div class="info-block-primary">${escapeHtml(order.customerName)}</div>
            <div class="info-block-sub">${escapeHtml(order.customerPhone)}</div>
          </div>

          <!-- Delivery Destination -->
          <div class="summary-info-block">
            <div class="info-block-label">Delivery Location</div>
            <div class="info-block-primary">${escapeHtml(order.deliveryLocation)}</div>
            <div class="info-block-sub"><strong style="color: #374151;">Landmark:</strong> ${escapeHtml(order.nearbyLandmark)}</div>
            ${order.deliveryInstructions && order.deliveryInstructions.trim() ? `
              <div class="info-block-notes">
                <strong>Instructions:</strong> ${escapeHtml(order.deliveryInstructions.trim())}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Items Ordered -->
        <div class="success-items-wrap">
          <div class="items-wrap-title">Items Ordered (${totalItemCount})</div>
          <div>${itemsHtml}</div>
        </div>

        <!-- Payment & Total To Pay -->
        <div class="success-payment-bar">
          <div class="payment-method-box">
            <div class="payment-method-name">
              <span>💵</span>
              <span>${escapeHtml(order.paymentMethod)}</span>
            </div>
            <div class="payment-subtext">${escapeHtml(paymentExplanation)}</div>
          </div>
          <div class="total-pay-box">
            <span class="total-pay-label">Total to Pay</span>
            <span class="total-pay-amount">$${order.grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <!-- 4. What Happens Next (Reassuring, Calm Timeline) -->
      <div class="success-next-steps">
        <div class="next-steps-header">
          <span class="next-steps-title">WHAT HAPPENS NEXT</span>
          <span class="next-steps-tag">Pending Review</span>
        </div>

        <div class="next-steps-list">
          <div class="next-step-row active">
            <span class="step-badge-num">01</span>
            <div class="step-details">
              <div class="step-heading">Order received</div>
              <div class="step-body">Your order has been sent to the Bamboo Chicken team.</div>
            </div>
          </div>

          <div class="next-step-row upcoming">
            <span class="step-badge-num">02</span>
            <div class="step-details">
              <div class="step-heading">Kitchen review</div>
              <div class="step-body">The team reviews your order and prepares it for delivery.</div>
            </div>
          </div>

          <div class="next-step-row upcoming">
            <span class="step-badge-num">03</span>
            <div class="step-details">
              <div class="step-heading">Delivery</div>
              <div class="step-body">The team will arrange delivery using the details you provided.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Bamboo Chicken Customer Care (Polished, Non-intrusive) -->
      <div class="success-care-card">
        <div class="care-card-header">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D97706" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span class="care-card-title">Need help with your order?</span>
        </div>
        <p class="care-card-text">
          For order confirmation or delivery questions, contact Bamboo Chicken on <strong>${BAMBOO_CONTACT_NUMBER}</strong>.
        </p>
        <a href="tel:${BAMBOO_CONTACT_NUMBER}" class="btn-call-care">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
          <span>Call Bamboo Chicken</span>
        </a>
      </div>

      <!-- 6. Footer Branding Signature -->
      <div class="success-signature-brand">
        Powered by the Warstreet Experience Model
      </div>
    </div>
  `;

  footerEl.innerHTML = `
    <button type="button" class="btn-checkout-next" style="width: 100%; min-height: 48px; font-size: 0.95rem;" onclick="startNewOrder();">
      Continue Browsing
    </button>
  `;
}

/**
 * Resets checkout state and returns to menu
 */
function startNewOrder() {
  checkoutState.confirmedOrder = null;
  checkoutState.currentStep = 1;
  checkoutState.highestStepReached = 1;
  checkoutState.confirmedCheckbox = false;

  const progressBar = document.getElementById('checkout-progress-bar');
  if (progressBar) progressBar.style.display = 'flex';

  const brandBadge = document.querySelector('.checkout-brand-badge');
  if (brandBadge) brandBadge.textContent = 'Select Delivery';

  const titleEl = document.getElementById('checkout-step-title');
  if (titleEl) titleEl.textContent = 'Step 1: Review Order';

  closeCheckout();
  renderMenu();
  updateCartUI();
}

/**
 * HTML sanitization helper
 */
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Export functions to global scope for HTML event attributes
window.adjustCardQuantity = adjustCardQuantity;
window.addCurrentCardToCart = addCurrentCardToCart;
window.modifyCartItemQty = modifyCartItemQty;
window.removeItemFromCart = removeItemFromCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.openCheckout = openCheckout;
window.closeCheckout = closeCheckout;
window.setCheckoutStep = setCheckoutStep;
window.selectPaymentMethod = selectPaymentMethod;
window.toggleConfirmCheckbox = toggleConfirmCheckbox;
window.executeOrderSubmission = executeOrderSubmission;
window.startNewOrder = startNewOrder;
window.copyOrderId = copyOrderId;

