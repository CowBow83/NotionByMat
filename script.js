/* =========================================================
   NOTIONBYMAT - MAIN SCRIPT
   - i18n (FR/EN)
   - Render templates (home + templates page)
   - Modal product: slider, promo price, optional video
   ========================================================= */

let currentLanguage = "en";

// Slider state (modal)
window.currentSliderImages = [];
window.currentSlideIndex = 0;

/* -----------------------------
   i18n
----------------------------- */
function initLanguage() {
  const saved = localStorage.getItem("notionbymat-lang");
  if (saved === "fr" || saved === "en") currentLanguage = saved;
  syncLanguageButtons();
  updateHtmlLang();
}

function updateHtmlLang() {
  document.documentElement.lang = currentLanguage;
}

function translate(key) {
  if (translations?.[currentLanguage]?.[key]) return translations[currentLanguage][key];
  if (translations?.en?.[key]) return translations.en[key];
  return key;
}

function updateTranslations() {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    el.textContent = translate(key);
  });

  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    el.innerHTML = translate(key);
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    el.setAttribute("placeholder", translate(key));
  });
}

function syncLanguageButtons() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    const btnLang = btn.getAttribute("data-lang");
    btn.classList.toggle("active", btnLang === currentLanguage);
  });
}

function bindLanguageSwitcher() {
  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = btn.getAttribute("data-lang");
      if (next !== "fr" && next !== "en") return;

      currentLanguage = next;
      localStorage.setItem("notionbymat-lang", currentLanguage);

      syncLanguageButtons();
      updateHtmlLang();
      updateTranslations();
      renderAllTemplateZones();
      renderBlog();
      initFeaturedQuote(); // Refresh quote text
      renderChatWall();    // Refresh chat bubbles

      // Si la modal est ouverte: refresh
      const modal = document.getElementById("productModal");
      const templateId = modal?.getAttribute("data-template-id");
      if (modal?.classList.contains("active") && templateId) {
        const tpl = (window.templatesData || []).find((t) => String(t.id) === String(templateId));
        if (tpl) openTemplateModal(tpl);
      }
    });
  });
}

/* -----------------------------
   Templates rendering
----------------------------- */
function getCoverHTML(template) {
  const src = template.coverImage || template.image || "";
  if (src) return `<img src="${src}" alt="${escapeHTML(template.title)}" loading="lazy">`;
  return `<span class="template-emoji" aria-hidden="true">${template.emoji || "✨"}</span>`;
}

function getCardPriceLabel(template) {
  const base = Number(template.price || 0);
  const pro = Number(template.pricePro || 0);

  if (base === 0 && pro === 0) return translate("template.free");
  if (base === 0) return translate("template.free");
  return `$${base}`;
}

function renderTemplateCard(template) {
  const card = document.createElement("div");
  card.className = "template-card";
  card.setAttribute("data-category", template.category);

  const badge = template.isBestSeller ? `<div class="template-badge">BEST SELLER</div>` : "";

  card.innerHTML = `
    ${badge}
    <div class="template-image cat-${escapeHTML(template.category)}">
      ${getCoverHTML(template)}
    </div>

    <div class="template-info">
      <div class="template-category">${escapeHTML(translate("filter." + template.category))}</div>
      <h3 class="template-title">${escapeHTML(template.title)}</h3>
      <p class="template-description">${escapeHTML(template.description)}</p>

      <div class="template-footer">
        <div class="template-price">${escapeHTML(getCardPriceLabel(template))}</div>
        <button class="template-btn" type="button">${escapeHTML(translate("template.buy"))}</button>
      </div>
    </div>
  `;

  card.addEventListener("click", () => openTemplateModal(template));
  return card;
}

function renderHomeBestsellers() {
  const grid = document.getElementById("bestsellersGrid");
  if (!grid) return;

  grid.innerHTML = "";

  try {
    const templates = window.templatesData || [];
    templates
      .filter((t) => t && t.isBestSeller)
      .forEach((t) => grid.appendChild(renderTemplateCard(t)));
  } catch (error) {
    console.error("Error rendering bestsellers:", error);
  }
}

