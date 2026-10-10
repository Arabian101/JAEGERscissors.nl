/* ===== JAEGER — script.js (vanilla JavaScript) ===== */
const PRODUCTS = [
  { slug: "apex-damast-60", name: "Apex", series: "Damast Gold Edition", category: "knippen", price: 389, badge: "Vlaggenschip",
    image: "img/apex.jpg", hardness: "HRC 61", steel: "67-laags Damast, VG-10 kern", tagline: "67 lagen staal. Eén zuivere snede.",
    description: "Ons vlaggenschip. Handgeslepen convex snijvlak, verzonken kogellager en een 24k vergulde instelschroef. Gemaakt voor slice-cutting en droogknippen waar elke millimeter telt.",
    specs: [["Lengte", "6.0 inch"], ["Snijvlak", "Convex, handgeslepen"], ["Greep", "Offset"], ["Gewicht", "41 g"]] },
  { slug: "black-line-55", name: "Black Line", series: "Matte Kobalt", category: "knippen", price: 299, badge: "Populair",
    image: "img/blackline.jpg", hardness: "HRC 60", steel: "ATS-314 kobaltstaal", tagline: "Stil, zwart, onverbiddelijk scherp.",
    description: "Een DLC-titanium coating in diep matzwart, slijtvast en vederlicht. De offset greep ontlast pols en schouder tijdens lange dagen achter de stoel.",
    specs: [["Lengte", "5.5 inch"], ["Snijvlak", "Convex"], ["Greep", "Offset"], ["Gewicht", "38 g"]] },
  { slug: "texture-30", name: "Texture 30", series: "Effileerschaar", category: "effileren", price: 249, badge: null,
    image: "img/thinning.jpg", hardness: "HRC 59", steel: "Japans 440C", tagline: "Dertig tanden. Nul harde lijnen.",
    description: "Dertig micro-gekartelde tanden voor naadloze overgangen en zachte texturering, zonder het haar te kneuzen. Circa 25% uitdunning per knip.",
    specs: [["Lengte", "6.0 inch"], ["Tanden", "30"], ["Uitdunning", "± 25%"], ["Gewicht", "43 g"]] },
  { slug: "sinister-60", name: "Sinister", series: "Linkshandig Pro", category: "linkshandig", price: 319, badge: "Linkshandig",
    image: "img/lefty.jpg", hardness: "HRC 61", steel: "Takefu VG-10 kobalt", tagline: "Gespiegelde geometrie, geen compromis.",
    description: "Volledig gespiegeld voor linkshandige professionals: blad, greep en schroef. Met de crane-greep en champagnegouden vingersteun ligt hij als vanzelf in de hand.",
    specs: [["Lengte", "6.0 inch"], ["Snijvlak", "Convex"], ["Greep", "Crane"], ["Gewicht", "40 g"]] },
  { slug: "atelier-duo", name: "Atelier Duo", series: "Gouden Set", category: "sets", price: 549, badge: "Set",
    image: "img/set.jpg", hardness: "HRC 60", steel: "VG-10 kobalt, titanium-goud", tagline: "Twee instrumenten, één etui.",
    description: "Een knipschaar en effileerschaar met titanium-gouden afwerking, geleverd in een handgemaakt lederen etui. Het complete gereedschap voor de meester-barbier.",
    specs: [["Inhoud", "2 scharen + etui"], ["Lengtes", "6.0 + 6.0 inch"], ["Etui", "Volnerf leder"], ["Afwerking", "Titanium-goud"]] },
];
const CATEGORIES = [["", "Alles"], ["knippen", "Knipscharen"], ["effileren", "Effileren"], ["linkshandig", "Linkshandig"], ["sets", "Sets"]];
const MARQUEE = ["Japans kobaltstaal", "Handgeslepen convex snijvlak", "Gemaakt voor de stoel", "Precisie tot de laatste haar", "Damast in 67 lagen"];
const ENGRAVING = 25, FREE_SHIPPING = 150, SHIPPING = 6.95, CART_KEY = "jaeger-cart";

