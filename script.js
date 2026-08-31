console.log("NEW LUXURY STORY SCRIPT LOADED");

const formData = {
    availableTime: "",
    moodValue: 5,
    likeValue: 5,
    socialValue: 5,
    hungerValue: 5,
    stressValue: 0,
    romanceValue: 5,
    musicValue: 5, // NEUER MUSIC WERT
    dinnerPreference: "",
    selectedRelationship: "",
    userNote: "",
    confirmed: false
};

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xnpaqqzv";

function nextSection(nextId) {
    const current = document.querySelector('.section.active');
    if (current) current.classList.remove('active');
    
    const next = document.getElementById(nextId);
    if (next) next.classList.add('active');
}

// Zeit setzen über Buttons
function setTimeAndContinue(time) {
    document.getElementById('available-time').value = time;
    formData.availableTime = time;
    nextSection('mood-section');
}

// Zeit setzen über Freitextfeld
function handleTimeSubmit(e) {
    e.preventDefault();
    const val = document.getElementById('available-time').value;
    if (val.trim() !== "") {
        formData.availableTime = val;
        nextSection('mood-section');
    }
}

function updateMoodMessage() {
    const val = parseInt(document.getElementById('mood-slider').value);
    formData.moodValue = val;
    const msg = document.getElementById('mood-message');
    if (val <= 3) msg.textContent = "Let's see if I can improve your mood.";
    else if (val <= 6) msg.textContent = "At least you're not a zombie.";
    else if (val <= 8) msg.textContent = "Promising.";
    else if (val === 9) msg.textContent = "Good little dragon.";
    else msg.textContent = "Perfect for the weekend.";
}

function updateLikeMessage() {
    const val = parseInt(document.getElementById('like-slider').value);
    formData.likeValue = val;
    const msg = document.getElementById('like-message');
    if (val <= 3) msg.textContent = "Ouch. Let's see if I can improve that.";
    else if (val <= 6) msg.textContent = "I'll take my chances.";
    else if (val <= 8) msg.textContent = "Promising.";
    else if (val === 9) msg.textContent = "I was hoping for more.";
    else msg.textContent = "Я тебе кохаю.";
}

function updateSocialMessage() {
    const val = parseInt(document.getElementById('social-slider').value);
    formData.socialValue = val;
    const msg = document.getElementById('social-message');
    if (val <= 2) msg.textContent = "Just the two of us.";
    else if (val <= 4) msg.textContent = "Somewhere quiet.";
    else if (val <= 6) msg.textContent = "A relaxed atmosphere.";
    else if (val <= 8) msg.textContent = "A lively place sounds nice.";
    else msg.textContent = "Let's dive into the crowd.";
}

function updateHungerMessage() {
    const val = parseInt(document.getElementById('hunger-slider').value);
    formData.hungerValue = val;
    const msg = document.getElementById('hunger-message');
    if (val <= 2) msg.textContent = "Wine is enough.";
    else if (val <= 4) msg.textContent = "Maybe something small.";
    else if (val <= 6) msg.textContent = "A proper meal sounds good.";
    else if (val <= 8) msg.textContent = "I'll definitely be hungry.";
    else msg.textContent = "Emergency. Feed me.";
}

function updateStressMessage() {
    const val = parseInt(document.getElementById('stress-slider').value);
    formData.stressValue = val;
    const msg = document.getElementById('stress-message');
    if (val <= 2) msg.textContent = "Peaceful.";
    else if (val <= 4) msg.textContent = "A little busy.";
    else if (val <= 6) msg.textContent = "Feeling the pressure.";
    else if (val <= 8) msg.textContent = "Running on caffeine.";
    else msg.textContent = "Don't push your luck.";
}

function updateRomanceMessage() {
    const val = parseInt(document.getElementById('romance-slider').value);
    formData.romanceValue = val;
    const msg = document.getElementById('romance-message');
    if (val <= 2) msg.textContent = "Just cuddles.";
    else if (val <= 4) msg.textContent = "Maybe one round.";
    else if (val <= 6) msg.textContent = "Extremely ready.";
    else if (val <= 8) msg.textContent = "Take me now.";
    else msg.textContent = "Let's make babies.";
}

// NEUE MUSIK FUNKTION
function updateMusicMessage() {
    const val = parseInt(document.getElementById('music-slider').value);
    formData.musicValue = val;
    const msg = document.getElementById('music-message');
    if (val <= 3) msg.textContent = "Random playlist chosen by Tori";
    else if (val <= 7) msg.textContent = "Random playlist chosen by Phillip";
    else msg.textContent = "DJ Tori";
}

const revealTexts = [
    "I could simply ask.",
    "But I enjoy building things for you.",
    "And honestly...",
    "This is much more fun."
];

let textIndex = 0;

function startReveal() {
    textIndex = 0;
    nextSection('reveal-section');
    runTypewriterSequence();
}

function runTypewriterSequence() {
    const container = document.getElementById('typewriter-text');
    if (!container) return;

    if (textIndex < revealTexts.length) {
        container.textContent = "";
        let charIndex = 0;
        const currentString = revealTexts[textIndex];

        const typing = setInterval(() => {
            if (charIndex < currentString.length) {
                container.textContent += currentString.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typing);
                setTimeout(() => {
                    textIndex++;
                    runTypewriterSequence();
                }, 1400);
            }
        }, 45);
    } else {
        setTimeout(() => {
            nextSection('dinner-section');
        }, 1400);
    }
}

function handleDinnerSubmit(e) {
    e.preventDefault();
    const val = document.getElementById('dinner-input').value;
    if (val.trim() !== "") {
        formData.dinnerPreference = val;
        nextSection('note-section');
    }
}

function handleNoteSubmit(e) {
    e.preventDefault();
    formData.userNote = document.getElementById('user-note').value;
    nextSection('choices-section');
}

function confirmChoice(choiceText){
    formData.selectedRelationship = choiceText;
    sendDataSilently();
    nextSection('success-section');
    initCelebration();
}

function sendDataSilently(){
    fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            subject: "❤️ Friday Experience Completed!",
            availableTime: formData.availableTime,
            moodScore: `${formData.moodValue}/10`,
            likeScore: `${formData.likeValue}/10`,
            socialBattery: `${formData.socialValue}/10`,
            hungerLevel: `${formData.hungerValue}/10`,
            stressLevel: `${formData.stressValue}/10`,
            romanceLevel: `${formData.romanceValue}/10`,
            musicPreference: `${formData.musicValue}/10`, // NEUER MUSIK WERT SENDEN
            dinnerPreference: formData.dinnerPreference || "(None)",
            weekendThoughts: formData.userNote || "(None)",
            relationshipStatus: formData.selectedRelationship,
            status: "Accepted ❤️"
        })
    }).catch(error => console.log("Background sync error", error));
}

function initCelebration() {
    const canvas = document.getElementById("confetti");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 80; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            r: Math.random() * 4 + 1,
            dx: Math.random() * 2 - 1,
            dy: Math.random() * 3 + 2,
            color: 'rgba(197, 160, 89, ' + Math.random() + ')'
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
