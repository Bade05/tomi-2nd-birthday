// ===== CONFIGURATION =====
const CONFIG = {
  partyDate: new Date("2026-03-26T16:00:00+01:00"),
  photosPerPage: 12,
  whatsappLink: "https://call.whatsapp.com/video/NoUGdd6N62ep3goq9Fl5ui",
};

// ===== STATE =====
let currentPage = 1;
let currentLightboxIndex = 0;
let allPhotos = [];
let reminderShown = sessionStorage.getItem("tomiReminderShown") === "true";

// ===== MILESTONES DATA =====
const milestones = [
  { id: 1, label: "Newborn", image: "images/New born tomi.jpg" },
  { id: 2, label: "6 Months Old", image: "images/Six months.jpg" },
  { id: 3, label: "First Christmas", image: "images/first christmas.jpg" },
  { id: 4, label: "First Day at Kita", image: "images/First day in Kita.JPG" },
  { id: 5, label: "With Grandma", image: "images/tomi with grandma.jpg" },
  { id: 6, label: "Family", image: "images/The Odedoyin's.jpg" },
  { id: 7, label: "Two Years Old", image: "images/Year 2!!!.JPG" },
];

// ===== PHOTO FILENAMES =====

const photoFilenames = [
  "cute tomi.JPG",
  "daddy's girl.JPG",
  "drinking .JPG",
  "Best singer in the entire universe.JPG",
  "First day in Kita.JPG",
  "Six months.jpg",
  "car ride.jpg",
  "foodie.jpg",
  "fun time.JPG",
  "give me a hug.JPG",
  "jolly tomi.JPG",
  "PHOTO-2026-03-25-17-34-55 2.jpg",
  "miss lil mustach.JPG",
  "Outside photo.jpg",
  "PHOTO-2026-03-25-17-34-55 3.jpg",
  "Play time in summer.jpg",
  "prayer mode.JPG",
  "princess dress.JPG",
  "PHOTO-2026-03-25-17-34-55 4.jpg",
  "princess dress.JPG",
  "with brother koko.JPG",
  "tomi with daddy.jpg",
  "with mama.JPG",
  "with grandma.JPG",
  "Year 2!!!.JPG",
  "Big 2 tomi full fit.jpg",
  "Yayy I'M TWO.jpg",
];

const totalPhotos = photoFilenames.length;

// ===== DOM READY =====
document.addEventListener("DOMContentLoaded", () => {
  initBalloons();
  initCountdown();
  initMilestones();
  initGallery();
  initRSVP();
  initCalendar();
  initLightbox();
  initWishes();
  initReminder();
  initScrollReveal();
});

// ===== BALLOONS =====
function initBalloons() {
  const container = document.getElementById("balloons");
  if (!container) return;

  const colors = ["#E8B4A0", "#C5D4B8", "#E5D9B6", "#D4897A", "#9CAF88"];

  const balloonSVG = (color) => `
    <svg width="40" height="60" viewBox="0 0 40 60">
      <ellipse cx="20" cy="22" rx="16" ry="20" fill="${color}"/>
      <path d="M20 42 Q18 46 20 50 Q22 46 20 42" fill="${color}"/>
      <line x1="20" y1="50" x2="20" y2="60" stroke="${color}" stroke-width="1" opacity="0.5"/>
    </svg>
  `;

  for (let i = 0; i < 8; i++) {
    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.innerHTML = balloonSVG(colors[i % colors.length]);
    balloon.style.left = `${10 + Math.random() * 80}%`;
    balloon.style.animationDelay = `${i * 1.5}s`;
    balloon.style.animationDuration = `${10 + Math.random() * 5}s`;
    container.appendChild(balloon);
  }
}

