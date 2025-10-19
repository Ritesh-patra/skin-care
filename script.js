// Shortcuts
const $ = (q, el = document) => el.querySelector(q);
const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

// Year in footer
const yearEl = $("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// Header shadow + back-to-top + scroll progress
const header = $("#site-header");
const backTop = $("#scroll-top");
const progress = $("#scroll-progress");

function onScroll() {
  const y = window.scrollY;
  if (header) header.classList.toggle("header-shadow", y > 8);
  if (backTop) backTop.style.display = y > 300 ? "grid" : "none";

  const h = document.documentElement;
  const scrolled = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (progress) progress.style.width = scrolled + "%";
}

window.addEventListener("scroll", onScroll);

if (backTop) {
  backTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );
}

// Mobile drawer toggle
const mobileBtn = $("#mobile-menu-button");
const mobileDrawer = $("#mobile-drawer");
if (mobileBtn && mobileDrawer) {
  mobileBtn.addEventListener("click", () => {
    const willOpen = mobileDrawer.classList.contains("hidden");
    mobileDrawer.classList.toggle("hidden");
    mobileBtn.setAttribute("aria-expanded", String(willOpen));
  });
}

// Reveal-on-scroll animations
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("animate-fadeInUp");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);

$$("[data-reveal]").forEach((el) => io.observe(el));

// Tabs (Skin / Hair)
$$(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".tab-btn").forEach((b) => b.classList.remove("active", "bg-white"));
    btn.classList.add("active", "bg-white");

    const tab = btn.dataset.tab;
    const skinTab = $("#tab-skin");
    const hairTab = $("#tab-hair");
    if (skinTab && hairTab) {
      skinTab.classList.toggle("hidden", tab !== "skin");
      hairTab.classList.toggle("hidden", tab !== "hair");
    }
  });
});

// Hero Slider
let currentSlide = 0;
const heroSlides = $$("#hero [data-slide-index]");
const totalSlides = heroSlides.length;
const heroPrev = $("#hero-prev");
const heroNext = $("#hero-next");
const heroDots = $$("[data-hero-dot]");

function showSlide(i) {
  if (totalSlides === 0) return;
  currentSlide = (i + totalSlides) % totalSlides;
  heroSlides.forEach((el, idx) => {
    el.style.transform =
      idx < currentSlide
        ? "translateX(-100%)"
        : idx === currentSlide
        ? "translateX(0)"
        : "translateX(100%)";
  });
  heroDots.forEach((d, idx) => {
    d.className =
      "h-2.5 w-2.5 rounded-full " +
      (idx === currentSlide ? "bg-neutral-900/80" : "bg-neutral-900/40");
  });
}

if (heroPrev) heroPrev.addEventListener("click", () => showSlide(currentSlide - 1));
if (heroNext) heroNext.addEventListener("click", () => showSlide(currentSlide + 1));
heroDots.forEach((dot) =>
  dot.addEventListener("click", () => showSlide(parseInt(dot.dataset.heroDot)))
);
if (totalSlides > 0) {
  setInterval(() => showSlide(currentSlide + 1), 6000);
  showSlide(0);
}

// Testimonials Carousel
let tsIndex = 0;
const tsWrapper = $("#ts-wrapper");
const tsCards = tsWrapper ? $$("#ts-wrapper > *").length : 0;

function tsShow(i) {
  if (!tsWrapper) return;
  tsIndex = (i + tsCards) % tsCards;
  tsWrapper.style.transform = `translateX(-${tsIndex * 340}px)`;
}
window.tsPrev = () => tsShow(tsIndex - 1);
window.tsNext = () => tsShow(tsIndex + 1);

// Swiper (About Section)
if (typeof Swiper !== "undefined") {
  new Swiper(".aboutSwiper", {
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    autoplay: { delay: 3000, disableOnInteraction: false },
  });
}

// WhatsApp Helpers
const WA_NUMBER = "919912985875"; // country code + number (no '+')

