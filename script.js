/* ==========================================================================
   INTERACTIVE APP LOGIC - VELAVA MEDICAL CODING TRAINING CENTRE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initEligibilityQuiz();
  initCodingGame();
  initScrollReveal();
  initMedicalStore();
  initCart();
});

/* ==========================================================================
   NAVBAR & SCROLL HANDLING
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-enroll');
  const overlay = document.getElementById('nav-overlay');

  // Change navbar appearance on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNavLink();
  });

  // Toggle mobile menu
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close mobile menu when clicking on the overlay backdrop
  if (overlay) {
    overlay.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navMenu.classList.remove('open');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Highlight active link based on scroll position
  function highlightNavLink() {
    let scrollPosition = window.scrollY + 120; // offset header height

    document.querySelectorAll('section').forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* ==========================================================================
   DARK / LIGHT THEME TOGGLE
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  
  // Check user preference in localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'dark') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }
}

/* ==========================================================================
   ELIGIBILITY CHECKER LOGIC
   ========================================================================== */
const quizState = {
  education: null,
  computer: null,
  english: null
};

function initEligibilityQuiz() {
  // Pre-calculate score based on default empty selections
  updateEligibilityDisplay();
}

function toggleOption(boxElement) {
  const parentGroup = boxElement.closest('.quiz-group');
  const siblings = parentGroup.querySelectorAll('.option-box');
  const isSelected = boxElement.classList.contains('selected');

  // Clear selections inside this category
  siblings.forEach(sib => sib.classList.remove('selected'));

  // Toggle selection
  if (!isSelected) {
    boxElement.classList.add('selected');
    const category = parentGroup.querySelector('.quiz-question-title').innerText;
    
    if (category.includes('educational')) {
      quizState.education = boxElement;
    } else if (category.includes('computer')) {
      quizState.computer = boxElement;
    } else if (category.includes('English')) {
      quizState.english = boxElement;
    }
  } else {
    // Deselect completely
    const category = parentGroup.querySelector('.quiz-question-title').innerText;
    if (category.includes('educational')) {
      quizState.education = null;
    } else if (category.includes('computer')) {
      quizState.computer = null;
    } else if (category.includes('English')) {
      quizState.english = null;
    }
  }

  updateEligibilityDisplay();
}

function updateEligibilityDisplay() {
  const scoreText = document.getElementById('eligibility-score');
  const badgeText = document.getElementById('eligibility-badge');
  const descText = document.getElementById('eligibility-desc');

  // If any category is empty, prompt selection
  if (!quizState.education || !quizState.computer || !quizState.english) {
    scoreText.innerText = '0%';
    badgeText.innerText = 'No Selection';
    badgeText.className = 'result-badge';
    descText.innerText = 'Select one option from each category on the left to estimate your coding suitability.';
    return;
  }

  // Calculate sum of weights
  const wEdu = parseInt(quizState.education.getAttribute('data-weight'));
  const wComp = parseInt(quizState.computer.getAttribute('data-weight'));
  const wEng = parseInt(quizState.english.getAttribute('data-weight'));
  const score = wEdu + wComp + wEng;

  scoreText.innerText = `${score}%`;

  // Display status badges and advice
  if (score >= 80) {
    badgeText.innerText = 'Highly Eligible';
    badgeText.className = 'result-badge';
    badgeText.style.backgroundColor = 'var(--secondary)';
    badgeText.style.color = '#fff';
    descText.innerText = 'Fantastic! Your background (including Life Sciences) and strong communication skills match the ideal candidate profile. You have high potential to excel quickly and secure placements.';
  } else if (score >= 50) {
    badgeText.innerText = 'Suitable Candidate';
    badgeText.className = 'result-badge';
    badgeText.style.backgroundColor = 'var(--accent)';
    badgeText.style.color = '#fff';
    descText.innerText = 'You are eligible! Freshers and non-science graduates are highly successful in medical coding with our systematic modules in medical terminology and coding standards.';
  } else {
    badgeText.innerText = 'Training Needed';
    badgeText.className = 'result-badge';
    badgeText.style.backgroundColor = 'var(--warning)';
    badgeText.style.color = '#000';
    descText.innerText = 'You have a basic foundation, but you will require intensive vocabulary and computer orientation training. Don\'t worry, we start all our batches from the absolute basics!';
  }
}

