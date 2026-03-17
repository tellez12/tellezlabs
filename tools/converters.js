// ==================== UUID Generator ====================
function generateUUIDs() {
  const count = Math.min(50, Math.max(1, parseInt(document.getElementById('uuidCount').value) || 5));
  const uuids = Array.from({ length: count }, () => crypto.randomUUID());
  document.getElementById('uuidOutput').value = uuids.join('\n');
}

// ==================== Timestamp Converter ====================
function updateCurrentTime() {
  const now = new Date();
  document.getElementById('nowUnixS').textContent = Math.floor(now.getTime() / 1000);
  document.getElementById('nowUnixMs').textContent = now.getTime();
  document.getElementById('nowUTC').textContent = now.toUTCString();
  document.getElementById('nowISO').textContent = now.toISOString();
}

function convertTimestamp() {
  const raw = document.getElementById('tsInput').value.trim();
  if (!raw) return;
  let ms = parseInt(raw);
  if (raw.length <= 10) ms *= 1000;
  const d = new Date(ms);
  if (isNaN(d.getTime())) { showNotification('Invalid timestamp', 'error'); return; }

  const diffSec = Math.floor((Date.now() - ms) / 1000);
  const rel = diffSec < 0
    ? `In ${formatRelative(-diffSec)}`
    : `${formatRelative(diffSec)} ago`;

  document.getElementById('tsUTC').textContent = d.toUTCString();
  document.getElementById('tsLocal').textContent = d.toString();
  document.getElementById('tsISO').textContent = d.toISOString();
  document.getElementById('tsRelative').textContent = rel;
  document.getElementById('tsOutput').style.display = 'block';
}

function formatRelative(sec) {
  if (sec < 60) return `${sec}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h`;
  if (sec < 2592000) return `${Math.floor(sec / 86400)}d`;
  if (sec < 31536000) return `${Math.floor(sec / 2592000)}mo`;
  return `${Math.floor(sec / 31536000)}y`;
}

function copyNowTimestamp() {
  const ts = Math.floor(Date.now() / 1000).toString();
  navigator.clipboard.writeText(ts).then(() => showNotification('Timestamp copied!'));
}

// ==================== Number Base Converter ====================
function convertBase() {
  const input = document.getElementById('numInput').value.trim();
  const fromBase = parseInt(document.getElementById('numInputBase').value);
  if (!input) {
    ['numDec', 'numHex', 'numBin', 'numOct'].forEach(id => document.getElementById(id).value = '');
    return;
  }
  const value = parseInt(input, fromBase);
  if (isNaN(value)) {
    showNotification('Invalid number for selected base', 'error');
    return;
  }
  document.getElementById('numDec').value = value.toString(10);
  document.getElementById('numHex').value = value.toString(16).toUpperCase();
  document.getElementById('numBin').value = value.toString(2);
  document.getElementById('numOct').value = value.toString(8);
}

// ==================== Color Converter ====================
// Called from color picker (passes value) or hex text input (reads field)
function updateColorFromHex(pickerValue) {
  const raw = pickerValue !== undefined ? pickerValue : document.getElementById('colorHex').value.trim();
  const full = raw.startsWith('#') ? raw : '#' + raw;
  if (!/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(full)) return;

  const r = parseInt(full.length === 4 ? full[1] + full[1] : full.slice(1, 3), 16);
  const g = parseInt(full.length === 4 ? full[2] + full[2] : full.slice(3, 5), 16);
  const b = parseInt(full.length === 4 ? full[3] + full[3] : full.slice(5, 7), 16);

  document.getElementById('colorSwatch').style.backgroundColor = full;
  document.getElementById('colorRGB').value = `rgb(${r}, ${g}, ${b})`;

  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break;
      case gn: h = ((bn - rn) / d + 2) / 6; break;
      case bn: h = ((rn - gn) / d + 4) / 6; break;
    }
  }
  document.getElementById('colorHSL').value =
    `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;

  const v = max;
  const sv = max === 0 ? 0 : (max - min) / max;
  document.getElementById('colorHSB').value =
    `hsb(${Math.round(h * 360)}, ${Math.round(sv * 100)}%, ${Math.round(v * 100)}%)`;

  const normalized = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
  document.getElementById('colorHex').value = normalized;
  // Keep native color picker in sync
  const picker = document.getElementById('colorPicker');
  if (picker) picker.value = normalized;
}
