// ====== APP STATE ======
const appState = {
    time: '',
    mood: 3,
    like: 3,
    socialBattery: 3,
    hunger: 3,
    stress: 3,
    romance: 3,
    dinner: '',
    weekendThoughts: '',
    relationshipStatus: ''
};

// Replace this with your actual Formspree endpoint string
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORMSPREE_ID'; 

// ====== NAVIGATION ======
function scrollToSection(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

// ====== SCROLL ANIMATIONS (Intersection Observer) ======
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            
            // Trigger typewriter when section 5 is reached
            if (entry.target.id === 'reveal' && !typewriterStarted) {
                startTypewriter();
                typewriterStarted = true;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-scroll').forEach(el => {
    observer.observe(el);
});
// Observe the reveal section explicitly for the typewriter
observer.observe(document.getElementById('reveal'));

// ====== SECTION 3: TIME SELECTION ======
const timeBtns = document.querySelectorAll('.time-btn');
const customTimeInput = document.getElementById('custom-time');

timeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        timeBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        appState.time = e.target.dataset.time;
        customTimeInput.value = ''; // Clear custom input if button clicked
    });
});

customTimeInput.addEventListener('input', (e) => {
    timeBtns.forEach(b => b.classList.remove('active'));
    appState.time = e.target.value;
});

// ====== SECTION 4: SLIDERS & DYNAMIC MESSAGES ======
const sliderData = {
    'mood': {
        1: "Let's see if I can improve your mood.",
        2: "At least you're not a zombie.",
        3: "Promising.",
        4: "Good little dragon.",
        5: "Perfect for the weekend."
    },
    'like': {
        1: "Ouch. Let's see if you can improve that.",
        2: "I'll take my chances.",
        3: "Promising.",
        4: "I was hoping for more.",
        5: "Я тебе кохаю."
    },
    'social': {
        1: "Just the two of us.",
        2: "Somewhere quiet.",
        3: "A relaxed atmosphere.",
        4: "A lively place sounds nice.",
        5: "Let's dive into the crowd."
    },
    'hunger': {
        1: "Wine is enough.",
        2: "Maybe something small.",
        3: "A proper meal sounds good.",
        4: "I'll definitely be hungry.",
        5: "Emergency. Feed me."
    },
    'stress': {
        1: "Peaceful.",
        2: "A little busy.",
        3: "Feeling the pressure.",
        4: "Running on caffeine.",
        5: "Don't push your luck."
    },
    'romance': {
        1: "Just cuddles.",
        2: "Maybe one round.",
        3: "Extremely ready.",
        4: "Take me now.",
        5: "Let's make babies."
    }
};

function setupSlider(id, stateKey) {
    const slider = document.getElementById(`${id}-slider`);
    const msg = document.getElementById(`${id}-msg`);
    
    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        appState[stateKey] = val;
        msg.textContent = sliderData[id][val];
        
        // Add a little pop animation to the text
        msg.style.transform = 'scale(1.05)';
        setTimeout(() => msg.style.transform = 'scale(1)', 150);
    });
}

setupSlider('mood', 'mood');
setupSlider('like', 'like');
setupSlider('social', 'socialBattery');
setupSlider('hunger', 'hunger');
setupSlider('stress', 'stress');
setupSlider('romance', 'romance');

// ====== SECTION 5: TYPEWRITER ======
const typewriterText = "I could simply ask.\nBut I enjoy building things for you.\nAnd honestly...\nThis is much more fun.";
let typeIndex = 0;
let typewriterStarted = false;
const typeTarget = document.getElementById('typewriter-text');
const revealBtn = document.getElementById('reveal-btn-container');

function startTypewriter() {
    if (typeIndex < typewriterText.length) {
        typeTarget.textContent += typewriterText.charAt(typeIndex);
        typeIndex++;
        setTimeout(startTypewriter, 50); // Speed of typing
    } else {
        // Typing finished
        typeTarget.style.borderRight = 'none';
        revealBtn.classList.remove('hidden');
        revealBtn.classList.add('fade-in-up');
    }
}

// ====== INPUT TRACKING ======
document.getElementById('dinner-input').addEventListener('input', (e) => appState.dinner = e.target.value);
document.getElementById('weekend-input').addEventListener('input', (e) => appState.weekendThoughts = e.target.value);

// ====== SECTION 8: THE QUESTION & SUBMIT ======
const optionCards = document.querySelectorAll('.option-card');

optionCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // UI Update
        optionCards.forEach(c => c.classList.remove('active'));
        e.target.classList.add('active');
        
        // Save state
        appState.relationshipStatus = e.target.dataset.answer;
        
        // Transition to Final Screen
        setTimeout(() => {
            document.getElementById('the-question').classList.add('hidden');
            const finalScreen = document.getElementById('final-screen');
            finalScreen.classList.remove('hidden');
            finalScreen.scrollIntoView();
            initCelebration();
            submitDataSilently();
        }, 500);
    });
});

// ====== FORMSPREE SUBMISSION ======
function submitDataSilently() {
    // If you haven't put your formspree ID yet, prevent fetch error spam
    if(FORMSPREE_ENDPOINT.includes('YOUR_FORMSPREE_ID')) return; 

    fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(appState)
    }).then(response => {
        console.log("Data submitted silently.");
    }).catch(error => {
        console.error("Submission failed.", error);
    });
}

// ====== FINAL CELEBRATION ANIMATION (Gold Sparkles) ======
function initCelebration() {
    const canvas = document.getElementById("confetti");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 4 + 1,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 3 + 2,
            color: 'rgba(197, 160, 89, ' + Math.random() + ')' // Gold variations
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            p.y += p.dy;
            p.x += p.dx;
            
            if (p.y > canvas.height) {
                p.y = -10;
                p.x = Math.random() * canvas.width;
            }
        });
        requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
