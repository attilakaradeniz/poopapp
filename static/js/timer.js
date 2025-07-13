let timer;
let seconds = 0;
let isRunning = false;

document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("startBtn");
    const endBtn = document.getElementById("endBtn");
    const timerDisplay = document.getElementById("timer");
    const progressBar = document.querySelector("#progress-bar span");

    if (!startBtn || !endBtn) return;

    startBtn.addEventListener("click", () => {
        if (isRunning) return;
        isRunning = true;
        startBtn.disabled = true;
        endBtn.disabled = false;

        seconds = 0;
        timer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;

            timerDisplay.innerText = `${pad(mins)}:${pad(secs)}`;
            const percentage = (seconds / 3600) * 100;
            progressBar.style.width = `${percentage}%`;
        }, 1000);
    });

    endBtn.addEventListener("click", () => {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timer);
        startBtn.disabled = false;
        endBtn.disabled = true;

        saveDuration(seconds);
    });

    function pad(value) {
        return value < 10 ? `0${value}` : value;
    }

    function saveDuration(duration) {
        fetch('/save-timer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ duration: duration })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Duration saved:", data);
        })
        .catch(error => {
            console.error("Error saving duration:", error);
        });
    }
});
