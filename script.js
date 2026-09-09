'use strict';

(function() {
  // ===== DATA =====
  const SERVICES_DATA = [
    { icon: "fa-globe", imgSrc: "", name: "Website Development", desc: "Modern responsive websites for businesses and organizations." },
    { icon: "fa-tools", imgSrc: "", name: "Website Maintenance", desc: "Updates, backups, security and technical website support." },
    { icon: "fa-building", imgSrc: "", name: "Business Registration", desc: "Assistance with business registration and eCitizen services." },
    { icon: "fa-graduation-cap", imgSrc: "images/knec.png", name: "KNEC Certificates", desc: "Guidance for KCSE/KCPE e-certificate and retrieval services." },
    { icon: "fa-user-graduate", imgSrc: "images/knec.png", name: "KNEC Account Registration", desc: "Help setting up and accessing your KNEC account." },
    { icon: "fa-file-invoice", imgSrc: "images/kra.png", name: "KRA Services", desc: "KRA PIN, returns and other online tax-related assistance." },
    { icon: "fa-hospital-user", imgSrc: "images/sha.png", name: "SHA Registration", desc: "Assistance with SHA registration and online services." },
    { icon: "fa-file-alt", imgSrc: "", name: "Proposal Writing", desc: "Professional proposals and project/business documents." },
    { icon: "fa-paint-brush", imgSrc: "", name: "Logo & Graphic Design", desc: "Logos, posters, banners and business graphics." },
    { icon: "fa-download", imgSrc: "", name: "Software Installation", desc: "Software installation and computer configuration." },
    { icon: "fa-print", imgSrc: "", name: "Printing & Scanning", desc: "Printing, scanning, photocopying and document preparation." },
    { icon: "fa-laptop", imgSrc: "images/ecitizen.png", name: "Online Applications", desc: "Assistance with selected online and government services." }
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
      card.className = 'service-card lazy-load';
      card.setAttribute('role', 'listitem');
      
      // Determine if we use Font Awesome icon or custom image
      let iconHtml;
      if (s.imgSrc) {
        iconHtml = `<img src="${s.imgSrc}" alt="${sanitize(s.name)} Icon" class="service-img-icon" loading="lazy" />`;
      } else {
        iconHtml = `<i class="fas ${s.icon}" aria-hidden="true"></i>`;
      }

      // Build card with direct WhatsApp link button
      card.innerHTML = `
        <div class="service-icon">${iconHtml}</div>
        <h3>${sanitize(s.name)}</h3>
        <p>${sanitize(s.desc)}</p>
        <a href="https://wa.me/254712912718" target="_blank" rel="noopener noreferrer" class="service-btn rainbow-btn">
          <i class="fab fa-whatsapp" aria-hidden="true"></i>
          Request this service
        </a>
      `;
      
      grid.appendChild(card);
      
      // Lazy load observer
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            card.classList.add('visible');
            observer.unobserve(card);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(card);

      // Add to select dropdown
      const opt = document.createElement('option');
      opt.value = sanitize(s.name);
      opt.textContent = sanitize(s.name);
      select.appendChild(opt);
    });
  };

  // ===== HAMBURGER MENU =====
  const toggleMenu = () => {
    if (!nav || !hamburger) return;
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  const closeMenu = () => {
    if (nav) {
      nav.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
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
    charCount.style.color = current > max * 0.9 ? '#f5576c' : '#74849a';
  };

  // ===== FORM SUBMIT =====
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name');
    const phone = document.getElementById('phone');
    const service = document.getElementById('service');
    const btn = document.getElementById('submitBtn');

    if (!name || !phone || !service || !btn) return;

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

    btn.disabled = true;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening WhatsApp...';

    const waUrl = 'https://wa.me/254712912718';

    try {
      window.open(waUrl, '_blank');
    } catch {
      window.location.href = waUrl;
    }

    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-check"></i> Opened!';
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

  // ===== LAZY LOAD =====
  const initLazyLoad = () => {
    const lazyElements = document.querySelectorAll('.lazy-load');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    lazyElements.forEach(el => observer.observe(el));
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

  // ===== ACTIVE NAV LINK =====
  const setActiveLink = () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
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
    initLazyLoad();
    animateCounters();
    initSmoothScroll();
    initParallax();

    // Event listeners
    if (hamburger) {
      hamburger.addEventListener('click', toggleMenu);
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

    window.addEventListener('scroll', setActiveLink, { passive: true });
    setActiveLink();

    // Expose functions
    window.toggleMenu = toggleMenu;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();