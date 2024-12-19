const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');
const speedControl = document.getElementById('speedControl');
const scriptInput = document.getElementById('scriptInput');
const teleprompterContainer = document.getElementById('teleprompterContainer');
const teleprompterText = document.getElementById('teleprompterText');
const toggleOrientationBtn = document.getElementById('toggleOrientationBtn');

let scrollingInterval;
let currentPosition = 100; // start off-screen at bottom

playBtn.addEventListener('click', () => {
    const scriptText = scriptInput.value.trim();
    if (scriptText === '') return;

    // Hide the setup panel, show the teleprompter
    document.querySelector('.setup-panel').classList.add('hidden');
    teleprompterContainer.classList.remove('hidden');

    teleprompterText.innerText = scriptText;
    
    currentPosition = 100;
    teleprompterText.style.transform = `translateY(${currentPosition}%)`;

    startScrolling();
});

stopBtn.addEventListener('click', () => {
    stopScrolling();
    teleprompterContainer.classList.add('hidden');
    document.querySelector('.setup-panel').classList.remove('hidden');
});

toggleOrientationBtn.addEventListener('click', () => {
    teleprompterContainer.classList.toggle('landscape');
});

function startScrolling() {
    stopScrolling(); // clear any existing interval
    const speed = parseInt(speedControl.value, 10); 
    // Speed affects how fast the text moves up
    const scrollStep = 0.1 * speed; 
    
    scrollingInterval = setInterval(() => {
        currentPosition -= scrollStep;
        teleprompterText.style.transform = `translateY(${currentPosition}%)`;
        
        // If text has fully scrolled past the top
        if (currentPosition < -((teleprompterText.scrollHeight / window.innerHeight) * 100)) {
            stopScrolling();
        }
    }, 30);
}

function stopScrolling() {
    if (scrollingInterval) {
        clearInterval(scrollingInterval);
        scrollingInterval = null;
    }
}
