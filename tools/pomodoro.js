// ==================== Pomodoro Timer ====================
let pomodoroTimer = null;
let pomodoroTimeLeft = 25 * 60;
let pomodoroIsRunning = false;
let pomodoroIsWorkSession = true;
let pomodoroWorkDuration = 25;
let pomodoroBrkDuration = 5;
let pomodoroTasks = [];
let pomodoroCurrentTaskIndex = -1;

function loadPomodoroTasks() {
  try {
    pomodoroTasks = JSON.parse(localStorage.getItem('pomodoroTasks') || '[]');
  } catch { pomodoroTasks = []; }
  renderPomodoroTasks();
}

function savePomodoroTasks() {
  localStorage.setItem('pomodoroTasks', JSON.stringify(pomodoroTasks));
}

function renderPomodoroTasks() {
  const list = document.getElementById('pomodoroTaskList');
  if (!list) return;
  if (pomodoroTasks.length === 0) {
    list.innerHTML = '<p class="text-gray-500 text-xs text-center py-4">No tasks yet. Add one above!</p>';
    return;
  }
  list.innerHTML = pomodoroTasks.map((task, i) => `
    <div class="flex items-center gap-2 px-2 py-1.5 rounded ${i === pomodoroCurrentTaskIndex ? 'bg-blue-900/40 border border-blue-500/40' : 'bg-slate-600/40'} group">
      <input type="checkbox" ${task.done ? 'checked' : ''} onchange="togglePomodoroTask(${i})" class="accent-blue-400 cursor-pointer shrink-0">
      <span class="flex-1 text-sm truncate ${task.done ? 'line-through text-gray-500' : 'text-gray-200'}">${escHtml(task.name)}</span>
      ${task.pomodoros > 0 ? `<span class="text-orange-400 text-xs shrink-0">🍅×${task.pomodoros}</span>` : ''}
      <button onclick="selectPomodoroTask(${i})" title="Set as current" class="text-blue-400 hover:text-blue-300 text-xs shrink-0 ${i === pomodoroCurrentTaskIndex ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition">▶</button>
      <button onclick="deletePomodoroTask(${i})" class="text-red-400 hover:text-red-300 text-xs shrink-0 opacity-0 group-hover:opacity-100 transition">✕</button>
    </div>
  `).join('');
}

function addPomodoroTask() {
  const input = document.getElementById('pomTaskInput');
  const name = input.value.trim();
  if (!name) return;
  pomodoroTasks.push({ name, done: false, pomodoros: 0 });
  input.value = '';
  savePomodoroTasks();
  renderPomodoroTasks();
}

function togglePomodoroTask(index) {
  pomodoroTasks[index].done = !pomodoroTasks[index].done;
  savePomodoroTasks();
  renderPomodoroTasks();
}

function deletePomodoroTask(index) {
  pomodoroTasks.splice(index, 1);
  if (pomodoroCurrentTaskIndex === index) {
    pomodoroCurrentTaskIndex = -1;
    updateCurrentTaskDisplay();
  } else if (pomodoroCurrentTaskIndex > index) {
    pomodoroCurrentTaskIndex--;
  }
  savePomodoroTasks();
  renderPomodoroTasks();
}

function selectPomodoroTask(index) {
  pomodoroCurrentTaskIndex = (pomodoroCurrentTaskIndex === index) ? -1 : index;
  updateCurrentTaskDisplay();
  renderPomodoroTasks();
}

function updateCurrentTaskDisplay() {
  const el = document.getElementById('pomodoroCurrentTask');
  if (!el) return;
  if (pomodoroCurrentTaskIndex >= 0 && pomodoroTasks[pomodoroCurrentTaskIndex]) {
    el.textContent = '▶ ' + pomodoroTasks[pomodoroCurrentTaskIndex].name;
  } else {
    el.innerHTML = '&nbsp;';
  }
}

function showPomodoroTab(tab) {
  document.getElementById('pomodoroTasksPanel').style.display = tab === 'tasks' ? 'block' : 'none';
  document.getElementById('pomodoroSettingsPanel').style.display = tab === 'settings' ? 'block' : 'none';
  document.getElementById('pomTabTasks').classList.toggle('active', tab === 'tasks');
  document.getElementById('pomTabSettings').classList.toggle('active', tab === 'settings');
}

function updatePomodoroDisplay() {
  const minutes = Math.floor(pomodoroTimeLeft / 60);
  const seconds = pomodoroTimeLeft % 60;
  document.getElementById('pomodoroDisplay').textContent =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function pomodoroStart() {
  if (pomodoroIsRunning) return;
  pomodoroIsRunning = true;
  document.getElementById('pomodoroStartBtn').style.display = 'none';
  document.getElementById('pomodoroPauseBtn').style.display = 'inline-block';

  pomodoroTimer = setInterval(() => {
    pomodoroTimeLeft--;
    updatePomodoroDisplay();

    if (pomodoroTimeLeft <= 0) {
      clearInterval(pomodoroTimer);
      pomodoroIsRunning = false;
      if (pomodoroIsWorkSession) {
        if (pomodoroCurrentTaskIndex >= 0 && pomodoroTasks[pomodoroCurrentTaskIndex]) {
          pomodoroTasks[pomodoroCurrentTaskIndex].pomodoros++;
          savePomodoroTasks();
          renderPomodoroTasks();
        }
        pomodoroTimeLeft = pomodoroBrkDuration * 60;
        pomodoroIsWorkSession = false;
        document.getElementById('pomodoroStatus').textContent = '☕ Break Time';
        showNotification('Work session complete! Time for a break.');
      } else {
        pomodoroTimeLeft = pomodoroWorkDuration * 60;
        pomodoroIsWorkSession = true;
        document.getElementById('pomodoroStatus').textContent = '💪 Work Session';
        showNotification('Break complete! Ready for another session?');
      }
      updatePomodoroDisplay();
      document.getElementById('pomodoroStartBtn').style.display = 'inline-block';
      document.getElementById('pomodoroPauseBtn').style.display = 'none';
    }
  }, 1000);
}

function pomodoroPause() {
  clearInterval(pomodoroTimer);
  pomodoroIsRunning = false;
  document.getElementById('pomodoroStartBtn').style.display = 'inline-block';
  document.getElementById('pomodoroPauseBtn').style.display = 'none';
}

function pomodoroReset() {
  clearInterval(pomodoroTimer);
  pomodoroIsRunning = false;
  pomodoroIsWorkSession = true;
  pomodoroTimeLeft = pomodoroWorkDuration * 60;
  document.getElementById('pomodoroStatus').textContent = '💪 Work Session';
  updatePomodoroDisplay();
  document.getElementById('pomodoroStartBtn').style.display = 'inline-block';
  document.getElementById('pomodoroPauseBtn').style.display = 'none';
}

function pomodoroApplySettings() {
  const workDuration = parseInt(document.getElementById('pomodoroWork').value);
  const breakDuration = parseInt(document.getElementById('pomodoroBreak').value);
  if (workDuration > 0 && breakDuration > 0) {
    pomodoroWorkDuration = workDuration;
    pomodoroBrkDuration = breakDuration;
    pomodoroReset();
    showNotification('Settings applied!');
  }
}
