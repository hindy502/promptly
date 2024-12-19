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

// Show menu on tap
const bottomMenu = document.getElementById('bottomMenu');
teleprompterContainer.addEventListener('click', () => {
    bottomMenu.classList.add('visible');
    setTimeout(() => {
        bottomMenu.classList.remove('visible');
    }, 7500); // Auto-hide after 7.5 seconds
});
