// ==================== Tool Switcher ====================
function showTool(toolName) {
  // Hide all tools
  const allTools = document.querySelectorAll(".tool-content");
  allTools.forEach((tool) => (tool.style.display = "none"));

  // Remove active state from buttons
  const allButtons = document.querySelectorAll(".tool-btn");
  allButtons.forEach((btn) => {
    btn.classList.remove("bg-blue-600", "hover:bg-blue-700");
    btn.classList.add("bg-slate-700", "hover:bg-slate-600");
  });

  // Show selected tool
  document.getElementById(toolName).style.display = "block";

  // Highlight selected button
  const selectedBtn = document.querySelector(`[data-tool="${toolName}"]`);
  selectedBtn.classList.remove("bg-slate-700", "hover:bg-slate-600");
  selectedBtn.classList.add("bg-blue-600", "hover:bg-blue-700");
}

// ==================== Pomodoro Timer ====================
let pomodoroTimer = null;
let pomodoroTimeLeft = 25 * 60;
let pomodoroIsRunning = false;
let pomodoroIsWorkSession = true;
let pomodoroWorkDuration = 25;
let pomodoroBorsDuration = 5;

function updatePomodoroDisplay() {
  const minutes = Math.floor(pomodoroTimeLeft / 60);
  const seconds = pomodoroTimeLeft % 60;
  document.getElementById("pomodoroDisplay").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function pomodoroStart() {
  if (pomodoroIsRunning) return;
  pomodoroIsRunning = true;
  document.getElementById("pomodoroStartBtn").style.display = "none";
  document.getElementById("pomodoroPauseBtn").style.display = "inline-block";

  pomodoroTimer = setInterval(() => {
    pomodoroTimeLeft--;
    updatePomodoroDisplay();

    if (pomodoroTimeLeft <= 0) {
      clearInterval(pomodoroTimer);
      pomodoroIsRunning = false;

      // Switch between work and break
      if (pomodoroIsWorkSession) {
        pomodoroTimeLeft = pomodoroBorsDuration * 60;
        pomodoroIsWorkSession = false;
        document.getElementById("pomodoroStatus").textContent = "☕ Break Time";
        showNotification("Work session complete! Time for a break.");
      } else {
        pomodoroTimeLeft = pomodoroWorkDuration * 60;
        pomodoroIsWorkSession = true;
        document.getElementById("pomodoroStatus").textContent =
          "💪 Work Session";
        showNotification("Break complete! Ready for another session?");
      }

      updatePomodoroDisplay();
      document.getElementById("pomodoroStartBtn").style.display =
        "inline-block";
      document.getElementById("pomodoroPauseBtn").style.display = "none";
    }
  }, 1000);
}

function pomodoroPause() {
  clearInterval(pomodoroTimer);
  pomodoroIsRunning = false;
  document.getElementById("pomodoroStartBtn").style.display = "inline-block";
  document.getElementById("pomodoroPauseBtn").style.display = "none";
}

function pomodoroReset() {
  clearInterval(pomodoroTimer);
  pomodoroIsRunning = false;
  pomodoroIsWorkSession = true;
  pomodoroTimeLeft = pomodoroWorkDuration * 60;
  document.getElementById("pomodoroStatus").textContent = "💪 Work Session";
  updatePomodoroDisplay();
  document.getElementById("pomodoroStartBtn").style.display = "inline-block";
  document.getElementById("pomodoroPauseBtn").style.display = "none";
}

function pomodoroApplySettings() {
  const workDuration = parseInt(document.getElementById("pomodoroWork").value);
  const breakDuration = parseInt(
    document.getElementById("pomodoroBreak").value,
  );

  if (workDuration > 0 && breakDuration > 0) {
    pomodoroWorkDuration = workDuration;
    pomodoroBorsDuration = breakDuration;
    pomodoroReset();
    showNotification("Settings applied!");
  }
}

// ==================== JWT Decoder ====================
function decodeJWT() {
  const token = document.getElementById("jwtInput").value.trim();

  if (!token) {
    alert("Please paste a JWT token");
    return;
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    document.getElementById("jwtHeader").textContent = JSON.stringify(
      header,
      null,
      2,
    );
    document.getElementById("jwtPayload").textContent = JSON.stringify(
      payload,
      null,
      2,
    );
    document.getElementById("jwtOutput").style.display = "block";
  } catch (error) {
    alert("Error decoding JWT: " + error.message);
  }
}

// ==================== URL Encoder/Decoder ====================
function encodeURL() {
  const input = document.getElementById("urlInput").value;
  const output = encodeURIComponent(input);
  document.getElementById("urlOutput").value = output;
}

function decodeURL() {
  const input = document.getElementById("urlInput").value;
  try {
    const output = decodeURIComponent(input);
    document.getElementById("urlOutput").value = output;
  } catch (error) {
    alert("Error decoding: " + error.message);
  }
}

// ==================== Base64 Encoder/Decoder ====================
function encodeBase64() {
  const input = document.getElementById("base64Input").value;
  try {
    const output = btoa(input);
    document.getElementById("base64Output").value = output;
  } catch (error) {
    alert("Error encoding: " + error.message);
  }
}

function decodeBase64() {
  const input = document.getElementById("base64Input").value;
  try {
    const output = atob(input);
    document.getElementById("base64Output").value = output;
  } catch (error) {
    alert("Error decoding: " + error.message);
  }
}

// ==================== Utility Functions ====================
function copyToClipboard(elementId) {
  const element = document.getElementById(elementId);
  element.select();
  document.execCommand("copy");
  showNotification("Copied to clipboard!");
}

function showNotification(message) {
  // Simple notification using browser alert
  // In production, you'd want a toast notification library
  alert(message);
}