/* ==========================================================================
   CASE SHEET CODING PRACTICE (GAME)
   ========================================================================== */
const gameCases = [
  {
    category: 'DIAGNOSIS (ICD-10-CM)',
    text: '"The patient presented with acute, severe lower right quadrant abdominal pain. Diagnostic ultrasound confirmed acute appendicitis, and the patient was immediately prepared for emergency surgical intervention."',
    question: 'Which ICD-10-CM code should you assign for this diagnosis?',
    options: [
      { text: '<strong>A. E11.9</strong> - Type 2 diabetes mellitus without complications', correct: false },
      { text: '<strong>B. K35.80</strong> - Acute appendicitis, unspecified', correct: true },
      { text: '<strong>C. J45.901</strong> - Unspecified asthma with acute exacerbation', correct: false }
    ],
    explanation: 'K35.80 is the correct code. Under the ICD-10 index, acute appendicitis is assigned under category K35. Code E11.9 represents Type 2 Diabetes, and J45.901 is for chronic asthma.'
  },
  {
    category: 'PROCEDURE (CPT)',
    text: '"Surgical Report: Under general anesthesia, a laparoscopic surgical telescope was introduced. The inflamed appendix was identified, mobilized, divided at the base using endoscopic staplers, and extracted successfully. Patient tolerated the procedure well."',
    question: 'Which CPT procedure code should be assigned for this surgery?',
    options: [
      { text: '<strong>A. 99213</strong> - Office or other outpatient visit, 15-29 minutes', correct: false },
      { text: '<strong>B. 71045</strong> - Radiologic examination, chest; single view', correct: false },
      { text: '<strong>C. 44970</strong> - Laparoscopy, surgical, appendectomy', correct: true }
    ],
    explanation: '44970 is correct. Code 44970 represents a laparoscopic surgical removal of the appendix. 99213 is an evaluation code for routine clinic visits, and 71045 is an X-ray imaging code.'
  },
  {
    category: 'DIAGNOSIS (ICD-10-CM)',
    text: '"A 45-year-old male with long-standing Type 2 Diabetes Mellitus presents for his routine follow-up check. No diabetic complications are reported, and blood sugar levels are controlled with oral medication."',
    question: 'Which ICD-10-CM code is correct?',
    options: [
      { text: '<strong>A. E11.9</strong> - Type 2 diabetes mellitus without complications', correct: true },
      { text: '<strong>B. I10</strong> - Essential (primary) hypertension', correct: false },
      { text: '<strong>C. M81.0</strong> - Age-related osteoporosis without current pathological fracture', correct: false }
    ],
    explanation: 'E11.9 is correct. This represents diabetes mellitus type 2 without current mention of microvascular or macrovascular complications. I10 is high blood pressure, and M81.0 is osteoporosis.'
  }
];

let currentGameIdx = 0;
let userScore = 0;
let answerChecked = false;

function initCodingGame() {
  loadCase(currentGameIdx);
}

