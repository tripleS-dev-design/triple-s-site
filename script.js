// ========= Helpers =========
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => [...el.querySelectorAll(q)];

function openWhatsApp(text){
  const WA_NUMBER = "212725148634";
  const url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text);
  window.open(url, "_blank", "noopener");
}

// ========= Year =========
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ========= Mobile menu =========
const burger = $(".burger");
const mobileMenu = $(".mobile-menu");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    const expanded = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!expanded));
    mobileMenu.hidden = expanded;
  });

  // close on link click
  $$(".mobile-menu a").forEach(a => {
    a.addEventListener("click", () => {
      burger.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
    });
  });
}

// ========= Reveal on scroll =========
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add("in-view");
    else e.target.classList.remove("in-view");
  });
}, { threshold: 0.18 });

$$(".reveal").forEach(el => revealObs.observe(el));

// ========= Count up (numbers animate when visible) =========
function animateCount(el) {
  const from = parseFloat(el.dataset.from ?? "0");
  const to = parseFloat(el.dataset.to ?? "0");
  const decimals = parseInt(el.dataset.decimals ?? "0", 10);
  const suffix = el.dataset.suffix ?? "";
  const duration = 1200; // ms
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    // smooth easeOut
    const eased = 1 - Math.pow(1 - t, 3);
    const val = from + (to - from) * eased;

    el.textContent = val.toFixed(decimals) + suffix;

    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

const countObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;

    // run once
    if (el.dataset.ran === "1") return;
    el.dataset.ran = "1";

    animateCount(el);
  });
}, { threshold: 0.35 });

$$(".countup").forEach(el => countObs.observe(el));

// ========= Parallax (simple, pro) =========
// elements with [data-parallax="1..n"] move slightly on scroll
const parallaxEls = $$("[data-parallax]");
function onScrollParallax(){
  const y = window.scrollY || 0;
  parallaxEls.forEach(el => {
    const depth = parseFloat(el.dataset.parallax || "1");
    const offset = (y * 0.03) / depth; // small
    el.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}
window.addEventListener("scroll", onScrollParallax, { passive: true });
onScrollParallax();

// ========= Support form -> WhatsApp =========
const supportForm = $("#supportForm");
if (supportForm) {
  supportForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(supportForm).entries());

    const msg =
      `Support TRIPLE S\n` +
      `Nom: ${data.name}\n` +
      `Email: ${data.email}\n\n` +
      `${data.message}`;

    openWhatsApp(msg);
    supportForm.reset();
  });
}