function renderHomeFree() {
  const grid = document.getElementById("freeGrid");
  if (!grid) return;

  grid.innerHTML = "";

  try {
    const templates = window.templatesData || [];
    templates
      .filter((t) => t && Number(t.price || 0) === 0)
      .forEach((t) => grid.appendChild(renderTemplateCard(t)));
  } catch (error) {
    console.error("Error rendering free templates:", error);
  }
}

function renderTemplatesPageGrid() {
  const grid = document.getElementById("templatesGrid");
  if (!grid) return;

  const activeFilter = getActiveFilterFromButtons() || "all";

  grid.innerHTML = "";
  (window.templatesData || [])
    .filter((t) => filterTemplate(t, activeFilter))
    .forEach((t) => grid.appendChild(renderTemplateCard(t)));
}

function filterTemplate(template, filter) {
  if (!filter || filter === "all") return true;
  if (filter === "free") return Number(template.price || 0) === 0;
  return template.category === filter;
}

function bindFilterButtons() {
  const buttons = document.querySelectorAll(".filter-btn[data-filter]");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTemplatesPageGrid();
    });
  });
}

function getActiveFilterFromButtons() {
  const active = document.querySelector(".filter-btn[data-filter].active");
  return active ? active.getAttribute("data-filter") : null;
}

function renderAllTemplateZones() {
  renderHomeBestsellers();
  renderHomeFree();
  renderTemplatesPageGrid();
}

