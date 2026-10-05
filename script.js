/* بيانات المتجر: عدّل الاسم والسعر والتصنيف والرمز هنا لإدارة المنتجات. */
const WHATSAPP_NUMBER = '201155309351';
const categories = [
  { id: 'phone', name: 'إكسسوارات الموبايل', short: 'كل ما يكمل تجربتك', icon: '📱' },
  { id: 'computer', name: ' اللابتوب والإكسسوارات', short: 'ترقية لمساحتك', icon: '💻' },
  { id: 'audio', name: 'السماعات والصوتيات', short: 'صوت يليق بك', icon: '🎧' },
  { id: 'power', name: 'الشواحن والبوربانك', short: 'طاقة طول اليوم', icon: '🔋' }
];
const products = [
  { id: 1, name: 'سماعة Oraimo OR-20 (أسود)', category: 'audio', description: 'صوت نقي وبطارية تدوم معك.', price: 300, oldPrice: 500, image: 'assets/WhatsApp Image 2026-10-02 at 9.32.39 PM.jpeg', icon: '', tag: 'الأكثر مبيعًا' },
  { id: 2, name: 'سماعة Oraimo OR-20 (أبيض)', category: 'audio', description: 'صوت نقي وبطارية تدوم معك.', price: 300, oldPrice: 500, image: 'assets/WhatsApp Image 2026-10-02 at 9.32.39 PM (1).jpeg', icon: '', tag: '2 الأكثر مبيعًا' },
  { id: 3, name: 'سماعة Dadu DT-052', category: 'audio', description: 'الفخامة والأناقة في سماعة واحدة.', price: 700, oldPrice: 900, image: 'assets/e.png' },
  { id: 4, name: 'لاب HP ElietBook754 G6', category: 'computer', description: 'مناسب للجميع مع أداء قوي وسعر خيالي.', price: 12000, icon: '💻', image: 'assets/HP ElietBook2.jpg', tag: 'شائع' },
  // { id: 3, name: 'شاحن سريع Type-C', category: 'power', description: 'شحن سريع وآمن لأجهزتك.', price: 280, icon: '', tag: 'اختيار موثوق' },
  //   { id: 3, name: 'حافظة موبايل أنيقة', category: 'phone', description: 'حماية عملية بتصميم عصري.', price: 190, icon: '📱' },
  //   { id: 4, name: 'ماوس لاسلكي مريح', category: 'computer', description: 'تحكم سلس للاستخدام اليومي.', price: 320, oldPrice: 390, icon: '🖱️', tag: 'عرض خاص' },
  //   { id: 5, name: 'باور بانك 10000mAh', category: 'power', description: 'اشحن أجهزتك أينما كنت.', price: 690, icon: '🔋' },
  //   { id: 6, name: 'كابل شحن متين', category: 'phone', description: 'طول مناسب وخامة تتحمل.', price: 125, icon: '〰️' },
  //   { id: 8, name: 'سماعة رأس سلكية', category: 'audio', description: 'راحة وصوت واضح طوال اليوم.', price: 230, icon: '🎵' }
];
const money = value => `${new Intl.NumberFormat('ar-EG').format(value)} ج.م`;
const $ = selector => document.querySelector(selector);
const productGrid = $('#product-grid');
const filterList = $('#filter-list');
let activeCategory = 'all';
let searchTerm = '';
let cart = loadCart();
let toastTimer;

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem('motaheda-cart') || '[]');
    return Array.isArray(saved) ? saved.filter(item => products.some(product => product.id === item.id) && Number.isInteger(item.quantity) && item.quantity > 0) : [];
  } catch { return []; }
}
function saveCart() { localStorage.setItem('motaheda-cart', JSON.stringify(cart)); }
function renderCategories() {
  $('#category-grid').innerHTML = categories.map(category => `
    <button class="category-card" type="button" data-category="${category.id}">
      <span class="category-name">${category.name}</span><span class="category-meta">${category.short}</span>
      <span class="category-art" aria-hidden="true">${category.icon}</span><span class="category-arrow">←</span>
    </button>`).join('');
}
function renderFilters() {
  filterList.innerHTML = [{ id: 'all', name: 'كل المنتجات' }, ...categories].map(category =>
    `<button class="filter-button${activeCategory === category.id ? ' active' : ''}" type="button" data-filter="${category.id}">${category.name}</button>`).join('');
}
function renderProducts() {
  const visible = products.filter(product => {
    const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
    const queryMatch = `${product.name} ${product.description} ${categories.find(c => c.id === product.category)?.name || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && queryMatch;
  });
  productGrid.innerHTML = visible.map(product => {
    const categoryName = categories.find(category => category.id === product.category)?.name || '';
    return `<article class="product-card">
      <div class="product-visual">${product.image ? `<img class="product-image" src="${product.image}" alt="${product.name}">` : `<span class="product-glyph" aria-hidden="true">${product.icon}</span>`}${product.tag ? `<span class="product-tag${product.oldPrice ? ' sale' : ''}">${product.tag}</span>` : ''}</div>
      <div class="product-info"><span class="product-category">${categoryName}</span><h3>${product.name}</h3><p class="product-description">${product.description}</p>
      <div class="product-bottom"><div class="price">${money(product.price)} ${product.oldPrice ? `<small class="old-price">${money(product.oldPrice)}</small>` : ''}</div><button class="add-button" type="button" data-add="${product.id}">+ أضف للسلة</button></div></div>
    </article>`;
  }).join('');
  $('#empty-results').hidden = visible.length > 0;
}
function cartTotal() { return cart.reduce((sum, item) => sum + products.find(product => product.id === item.id).price * item.quantity, 0); }
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  $('#cart-count').textContent = count;
  $('#drawer-count').textContent = `(${count})`;
  $('#cart-total').textContent = money(cartTotal());
  $('#checkout-total').textContent = money(cartTotal());
  const hasItems = cart.length > 0;
  $('#cart-empty').hidden = hasItems;
  $('#drawer-footer').hidden = !hasItems;
  $('#cart-items').innerHTML = cart.map(item => {
    const product = products.find(entry => entry.id === item.id);
    return `<div class="cart-row"><div class="cart-thumb" aria-hidden="true">${product.image ? `<img src="${product.image}" alt="">` : product.icon}</div><div><h3>${product.name}</h3><span class="cart-price">${money(product.price * item.quantity)}</span><div class="quantity-control"><button type="button" data-quantity="${product.id}" data-change="-1" aria-label="تقليل الكمية">−</button><span>${item.quantity}</span><button type="button" data-quantity="${product.id}" data-change="1" aria-label="زيادة الكمية">+</button></div></div><button class="remove-item" type="button" data-remove="${product.id}" aria-label="حذف ${product.name}">×</button></div>`;
  }).join('');
  saveCart();
}
function showToast(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}
function openCart() {
  $('#cart-drawer').classList.add('open'); $('#cart-drawer').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('visible'); document.body.classList.add('locked');
}
function closeCart() {
  $('#cart-drawer').classList.remove('open'); $('#cart-drawer').setAttribute('aria-hidden', 'true');
  if (!$('#checkout-modal').classList.contains('open')) { $('#overlay').classList.remove('visible'); document.body.classList.remove('locked'); }
}
function openCheckout() {
  if (!cart.length) return;
  closeCart(); $('#checkout-modal').classList.add('open'); $('#checkout-modal').setAttribute('aria-hidden', 'false');
  $('#overlay').classList.add('visible'); document.body.classList.add('locked'); $('#form-error').textContent = '';
  setTimeout(() => $('#checkout-modal input[name="name"]').focus(), 80);
}
function closeCheckout() {
  $('#checkout-modal').classList.remove('open'); $('#checkout-modal').setAttribute('aria-hidden', 'true');
  $('#overlay').classList.remove('visible'); document.body.classList.remove('locked');
}
function changeQuantity(id, delta) {
  const item = cart.find(entry => entry.id === id);
  if (!item) return;
  item.quantity += delta;
  if (item.quantity <= 0) cart = cart.filter(entry => entry.id !== id);
  renderCart();
}
function buildWhatsAppMessage(customer) {
  const lines = [
    'السلام عليكم ورحمة اللَّه وبركاتة، نبدأ على بركة اللَّه',
    `اسمي: ${customer.name}`, `رقم الهاتف: ${customer.phone}`, `العنوان: ${customer.address}`, '   ',
    'تفاصيل الطلب:'
  ];
  cart.forEach(item => {
    const product = products.find(entry => entry.id === item.id);
    lines.push(`• ${product.name} — الكمية: ${item.quantity} × ${money(product.price)} = ${money(product.price * item.quantity)}`);
  });
  lines.push('', `إجمالي المنتجات: ${money(cartTotal())}`, 'قولي باللَّه الدنيا فى السعر والتوصيل والكمية');
  return lines.join('\n');
}
productGrid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = Number(button.dataset.add);
  const item = cart.find(entry => entry.id === id);
  if (item) item.quantity += 1; else cart.push({ id, quantity: 1 });
  renderCart(); button.classList.add('added'); button.textContent = 'تمت'; showToast('الحمد لله');
  setTimeout(() => { if (button.isConnected) { button.classList.remove('added'); button.textContent = '+ أضف للسلة'; } }, 1100);
});
filterList.addEventListener('click', event => {
  const button = event.target.closest('[data-filter]'); if (!button) return;
  activeCategory = button.dataset.filter; renderFilters(); renderProducts();
});
$('#category-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-category]'); if (!button) return;
  activeCategory = button.dataset.category; renderFilters(); renderProducts(); $('#products').scrollIntoView({ behavior: 'smooth' });
});
$('#product-search').addEventListener('input', event => { searchTerm = event.target.value.trim(); renderProducts(); });
$('#show-all').addEventListener('click', event => { event.preventDefault(); activeCategory = 'all'; searchTerm = ''; $('#product-search').value = ''; renderFilters(); renderProducts(); });
$('#open-cart').addEventListener('click', openCart);
$('#close-cart').addEventListener('click', closeCart);
$('#overlay').addEventListener('click', () => { closeCart(); closeCheckout(); });
$('#cart-items').addEventListener('click', event => {
  const quantityButton = event.target.closest('[data-quantity]');
  if (quantityButton) return changeQuantity(Number(quantityButton.dataset.quantity), Number(quantityButton.dataset.change));
  const removeButton = event.target.closest('[data-remove]');
  if (removeButton) { cart = cart.filter(item => item.id !== Number(removeButton.dataset.remove)); renderCart(); }
});
$('#checkout-open').addEventListener('click', openCheckout);
$('#browse-products').addEventListener('click', () => { closeCart(); $('#products').scrollIntoView({ behavior: 'smooth' }); });
$('#checkout-modal').addEventListener('click', event => { if (event.target.hasAttribute('data-close-checkout')) closeCheckout(); });
$('#checkout-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const customer = { name: String(form.get('name') || '').trim(), phone: String(form.get('phone') || '').trim(), address: String(form.get('address') || '').trim() };
  const error = $('#form-error');
  if (!customer.name || !customer.phone || !customer.address) { error.textContent = 'من فضلك أكمل جميع البيانات المطلوبة.'; return; }
  if (!/^[+\d\s()-]{8,20}$/.test(customer.phone)) { error.textContent = 'اكتب رقم هاتف صحيحًا للتواصل معك.'; return; }
  if (!cart.length) { error.textContent = 'سلة التسوق فارغة. أضف منتجًا أولًا.'; return; }
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(customer))}`;
  window.open(url, '_blank', 'noopener,noreferrer');
  closeCheckout(); showToast('تم تجهيز طلبك في واتساب');
});
$('#menu-toggle').addEventListener('click', () => {
  const nav = $('.main-nav'); const visible = nav.classList.toggle('visible');
  $('#menu-toggle').setAttribute('aria-expanded', String(visible));
});
$('.main-nav').addEventListener('click', event => {
  if (event.target.closest('a')) { $('.main-nav').classList.remove('visible'); $('#menu-toggle').setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') { closeCart(); closeCheckout(); $('.main-nav').classList.remove('visible'); } });
$('#year').textContent = new Date().getFullYear();
renderCategories(); renderFilters(); renderProducts(); renderCart();
