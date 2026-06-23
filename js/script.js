/* ============================================================
   script.js – MainCrafts Landing Page
   Plain JavaScript — no external libraries needed.
============================================================ */


/* ── 1. ELEMENT REFERENCES ──────────────────────────────── */
var navbar      = document.getElementById('navbar');
var mainNav     = document.getElementById('mainNav');
var menuToggle  = document.getElementById('menuToggle');
var backToTop   = document.getElementById('backToTop');
var contactForm = document.getElementById('contactForm');
var formSuccess = document.getElementById('formSuccess');


/* ── 2. HAMBURGER MENU ──────────────────────────────────────
   Toggle the nav open/close when the hamburger is clicked.
   Also swaps the icon between ☰ and ✕.
────────────────────────────────────────────────────────── */
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', function () {
    mainNav.classList.toggle('open');

    var icon = menuToggle.querySelector('i');
    if (mainNav.classList.contains('open')) {
      icon.classList.replace('fa-bars', 'fa-xmark');
    } else {
      icon.classList.replace('fa-xmark', 'fa-bars');
    }
  });
}


/* ── 3. MOBILE DROPDOWN ─────────────────────────────────────
   On mobile (≤768px) tap "Services" to open/close the
   dropdown instead of navigating away.
────────────────────────────────────────────────────────── */
document.querySelectorAll('.dropdown > a').forEach(function (link) {
  link.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      this.parentElement.classList.toggle('open');
    }
  });
});


/* ── 4. CLOSE MENU ON LINK CLICK (mobile) ───────────────────
   After tapping any nav link on mobile, close the menu
   so it doesn't block the page content.
────────────────────────────────────────────────────────── */
document.querySelectorAll('#mainNav .nav-link').forEach(function (link) {
  link.addEventListener('click', function () {
    if (window.innerWidth <= 768 && mainNav) {
      mainNav.classList.remove('open');
      if (menuToggle) {
        var icon = menuToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
      }
    }
  });
});


/* ── 5. SCROLL EFFECTS ──────────────────────────────────────
   - Adds a shadow to the navbar after 60px scroll
   - Shows the back-to-top button after 300px scroll
   - Highlights the active nav link based on scroll position
────────────────────────────────────────────────────────── */
window.addEventListener('scroll', function () {

  /* Navbar shadow */
  if (navbar) {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* Back-to-top visibility */
  if (backToTop) {
    if (window.scrollY > 300) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }

  /* Active link highlight */
  updateActiveLink();
});


/* ── 6. ACTIVE NAV LINK HIGHLIGHT ───────────────────────────
   Marks the nav link whose section is currently in view.
────────────────────────────────────────────────────────── */
function updateActiveLink() {
  var sections  = document.querySelectorAll('section[id]');
  var scrollPos = window.scrollY + 130; /* account for sticky navbar height */

  sections.forEach(function (section) {
    var link = document.querySelector('.nav-link[href="#' + section.id + '"]');
    if (!link) return;

    if (scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight) {
      document.querySelectorAll('.nav-link').forEach(function (l) {
        l.classList.remove('active');
      });
      link.classList.add('active');
    }
  });
}


/* ── 7. CONTACT FORM SUBMIT ─────────────────────────────────
   Prevents page reload, shows a success message,
   resets the form, then hides the message after 4s.
────────────────────────────────────────────────────────── */
if (contactForm && formSuccess) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    formSuccess.classList.add('visible');
    contactForm.reset();
    setTimeout(function () {
      formSuccess.classList.remove('visible');
    }, 4000);
  });
}
