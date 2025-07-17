let isRunning = false;
let sessionId = null;
let timer;
let startTimestamp = null;

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

                    // Record the exact timestamp of start
                    startTimestamp = Date.now();

                    // Update the display every second based on real elapsed time
                    timer = setInterval(() => {
                        const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
                        const mins = Math.floor(elapsed / 60);
                        const secs = elapsed % 60;
                        timerDisplay.innerText = `${pad(mins)}:${pad(secs)}`;

                        const percentage = (elapsed / 3600) * 100;
                        if (progressBar) {
                            progressBar.style.width = `${percentage}%`;
                        }
                    }, 1000);
                });
        } else {
            // STOP: Send session ID to the server to stop the session
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
                    if (progressBar) {
                        progressBar.style.width = "0%";
                    }
                    toggleBtn.textContent = "Start";
                    toggleBtn.style.backgroundColor = "#2ecc71";
                    toggleBtn.style.color = "#000";
                    isRunning = false;
                    sessionId = null;
                    startTimestamp = null;
                });
        }
    });

    function pad(val) {
        return val < 10 ? `0${val}` : val;
    }
});
