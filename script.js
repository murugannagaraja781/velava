/* ==========================================================================
   INTERACTIVE APP LOGIC - VELAVA MEDICAL CODING TRAINING CENTRE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initThemeToggle();
  initEligibilityQuiz();
  initCodingGame();
  initScrollReveal();
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