// ===== COUNTDOWN =====
function initCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl) return;

  function update() {
    const now = new Date();
    const diff = CONFIG.partyDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minutesEl.textContent = String(minutes).padStart(2, "0");
    secondsEl.textContent = String(seconds).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

// ===== MILESTONES =====
function initMilestones() {
  const grid = document.getElementById("milestoneGrid");
  if (!grid) return;

  milestones.forEach((milestone, index) => {
    const card = document.createElement("div");
    card.className = "milestone-card reveal";
    card.dataset.delay = index * 100;
    card.innerHTML = `
      <img src="${milestone.image}" alt="${milestone.label}" loading="lazy">
      <div class="milestone-label">${milestone.label}</div>
    `;
    card.addEventListener("click", () => openLightbox(milestone.image));
    grid.appendChild(card);
  });
}

// ===== GALLERY =====
function initGallery() {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;

  allPhotos = photoFilenames.map((filename) => `images/${filename}`);

  renderPhotos(currentPage);
}

function renderPhotos(page) {
  const grid = document.getElementById("photoGrid");
  if (!grid) return;

  grid.innerHTML = "";
  currentPage = page;

  const photosPerPage = CONFIG.photosPerPage;
  const start = (page - 1) * photosPerPage;
  const end = Math.min(start + photosPerPage, totalPhotos);

  for (let i = start; i < end; i++) {
    const photo = document.createElement("div");
    photo.className = "gallery-photo";
    photo.innerHTML = `<img src="${allPhotos[i]}" alt="Tomi photo ${i + 1}" loading="lazy" onerror="this.parentElement.style.display='none'">`;
    photo.addEventListener("click", () => {
      currentLightboxIndex = i;
      openLightbox(allPhotos[i]);
    });
    grid.appendChild(photo);
  }

  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  if (!pagination) return;

  const photosPerPage = CONFIG.photosPerPage;
  const totalPages = Math.ceil(totalPhotos / photosPerPage);
  pagination.innerHTML = "";

  // Prev button
  const prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>';
  prevBtn.disabled = currentPage === 1;
  prevBtn.setAttribute("aria-label", "Previous page");
  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) renderPhotos(currentPage - 1);
  });
  pagination.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.className = `page-btn ${i === currentPage ? "active" : ""}`;
    btn.textContent = i;
    btn.setAttribute("aria-label", `Page ${i}`);
    btn.addEventListener("click", () => renderPhotos(i));
    pagination.appendChild(btn);
  }

  // Next button
  const nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.innerHTML =
    '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.setAttribute("aria-label", "Next page");
  nextBtn.addEventListener("click", () => {
    if (currentPage < totalPages) renderPhotos(currentPage + 1);
  });
  pagination.appendChild(nextBtn);
}

// ===== LIGHTBOX =====
function openLightbox(src) {
  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightboxImg");

  if (!lightbox || !img) return;

  img.src = src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

function navigateLightbox(direction) {
  if (allPhotos.length === 0) return;

  currentLightboxIndex += direction;
  if (currentLightboxIndex < 0) currentLightboxIndex = allPhotos.length - 1;
  if (currentLightboxIndex >= allPhotos.length) currentLightboxIndex = 0;

  const img = document.getElementById("lightboxImg");
  if (img) img.src = allPhotos[currentLightboxIndex];
}

function initLightbox() {
  // Close button
  const closeBtn = document.querySelector(".lightbox-close");
  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

  // Navigation buttons
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  if (prevBtn) prevBtn.addEventListener("click", () => navigateLightbox(-1));
  if (nextBtn) nextBtn.addEventListener("click", () => navigateLightbox(1));

  // Click outside to close
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (!lightbox || !lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigateLightbox(-1);
    if (e.key === "ArrowRight") navigateLightbox(1);
  });
}

