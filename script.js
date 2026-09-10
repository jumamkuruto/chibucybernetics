'use strict';

(function () {

  // ============================================================
  // SERVICES DATA - ALL CHANGES APPLIED HERE
  // ============================================================
  // Card 1: SHA Services (was Website Development) - sha.png
  // Card 2: E-Citizen Services (was Website Maintenance) - ecitizen.png
  // Card 3: Business Registration - NOW uses ecitizen.png
  // ============================================================
  const SERVICES_DATA = [
    {
      icon: "fa-heart-pulse",
      imgSrc: "sha.png",
      name: "SHA Services",
      desc: "Register for SHA Services, Add Dependents and Update Phone Number."
    },
    {
      icon: "fa-laptop",
      imgSrc: "ecitizen.png",
      name: "E-Citizen Services",
      desc: "Register New Account, Recover Account, Phone Number Change."
    },
    {
      icon: "fa-building",
      imgSrc: "ecitizen.png",
      name: "Business Registration",
      desc: "Assistance with business registration and eCitizen services."
    },
    {
      icon: "fa-graduation-cap",
      imgSrc: "knec.png",
      name: "KNEC Certificates",
      desc: "Guidance for KCSE/KCPE e-certificate and retrieval services."
    },
    {
      icon: "fa-user-graduate",
      imgSrc: "knec.png",
      name: "KNEC Account Registration",
      desc: "Help setting up and accessing your KNEC account."
    },
    {
      icon: "fa-file-invoice",
      imgSrc: "kra.png",
      name: "KRA Services",
      desc: "KRA PIN, returns and other online tax-related assistance."
    },
    {
      icon: "fa-hospital-user",
      imgSrc: "sha.png",
      name: "SHA Registration",
      desc: "Assistance with SHA registration and online services."
    },
    {
      icon: "fa-file-alt",
      imgSrc: "",
      name: "Proposal Writing",
      desc: "Professional proposals and project/business documents."
    },
    {
      icon: "fa-paint-brush",
      imgSrc: "",
      name: "Logo & Graphic Design",
      desc: "Logos, posters, banners and business graphics."
    },
    {
      icon: "fa-download",
      imgSrc: "",
      name: "Software Installation",
      desc: "Software installation and computer configuration."
    },
    {
      icon: "fa-print",
      imgSrc: "",
      name: "Printing & Scanning",
      desc: "Printing, scanning, photocopying and document preparation."
    },
    {
      icon: "fa-laptop",
      imgSrc: "ecitizen.png",
      name: "Online Applications",
      desc: "Assistance with selected online and government services."
    }
  ];

  // ===== DOM REFS =====
  const grid = document.getElementById('serviceGrid');
  const select = document.getElementById('service');
  const form = document.getElementById('requestForm');
  const nav = document.getElementById('mainNav');
  const hamburger = document.getElementById('hamburger');
  const yearSpan = document.getElementById('year');
  const charCount = document.getElementById('charCount');
  const detailsTextarea = document.getElementById('details');
  const navLinks = document.querySelectorAll('.nav-link');

  // ===== SANITIZE =====
  function sanitize(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== BUILD SERVICES =====
  function buildServices() {
    if (!grid || !select) return;

    SERVICES_DATA.forEach(function (s) {
      const card = document.createElement('article');
      card.className = 'service-card lazy-load';

      let iconHtml;
      if (s.imgSrc) {
        iconHtml = '<img src="' + s.imgSrc + '" alt="' + sanitize(s.name) + '" loading="lazy" ' +
                   'onerror="this.onerror=null;this.parentNode.innerHTML=\'<i class=&quot;fas ' + s.icon + '&quot;></i>\';" />';
      } else {
        iconHtml = '<i class="fas ' + s.icon + '"></i>';
      }

      card.innerHTML =
        '<div class="service-icon">' + iconHtml + '</div>' +
        '<h3>' + sanitize(s.name) + '</h3>' +
        '<p>' + sanitize(s.desc) + '</p>' +
        '<a href="https://wa.me/254712912718" target="_blank" rel="noopener noreferrer" class="service-btn">' +
          '<i class="fab fa-whatsapp"></i> Request this service' +
        '</a>';

      grid.appendChild(card);

      // Lazy observer
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(card);

      // Add to select
      const opt = document.createElement('option');
      opt.value = sanitize(s.name);
      opt.textContent = sanitize(s.name);
      select.appendChild(opt);
    });
  }

  // ===== HAMBURGER MENU =====
  function toggleMenu() {
    if (!nav || !hamburger) return;
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  function closeMenu() {
    if (!nav) return;
    nav.classList.remove('open');
    if (hamburger) {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  // ===== YEAR =====
  function setYear() {
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  }

  // ===== CHAR COUNT =====
  function updateCharCount() {
    if (!charCount || !detailsTextarea) return;
    const max = 500;
    const current = detailsTextarea.value.length;
    charCount.textContent = current + '/' + max;
  }

  // ===== FORM SUBMIT =====
  function handleSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const service = document.getElementById('service');
    const btn = document.getElementById('submitBtn');

    if (!name || !phone || !service || !btn) return;

    // Validate phone
    const phonePattern = /^[0-9]{10,12}$/;
    if (!phonePattern.test(phone.value.trim())) {
      phone.focus();
      phone.style.borderColor = '#D4A5A5';
      setTimeout(function () { phone.style.borderColor = ''; }, 2000);
      return;
    }

    if (!service.value) {
      service.focus();
      service.style.borderColor = '#D4A5A5';
      setTimeout(function () { service.style.borderColor = ''; }, 2000);
      return;
    }

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';

    const waUrl = 'https://wa.me/254712912718';

    try {
      window.open(waUrl, '_blank');
    } catch (err) {
      window.location.href = waUrl;
    }

    setTimeout(function () {
      btn.innerHTML = '<i class="fas fa-check"></i> Opened!';
      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.disabled = false;
        form.reset();
        updateCharCount();
      }, 2000);
    }, 600);
  }

  // ===== LAZY LOAD =====
  function initLazyLoad() {
    const lazyElements = document.querySelectorAll('.lazy-load');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    lazyElements.forEach(function (el) { observer.observe(el); });
  }

  // ===== COUNTER ANIMATION =====
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (!target) return;

          let current = 0;
          const duration = 1200;
          const steps = 30;
          const increment = target / steps;
          const interval = duration / steps;

          el.textContent = '0';

          const timer = setInterval(function () {
            current += increment;
            if (current >= target) {
              el.textContent = target + (target > 10 ? '+' : '');
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(current) + (target > 10 ? '+' : '');
            }
          }, interval);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    counters.forEach(function (c) { observer.observe(c); });
  }

  // ===== SMOOTH SCROLL =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 70;
          const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
          closeMenu();
        }
      });
    });
  }

  // ===== ACTIVE NAV LINK =====
  function setActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) {
        link.classList.add('active');
      }
    });
  }

  // ===== INIT =====
  function init() {
    buildServices();
    setYear();
    initLazyLoad();
    animateCounters();
    initSmoothScroll();

    if (hamburger) {
      hamburger.addEventListener('click', toggleMenu);
    }

    document.addEventListener('click', function (e) {
      const topbar = document.querySelector('.topbar');
      if (topbar && !topbar.contains(e.target) && nav && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    if (detailsTextarea) {
      detailsTextarea.addEventListener('input', updateCharCount);
    }

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    window.toggleMenu = toggleMenu;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();