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
  showCartDrawer();
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

function getCartPagePath() {
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  return depth > 1 ? 'cart.html' : 'pages/cart.html';
}

function getCheckoutPagePath() {
  const depth = window.location.pathname.split('/').filter(Boolean).length;
  return depth > 1 ? 'checkout.html' : 'pages/checkout.html';
}

function showCartDrawer() {
  let overlay = document.getElementById('liro-drawer-overlay');
  let drawer = document.getElementById('liro-cart-drawer');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'liro-drawer-overlay';
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', background: 'rgba(13,13,20,0.5)',
      zIndex: '10000', opacity: '0',
      transition: 'opacity 0.3s ease', backdropFilter: 'blur(4px)'
    });
    overlay.addEventListener('click', closeCartDrawer);
    document.body.appendChild(overlay);
  }

  if (!drawer) {
    drawer = document.createElement('div');
    drawer.id = 'liro-cart-drawer';
    Object.assign(drawer.style, {
      position: 'fixed', top: '0', right: '0', bottom: '0', width: '420px', maxWidth: '100vw',
      background: '#FAFAF8', zIndex: '10001', display: 'flex', flexDirection: 'column',
      fontFamily: 'Outfit, sans-serif', transform: 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.32,0.72,0,1)',
      boxShadow: '-8px 0 40px rgba(13,13,20,0.18)'
    });
    document.body.appendChild(drawer);
  }

  renderCartDrawer(drawer);

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
    drawer.style.transform = 'translateX(0)';
  });

  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const overlay = document.getElementById('liro-drawer-overlay');
  const drawer = document.getElementById('liro-cart-drawer');
  if (!drawer) return;
  overlay.style.opacity = '0';
  drawer.style.transform = 'translateX(100%)';
  setTimeout(() => {
    overlay && overlay.remove();
    drawer && drawer.remove();
    document.body.style.overflow = '';
  }, 350);
}

function renderCartDrawer(drawer) {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * (i.qty || 1), 0);
  const cartPath = getCartPagePath();
  const checkoutPath = getCheckoutPagePath();

  const itemsHTML = cart.length === 0
    ? `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;color:#8A8A8A;padding:40px 24px;text-align:center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C5C5C5" stroke-width="1.2"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p style="font-size:15px;font-weight:500;color:#4A4A4A">Количката е празна</p>
      </div>`
    : cart.map((item, idx) => `
        <div style="display:flex;gap:14px;padding:16px 0;border-bottom:1px solid #EBEBEB;align-items:center">
          <img src="${item.img || 'https://placehold.co/64x64'}" alt="${item.name}" style="width:64px;height:64px;object-fit:contain;border-radius:10px;background:#F0EFE9;flex-shrink:0" />
          <div style="flex:1;min-width:0">
            <p style="font-size:14px;font-weight:600;color:#0D0D14;margin:0 0 2px">${item.name}</p>
            <p style="font-size:12px;color:#8A8A8A;margin:0 0 8px">${item.meta || item.color || ''}</p>
            <div style="display:flex;align-items:center;gap:8px">
              <button onclick="drawerUpdateQty(${idx},${(item.qty||1)-1})" style="width:26px;height:26px;border-radius:6px;border:1px solid #DCDCDC;background:#FFF;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0D0D14">−</button>
              <span style="font-size:14px;font-weight:500;min-width:20px;text-align:center">${item.qty || 1}</span>
              <button onclick="drawerUpdateQty(${idx},${(item.qty||1)+1})" style="width:26px;height:26px;border-radius:6px;border:1px solid #DCDCDC;background:#FFF;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#0D0D14">+</button>
            </div>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;flex-shrink:0">
            <span style="font-size:14px;font-weight:600;color:#0D0D14">${(item.price * (item.qty||1)).toFixed(2).replace('.',',')} €</span>
            <button onclick="drawerRemove(${idx})" style="background:none;border:none;cursor:pointer;color:#B0B0B0;padding:0" title="Премахни">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>`).join('');

  drawer.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;padding:20px 24px;border-bottom:1px solid #EBEBEB">
      <h2 style="font-size:17px;font-weight:700;color:#0D0D14;margin:0">Количка</h2>
      <button onclick="closeCartDrawer()" style="background:none;border:none;cursor:pointer;color:#4A4A4A;padding:4px;display:flex;align-items:center;justify-content:center;border-radius:8px">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 24px">${itemsHTML}</div>
    ${cart.length > 0 ? `
    <div style="padding:20px 24px;border-top:1px solid #EBEBEB;background:#FAFAF8">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <span style="font-size:14px;color:#4A4A4A">Сума</span>
        <span style="font-size:16px;font-weight:700;color:#0D0D14">${subtotal.toFixed(2).replace('.',',')} €</span>
      </div>
      <a href="${checkoutPath}" style="display:block;text-align:center;background:#0D0D14;color:#FAFAF8;padding:14px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none;margin-bottom:10px">Поръчай</a>
      <a href="${cartPath}" style="display:block;text-align:center;border:1.5px solid #DCDCDC;color:#0D0D14;padding:13px;border-radius:100px;font-size:15px;font-weight:600;text-decoration:none">Виж количката</a>
    </div>` : ''}
  `;
}

function drawerUpdateQty(index, qty) {
  updateQty(index, qty);
  const drawer = document.getElementById('liro-cart-drawer');
  if (drawer) renderCartDrawer(drawer);
}

function drawerRemove(index) {
  removeFromCart(index);
  const drawer = document.getElementById('liro-cart-drawer');
  if (drawer) renderCartDrawer(drawer);
}

// Initialize badge on load
document.addEventListener('DOMContentLoaded', updateCartBadge);
