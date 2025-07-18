let isRunning = false;
let sessionId = null;
let timer = null;
let startTimestamp = null;

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleBtn");
    const timerDisplay = document.getElementById("timer");
    const progressBar = document.querySelector("#progress-bar span");

    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", () => {
        if (!isRunning) {
            // START: Request server to start a new session
            fetch("/start-session", { method: "POST" })
                .then(res => res.json())
                .then(data => {
                    sessionId = data.session_id;
                    isRunning = true;
                    toggleBtn.textContent = "Stop";
                    toggleBtn.style.backgroundColor = "#e74c3c";
                    toggleBtn.style.color = "#fff";

                    // Record the exact time the session started
                    startTimestamp = Date.now();

                    // Clear any previous interval (safety)
                    if (timer) clearInterval(timer);

                    // Start a new timer interval based on real elapsed time
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
            // STOP: Send request to end the session and reset UI
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
                    timer = null;
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

    // Utility function to zero-pad time values
    function pad(val) {
        return val < 10 ? `0${val}` : val;
    }

    // Intercept form submissions for delete and ask for confirmation
    const deleteForms = document.querySelectorAll(".delete-form");
    console.log("Found", deleteForms.length, "delete forms");

    deleteForms.forEach(form => {
        form.addEventListener("submit", function (e) {
            const confirmDelete = confirm("Are you sure you want to delete this record?");
            if (!confirmDelete) {
                e.preventDefault(); // Cancel the form submission
            }
        });
    });

});