function loadCase(idx) {
  if (idx >= gameCases.length) {
    showGameOverScreen();
    return;
  }

  const currentCase = gameCases[idx];
  answerChecked = false;

  // Set elements
  document.getElementById('game-current-step').innerText = idx + 1;
  document.getElementById('case-category').innerText = currentCase.category;
  document.getElementById('case-text').innerText = currentCase.text;
  document.querySelector('.game-question').innerText = currentCase.question;

  // Render options
  const optionsContainer = document.getElementById('game-options-container');
  optionsContainer.innerHTML = '';

  currentCase.options.forEach((opt, optIdx) => {
    const btn = document.createElement('button');
    btn.className = 'game-opt-btn';
    btn.innerHTML = `
      <span>${opt.text}</span>
      <i class="fa-regular fa-circle"></i>
    `;
    btn.addEventListener('click', () => submitAnswer(btn, optIdx, opt.correct));
    optionsContainer.appendChild(btn);
  });

  // Hide feedback and next button
  document.getElementById('game-feedback-box').style.display = 'none';
  document.getElementById('btn-next-case').style.display = 'none';
}

function submitAnswer(btnElement, optIdx, isCorrect) {
  if (answerChecked) return;
  answerChecked = true;

  const currentCase = gameCases[currentGameIdx];
  const allButtons = document.querySelectorAll('.game-opt-btn');

  // Disable all buttons
  allButtons.forEach(btn => btn.style.cursor = 'not-allowed');

  const feedbackBox = document.getElementById('game-feedback-box');
  const feedTitle = document.getElementById('feedback-title');
  const feedDesc = document.getElementById('feedback-desc');

  if (isCorrect) {
    userScore++;
    btnElement.classList.add('correct');
    btnElement.querySelector('i').className = 'fa-solid fa-circle-check';
    
    feedTitle.innerText = 'Correct Answer! 🥳';
    feedbackBox.className = 'game-feedback correct';
  } else {
    btnElement.classList.add('incorrect');
    btnElement.querySelector('i').className = 'fa-solid fa-circle-xmark';
    
    // Highlight correct button
    allButtons.forEach((btn, idx) => {
      if (currentCase.options[idx].correct) {
        btn.classList.add('correct');
        btn.querySelector('i').className = 'fa-solid fa-circle-check';
      }
    });

    feedTitle.innerText = 'Incorrect Answer';
    feedbackBox.className = 'game-feedback incorrect';
  }

  feedDesc.innerText = currentCase.explanation;
  feedbackBox.style.display = 'block';
  document.getElementById('btn-next-case').style.display = 'inline-flex';
}

function loadNextCase() {
  currentGameIdx++;
  loadCase(currentGameIdx);
}