const $ = (s, el = document) => el.querySelector(s); const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const euro = (n) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);
const bySlug = (slug) => PRODUCTS.find((p) => p.slug === slug);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const markSvg = (cls = "mark") => `<svg class="${cls}"><use href="#mark"/></svg>`;

/* ---------- smooth scroll (Lenis) ---------- */
let lenis = null;
if (window.Lenis) {
  lenis = new Lenis({ duration: 1.25, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const target = $(a.getAttribute("href"));   if (!target) return;   e.preventDefault();   document.body.classList.remove("menu-open");   if (lenis) lenis.scrollTo(target, { offset: -60 }); else target.scrollIntoView({ behavior: "smooth" }); });  /* ---------- reveal on scroll ---------- */ const io = new IntersectionObserver((entries) => {   entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: 0.15 }); const observe = (root = document) => $$(".reveal, .mask, .card", root).forEach((el) => io.observe(el));

/* ---------- toasts ---------- */
function toast(msg, type = "ok") {
  const t = document.createElement("div");
  t.className = `toast ${type === "error" ? "error" : ""}`;
  t.textContent = msg;
  $("#toasts").appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

/* ---------- header / menu ---------- */
const header = $("#header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();
$("#menuBtn").addEventListener("click", () => document.body.classList.toggle("menu-open"));

/* ---------- marquee ---------- */
const row = MARQUEE.map((w) => `<div class="marquee-item"><span>${w}</span>${markSvg()}</div>`).join("");
$("#marqueeTrack").innerHTML = row + row;

/* ---------- hero: tilt, spotlight, parallax ---------- */
const hero = $("#hero"), tilt = $("#heroTilt"), heroImg = $("#heroImg"), heroWord = $("#heroWord"), spot = $("#heroSpot");
hero.addEventListener("mousemove", (e) => {
  const r = hero.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
  tilt.style.transform = `rotateY(${(px - 0.5) * 20}deg) rotateX(${(0.5 - py) * 16}deg)`;
  spot.style.setProperty("--x", `${px * 100}%`);
  spot.style.setProperty("--y", `${py * 100}%`);
});
hero.addEventListener("mouseleave", () => { tilt.style.transform = ""; });
const edWrap = $("#editorialImgWrap"), edImg = $("#editorialImg");
function parallax() {
  const y = window.scrollY, h = hero.offsetHeight;
  if (y < h) {
    const p = y / h;
    heroImg.style.transform = `translateY(${p * 18}%) scale(1.15)`;
    heroWord.style.transform = `translateX(${-p * 22}%)`;
  }
  const r = edWrap.getBoundingClientRect();
  const prog = (window.innerHeight - r.top) / (window.innerHeight + r.height);
  if (prog > 0 && prog < 1) edImg.style.transform = `translateY(${(prog - 0.5) * 24}%) scale(1.25)`;
  requestAnimationFrame(parallax);
}
requestAnimationFrame(parallax);

/* ---------- collection ---------- */
let activeCat = "";
function renderFilters() {
  $("#filters").innerHTML = CATEGORIES.map(([k, l]) =>
    `<button class="pill ${k === activeCat ? "active" : ""}" data-cat="${k}" data-testid="filter-${k || "alles"}">${l}</button>`).join("");
}
function renderGrid() {
  const list = PRODUCTS.filter((p) => !activeCat || p.category === activeCat);
  $("#productCount").textContent = `${list.length} ${list.length === 1 ? "instrument" : "instrumenten"}`;
  $("#productGrid").innerHTML = list.map((p, i) => `
    <button class="card" style="--d:${(i % 3) * 0.1}s" data-open="${p.slug}" data-testid="product-card-${p.slug}">
      <div class="card-media">
        <img src="${p.image}" alt="JAEGER ${p.name}" loading="lazy" />
        ${p.badge ? `<span class="card-badge">${p.badge}</span>` : ""}
        <span class="card-arrow">↗</span>
        <span class="card-spec">${p.hardness} · ${p.steel}</span>
      </div>
      <div class="card-info">
        <div><h3>${p.name}</h3><p class="mono">${p.series}</p></div>
        <p class="price" data-testid="product-card-price-${p.slug}">${euro(p.price)}</p>
      </div>
    </button>`).join("");
  observe($("#productGrid"));
}
$("#filters").addEventListener("click", (e) => {   const b = e.target.closest("[data-cat]");   if (!b) return;   activeCat = b.dataset.cat;   renderFilters(); renderGrid(); }); $$("[data-filter-link]").forEach((a) => a.addEventListener("click", () => {
  activeCat = a.dataset.filterLink; renderFilters(); renderGrid();
}));

/* ---------- cart ---------- */
let cart = [];
try { cart = JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { cart = []; }
const save = () => localStorage.setItem(CART_KEY, JSON.stringify(cart));
const subtotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
const shipping = () => { const s = subtotal(); return s === 0 || s >= FREE_SHIPPING ? 0 : SHIPPING; };
const count = () => cart.reduce((s, i) => s + i.qty, 0);

function addToCart(p, qty, engraving) {
  const key = `${p.slug}::${engraving}`;
  const found = cart.find((i) => i.key === key);
  if (found) found.qty = Math.min(10, found.qty + qty);
  else cart.push({ key, slug: p.slug, name: p.name, series: p.series, image: p.image, price: p.price + (engraving ? ENGRAVING : 0), engraving, qty });
  save(); renderCart();
  const b = $("#cartCount");
  b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
}
function setQty(key, qty) {
  cart = qty < 1 ? cart.filter((i) => i.key !== key) : cart.map((i) => (i.key === key ? { ...i, qty: Math.min(10, qty) } : i));
  save(); renderCart();
}
function renderCart() {
  const c = count(), s = subtotal(), rest = Math.max(0, FREE_SHIPPING - s);
  const badge = $("#cartCount");
  badge.textContent = c;
  badge.classList.toggle("show", c > 0);
  $("#drawerCount").textContent = `(${c})`;
  $("#cartSubtotal").textContent = euro(s);
  $("#shipText").innerHTML = rest > 0 ? `Nog <b>${euro(rest)}</b> tot gratis verzending` : "Je bestelling wordt gratis verzonden";
  $("#toCheckout").disabled = !cart.length;
  $("#cartList").innerHTML = cart.length ? cart.map((i) => `
    <li class="cart-item" data-testid="cart-item-${i.slug}">
      <img src="${i.image}" alt="${i.name}" />
      <div class="cart-item-body">
        <div class="cart-item-top">
          <div><p class="display">${i.name}</p><p class="mono">${i.series}</p>${i.engraving ? `<p class="engr">Gravure: “${esc(i.engraving)}”</p>` : ""}</div>
          <p class="price">${euro(i.price * i.qty)}</p>
        </div>
        <div class="qty-row">
          <button class="qty-btn" data-qty="${i.key}" data-d="-1" data-testid="cart-item-decrease-${i.slug}">−</button>
          <span class="price" data-testid="cart-item-qty-${i.slug}">${i.qty}</span>
          <button class="qty-btn" data-qty="${i.key}" data-d="1" data-testid="cart-item-increase-${i.slug}">+</button>
          <button class="remove" data-remove="${i.key}" data-testid="cart-item-remove-${i.slug}">Verwijder</button>
        </div>
      </div>
    </li>`).join("") : `<li class="empty" data-testid="cart-empty">Je winkelwagen is nog leeg.</li>`;
}
$("#cartList").addEventListener("click", (e) => {
  const q = e.target.closest("[data-qty]"), r = e.target.closest("[data-remove]");
  if (q) { const it = cart.find((i) => i.key === q.dataset.qty); setQty(it.key, it.qty + Number(q.dataset.d)); }
  if (r) setQty(r.dataset.remove, 0);
});

/* ---------- panels (drawer + modals) ---------- */
const overlay = $("#overlay"); function openPanel(el) {   closePanels();   el.classList.add(el.id === "drawer" ? "open" : "open");   overlay.classList.add("show");   if (lenis) lenis.stop(); } function closePanels() {   $$(".drawer, .modal").forEach((el) => el.classList.remove("open"));
  overlay.classList.remove("show");
  if (lenis) lenis.start();
}
overlay.addEventListener("click", closePanels);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closePanels(); });
document.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) closePanels(); });
$("#cartBtn").addEventListener("click", () => openPanel($("#drawer")));

