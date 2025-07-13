let timer;
let seconds = 0;
let isRunning = false;
let progressBar;

document.addEventListener("DOMContentLoaded", () => {
    progressBar = document.querySelector("#progress-bar span");
});

function startTimer() {
    isRunning = true;
    document.getElementById("startBtn").disabled = true;
    document.getElementById("endBtn").disabled = false;

    timer = setInterval(() => {
        seconds++;
        let mins = Math.floor(seconds / 60);
        let secs = seconds % 60;

        document.getElementById("timer").innerText = `${pad(mins)}:${pad(secs)}`;

        let percentage = (seconds / 3600) * 100;
        progressBar.style.width = `${percentage}%`;

    }, 1000);
}

function endTimer() {
    isRunning = false;
    clearInterval(timer);

    saveDuration(seconds);

    document.getElementById("startBtn").disabled = false;
    document.getElementById("endBtn").disabled = true;
}

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