function showGameOverScreen() {
  const gameBody = document.querySelector('.game-body');
  gameBody.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <i class="fa-solid fa-graduation-cap" style="font-size: 5rem; color: var(--secondary); margin-bottom: 20px;"></i>
      <h3 style="font-size: 2rem; margin-bottom: 10px;">Practice Completed!</h3>
      <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 25px;">
        You scored <strong>${userScore} out of 3</strong> correct codes!
      </p>
      <div style="background-color: var(--primary-alpha); padding: 20px; border-radius: var(--radius-md); max-width: 500px; margin: 0 auto 30px auto; border: 1px solid rgba(11, 43, 92, 0.1);">
        <p style="margin: 0; font-size: 0.95rem; font-weight: 500;">
          Ready to decode medical charts with 100% accuracy? Enroll in our systematic certification training program.
        </p>
      </div>
      <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="restartGame()">Restart Practice</button>
        <a href="#contact" class="btn btn-secondary">Inquire About Course</a>
      </div>
    </div>
  `;
}

function restartGame() {
  currentGameIdx = 0;
  userScore = 0;
  
  // Reset game layout
  const gameContainer = document.querySelector('.game-container');
  gameContainer.innerHTML = `
    <div class="game-header">
      <div class="game-title-area">
        <h3>Case Sheet Simulator</h3>
        <p style="font-size: 0.85rem; opacity: 0.85; margin: 0;">Translate medical records to alphanumeric codes</p>
      </div>
      <div class="game-score-badge">
        <i class="fa-solid fa-award"></i> Case: <span id="game-current-step">1</span>/3
      </div>
    </div>

    <div class="game-body">
      <div class="game-case-box">
        <div class="game-case-tag" id="case-category">DIAGNOSIS (ICD-10-CM)</div>
        <div class="game-case-text" id="case-text"></div>
      </div>

      <div class="game-question"></div>
      
      <div class="game-options" id="game-options-container"></div>

      <div class="game-feedback" id="game-feedback-box">
        <h4 id="feedback-title" style="margin-bottom: 5px; font-weight: 700;"></h4>
        <p id="feedback-desc" style="margin: 0; font-size: 0.95rem;"></p>
      </div>

      <div class="game-nav-footer">
        <button class="btn btn-primary" id="btn-next-case" onclick="loadNextCase()" style="display: none;">Next Case <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  `;
  
  initCodingGame();
}

/* ==========================================================================
   FORM HANDLING & SUBMISSION MODAL
   ========================================================================== */
function handleInquirySubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('studentName');
  const phoneInput = document.getElementById('studentPhone');
  const emailInput = document.getElementById('studentEmail');
  const degreeSelect = document.getElementById('studentDegree');
  const batchSelect = document.getElementById('studentBatch');
  const msgInput = document.getElementById('studentMessage');

  // Reset errors
  document.getElementById('nameError').style.display = 'none';
  document.getElementById('phoneError').style.display = 'none';
  document.getElementById('emailError').style.display = 'none';

  let isValid = true;

  // Validation
  if (!nameInput.value.trim()) {
    document.getElementById('nameError').style.display = 'block';
    isValid = false;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phoneInput.value.trim())) {
    document.getElementById('phoneError').style.display = 'block';
    isValid = false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailInput.value.trim())) {
    document.getElementById('emailError').style.display = 'block';
    isValid = false;
  }

  if (!isValid) return;

  // Construct submission data
  const inquiry = {
    name: nameInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim(),
    stream: degreeSelect.value,
    batch: batchSelect.value,
    message: msgInput.value.trim(),
    timestamp: new Date().toISOString()
  };

  // Save to LocalStorage mock database
  const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
  inquiries.push(inquiry);
  localStorage.setItem('inquiries', JSON.stringify(inquiries));

  // Construct WhatsApp text message
  const whatsappNumber = '918344768752';
  const whatsappMsg = `*New Admission Inquiry - Velava Medical Coding*
---------------------------------------
*Name:* ${inquiry.name}
*Phone:* ${inquiry.phone}
*Email:* ${inquiry.email}
*Educational Stream:* ${inquiry.stream}
*Preferred Batch:* ${inquiry.batch}
*Message:* ${inquiry.message || 'No additional message'}`;

  const encodedMsg = encodeURIComponent(whatsappMsg);
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMsg}`;

  // Open WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');

  // Reset form
  document.getElementById('inquiryForm').reset();

  // Show Success Modal
  openModal();
}

function openModal() {
  const modal = document.getElementById('successModal');
  modal.style.display = 'flex';
  setTimeout(() => {
    modal.classList.add('active');
  }, 10);
}

