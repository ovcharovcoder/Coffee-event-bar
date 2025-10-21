// === VIDEO POPUP ===
const openBtn = document.getElementById('openVideo');
const popup = document.getElementById('videoPopup');
const iframe = document.getElementById('youtubeVideo');

// Отримуємо лінк прямо з HTML
openBtn.addEventListener('click', () => {
  const videoURL = openBtn.dataset.video; // <-- беремо з data-video
  iframe.src = videoURL;
  popup.classList.add('active');
});

// Закриття при кліку поза відео
popup.addEventListener('click', e => {
  if (e.target === popup) {
    popup.classList.remove('active');
    iframe.src = ''; // зупинити відео
  }
});

// === MENU BURGER ===
const menuBtn = document.querySelector('.header__menu-btn');
const menu = document.querySelector('.header__menu');
const overlay = document.querySelector('.menu-overlay');
const closeBtn = document.querySelector('#closeMenu');

menuBtn.addEventListener('click', e => {
  e.preventDefault();
  menu.classList.add('active');
  overlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  menu.classList.remove('active');
  overlay.classList.remove('active');
});

overlay.addEventListener('click', () => {
  menu.classList.remove('active');
  overlay.classList.remove('active');
});

// === SORTING + SMOOTH ANIMATION + FADE OUT ===
document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.products__menu-item');
  const dishes = document.querySelectorAll('.products__dish');
  const showMoreBtn = document.getElementById('showMoreBtn');

  let visibleCount = 3;
  let currentCategory = 'coffee';
  let expanded = false;

  function showDishes(category) {
    const filtered = Array.from(dishes).filter(
      dish => dish.dataset.category === category
    );

    // 1️⃣ Додаємо fade-out до всіх поточних карток
    dishes.forEach(dish => {
      dish.classList.remove('visible');
      dish.classList.add('fading-out');
    });

    // 2️⃣ Через 600мс (час анімації) ховаємо непотрібні
    setTimeout(() => {
      dishes.forEach(dish => {
        dish.style.display = 'none';
        dish.classList.remove('fading-out');
      });

      // 3️⃣ Визначаємо скільки показати нових карток
      const toShow = expanded ? filtered.length : visibleCount;

      filtered.slice(0, toShow).forEach((dish, index) => {
        dish.style.display = 'flex';
        // невелика пауза, щоб браузер встиг оновити DOM перед fade-in
        setTimeout(() => {
          dish.classList.add('visible');
        }, 150 + index * 100);
      });

      // 4️⃣ Оновлюємо кнопку Show/Hide
      if (filtered.length <= visibleCount) {
        showMoreBtn.style.display = 'none';
      } else {
        showMoreBtn.style.display = 'block';
        showMoreBtn.textContent = expanded ? 'Hide more' : 'Show more';
      }
    }, 600);
  }

  // Натискання на категорію
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      menuItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      currentCategory = item.dataset.filter;
      visibleCount = 3;
      expanded = false;
      showDishes(currentCategory);
    });
  });

  // Кнопка Show more / Hide more
  showMoreBtn.addEventListener('click', () => {
    expanded = !expanded;
    showDishes(currentCategory);
  });

  // Початковий показ
  showDishes(currentCategory);
});

// === SLIDER GALLERY ===
const wrapper = document.querySelector('.curved-slider__wrapper');
const slides = Array.from(document.querySelectorAll('.curved-slider__slide'));
const pagination = document.querySelector('.curved-slider__pagination');

const visibleSlides = 4; // 4 повних слайди
const slideMargin = 10;
let currentIndex = 0;

// Клонування перших slides для циклу
slides.slice(0, visibleSlides).forEach(slide => {
  const clone = slide.cloneNode(true);
  wrapper.appendChild(clone);
});

// Створюємо пагінацію (для оригінальних слайдів)
slides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('curved-slider__pagination-dot');
  if (i === 0) dot.classList.add('active');
  pagination.appendChild(dot);
  dot.addEventListener('click', () => {
    goToSlide(i);
  });
});

// Переходи
function goToSlide(index) {
  const slideWidth = slides[0].offsetWidth + slideMargin;
  wrapper.style.transition = 'transform 0.5s ease-in-out';
  wrapper.style.transform = `translateX(-${slideWidth * index}px)`;
  currentIndex = index;
  updatePagination();
}

