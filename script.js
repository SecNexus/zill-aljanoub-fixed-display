document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      toggleBtn.classList.toggle('active', isOpen);
      toggleBtn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking links
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Count animations for stats bar (Trust elements)
  const stats = document.querySelectorAll('.stat-number');
  const speed = 200;

  const runCounter = () => {
    stats.forEach(counter => {
      const updateCount = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const inc = Math.ceil(target / speed);

        if (count < target) {
          counter.innerText = count + inc;
          setTimeout(updateCount, 15);
        } else {
          counter.innerText = target;
        }
      };
      updateCount();
    });
  };

  // Intersection observer to trigger counters when visible
  if (stats.length > 0) {
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const trustSection = document.querySelector('.trust-bar-section');
    if (trustSection) observer.observe(trustSection);
  }

  // Testimonials Slider
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dots .dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentSlide = 0;

  if (slides.length > 0) {
    const showSlide = (n) => {
      slides.forEach(slide => slide.classList.remove('active'));
      dots.forEach(dot => dot.classList.remove('active'));
      
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    };

    if (prevBtn) {
      prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
    }

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const slideIndex = +e.target.getAttribute('data-slide');
        showSlide(slideIndex);
      });
    });

    // Auto slide
    setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  }

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const faqItem = question.parentElement;
      const answer = question.nextElementSibling;
      const isActive = faqItem.classList.contains('active');
      
      // Close all other FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const q = item.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });
      
      if (!isActive) {
        faqItem.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // Category Page Grid Lightbox Logic
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  let activeGalleryIndex = 0;

  if (galleryItems.length > 0 && lightbox) {
    const openLightbox = (index) => {
      activeGalleryIndex = index;
      const item = galleryItems[activeGalleryIndex];
      const src = item.getAttribute('data-src');
      const img = item.querySelector('img');
      const alt = img ? img.getAttribute('alt') : '';
      
      if (lightboxImg) lightboxImg.src = src;
      if (lightboxCaption) lightboxCaption.innerText = alt;
      if (lightboxImg) lightboxImg.alt = alt || 'صورة من أعمال ظل الجنوب';
      lightbox.style.display = 'block';
      document.body.style.overflow = 'hidden'; // prevent scroll
    };

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });

    const showPrevImg = () => {
      activeGalleryIndex = (activeGalleryIndex - 1 + galleryItems.length) % galleryItems.length;
      openLightbox(activeGalleryIndex);
    };

    const showNextImg = () => {
      activeGalleryIndex = (activeGalleryIndex + 1) % galleryItems.length;
      openLightbox(activeGalleryIndex);
    };

    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImg);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImg);

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (lightbox.style.display === 'block') {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showPrevImg();
        if (e.key === 'ArrowLeft') showNextImg();
      }
    });
  }

  // Lead Form submission triggers redirecting to WhatsApp immediately
  const masterForm = document.getElementById('master-lead-form');
  const popupForm = document.getElementById('popup-lead-form');

  const handleFormSubmit = (name, phone, service, neighborhood, notes = '') => {
    const message = `مرحبا مؤسسة ظل الجنوب للمقاولات والحدادة 👋
أود طلب معاينة مجانية وحجز موعد لمشروعي في أبها وخميس مشيط:
- اسم العميل: ${name}
- جوال التواصل: ${phone}
- الخدمة المطلوبة: ${service}
- الحي / المنطقة: ${neighborhood}
${notes ? '- تفاصيل إضافية: ' + notes : ''}`;
    
    const encodedText = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/966538936405?text=${encodedText}`;
    
    // Redirect customer to WhatsApp instantly
    window.location.href = whatsappURL;
  };

  if (masterForm) {
    masterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('lead-name').value;
      const phone = document.getElementById('lead-phone').value;
      const serviceEl = document.getElementById('lead-service');
      const neighborhoodEl = document.getElementById('lead-neighborhood');
      const service = serviceEl ? serviceEl.options[serviceEl.selectedIndex].text : 'طلب معاينة';
      const neighborhood = neighborhoodEl ? neighborhoodEl.options[neighborhoodEl.selectedIndex].text : 'أبها / خميس مشيط';
      const message = document.getElementById('lead-message') ? document.getElementById('lead-message').value : '';
      
      handleFormSubmit(name, phone, service, neighborhood, message);
    });
  }

  if (popupForm) {
    popupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = popupForm.querySelectorAll('.form-input');
      const name = inputs[0] ? inputs[0].value : 'عميل';
      const phone = inputs[1] ? inputs[1].value : '';
      
      handleFormSubmit(name, phone, 'حجز معاينة مجانية عبر النافذة المنبثقة', 'أبها وخميس مشيط');
      
      // Close popup
      const exitPopup = document.getElementById('exit-intent-popup');
      if (exitPopup) exitPopup.style.display = 'none';
    });
  }

  // Popup Modal Logic (Time-based & Exit-Intent)
  let popupShown = false;
  const exitPopup = document.getElementById('exit-intent-popup');
  const closePopupBtn = document.getElementById('popup-close-btn');

  if (exitPopup) {
    const displayPopup = () => {
      if (!popupShown) {
        exitPopup.style.display = 'flex';
        popupShown = true;
        sessionStorage.setItem('exit_popup_shown', 'true');
      }
    };

    // Check if shown in current session
    if (sessionStorage.getItem('exit_popup_shown') === 'true') {
      popupShown = true;
    }

    // Trigger only on desktop exit intent; do not interrupt users while reading the page.
    document.addEventListener('mouseleave', (e) => {
      if (window.innerWidth >= 992 && e.clientY < 0) {
        displayPopup();
      }
    });

    if (closePopupBtn) {
      closePopupBtn.addEventListener('click', () => {
        exitPopup.style.display = 'none';
      });
    }

    exitPopup.addEventListener('click', (e) => {
      if (e.target === exitPopup) {
        exitPopup.style.display = 'none';
      }
    });
  }
});