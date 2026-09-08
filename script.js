'use strict';

(function() {
  // ===== DATA =====
  const SERVICES_DATA = [
    { icon: "fa-globe", name: "Website Development", desc: "Modern responsive websites for businesses and organizations." },
    { icon: "fa-tools", name: "Website Maintenance", desc: "Updates, backups, security and technical website support." },
    { icon: "fa-building", name: "Business Registration", desc: "Assistance with business registration and eCitizen services." },
    { icon: "fa-graduation-cap", name: "KNEC Certificates", desc: "Guidance for KCSE/KCPE e-certificate and retrieval services." },
    { icon: "fa-user-graduate", name: "KNEC Account Registration", desc: "Help setting up and accessing your KNEC account." },
    { icon: "fa-file-invoice", name: "KRA Services", desc: "KRA PIN, returns and other online tax-related assistance." },
    { icon: "fa-hospital-user", name: "SHA Registration", desc: "Assistance with SHA registration and online services." },
    { icon: "fa-file-alt", name: "Proposal Writing", desc: "Professional proposals and project/business documents." },
    { icon: "fa-paint-brush", name: "Logo & Graphic Design", desc: "Logos, posters, banners and business graphics." },
    { icon: "fa-download", name: "Software Installation", desc: "Software installation and computer configuration." },
    { icon: "fa-print", name: "Printing & Scanning", desc: "Printing, scanning, photocopying and document preparation." },
    { icon: "fa-laptop", name: "Online Applications", desc: "Assistance with selected online and government services." }
  ];

  // ===== DOM REFS =====
  const grid = document.getElementById('serviceGrid');
  const select = document.getElementById('service');
  const form = document.getElementById('requestForm');
  const nav = document.getElementById('nav');
  const menuBtn = document.querySelector('.menu-btn');
  const yearSpan = document.getElementById('year');
  const charCount = document.getElementById('charCount');
  const detailsTextarea = document.getElementById('details');

  // ===== SANITIZATION =====
  const sanitize = (str) => {
    if (!str) return '';
    const el = document.createElement('div');
    el.textContent = str;
    return el.innerHTML;
  };

  // ===== BUILD SERVICES =====
  const buildServices = () => {
    if (!grid || !select) return;

    SERVICES_DATA.forEach((s, i) => {
      const card = document.createElement('article');
      card.className = 'service-card';
      card.setAttribute('role', 'listitem');
      card.innerHTML = `
        <div class="service-icon"><i class="fas ${s.icon}" aria-hidden="true"></i></div>
        <h3>${sanitize(s.name)}</h3>
        <p>${sanitize(s.desc)}</p>
        <button type="button" data-index="${i}">Request this service</button>
      `;
      
      card.querySelector('button').addEventListener('click', () => chooseService(i));
      grid.appendChild(card);

      const opt = document.createElement('option');
      opt.value = sanitize(s.name);
      opt.textContent = sanitize(s.name);
      select.appendChild(opt);
    });
  };

  // ===== CHOOSE SERVICE =====
  const chooseService = (index) => {
    if (!select || index < 0 || index >= SERVICES_DATA.length) return;
    select.value = SERVICES_DATA[index].name;
    const target = document.getElementById('request');
    if (target) {
      const offset = 80;
      const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: pos, behavior: 'smooth' });
      setTimeout(() => {
        const details = document.getElementById('details');
        if (details) details.focus();
      }, 600);
    }
  };

  // ===== TOGGLE MENU =====
  const toggleMenu = () => {
    if (!nav || !menuBtn) return;
    const isOpen = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen);
    menuBtn.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  };

  const closeMenu = () => {
    if (nav) {
      nav.classList.remove('open');
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', 'false');
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  };

  // ===== YEAR =====
  const setYear = () => {
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
  };

  // ===== CHAR COUNT =====
  const updateCharCount = () => {
    if (!charCount || !detailsTextarea) return;
    const max = 500;
    const current = detailsTextarea.value.length;
    charCount.textContent = `${current}/${max}`;
    if (current > max * 0.9) {
      charCount.style.color = '#f5576c';
    } else {
      charCount.style.color = '#74849a';
    }
  };

  // ===== FORM SUBMIT =====
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const service = document.getElementById('service');
    const details = document.getElementById('details');
    const method = document.getElementById('contactMethod');
    const btn = document.getElementById('submitBtn');

    if (!name || !phone || !service || !details || !btn) return;

    // Validate phone
    const phonePattern = /^[0-9]{10,12}$/;
    if (!phonePattern.test(phone.value.trim())) {
      phone.focus();
      phone.style.borderColor = '#f5576c';
      setTimeout(() => phone.style.borderColor = '', 2000);
      return;
    }

    if (!service.value) {
      service.focus();
      service.style.borderColor = '#f5576c';
      setTimeout(() => service.style.borderColor = '', 2000);
      return;
    }

    // Disable button
    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparing...';

    // Build message
    const cleanName = sanitize(name.value.trim());
    const cleanPhone = sanitize(phone.value.trim());
    const cleanEmail = sanitize(document.getElementById('email').value.trim() || 'Not provided');
    const cleanService = sanitize(service.value);
    const cleanDetails = sanitize(details.value.trim());
    const cleanMethod = sanitize(method.value);

    const message = `Hello CHIBU CYBERNETICS.%0A%0A` +
      `I would like to request a service.%0A%0A` +
      `Name: ${encodeURIComponent(cleanName)}%0A` +
      `Phone: ${encodeURIComponent(cleanPhone)}%0A` +
      `Email: ${encodeURIComponent(cleanEmail)}%0A` +
      `Service: ${encodeURIComponent(cleanService)}%0A` +
      `Preferred contact: ${encodeURIComponent(cleanMethod)}%0A` +
      `Details: ${encodeURIComponent(cleanDetails)}`;

    const waUrl = `https://wa.me/254712912718?text=${message}`;

    try {
      window.open(waUrl, '_blank');
    } catch {
      window.location.href = waUrl;
    }

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      btn.style.background = '#19b96b';
      btn.style.color = '#fff';
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        btn.style.background = '';
        btn.style.color = '';
        form.reset();
        updateCharCount();
      }, 2500);
    }, 800);
  };

  // ===== COUNTER ANIMATION =====
  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'));
          if (!target) return;
          
          let current = 0;
          const duration = 1500;
          const steps = 40;
          const increment = target / steps;
          const interval = duration / steps;
          
          el.textContent = '0';
          
          const timer = setInterval(() => {
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

    counters.forEach(c => observer.observe(c));
  };

  // ===== SMOOTH SCROLL =====
  const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = 80;
          const pos = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: pos, behavior: 'smooth' });
          closeMenu();
        }
      });
    });
  };

  // ===== PARALLAX =====
  const initParallax = () => {
    const hero = document.querySelector('.hero');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          if (hero && scrolled < window.innerHeight) {
            hero.style.backgroundPositionY = scrolled * 0.3 + 'px';
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  // ===== INIT =====
  const init = () => {
    buildServices();
    setYear();
    animateCounters();
    initSmoothScroll();
    initParallax();

    // Event listeners
    if (menuBtn) {
      menuBtn.addEventListener('click', toggleMenu);
    }

    document.addEventListener('click', (e) => {
      const topbar = document.querySelector('.topbar');
      if (topbar && !topbar.contains(e.target) && nav && nav.classList.contains('open')) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
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

    // Expose functions
    window.chooseService = chooseService;
    window.toggleMenu = toggleMenu;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();