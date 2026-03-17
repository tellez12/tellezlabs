// ==================== JSON Formatter ====================
function formatJSON() {
  const input = document.getElementById('jsonInput').value.trim();
  const errEl = document.getElementById('jsonError');
  errEl.style.display = 'none';
  try {
    const parsed = JSON.parse(input);
    document.getElementById('jsonOutput').value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    errEl.textContent = '⚠ Invalid JSON: ' + e.message;
    errEl.style.display = 'block';
  }
}

function minifyJSON() {
  const input = document.getElementById('jsonInput').value.trim();
  const errEl = document.getElementById('jsonError');
  errEl.style.display = 'none';
  try {
    const parsed = JSON.parse(input);
    document.getElementById('jsonOutput').value = JSON.stringify(parsed);
  } catch (e) {
    errEl.textContent = '⚠ Invalid JSON: ' + e.message;
    errEl.style.display = 'block';
  }
}

// ==================== Base64 ====================
function encodeBase64() {
  try {
    document.getElementById('base64Output').value = btoa(document.getElementById('base64Input').value);
  } catch (e) {
    showNotification('Error encoding: ' + e.message, 'error');
  }
}

function decodeBase64() {
  try {
    document.getElementById('base64Output').value = atob(document.getElementById('base64Input').value);
  } catch (e) {
    showNotification('Error decoding: ' + e.message, 'error');
  }
}

// ==================== URL Encoder/Decoder ====================
function encodeURL() {
  document.getElementById('urlOutput').value = encodeURIComponent(document.getElementById('urlInput').value);
}

function decodeURL() {
  try {
    document.getElementById('urlOutput').value = decodeURIComponent(document.getElementById('urlInput').value);
  } catch (e) {
    showNotification('Error decoding: ' + e.message, 'error');
  }
}

// ==================== YAML ↔ JSON ====================
function yamlToJson() {
  const input = document.getElementById('yamlInput').value.trim();
  const errEl = document.getElementById('yamlError');
  errEl.style.display = 'none';
  if (!input) return;
  try {
    const parsed = jsyaml.load(input);
    document.getElementById('yamlOutput').value = JSON.stringify(parsed, null, 2);
  } catch (e) {
    errEl.textContent = '⚠ ' + e.message;
    errEl.style.display = 'block';
  }
}

function jsonToYaml() {
  const input = document.getElementById('yamlInput').value.trim();
  const errEl = document.getElementById('yamlError');
  errEl.style.display = 'none';
  if (!input) return;
  try {
    const parsed = JSON.parse(input);
    document.getElementById('yamlOutput').value = jsyaml.dump(parsed, { indent: 2 });
  } catch (e) {
    errEl.textContent = '⚠ Invalid JSON: ' + e.message;
    errEl.style.display = 'block';
  }
}

// ==================== JWT Decoder ====================
function decodeJWT() {
  const token = document.getElementById('jwtInput').value.trim();
  if (!token) { showNotification('Please paste a JWT token', 'error'); return; }
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format — expected 3 parts separated by dots');
    const pad = s => s + '=='.slice(0, (4 - s.length % 4) % 4);
    const header = JSON.parse(atob(pad(parts[0].replace(/-/g, '+').replace(/_/g, '/'))));
    const payload = JSON.parse(atob(pad(parts[1].replace(/-/g, '+').replace(/_/g, '/'))));
    document.getElementById('jwtHeader').textContent = JSON.stringify(header, null, 2);
    document.getElementById('jwtPayload').textContent = JSON.stringify(payload, null, 2);
    document.getElementById('jwtOutput').style.display = 'block';
  } catch (e) {
    showNotification('Error decoding JWT: ' + e.message, 'error');
  }
}
