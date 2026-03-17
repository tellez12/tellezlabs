// ==================== Regex Tester ====================
function testRegex() {
  const pattern = document.getElementById('regexPattern').value;
  const flags = document.getElementById('regexFlags').value;
  const input = document.getElementById('regexInput').value;
  const outputEl = document.getElementById('regexOutput');
  const errorEl = document.getElementById('regexError');
  const countEl = document.getElementById('regexMatchCount');

  errorEl.style.display = 'none';
  outputEl.textContent = '';
  countEl.textContent = '';

  if (!pattern) { outputEl.textContent = 'Enter a pattern above to start matching.'; return; }
  if (!input) { outputEl.textContent = 'Enter test text above.'; return; }

  try {
    const matches = [...input.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
    if (matches.length === 0) {
      countEl.textContent = '0 matches';
      outputEl.textContent = 'No matches found.';
      return;
    }
    countEl.textContent = `${matches.length} match${matches.length !== 1 ? 'es' : ''}`;
    outputEl.textContent = matches.map((m, i) =>
      `[${i + 1}] "${m[0]}"  (index ${m.index})${m.length > 1 ? '\n    Groups: ' + m.slice(1).map((g, gi) => `$${gi + 1}="${g ?? 'undefined'}"`).join(', ') : ''}`
    ).join('\n');
  } catch (e) {
    errorEl.textContent = '⚠ Invalid regex: ' + e.message;
    errorEl.style.display = 'block';
  }
}

// ==================== Text Diff ====================
function lcs(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const result = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      result.unshift({ type: 'same', line: a[i - 1] });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: 'added', line: b[j - 1] });
      j--;
    } else {
      result.unshift({ type: 'removed', line: a[i - 1] });
      i--;
    }
  }
  return result;
}

function runDiff() {
  const left = document.getElementById('diffA').value.split('\n');
  const right = document.getElementById('diffB').value.split('\n');
  const output = document.getElementById('diffOutput');
  const stats = document.getElementById('diffStats');

  const diff = lcs(left, right);
  let added = 0, removed = 0;

  output.innerHTML = diff.map(({ type, line }) => {
    const safe = escHtml(line);
    if (type === 'added')   { added++;   return `<div class="diff-added px-3 py-0.5 font-mono text-sm">+ ${safe}</div>`; }
    if (type === 'removed') { removed++; return `<div class="diff-removed px-3 py-0.5 font-mono text-sm">− ${safe}</div>`; }
    return `<div class="diff-same px-3 py-0.5 font-mono text-sm">  ${safe}</div>`;
  }).join('');

  stats.textContent = `+${added} added  −${removed} removed`;
  stats.className = 'text-xs mb-2 ' + (added + removed === 0 ? 'text-green-400' : 'text-gray-400');
}

// ==================== Cron Explainer ====================
const CRON_FIELDS = [
  { name: 'Minute',       min: 0,  max: 59 },
  { name: 'Hour',         min: 0,  max: 23 },
  { name: 'Day of Month', min: 1,  max: 31 },
  { name: 'Month',        min: 1,  max: 12 },
  { name: 'Day of Week',  min: 0,  max: 7  },
];
const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DOW_NAMES   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function explainCronField(expr, field) {
  const { name } = field;
  if (expr === '*') return `every ${name.toLowerCase()}`;
  if (/^\d+$/.test(expr)) {
    const v = parseInt(expr);
    if (name === 'Month')       return MONTH_NAMES[v] || expr;
    if (name === 'Day of Week') return DOW_NAMES[v]   || expr;
    return `at ${name.toLowerCase()} ${v}`;
  }
  if (expr.startsWith('*/')) {
    return `every ${expr.slice(2)} ${name.toLowerCase()}(s)`;
  }
  if (expr.includes('/')) {
    const [range, step] = expr.split('/');
    return `every ${step} ${name.toLowerCase()}(s) starting at ${range}`;
  }
  if (expr.includes('-')) {
    const [start, end] = expr.split('-');
    if (name === 'Month')       return `${MONTH_NAMES[parseInt(start)]}–${MONTH_NAMES[parseInt(end)]}`;
    if (name === 'Day of Week') return `${DOW_NAMES[parseInt(start)]}–${DOW_NAMES[parseInt(end)]}`;
    return `${name} ${start}–${end}`;
  }
  if (expr.includes(',')) {
    const vals = expr.split(',');
    if (name === 'Month')       return vals.map(v => MONTH_NAMES[parseInt(v)] || v).join(', ');
    if (name === 'Day of Week') return vals.map(v => DOW_NAMES[parseInt(v)]   || v).join(', ');
    return `${name.toLowerCase()}s ${vals.join(', ')}`;
  }
  return expr;
}

