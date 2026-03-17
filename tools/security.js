// ==================== Hash Generator ====================
async function computeHash(algorithm, text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

let hashDebounce = null;
function hashOnChange() {
  clearTimeout(hashDebounce);
  hashDebounce = setTimeout(runHashes, 200);
}

async function runHashes() {
  const text = document.getElementById('hashInput').value;
  if (!text) {
    ['hashSHA256', 'hashSHA1', 'hashSHA512'].forEach(id => document.getElementById(id).value = '');
    return;
  }
  const [sha256, sha1, sha512] = await Promise.all([
    computeHash('SHA-256', text),
    computeHash('SHA-1', text),
    computeHash('SHA-512', text),
  ]);
  document.getElementById('hashSHA256').value = sha256;
  document.getElementById('hashSHA1').value = sha1;
  document.getElementById('hashSHA512').value = sha512;
}

// ==================== Password Generator ====================
function generatePasswords() {
  const length      = Math.min(128, Math.max(4, parseInt(document.getElementById('pwLen').value) || 16));
  const count       = Math.min(20,  Math.max(1, parseInt(document.getElementById('pwCount').value) || 5));
  const useUpper    = document.getElementById('pwUpper').checked;
  const useLower    = document.getElementById('pwLower').checked;
  const useDigits   = document.getElementById('pwNumbers').checked;
  const useSymbols  = document.getElementById('pwSymbols').checked;
  const noAmbiguous = document.getElementById('pwNoAmbiguous').checked;

  let charset = '';
  if (useUpper)   charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (useLower)   charset += 'abcdefghijklmnopqrstuvwxyz';
  if (useDigits)  charset += '0123456789';
  if (useSymbols) charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';

  if (noAmbiguous) charset = charset.replace(/[0OlI1]/g, '');

  if (!charset) { showNotification('Select at least one character type', 'error'); return; }

  const passwords = Array.from({ length: count }, () => {
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    return Array.from(arr, v => charset[v % charset.length]).join('');
  });

  document.getElementById('pwOutput').value = passwords.join('\n');
}
