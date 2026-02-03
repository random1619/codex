const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const modeToggle = document.querySelector('.mode-toggle');
const filters = document.querySelectorAll('.filter-btn');
const items = document.querySelectorAll('.masonry-item');
const lightbox = document.querySelector('.lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.querySelector('.lightbox-title');
const lightboxLocation = document.querySelector('.lightbox-location');
const lightboxExif = document.querySelector('.lightbox-exif');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxNext = document.querySelector('.lightbox-next');
const lightboxPrev = document.querySelector('.lightbox-prev');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const carouselPrev = document.querySelector('.carousel-btn.prev');
const carouselNext = document.querySelector('.carousel-btn.next');
const loadingScreen = document.querySelector('.loading-screen');

let currentLightboxIndex = 0;
let testimonialIndex = 0;
let touchStartX = 0;
let visibleItems = Array.from(items);

const updateHeader = () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', updateHeader);
updateHeader();

menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

modeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

filters.forEach((btn) => {
  btn.addEventListener('click', () => {
    filters.forEach((filter) => filter.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.dataset.filter;

    items.forEach((item) => {
      const matches = category === 'all' || item.dataset.category === category;
      item.style.display = matches ? 'block' : 'none';
    });

    visibleItems = Array.from(items).filter((item) => item.style.display !== 'none');
  });
});

const openLightbox = (index) => {
  const item = visibleItems[index];
  if (!item) return;
  const img = item.querySelector('img');
  lightboxImage.src = img.src;
  lightboxTitle.textContent = item.dataset.title;
  lightboxLocation.textContent = item.dataset.location;
  lightboxExif.textContent = item.dataset.exif || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  currentLightboxIndex = index;
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
};

const showNext = (direction) => {
  const total = visibleItems.length;
  if (!total) return;
  currentLightboxIndex = (currentLightboxIndex + direction + total) % total;
  openLightbox(currentLightboxIndex);
};

items.forEach((item, index) => {
  item.addEventListener('click', () => {
    visibleItems = Array.from(items).filter((entry) => entry.style.display !== 'none');
    const visibleIndex = visibleItems.indexOf(item);
    openLightbox(visibleIndex);
  });
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxNext?.addEventListener('click', () => showNext(1));
lightboxPrev?.addEventListener('click', () => showNext(-1));

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

window.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowRight') showNext(1);
  if (event.key === 'ArrowLeft') showNext(-1);
});

lightbox?.addEventListener('touchstart', (event) => {
  touchStartX = event.changedTouches[0].clientX;
});

lightbox?.addEventListener('touchend', (event) => {
  const delta = event.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 40) {
    showNext(delta > 0 ? -1 : 1);
  }
});

const setActiveTestimonial = (index) => {
  testimonialCards.forEach((card) => card.classList.remove('active'));
  testimonialCards[index].classList.add('active');
  testimonialIndex = index;
};

carouselNext?.addEventListener('click', () => {
  setActiveTestimonial((testimonialIndex + 1) % testimonialCards.length);
});

carouselPrev?.addEventListener('click', () => {
  setActiveTestimonial(
    (testimonialIndex - 1 + testimonialCards.length) % testimonialCards.length
  );
});

setInterval(() => {
  setActiveTestimonial((testimonialIndex + 1) % testimonialCards.length);
}, 7000);

const revealItems = document.querySelectorAll('section, .service-card, .blog-card');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => {
  item.classList.add('reveal');
  observer.observe(item);
});

window.addEventListener('load', () => {
  setTimeout(() => loadingScreen.classList.add('hidden'), 800);
});
