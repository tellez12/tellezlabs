// ==================== Toast Notification ====================
function showNotification(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMessage');
  toastMsg.textContent = message;
  toast.className = `fixed top-5 right-5 z-50 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 pointer-events-none ${type === 'error' ? 'bg-red-600' : 'bg-green-600'}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-8px)';
  }, 2200);
}

// ==================== Tool Switcher ====================
function showTool(toolName) {
  document.querySelectorAll('.tool-content').forEach(t => t.style.display = 'none');
  document.querySelectorAll('.sidebar-item').forEach(btn => btn.classList.remove('active'));
  document.getElementById(toolName).style.display = 'block';
  const sidebarBtn = document.querySelector(`.sidebar-item[data-tool="${toolName}"]`);
  if (sidebarBtn) sidebarBtn.classList.add('active');
  if (toolName === 'timestamp') updateCurrentTime();
}

// ==================== Clipboard Utilities ====================
function copyText(elementId) {
  const val = document.getElementById(elementId).value;
  if (!val) return;
  navigator.clipboard.writeText(val).then(() => showNotification('Copied!'));
}

function copyToClipboard(elementId) {
  const el = document.getElementById(elementId);
  el.select();
  navigator.clipboard.writeText(el.value).then(() => showNotification('Copied to clipboard!'));
}

// ==================== Shared Helpers ====================
function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ==================== Init ====================
document.addEventListener('DOMContentLoaded', () => {
  updateCurrentTime();
  setInterval(updateCurrentTime, 1000);
  loadPomodoroTasks();
  updateCurrentTaskDisplay();
});