/* ---------- product modal ---------- */
function openProduct(slug) {
  const p = bySlug(slug);
  if (!p) return;
  let qty = 1;
  const body = $("#productBody");
  body.innerHTML = `
    <div class="pm-media" id="pmMedia"><img src="${p.image}" alt="JAEGER ${p.name}" data-testid="product-image" /><div class="spot"></div></div>
    <div class="pm-info">
      <p class="eyebrow">${p.series}</p>
      <h2 class="pm-name" data-testid="product-name">${p.name}</h2>
      <p class="pm-tag">${p.tagline}</p>
      <p class="pm-price" id="pmPrice" data-testid="product-price">${euro(p.price)}</p>
      <p class="pm-desc">${p.description}</p>
      <dl class="specs" data-testid="product-specs">
        ${[["Staal", p.steel], ["Hardheid", p.hardness], ...p.specs].map(([l, v]) => `<div><dt>${l}</dt><dd>${v}</dd></div>`).join("")}
      </dl>
      <div class="engrave-box" id="engBox">
        <label><span><span class="display">Persoonlijke gravure</span> <span class="mono gold">+ ${euro(ENGRAVING)}</span></span>
          <input type="checkbox" id="engToggle" data-testid="engraving-toggle" /></label>
        <input type="text" id="engText" maxlength="12" placeholder="Max. 12 tekens" data-testid="engraving-input" />
      </div>
      <div class="buy-row">
        <div class="stepper">
          <button id="qMinus" data-testid="qty-decrease">−</button><span id="qVal" data-testid="qty-value">1</span><button id="qPlus" data-testid="qty-increase">+</button>
        </div>
        <button class="btn btn-gold" id="addBtn" data-testid="add-to-cart-button">In winkelwagen</button>
      </div>
      <p class="stock">Op voorraad · Levertijd [placeholder]</p>
    </div>`;
  const box = $("#engBox"), tog = $("#engToggle"), txt = $("#engText");
  const price = () => { $("#pmPrice").textContent = euro(p.price + (tog.checked && txt.value.trim() ? ENGRAVING : 0)); };
  tog.addEventListener("change", () => { box.classList.toggle("on", tog.checked); price(); if (tog.checked) txt.focus(); });
  txt.addEventListener("input", price);
  $("#qMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); $("#qVal").textContent = qty; });
  $("#qPlus").addEventListener("click", () => { qty = Math.min(10, qty + 1); $("#qVal").textContent = qty; });
  $("#addBtn").addEventListener("click", () => {
    if (tog.checked && !txt.value.trim()) return toast("Vul de gravuretekst in", "error");
    addToCart(p, qty, tog.checked ? txt.value.trim() : "");
    toast(`${p.name} toegevoegd aan je winkelwagen`);
    openPanel($("#drawer"));
  });
  const media = $("#pmMedia");
  media.addEventListener("mousemove", (e) => {
    const r = media.getBoundingClientRect();
    media.style.setProperty("--x", `${((e.clientX - r.left) / r.width) * 100}%`);
    media.style.setProperty("--y", `${((e.clientY - r.top) / r.height) * 100}%`);
  });
  $("#productModal").scrollTop = 0;
  openPanel($("#productModal"));
}
document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]");
  if (o) openProduct(o.dataset.open);
});

