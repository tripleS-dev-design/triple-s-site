const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

function setYear(){
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

function scrollProgress(){
  const bar = $(".scrollbar span");
  if (!bar) return;
  const h = document.documentElement;
  const max = h.scrollHeight - h.clientHeight;
  const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
  bar.style.width = `${p}%`;
}

function mobileNav(){
  const burger = $(".burger");
  const mnav = $(".mnav");
  if (!burger || !mnav) return;

  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));
    mnav.hidden = open;
  });

  $$(".mnav a").forEach(a => a.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", "false");
    mnav.hidden = true;
  }));
}

function revealOnScroll(){
  const els = $$(".reveal");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) e.target.classList.add("in");
    });
  }, {threshold: 0.18});

  els.forEach(el => obs.observe(el));
}

function animateCount(el){
  const to = parseFloat(el.dataset.to || "0");
  const from = 0;
  const dur = 950;
  const start = performance.now();

  function tick(now){
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = from + (to - from) * eased;

    // integer only (simple + clean)
    el.textContent = String(Math.round(val));

    if (t < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

function counters(){
  const els = $$(".count");
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      if (el.dataset.ran === "1") return;
      el.dataset.ran = "1";
      animateCount(el);
    });
  }, {threshold: 0.35});

  els.forEach(el => obs.observe(el));
}

function slider(){
  const slidesWrap = $(".slides");
  if (!slidesWrap) return;
  const slides = $$(".slide", slidesWrap);
  if (!slides.length) return;

  let i = slides.findIndex(s => s.classList.contains("is-active"));
  if (i < 0) i = 0;

  function show(n){
    slides[i].classList.remove("is-active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("is-active");
  }

  const prev = $("[data-prev]");
  const next = $("[data-next]");
  prev?.addEventListener("click", () => show(i - 1));
  next?.addEventListener("click", () => show(i + 1));

  // auto
  setInterval(() => show(i + 1), 5200);
}

function tiltCard(){
  const card = $("[data-tilt]");
  if (!card) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;

    const rx = clamp((0.5 - y) * 8, -8, 8);
    const ry = clamp((x - 0.5) * 10, -10, 10);

    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = `none`;
  });
}

function whatsappForm(){
  const form = $("#quickForm");
  if (!form) return;

  const WA = "212725148634";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const msg =
      `TRIPLE S Support\n` +
      `Name: ${data.name}\n` +
      `Email: ${data.email}\n\n` +
      `${data.message}`;

    const url = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank", "noopener");
    form.reset();
  });
}

window.addEventListener("scroll", scrollProgress, {passive:true});
window.addEventListener("load", () => {
  setYear();
  scrollProgress();
  mobileNav();
  revealOnScroll();
  counters();
  slider();
  tiltCard();
  whatsappForm();
});
