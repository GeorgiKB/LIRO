// LIRO Cart System
const LIRO_CART_KEY = 'lira_cart';
const PROMO_CODES = {
  'LIRO10': { type: 'percent', value: 10, label: '10% отстъпка' },
  'WELCOME20': { type: 'percent', value: 20, label: '20% отстъпка' },
  'NEO15': { type: 'percent', value: 15, label: '15% за LIRO Neo' },
  'FREESHIP': { type: 'fixed', value: 9.99, label: 'Безплатна доставка' },
};

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(LIRO_CART_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(LIRO_CART_KEY, JSON.stringify(cart));
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('lira-cart-updated', { detail: cart }));
}

function addToCart(item) {
  const cart = getCart();
  const existingIndex = cart.findIndex(i =>
    i.id === item.id &&
    i.color === item.color &&
    JSON.stringify(i.options) === JSON.stringify(item.options)
  );

  if (existingIndex >= 0) {
    cart[existingIndex].qty = (cart[existingIndex].qty || 1) + 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  saveCart(cart);
  showAddedToCartNotification(item.name);
}

function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
}

function updateQty(index, qty) {
  const cart = getCart();
  if (qty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].qty = qty;
  }
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function getCartTotal() {
  return getCart().reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
}

function getCartCount() {
  return getCart().reduce((sum, item) => sum + (item.qty || 1), 0);
}

function applyPromo(code) {
  const promo = PROMO_CODES[code.toUpperCase()];
  if (!promo) return null;
  return promo;
}

function calculateDiscount(subtotal, promo) {
  if (!promo) return 0;
  if (promo.type === 'percent') return subtotal * (promo.value / 100);
  if (promo.type === 'fixed') return promo.value;
  return 0;
}

function updateCartBadge() {
  const count = getCartCount();
  document.querySelectorAll('.cart-badge').forEach(badge => {
    badge.textContent = count;
    badge.style.display = count > 0 ? 'flex' : 'none';
  });
}

function showAddedToCartNotification(name) {
  const existing = document.getElementById('lira-cart-notif');
  if (existing) existing.remove();

  const notif = document.createElement('div');
  notif.id = 'lira-cart-notif';
  notif.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="9" stroke="#C5A96A" stroke-width="1.5"/>
        <path d="M6 10l3 3 5-5" stroke="#C5A96A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span><strong>${name}</strong> е добавен в количката</span>
    </div>
  `;
  Object.assign(notif.style, {
    position: 'fixed', bottom: '32px', right: '32px', zIndex: '9999',
    background: '#0D0D14', color: '#FAFAF8', padding: '16px 24px',
    borderRadius: '12px', fontFamily: 'Outfit, sans-serif', fontSize: '14px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.4)', transform: 'translateY(20px)',
    opacity: '0', transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
    border: '1px solid rgba(197,169,106,0.2)'
  });
  document.body.appendChild(notif);
  requestAnimationFrame(() => {
    notif.style.transform = 'translateY(0)';
    notif.style.opacity = '1';
  });
  setTimeout(() => {
    notif.style.transform = 'translateY(20px)';
    notif.style.opacity = '0';
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

// Initialize badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