/* ---------- checkout ---------- */
const FIELDS = [["first_name", "Voornaam", ""], ["last_name", "Achternaam", ""], ["email", "E-mailadres", "full"],
  ["street", "Straat en huisnummer", "full"], ["postcode", "Postcode", ""], ["city", "Plaats", ""]];
const METHODS = [["ideal", "iDEAL"], ["card", "Creditcard"], ["klarna", "Klarna — achteraf betalen"]];

function openCheckout() {
  if (!cart.length) return;
  let method = "ideal";
  const s = subtotal(), sh = shipping();
  $("#checkoutBody").innerHTML = `
    <form class="co" id="coForm" novalidate data-testid="checkout-page">
      <p class="eyebrow">Afrekenen — demo, er wordt niets afgeschreven</p>
      <h2>Bijna van jou.</h2>
      <div class="co-grid">
        <div>
          <h3>Bezorggegevens</h3>
          <div class="fields">
            ${FIELDS.map(([k, l, w]) => `<label class="${w}"><span>${l}</span><input name="${k}" type="${k === "email" ? "email" : "text"}" data-testid="checkout-${k.replace("_", "-")}-input" /></label>`).join("")}
          </div>
          <h3 style="margin-top:40px">Betaalmethode</h3>
          <div class="methods" data-testid="payment-methods">
            ${METHODS.map(([k, l]) => `<button type="button" class="method ${k === method ? "active" : ""}" data-method="${k}" data-testid="payment-${k}"><i></i>${l}</button>`).join("")}
          </div>
        </div>
        <aside class="summary" data-testid="order-summary">
          <h3>Overzicht</h3>
          ${cart.map((i) => `<div class="sum-item"><img src="${i.image}" alt="${i.name}" /><p class="display">${i.name} <span class="mono muted">× ${i.qty}</span>${i.engraving ? `<br/><span class="engr">Gravure: “${esc(i.engraving)}”</span>` : ""}</p><p class="price">${euro(i.price * i.qty)}</p></div>`).join("")}
          <div class="sum-lines"><div><span>Subtotaal</span><span>${euro(s)}</span></div><div><span>Verzending</span><span data-testid="checkout-shipping">${sh ? euro(sh) : "Gratis"}</span></div></div>
          <div class="sum-total"><span class="mono muted">Totaal incl. btw</span><span class="display" data-testid="checkout-total">${euro(s + sh)}</span></div>
          <button class="btn btn-gold full" data-testid="place-order-button">Bestelling plaatsen</button>
        </aside>
      </div>
    </form>`;
  const form = $("#coForm");   $$("[data-method]", form).forEach((b) => b.addEventListener("click", () => {
    method = b.dataset.method;
    $$("[data-method]", form).forEach((x) => x.classList.toggle("active", x === b));   }));   form.addEventListener("submit", (e) => {     e.preventDefault();     const data = Object.fromEntries(new FormData(form));     let ok = true;     $$
("input", form).forEach((inp) => {
      const bad = !inp.value.trim() || (inp.name === "email" && !/^\S+@\S+\.\S+$/.test(inp.value)) || (inp.name === "postcode" && inp.value.trim().length < 4);
      inp.classList.toggle("err", bad);
      if (bad) ok = false;
    });
    if (!ok) return toast("Controleer de gemarkeerde velden", "error");
    const order = { number: `JG-${Math.floor(100000 + Math.random() * 900000)}`, total: s + sh, method, customer: data };
    cart = []; save(); renderCart();
    showConfirmation(order);
  });
  $("#checkoutModal").scrollTop = 0;
  openPanel($("#checkoutModal"));
}
function showConfirmation(order) {
  $("#checkoutBody").innerHTML = `
    <div class="confirm" data-testid="confirmation-page">
      ${markSvg()}
      <p class="eyebrow" style="margin-top:40px">Bestelling ${order.number}</p>
      <h2 class="h2">Dank je wel, <em class="gold-text">${esc(order.customer.first_name)}.</em></h2>
      <p class="muted" data-testid="confirmation-message">Dit was een demo-bestelling — er is niets afgeschreven. Totaal: ${euro(order.total)}.</p>
      <button class="btn btn-outline" data-close data-testid="confirmation-continue-link">Verder winkelen</button>
    </div>`;
  $("#checkoutModal").scrollTop = 0;
}
$("#toCheckout").addEventListener("click", openCheckout);

/* ---------- newsletter ---------- */
$("#newsletter").addEventListener("submit", (e) => {
  e.preventDefault();
  const inp = $("#newsletterEmail");
  if (!/^\S+@\S+\.\S+$/.test(inp.value)) return toast("Vul een geldig e-mailadres in", "error");
  toast("Bedankt! Je staat op de lijst.");
  inp.value = "";
});

/* ---------- init ---------- */
$("#year").textContent = new Date().getFullYear();
renderFilters();
renderGrid();
renderCart();
observe();
requestAnimationFrame(() => document.body.classList.add("loaded"));