function toWhatsAppMessage(params) {
  const parts = [];
  if (params.service) parts.push(`Service: ${params.service}`);
  if (params.name) parts.push(`Name: ${params.name}`);
  if (params.phone) parts.push(`Phone: ${params.phone}`);
  if (params.city) parts.push(`City: ${params.city}`);
  if (params.date) parts.push(`Preferred Date: ${params.date}`);
  if (params.message) parts.push(`Message: ${params.message}`);
  return encodeURIComponent("Hello, I would like to connect.\n" + parts.join("\n"));
}

function openWhatsApp(params) {
  const text = toWhatsAppMessage(params || {});
  const url = `https://wa.me/${WA_NUMBER}?text=${text}`;
  window.open(url, "_blank", "noopener");
}

// Quick Callback → WhatsApp
const qRequest = $("#q-request");
if (qRequest) {
  qRequest.addEventListener("click", () => {
    const name = $("#q-name")?.value.trim();
    const phone = $("#q-mobile")?.value.trim();
    const city = $("#q-city")?.value.trim();
    const service = $("#q-service")?.value;

    if (!name || !/^\+?\d[\d\s-]{6,}$/.test(phone) || !service) {
      alert("Please enter valid name, phone, and select service.");
      return;
    }
    openWhatsApp({ name, phone, city, service });
  });
}

// Appointment Modal
const appModal = $("#appointment-modal");
const aService = $("#a-service");
const aName = $("#a-name");
const aPhone = $("#a-phone");
const aCity = $("#a-city");

function openAppointment(service = "", prefill = {}) {
  if (!appModal) return;
  if (service && aService) {
    aService.value = "";
    for (const option of aService.options) {
      if (option.text === service) {
        aService.value = option.value;
        break;
      }
    }
  }
  if (prefill.name && aName) aName.value = prefill.name;
  if (prefill.phone && aPhone) aPhone.value = prefill.phone;
  if (prefill.city && aCity) aCity.value = prefill.city;

  appModal.classList.remove("hidden");
  appModal.classList.add("flex");
  appModal.querySelector("input, select, button")?.focus();
}

function closeAppointment() {
  if (!appModal) return;
  appModal.classList.add("hidden");
  appModal.classList.remove("flex");
}

const openAppointmentBtn = $("#open-appointment");
if (openAppointmentBtn) {
  openAppointmentBtn.addEventListener("click", () => openAppointment());
}
window.openAppointment = openAppointment;
window.closeAppointment = closeAppointment;

// Appointment Submit → WhatsApp
const appointmentForm = $("#appointment-form");
if (appointmentForm) {
  appointmentForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
      name: aName?.value.trim(),
      phone: aPhone?.value.trim(),
      city: aCity?.value.trim(),
      service: aService?.value,
      date: $("#a-date")?.value,
      consent: $("#a-consent")?.checked,
    };
    if (!data.name || !/^\+?\d[\d\s-]{6,}$/.test(data.phone) || !data.service) {
      alert("Please fill valid name, phone, and service.");
      return;
    }
    try {
      $("#appointment-success")?.classList.remove("hidden");
      openWhatsApp(data);
      setTimeout(closeAppointment, 800);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  });
}

// Contact Form → WhatsApp if consent
const contactForm = $("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      name: $("#c-name")?.value.trim(),
      phone: $("#c-phone")?.value.trim(),
      message: $("#c-message")?.value.trim(),
      consent: $("#c-consent")?.checked,
    };
    if (!payload.name || !/^\+?\d[\d\s-]{6,}$/.test(payload.phone)) {
      alert("Please enter a valid name and phone.");
      return;
    }
    $("#contact-success")?.classList.remove("hidden");
    if (payload.consent) {
      openWhatsApp(payload);
    }
    e.currentTarget.reset();
  });
}

// Newsletter (simple feedback)
const newsletter = $("#newsletter");
if (newsletter) {
  newsletter.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("#nl-email")?.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert("Please enter a valid email.");
      return;
    }
    $("#nl-success")?.classList.remove("hidden");
  });
}

// Lightbox
const lightbox = $("#lightbox");
const lightboxImg = $("#lightbox-img");

function openLightbox(src) {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
}

window.openLightbox = openLightbox;
window.closeLightbox = closeLightbox;

if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

  const swiper = new Swiper(".mySwiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
  });