function closeModal() {
  const modal = document.getElementById('successModal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 300);
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const revealItems = document.querySelectorAll('.reveal-item');
  
  if (!revealItems.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealItems.forEach(item => {
    observer.observe(item);
  });
}


/* ==========================================================================
   VELAVA MEDICAL STORE & E-COMMERCE CART ENGINE
   ========================================================================== */

const PHARMACY_WHATSAPP = '919500371616'; // Velava Pharmacy Direct Phone
let storeProducts = [];
let activeStoreCategory = 'all';
let isOffersOnly = false;
let storeSearchQuery = '';
let cart = [];

// Fallback initial products if API takes a moment or initial install
const defaultMedicalProducts = [
  {
    id: 1,
    name: 'Omron Digital Blood Pressure Monitor (HEM-7120)',
    category: 'Medical & Surgical Devices',
    description: 'Automatic digital BP monitor with Intellisense tech for accurate, comfortable measurements.',
    mrp_price: 2450.00,
    offer_price: 1899.00,
    discount_percent: 22,
    image_url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    badge: 'Best Seller',
    stock_status: 'in_stock'
  },
  {
    id: 2,
    name: 'Accu-Chek Blood Glucose Monitor Kit (with 10 Strips)',
    category: 'Medical & Surgical Devices',
    description: 'Instant blood sugar testing machine with test strips. Accurate readings in 5 seconds.',
    mrp_price: 1599.00,
    offer_price: 1199.00,
    discount_percent: 25,
    image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    badge: '25% OFF',
    stock_status: 'in_stock'
  },
  {
    id: 3,
    name: 'Dr. Morepen Non-Contact Infrared Thermometer',
    category: 'Medical & Surgical Devices',
    description: 'Forehead contactless temperature monitor with high fever audio-visual alert.',
    mrp_price: 1890.00,
    offer_price: 1250.00,
    discount_percent: 34,
    image_url: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80',
    badge: 'Special Deal',
    stock_status: 'in_stock'
  },
  {
    id: 4,
    name: 'Fingertip Pulse Oximeter with OLED Display',
    category: 'Medical & Surgical Devices',
    description: 'Precision SpO2 oxygen saturation and pulse rate monitor with multi-directional screen.',
    mrp_price: 1299.00,
    offer_price: 699.00,
    discount_percent: 46,
    image_url: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80',
    badge: 'Flat 46% OFF',
    stock_status: 'in_stock'
  },
  {
    id: 5,
    name: 'Velava Premium First Aid & Emergency Care Kit',
    category: 'First Aid & Emergency',
    description: '42 essential medical items including antiseptic liquids, bandages, surgical gauze & tape.',
    mrp_price: 999.00,
    offer_price: 699.00,
    discount_percent: 30,
    image_url: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=600&auto=format&fit=crop&q=80',
    badge: 'Essential',
    stock_status: 'in_stock'
  },
  {
    id: 6,
    name: 'Immunity Booster Multivitamin & Zinc Tablets (60 Caps)',
    category: 'Nutrition & Wellness',
    description: 'Daily immune defense supplement with Vitamin C, D3, Zinc, and essential antioxidants.',
    mrp_price: 650.00,
    offer_price: 485.00,
    discount_percent: 25,
    image_url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&auto=format&fit=crop&q=80',
    badge: 'Special Offer',
    stock_status: 'in_stock'
  },
  {
    id: 7,
    name: 'All-in-One Facial Steam Inhaler & Vaporizer',
    category: 'Nutrition & Wellness',
    description: 'Steam therapy for nasal congestion, cough relief, sinusitis, and facial cleansing.',
    mrp_price: 599.00,
    offer_price: 349.00,
    discount_percent: 42,
    image_url: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=600&auto=format&fit=crop&q=80',
    badge: 'Save ₹250',
    stock_status: 'in_stock'
  },
  {
    id: 8,
    name: 'N95 5-Layer Protective Face Masks (Pack of 10)',
    category: 'Personal & Mother Care',
    description: 'Certified filtration respiratory protection against dust, bacteria, and droplets.',
    mrp_price: 499.00,
    offer_price: 249.00,
    discount_percent: 50,
    image_url: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=600&auto=format&fit=crop&q=80',
    badge: '50% OFF',
    stock_status: 'in_stock'
  }
];

function initMedicalStore() {
  const container = document.getElementById('storeProductsGrid');
  if (!container) return;

  // Instant render default products first
  if (!storeProducts || storeProducts.length === 0) {
    storeProducts = defaultMedicalProducts;
  }
  renderStoreProducts();

  // Fetch live updates from MySQL
  loadStoreProducts();
}

async function loadStoreProducts() {
  try {
    const res = await fetch('api/products.php');
    if (!res.ok) throw new Error('API fetch failed');
    const data = await res.json();
    if (data.status === 'success' && data.products && data.products.length > 0) {
      storeProducts = data.products;
    } else {
      storeProducts = defaultMedicalProducts;
    }
  } catch (err) {
    console.warn('Loading fallback medical products:', err.message);
    storeProducts = defaultMedicalProducts;
  }
  renderStoreProducts();
}

function renderStoreProducts() {
  const container = document.getElementById('storeProductsGrid');
  if (!container) return;

  const filtered = storeProducts.filter(p => {
    const matchesCat = activeStoreCategory === 'all' || p.category === activeStoreCategory;
    const matchesOffers = !isOffersOnly || (parseFloat(p.offer_price) < parseFloat(p.mrp_price) || (p.badge && p.badge.length > 0));
    const q = storeSearchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (p.name && p.name.toLowerCase().includes(q)) || 
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q));

    return matchesCat && matchesOffers && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="store-empty-state">
        <i class="fa-solid fa-prescription-bottle-medical" style="font-size: 2.5rem; margin-bottom: 12px; color: #94a3b8;"></i>
        <h3 style="margin-bottom: 6px; color: var(--primary);">No Medical Products Found</h3>
        <p>Try searching for a different item or click 'All Products'.</p>
        <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="resetStoreFilters()">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const fallback = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500';
    const img = p.image_url ? p.image_url : fallback;
    const mrp = parseFloat(p.mrp_price || 0);
    const offer = parseFloat(p.offer_price || 0);
    const hasDiscount = offer > 0 && mrp > offer;
    const savings = Math.round(mrp - offer);
    const isOut = p.stock_status === 'out_of_stock';

    // WhatsApp Message URL for direct single item purchase
    const orderText = encodeURIComponent(`*Order Request - Velava Medicals Store*\n-----------------------------------\nProduct: ${p.name}\nOffer Price: ₹${offer.toFixed(2)}\nStatus: Inquiring availability & delivery.`);
    const singleWaUrl = `https://wa.me/${PHARMACY_WHATSAPP}?text=${orderText}`;

    return `
      <div class="store-card">
        ${p.badge ? `<span class="store-card-badge">${escapeStoreHtml(p.badge)}</span>` : ''}
        <div class="store-card-img-wrap">
          <img src="${escapeStoreHtml(img)}" alt="${escapeStoreHtml(p.name)}" loading="lazy" onerror="this.src='${fallback}'">
        </div>
        <div class="store-card-body">
          <span class="store-card-category">${escapeStoreHtml(p.category)}</span>
          <h3 class="store-card-title">${escapeStoreHtml(p.name)}</h3>
          <p class="store-card-desc">${escapeStoreHtml(p.description || '')}</p>
          
          <div class="store-card-pricing">
            <span class="store-price-offer">₹${offer.toFixed(2)}</span>
            ${hasDiscount ? `<span class="store-price-mrp">MRP ₹${mrp.toFixed(2)}</span>` : ''}
            ${hasDiscount ? `<span class="store-savings-pill">Save ₹${savings}</span>` : ''}
          </div>

          <div class="store-card-stock">
            <span class="stock-dot ${isOut ? 'stock-dot-out' : 'stock-dot-in'}"></span>
            <span style="color: ${isOut ? '#ef4444' : '#16a34a'}">${isOut ? 'Out of Stock' : 'In Stock'}</span>
          </div>

          <div class="store-card-actions">
            <a href="${singleWaUrl}" target="_blank" class="btn-buy-whatsapp" ${isOut ? 'style="opacity:0.6;pointer-events:none;"' : ''}>
              <i class="fa-brands fa-whatsapp"></i> Buy on WhatsApp
            </a>
            <button class="btn-add-cart" onclick="addToCart(${p.id})" title="Add to Cart" ${isOut ? 'disabled style="opacity:0.4;"' : ''}>
              <i class="fa-solid fa-cart-plus"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Category & Offer Filters
function filterStoreCategory(cat, btn) {
  activeStoreCategory = cat;
  isOffersOnly = false;
  updatePillUI(btn);
  renderStoreProducts();
}

function filterStoreOffers(btn) {
  isOffersOnly = true;
  activeStoreCategory = 'all';
  updatePillUI(btn);
  renderStoreProducts();
}

function updatePillUI(activeBtn) {
  const pills = document.querySelectorAll('.cat-pill');
  pills.forEach(p => p.classList.remove('active'));
  if (activeBtn) activeBtn.classList.add('active');
}

function searchStoreProducts(val) {
  storeSearchQuery = val;
  const clearBtn = document.getElementById('clearSearchBtn');
  if (clearBtn) clearBtn.style.display = val ? 'block' : 'none';
  renderStoreProducts();
}

function clearStoreSearch() {
  const input = document.getElementById('storeSearchInput');
  if (input) input.value = '';
  storeSearchQuery = '';
  document.getElementById('clearSearchBtn').style.display = 'none';
  renderStoreProducts();
}

function resetStoreFilters() {
  activeStoreCategory = 'all';
  isOffersOnly = false;
  clearStoreSearch();
  const firstPill = document.querySelector('.cat-pill');
  updatePillUI(firstPill);
  renderStoreProducts();
}

/* ==========================================================================
   SHOPPING CART MANAGEMENT & WHATSAPP CHECKOUT
   ========================================================================== */

function initCart() {
  const saved = localStorage.getItem('velava_medical_cart');
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch (e) {
      cart = [];
    }
  }
  updateCartUI();
}

function saveCart() {
  localStorage.setItem('velava_medical_cart', JSON.stringify(cart));
  updateCartUI();
}

function addToCart(productId) {
  const product = storeProducts.find(p => p.id == productId);
  if (!product) return;

  const existing = cart.find(item => item.id == productId);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      offer_price: parseFloat(product.offer_price || 0),
      mrp_price: parseFloat(product.mrp_price || 0),
      image_url: product.image_url,
      qty: 1
    });
  }

  saveCart();
  showCartToast(`Added "${product.name}" to Cart!`);

  // Animate floating cart button
  const trigger = document.getElementById('floatingCartBtn');
  if (trigger) {
    trigger.style.transform = 'scale(1.2)';
    setTimeout(() => { trigger.style.transform = ''; }, 300);
  }
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id != productId);
  saveCart();
}

function changeCartQty(productId, delta) {
  const item = cart.find(i => i.id == productId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(productId);
  } else {
    saveCart();
  }
}

function toggleCartDrawer() {
  const drawer = document.getElementById('cartDrawer');
  const overlay = document.getElementById('cartOverlay');
  if (!drawer || !overlay) return;

  const isOpen = drawer.classList.toggle('open');
  overlay.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  // Update counts in badges
  const navCount = document.getElementById('cartNavCount');
  const floatCount = document.getElementById('floatingCartCount');
  const drawerBadge = document.getElementById('cartDrawerBadge');

  if (navCount) navCount.innerText = totalItems;
  if (floatCount) floatCount.innerText = totalItems;
  if (drawerBadge) drawerBadge.innerText = `${totalItems} ${totalItems === 1 ? 'Item' : 'Items'}`;

  const listContainer = document.getElementById('cartItemsList');
  const footer = document.getElementById('cartFooter');
  if (!listContainer) return;

  if (cart.length === 0) {
    listContainer.innerHTML = `
      <div class="cart-empty-state">
        <i class="fa-solid fa-cart-plus"></i>
        <h4 style="color: var(--primary); margin-bottom: 4px;">Your cart is empty</h4>
        <p style="font-size: 0.85rem;">Browse our medical store products and offers.</p>
        <button class="btn btn-primary btn-sm" style="margin-top: 14px;" onclick="toggleCartDrawer()">Start Shopping</button>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  let subtotal = 0;
  let totalSavings = 0;
  let finalTotal = 0;

  listContainer.innerHTML = cart.map(item => {
    const itemTotal = item.offer_price * item.qty;
    const itemMrpTotal = (item.mrp_price > 0 ? item.mrp_price : item.offer_price) * item.qty;
    subtotal += itemMrpTotal;
    finalTotal += itemTotal;
    totalSavings += (itemMrpTotal - itemTotal);

    const fallback = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200';
    const img = item.image_url || fallback;

    return `
      <div class="cart-item-row">
        <img src="${escapeStoreHtml(img)}" class="cart-item-img" alt="${escapeStoreHtml(item.name)}" onerror="this.src='${fallback}'">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${escapeStoreHtml(item.name)}</h4>
          <div class="cart-item-price-wrap">
            <span class="cart-item-price">₹${(item.offer_price).toFixed(2)}</span>
            <span style="font-size: 0.75rem; color: var(--text-muted);">x ${item.qty} = <strong>₹${itemTotal.toFixed(2)}</strong></span>
          </div>
          <div class="cart-item-qty-ctrl">
            <button class="qty-btn" onclick="changeCartQty(${item.id}, -1)">-</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeCartQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-item-del-btn" onclick="removeFromCart(${item.id})" title="Remove item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `;
  }).join('');

  document.getElementById('cartSubtotal').innerText = `₹${subtotal.toFixed(2)}`;
  document.getElementById('cartDiscount').innerText = `-₹${totalSavings.toFixed(2)}`;
  document.getElementById('cartTotal').innerText = `₹${finalTotal.toFixed(2)}`;
}

// WhatsApp Checkout Generator
function checkoutViaWhatsApp() {
  if (cart.length === 0) {
    alert('Your cart is empty! Please add products before checking out.');
    return;
  }

  const name = document.getElementById('custName')?.value.trim() || 'Customer';
  const phone = document.getElementById('custPhone')?.value.trim() || '';
  const address = document.getElementById('custAddress')?.value.trim() || 'Salem / Tamil Nadu';

  let itemsList = '';
  let finalAmount = 0;
  let totalSavings = 0;

  cart.forEach((item, idx) => {
    const itemTotal = item.offer_price * item.qty;
    const itemMrpTotal = (item.mrp_price > 0 ? item.mrp_price : item.offer_price) * item.qty;
    finalAmount += itemTotal;
    totalSavings += (itemMrpTotal - itemTotal);

    itemsList += `${idx + 1}. *${item.name}*\n   Qty: ${item.qty} | Price: ₹${itemTotal.toFixed(2)}\n`;
  });

  const msg = `*NEW MEDICAL ORDER - VELAVA MEDICALS STORE*
----------------------------------------
*Customer Name:* ${name}
*Phone:* ${phone || 'Not provided'}
*Delivery Address:* ${address}

*Ordered Items:*
${itemsList}----------------------------------------
*Total Discount Saved:* ₹${totalSavings.toFixed(2)}
*Total Amount Payable:* ₹${finalAmount.toFixed(2)}
----------------------------------------
_Please confirm product availability, payment, and dispatch timeframe._`;

  const encoded = encodeURIComponent(msg);
  const waUrl = `https://wa.me/${PHARMACY_WHATSAPP}?text=${encoded}`;

  window.open(waUrl, '_blank');
}

function showCartToast(text) {
  let toast = document.getElementById('storeToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'storeToast';
    toast.style.cssText = `
      position: fixed;
      top: 90px;
      right: 25px;
      background: #0B2B5C;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.2);
      font-size: 0.88rem;
      font-weight: 600;
      z-index: 10005;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.3s ease;
      opacity: 0;
      transform: translateY(-20px);
    `;
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #2E9E6B; font-size: 1.1rem;"></i> <span></span>`;
    document.body.appendChild(toast);
  }

  toast.querySelector('span').innerText = text;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-20px)';
  }, 2600);
}

function escapeStoreHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