// Автопрокрутка
function autoSlide() {
  const slideWidth = slides[0].offsetWidth + slideMargin;
  currentIndex++;
  wrapper.style.transition = 'transform 0.5s ease-in-out';
  wrapper.style.transform = `translateX(-${slideWidth * currentIndex}px)`;

  // Якщо доходимо до клонованих слайдів, "стрибок" без transition
  if (currentIndex >= slides.length) {
    setTimeout(() => {
      wrapper.style.transition = 'none';
      wrapper.style.transform = 'translateX(0)';
      currentIndex = 0;
    }, 500); // час transition
  }

  updatePagination();
}

function updatePagination() {
  document
    .querySelectorAll('.curved-slider__pagination-dot')
    .forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex % slides.length);
    });
}

// Запуск автопрокрутки
setInterval(autoSlide, 3000);

// === TESTIMONIALS SLIDER ===
const testimonialsTrack = document.querySelector(
  '.testimonials__slider-wrapper'
);
const testimonialsSlides = Array.from(
  document.querySelectorAll('.testimonials__slider-items')
);
const testimonialsDotsContainer = document.querySelector(
  '.testimonials__pagination'
);

const testimonialsVisibleCount = 2.5; // 2,5 слайди видно
const testimonialsGap = 20; // Відстань між слайдами
let testimonialsPosition = 0;

// Клонуємо перші кілька для безкінечного скролу
testimonialsSlides
  .slice(0, Math.ceil(testimonialsVisibleCount))
  .forEach(slide => {
    const clone = slide.cloneNode(true);
    testimonialsTrack.appendChild(clone);
  });

// Створюємо точки пагінації лише для справжніх слайдів
testimonialsSlides.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.classList.add('testimonials__pagination-dot');
  if (i === 0) dot.classList.add('active');
  testimonialsDotsContainer.appendChild(dot);

  dot.addEventListener('click', () => {
    moveTestimonialsTo(i);
  });
});

function moveTestimonialsTo(index) {
  const slideWidth = testimonialsSlides[0].offsetWidth + testimonialsGap;
  testimonialsTrack.style.transition = 'transform 0.6s ease';
  testimonialsTrack.style.transform = `translateX(-${slideWidth * index}px)`;
  testimonialsPosition = index;
  updateTestimonialsDots();
}

function autoTestimonialsSlide() {
  const slideWidth = testimonialsSlides[0].offsetWidth + testimonialsGap;
  testimonialsPosition++;
  testimonialsTrack.style.transition = 'transform 0.6s ease';
  testimonialsTrack.style.transform = `translateX(-${
    slideWidth * testimonialsPosition
  }px)`;

  if (testimonialsPosition >= testimonialsSlides.length) {
    setTimeout(() => {
      testimonialsTrack.style.transition = 'none';
      testimonialsTrack.style.transform = 'translateX(0)';
      testimonialsPosition = 0;
    }, 600);
  }

  updateTestimonialsDots();
}

function updateTestimonialsDots() {
  document
    .querySelectorAll('.testimonials__pagination-dot')
    .forEach((dot, i) => {
      dot.classList.toggle(
        'active',
        i === testimonialsPosition % testimonialsSlides.length
      );
    });
}

setInterval(autoTestimonialsSlide, 4000);

// === ANIMATION ===
document.addEventListener('DOMContentLoaded', () => {
  const selector = '.reveal-right, .reveal-left, .reveal-up';
  const elements = Array.from(document.querySelectorAll(selector));

  if (!elements.length) {
    console.warn(
      '[Reveal] Нема елементів для reveal — перевір селектор:',
      selector
    );
    return;
  }

  // Параметри observer — трохи агресивніші rootMargin, щоб анімація починалась трохи раніше
  const options = {
    root: null,
    rootMargin: '0px 0px -10% 0px', // починаємо коли нижня частина елемента входить на 10% в viewport
    threshold: 0,
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          observer.unobserve(entry.target); // знімаємо спостереження — анімація показується один раз
        }
      });
    }, options);

    elements.forEach(el => {
      // якщо елемент (через картинки) ще не має висоти, краще чекати на load; але усе одно додаємо до observer
      io.observe(el);
    });
  } else {
    // Fallback: якщо браузер старий — просто показуємо елементи при завантаженні
    console.warn(
      '[Reveal] IntersectionObserver не підтримується. Виконується fallback.'
    );
    elements.forEach(el => el.classList.add('reveal-visible'));
  }
});