// ===== RSVP =====
function initRSVP() {
  const form = document.getElementById("rsvpForm");
  if (!form) return;

  const radioCards = document.querySelectorAll(".radio-card");

  radioCards.forEach((card) => {
    card.addEventListener("click", function () {
      radioCards.forEach((c) => c.classList.remove("selected"));
      this.classList.add("selected");
      this.querySelector("input").checked = true;
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("guestName").value.trim();
    const email = document.getElementById("guestEmail").value.trim();
    const attendance = document.querySelector(
      'input[name="attendance"]:checked',
    )?.value;

    if (!attendance) return;

    // Save to localStorage
    const rsvps = JSON.parse(localStorage.getItem("tomiRsvps") || "[]");
    rsvps.push({
      name,
      email,
      attendance,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("tomiRsvps", JSON.stringify(rsvps));

    // Hide form
    form.style.display = "none";

    // Show appropriate response
    if (attendance === "yes") {
      const successYes = document.getElementById("successYes");
      if (successYes) successYes.classList.remove("hidden");
      createConfetti();
    } else if (attendance === "maybe") {
      const maybePage = document.getElementById("maybePage");
      if (maybePage) maybePage.classList.add("active");
    }
  });

  // Maybe page back button
  const maybeBackBtn = document.getElementById("maybeBackBtn");
  if (maybeBackBtn) {
    maybeBackBtn.addEventListener("click", function () {
      const maybePage = document.getElementById("maybePage");
      if (maybePage) maybePage.classList.remove("active");

      form.style.display = "block";
      form.reset();
      document
        .querySelectorAll(".radio-card")
        .forEach((c) => c.classList.remove("selected"));
    });
  }
}

// ===== CONFETTI =====
function createConfetti() {
  const colors = ["#E8B4A0", "#C4A962", "#9CAF88", "#D4897A", "#E5D9B6"];
  const shapes = ["circle", "square", "rectangle"];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";

      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const size = 6 + Math.random() * 8;

      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${size}px`;
      piece.style.height =
        shape === "rectangle" ? `${size * 2}px` : `${size}px`;
      piece.style.borderRadius = shape === "circle" ? "50%" : "2px";
      piece.style.animationDuration = `${3 + Math.random() * 2}s`;

      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 5000);
    }, i * 40);
  }
}

// ===== CALENDAR =====
function initCalendar() {
  const calendarBtn = document.getElementById("calendarBtn");
  if (!calendarBtn) return;

  calendarBtn.addEventListener("click", function () {
    const reminderTime = new Date(CONFIG.partyDate.getTime() - 30 * 60 * 1000);
    const endTime = new Date(reminderTime.getTime() + 60 * 60 * 1000);

    const title = encodeURIComponent("Tomi's 2nd Birthday - Reminder");
    const details = encodeURIComponent(
      "Video call starts in 30 minutes! Oluwatomisin Jasmine's birthday celebration at 4:00 PM WAT.",
    );
    const start =
      reminderTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    const end = endTime.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

    window.open(
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}`,
      "_blank",
    );
  });
}

// ===== WISHES =====
function initWishes() {
  const form = document.getElementById("wishForm");
  const board = document.getElementById("wishesBoard");

  if (!form || !board) return;

  function loadWishes() {
    const wishes = JSON.parse(localStorage.getItem("tomiWishes") || "[]");
    board.innerHTML = wishes
      .map(
        (w) => `
      <div class="wish-card">
        <p class="font-medium mb-1" style="color: var(--cocoa);">${escapeHtml(w.name)}</p>
        <p class="text-sm" style="color: var(--cocoa-muted);">${escapeHtml(w.message)}</p>
      </div>
    `,
      )
      .join("");
  }

  loadWishes();

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("wishName").value.trim();
    const message = document.getElementById("wishMessage").value.trim();

    const wishes = JSON.parse(localStorage.getItem("tomiWishes") || "[]");
    wishes.unshift({ name, message, timestamp: new Date().toISOString() });
    localStorage.setItem("tomiWishes", JSON.stringify(wishes));

    form.reset();
    loadWishes();

    // Show confirmation
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = "Wish Sent!";
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 2000);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ===== REMINDER =====
function initReminder() {
  const closeBtn = document.getElementById("closePopupBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const popup = document.getElementById("reminderPopup");
      if (popup) popup.classList.remove("active");
    });
  }

  // Check reminder on load and periodically
  checkReminder();
  setInterval(checkReminder, 60000);
}

function checkReminder() {
  if (reminderShown) return;

  const now = new Date();
  const thirtyMinutesBefore = new Date(
    CONFIG.partyDate.getTime() - 30 * 60 * 1000,
  );
  const afterParty = new Date(CONFIG.partyDate.getTime() + 2 * 60 * 60 * 1000);

  if (now >= thirtyMinutesBefore && now <= afterParty) {
    const popup = document.getElementById("reminderPopup");
    if (popup) popup.classList.add("active");
    reminderShown = true;
    sessionStorage.setItem("tomiReminderShown", "true");
  }
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add("visible");
          }, parseInt(delay));
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
  );

  reveals.forEach((el) => observer.observe(el));
}