function getNextRuns(parts, count = 5) {
  const [minuteE, hourE, domE, monthE, dowE] = parts;

  function matches(val, expr, min) {
    if (expr === '*') return true;
    if (/^\d+$/.test(expr)) return val === parseInt(expr);
    if (expr.startsWith('*/')) return (val - min) % parseInt(expr.slice(2)) === 0;
    if (expr.includes('/')) {
      const [start, step] = expr.split('/');
      return val >= parseInt(start) && (val - parseInt(start)) % parseInt(step) === 0;
    }
    if (expr.includes('-')) {
      const [s, e] = expr.split('-').map(Number);
      return val >= s && val <= e;
    }
    if (expr.includes(',')) return expr.split(',').map(Number).includes(val);
    return false;
  }

  const runs = [];
  const now = new Date();
  now.setSeconds(0, 0);
  now.setMinutes(now.getMinutes() + 1);

  for (let attempt = 0; attempt < 100000 && runs.length < count; attempt++) {
    const mo  = now.getMonth() + 1;
    const dom = now.getDate();
    const dow = now.getDay();
    const h   = now.getHours();
    const mi  = now.getMinutes();

    if (matches(mo, monthE, 1) &&
        matches(dom, domE, 1) &&
        (dowE === '*' || matches(dow === 0 ? 0 : dow, dowE, 0)) &&
        matches(h, hourE, 0) &&
        matches(mi, minuteE, 0)) {
      runs.push(new Date(now));
    }
    now.setMinutes(now.getMinutes() + 1);
  }
  return runs;
}

function explainCron() {
  const input    = document.getElementById('cronInput').value.trim();
  const errorEl  = document.getElementById('cronError');
  const fieldsEl = document.getElementById('cronFields');
  const summaryEl = document.getElementById('cronSummary');
  const nextRunsEl = document.getElementById('cronNextRuns');

  errorEl.style.display = 'none';
  fieldsEl.style.display = 'none';
  summaryEl.style.display = 'none';
  nextRunsEl.style.display = 'none';
  if (!input) return;

  const specials = {
    '@yearly': '0 0 1 1 *', '@annually': '0 0 1 1 *',
    '@monthly': '0 0 1 * *', '@weekly': '0 0 * * 0',
    '@daily': '0 0 * * *', '@midnight': '0 0 * * *',
    '@hourly': '0 * * * *',
  };
  const resolved = specials[input.toLowerCase()] || input;
  const parts = resolved.split(/\s+/);

  if (parts.length !== 5) {
    errorEl.textContent = '⚠ Expected 5 fields: minute hour dom month dow';
    errorEl.style.display = 'block';
    return;
  }

  try {
    const [minuteE, hourE, domE, monthE, dowE] = parts;

    const minuteDesc = explainCronField(minuteE, CRON_FIELDS[0]);
    const hourDesc   = explainCronField(hourE,   CRON_FIELDS[1]);
    const domDesc    = explainCronField(domE,    CRON_FIELDS[2]);
    const monthDesc  = explainCronField(monthE,  CRON_FIELDS[3]);
    const dowDesc    = explainCronField(dowE,    CRON_FIELDS[4]);

    let summary = `Runs ${minuteDesc}, ${hourDesc}`;
    if (domE   !== '*') summary += `, on day ${domDesc}`;
    if (monthE !== '*') summary += `, in ${monthDesc}`;
    if (dowE   !== '*') summary += `, on ${dowDesc}`;

    // Field cards for the grid
    fieldsEl.innerHTML = parts.map((expr, i) => {
      const field = CRON_FIELDS[i];
      return `<div class="bg-slate-700 rounded-lg p-3">
        <div class="text-gray-400 text-xs mb-1">${field.name}</div>
        <div class="font-mono text-blue-300 text-lg font-bold mb-1">${expr}</div>
        <div class="text-gray-300 text-xs">${explainCronField(expr, field)}</div>
      </div>`;
    }).join('');

    summaryEl.textContent = summary;

    const nextRuns = getNextRuns(parts);
    document.getElementById('cronRunsList').innerHTML = nextRuns.length > 0
      ? nextRuns.map(d => `<li class="font-mono text-sm text-gray-300">${d.toLocaleString()}</li>`).join('')
      : '<li class="text-gray-500 text-sm">Could not compute next runs</li>';

    fieldsEl.style.display = 'grid';
    summaryEl.style.display = 'block';
    nextRunsEl.style.display = 'block';
  } catch (e) {
    errorEl.textContent = '⚠ ' + e.message;
    errorEl.style.display = 'block';
  }
}

function setCronExample(val) {
  document.getElementById('cronInput').value = val;
  explainCron();
}
