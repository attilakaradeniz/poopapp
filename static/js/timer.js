let timer;
let seconds = 0;
let isRunning = false;
let startTimestamp;

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
        startTimestamp = new Date(); // 🟡 start the time

        timer = setInterval(() => {
            seconds++;
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;

            timerDisplay.innerText = `${pad(mins)}:${pad(secs)}`;
            const percentage = (seconds / 3600) * 100;
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
        }, 1000);
    });

    endBtn.addEventListener("click", () => {
        if (!isRunning) return;
        isRunning = false;
        clearInterval(timer);
        startBtn.disabled = false;
        endBtn.disabled = true;

        const endTimestamp = new Date();
        const startTimeStr = formatTime(startTimestamp);
        const endTimeStr = formatTime(endTimestamp);

        saveDuration(seconds, startTimeStr, endTimeStr);
    });

    function pad(value) {
        return value < 10 ? `0${value}` : value;
    }

    function formatTime(dateObj) {
        const hours = pad(dateObj.getHours());
        const minutes = pad(dateObj.getMinutes());
        const seconds = pad(dateObj.getSeconds());
        return `${hours}:${minutes}:${seconds}`;
    }

    function saveDuration(duration, start_time, end_time) {
        fetch('/save-timer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                duration: duration,
                start_time: start_time,
                end_time: end_time
            })
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
