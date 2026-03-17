// ==================== Case Converter ====================
function convertCase() {
  const input = document.getElementById('caseInput').value;
  const container = document.getElementById('caseOutputs');
  if (!input.trim()) { container.innerHTML = ''; return; }

  const words = input.trim().split(/[\s_\-]+/).filter(Boolean);

  const results = [
    { label: 'camelCase',        value: words.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('') },
    { label: 'PascalCase',       value: words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('') },
    { label: 'snake_case',       value: words.map(w => w.toLowerCase()).join('_') },
    { label: 'SCREAMING_SNAKE',  value: words.map(w => w.toUpperCase()).join('_') },
    { label: 'kebab-case',       value: words.map(w => w.toLowerCase()).join('-') },
    { label: 'Title Case',       value: words.map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(' ') },
  ];

  container.innerHTML = results.map(({ label, value }) => `
    <div class="flex items-center gap-3 bg-slate-700 rounded-lg px-3 py-2">
      <span class="text-gray-400 text-xs w-36 shrink-0">${label}</span>
      <input id="case_${label}" readonly value="${escHtml(value)}" class="flex-1 bg-transparent text-white text-sm font-mono outline-none">
      <button onclick="copyText('case_${label}')" class="text-xs px-2 py-1 rounded bg-slate-600 hover:bg-slate-500 transition text-gray-300 shrink-0">Copy</button>
    </div>
  `).join('');
}

// ==================== String Utilities ====================
function updateStringStats() {
  const text = document.getElementById('strInput').value;
  document.getElementById('strCharCount').textContent = text.length;
  document.getElementById('strWordCount').textContent = text.trim() ? text.trim().split(/\s+/).length : 0;
  document.getElementById('strLineCount').textContent = text ? text.split('\n').length : 0;
}

function strOp(op) {
  const input = document.getElementById('strInput').value;
  let result = input;
  switch (op) {
    case 'upper':       result = input.toUpperCase(); break;
    case 'lower':       result = input.toLowerCase(); break;
    case 'trim':        result = input.split('\n').map(l => l.trim()).join('\n'); break;
    case 'removeBlank': result = input.split('\n').filter(l => l.trim()).join('\n'); break;
    case 'reverse':     result = input.split('\n').reverse().join('\n'); break;
    case 'escape':      result = JSON.stringify(input).slice(1, -1); break;
    case 'unescape':
      try { result = JSON.parse('"' + input + '"'); }
      catch { showNotification('Invalid escape sequences', 'error'); return; }
      break;
    case 'deduplicate': result = [...new Set(input.split('\n'))].join('\n'); break;
    case 'sort':        result = input.split('\n').sort().join('\n'); break;
    case 'sortDesc':    result = input.split('\n').sort().reverse().join('\n'); break;
  }
  document.getElementById('strOutput').value = result;
}

// ==================== Markdown Preview ====================
function previewMarkdown() {
  const input = document.getElementById('markdownInput').value;
  const preview = document.getElementById('markdownPreview');
  preview.innerHTML = input.trim()
    ? marked.parse(input)
    : '<p class="text-gray-500 text-sm">Preview will appear here...</p>';
}
