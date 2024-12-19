const playBtn = document.getElementById('playBtn');
const toggleOrientationBtnSetup = document.getElementById('toggleOrientationBtnSetup');
const speedControlSetup = document.getElementById('speedControlSetup');
const scriptInput = document.getElementById('scriptInput');

const teleprompterContainer = document.getElementById('teleprompterContainer');
const teleprompterText = document.getElementById('teleprompterText');

const speedControl = document.getElementById('speedControl');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const endBtn = document.getElementById('endBtn');
const fontSizeControl = document.getElementById('fontSizeControl');
const colorChoices = document.querySelectorAll('.color-choice');

let scrollingInterval;
let currentPosition = 0; // Start at top
let isPaused = false;
let isUserScrolling = false; // Track if the user is manually scrolling
let scrollTimeout; // Timeout to resume automatic scrolling

// Play button: start teleprompter
playBtn.addEventListener('click', () => {
    const scriptText = scriptInput.value.trim();
    if (scriptText === '') {
        console.error("No text entered in the script input!");
        return;
    }

    console.log("Starting teleprompter with script:", scriptText);

    document.querySelector('.setup-panel').classList.add('hidden');
    teleprompterContainer.classList.remove('hidden');

    teleprompterText.innerText = scriptText;

    speedControl.value = speedControlSetup.value;

    currentPosition = 0;
    teleprompterText.style.transform = `translateY(${currentPosition}%)`;

    startScrolling();
});

// Toggle orientation
toggleOrientationBtnSetup.addEventListener('click', () => {
    teleprompterContainer.classList.toggle('landscape');
    console.log("Orientation toggled.");
});

// Pause scrolling
pauseBtn.addEventListener('click', () => {
    isPaused = true;
    console.log("Scrolling paused.");
});

// Resume scrolling
resumeBtn.addEventListener('click', () => {
    isPaused = false;
    console.log("Scrolling resumed.");
});

// End teleprompter and return to setup
endBtn.addEventListener('click', () => {
    stopScrolling();
    teleprompterContainer.classList.add('hidden');
    document.querySelector('.setup-panel').classList.remove('hidden');
    console.log("Teleprompter ended.");
});

// Adjust font size dynamically
fontSizeControl.addEventListener('input', () => {
    const newSize = fontSizeControl.value;
    teleprompterText.style.fontSize = `${newSize}px`;
    console.log("Font size updated to:", newSize);
});

// Change text color dynamically
colorChoices.forEach(circle => {
    circle.addEventListener('click', () => {
        const chosenColor = circle.getAttribute('data-color');
        teleprompterText.style.color = chosenColor;
        console.log("Text color changed to:", chosenColor);
    });
});

// Automatic scrolling logic
function startScrolling() {
    stopScrolling(); // Clear existing interval

    scrollingInterval = setInterval(() => {
        if (!isPaused && !isUserScrolling) {
            const speed = parseFloat(speedControl.value);
            const fontSize = parseFloat(window.getComputedStyle(teleprompterText).fontSize);
            const scalingFactor = 5; // Adjust for better scaling
            const scrollStep = (speed * scalingFactor) / fontSize; // Dynamic step size

            currentPosition -= scrollStep;
            teleprompterText.style.transform = `translateY(${currentPosition}%)`;

            if (currentPosition < -((teleprompterText.scrollHeight / window.innerHeight) * 100)) {
                console.log("Reached end of script.");
                stopScrolling();
            }
        }
    }, 50); // Interval delay
}

// Stop automatic scrolling
function stopScrolling() {
    if (scrollingInterval) {
        clearInterval(scrollingInterval);
        scrollingInterval = null;
        isPaused = false;
        console.log("Scrolling stopped.");
    }
}

// Handle user scroll (desktop and touch)
teleprompterText.addEventListener('wheel', event => handleScroll(event.deltaY));
teleprompterText.addEventListener('touchstart', handleTouchStart);
teleprompterText.addEventListener('touchmove', handleTouchMove);
teleprompterText.addEventListener('touchend', handleScrollEnd);

let touchStartY = 0; // Track starting touch position

function handleScroll(delta) {
    isUserScrolling = true;
    const fontSize = parseFloat(window.getComputedStyle(teleprompterText).fontSize);
    const scrollStep = delta / fontSize; // Dynamic scaling
    currentPosition += scrollStep;
    teleprompterText.style.transform = `translateY(${currentPosition}%)`;
    debounceResumeScrolling();
}

function handleTouchStart(event) {
    touchStartY = event.touches[0].clientY; // Record touch start position
}

function handleTouchMove(event) {
    const touchCurrentY = event.touches[0].clientY;
    const delta = touchStartY - touchCurrentY; // Calculate touch movement delta
    handleScroll(delta);
    touchStartY = touchCurrentY; // Update start position for continuous movement
}

function handleScrollEnd() {
    debounceResumeScrolling();
}

// Resume scrolling after a delay
function debounceResumeScrolling() {
    if (scrollTimeout) clearTimeout(scrollTimeout); // Reset timeout
    scrollTimeout = setTimeout(() => {
        isUserScrolling = false;
    }, 1000); // Resume after 1 second of no interaction
}
