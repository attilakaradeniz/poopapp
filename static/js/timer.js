let isRunning = false;
let sessionId = null;
let seconds = 0;
let timer;

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const timerDisplay = document.getElementById("timer");
    const progressBar = document.querySelector("#progress-bar span");

    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        if (!isRunning) {
            // START: Fetch server to start a new session
            fetch("/start-session", { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    sessionId = data.session_id;
                    isRunning = true;
                    toggleBtn.textContent = "Stop";
                    toggleBtn.style.backgroundColor = "#e74c3c";
                    toggleBtn.style.color = "#fff";

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
        } else {
            // STOP: Stop the session by sending data to the server
            fetch("/stop-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ session_id: sessionId })
            })
                .then(res => res.json())
                .then(data => {
                    console.log("Server returned:", data);
                    clearInterval(timer);
                    timerDisplay.innerText = "00:00";
                    progressBar.style.width = "0%";
                    toggleBtn.textContent = "Start";
                    toggleBtn.style.backgroundColor = "#2ecc71";
                    toggleBtn.style.color = "#000";
                    isRunning = false;
                    sessionId = null;
                });
        }
    });

    function pad(val) {
        return val < 10 ? `0${val}` : val;
    }
});