/* -----------------------------
   Modal (product)
----------------------------- */
function openTemplateModal(template) {
  let modal = document.getElementById("productModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "productModal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
  }

  modal.setAttribute("data-template-id", String(template.id));

  const lang = currentLanguage === "fr" ? "fr" : "en";

  // Gallery (slider)
  const galleryImages = Array.isArray(template.gallery) ? template.gallery : [];
  window.currentSliderImages = galleryImages;
  window.currentSlideIndex = 0;

  const sliderHTML =
    galleryImages.length > 0
      ? `
        <div class="modal-slider">
          <div class="slider-container">
            <img src="${galleryImages[0]}" alt="${escapeHTML(template.title)}" id="sliderImage" class="slider-image">
            ${galleryImages.length > 1
        ? `
                <button class="slider-arrow slider-prev" type="button" onclick="changeSlide(-1)">‹</button>
                <button class="slider-arrow slider-next" type="button" onclick="changeSlide(1)">›</button>
                <div class="slider-dots" id="sliderDots">
                  ${galleryImages
          .map(
            (_, i) =>
              `<button type="button" class="dot ${i === 0 ? "active" : ""}" aria-label="Go to slide ${i + 1}" onclick="goToSlide(${i})"></button>`
          )
          .join("")}
                </div>
              `
        : ""
      }
          </div>
        </div>
      `
      : `<div class="modal-image-single">${template.emoji || "✨"}</div>`;

  // Social proof STYLISÉ
  const socialProof =
    template.soldCount || template.rating || (Array.isArray(template.useCases) && template.useCases.length > 0)
      ? `
        <div class="modal-social-proof">
          <div class="social-proof-stats">
            ${template.soldCount ? `
              <div class="stat-item">
                <span class="stat-icon">🔥</span>
                <span>${escapeHTML(String(template.soldCount))} ${escapeHTML(translate("modal.soldCount"))}</span>
              </div>
            ` : ""}
            
            ${template.soldCount && template.rating ? `<div class="stat-divider"></div>` : ""}
            
            ${template.rating ? `
              <div class="stat-item">
                <span class="stat-icon">⭐</span>
                <span>${escapeHTML(String(template.rating))}/5</span>
              </div>
            ` : ""}
          </div>
          
          ${Array.isArray(template.useCases) && template.useCases.length > 0 ? `
            <div class="social-proof-tags">
              <span class="social-proof-label">${escapeHTML(translate("modal.perfectFor"))}</span>
              ${template.useCases.map((uc) => `<span class="use-case-tag">${escapeHTML(uc)}</span>`).join("")}
            </div>
          ` : ""}
        </div>
      `
      : "";

  // Features
  const featuresArray = normalizeLocalizedArray(template.features, lang);
  const proFeaturesArray = normalizeLocalizedArray(template.proFeatures, lang);

  const featuresList =
    featuresArray.length > 0
      ? `
        <div class="modal-section modal-section-left">
          <h4>${escapeHTML(translate("modal.features"))}</h4>
          <ul>${featuresArray.map((f) => `<li>✓ ${escapeHTML(f)}</li>`).join("")}</ul>
        </div>
      `
      : "";

  const proFeaturesList =
    proFeaturesArray.length > 0
      ? `
        <div class="modal-section modal-section-right pro">
          <h4>${escapeHTML(translate("modal.proFeatures"))}</h4>
          <ul>${proFeaturesArray.map((f) => `<li>✦ ${escapeHTML(f)}</li>`).join("")}</ul>
        </div>
      `
      : "";

  // Links by language
  const links = template.links?.[lang] || {};

  // Prix avec barre si promo
  const hasPromo =
    typeof template.promoPrice === "number" &&
    template.promoPrice > 0 &&
    Number(template.pricePro || 0) > 0;

  const priceHTML = hasPromo
    ? `
      <span class="promo-badge">${escapeHTML(translate("modal.promo"))}</span>
      <span class="btn-price-container">
        <span class="price-original">$${escapeHTML(String(template.pricePro))}</span>
        <span class="price-promo">$${escapeHTML(String(template.promoPrice))}</span>
      </span>
    `
    : `<span class="btn-price-container"><span class="price-promo">$${escapeHTML(String(template.pricePro || 0))}</span></span>`;

  // Included items
  const includedItems = [
    translate("included.setup"),
    translate("included.videoShort"),
    translate("included.updatesShort"),
    translate("included.supportShort"),
  ];

  // Video
  const hasVideo = typeof template.videoUrl === "string" && template.videoUrl.trim() !== "";
  const videoSection = hasVideo
    ? `
      <div class="modal-video">
        <h4>${escapeHTML(translate("modal.videoDemo"))}</h4>
        <div class="video-wrapper">
          <iframe src="${template.videoUrl}" frameborder="0" allowfullscreen></iframe>
        </div>
      </div>

      <div class="modal-actions-bottom" style="margin-top: 30px;">
        <a href="${links.free || "#"}" target="_blank" class="modal-btn secondary" rel="noopener">
          ${escapeHTML(translate("modal.freeVersion"))}
        </a>
        <a href="${links.pro || "#"}" target="_blank" class="modal-btn primary" rel="noopener">
          ${escapeHTML(translate("modal.proVersion"))} ${priceHTML}
        </a>
      </div>
    `
    : "";

  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" type="button" onclick="closeModal()">×</button>

      <div class="modal-lang-switcher">
        <button class="lang-btn ${currentLanguage === "en" ? "active" : ""}" type="button" onclick="switchModalLanguage('en', ${template.id})">EN</button>
        <button class="lang-btn ${currentLanguage === "fr" ? "active" : ""}" type="button" onclick="switchModalLanguage('fr', ${template.id})">FR</button>
      </div>

      <div class="modal-body scrollable">
        <div class="modal-badge">${escapeHTML(translate("filter." + template.category))}</div>
        <h2 class="modal-title">${escapeHTML(template.title)}</h2>
        <p class="modal-desc">${escapeHTML(template.description)}</p>

        ${sliderHTML}
        ${socialProof}

        <div class="modal-actions-top">
          <a href="${links.free || "#"}" target="_blank" class="modal-btn secondary" rel="noopener">
            ${escapeHTML(translate("modal.freeVersion"))}
          </a>
          <a href="${links.pro || "#"}" target="_blank" class="modal-btn primary" rel="noopener">
            ${escapeHTML(translate("modal.proVersion"))} ${priceHTML}
          </a>
        </div>

        <div class="modal-features-container">
          ${featuresList}
          ${proFeaturesList}
        </div>

        <div class="modal-included">
          <div class="included-title">${escapeHTML(translate("included.title"))}</div>
          <div class="included-items">
            ${includedItems.map((item) => `<span>${escapeHTML(item)}</span>`).join("")}
          </div>
        </div>

        ${videoSection}
      </div>
    </div>
  `;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  updateSliderImage();
}

function closeModal() {
  const modal = document.getElementById("productModal");
  if (!modal) return;
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

function switchModalLanguage(newLang, templateId) {
  if (newLang !== "fr" && newLang !== "en") return;

  currentLanguage = newLang;
  localStorage.setItem("notionbymat-lang", currentLanguage);

  syncLanguageButtons();
  updateTranslations();
  renderAllTemplateZones();
  renderBlog();

  const template = (window.templatesData || []).find((t) => String(t.id) === String(templateId));
  if (template) openTemplateModal(template);
}

/* -----------------------------
   Slider controls
----------------------------- */
function changeSlide(direction) {
  if (!Array.isArray(window.currentSliderImages) || window.currentSliderImages.length === 0) return;

  window.currentSlideIndex += direction;
  if (window.currentSlideIndex >= window.currentSliderImages.length) window.currentSlideIndex = 0;
  if (window.currentSlideIndex < 0) window.currentSlideIndex = window.currentSliderImages.length - 1;

  updateSliderImage();
}

function goToSlide(index) {
  if (!Array.isArray(window.currentSliderImages) || window.currentSliderImages.length === 0) return;

  const i = Number(index);
  if (Number.isNaN(i)) return;

  window.currentSlideIndex = Math.max(0, Math.min(i, window.currentSliderImages.length - 1));
  updateSliderImage();
}

function updateSliderImage() {
  const img = document.getElementById("sliderImage");
  if (!img) return;

  const src = window.currentSliderImages?.[window.currentSlideIndex];
  if (src) img.src = src;

  const dots = document.querySelectorAll(".slider-dots .dot");
  dots.forEach((dot, i) => dot.classList.toggle("active", i === window.currentSlideIndex));
}

/* -----------------------------
   Utils
----------------------------- */
function normalizeLocalizedArray(value, lang) {
  if (!value) return [];
  if (typeof value === "object" && !Array.isArray(value)) {
    const v = value[lang] || value.en || value.fr;
    return Array.isArray(v) ? v : [];
  }
  if (Array.isArray(value)) return value;
  return [];
}

function escapeHTML(str) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(str).replace(/[&<>"']/g, (m) => map[m]);
}

/* -----------------------------
   Init
----------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  window.templatesData = window.templatesData || templatesData;
  window.blogData = window.blogData || blogData;

  initLanguage();
  bindLanguageSwitcher();
  bindFilterButtons();

  updateTranslations();
  renderAllTemplateZones();
  renderBlog();

  // Testimonials
  initFeaturedQuote();
  renderChatWall();

  // NOUVEAU : Effet slide horizontal dans la nav
  initNavSlider();
});

/* -----------------------------
   Blog rendering
----------------------------- */
function renderBlog() {
  const grid = document.getElementById("blogGrid");
  if (!grid) return;

  const lang = currentLanguage === "fr" ? "fr" : "en";

  // Ne garder que les articles de blog dynamiques, supprimer le contenu statique
  const staticCards = grid.querySelectorAll('.blog-card');
  staticCards.forEach(card => card.remove());

  (window.blogData || []).forEach((article) => {
    const card = document.createElement("div");
    card.className = "blog-card";

    const title = article.title?.[lang] || article.title?.en || "Untitled";
    const excerpt = article.excerpt?.[lang] || article.excerpt?.en || "";
    const link = article.content?.[lang] || article.content?.en || "#";

    const imageHTML = article.image
      ? `<img src="${article.image}" alt="${escapeHTML(title)}" class="blog-image" loading="lazy">`
      : `<div class="blog-image"></div>`;

    const formattedDate = new Date(article.date).toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });

    card.innerHTML = `
      ${imageHTML}
      <div class="blog-content">
        <span class="blog-date">${escapeHTML(formattedDate)}</span>
        <h3 class="blog-title">${escapeHTML(title)}</h3>
        <p class="blog-excerpt">${escapeHTML(excerpt)}</p>
        <a href="${link}" class="blog-link">${escapeHTML(translate("blog.readMore"))}</a>
      </div>
    `;

    grid.appendChild(card);
  });
}


/* -----------------------------
   Navigation Slider Effect
----------------------------- */
function initNavSlider() {
  const navCenter = document.querySelector('.nav-center');
  if (!navCenter) return;

  const links = navCenter.querySelectorAll('a');
  const activeLinkIndex = Array.from(links).findIndex(link => link.classList.contains('active-page'));

  if (activeLinkIndex !== -1) {
    updateSliderPosition(links, activeLinkIndex);
  }

  links.forEach((link, index) => {
    link.addEventListener('mouseenter', () => {
      updateSliderPosition(links, index);
    });
  });

  navCenter.addEventListener('mouseleave', () => {
    const activeIndex = Array.from(links).findIndex(link => link.classList.contains('active-page'));
    if (activeIndex !== -1) {
      updateSliderPosition(links, activeIndex);
    }
  });
}

function updateSliderPosition(links, index) {
  const navCenter = document.querySelector('.nav-center');
  if (!navCenter) return;

  const link = links[index];
  const offsetLeft = link.offsetLeft;
  const width = link.offsetWidth;

  navCenter.style.setProperty('--slider-left', `${offsetLeft}px`);
  navCenter.style.setProperty('--slider-width', `${width}px`);

  // Appliquer la transformation
  const before = window.getComputedStyle(navCenter, '::before');
  navCenter.style.setProperty('--slider-transform', `translateX(${offsetLeft - 6}px)`);
}

/* -----------------------------
   Testimonials: Featured Quote (Fade)
----------------------------- */
let quoteInterval;

function initFeaturedQuote() {
  const quoteText = document.getElementById("quoteText");
  const quoteName = document.getElementById("quoteName");
  const quoteRole = document.getElementById("quoteRole");
  const quoteAvatar = document.getElementById("quoteAvatar");
  const container = document.querySelector(".quote-container");

  if (!quoteText || !container) return;

  const testimonials = window.featuredTestimonials || [];
  if (testimonials.length === 0) return;

  let index = 0;

  function showQuote(i) {
    const t = testimonials[i];
    const lang = currentLanguage === "fr" ? "fr" : "en";

    // Fade out
    container.style.opacity = "0";

    setTimeout(() => {
      // Update content
      quoteText.innerHTML = t.text[lang];
      quoteName.textContent = t.author;
      quoteRole.textContent = t.role[lang];
      quoteAvatar.textContent = t.emoji;
      quoteAvatar.style.backgroundColor = t.avatarColor + "20"; // Light bg
      quoteAvatar.style.color = t.avatarColor;

      // Fade in
      container.style.opacity = "1";
    }, 600);
  }

  // Initial show
  showQuote(0);

  // Auto rotate
  if (quoteInterval) clearInterval(quoteInterval);
  quoteInterval = setInterval(() => {
    index = (index + 1) % testimonials.length;
    showQuote(index);
  }, 5000);
}

/* -----------------------------
   Testimonials: Chat Wall
----------------------------- */
function renderChatWall() {
  const grid = document.getElementById("chatWallGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const lang = currentLanguage === "fr" ? "fr" : "en";
  const testimonials = window.chatTestimonials || [];

  testimonials.forEach((t) => {
    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.onclick = () => openTemplateById(t.templateId);

    bubble.innerHTML = `
      <div class="chat-avatar" style="background-color: ${t.avatarColor}">${t.emoji}</div>
      <div class="chat-content">
        <div class="chat-message">"${t.text[lang]}"</div>
        <div class="chat-author">${t.author}</div>
      </div>
    `;

    grid.appendChild(bubble);
  });
}

function openTemplateById(id) {
  const template = (window.templatesData || []).find(t => t.id === id);
  if (template) {
    openTemplateModal(template);
  }
}
