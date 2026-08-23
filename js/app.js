const API_URL = window.location.hostname === 'localhost'
  ? 'http://localhost:3001'
  : 'https://upsheet-ai.onrender.com';

// ═══════════════════════════════════════════════════════════════
//  PLAN LIMITS
// ═══════════════════════════════════════════════════════════════
function checkCommandLimit() {
  try {
    var plan = userPlan || 'free';
    var staticLimits = { free: 20, pro: 200, promax: 1500, business: Infinity, ultra: Infinity };
    var limit = userUsage?.limits?.ai_commands_per_month ?? (staticLimits[plan] !== undefined ? staticLimits[plan] : 20);
    var key = 'mocksheets_usage_' + new Date().toISOString().slice(0, 7);
    var usage = parseInt(localStorage.getItem(key) || '0');
    if (usage >= limit) {
      showToast(
        '⚠️ Aylık ' + limit + ' komut limitine ulaştınız.' +
        (plan === 'free' ? ' <a href="/pricing" style="color:#A5B4FC">Pro\'ya geç →</a>' : ''),
        'err'
      );
      return false;
    }
    localStorage.setItem(key, String(usage + 1));
    return true;
  } catch { return true; }
}

// ═══════════════════════════════════════════════════════════════
//  PERF UTILITIES — debounce & throttle
// ═══════════════════════════════════════════════════════════════
function debounce(fn, delay) {
  var _timer;
  return function() { var _args = arguments, _this = this; clearTimeout(_timer); _timer = setTimeout(function() { fn.apply(_this, _args); }, delay); };
}
function throttle(fn, limit) {
  var _last = 0;
  return function() { var now = Date.now(); if (now - _last >= limit) { _last = now; fn.apply(this, arguments); } };
}
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════
const ROWS = 50, COLS = 26;
let sheets = { Sheet1: createEmptySheet(), Sheet2: createEmptySheet() };
let activeSheet = 'Sheet1';
let selRow = 0, selCol = 0;
let selStart = null, selEnd = null;
let cellMeta = {}; // {sheetName: {r_c: {bold,italic,underline,align,bg,color,fontFamily,fontSize}}}
let isProcessing = false; // çift gönderim koruması — sendChat/sendChatMessage paylaşır
let CALL_COUNTER = 0; // debug: API çağrı sayacı
let recentFiles = [];
let colWidths = {};
let rowHeights = {};
let versionHistory = []; // [{type, desc, time, snapshot, metaSnap}]
let redoStack = [];
let historyRestoreIdx = -1;
let apiKey = localStorage.getItem('openai_key') || '';
let chatHistory = [];
let chatAttachments = [];
let clipboard = null;
let cutSource = null;
let dirtyCells = new Set(); // tracks modified cells for optimized localStorage saves

const VH_ICONS = {
  ai:     {emoji:'⚡', cls:'ai'},
  manual: {emoji:'✏️', cls:'manual'},
  file:   {emoji:'📁', cls:'file'}
};

function createEmptySheet() {
  return Array.from({length: ROWS}, () => Array(COLS).fill(''));
}

// ═══════════════════════════════════════════════════════════════
//  GRID BUILD
// ═══════════════════════════════════════════════════════════════
function colLetter(i) {
  if (i < 26) return String.fromCharCode(65 + i);
  return String.fromCharCode(64 + Math.floor(i / 26)) + String.fromCharCode(65 + (i % 26));
}

function buildGrid(data) {
  if (!data) data = sheets && activeSheet ? (sheets[activeSheet] || []) : [];
  if (!data || !Array.isArray(data)) {
    console.warn('buildGrid: invalid data', data);
    return;
  }
  console.log('%c[buildGrid]', 'color:green;font-weight:bold',
    '| rows:', data.length,
    '| headers:', data[0]?.slice(0, 5),
    '| row1:', data[1]?.slice(0, 5)
  );
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  const meta = getCellMeta();

  // Header row
  const hrow = grid.insertRow();
  const corner = hrow.insertCell();
  corner.className = 'corner';

  for (let c = 0; c < COLS; c++) {
    const th = document.createElement('th');
    th.className = 'ch' + (selEnd && rangeIncludes(-1, c) ? ' sel' : '');
    th.textContent = colLetter(c);
    th.dataset.col = c;
    th.onclick = e => selectColumn(c, e.shiftKey);
    const cr = document.createElement('div');
    cr.className = 'ch-resize';
    cr.addEventListener('mousedown', e => startColResize(e, c));
    th.appendChild(cr);
    if (colWidths[c]) { th.style.width = colWidths[c]+'px'; th.style.minWidth = colWidths[c]+'px'; }
    hrow.appendChild(th);
  }

  // Use actual data length so large loaded files display all rows
  const effectiveRows = data.length || ROWS;
  for (let r = 0; r < effectiveRows; r++) {
    const row = grid.insertRow();
    const rh = row.insertCell();
    rh.className = 'rh' + (selEnd && rangeIncludes(r, -1) ? ' sel' : '');
    rh.textContent = r + 1;
    rh.dataset.row = r;
    rh.onclick = e => selectRow(r, e.shiftKey);
    const rr = document.createElement('div');
    rr.className = 'rh-resize';
    rr.addEventListener('mousedown', e => startRowResize(e, r));
    rh.appendChild(rr);
    if (rowHeights[r]) { rh.style.height = rowHeights[r]+'px'; }

    for (let c = 0; c < COLS; c++) {
      const td = row.insertCell();
      td.className = 'cell';
      td.dataset.r = r; td.dataset.c = c;

      const key = r + '_' + c;
      const m = meta[key] || {};
      if (m.bold) td.classList.add('bold');
      if (m.italic) td.classList.add('italic');
      if (m.underline) td.classList.add('underline');
      if (m.strikethrough) td.classList.add('strikethrough');
      if (m.bg) td.style.background = m.bg;
      if (m.color) td.style.color = m.color;
      if (m.align) td.style.textAlign = m.align;

      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = data[r][c] || '';
      if (m.fontFamily) inp.style.fontFamily = m.fontFamily;
      if (m.fontSize) inp.style.fontSize = m.fontSize + 'px';

      inp.addEventListener('focus', () => selectCell(r, c, inp));
      inp.addEventListener('input', () => {
        data[r][c] = inp.value;
        dirtyCells.add(r + '_' + c);
        document.getElementById('formulaInput').value = inp.value;
        updateStatus();
      });
      inp.addEventListener('blur', () => {
        clearTimeout(window._autoEvalTimer);
        window._autoEvalTimer = setTimeout(() => {
          if (window.Automations?.evaluate) window.Automations.evaluate(sheets[activeSheet]);
        }, 400);
      });
      inp.addEventListener('keydown', e => cellKeydown(e, r, c));
      td.appendChild(inp);

      // Shift+click range selection
      td.addEventListener('mousedown', e => {
        if (e.shiftKey && selStart) {
          e.preventDefault();
          selEnd = {r, c};
          buildGrid();
        }
      });
      // Drag-drop
      td.draggable = true;
      td.addEventListener('dragstart', e => { e.dataTransfer.setData('text', r+'_'+c); td.classList.add('drag-src'); });
      td.addEventListener('dragend',   () => td.classList.remove('drag-src'));
      td.addEventListener('dragover',  e => { e.preventDefault(); td.classList.add('drag-over'); });
      td.addEventListener('dragleave', () => td.classList.remove('drag-over'));
      td.addEventListener('drop', e => {
        e.preventDefault();
        td.classList.remove('drag-over');
        const parts = e.dataTransfer.getData('text').split('_');
        const sr = parseInt(parts[0]), sc = parseInt(parts[1]);
        const data = sheets[activeSheet];
        data[r][c] = data[sr][sc];
        data[sr][sc] = '';
        buildGrid();
        focusCell(r, c);
      });

      if (r === selRow && c === selCol) {
        td.classList.add('sel');
      }
    }
  }

  updateCellRef();
  updateStatus();
  updateFormulaBar();
  checkEmptyState();
  // Integrations sayfası için veriyi sessionStorage'a yaz
  try {
    const sheetData = sheets[activeSheet] || [];
    if (sheetData.length > 0) {
      sessionStorage.setItem('mocksheet_current', JSON.stringify(sheetData.slice(0, 1000)));
      sessionStorage.setItem('mocksheet_sheet_name', activeSheet || 'Sheet1');
    }
  } catch(e) {
    console.warn('sessionStorage write failed:', e);
  }
}

function getCellMeta(r, c) {
  if (!cellMeta[activeSheet]) cellMeta[activeSheet] = {};
  if (r === undefined) return cellMeta[activeSheet];
  return cellMeta[activeSheet][r + '_' + c] || {};
}

function setCellMeta(r, c, meta) {
  if (!cellMeta[activeSheet]) cellMeta[activeSheet] = {};
  cellMeta[activeSheet][r + '_' + c] = meta;
}

function getSelectedCells() {
  if (!selStart || !selEnd) return [{ r: selRow, c: selCol }];
  const r1 = Math.min(selStart.r, selEnd.r), r2 = Math.max(selStart.r, selEnd.r);
  const c1 = Math.min(selStart.c, selEnd.c), c2 = Math.max(selStart.c, selEnd.c);
  const cells = [];
  for (let r = r1; r <= r2; r++)
    for (let c = c1; c <= c2; c++)
      cells.push({ r, c });
  return cells;
}

function applyMetaToCell(r, c) {
  const cell = document.querySelector(`#grid td[data-r="${r}"][data-c="${c}"]`);
  if (!cell) return;
  const meta = getCellMeta(r, c);
  cell.classList.toggle('bold', !!meta.bold);
  cell.classList.toggle('italic', !!meta.italic);
  cell.classList.toggle('underline', !!meta.underline);
  cell.classList.toggle('strikethrough', !!meta.strikethrough);
  cell.style.color = meta.color || '';
  cell.style.background = meta.bg || '';
}

function selectCell(r, c, inp) {
  // Remove old selection
  document.querySelectorAll('.cell.sel').forEach(el => el.classList.remove('sel'));
  document.querySelectorAll('.ch.sel,.rh.sel').forEach(el => el.classList.remove('sel'));

  selRow = r; selCol = c;
  selStart = {r, c}; selEnd = {r, c};

  const td = getCell(r, c);
  if (td) td.classList.add('sel');

  updateCellRef();
  updateFormulaBar();
  updateStatus();
  updateToolbarState();
  if (typeof showFloatToolbar === 'function') showFloatToolbar(r, c);
}

function getCell(r, c) {
  return document.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
}

function getInput(r, c) {
  const td = getCell(r, c);
  return td ? td.querySelector('input') : null;
}

function focusCell(r, c) {
  const inp = getInput(r, c);
  if (inp) inp.focus();
}

function updateCellRef() {
  const ref = colLetter(selCol) + (selRow + 1);
  document.getElementById('cellRef').value = ref;
  document.getElementById('stSel').textContent = ref;
  document.getElementById('sbRef').textContent = ref;
}

function updateFormulaBar() {
  const data = sheets[activeSheet];
  document.getElementById('formulaInput').value = data[selRow] ? (data[selRow][selCol] || '') : '';
}

function formulaInput_oninput(val) {
  const data = sheets[activeSheet];
  if (data[selRow]) {
    data[selRow][selCol] = val;
    dirtyCells.add(selRow + '_' + selCol);
    const inp = getInput(selRow, selCol);
    if (inp) inp.value = val;
    updateStatus(); // already debounced (150ms)
  }
}

function formulaKeydown(e) {
  if (e.key === 'Enter') focusCell(selRow, selCol);
}

function cellKeydown(e, r, c) {
  const data = sheets[activeSheet];
  const maxRow = data.length - 1;
  switch(e.key) {
    case 'Enter':
      e.preventDefault();
      if (r < maxRow) focusCell(r + 1, c);
      break;
    case 'Tab':
      e.preventDefault();
      if (e.shiftKey) { if (c > 0) focusCell(r, c - 1); }
      else { if (c < COLS - 1) focusCell(r, c + 1); }
      break;
    case 'ArrowUp': e.preventDefault(); if (r > 0) focusCell(r - 1, c); break;
    case 'ArrowDown': e.preventDefault(); if (r < maxRow) focusCell(r + 1, c); break;
    case 'ArrowLeft':
      if (e.target.selectionStart === 0 && !e.shiftKey) {
        e.preventDefault(); if (c > 0) focusCell(r, c - 1);
      }
      break;
    case 'ArrowRight':
      if (e.target.selectionEnd === e.target.value.length && !e.shiftKey) {
        e.preventDefault(); if (c < COLS - 1) focusCell(r, c + 1);
      }
      break;
    case 'Delete': case 'Backspace':
      if (!e.target.value && e.key === 'Delete') {
        data[r][c] = ''; e.target.value = '';
      }
      break;
  }

  // Ctrl shortcuts
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'b') { e.preventDefault(); toggleFormat('bold'); }
    if (e.key === 'i') { e.preventDefault(); toggleFormat('italic'); }
    if (e.key === 'u') { e.preventDefault(); toggleFormat('underline'); }
    if (e.key === 'c') { e.preventDefault(); copyCell(); }
    if (e.key === 'x') { e.preventDefault(); cutCell(); }
    if (e.key === 'v') { e.preventDefault(); pasteCell(); }
  }
}

// ═══════════════════════════════════════════════════════════════
//  SELECTION
// ═══════════════════════════════════════════════════════════════
function rangeIncludes(r, c) {
  if (!selStart || !selEnd) return false;
  const minR = Math.min(selStart.r, selEnd.r);
  const maxR = Math.max(selStart.r, selEnd.r);
  const minC = Math.min(selStart.c, selEnd.c);
  const maxC = Math.max(selStart.c, selEnd.c);
  if (r === -1) return c >= minC && c <= maxC;
  if (c === -1) return r >= minR && r <= maxR;
  return r >= minR && r <= maxR && c >= minC && c <= maxC;
}

function selectRow(r, shift) {
  selRow = r; selCol = 0;
  selStart = {r, c: 0}; selEnd = {r, c: COLS - 1};
  buildGrid();
  updateCellRef();
}

function selectColumn(c, shift) {
  selRow = 0; selCol = c;
  const lastRow = (sheets[activeSheet] ? sheets[activeSheet].length : ROWS) - 1;
  selStart = {r: 0, c}; selEnd = {r: lastRow, c};
  buildGrid();
  updateCellRef();
}

// ═══════════════════════════════════════════════════════════════
//  STATUS BAR
// ═══════════════════════════════════════════════════════════════
function updateStatus() {
  const data = sheets[activeSheet];
  if (!data) return;
  if (!document.getElementById('mbCells')) return;
  let filled = 0, numCount = 0, total = 0, activeRows = 0;
  const rows = data.length;

  for (let r = 0; r < rows; r++) {
    let rowHas = false;
    for (let c = 0; c < COLS; c++) {
      if (data[r][c] !== '') {
        filled++;
        rowHas = true;
        const v = parseFloat(data[r][c]);
        if (!isNaN(v)) { total += v; numCount++; }
      }
    }
    if (rowHas) activeRows++;
  }

  // Topbar badges
  document.getElementById('mbCells').textContent = '⚡ ' + filled + ' ' + t('cells');
  document.getElementById('mbRows').textContent = '↕ ' + activeRows + ' ' + t('rows');

  // Right section of status bar
  document.getElementById('sbFilled').textContent = filled.toLocaleString(currentLang === 'tr' ? 'tr-TR' : 'en-US');
  document.getElementById('sbRowsInfo').textContent = activeRows;

  // Selection metrics chips
  if (selStart && selEnd) {
    const minR = Math.min(selStart.r, selEnd.r), maxR = Math.max(selStart.r, selEnd.r);
    const minC = Math.min(selStart.c, selEnd.c), maxC = Math.max(selStart.c, selEnd.c);
    const selTotal = (maxR - minR + 1) * (maxC - minC + 1);
    const multi = selTotal > 1;
    const nums = [];
    for (let r = minR; r <= maxR; r++)
      for (let c = minC; c <= maxC; c++) {
        const v = parseFloat(data[r][c]);
        if (!isNaN(v)) nums.push(v);
      }
    document.getElementById('sbSelCount').textContent = selTotal;
    document.getElementById('sbSelChip').style.display = multi ? '' : 'none';
    if (nums.length > 0 && multi) {
      const s = nums.reduce((a, b) => a + b, 0);
      const fmt = n => n.toLocaleString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {maximumFractionDigits: 2});
      document.getElementById('sbSumVal').textContent = fmt(s);
      document.getElementById('sbAvgVal').textContent = fmt(s / nums.length);
      document.getElementById('sbMinVal').textContent = fmt(Math.min(...nums));
      document.getElementById('sbMaxVal').textContent = fmt(Math.max(...nums));
      document.getElementById('sbSumChip').style.display = '';
      document.getElementById('sbAvgChip').style.display = '';
      document.getElementById('sbMinChip').style.display = nums.length > 1 ? '' : 'none';
      document.getElementById('sbMaxChip').style.display = nums.length > 1 ? '' : 'none';
    } else {
      ['sbSumChip','sbAvgChip','sbMinChip','sbMaxChip'].forEach(id =>
        document.getElementById(id).style.display = 'none');
    }
  }

  // Legacy IDs
  document.getElementById('stCells').textContent = filled;
  document.getElementById('stSum').textContent = numCount ? total.toLocaleString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {maximumFractionDigits: 2}) : '0';
  document.getElementById('stAvg').textContent = numCount ? (total / numCount).toLocaleString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {maximumFractionDigits: 2}) : '0';
  document.getElementById('stCount').textContent = numCount;

  // Chart auto-update hook
  if (typeof chartAutoUpdate !== 'undefined' && chartAutoUpdate) {
    clearTimeout(chartDataWatcher);
    chartDataWatcher = setTimeout(updateChartData, 120);
  }
}
// Debounce status updates — prevents re-computing on every keystroke
updateStatus = debounce(updateStatus, 150);

// ═══════════════════════════════════════════════════════════════
//  FORMAT
// ═══════════════════════════════════════════════════════════════
function toggleFormat(type) {
  const cells = getSelectedCells();
  if (!cells || cells.length === 0) { toast(t('toast_select_cell'), 'warn'); return; }
  cells.forEach(({r, c}) => {
    const meta = getCellMeta(r, c);
    if (type === 'bold') meta.bold = !meta.bold;
    if (type === 'italic') meta.italic = !meta.italic;
    if (type === 'underline') meta.underline = !meta.underline;
    if (type === 'strikethrough') meta.strikethrough = !meta.strikethrough;
    setCellMeta(r, c, meta);
    applyMetaToCell(r, c);
  });
}

function applyAlign(dir) {
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  if (!meta[key]) meta[key] = {};
  meta[key].align = dir;
  const td = getCell(selRow, selCol);
  if (td) td.style.textAlign = dir;
}

function applyCellBg(color) {
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  if (!meta[key]) meta[key] = {};
  meta[key].bg = color;
  const td = getCell(selRow, selCol);
  if (td) td.style.background = color;
}

function applyCellColor(color) {
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  if (!meta[key]) meta[key] = {};
  meta[key].color = color;
  const td = getCell(selRow, selCol);
  if (td) td.style.color = color;
}

function setTextColor(color) {
  const cells = getSelectedCells();
  if (!cells || cells.length === 0) { toast(t('toast_select_cell'), 'warn'); return; }
  cells.forEach(({r, c}) => {
    const meta = getCellMeta(r, c);
    meta.color = color;
    setCellMeta(r, c, meta);
    applyMetaToCell(r, c);
  });
}

function setCellBgColor(color) {
  const cells = getSelectedCells();
  if (!cells || cells.length === 0) { toast(t('toast_select_cell'), 'warn'); return; }
  cells.forEach(({r, c}) => {
    const meta = getCellMeta(r, c);
    meta.bg = color;
    setCellMeta(r, c, meta);
    applyMetaToCell(r, c);
  });
}

function applyFont(family) {
  const cells = getSelectedCells();
  if (!cells || cells.length === 0) { toast(t('toast_select_cell'), 'warn'); return; }
  cells.forEach(({r, c}) => {
    const meta = getCellMeta(r, c);
    meta.fontFamily = family;
    setCellMeta(r, c, meta);
    applyMetaToCell(r, c);
  });
}

function applyFontSize(size) {
  const cells = getSelectedCells();
  if (!cells || cells.length === 0) { toast(t('toast_select_cell'), 'warn'); return; }
  cells.forEach(({r, c}) => {
    const meta = getCellMeta(r, c);
    meta.fontSize = parseInt(size);
    setCellMeta(r, c, meta);
    applyMetaToCell(r, c);
  });
}

function updateToolbarState() {
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  const m = meta[key] || {};
  document.getElementById('tbBold')?.classList.toggle('on', !!m.bold);
  document.getElementById('tbItalic')?.classList.toggle('on', !!m.italic);
  document.getElementById('tbUnderline')?.classList.toggle('on', !!m.underline);
  document.getElementById('tbStrikethrough')?.classList.toggle('on', !!m.strikethrough);
  const fontSel = document.getElementById('tbFontSelect');
  if (fontSel) fontSel.value = m.fontFamily || 'Geist';
  const sizeSel = document.getElementById('tbSizeSelect');
  if (sizeSel) sizeSel.value = m.fontSize || 12;
}

function mergeCells() {
  toast(t('toast_merge_soon'), 'ok');
}

function addFilter() {
  toast(t('toast_filter_added'), 'ok');
}

function clearHighlights() {
  document.querySelectorAll('.cell.hi').forEach(el => el.classList.remove('hi'));
  toast(t('toast_highlights_cleared'), 'ok');
}

// ═══════════════════════════════════════════════════════════════
//  COPY / PASTE
// ═══════════════════════════════════════════════════════════════
function copyCell() {
  const data = sheets[activeSheet];
  clipboard = data[selRow][selCol];
  cutSource = null;
  toast(t('toast_copied'), 'ok');
}

function cutCell() {
  const data = sheets[activeSheet];
  clipboard = data[selRow][selCol];
  cutSource = {r: selRow, c: selCol, sheet: activeSheet};
  toast(t('toast_cut'), 'ok');
}

function pasteCell() {
  if (clipboard === null) return;
  const data = sheets[activeSheet];
  data[selRow][selCol] = clipboard;
  const inp = getInput(selRow, selCol);
  if (inp) inp.value = clipboard;

  if (cutSource) {
    const src = sheets[cutSource.sheet];
    src[cutSource.r][cutSource.c] = '';
    const si = getInput(cutSource.r, cutSource.c);
    if (si) si.value = '';
    cutSource = null;
    clipboard = null;
  }
  updateFormulaBar();
  updateStatus();
}

// ═══════════════════════════════════════════════════════════════
//  CONTEXT MENU
// ═══════════════════════════════════════════════════════════════
function showCtx(e) {
  e.preventDefault();
  const menu = document.getElementById('ctxMenu');
  menu.style.display = 'block';
  menu.style.left = e.clientX + 'px';
  menu.style.top = e.clientY + 'px';
  setTimeout(() => document.addEventListener('click', hideCtx, {once: true}), 0);
}

function hideCtx() {
  document.getElementById('ctxMenu').style.display = 'none';
}

function ctxAction(action) {
  hideCtx();
  const data = sheets[activeSheet];
  switch(action) {
    case 'cut': cutCell(); break;
    case 'copy': copyCell(); break;
    case 'paste': pasteCell(); break;
    case 'clearCell':
      data[selRow][selCol] = '';
      const inp = getInput(selRow, selCol);
      if (inp) inp.value = '';
      updateFormulaBar();
      break;
    case 'insertRowAbove':
      data.splice(selRow, 0, Array(COLS).fill(''));
      data.pop();
      buildGrid();
      toast('Row added', 'ok');
      break;
    case 'insertRowBelow':
      data.splice(selRow + 1, 0, Array(COLS).fill(''));
      data.pop();
      buildGrid();
      toast('Row added', 'ok');
      break;
    case 'insertColLeft':
      data.forEach(row => { row.splice(selCol, 0, ''); row.pop(); });
      buildGrid();
      toast('Column added', 'ok');
      break;
    case 'insertColRight':
      data.forEach(row => { row.splice(selCol + 1, 0, ''); row.pop(); });
      buildGrid();
      toast('Column added', 'ok');
      break;
    case 'deleteRow':
      data.splice(selRow, 1);
      data.push(Array(COLS).fill(''));
      buildGrid();
      toast('Row deleted', 'ok');
      break;
    case 'deleteCol':
      data.forEach(row => { row.splice(selCol, 1); row.push(''); });
      buildGrid();
      toast('Column deleted', 'ok');
      break;
  }
}

// ═══════════════════════════════════════════════════════════════
//  SHEETS
// ═══════════════════════════════════════════════════════════════
function sheetCellCount(name) {
  const data = sheets[name];
  let n = 0;
  for (let r = 0; r < data.length; r++)
    for (let c = 0; c < data[r].length; c++)
      if (data[r][c] !== '') n++;
  return n;
}

function renderSheetTabs() {
  // ── Bottom tab bar ─────────────────────────
  const tabs = document.getElementById('sheetTabs');
  tabs.innerHTML = '';
  Object.keys(sheets).forEach(name => {
    const count = sheetCellCount(name);
    const tab = document.createElement('div');
    tab.className = 'stab' + (name === activeSheet ? ' active' : '');
    tab.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
      ${name}
      ${count > 0 ? `<span class="stab-count">${count}</span>` : ''}
      <span class="stab-del" onclick="event.stopPropagation();deleteSheetDirect('${name.replace(/'/g,"\\'")}');" title="${t('sheet_del_title')}">×</span>`;
    tab.onclick = () => switchSheet(name);
    tab.ondblclick = () => renameSheet(name);
    tab.addEventListener('contextmenu', e => showSheetCtx(e, name));
    tabs.appendChild(tab);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'stab-add';
  addBtn.title = t('sheet_new_title');
  addBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;
  addBtn.onclick = addSheet;
  tabs.appendChild(addBtn);

  renderSheetList();
}

function switchSheet(name) {
  activeSheet = name;
  renderSheetTabs();
  buildGrid();
}

function addSheet(name) {
  if (!sheets) sheets = {};
  const sheetName = name || 'Sheet' + (Object.keys(sheets).length + 1);
  if (!sheets[sheetName]) {
    sheets[sheetName] = Array.from({length: ROWS}, () => Array(COLS).fill(''));
  }
  activeSheet = sheetName;
  buildGrid(sheets[activeSheet]);
  renderSheetTabs();
  saveData();
}

function renameSheet(oldName) {
  const newName = prompt(t('prompt_sheet_name'), oldName);
  if (!newName || newName === oldName || sheets[newName]) return;
  const data = sheets[oldName];
  const meta = cellMeta[oldName];
  delete sheets[oldName];
  delete cellMeta[oldName];
  sheets[newName] = data;
  if (meta) cellMeta[newName] = meta;
  if (activeSheet === oldName) activeSheet = newName;
  renderSheetTabs();
  toast(tpl('toast_renamed_tpl', {name: newName}), 'ok');
}

// ═══════════════════════════════════════════════════════════════
//  FILE OPERATIONS
// ═══════════════════════════════════════════════════════════════
function triggerUpload() {
  document.getElementById('fileInput').click();
}

// ── renderChunked: progressively renders large grids with rAF ──
function renderChunked(data, onDone, chunkSize) {
  chunkSize = chunkSize || 500;
  const grid = document.getElementById('grid');
  const meta = getCellMeta();
  grid.innerHTML = '';

  // Header row
  const hrow = grid.insertRow();
  const corner = hrow.insertCell();
  corner.className = 'corner';
  for (let c = 0; c < COLS; c++) {
    const th = document.createElement('th');
    th.className = 'ch';
    th.textContent = colLetter(c);
    th.dataset.col = c;
    th.onclick = (function(col) { return function(e) { selectColumn(col, e.shiftKey); }; }(c));
    const cr = document.createElement('div');
    cr.className = 'ch-resize';
    cr.addEventListener('mousedown', (function(col) { return function(e) { startColResize(e, col); }; }(c)));
    th.appendChild(cr);
    if (colWidths[c]) { th.style.width = colWidths[c]+'px'; th.style.minWidth = colWidths[c]+'px'; }
    hrow.appendChild(th);
  }

  let row = 0;
  const totalRows = data.length;

  function renderNext() {
    const end = Math.min(row + chunkSize, totalRows);
    for (let r = row; r < end; r++) {
      const tr = grid.insertRow();
      const rh = tr.insertCell();
      rh.className = 'rh';
      rh.textContent = r + 1;
      rh.dataset.row = r;
      rh.onclick = (function(row) { return function(e) { selectRow(row, e.shiftKey); }; }(r));
      const rr = document.createElement('div');
      rr.className = 'rh-resize';
      rr.addEventListener('mousedown', (function(row) { return function(e) { startRowResize(e, row); }; }(r)));
      rh.appendChild(rr);
      if (rowHeights[r]) { rh.style.height = rowHeights[r]+'px'; }

      for (let c = 0; c < COLS; c++) {
        const td = tr.insertCell();
        td.className = 'cell';
        td.dataset.r = r; td.dataset.c = c;
        const key = r + '_' + c;
        const m = meta[key] || {};
        if (m.bold) td.classList.add('bold');
        if (m.italic) td.classList.add('italic');
        if (m.underline) td.classList.add('underline');
        if (m.bg) td.style.background = m.bg;
        if (m.color) td.style.color = m.color;
        if (m.align) td.style.textAlign = m.align;

        const inp = document.createElement('input');
        inp.type = 'text';
        inp.value = (data[r] && data[r][c]) ? data[r][c] : '';
        if (m.fontFamily) inp.style.fontFamily = m.fontFamily;
        if (m.fontSize) inp.style.fontSize = m.fontSize + 'px';

        inp.addEventListener('focus', (function(row, col, input) { return function() { selectCell(row, col, input); }; }(r, c, inp)));
        inp.addEventListener('input', (function(row, col, input) { return function() {
          data[row][col] = input.value;
          dirtyCells.add(row + '_' + col);
          document.getElementById('formulaInput').value = input.value;
          updateStatus();
        }; }(r, c, inp)));
        inp.addEventListener('blur', function() {
          clearTimeout(window._autoEvalTimer);
          window._autoEvalTimer = setTimeout(function() {
            if (window.Automations && window.Automations.evaluate) window.Automations.evaluate(sheets[activeSheet]);
          }, 400);
        });
        inp.addEventListener('keydown', (function(row, col) { return function(e) { cellKeydown(e, row, col); }; }(r, c)));
        td.appendChild(inp);
      }
    }
    row = end;
    if (row < totalRows) {
      requestAnimationFrame(renderNext);
    } else {
      if (typeof onDone === 'function') onDone();
    }
  }
  requestAnimationFrame(renderNext);
}

function handleFile(e) {
  const file = e instanceof File ? e : (e.target ? e.target.files[0] : null);
  if (!file) return;

  // ── File size guard ──────────────────────────────────────────
  const MB10 = 10 * 1024 * 1024;
  const MB5  =  5 * 1024 * 1024;
  if (file.size > MB10) {
    toast('This file is too large (max 10MB). Please select a smaller file.', 'err');
    e.target.value = '';
    return;
  }
  if (file.size > MB5) {
    toast('Loading large file, please wait...', 'warning');
  }

  const reader = new FileReader();
  const isCSV = file.name.toLowerCase().endsWith('.csv');

  reader.onload = function(evt) {
    try {
      const wb = XLSX.read(evt.target.result, {type: isCSV ? 'string' : 'binary'});
      sheets = {};
      var trimmedRows = 0;
      var maxDataRows = 0;

      wb.SheetNames.forEach(function(name) {
        const ws = wb.Sheets[name];
        const json = XLSX.utils.sheet_to_json(ws, {header: 1, defval: ''});
        const totalRows = json.length;

        // ── Row limit ──────────────────────────────────────────
        var limitedJson = json;
        if (totalRows > 10000) {
          limitedJson = json.slice(0, 5000);
          if (!trimmedRows) trimmedRows = totalRows;
        }

        const rowCount = Math.max(ROWS, limitedJson.length);
        maxDataRows = Math.max(maxDataRows, limitedJson.length);

        // Build dynamic-size grid (not limited to hardcoded ROWS)
        const grid = Array.from({length: rowCount}, function() { return Array(COLS).fill(''); });
        limitedJson.forEach(function(row, r) {
          row.forEach(function(cell, c) {
            if (c >= COLS) return;
            grid[r][c] = String(cell != null ? cell : '');
          });
        });
        sheets[name] = grid;
      });

      activeSheet = wb.SheetNames[0];
      const fileNameEl = document.getElementById('fileName');
      if (fileNameEl) fileNameEl.textContent = file.name;
      const fileNameInputEl = document.getElementById('fileNameInput');
      if (fileNameInputEl) fileNameInputEl.value = file.name;
      document.title = 'Mocksheets — ' + file.name;
      addRecentFile(file.name);
      renderSheetTabs();

      // ── Render strategy: chunk large files, sync small files ─
      if (maxDataRows > 500) {
        renderChunked(sheets[activeSheet], function() {
          updateCellRef();
          updateStatus();
          updateFormulaBar();
          checkEmptyState();
          focusCell(0, 0);
          // Hide overlay (set by UX block monkey-patch)
          var ov = document.getElementById('fileLoadingOverlay');
          if (ov) ov.style.display = 'none';
        });
      } else {
        buildGrid();
      }

      addHistory('file', '"' + file.name + '" loaded');

      if (trimmedRows) {
        toast(tpl('toast_file_trimmed_tpl', {count: trimmedRows.toLocaleString(currentLang === 'tr' ? 'tr-TR' : 'en-US')}), 'info');
      } else {
        toast(tpl('toast_file_loaded_tpl', {name: file.name}), 'ok');
      }

      // Onboarding step 2
      var _overlay = document.getElementById('onboardOverlay');
      if (_overlay && _overlay.style.display !== 'none') {
        var _grid = sheets[activeSheet] || [];
        var _rowCount = _grid.filter(function(r) { return r.some(function(c) { return c !== ''; }); }).length;
        var _colCount = _grid[0] ? _grid[0].filter(function(c, i) {
          return _grid.some(function(r) { return r[i] !== ''; });
        }).length : 0;
        if (typeof obShowStep2 === 'function') obShowStep2(file.name, _rowCount, _colCount);
      }

      // Upload to Supabase cloud storage
      if (typeof uploadFileToSupabase === 'function') {
        uploadFileToSupabase(file, sheets);
      }

      // Tablo başlıklarını kaydet (otomasyon AI önerisi için) ve kuralları değerlendir
      try {
        const _headers = (sheets[activeSheet] && sheets[activeSheet][0]) || [];
        localStorage.setItem('mocksheets_headers', JSON.stringify(_headers.filter(Boolean)));
        if (window.Automations) window.Automations.evaluate(sheets[activeSheet]);
      } catch {}

    } catch(err) {
      toast('Could not read file: ' + err.message, 'err');
    }
  };

  if (isCSV) reader.readAsText(file, 'UTF-8');
  else reader.readAsBinaryString(file);
  if (e.target) e.target.value = '';
}

function downloadFile() {
  const fileName = document.getElementById('fileNameInput')?.value || 'mocksheets-export.xlsx';
  const finalName = fileName.endsWith('.xlsx') ? fileName : fileName + '.xlsx';
  const wb = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([name, data]) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = finalName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast(tpl('toast_downloaded_tpl', {name: finalName}), 'ok');
  // Export webhook
  try {
    const _wh = JSON.parse(localStorage.getItem('int_webhook') || '{}');
    if (_wh.url && (_wh.trigger === 'export' || _wh.trigger === 'all')) {
      fetch(API_URL + '/api/integrations/webhook/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: _wh.url, event: 'export', data: { filename: finalName, rows: (sheets[activeSheet] || []).length, format: 'xlsx', timestamp: new Date().toISOString() } }) }).catch(e => console.warn('[webhook] send failed:', e.message));
    }
  } catch(_e) {}
}

function downloadCSV() {
  const baseName = (document.getElementById('fileNameInput')?.value || 'mocksheets-export')
    .replace(/\.(xlsx?|csv)$/i, '');
  const fileName = baseName + '.csv';
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) {
    if (data[r].some(c => c !== '')) lastRow = r + 1;
  }
  const ws = XLSX.utils.aoa_to_sheet(data.slice(0, Math.max(lastRow, 1)));
  const csv = XLSX.utils.sheet_to_csv(ws);
  const blob = new Blob(['\uFEFF' + csv], {type: 'text/csv;charset=utf-8;'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
  toast(tpl('toast_downloaded_tpl', {name: fileName}), 'ok');
}

function newFile() {
  const name = 'New File.xlsx';
  sheets = { Sheet1: createEmptySheet(), Sheet2: createEmptySheet() };
  cellMeta = {};
  activeSheet = 'Sheet1';
  document.getElementById('fileName').textContent = name;
  document.getElementById('fileNameInput').value = name;
  document.title = 'Mocksheets — ' + name;
  addRecentFile(name);
  renderSheetTabs();
  buildGrid();
  addHistory('file', 'New file created');
  toast(t('toast_new_file'), 'ok');
}

function addRecentFile(name) {
  const entry = { name, time: Date.now() };
  recentFiles = [entry, ...recentFiles.filter(f => f.name !== name)].slice(0, 5);
  try { localStorage.setItem('recent_files', JSON.stringify(recentFiles)); } catch(e) {}
  renderRecentFiles();
}

function fmtTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000)  return 'Just now';
  if (diff < 3600000) return Math.floor(diff/60000) + ' min ago';
  if (diff < 86400000) return Math.floor(diff/3600000) + ' hr ago';
  return new Date(ts).toLocaleDateString('en-US', {day:'numeric',month:'short'});
}

function renderRecentFiles() {
  const el = document.getElementById('recentFiles');
  if (!el) return;
  const fileNameEl = document.getElementById('fileName');
  const activeName = fileNameEl ? fileNameEl.textContent : '';
  if (!recentFiles.length) {
    el.innerHTML = `<div style="padding:6px 10px;font-size:11px;color:#6b6b6b;">${t('ui_no_files_yet')}</div>`;
    return;
  }
  el.innerHTML = recentFiles.map((f, idx) => `
    <div class="rf-item${f.name === activeName ? ' active' : ''}" onclick="loadRecentFile(${idx})">
      <div class="file-icon-xs">XL</div>
      <div class="rf-item-info">
        <div class="rf-item-name">${escHtml(f.name)}</div>
        <div class="rf-item-time">${fmtTime(f.time)}</div>
      </div>
    </div>`).join('');
}

// ═══════════════════════════════════════════════════════════════
//  FILE NAME EDIT
// ═══════════════════════════════════════════════════════════════
function startRename() {
  const disp = document.getElementById('fileName');
  const inp = document.getElementById('fileNameInput');
  inp.value = disp.textContent;
  disp.style.display = 'none';
  inp.style.display = 'inline-block';
  inp.focus();
  inp.select();
}

function finishRename() {
  const disp = document.getElementById('fileName');
  const inp = document.getElementById('fileNameInput');
  const val = inp.value.trim() || 'New File.xlsx';
  disp.textContent = val;
  inp.style.display = 'none';
  disp.style.display = '';
  document.title = 'Mocksheets — ' + val;
}

// ═══════════════════════════════════════════════════════════════
//  SORT
// ═══════════════════════════════════════════════════════════════
function sortData() {
  const data = sheets[activeSheet];
  const col = selCol;
  const hasHeader = data[0][col] && isNaN(parseFloat(data[0][col]));
  const header = hasHeader ? data.shift() : null;
  data.sort((a, b) => {
    const va = parseFloat(a[col]), vb = parseFloat(b[col]);
    if (!isNaN(va) && !isNaN(vb)) return va - vb;
    return String(a[col]).localeCompare(String(b[col]), 'en');
  });
  if (header) data.unshift(header);
  buildGrid();
  toast(`${colLetter(col)} sütununa göre sıralandı`, 'ok');
}

// ═══════════════════════════════════════════════════════════════
//  FIND & REPLACE
// ═══════════════════════════════════════════════════════════════
function openFindReplace() {
  showModal(`
    <h2>Bul &amp; Değiştir</h2>
    <p>Aktif sayfa verisinde ara</p>
    <div class="fgroup">
      <label class="flabel">Aranacak Metin</label>
      <input class="finput" id="frFind" placeholder="Aranacak metin...">
    </div>
    <div class="fgroup">
      <label class="flabel">Değiştirilecek</label>
      <input class="finput" id="frReplace" placeholder="Yeni metin (silmek için boş bırakın)...">
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">İptal</button>
      <button class="btn btn-ghost" onclick="doFind()">Bul</button>
      <button class="btn btn-primary" onclick="doFindReplace()">Tümünü Değiştir</button>
    </div>
  `);
}

function doFind() {
  const q = document.getElementById('frFind').value.toLowerCase();
  if (!q) return;
  clearHighlights();
  const data = sheets[activeSheet];
  let found = 0;
  for (let r = 0; r < data.length; r++)
    for (let c = 0; c < COLS; c++)
      if (data[r] && String(data[r][c]).toLowerCase().includes(q)) {
        const td = getCell(r, c);
        if (td) td.classList.add('hi');
        found++;
      }
  closeModal();
  toast(`${found} hücre bulundu`, found ? 'ok' : 'err');
}

function doFindReplace() {
  const q = document.getElementById('frFind').value;
  const rep = document.getElementById('frReplace').value;
  if (!q) return;
  const data = sheets[activeSheet];
  let count = 0;
  for (let r = 0; r < data.length; r++)
    for (let c = 0; c < COLS; c++)
      if (data[r] && String(data[r][c]).includes(q)) {
        data[r][c] = data[r][c].replaceAll(q, rep);
        dirtyCells.add(r + '_' + c);
        const inp = getInput(r, c);
        if (inp) inp.value = data[r][c];
        count++;
      }
  closeModal();
  toast(`${count} hücre değiştirildi`, 'ok');
}

// ═══════════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ═══════════════════════════════════════════════════════════════
function openSettings() {
  const menu = document.getElementById('settingsMenu');
  if (!menu) return;
  const isOpen = menu.style.display !== 'none';
  if (isOpen) { menu.style.display = 'none'; return; }
  menu.style.display = 'block';
  setTimeout(() => {
    document.addEventListener('click', function handler(e) {
      if (!menu.contains(e.target) && !e.target.closest('.user-row')) {
        menu.style.display = 'none';
        document.removeEventListener('click', handler);
      }
    });
  }, 0);
}

function closeSettings() {
  const menu = document.getElementById('settingsMenu');
  if (menu) menu.style.display = 'none';
}

async function logOut() {
  const ok = window.confirm('Are you sure you want to log out?');
  if (!ok) return;
  if (window._sb) await window._sb.auth.signOut();
  window.location.href = 'auth.html';
}

function toggleTheme() {
  const isDark = document.body.classList.contains('dark');
  if (isDark) {
    document.body.classList.remove('dark');
    document.body.classList.add('light');
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  updateThemeIcon();
  const list = document.getElementById('templateList');
  if (list) { list.dataset.rendered = ''; renderTemplatePanel(); }
}

function updateThemeIcon() {
  const isDark = document.body.classList.contains('dark');
  const moonSVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>`;
  const sunSVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
  const btn = document.querySelector('.theme-toggle-pill');
  if (btn) btn.innerHTML = isDark ? `${sunSVG} Açık` : `${moonSVG} Koyu`;
}

function saveSettings() {
  apiKey = document.getElementById('apiKeyInput').value.trim();
  localStorage.setItem('openai_key', apiKey);
  closeModal();
  updateApiStatus();
  if (apiKey) {
    var _ob = document.getElementById('onboardBanner');
    if (_ob) _ob.classList.add('hidden');
    document.body.classList.remove('with-banner');
  }
  toast(apiKey ? t('toast_api_saved') : t('toast_api_cleared'), 'ok');
}

function updateApiStatus() {
  const el = document.getElementById('apiKeyStatus');
  if (el) el.innerHTML = `<span style="color:#f59e0b;">● Connecting…</span>`;
  fetch(API_URL + '/health', { method: 'GET' })
    .then(r => {
      if (el) el.innerHTML = r.ok
        ? `<span style="color:#16a34a;">● Connected</span>`
        : `<span style="color:#f59e0b;">● Limited</span>`;
    })
    .catch(() => {
      if (el) el.innerHTML = `<span style="color:#ef4444;">● Offline — yeniden dene</span>`;
    });
}

// ═══════════════════════════════════════════════════════════════
//  MODAL HELPER
// ═══════════════════════════════════════════════════════════════
function showModal(html) {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  overlay.id = 'modalOverlay';
  overlay.innerHTML = `<div class="modal">${html}</div>`;
  overlay.onclick = e => { if (e.target === overlay) closeModal(); };
  document.body.appendChild(overlay);
}

function closeModal() {
  const el = document.getElementById('modalOverlay');
  if (el) el.remove();
}

// ═══════════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════════
function toast(msg, type = 'ok', undoable = false) {
  const icons = {
    ok:   `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    err:  `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  while (container.children.length >= 3) container.firstChild.remove();
  const toastEl = document.createElement('div');
  toastEl.className = `toast ${type}`;
  const undoBtn = undoable ? `<button class="toast-undo" onclick="undo();this.closest('.toast').remove()">${t('undo')}</button>` : '';
  toastEl.innerHTML = `<div class="toast-bar"></div><div class="toast-body">${icons[type]||icons.ok}<span>${msg}</span>${undoBtn}</div>`;
  container.appendChild(toastEl);
  const hide = () => { toastEl.classList.add('leaving'); setTimeout(() => toastEl.remove(), 310); };
  setTimeout(hide, 3000);
}
function showToast(msg, type, undoable) { toast(msg, type, undoable); }

function undo() {
  if (!versionHistory || versionHistory.length < 2) { toast(t('toast_nothing_undo'), 'info'); return; }
  redoStack.push(versionHistory.shift());
  const prev = versionHistory[0];
  if (!prev?.snap) { toast(t('toast_nothing_undo'), 'info'); return; }
  sheets = JSON.parse(JSON.stringify(prev.snap.sheets));
  cellMeta = JSON.parse(JSON.stringify(prev.snap.cellMeta));
  activeSheet = prev.snap.activeSheet;
  buildGrid();
  if (typeof renderSheetTabs === 'function') renderSheetTabs();
  updateStatus();
  toast(t('toast_undone'), 'info');
}

function redo() {
  if (!redoStack || redoStack.length === 0) { toast(t('toast_nothing_redo'), 'info'); return; }
  const next = redoStack.pop();
  versionHistory.unshift(next);
  sheets = JSON.parse(JSON.stringify(next.snap.sheets));
  cellMeta = JSON.parse(JSON.stringify(next.snap.cellMeta));
  activeSheet = next.snap.activeSheet;
  buildGrid();
  if (typeof renderSheetTabs === 'function') renderSheetTabs();
  updateStatus();
  toast(t('toast_redone'), 'info');
}

// ═══════════════════════════════════════════════════════════════
//  ZOOM
// ═══════════════════════════════════════════════════════════════
let zoomLevel = 100;
function changeZoom(delta) {
  zoomLevel = Math.max(50, Math.min(200, zoomLevel + delta));
  document.getElementById('zoomLabel').textContent = zoomLevel + '%';
  document.getElementById('gridWrap').style.fontSize = (zoomLevel / 100) + 'em';
}

// ═══════════════════════════════════════════════════════════════
//  TOPBAR BADGE PULSE + AI TRACKING
// ═══════════════════════════════════════════════════════════════
let aiActionCount = 0;

function pulseMetricBadge(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('pulse');
  void el.offsetWidth; // trigger reflow
  el.classList.add('pulse');
  setTimeout(() => el.classList.remove('pulse'), 650);
}

function notifyAIAction(desc) {
  aiActionCount++;
  document.getElementById('mbAI').textContent = '🤖 ' + aiActionCount + ' actions';
  const sbEl = document.getElementById('sbLastAI');
  if (sbEl) sbEl.textContent = t('last_ai') + ': AI · ' + (desc.length > 22 ? desc.substring(0, 22) + '…' : desc);
  pulseMetricBadge('mbAI');
  pulseMetricBadge('mbCells');
}

// Hook applyAISuggestions to track AI actions without modifying the function directly
const _origApplyAI = applyAISuggestions;
function applyAISuggestions(msg, reply) {
  _origApplyAI(msg, reply);
  const shortMsg = msg.length > 22 ? msg.substring(0, 22) + '…' : msg;
  notifyAIAction(shortMsg);
  addHistory('ai', 'AI: ' + shortMsg);
}

// ═══════════════════════════════════════════════════════════════
//  CHAT
// ═══════════════════════════════════════════════════════════════
function getSheetContext() {
  const data = sheets[activeSheet];
  if (!data) return '(Veri yok)';

  const headers = data[0] || [];
  const colLetters = headers.map(function(_, i) { return String.fromCharCode(65 + i); }).join(',');
  const totalRows = Math.max(0, data.length - 1);
  const meta = 'Sütun harfleri: ' + colLetters + '\nToplam: ' + totalRows + ' satır, ' + headers.length + ' sütun';

  const rows = [];
  let count = 0;
  const maxRows = 50;

  for (let r = 0; r < data.length && count < maxRows; r++) {
    const row = data[r].slice(0, 10);
    // Boş veri satırlarını atla (header satırını koru)
    if (r > 0 && !row.some(function(cell) { return cell !== '' && cell !== null && cell !== undefined; })) continue;
    rows.push(row.join(','));
    count++;
  }

  return meta + '\n\n' + (rows.join('\n') || '(Veri yok)');
}

function chatKeydown(e) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
}

function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 160) + 'px';
}

function useChip(el) {
  document.getElementById('chatInput').value = el.textContent;
  sendChat();
}

function handleChatFile(input) {
  const files = Array.from(input.files);
  if (!files.length) return;
  files.forEach(file => {
    if (file.size > 5 * 1024 * 1024) { toast('File too large (max 5MB)', 'err'); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      const att = { name: file.name, type: file.type, size: file.size, data: e.target.result, file };
      chatAttachments.push(att);
      renderChatAttachment(att);
    };
    if (file.type.startsWith('image/')) reader.readAsDataURL(file);
    else reader.readAsArrayBuffer(file);
  });
  input.value = '';
}

function renderChatAttachment(att) {
  const preview = document.getElementById('chatAttachPreview');
  if (!preview) return;
  preview.style.display = 'flex';
  const item = document.createElement('div');
  item.style.cssText = 'display:flex;align-items:center;gap:6px;background:rgba(249,115,22,0.12);border:1px solid rgba(249,115,22,0.25);border-radius:8px;padding:4px 10px;font-size:12px;color:#f97316;font-weight:500;';
  let icon = '📎';
  if (att.name.match(/\.(xlsx|xls|csv)$/i)) icon = '📊';
  else if (att.name.match(/\.(png|jpg|jpeg)$/i)) icon = '🖼️';
  else if (att.name.match(/\.pdf$/i)) icon = '📄';
  item.dataset.attName = att.name;
  item.innerHTML = `<span>${icon}</span><span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escHtml(att.name)}</span><button data-name="${escHtml(att.name)}" style="background:none;border:none;cursor:pointer;color:#f97316;font-size:14px;padding:0;line-height:1;">×</button>`;
  item.querySelector('button').addEventListener('click', function() { removeChatAttachment(this.dataset.name); });
  preview.appendChild(item);
}

function removeChatAttachment(name) {
  chatAttachments = chatAttachments.filter(a => a.name !== name);
  const preview = document.getElementById('chatAttachPreview');
  if (!preview) return;
  const item = preview.querySelector(`[data-att-name="${CSS.escape(name)}"]`);
  if (item) item.remove();
  if (!preview.children.length) preview.style.display = 'none';
}

function clearChatAttachments() {
  chatAttachments = [];
  const preview = document.getElementById('chatAttachPreview');
  if (preview) { preview.innerHTML = ''; preview.style.display = 'none'; }
}

async function buildMessageWithAttachments(userMessage) {
  if (!chatAttachments.length) return userMessage;
  let fullMessage = userMessage;
  for (const att of chatAttachments) {
    if (att.name.match(/\.(xlsx|xls|csv)$/i)) {
      try {
        const wb = XLSX.read(att.data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const csv = XLSX.utils.sheet_to_csv(ws);
        const lines = csv.split('\n').slice(0, 50).join('\n');
        fullMessage = `Ek dosya: ${att.name}\n${lines}\n\n${userMessage}`;
      } catch(e) { console.warn('Attachment parse error:', e); }
    }
  }
  return fullMessage;
}

async function sendChat() {
  if (!checkCommandLimit()) return;
  if (isProcessing) { console.log('[Guard] sendChat engellendi — işlem devam ediyor'); return; }
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg && !chatAttachments.length) return;
  isProcessing = true;
  input.value = '';
  input.style.height = '34px';

  const displayMsg = msg || chatAttachments.map(a => `📎 ${a.name}`).join(', ');
  addMsg('user', escHtml(displayMsg));
  const finalMessage = await buildMessageWithAttachments(msg);
  chatHistory.push({role: 'user', content: finalMessage});
  clearChatAttachments();

  // Loading state
  const _fcSubtitle  = document.getElementById('fcSubtitle');
  const _fcSendIcon  = document.getElementById('fcSendIcon');
  const _fcSpinner   = document.getElementById('fcSpinner');
  const _chatInputEl = document.getElementById('chatInput');
  if (_fcSubtitle) { _fcSubtitle.textContent = 'AI thinking...'; _fcSubtitle.classList.add('loading'); }
  if (_fcSendIcon)  _fcSendIcon.style.display  = 'none';
  if (_fcSpinner)   _fcSpinner.style.display   = 'block';
  if (_chatInputEl) _chatInputEl.disabled = true;

  // Rotating loading messages
  const _loadMsgs = [
    'Analyzing table...',
    'Computing changes...',
    'Applying results...',
    'Processing data...',
    'Preparing response...'
  ];
  const loader = addMsg('ai', _loadMsgs[0]);
  const _loaderBubble = loader.querySelector('.mbubble');
  _loaderBubble.style.cssText = 'color:#94a3b8;font-style:italic;white-space:pre-wrap;';
  let _loadIdx = 0;
  const _loadTimer = setInterval(() => {
    _loadIdx = (_loadIdx + 1) % _loadMsgs.length;
    _loaderBubble.textContent = _loadMsgs[_loadIdx];
  }, 2000);

  try {
    let reply;
    if (typeof processAICommand === 'function') {
      console.warn('[CALL #' + (++CALL_COUNTER) + '] sendChat → processAICommand', new Error().stack.split('\n')[2]?.trim());
      const aiResult = await processAICommand(finalMessage, sheets[activeSheet] || [], activeSheet, chatHistory.slice(-8));
      if (!aiResult || aiResult?.error === 'offline') {
        clearInterval(_loadTimer);
        loader.remove();
        if (typeof showToast === 'function') showToast('⚡ AI feature coming soon!', 'info');
        return;
      }
      reply = typeof aiResult === 'string' ? aiResult : (aiResult.reply || 'Done');
      applyAIChanges(aiResult);
      if (window.Automations) window.Automations.evaluate(sheets[activeSheet]);
    } else {
      await new Promise(r => setTimeout(r, 900));
      reply = generateLocalReply(msg);
    }
    clearInterval(_loadTimer);
    _loaderBubble.style.cssText = 'white-space:pre-wrap;';
    _loaderBubble.textContent = reply;
    chatHistory.push({role: 'assistant', content: reply});
    saveChatHistory();

    // Apply AI suggestions to grid if applicable
    applyAISuggestions(msg, reply);
  } catch(err) {
    clearInterval(_loadTimer);
    loader.remove();
    if (err.status === 429 && typeof showLimitModal === 'function') {
      showLimitModal(err.data || {});
    } else if (err.status === 403 && err.data?.code === 'FEATURE_NOT_AVAILABLE' && typeof handleLockedFeature === 'function') {
      handleLockedFeature(err.data.feature);
    } else {
      if (typeof addMsg === 'function') addMsg('ai', '❌ ' + (err.message || 'Bir hata oluştu'));
    }
  } finally {
    isProcessing = false;
    if (_fcSubtitle) { _fcSubtitle.textContent = 'Online'; _fcSubtitle.classList.remove('loading'); }
    if (_fcSendIcon)  _fcSendIcon.style.display  = '';
    if (_fcSpinner)   _fcSpinner.style.display   = 'none';
    if (_chatInputEl) { _chatInputEl.disabled = false; _chatInputEl.focus(); }
  }

  const msgs = document.getElementById('chatMsgs');
  setTimeout(() => msgs.scrollTo({top: msgs.scrollHeight, behavior: 'smooth'}), 0);
}

async function callOpenAI(userMsg) {
  const sheetCtx = getSheetContext();
  const system = `You are a Shopify catalog AI assistant. Analyze the user's catalog data, suggest improvements, and provide insights.
Active sheet: "${activeSheet}"
First 20 rows, 10 columns of data:
${sheetCtx}

Kısa ve net Türkçe yanıtlar ver. Formül önerileri için standart Google Sheets formatını kullan (=TOPLA(), =ORTALAMA(), =SUM(), =AVERAGE(), vb.).`;

  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}`},
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {role: 'system', content: system},
        ...chatHistory.slice(-8)
      ],
      max_tokens: 500,
      temperature: 0.7
    })
  });
  if (!resp.ok) throw new Error(`API Error: ${resp.status}`);
  const data = await resp.json();
  return data.choices[0].message.content;
}

function generateLocalReply(msg) {
  const data = sheets[activeSheet];
  const lower = msg.toLowerCase();
  const loc = currentLang === 'tr' ? 'tr-TR' : 'en-US';

  if (lower.includes('analiz') || lower.includes('analyze') || lower.includes('incele')) {
    let filled = 0, numeric = 0, total = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (data[r][c]) { filled++; const v = parseFloat(data[r][c]); if (!isNaN(v)) { numeric++; total += v; } }
      }
    return tpl('local_analysis_tpl', {
      sheet: activeSheet,
      filled: filled,
      numeric: numeric,
      sum: total.toLocaleString(loc, {maximumFractionDigits:2}),
      avg: numeric ? (total/numeric).toLocaleString(loc, {maximumFractionDigits:2}) : t('local_na')
    });
  }

  if (lower.includes('formül') || lower.includes('formula')) {
    return t('local_formula');
  }

  if (lower.includes('toplam') || lower.includes('sum')) {
    let total = 0, count = 0;
    for (let r = 0; r < ROWS; r++) {
      const v = parseFloat(data[r][selCol]);
      if (!isNaN(v)) { total += v; count++; }
    }
    return tpl('local_sum_tpl', {
      col: colLetter(selCol),
      total: total.toLocaleString(loc, {maximumFractionDigits:2}),
      count: count
    });
  }

  if (lower.includes('empty') || lower.includes('clean') || lower.includes('delete') || lower.includes('remove') || lower.includes('boş') || lower.includes('temiz')) {
    return t('local_empty');
  }

  if (lower.includes('grafik') || lower.includes('chart')) {
    return t('local_chart');
  }

  if (lower.includes('pivot')) {
    return t('local_pivot');
  }

  return t('local_default');
}

function refreshGrid() {
  const d = sheets[activeSheet];
  if (typeof buildGrid === 'function') {
    buildGrid(d);
    console.log('[GRID] buildGrid çağrıldı, satır:', d ? d.length : 0);
  } else {
    console.error('[GRID] buildGrid bulunamadı!');
  }
}

function applyAIChanges(result) {
  console.group('%c[applyAIChanges]', 'color:#4F46E5;font-weight:bold');
  console.log('result:', JSON.stringify(result));
  console.log('activeSheet:', activeSheet);
  console.log('sheets[activeSheet] rows:', sheets[activeSheet]?.length);
  console.log('sheets[activeSheet][0]:', sheets[activeSheet]?.[0]);
  console.groupEnd();

  const data = sheets[activeSheet];

  // Supabase sistem tablosu verisi yanlışlıkla yüklenmiş mi?
  const _headers = (data && data[0]) ? data[0] : [];
  const _isSystemData = _headers.some(h =>
    ['schemaname', 'tablename', 'policyname', 'grantee', 'privilege_type'].includes(
      String(h).toLowerCase()
    )
  );
  if (_isSystemData) {
    console.error('[applyAIChanges] Sistem verisi algılandı — dosya yüklenmemiş!');
    if (typeof showToast === 'function') showToast('⚠️ Lütfen önce bir katalog dosyası yükleyin', 'error');
    return;
  }

  if (!data || !data.length) {
    if (typeof showToast === 'function') showToast('Önce veri yükleyin', 'error');
    return;
  }
  console.log('[AI] action:', result && result.action, '| activeSheet:', activeSheet);
  if (!result || typeof result !== 'object') { console.warn('[AI] geçersiz result'); return; }

  // ── changes[] — field alias desteği (row/r, col/c/column, value/v/val) ──
  if (Array.isArray(result.changes) && result.changes.length > 0) {
    result.changes.forEach(function(ch) {
      const r = ch.row !== undefined ? ch.row : ch.r;
      const c = ch.col !== undefined ? ch.col : (ch.c !== undefined ? ch.c : ch.column);
      const v = ch.value !== undefined ? ch.value : (ch.v !== undefined ? ch.v : ch.val);
      if (r === undefined || c === undefined || v === undefined) return;
      while (data.length <= r) data.push([]);
      while (data[r].length <= c) data[r].push('');
      data[r][c] = String(v);
    });
  }

  // ── highlight[] — getCellMeta/setCellMeta kullan (cellMeta[sheet][r_c] yapısı) ──
  if (Array.isArray(result.highlight) && result.highlight.length > 0) {
    result.highlight.forEach(function(h) {
      const r = h.row !== undefined ? h.row : h.r;
      const c = h.col !== undefined ? h.col : h.c;
      if (r === undefined || c === undefined) return;
      const meta = getCellMeta(r, c);
      meta.bg = h.color || h.bg || '#fef08a';
      setCellMeta(r, c, meta);
    });
  }

  // ── action dispatch ───────────────────────────────────────────────────────
  switch (result.action) {
    case 'sort': {
      sortColumn(result.column || result.source_column || 0, result.direction || 'asc');
      return;
    }
    case 'update_cells':    applyUpdateCellsAction(result); return;
    case 'highlight':       applyHighlightAction(result);   return;
    case 'sum':             applySumAction(result);          return;
    case 'average':         applyAverageAction(result);      return;
    case 'transform':       applyTransformAction(result);    return;
    case 'delete_rows': {
      const cond = (result.condition || '').toLowerCase();
      if (cond.includes('duplicate') || cond.includes('tekrar')) {
        cmdRemoveDuplicates();
      } else {
        cmdCleanEmptyRows();
      }
      return;
    }
    case 'remove_duplicates':
      if (result.changes && result.changes.length > 0) refreshGrid();
      cmdRemoveDuplicates();
      return;
    case 'filter': {
      const headers2 = data[0];
      const val = result.value || '';
      const cond = (result.condition || '').toLowerCase();
      let filtered = data.slice(1);
      if (val) {
        filtered = filtered.filter(function(row) {
          return (row || []).some(function(cell) {
            return String(cell != null ? cell : '').toLowerCase().includes(val.toLowerCase());
          });
        });
      } else if (/[<>]/.test(cond)) {
        const m = cond.match(/([<>]=?)\s*(\d+)/);
        if (m) {
          const op = m[1], th = parseFloat(m[2]);
          filtered = filtered.filter(function(row) {
            return (row || []).some(function(cell) {
              const n = parseFloat(String(cell != null ? cell : ''));
              if (isNaN(n)) return false;
              if (op === '>')  return n > th;
              if (op === '<')  return n < th;
              if (op === '>=') return n >= th;
              if (op === '<=') return n <= th;
              return false;
            });
          });
        }
      }
      if (!sheets[activeSheet + '_backup']) {
        sheets[activeSheet + '_backup'] = data.slice();
      }
      sheets[activeSheet] = [headers2].concat(filtered);
      refreshGrid();
      if (typeof showToast === 'function') showToast((result.reply || '✓ Filtrelendi') + ' (' + filtered.length + ' satır)', 'success');
      return;
    }
    case 'remove_filter': {
      var backup = sheets[activeSheet + '_backup'];
      if (backup) {
        sheets[activeSheet] = backup;
        delete sheets[activeSheet + '_backup'];
        refreshGrid();
        if (typeof showToast === 'function') showToast('✓ Filtre kaldırıldı', 'success');
      }
      return;
    }
    case 'sentiment_analysis': doSentimentAnalysis(result); return;
    case 'classify':           doClassify(result);          return;
    case 'explain':            doExplain(result);           return;
    case 'anomaly_detection':  doAnomalyDetection(result);  return;
    case 'forecast':           doForecast(result);          return;
    case 'heatmap':            doHeatmap(result);           return;
    case 'extract':            doExtract(result);           return;
    case 'group_by':           doGroupBy(result);           return;
    case 'compare':            doCompare(result);           return;
    case 'batch_ai':           doBatchAI(result);           return;
    case 'clean_data':         doCleanData(result);         return;
    case 'generate_formula':   doGenerateFormula(result);   return;
    case 'clear_colors': {
      const sheet = sheets[activeSheet];
      if (sheet) {
        for (let r = 0; r < sheet.length; r++) {
          for (let c = 0; c < (sheet[r] || []).length; c++) {
            highlightCell(r, c, '');
          }
        }
        buildGrid(sheet);
      }
      if (typeof showToast === 'function') showToast(result.reply || '✓ Renkler temizlendi', 'success');
      return;
    }
    default:
      break;
  }

  // changes varsa grid'i yenile
  if (result.changes && result.changes.length > 0) {
    refreshGrid();
    if (typeof showToast === 'function') showToast(result.reply || '✓ Güncellendi', 'success');
  }

  // AI değişikliği sonrası otomasyon kurallarını değerlendir
  setTimeout(function() {
    if (window.Automations && window.Automations.evaluate) window.Automations.evaluate(sheets[activeSheet]);
  }, 100);
}

function applyUpdateCellsAction(data) {
  const sheet = sheets[activeSheet];
  if (!sheet || sheet.length < 2) return;

  const headers = sheet[0] || [];
  let colIndex = -1;

  const col = data.column || data.source_column;
  if (col) {
    if (/^[A-Za-z]$/.test(col)) {
      colIndex = col.toUpperCase().charCodeAt(0) - 65;
    } else {
      colIndex = headers.findIndex(function(h) {
        return h && h.toString().toLowerCase().includes(col.toLowerCase());
      });
    }
  }

  // Sütun bulunamazsa tüm sayısal sütunları işle
  const targetCols = colIndex >= 0 ? [colIndex]
    : headers.map(function(_, i) { return i; }).filter(function(i) {
        const sample = sheet.slice(1, 4).map(function(r) { return r[i]; });
        return sample.some(function(v) { return !isNaN(parseFloat(String(v || '').replace(',', '.'))); });
      });

  let changed = 0;
  // Formula alias normalize
  let formula = (data.formula || '').toLowerCase()
    .replace('add_vat', 'vat').replace('kdv', 'vat');
  // KDV factor'ı her zaman 1.20 zorla
  let factor = parseFloat(data.factor) || 1;
  if (formula === 'multiply' && (factor === 1.18 || factor === 0)) factor = 1.20;

  for (let r = 1; r < sheet.length; r++) {
    for (let ci = 0; ci < targetCols.length; ci++) {
      const c = targetCols[ci];
      const raw = sheet[r][c];
      const num = parseFloat(String(raw || '').replace(',', '.'));
      if (isNaN(num)) continue;

      let newVal = num;
      if (formula === 'multiply') newVal = num * factor;
      else if (formula === 'divide') newVal = num / factor;
      else if (formula === 'vat') newVal = num * 1.20;
      else if (formula === 'vat_amount') newVal = num * 0.20;
      else if (formula === 'net_salary') newVal = num * 0.85;
      else if (formula === 'sgk_deduction') newVal = num * 0.14;
      else if (formula === 'income_tax') newVal = num * 0.15;
      else if (formula === 'percentage' && data.value) newVal = num * (1 + parseFloat(data.value) / 100);
      else if (factor !== 1) newVal = num * factor;

      sheet[r][c] = parseFloat(newVal.toFixed(2)).toString();
      changed++;
    }
  }

  console.log('[UPDATE_CELLS] değiştirilen hücre:', changed);
  refreshGrid();
  if (typeof showToast === 'function') {
    if (changed === 0) {
      showToast('⚠️ Sayısal veri bulunamadı. Önce tabloya veri girin.', 'error');
    } else {
      showToast((data.reply || '✓ Değerler güncellendi') + ' (' + changed + ' hücre)', 'success');
    }
  }
}

function applyHighlightAction(data) {
  const sheet = sheets[activeSheet];
  if (!sheet || !sheet.length) return;

  const headers = sheet[0] || [];
  const color = data.color || '#fef08a';
  const condition = data.condition || '';

  let targetCol = -1;
  if (data.column) {
    if (/^[A-Za-z]$/.test(data.column)) {
      targetCol = data.column.toUpperCase().charCodeAt(0) - 65;
    } else {
      targetCol = headers.findIndex(function(h) {
        return h && h.toString().toLowerCase().includes(data.column.toLowerCase());
      });
    }
  }

  // top5/top10 için önce büyük değerleri bul
  var topValues = new Set();
  if (/^top(\d+)$/.test(condition)) {
    const n = parseInt(condition.replace('top', ''));
    const allNums = [];
    for (let r = 1; r < sheet.length; r++) {
      const cols = targetCol >= 0 ? [targetCol] : headers.map(function(_, i) { return i; });
      cols.forEach(function(c) {
        const v = parseFloat(String(sheet[r][c] || '').replace(',', '.'));
        if (!isNaN(v)) allNums.push(v);
      });
    }
    allNums.sort(function(a, b) { return b - a; }).slice(0, n).forEach(function(v) { topValues.add(v); });
  }

  // Mevcut sheet'teki tüm bg renklerini sıfırla (bold/italic/diğer meta korunur)
  if (cellMeta[activeSheet]) {
    Object.keys(cellMeta[activeSheet]).forEach(function(key) {
      if (cellMeta[activeSheet][key]) delete cellMeta[activeSheet][key].bg;
    });
  }

  let highlighted = 0;
  for (let r = 1; r < sheet.length; r++) {
    const cols = targetCol >= 0 ? [targetCol] : headers.map(function(_, i) { return i; });
    cols.forEach(function(c) {
      const raw = sheet[r][c];
      const num = parseFloat(String(raw || '').replace(',', '.'));
      let match = false;

      if (condition === 'negative' || condition === 'value < 0' || condition === 'negatif' || condition === 'isnegative' || condition === 'eksi' || condition === 'minus') match = !isNaN(num) && num < 0;
      else if (condition === 'positive' || condition === 'value > 0' || condition === 'pozitif' || condition === 'ispositive' || condition === 'artı') match = !isNaN(num) && num > 0;
      else if (condition === 'high') match = !isNaN(num) && num > 0;
      else if (condition === 'sıfır' || condition === 'zero' || condition === 'value == 0') match = !isNaN(num) && num === 0;
      else if (/^top\d+$/.test(condition)) match = topValues.has(num);
      else if (condition.startsWith('value >')) {
        const threshold = parseFloat(condition.replace('value >', '').trim());
        match = !isNaN(num) && !isNaN(threshold) && num > threshold;
      } else if (condition.startsWith('value <')) {
        const threshold = parseFloat(condition.replace('value <', '').trim());
        match = !isNaN(num) && !isNaN(threshold) && num < threshold;
      }

      if (match) {
        const meta = getCellMeta(r, c);
        meta.bg = color;
        setCellMeta(r, c, meta);
        highlighted++;
      }
    });
  }

  console.log('[HIGHLIGHT] renklendirilen hücre:', highlighted);
  refreshGrid();
  if (typeof showToast === 'function')
    showToast((data.reply || '✓ Renklendirme tamamlandı') + ' (' + highlighted + ' hücre)', 'success');
}

function applySumAction(data) {
  const sheet = sheets[activeSheet];
  if (!sheet || !sheet.length) return;

  const headers = sheet[0] || [];
  const rows = sheet.slice(1);

  let colIndex = 1;
  if (data.column) {
    if (/^[A-Za-z]$/.test(data.column)) {
      colIndex = data.column.toUpperCase().charCodeAt(0) - 65;
    } else {
      const idx = headers.findIndex(h => h && h.toString().toLowerCase().includes(data.column.toLowerCase()));
      if (idx >= 0) colIndex = idx;
    }
  }

  let total = 0;
  rows.forEach(function(row) {
    const val = row[colIndex];
    const num = parseFloat(String(val || '').replace(',', '.'));
    if (!isNaN(num)) total += num;
  });

  const formatted = total.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  if (typeof showToast === 'function') showToast((data.reply || '✓ Toplam') + ': ' + formatted, 'success');
}

function applyAverageAction(data) {
  const sheet = sheets[activeSheet];
  if (!sheet || !sheet.length) return;

  const headers = sheet[0] || [];
  const rows = sheet.slice(1);

  let colIndex = 1;
  if (data.column) {
    if (/^[A-Za-z]$/.test(data.column)) {
      colIndex = data.column.toUpperCase().charCodeAt(0) - 65;
    } else {
      const idx = headers.findIndex(h => h && h.toString().toLowerCase().includes(data.column.toLowerCase()));
      if (idx >= 0) colIndex = idx;
    }
  }

  const nums = rows
    .map(function(r) { return parseFloat(String(r[colIndex] || '').replace(',', '.')); })
    .filter(function(n) { return !isNaN(n); });

  if (!nums.length) { if (typeof showToast === 'function') showToast('⚠️ Sayısal veri bulunamadı', 'error'); return; }

  const avg = nums.reduce(function(a, b) { return a + b; }, 0) / nums.length;
  const formatted = avg.toLocaleString('tr-TR', { maximumFractionDigits: 2 });
  if (typeof showToast === 'function') showToast((data.reply || '✓ Ortalama') + ': ' + formatted, 'success');
}

function applyTransformAction(data) {
  const sheet = sheets[activeSheet];
  if (!sheet || !sheet.length) return;

  const transform = data.transform;
  let changed = 0;

  for (let r = 1; r < sheet.length; r++) {
    for (let c = 0; c < (sheet[r] || []).length; c++) {
      const val = sheet[r][c];
      if (typeof val === 'string' && val.trim()) {
        if (transform === 'uppercase') { sheet[r][c] = val.toUpperCase(); changed++; }
        else if (transform === 'lowercase') { sheet[r][c] = val.toLowerCase(); changed++; }
        else if (transform === 'trim') { sheet[r][c] = val.trim(); changed++; }
      }
    }
  }

  console.log('[TRANSFORM] değiştirilen hücre:', changed);
  refreshGrid();
  if (typeof showToast === 'function') showToast((data.reply || '✓ Dönüşüm tamamlandı') + ' (' + changed + ' hücre)', 'success');
}

// Debug helper — test an AI action manually from browser console
// Usage: _testAction({ action: 'sort', column: 'fiyat', direction: 'asc' })
window._testAction = function(result) { applyAIChanges(result); };

function setCell(row, col, value) {
  const data = sheets[activeSheet];
  if (!data) return;
  while (data.length <= row) data.push(Array(COLS).fill(''));
  while (data[row].length <= col) data[row].push('');
  data[row][col] = value !== undefined ? String(value) : '';
}

function highlightCell(row, col, color) {
  const meta = getCellMeta(row, col);
  meta.bg = color || '';
  setCellMeta(row, col, meta);
}

function sortColumn(col, direction) {
  const data = sheets[activeSheet];
  if (!data || data.length < 2) return;

  const headers = data[0] || [];

  // col string ise → index'e çevir
  let colIdx = col;
  if (typeof col === 'string') {
    if (/^[A-Za-z]$/.test(col.trim())) {
      colIdx = col.toUpperCase().charCodeAt(0) - 65;
    } else {
      let idx = headers.findIndex(function(h) {
        return h && h.toString().toLowerCase() === col.toLowerCase();
      });
      if (idx < 0) idx = headers.findIndex(function(h) {
        return h && h.toString().toLowerCase().includes(col.toLowerCase());
      });
      colIdx = idx >= 0 ? idx : 0;
    }
  }

  const dir = direction || 'asc';
  const rows = data.slice(1).filter(function(r) {
    return r && r.some(function(c) { return c !== '' && c !== null && c !== undefined; });
  });

  rows.sort(function(a, b) {
    const va = String(a[colIdx] ?? '').replace(/[,₺$\s%]/g, '');
    const vb = String(b[colIdx] ?? '').replace(/[,₺$\s%]/g, '');
    const na = parseFloat(va), nb = parseFloat(vb);
    if (!isNaN(na) && !isNaN(nb)) return dir === 'asc' ? na - nb : nb - na;
    const cmp = va.toLowerCase().localeCompare(vb.toLowerCase(), 'tr', { sensitivity: 'base' });
    return dir === 'asc' ? cmp : -cmp;
  });

  sheets[activeSheet] = [headers].concat(rows);
  buildGrid(sheets[activeSheet]);
  const dirText = dir === 'asc' ? '↑ küçükten büyüğe' : '↓ büyükten küçüğe';
  if (typeof showToast === 'function') showToast('✓ Sıralandı: ' + dirText, 'success');
  console.log('[sortColumn] col:', colIdx, 'dir:', dir, 'rows:', rows.length);
}

function deleteEmptyRows() { cmdCleanEmptyRows(); }
function removeDuplicates() { cmdRemoveDuplicates(); }

function applyAISuggestions(msg, reply) {
  // Highlight cells if AI mentions cell ranges
  const rangeMatch = reply.match(/([A-Z]\d+):([A-Z]\d+)/);
  if (rangeMatch) {
    const [, from, to] = rangeMatch;
    const fc = from.charCodeAt(0) - 65, fr = parseInt(from.slice(1)) - 1;
    const tc = to.charCodeAt(0) - 65, tr = parseInt(to.slice(1)) - 1;
    for (let r = fr; r <= Math.min(tr, ROWS-1); r++)
      for (let c = fc; c <= Math.min(tc, COLS-1); c++) {
        const td = getCell(r, c);
        if (td) td.classList.add('hi');
      }
  }
}

function addMsg(role, html) {
  const msgs = document.getElementById('chatMsgs');
  if (!msgs) return;
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  const initials = role === 'ai' ? 'AI' : t('ui_you');
  el.innerHTML = `
    <div class="mavatar ${role}">${initials}</div>
    <div class="mbubble">${html}</div>
  `;
  // Newline support
  if (typeof html === 'string' && !html.includes('<')) {
    el.querySelector('.mbubble').style.whiteSpace = 'pre-wrap';
  }
  // User bubble → click to copy back to input
  if (role === 'user') {
    const bubble = el.querySelector('.mbubble');
    bubble.style.cursor = 'pointer';
    bubble.title = 'Click to resend';
    bubble.addEventListener('click', () => {
      const inp = document.getElementById('chatInput');
      inp.value = typeof html === 'string' ? html : bubble.textContent.trim();
      inp.focus();
      autoResize(inp);
    });
  }
  msgs.appendChild(el);
  msgs.scrollTo({top: msgs.scrollHeight, behavior: 'smooth'});
  return el;
}

function clearChat() {
  document.getElementById('chatMsgs').innerHTML = '';
  chatHistory = [];
  localStorage.removeItem('chat_history');
  addWelcomeMsg();
}

function addWelcomeMsg() {
  addMsg('ai', t('welcome_msg'));
}

function saveChatHistory() {
  try { localStorage.setItem('chat_history', JSON.stringify(chatHistory)); } catch(e) {}
}

function loadChatHistory() {
  try {
    const saved = localStorage.getItem('chat_history');
    if (!saved) return false;
    const history = JSON.parse(saved);
    if (!Array.isArray(history) || !history.length) return false;
    chatHistory = history;
    history.forEach(m => addMsg(m.role === 'user' ? 'user' : 'ai', m.content));
    return true;
  } catch(e) { return false; }
}

// ═══════════════════════════════════════════════════════════════
//  KEYBOARD GLOBAL
// ═══════════════════════════════════════════════════════════════
document.addEventListener('keydown', e => {
  // Ctrl+K → command palette (anywhere)
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    openCmdPalette();
    return;
  }
  // Global shortcuts when not in input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
  if (e.key === 'Escape') closeModal();
});

// ═══════════════════════════════════════════════════════════════
//  COMMAND PALETTE
// ═══════════════════════════════════════════════════════════════
const CMD_DEFS = [
  // ⚡ Quick Actions
  {group:'cmd_group_quick', name:'cmd_sum_range',      shortcut:'Ctrl+Shift+T', icon:'sum',      action:'sumSelection'},
  {group:'cmd_group_quick', name:'cmd_sort_table',     shortcut:'Ctrl+Shift+S', icon:'sort',     action:'sortData'},
  {group:'cmd_group_quick', name:'cmd_remove_empty',   shortcut:'',             icon:'clean',    action:'cleanEmptyRows'},
  {group:'cmd_group_quick', name:'cmd_remove_dup',     shortcut:'',             icon:'dedup',    action:'removeDuplicates'},
  // 🤖 AI Commands
  {group:'cmd_group_ai',    name:'cmd_analyze_range',  shortcut:'',             icon:'ai',       action:'aiAnalyze'},
  {group:'cmd_group_ai',    name:'cmd_auto_chart',     shortcut:'',             icon:'chart',    action:'aiChart'},
  {group:'cmd_group_ai',    name:'cmd_summarize',      shortcut:'',             icon:'summary',  action:'aiSummary'},
  {group:'cmd_group_ai',    name:'cmd_suggest_formula',shortcut:'',             icon:'formula',  action:'aiFormula'},
  // 📁 File
  {group:'cmd_group_file',  name:'cmd_upload',         shortcut:'Ctrl+O',       icon:'upload',   action:'triggerUpload'},
  {group:'cmd_group_file',  name:'cmd_download',       shortcut:'Ctrl+S',       icon:'download', action:'downloadFile'},
  {group:'cmd_group_file',  name:'cmd_new_file',       shortcut:'Ctrl+N',       icon:'new',      action:'newFile'},
];

const CMD_ICONS = {
  sum:      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
  sort:     `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  clean:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>`,
  dedup:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
  ai:       `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 8v4l3 3"/><circle cx="19" cy="5" r="3"/></svg>`,
  chart:    `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  summary:  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="19" y2="18"/></svg>`,
  formula:  `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="15" x2="20" y2="15"/><line x1="10" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="14" y2="21"/></svg>`,
  upload:   `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  download: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  new:      `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>`,
};

let cmdFocusIdx = -1;
let cmdVisible  = false;
let cmdFiltered = [];

function openCmdPalette() {
  if (cmdVisible) return;
  cmdVisible = true;
  const overlay = document.getElementById('cmdOverlay');
  const input   = document.getElementById('cmdInput');
  overlay.classList.add('open');
  input.value = '';
  cmdFocusIdx = -1;
  cmdRender(CMD_DEFS, '');
  // Defer focus so transition plays
  requestAnimationFrame(() => input.focus());
}

function closeCmdPalette() {
  if (!cmdVisible) return;
  cmdVisible = false;
  document.getElementById('cmdOverlay').classList.remove('open');
  document.getElementById('cmdInput').blur();
}

function cmdClickOutside(e) {
  if (e.target === document.getElementById('cmdOverlay')) closeCmdPalette();
}

function cmdKeydown(e) {
  const items = document.querySelectorAll('.cmd-item');
  if (e.key === 'Escape')     { closeCmdPalette(); return; }
  if (e.key === 'ArrowDown')  { e.preventDefault(); cmdMoveFocus(1,  items); return; }
  if (e.key === 'ArrowUp')    { e.preventDefault(); cmdMoveFocus(-1, items); return; }
  if (e.key === 'Enter')      { e.preventDefault(); cmdRunFocused(); return; }
}

function cmdMoveFocus(dir, items) {
  if (!items.length) return;
  items[cmdFocusIdx]?.classList.remove('focused');
  cmdFocusIdx = Math.max(0, Math.min(items.length - 1, cmdFocusIdx + dir));
  const el = items[cmdFocusIdx];
  el.classList.add('focused');
  el.scrollIntoView({block:'nearest'});
}

function cmdRunFocused() {
  const items = document.querySelectorAll('.cmd-item');
  const target = items[cmdFocusIdx] ?? items[0];
  if (target) { target.click(); }
}

function highlight(text, query) {
  if (!query) return text;
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re, '<mark>$1</mark>');
}

function cmdFilter() {
  const q = document.getElementById('cmdInput').value.trim().toLowerCase();
  cmdFocusIdx = -1;

  // If query looks like a question/AI prompt — show AI shortcut
  const isQuestion = q.endsWith('?') || q.startsWith('why') || q.startsWith('how') ||
                     q.startsWith('what ') || q.startsWith('analyze') || q.startsWith('analiz') || q.length > 30;

  if (q && isQuestion) {
    cmdRender([], q, true);
    return;
  }

  const filtered = q
    ? CMD_DEFS.filter(c => t(c.name).toLowerCase().includes(q) || t(c.group).toLowerCase().includes(q))
    : CMD_DEFS;
  cmdRender(filtered, q, false);
}

function cmdRender(items, query, aiMode) {
  const container = document.getElementById('cmdResults');
  cmdFiltered = items;

  if (aiMode) {
    container.innerHTML = `
      <div class="cmd-item focused" onclick="cmdRunAI()" style="height:auto;padding:12px 16px;align-items:flex-start;gap:12px;">
        <div class="cmd-icon" style="margin-top:2px;color:#f97316;">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <div>
          <div style="font-size:13px;color:#f97316;font-weight:500;">Ask AI</div>
          <div style="font-size:12px;color:#6b6b6b;margin-top:3px;">"${escHtml(document.getElementById('cmdInput').value)}"</div>
        </div>
      </div>`;
    cmdFocusIdx = 0;
    return;
  }

  if (!items.length) {
    container.innerHTML = `
      <div class="cmd-empty">
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <span>${t('ui_no_results')}</span>
      </div>`;
    return;
  }

  let html = '';
  let lastGroup = null;
  items.forEach((cmd, idx) => {
    if (cmd.group !== lastGroup) {
      html += `<div class="cmd-group-label">${t(cmd.group)}</div>`;
      lastGroup = cmd.group;
    }
    const nameHtml = highlight(t(cmd.name), query);
    const shortcutHtml = cmd.shortcut
      ? `<span class="cmd-shortcut">${cmd.shortcut}</span>` : '';
    html += `
      <div class="cmd-item" data-action="${cmd.action}" data-idx="${idx}" onclick="cmdExec('${cmd.action}')">
        <div class="cmd-icon">${CMD_ICONS[cmd.icon] || ''}</div>
        <span class="cmd-name">${nameHtml}</span>
        ${shortcutHtml}
      </div>`;
  });
  container.innerHTML = html;
}

function cmdExec(action) {
  closeCmdPalette();
  // Small delay so palette close animation plays cleanly
  setTimeout(() => {
    switch (action) {
      case 'sumSelection':   cmdSumSelection(); break;
      case 'sortData':       sortData(); break;
      case 'cleanEmptyRows': cmdCleanEmptyRows(); break;
      case 'removeDuplicates': cmdRemoveDuplicates(); break;
      case 'aiAnalyze':      cmdAIAction('analyze'); break;
      case 'aiChart':        cmdAIAction('chart'); break;
      case 'aiSummary':      cmdAIAction('summary'); break;
      case 'aiFormula':      cmdAIAction('formula'); break;
      case 'triggerUpload':  triggerUpload(); break;
      case 'downloadFile':   downloadFile(); break;
      case 'newFile':        newFile(); break;
    }
  }, 120);
}

function cmdRunAI() {
  const q = document.getElementById('cmdInput').value.trim();
  closeCmdPalette();
  if (!q) return;
  setTimeout(() => {
    document.getElementById('chatInput').value = q;
    if (typeof openFloatingChat === 'function') openFloatingChat();
    sendChat();
  }, 120);
}

// ── Palette action implementations ───────────
function cmdSumSelection() {
  const data = sheets[activeSheet];
  let total = 0, count = 0;
  for (let r = 0; r < ROWS; r++) {
    const v = parseFloat(data[r][selCol]);
    if (!isNaN(v)) { total += v; count++; }
  }
  const targetRow = ROWS - 1;
  // Find first empty row below data in the column
  let insertRow = 0;
  for (let r = 0; r < ROWS; r++) {
    if (data[r][selCol] !== '') insertRow = r + 1;
  }
  insertRow = Math.min(insertRow, ROWS - 1);
  data[insertRow][selCol] = String(total);
  buildGrid();
  toast(tpl('toast_sum_tpl', {col: colLetter(selCol), sum: total.toLocaleString(currentLang === 'tr' ? 'tr-TR' : 'en-US', {maximumFractionDigits:2}), count}), 'ok');
}

function cmdCleanEmptyRows() {
  console.log('%c[cmdCleanEmptyRows]', 'color:orange;font-weight:bold',
    '| activeSheet:', activeSheet,
    '| rows:', sheets[activeSheet]?.length
  );
  const data = sheets[activeSheet];
  if (!data || data.length < 2) return;
  const headers = data[0];
  const before = data.length - 1;
  const rows = data.slice(1).filter(function(row) {
    return row && row.some(function(c) {
      return c !== null && c !== undefined && String(c).trim() !== '';
    });
  });
  sheets[activeSheet] = [headers].concat(rows);
  while (sheets[activeSheet].length < ROWS) sheets[activeSheet].push(Array(COLS).fill(''));
  const removed = before - rows.length;
  buildGrid(sheets[activeSheet]);
  toast(removed ? tpl('toast_empty_removed_tpl', {count: removed}) : t('toast_no_empty_rows'), removed ? 'ok' : 'err');
  console.log('[cmdCleanEmptyRows] silindi:', removed, 'kalan:', rows.length);
}

function cmdRemoveDuplicates() {
  const data = sheets[activeSheet];
  const seen = new Set();
  let removed = 0;
  for (let r = data.length - 1; r >= 0; r--) {
    const key = data[r].join('||');
    if (key.replaceAll('||','').trim() === '') continue;
    if (seen.has(key)) {
      data.splice(r, 1);
      removed++;
    } else {
      seen.add(key);
    }
  }
  while (data.length < ROWS) data.push(Array(COLS).fill(''));
  buildGrid();
  toast(removed ? tpl('toast_dup_removed_tpl', {count: removed}) : t('toast_no_dup'), removed ? 'ok' : 'err');
}

function cmdAIAction(type) {
  const prompts = {
    analyze: `Analyze the data in the active sheet "${activeSheet}" and highlight key insights.`,
    chart:   `Suggest the most suitable chart type for this data and explain why.`,
    summary: `Create a short, clear executive summary from this catalog data.`,
    formula: `Suggest useful formulas and data operations for this catalog structure.`,
    // legacy Turkish keys for backward compat
    analiz:  `Analyze the data in the active sheet "${activeSheet}" and highlight key insights.`,
    grafik:  `Suggest the most suitable chart type for this data and explain why.`,
    özet:    `Create a short, clear executive summary from this catalog data.`,
    formül:  `Suggest useful formulas and data operations for this catalog structure.`,
  };
  document.getElementById('chatInput').value = prompts[type];
  if (typeof openFloatingChat === 'function') openFloatingChat();
  sendChat();
}

// Register Ctrl+O, Ctrl+S, Ctrl+N globally
document.addEventListener('keydown', e => {
  if (!e.ctrlKey && !e.metaKey) return;
  // Skip if command palette is open (handled by cmdKeydown)
  if (cmdVisible) return;
  if (e.key === 'o') { e.preventDefault(); triggerUpload(); }
  if (e.key === 's') { e.preventDefault(); saveData(); }
  if (e.key === 'n') { e.preventDefault(); newFile(); }
  if (e.key === 'd') { e.preventDefault(); if (typeof toggleFloatingChat === 'function') toggleFloatingChat(); }
  if (e.key === 'z') { e.preventDefault(); undo(); }
  if (e.key === 'y') { e.preventDefault(); redo(); }
});

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════
function deleteSheetDirect(name) {
  const names = Object.keys(sheets);
  if (names.length <= 1) { toast(t('toast_no_last_sheet'), 'err'); return; }
  if (!confirm(tpl('confirm_delete_sheet_tpl', {name}))) return;
  const idx = names.indexOf(name);
  delete sheets[name];
  delete cellMeta[name];
  const remaining = Object.keys(sheets);
  const nextSheet = remaining[Math.min(idx, remaining.length - 1)];
  switchSheet(nextSheet);
  toast(tpl('toast_sheet_deleted_tpl', {name}), 'ok');
}

function toggleSidebar() {
  const sb = document.getElementById('appSidebar');
  if (!sb) return;
  const collapsed = sb.classList.toggle('collapsed');
  localStorage.setItem('sb_collapsed', collapsed ? '1' : '0');
}

function init() {
  try { const s = localStorage.getItem('recent_files'); if (s) recentFiles = JSON.parse(s); } catch(e) {}
  loadAutoSave();
  renderRecentFiles();
  renderSheetTabs();
  renderSheetList();
  buildGrid();
  if (!loadChatHistory()) addWelcomeMsg();
  updateApiStatus();
  initOnboardBanner();
  checkEmptyState();
  renderVersionHistory();
  loadHistory();
  updateSidebarUser();
  if (localStorage.getItem('sb_collapsed') === '1') toggleSidebar();
  // Focus first cell
  setTimeout(() => focusCell(0, 0), 100);
}

// ═══════════════════════════════════════════════════════════════
//  SHEET CONTEXT MENU
// ═══════════════════════════════════════════════════════════════
let sheetCtxTarget = null;

function showSheetCtx(e, name) {
  e.preventDefault();
  e.stopPropagation();
  sheetCtxTarget = name;
  const menu = document.getElementById('sheetCtxMenu');
  menu.classList.add('visible');

  // Smart positioning — keep inside viewport
  const mw = 168, mh = 130;
  let x = e.clientX, y = e.clientY;
  if (x + mw > window.innerWidth)  x = window.innerWidth  - mw - 6;
  if (y + mh > window.innerHeight) y = window.innerHeight - mh - 6;
  menu.style.left = x + 'px';
  menu.style.top  = y + 'px';

  setTimeout(() => document.addEventListener('click', hideSheetCtx, {once: true}), 0);
}

function hideSheetCtx() {
  document.getElementById('sheetCtxMenu').classList.remove('visible');
  sheetCtxTarget = null;
}

function scmAction(action) {
  hideSheetCtx();
  const name = sheetCtxTarget;
  if (!name) return;

  if (action === 'rename') {
    renameSheet(name);
  } else if (action === 'duplicate') {
    const names = Object.keys(sheets);
    let newName = name + t('sheet_copy_suffix');
    let i = 2;
    while (sheets[newName]) newName = name + tpl('sheet_copy_suffix_n', {n: i++});
    // Deep copy sheet data
    sheets[newName] = sheets[name].map(row => [...row]);
    // Deep copy meta
    if (cellMeta[name]) {
      cellMeta[newName] = JSON.parse(JSON.stringify(cellMeta[name]));
    }
    // Insert right after the original
    const ordered = {};
    names.forEach(n => {
      ordered[n] = sheets[n];
      if (n === name) ordered[newName] = sheets[newName];
    });
    Object.keys(sheets).forEach(k => delete sheets[k]);
    Object.assign(sheets, ordered);
    switchSheet(newName);
    toast(tpl('toast_sheet_created_tpl', {name: newName}), 'ok');
  } else if (action === 'delete') {
    const names = Object.keys(sheets);
    if (names.length <= 1) { toast(t('toast_no_last_sheet'), 'err'); return; }
    const idx = names.indexOf(name);
    delete sheets[name];
    delete cellMeta[name];
    const remaining = Object.keys(sheets);
    const nextSheet = remaining[Math.min(idx, remaining.length - 1)];
    switchSheet(nextSheet);
    toast(tpl('toast_sheet_deleted_tpl', {name}), 'ok');
  }
}

init();

// ═══════════════════════════════════════════════════════════════
//  CHART MODULE  (Amplemarket dark theme)
// ═══════════════════════════════════════════════════════════════
let activeChartInstance = null;
let chartCurrentType = 'bar';
let chartCurrentRange = 'A1:B10';
let chartAutoUpdate = false;
let chartDataWatcher = null;

// Dark Amplemarket palette — primary #f97316, secondary #fb923c
const CHART_PALETTE = [
  '#f97316','#fb923c','#fdba74',
  '#fcd34d','#86efac','#67e8f9',
  '#a78bfa','#f472b6','#94a3b8','#64748b'
];

// ── Toggle side panel ────────────────────────
function toggleChartBuilder() {
  const panel = document.getElementById('chartSidePanel');
  const btn   = document.getElementById('tbChartBtn');
  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    btn.style.background = '';
    btn.style.borderColor = '#e9d5ff';
  } else {
    panel.classList.add('open');
    btn.style.background = 'rgba(249,115,22,0.1)';
    btn.style.borderColor = '#f97316';
    btn.style.color = '#f97316';
  }
}

// ── Type card selector (side panel) ─────────
function cspSelectType(type, el) {
  chartCurrentType = type;
  document.querySelectorAll('.csp-type-card').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ── Parse range string → {r1,c1,r2,c2} ─────
function parseRange(rangeStr) {
  const m = rangeStr.trim().toUpperCase().match(/^([A-Z]+)(\d+):([A-Z]+)(\d+)$/);
  if (!m) return null;
  const colIndex = s => s.split('').reduce((a,c,i,arr) =>
    a * 26 + c.charCodeAt(0) - 64, 0) - 1;
  return {
    r1: parseInt(m[2]) - 1, c1: colIndex(m[1]),
    r2: parseInt(m[4]) - 1, c2: colIndex(m[3])
  };
}

// ── Extract datasets from range ─────────────
function extractChartData(rangeStr) {
  const range = parseRange(rangeStr);
  if (!range) return null;
  const data = sheets[activeSheet];
  const { r1, c1, r2, c2 } = range;

  const labels = [];
  const datasets = [];
  const numCols = c2 - c1;

  // First column = labels, remaining = series
  for (let r = r1; r <= Math.min(r2, data.length - 1); r++) {
    labels.push(data[r][c1] || `Row ${r + 1}`);
  }

  // Create one dataset per value column
  for (let dc = 1; dc <= numCols; dc++) {
    const col = c1 + dc;
    if (col > c2) break;
    const values = [];
    const headerRow = data[r1][col];
    const isHeader = headerRow && isNaN(parseFloat(headerRow));
    const seriesLabel = isHeader ? headerRow : (colLetter(col));
    const startRow = isHeader ? r1 + 1 : r1;

    for (let r = startRow; r <= Math.min(r2, data.length - 1); r++) {
      values.push(parseFloat(data[r][col]) || 0);
    }

    datasets.push({
      label: String(seriesLabel),
      data: values,
      backgroundColor: CHART_PALETTE[(dc - 1) % CHART_PALETTE.length] + (
        chartCurrentType === 'bar' ? 'cc' :
        chartCurrentType === 'line' ? '22' : 'cc'
      ),
      borderColor: CHART_PALETTE[(dc - 1) % CHART_PALETTE.length],
      borderWidth: chartCurrentType === 'line' ? 2.5 : 1.5,
      tension: chartCurrentType === 'line' ? 0.4 : 0,
      fill: chartCurrentType === 'polarArea',
      pointRadius: chartCurrentType === 'line' ? 4 : 0,
      pointHoverRadius: 6,
    });
  }

  // If only 1 column total (only labels), treat it as label+single numeric column
  if (datasets.length === 0 && c1 === c2) {
    const values = [];
    for (let r = r1; r <= Math.min(r2, data.length - 1); r++) {
      values.push(parseFloat(data[r][c1]) || 0);
    }
    labels.length = 0;
    values.forEach((_, i) => labels.push(`Value ${i + 1}`));
    datasets.push({
      label: 'Data',
      data: values,
      backgroundColor: CHART_PALETTE.slice(0, values.length).map(c => c + 'cc'),
      borderColor: CHART_PALETTE.slice(0, values.length),
      borderWidth: 1.5,
    });
  }

  // For pie/polarArea use first dataset only, multi-colour
  if (chartCurrentType === 'pie' || chartCurrentType === 'doughnut' || chartCurrentType === 'polarArea') {
    if (datasets.length > 0) {
      datasets[0].backgroundColor = datasets[0].data.map((_, i) =>
        CHART_PALETTE[i % CHART_PALETTE.length] + 'cc');
      datasets[0].borderColor = datasets[0].data.map((_, i) =>
        CHART_PALETTE[i % CHART_PALETTE.length]);
    }
    return { labels, datasets: [datasets[0]] };
  }

  return { labels, datasets };
}

// ── Create chart → close side panel, open modal
function createChart() {
  const rangeVal = document.getElementById('chartRange').value.trim();
  const titleVal = document.getElementById('chartTitle').value.trim();

  if (!parseRange(rangeVal)) {
    toast('Invalid range — e.g. A1:B10', 'err');
    return;
  }
  chartCurrentRange = rangeVal;

  // Close side panel
  document.getElementById('chartSidePanel').classList.remove('open');
  const btn = document.getElementById('tbChartBtn');
  btn.style.background = '';
  btn.style.borderColor = '#e9d5ff';
  btn.style.color = '';

  // Open modal
  const modal = document.getElementById('chartModal');
  modal.classList.add('open');
  document.getElementById('chartModalTitle').textContent = titleVal || 'Chart';

  // Sync modal type switcher
  document.querySelectorAll('.cm-type-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.t === chartCurrentType);
  });

  renderChart(titleVal);
  chartAutoUpdate = true;
  toast(t('toast_chart_created'), 'ok');
}

// ── Chart modal: click outside to close ─────
function chartModalClickOutside(e) {
  if (e.target === document.getElementById('chartModal')) closeChartPanel();
}

// ── Render / re-render (dark Amplemarket theme)
function renderChart(title) {
  const extracted = extractChartData(chartCurrentRange);
  if (!extracted) { toast(t('toast_chart_read_err'), 'err'); return; }

  const { labels, datasets } = extracted;
  if (!datasets || datasets.length === 0) { toast('No data in selected range', 'err'); return; }

  const canvas = document.getElementById('myChartCanvas');
  if (activeChartInstance) { activeChartInstance.destroy(); activeChartInstance = null; }

  const ctx = canvas.getContext('2d');
  const chartTitle = title || document.getElementById('chartModalTitle').textContent;

  activeChartInstance = new Chart(ctx, {
    type: chartCurrentType,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 400, easing: 'easeOutQuart' },
      plugins: {
        legend: {
          display: datasets.length > 1 || chartCurrentType === 'pie' || chartCurrentType === 'polarArea',
          labels: {
            font: { family: 'Inter', size: 11 },
            color: '#6b6b6b',
            boxWidth: 10,
            padding: 14,
          }
        },
        title: {
          display: !!chartTitle && chartTitle !== 'Grafik',
          text: chartTitle,
          font: { family: 'Inter', size: 13, weight: '600' },
          color: '#e2e2e2',
          padding: { top: 4, bottom: 10 }
        },
        tooltip: {
          backgroundColor: '#1a1a1a',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          titleColor: '#e2e2e2',
          bodyColor: '#94a3b8',
          titleFont: { family: 'Inter', size: 12, weight: '600' },
          bodyFont: { family: 'Inter', size: 11 },
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
          boxWidth: 8,
          boxHeight: 8,
        }
      },
      scales: (chartCurrentType === 'pie' || chartCurrentType === 'polarArea') ? {
        r: { ticks: { color: '#6b6b6b' }, grid: { color: 'rgba(255,255,255,0.06)' } }
      } : {
        x: {
          grid: { color: 'rgba(255,255,255,0.06)', lineWidth: 1 },
          ticks: { font: { family: 'Inter', size: 10 }, color: '#6b6b6b' },
          border: { color: 'rgba(255,255,255,0.08)' }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.06)', lineWidth: 1 },
          ticks: { font: { family: 'Inter', size: 10 }, color: '#6b6b6b' },
          border: { color: 'rgba(255,255,255,0.08)' },
          beginAtZero: true
        }
      }
    }
  });
}

// ── Update existing chart data ───────────────
function updateChartData() {
  if (!activeChartInstance || !chartAutoUpdate) return;
  const extracted = extractChartData(chartCurrentRange);
  if (!extracted) return;
  const { labels, datasets } = extracted;
  if (!datasets || datasets.length === 0) return;

  activeChartInstance.data.labels = labels;
  activeChartInstance.data.datasets = datasets;
  activeChartInstance.update('active');
}

// ── Switch chart type from modal header bar ──
function cmSwitchType(type, el) {
  chartCurrentType = type;
  document.querySelectorAll('.cm-type-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  // Sync side panel cards
  document.querySelectorAll('.csp-type-card').forEach(c => {
    c.classList.toggle('active', c.dataset.type === type);
  });
  renderChart(document.getElementById('chartModalTitle').textContent);
}

// ── Close chart modal ────────────────────────
function closeChartPanel() {
  document.getElementById('chartModal').classList.remove('open');
  chartAutoUpdate = false;
  if (activeChartInstance) {
    activeChartInstance.destroy();
    activeChartInstance = null;
  }
}

// Chart auto-update is handled inside updateStatus() directly

// ── Chart modal click-outside to close ───────
function chartModalClickOutside(e) {
  if (e.target === document.getElementById('chartModal')) closeChartPanel();
}

// ═══════════════════════════════════════════════════════════════
//  VERSION HISTORY
// ═══════════════════════════════════════════════════════════════

function takeSnapshot() {
  const snap = {};
  Object.keys(sheets).forEach(k => {
    snap[k] = sheets[k].map(row => [...row]);
  });
  const metaSnap = JSON.parse(JSON.stringify(cellMeta));
  return { sheets: snap, cellMeta: metaSnap, activeSheet };
}

async function addHistory(type, text) {
  const snap = takeSnapshot();
  versionHistory.unshift({ type, desc: text, text, time: Date.now(), snap });
  redoStack = [];
  if (versionHistory.length > 50) versionHistory.pop();
  renderVersionHistory();

  try {
    if (!window._sb || !currentUser) return;
    await window._sb.from('history').insert({
      user_id: currentUser.id,
      file_id: currentFileId || null,
      type: type,
      text: text,
      created_at: new Date().toISOString()
    });
  } catch(e) {
    console.warn('History save error:', e);
  }
}

async function loadHistory() {
  try {
    if (!window._sb || !currentUser) return;
    const { data } = await window._sb
      .from('history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    if (data && data.length > 0) {
      versionHistory = data.map(h => ({
        type: h.type,
        desc: h.text,
        text: h.text,
        time: new Date(h.created_at).getTime()
      }));
      renderVersionHistory();
    }
  } catch(e) {
    console.warn('History load error:', e);
  }
}

function fmtHistoryTime(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return 'Just now';
  if (d < 3600000) return Math.floor(d / 60000) + ' min ago';
  if (d < 86400000) return Math.floor(d / 3600000) + ' hr ago';
  return new Date(ts).toLocaleDateString('en-US', {day:'numeric', month:'short'});
}

function renderVersionHistory() {
  const list = document.getElementById('vhList');
  if (!list) return;
  if (versionHistory.length === 0) {
    list.innerHTML = `<div id="vhEmpty">${t('ui_no_actions_yet')}</div>`;
    return;
  }
  list.innerHTML = versionHistory.map((entry, i) => {
    const icon = VH_ICONS[entry.type] || VH_ICONS.manual;
    return `<div class="vh-item" onclick="showHistoryPreview(${i})">
      <div class="vh-icon ${icon.cls}">${icon.emoji}</div>
      <div class="vh-info">
        <div class="vh-desc" title="${escHtml(entry.desc)}">${escHtml(entry.desc)}</div>
        <div class="vh-time">${fmtHistoryTime(entry.time)}</div>
      </div>
    </div>`;
  }).join('');
}

function showHistoryPreview(idx) {
  historyRestoreIdx = idx;
  const entry = versionHistory[idx];
  if (!entry) return;

  document.getElementById('hmTitle').textContent = entry.desc;
  document.getElementById('hmSub').textContent = fmtHistoryTime(entry.time) + ' · ' +
    (entry.type === 'ai' ? t('history_ai') : entry.type === 'file' ? t('history_file') : t('history_manual'));

  // Build mini grid preview (8 cols × 10 rows of the snapshot's activeSheet)
  const data = entry.snap.sheets[entry.snap.activeSheet] || [];
  const PREV_COLS = 8, PREV_ROWS = 10;
  let html = '<table class="hm-table"><tr><th></th>';
  for (let c = 0; c < PREV_COLS; c++) html += `<th>${colLetter(c)}</th>`;
  html += '</tr>';
  for (let r = 0; r < PREV_ROWS; r++) {
    html += `<tr><th>${r + 1}</th>`;
    for (let c = 0; c < PREV_COLS; c++) {
      const v = (data[r] && data[r][c]) ? data[r][c] : '';
      html += `<td class="${v ? 'hv' : ''}" title="${escHtml(v)}">${v.length > 10 ? escHtml(v.substring(0,10))+'…' : escHtml(v)}</td>`;
    }
    html += '</tr>';
  }
  html += '</table>';
  document.getElementById('hmPreview').innerHTML = html;

  document.getElementById('historyModal').classList.add('open');
}

function restoreHistory() {
  const entry = versionHistory[historyRestoreIdx];
  if (!entry) return;
  sheets = {};
  Object.keys(entry.snap.sheets).forEach(k => {
    sheets[k] = entry.snap.sheets[k].map(row => [...row]);
  });
  cellMeta = JSON.parse(JSON.stringify(entry.snap.cellMeta));
  activeSheet = entry.snap.activeSheet;
  closeHistoryModal();
  renderSheetTabs();
  buildGrid();
  updateStatus();
  toast(t('toast_restored'), 'ok');
}

function closeHistoryModal() {
  document.getElementById('historyModal').classList.remove('open');
  historyRestoreIdx = -1;
}

function historyModalClickOutside(e) {
  if (e.target === document.getElementById('historyModal')) closeHistoryModal();
}

// ═══════════════════════════════════════════════════════════════
//  EMPTY STATE
// ═══════════════════════════════════════════════════════════════
function checkEmptyState() {
  const data = sheets[activeSheet];
  let hasData = false;
  outer: for (let r = 0; r < data.length; r++)
    for (let c = 0; c < data[r].length; c++)
      if (data[r][c] !== '') { hasData = true; break outer; }
  const es = document.getElementById('emptyState');
  if (es) es.classList.toggle('visible', !hasData);
  // Render recent files in empty state
  if (!hasData) {
    const rec = document.getElementById('esRecentList');
    const esRecent = document.getElementById('esRecent');
    if (rec && esRecent) {
      rec.innerHTML = recentFiles.slice(0, 3).map(function(f, i) {
        return `<div class="es-recent-item" onclick="loadRecentFile(${i})">📄 ${escHtml(f.name || 'File')}</div>`;
      }).join('');
      esRecent.style.display = recentFiles.length ? '' : 'none';
    }
  }
}

function loadSampleData() {
  const data = sheets[activeSheet];
  const sample = [
    ['Product','January','February','March','Total'],
    ['Laptop','45000','52000','48000','145000'],
    ['Phone','32000','38000','41000','111000'],
    ['Tablet','18000','21000','19500','58500'],
    ['Accessories','8500','9200','10100','27800'],
    ['Software','12000','14000','15500','41500'],
  ];
  sample.forEach((row, r) => row.forEach((v, c) => { data[r][c] = v; }));
  buildGrid();
  updateStatus();
  addHistory('file', 'Sample data loaded');
  toast(t('toast_sample_loaded'), 'ok');
}

// ═══════════════════════════════════════════════════════════════
//  ONBOARDING BANNER
// ═══════════════════════════════════════════════════════════════
function initOnboardBanner() {
  var b = document.getElementById('onboardBanner');
  if (b) b.classList.add('hidden');
}

function closeOnboardBanner() {
  localStorage.setItem('ob_dismissed', '1');
  var b = document.getElementById('onboardBanner');
  if (b) b.classList.add('hidden');
  document.body.classList.remove('with-banner');
}

// Cell edit debounce for manual history
let _cellEditTimer = null;
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.classList.add(savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);
  const darkToggle = document.getElementById('darkToggle');
  if (darkToggle) darkToggle.classList.toggle('on', savedTheme === 'dark');
  updateThemeIcon();
  setTimeout(loadUserUsage, 500);

  const gw = document.getElementById('gridWrap');
  if (gw) gw.addEventListener('input', () => {
    clearTimeout(_cellEditTimer);
    _cellEditTimer = setTimeout(() => {
      const ref = colLetter(selCol) + (selRow + 1);
      addHistory('manual', ref + ' edited');
      if (window.Automations) window.Automations.evaluate(sheets[activeSheet]);
    }, 2000);
  });

  // Throttled scroll — keeps future scroll-based features from hammering layout
  if (gw) gw.addEventListener('scroll', throttle(function() {
    // reserved: virtual scrolling, frozen header sync, etc.
  }, 100));
});

// Throttled resize — repositions floating toolbar, recalculates layout
window.addEventListener('resize', throttle(function() {
  if (typeof hideFloatToolbar === 'function') hideFloatToolbar();
}, 200));

// ═══════════════════════════════════════════════════════════════
//  FLOATING CELL TOOLBAR
// ═══════════════════════════════════════════════════════════════
var _resize = null;

function showFloatToolbar(r, c) {
  const td = getCell(r, c);
  const ft = document.getElementById('floatToolbar');
  if (!td || !ft || window.innerWidth < 768) return;
  const rect = td.getBoundingClientRect();
  const ftH = 38;
  let top = rect.top - ftH - 8;
  if (top < 4) top = rect.bottom + 8;
  let left = rect.left;
  if (left + 270 > window.innerWidth) left = window.innerWidth - 274;
  ft.style.top  = top + 'px';
  ft.style.left = Math.max(4, left) + 'px';
  ft.classList.add('visible');
  const meta = getCellMeta()[r + '_' + c] || {};
  const ftBold = document.getElementById('ftBold');
  const ftItalic = document.getElementById('ftItalic');
  const ftUnderline = document.getElementById('ftUnderline');
  if (ftBold) ftBold.classList.toggle('active', !!meta.bold);
  if (ftItalic) ftItalic.classList.toggle('active', !!meta.italic);
  if (ftUnderline) ftUnderline.classList.toggle('active', !!meta.underline);
}

function hideFloatToolbar() {
  const ft = document.getElementById('floatToolbar');
  if (ft) ft.classList.remove('visible');
}

document.addEventListener('mousedown', function(e) {
  if (!e.target.closest('#floatToolbar') && !e.target.closest('.cell')) {
    hideFloatToolbar();
  }
});

// ═══════════════════════════════════════════════════════════════
//  COLUMN / ROW RESIZE
// ═══════════════════════════════════════════════════════════════
function startColResize(e, c) {
  e.stopPropagation(); e.preventDefault();
  const th = e.target.closest('th');
  const startX = e.clientX;
  const startW = th.offsetWidth;
  const line = document.getElementById('resizeLine');
  if (line) { line.className = 'col'; line.style.left = e.clientX + 'px'; line.style.display = 'block'; }

  function onMove(ev) {
    const w = Math.min(400, Math.max(60, startW + (ev.clientX - startX)));
    if (line) line.style.left = ev.clientX + 'px';
    _resize = {type: 'col', c, w};
  }
  function onUp() {
    if (line) line.style.display = 'none';
    if (_resize) { colWidths[_resize.c] = _resize.w; buildGrid(); _resize = null; }
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

function startRowResize(e, r) {
  e.stopPropagation(); e.preventDefault();
  const rh = e.target.closest('td');
  const startY = e.clientY;
  const startH = rh.offsetHeight;
  const line = document.getElementById('resizeLine');
  if (line) { line.className = 'row'; line.style.top = e.clientY + 'px'; line.style.display = 'block'; }

  function onMove(ev) {
    const h = Math.min(120, Math.max(24, startH + (ev.clientY - startY)));
    if (line) line.style.top = ev.clientY + 'px';
    _resize = {type: 'row', r, h};
  }
  function onUp() {
    if (line) line.style.display = 'none';
    if (_resize) { rowHeights[_resize.r] = _resize.h; buildGrid(); _resize = null; }
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  }
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

// ═══════════════════════════════════════════════════════════════
//  FREEZE PANES
// ═══════════════════════════════════════════════════════════════
var _frozen = false;

function toggleFreeze() {
  _frozen = !_frozen;
  const wrap = document.getElementById('gridWrap');
  const btn  = document.getElementById('tbFreezeBtn');
  if (wrap) wrap.classList.toggle('frozen', _frozen);
  if (btn)  btn.classList.toggle('active', _frozen);
}

// ═══════════════════════════════════════════════════════════════
//  AUTO-SAVE
// ═══════════════════════════════════════════════════════════════
let _saveTimer = null;

function setSaveState(state) {
  const el = document.getElementById('saveIndicator');
  const tx = document.getElementById('saveText');
  if (!el) return;
  el.className = state;
  if (tx) tx.textContent = state === 'saved' ? t('save_saved') : state === 'saving' ? t('save_saving') : t('save_unsaved');
}

function saveData() {
  setSaveState('saving');
  try {
    const payload = {
      sheets, cellMeta, activeSheet,
      fileName: document.getElementById('fileName') ? document.getElementById('fileName').textContent : ''
    };
    const serialized = JSON.stringify(payload);

    // ── Size guard: warn and prune if > 4MB ─────────────────
    const MB4 = 4 * 1024 * 1024;
    if (serialized.length > MB4) {
      // Prune other localStorage keys to free space
      ['sheet_autosave_v1','sheet_autosave_v2','sheet_autosave_v3'].forEach(function(k) {
        try { localStorage.removeItem(k); } catch(e) {}
      });
      // Also prune chat history if needed
      if (serialized.length > MB4 * 1.5) {
        try { localStorage.removeItem('chat_history'); } catch(e) {}
      }
    }

    localStorage.setItem('sheet_autosave', serialized);
    dirtyCells.clear(); // reset dirty tracking after successful save
    setTimeout(function() { setSaveState('saved'); }, 400);
    toast(t('toast_saved'), 'ok');
  } catch(err) {
    setSaveState('unsaved');
    if (err.name === 'QuotaExceededError' || err.code === 22 || err.code === 1014) {
      // localStorage full — try saving only current sheet
      try {
        const minPayload = {
          sheets: { [activeSheet]: sheets[activeSheet] },
          cellMeta: { [activeSheet]: cellMeta[activeSheet] || {} },
          activeSheet,
          fileName: document.getElementById('fileName') ? document.getElementById('fileName').textContent : ''
        };
        localStorage.setItem('sheet_autosave', JSON.stringify(minPayload));
        dirtyCells.clear();
        setTimeout(function() { setSaveState('saved'); }, 400);
        toast(t('toast_storage_full'), 'warning');
      } catch(e2) {
        toast(t('toast_storage_full_err'), 'err');
      }
    } else {
      toast(t('toast_save_failed'), 'err');
    }
  }
}

function loadAutoSave() {
  try {
    const raw = localStorage.getItem('sheet_autosave');
    if (!raw) return false;
    const d = JSON.parse(raw);
    if (d.sheets) {
      sheets = d.sheets;
      cellMeta = d.cellMeta || {};
      activeSheet = d.activeSheet || Object.keys(d.sheets)[0];
    }
    if (d.fileName) { const fn = document.getElementById('fileName'); if (fn) fn.textContent = d.fileName; }
    return true;
  } catch(e) { return false; }
}

document.addEventListener('input', function(e) {
  if (e.target.closest && e.target.closest('#grid')) {
    setSaveState('unsaved');
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(saveData, 2000);
    if (typeof scheduleAutoSave === 'function') scheduleAutoSave();
  }
});

// ═══════════════════════════════════════════════════════════════
//  CELL FLASH
// ═══════════════════════════════════════════════════════════════
function flashCell(r, c) {
  const td = getCell(r, c);
  if (!td) return;
  td.classList.remove('flash');
  void td.offsetWidth;
  td.classList.add('flash');
  td.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  setTimeout(() => td.classList.remove('flash'), 650);
}

// ═══════════════════════════════════════════════════════════════
//  DRAG-AND-DROP FILE SUPPORT
// ═══════════════════════════════════════════════════════════════
(function() {
  const overlay = document.getElementById('dropOverlay');
  let dragCount = 0;
  document.addEventListener('dragenter', function(e) {
    if (e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes('Files')) {
      dragCount++;
      if (overlay) overlay.classList.add('active');
    }
  });
  document.addEventListener('dragleave', function() {
    dragCount = Math.max(0, dragCount - 1);
    if (dragCount === 0 && overlay) overlay.classList.remove('active');
  });
  document.addEventListener('dragover', function(e) {
    if (e.dataTransfer && e.dataTransfer.types && e.dataTransfer.types.includes('Files')) e.preventDefault();
  });
  document.addEventListener('drop', function(e) {
    dragCount = 0;
    if (overlay) overlay.classList.remove('active');
    const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (file && /\.(xlsx|xls|csv)$/i.test(file.name)) {
      e.preventDefault();
      handleFile({ target: { files: [file] } });
    }
  });
}());

// ═══════════════════════════════════════════════════════════════
//  CUSTOM TOOLTIP
// ═══════════════════════════════════════════════════════════════
(function() {
  const tip = document.getElementById('customTooltip');
  if (!tip) return;
  let _tipTimer;
  document.addEventListener('mouseover', function(e) {
    const el = e.target.closest('[title]');
    if (!el) return;
    if (!el.closest('#topbar') && !el.closest('#toolbar')) return;
    const text = el.getAttribute('title');
    if (!text) return;
    el.dataset.tip = text;
    el.removeAttribute('title');
    clearTimeout(_tipTimer);
    _tipTimer = setTimeout(function() {
      tip.textContent = text;
      const r = el.getBoundingClientRect();
      tip.style.left = Math.min(r.left, window.innerWidth - tip.offsetWidth - 8) + 'px';
      tip.style.top  = (r.bottom + 6) + 'px';
      tip.classList.add('visible');
    }, 200);
  });
  document.addEventListener('mouseout', function(e) {
    const el = e.target.closest('[data-tip]');
    if (el) { el.setAttribute('title', el.dataset.tip); delete el.dataset.tip; }
    clearTimeout(_tipTimer);
    tip.classList.remove('visible');
  });
}());

// ═══════════════════════════════════════════════════════════════
//  RECENT FILES IN EMPTY STATE
// ═══════════════════════════════════════════════════════════════
function loadRecentFile(idx) {
  const f = recentFiles[idx];
  if (!f) return;
  if (f.data) {
    sheets = f.data;
    activeSheet = Object.keys(f.data)[0];
    buildGrid();
    if (typeof renderSheetTabs === 'function') renderSheetTabs();
    updateStatus();
    const fn = document.getElementById('fileName');
    if (fn) fn.textContent = f.name || 'File';
    toast(tpl('toast_file_loaded_tpl', {name: f.name || 'File'}), 'ok');
  }
}

// ═══════════════════════════════════════════════════════════════
//  UX IMPROVEMENTS v2 — Toast / Loading / Shortcuts / Animations
// ═══════════════════════════════════════════════════════════════

// ── 1. Enhanced toast() ──────────────────────────────────────
// Shadows original: adds warning/ai types, progress bar, close button
function toast(msg, type, undoable, duration) {
  type     = type     || 'ok';
  duration = duration || 3000;
  const ICONS = {
    ok:      `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    err:     `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    info:    `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    warning: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    ai:      `<span style="font-size:13px;line-height:1;flex-shrink:0;">⚡</span>`,
  };
  const container = document.getElementById('toastContainer');
  if (!container) return;
  while (container.children.length >= 3) container.firstChild.remove();
  const toastEl = document.createElement('div');
  toastEl.className = 'toast ' + type;
  const undoBtn  = undoable ? `<button class="toast-undo" onclick="undo();this.closest('.toast').remove()">${t('undo')}</button>` : '';
  const closeBtn = `<button class="toast-close" onclick="this.closest('.toast').remove()">×</button>`;
  toastEl.innerHTML = `<div class="toast-bar"></div><div class="toast-body">${ICONS[type]||ICONS.ok}<span class="toast-msg">${msg}</span>${undoBtn}${closeBtn}</div><div class="toast-progress-wrap"><div class="toast-progress"></div></div>`;
  container.appendChild(toastEl);
  const pb = toastEl.querySelector('.toast-progress');
  if (pb) requestAnimationFrame(function() { pb.style.transition = 'width ' + duration + 'ms linear'; pb.style.width = '0%'; });
  var hide = function() { toastEl.classList.add('leaving'); setTimeout(function() { if (toastEl.parentNode) toastEl.remove(); }, 310); };
  setTimeout(hide, duration);
}
function showToast(msg, type, undoable) { toast(msg, type, undoable); }

// ── 2. File loading overlay (monkey-patches handleFile + buildGrid) ──
(function() {
  var _origHandleFile = handleFile;
  handleFile = function(e) {
    var ov = document.getElementById('fileLoadingOverlay');
    if (ov && e && e.target && e.target.files && e.target.files[0]) {
      ov.style.display = 'flex';
    }
    return _origHandleFile.apply(this, arguments);
  };
  var _origBuildGrid = buildGrid;
  buildGrid = function() {
    var result = _origBuildGrid.apply(this, arguments);
    var ov = document.getElementById('fileLoadingOverlay');
    if (ov && ov.style.display !== 'none') ov.style.display = 'none';
    return result;
  };
})();

// ── 3. Download button loading state ────────────────────────
(function() {
  var _origDownload = downloadFile;
  downloadFile = function() {
    var btn = document.getElementById('downloadBtn');
    var origHTML = btn ? btn.innerHTML : null;
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<svg class="btn-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Downloading...';
    }
    _origDownload.apply(this, arguments);
    if (btn) {
      setTimeout(function() {
        btn.disabled = false;
        btn.innerHTML = origHTML;
        toast(t('toast_file_downloaded_info'), 'info');
      }, 400);
    }
  };
})();

// ── 4. Extend command palette ────────────────────────────────
(function() {
  if (typeof CMD_DEFS === 'undefined') return;
  CMD_DEFS.push(
    {group:'cmd_group_ai',    name:'cmd_toggle_ai',      shortcut:'Ctrl+D', icon:'chat',      action:'toggleChat'},
    {group:'cmd_group_view',  name:'cmd_toggle_chart',   shortcut:'',       icon:'chartOpen', action:'toggleChart'},
    {group:'cmd_group_file',  name:'cmd_download_csv',   shortcut:'',       icon:'csvDown',   action:'downloadCSV'},
    {group:'cmd_group_quick', name:'cmd_select_all',     shortcut:'Ctrl+A', icon:'selectAll', action:'selectAll'}
  );
  if (typeof CMD_ICONS !== 'undefined') {
    CMD_ICONS.chat      = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    CMD_ICONS.chartOpen = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
    CMD_ICONS.csvDown   = CMD_ICONS.download || CMD_ICONS.new;
    CMD_ICONS.selectAll = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`;
  }
  var _origCmdExec = cmdExec;
  cmdExec = function(action) {
    switch (action) {
      case 'toggleChat':  if (typeof toggleFloatingChat === 'function') toggleFloatingChat(); return;
      case 'toggleChart': if (typeof toggleChartBuilder === 'function') toggleChartBuilder();  return;
      case 'downloadCSV': downloadCSV(); return;
      case 'selectAll':   selectAllCells(); return;
      default: _origCmdExec(action);
    }
  };
})();

// ── 5. selectAllCells() helper ───────────────────────────────
function selectAllCells() {
  if (!sheets || !sheets[activeSheet]) { toast(t('toast_load_first'), 'info'); return; }
  selRow = 0; selCol = 0;
  selStart = {r: 0, c: 0};
  selEnd = {r: ROWS - 1, c: COLS - 1};
  if (typeof highlightSelection === 'function') highlightSelection();
  toast(t('toast_all_selected'), 'info');
}

// ── 6. Extra keyboard shortcuts ──────────────────────────────
document.addEventListener('keydown', function(e) {
  var ctrl = e.ctrlKey || e.metaKey;
  var tag  = document.activeElement ? document.activeElement.tagName : '';
  var inInput = (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');

  // Ctrl+Shift+Z → redo
  if (ctrl && e.shiftKey && e.key === 'Z') {
    e.preventDefault();
    if (typeof redo === 'function') redo();
    else toast(t('toast_nothing_redo'), 'info');
  }

  // Ctrl+A → select all cells (not in input)
  if (ctrl && e.key === 'a' && !inInput) {
    e.preventDefault();
    selectAllCells();
  }

  // F2 → edit focused cell
  if (e.key === 'F2') {
    var cell = document.querySelector('[data-r="' + selRow + '"][data-c="' + selCol + '"]');
    if (cell) { e.preventDefault(); cell.click(); cell.focus(); }
  }

  // Delete → clear selected range (not in input)
  if (e.key === 'Delete' && !inInput && sheets && sheets[activeSheet]) {
    var r1 = selStart ? Math.min(selStart.r, selEnd.r) : selRow;
    var r2 = selStart ? Math.max(selStart.r, selEnd.r) : selRow;
    var c1 = selStart ? Math.min(selStart.c, selEnd.c) : selCol;
    var c2 = selStart ? Math.max(selStart.c, selEnd.c) : selCol;
    for (var r = r1; r <= r2; r++) {
      for (var c = c1; c <= c2; c++) {
        if (sheets[activeSheet][r]) sheets[activeSheet][r][c] = '';
      }
    }
    var count = (r2 - r1 + 1) * (c2 - c1 + 1);
    if (typeof buildGrid === 'function') buildGrid();
    toast(tpl('toast_cells_cleared_tpl', {count}), 'info', true);
  }

  // Escape → close panels in priority order (context menu → palette → chat)
  if (e.key === 'Escape') {
    var ctx = document.getElementById('ctxMenu');
    if (ctx && ctx.style.display !== 'none') { ctx.style.display = 'none'; return; }
    if (typeof cmdVisible !== 'undefined' && cmdVisible && typeof closeCmdPalette === 'function') {
      closeCmdPalette(); return;
    }
    var cp = document.getElementById('chatPanel');
    if (cp && cp.style.display !== 'none' && typeof toggleFloatingChat === 'function') {
      toggleFloatingChat(); return;
    }
  }
});

// ── 7. Grid fade on sheet switch ─────────────────────────────
(function() {
  if (typeof switchSheet === 'undefined') return;
  var _orig = switchSheet;
  switchSheet = function(name) {
    var result = _orig.apply(this, arguments);
    var g = document.getElementById('grid');
    if (g) {
      g.classList.remove('grid-fade');
      void g.offsetWidth; // force reflow to restart animation
      g.classList.add('grid-fade');
      setTimeout(function() { g.classList.remove('grid-fade'); }, 200);
    }
    return result;
  };
})();

// ═══════════════════════════════════════════════════════════════
//  FILE MANAGEMENT — Supabase + IndexedDB
// ═══════════════════════════════════════════════════════════════

// ── IndexedDB helpers ─────────────────────────────────────────
function openIDB() {
  return new Promise(function(resolve, reject) {
    var req = indexedDB.open('Mocksheets', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains('files')) {
        db.createObjectStore('files', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('meta')) {
        db.createObjectStore('meta', { keyPath: 'key' });
      }
    };
    req.onsuccess = function(e) { resolve(e.target.result); };
    req.onerror   = function()  { reject(req.error); };
  });
}

function idbGet(db, store, key) {
  return new Promise(function(resolve, reject) {
    var tx  = db.transaction(store, 'readonly');
    var req = tx.objectStore(store).get(key);
    req.onsuccess = function() { resolve(req.result); };
    req.onerror   = function() { reject(req.error); };
  });
}

function idbPut(db, store, value) {
  return new Promise(function(resolve, reject) {
    var tx  = db.transaction(store, 'readwrite');
    var req = tx.objectStore(store).put(value);
    req.onsuccess = function() { resolve(req.result); };
    req.onerror   = function() { reject(req.error); };
  });
}

function idbDelete(db, store, key) {
  return new Promise(function(resolve, reject) {
    var tx  = db.transaction(store, 'readwrite');
    var req = tx.objectStore(store).delete(key);
    req.onsuccess = function() { resolve(); };
    req.onerror   = function() { reject(req.error); };
  });
}

// ── Sync badge helpers ────────────────────────────────────────
function setSyncBadge(state) {
  var badge = document.getElementById('syncBadge');
  var text  = document.getElementById('syncText');
  if (!badge) return;
  badge.style.display = 'inline-flex';
  badge.className = 'sync-badge ' + (state === 'syncing' ? 'syncing' : state === 'synced' ? 'synced' : '');
  if (text) text.textContent = state === 'syncing' ? t('sync_saving') : state === 'synced' ? t('sync_saved') : t('sync_unsaved');
  if (state === 'synced') setTimeout(function() { if (badge) badge.style.display = 'none'; }, 3000);
}

// ── Init file system ──────────────────────────────────────────
async function initFileSystem() {
  try {
    if (!window._sb) return;
    const { data, error } = await window._sb
      .from('files')
      .select('*')
      .order('updated_at', { ascending: false });
    if (error) { console.warn('initFileSystem:', error.message); return; }
    if (data && data.length > 0) {
      data.forEach(f => renderFileItem(f));
    }
  } catch(e) {
    console.warn('initFileSystem error:', e);
  }
}

// ── Upload new file to Supabase ───────────────────────────────
async function uploadFileToSupabase(file, parsedSheets) {
  if (!currentUser) return;
  setSyncBadge('syncing');

  var storagePath = currentUser.id + '/' + Date.now() + '_' + file.name;
  var uploadRes   = await sb.storage.from('sheet-files').upload(storagePath, file, { upsert: false });
  if (uploadRes.error) {
    toast('Cloud upload failed: ' + uploadRes.error.message, 'err');
    setSyncBadge('unsaved');
    return;
  }

  var insertRes = await sb.from('files').insert({
    user_id:      currentUser.id,
    name:         file.name,
    size:         file.size,
    storage_path: storagePath
  }).select().single();
  if (insertRes.error) {
    toast(t('toast_file_not_saved'), 'err');
    setSyncBadge('unsaved');
    return;
  }

  var fileRecord = insertRes.data;
  currentFileId  = fileRecord.id;

  // First version
  await sb.from('file_versions').insert({
    file_id:        fileRecord.id,
    version_number: 1,
    storage_path:   storagePath,
    label:          'Initial upload'
  });

  // Cache in IndexedDB
  var db = await openIDB();
  await idbPut(db, 'files', { id: fileRecord.id, name: file.name, data: parsedSheets, updatedAt: new Date().toISOString() });
  await idbPut(db, 'meta',  { key: 'lastFileId', value: fileRecord.id });

  setSyncBadge('synced');
  toast(tpl('toast_cloud_uploaded_tpl', {name: file.name}), 'ok');
  renderFileItem(fileRecord);

  // Highlight active item
  var list = document.getElementById('recentFiles');
  if (list) list.querySelectorAll('.sb-file-item').forEach(function(el) {
    el.classList.toggle('active', el.dataset.id === String(fileRecord.id));
  });
}

// ── Auto-save to Supabase ─────────────────────────────────────
function scheduleAutoSave() {
  if (!currentFileId) return;
  clearTimeout(autoSaveTimer);
  setSyncBadge('unsaved');
  autoSaveTimer = setTimeout(function() { autoSave(); }, 2000);
}

async function autoSave() {
  if (!currentFileId || isSyncing) return;
  isSyncing = true;
  setSyncBadge('syncing');
  try {
    var wb = XLSX.utils.book_new();
    Object.keys(sheets).forEach(function(sheetName) {
      var ws = XLSX.utils.aoa_to_sheet(sheets[sheetName]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });
    var blob = new Blob(
      [XLSX.write(wb, { bookType: 'xlsx', type: 'array' })],
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );

    var recRes = await sb.from('files').select('storage_path').eq('id', currentFileId).single();
    if (recRes.error) throw recRes.error;

    var upRes = await sb.storage.from('sheet-files').upload(recRes.data.storage_path, blob, { upsert: true });
    if (upRes.error) throw upRes.error;

    await sb.from('files').update({ updated_at: new Date().toISOString() }).eq('id', currentFileId);

    var db  = await openIDB();
    var rec = await idbGet(db, 'files', currentFileId);
    if (rec) { rec.data = sheets; rec.updatedAt = new Date().toISOString(); await idbPut(db, 'files', rec); }

    setSyncBadge('synced');
  } catch(e) {
    setSyncBadge('unsaved');
    toast(t('toast_autosave_failed'), 'warning');
  } finally {
    isSyncing = false;
  }
}

// ── Sync from Supabase (background refresh) ───────────────────
async function syncFromSupabase(fileId, localTimestamp = null) {
  try {
    var recRes = await sb.from('files').select('*').eq('id', fileId).single();
    if (recRes.error) return;
    // Cloud versiyonu local'den daha yeni değilse overwrite etme (race condition fix)
    if (localTimestamp && recRes.data.updated_at <= localTimestamp) return;
    var blobRes = await sb.storage.from('sheet-files').download(recRes.data.storage_path);
    if (blobRes.error) return;
    var ab = await blobRes.data.arrayBuffer();
    var wb = XLSX.read(ab);
    var updated = {};
    wb.SheetNames.forEach(function(name) {
      var ws  = wb.Sheets[name];
      var json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      var rowCount = Math.max(ROWS, json.length);
      var grid = Array.from({ length: rowCount }, function() { return Array(COLS).fill(''); });
      json.forEach(function(row, r) {
        row.forEach(function(cell, c) { if (c < COLS) grid[r][c] = String(cell != null ? cell : ''); });
      });
      updated[name] = grid;
    });
    // Merge: only update if cloud version is newer
    sheets = updated;
    buildGrid();
    var db = await openIDB();
    await idbPut(db, 'files', { id: fileId, name: recRes.data.name, data: updated, updatedAt: recRes.data.updated_at });
  } catch(e) {
    console.warn('syncFromSupabase error:', e);
  }
}

// ── Load file by ID ───────────────────────────────────────────
async function loadFileById(fileId) {
  // Son açık dosyayı kaydet
  if (fileId) localStorage.setItem('lastFileId', fileId);
  try {
    var db     = await openIDB();
    var cached = await idbGet(db, 'files', fileId);
    if (cached) {
      sheets      = cached.data;
      activeSheet = Object.keys(sheets)[0];
      currentFileId = fileId;
      document.getElementById('fileName').textContent        = cached.name;
      document.getElementById('fileNameInput').value         = cached.name;
      document.title = 'Mocksheets — ' + cached.name;
      buildGrid();
      renderSheetTabs();
      // Highlight active sidebar item
      var list = document.getElementById('recentFiles');
      if (list) list.querySelectorAll('.sb-file-item').forEach(function(el) {
        el.classList.toggle('active', el.dataset.id === String(fileId));
      });
      // Background sync from cloud — sadece cloud daha yeniyse overwrite et
      syncFromSupabase(fileId, cached.updatedAt);
      return;
    }

    // Not cached — download from Supabase
    var recRes = await sb.from('files').select('*').eq('id', fileId).single();
    if (recRes.error) { toast(t('toast_file_not_found'), 'err'); return; }
    var blobRes = await sb.storage.from('sheet-files').download(recRes.data.storage_path);
    if (blobRes.error) { toast(t('toast_file_dl_failed'), 'err'); return; }
    var ab = await blobRes.data.arrayBuffer();
    var wb = XLSX.read(ab);
    sheets = {};
    wb.SheetNames.forEach(function(name) {
      var ws   = wb.Sheets[name];
      var json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      var rowCount = Math.max(ROWS, json.length);
      var grid = Array.from({ length: rowCount }, function() { return Array(COLS).fill(''); });
      json.forEach(function(row, r) {
        row.forEach(function(cell, c) { if (c < COLS) grid[r][c] = String(cell != null ? cell : ''); });
      });
      sheets[name] = grid;
    });
    activeSheet   = wb.SheetNames[0];
    currentFileId = fileId;
    document.getElementById('fileName').textContent  = recRes.data.name;
    document.getElementById('fileNameInput').value   = recRes.data.name;
    document.title = 'Mocksheets — ' + recRes.data.name;
    buildGrid();
    renderSheetTabs();

    await idbPut(db, 'files', { id: fileId, name: recRes.data.name, data: sheets, updatedAt: recRes.data.updated_at });
    await idbPut(db, 'meta',  { key: 'lastFileId', value: fileId });

    var list = document.getElementById('recentFiles');
    if (list) list.querySelectorAll('.sb-file-item').forEach(function(el) {
      el.classList.toggle('active', el.dataset.id === String(fileId));
    });
  } catch(e) {
    toast(t('toast_file_open_failed'), 'err');
    console.error('loadFileById error:', e);
  }
}

// ── Version history ───────────────────────────────────────────
async function saveVersion(label) {
  if (!currentFileId) { toast(t('toast_open_file_first'), 'warning'); return; }
  try {
    setSyncBadge('syncing');
    var recRes = await sb.from('files').select('*').eq('id', currentFileId).single();
    if (recRes.error) throw recRes.error;
    var blobRes = await sb.storage.from('sheet-files').download(recRes.data.storage_path);
    if (blobRes.error) throw blobRes.error;

    var versionPath = recRes.data.storage_path.replace('.xlsx', '_v' + Date.now() + '.xlsx');
    await sb.storage.from('sheet-files').upload(versionPath, blobRes.data, { upsert: false });

    var verRes = await sb.from('file_versions')
      .select('version_number')
      .eq('file_id', currentFileId)
      .order('version_number', { ascending: false })
      .limit(1);
    var nextVersion = (verRes.data && verRes.data[0] ? verRes.data[0].version_number + 1 : 1);

    await sb.from('file_versions').insert({
      file_id:        currentFileId,
      version_number: nextVersion,
      storage_path:   versionPath,
      label:          label || ('Version ' + nextVersion)
    });

    setSyncBadge('synced');
    toast('\u2713 Version ' + nextVersion + ' saved', 'success');
  } catch(e) {
    setSyncBadge('unsaved');
    toast(t('toast_version_save_failed'), 'err');
  }
}

async function restoreVersion(versionId) {
  try {
    var verRes = await sb.from('file_versions').select('*').eq('id', versionId).single();
    if (verRes.error) throw verRes.error;
    var blobRes = await sb.storage.from('sheet-files').download(verRes.data.storage_path);
    if (blobRes.error) throw blobRes.error;
    var ab = await blobRes.data.arrayBuffer();
    var wb = XLSX.read(ab);
    sheets = {};
    wb.SheetNames.forEach(function(name) {
      var ws   = wb.Sheets[name];
      var json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      var rowCount = Math.max(ROWS, json.length);
      var grid = Array.from({ length: rowCount }, function() { return Array(COLS).fill(''); });
      json.forEach(function(row, r) {
        row.forEach(function(cell, c) { if (c < COLS) grid[r][c] = String(cell != null ? cell : ''); });
      });
      sheets[name] = grid;
    });
    activeSheet = wb.SheetNames[0];
    buildGrid();
    renderSheetTabs();
    toast(t('toast_reverted'), 'info');
  } catch(e) {
    toast(t('toast_version_load_failed'), 'err');
  }
}

// ── Share file ────────────────────────────────────────────────
async function shareFile(fileId) {
  var fid = fileId || currentFileId;
  if (!fid) { toast('Open a file first', 'warning'); return; }
  try {
    var token = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    var res = await sb.from('files').update({ share_token: token, is_shared: true }).eq('id', fid);
    if (res.error) throw res.error;
    var shareUrl = window.location.origin + '/shared.html?token=' + token;
    if (navigator.clipboard) navigator.clipboard.writeText(shareUrl).catch(function(){});
    showShareModal(shareUrl);
    if (fid === currentFileId) currentFileId = fid; // ensure stays set
  } catch(e) {
    toast(t('toast_sharing_failed'), 'err');
  }
}

async function stopSharing() {
  if (!currentFileId) return;
  var res = await sb.from('files').update({ is_shared: false, share_token: null }).eq('id', currentFileId);
  if (res.error) { toast(t('toast_unshare_failed'), 'err'); return; }
  toast(t('toast_unshared'), 'info');
}

function showShareModal(shareUrl) {
  if (typeof showModal !== 'function') { alert('Share link: ' + shareUrl); return; }
  showModal(
    '<h2>🔗 Share Link</h2>' +
    '<p style="font-size:13px;color:#94a3b8;margin-bottom:12px;">Anyone with this link can view your file.</p>' +
    '<div style="display:flex;gap:8px;align-items:center;">' +
      '<input class="finput" style="flex:1;font-size:12px;" readonly value="' + shareUrl + '" onclick="this.select()">' +
      '<button class="btn btn-primary" onclick="navigator.clipboard&&navigator.clipboard.writeText(\'' + shareUrl + '\');toast(\'Copied ✓\',\'ok\')">Copy</button>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" style="color:#ef4444;" onclick="stopSharing();closeModal()">Remove Sharing</button>' +
      '<button class="btn btn-ghost" onclick="closeModal()">Close</button>' +
    '</div>'
  );
}

// ── Delete file ───────────────────────────────────────────────
async function deleteFile(fileId) {
  if (!window.confirm('Are you sure you want to permanently delete this file?')) return;
  try {
    // Get storage path first
    var recRes = await sb.from('files').select('storage_path').eq('id', fileId).single();
    if (!recRes.error && recRes.data) {
      await sb.storage.from('sheet-files').remove([recRes.data.storage_path]);
    }
    // file_versions cascade should handle versions via FK ON DELETE CASCADE
    await sb.from('files').delete().eq('id', fileId);

    // IndexedDB cleanup
    var db = await openIDB();
    await idbDelete(db, 'files', fileId);
    var lastMeta = await idbGet(db, 'meta', 'lastFileId');
    if (lastMeta && lastMeta.value === fileId) {
      await idbDelete(db, 'meta', 'lastFileId');
    }

    // Remove from sidebar
    var el = document.querySelector('.sb-file-item[data-id="' + fileId + '"]');
    if (el) el.remove();

    // Reset state if deleting current file
    if (currentFileId === fileId) {
      currentFileId = null;
      sheets = { Sheet1: createEmptySheet() };
      activeSheet = 'Sheet1';
      buildGrid();
      renderSheetTabs();
    }

    toast(t('toast_file_deleted'), 'info');
  } catch(e) {
    toast(t('toast_file_del_failed'), 'err');
  }
}

// ── Render sidebar file item ──────────────────────────────────
function renderFileItem(file) {
  var list = document.getElementById('recentFiles');
  if (!list) return;

  // Remove duplicate if exists
  var existing = list.querySelector('.sb-file-item[data-id="' + file.id + '"]');
  if (existing) existing.remove();

  var div = document.createElement('div');
  div.className = 'sb-file-item' + (currentFileId === file.id ? ' active' : '');
  div.dataset.id = file.id;
  div.title      = file.name;
  div.onclick    = function() { loadFileById(file.id); };
  div.innerHTML  =
    '<div class="sfi-icon">📄</div>' +
    '<div class="sfi-info">' +
      '<div class="sfi-name">' + escHtml(file.name) + '</div>' +
      '<div class="sfi-meta">' + formatFileDate(file.updated_at) + '</div>' +
    '</div>' +
    '<div class="sfi-actions">' +
      '<button onclick="event.stopPropagation();shareFile(\'' + file.id + '\')" title="Share">🔗</button>' +
      '<button onclick="event.stopPropagation();deleteFile(\'' + file.id + '\')" title="Delete">🗑</button>' +
    '</div>';

  // Prepend so most recent is on top
  list.insertBefore(div, list.firstChild);
}

function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function formatFileDate(iso) {
  if (!iso) return '';
  try {
    var d = new Date(iso);
    var now = new Date();
    var diff = now - d;
    if (diff < 60000)          return 'Just now';
    if (diff < 3600000)        return Math.floor(diff / 60000) + ' min ago';
    if (diff < 86400000)       return Math.floor(diff / 3600000) + ' hr ago';
    if (diff < 7 * 86400000)   return Math.floor(diff / 86400000) + ' days ago';
    return d.toLocaleDateString('en-US', { day:'2-digit', month:'short', year:'numeric' });
  } catch(e) { return ''; }
}
// ── COMPETITOR COMPARISON ─────────────────────────────────────
function showCompareModal() {
  const modal = document.getElementById('compareModal');
  if (modal) modal.style.display = 'flex';
}

function closeCompareModal(event) {
  if (event && event.target !== document.getElementById('compareModal')) return;
  const modal = document.getElementById('compareModal');
  if (modal) modal.style.display = 'none';
}

function generateAutoReport() {
  const inp = document.getElementById('chatInput');
  if (inp) {
    inp.value = 'Auto-generate report';
    if (typeof sendChat === 'function') sendChat();
  }
}

// ── TOAST SYSTEM ───────────────────────────────────

function showToast(message, type = 'success', duration = 3500) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icon = type === 'success' ? '✓' : '✕';
  const toastEl = document.createElement('div');
  toastEl.className = `toast ${type}`;
  toastEl.innerHTML = `
    <span class="toast-icon">${icon}</span>
    <span class="toast-msg">${message}</span>
    <button class="toast-close" onclick="removeToast(this.parentElement)">×</button>
  `;

  container.appendChild(toastEl);

  setTimeout(() => removeToast(toastEl), duration);
}

function removeToast(toastEl) {
  if (!toastEl || !toastEl.parentElement) return;
  toastEl.style.animation = 'toastOut 0.25s ease forwards';
  setTimeout(() => toastEl.remove(), 250);
}

// ── CHAT BAR FUNCTIONS ─────────────────────────────

function fillChatInput(chip) {
  const input = document.getElementById('chatInput');
  if (!input) return;
  const titleEl = chip.querySelector('.chip-title');
  const text = titleEl
    ? titleEl.textContent.trim()
    : chip.textContent.trim()
        .replace(/^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27FF}\s]+/gu, '')
        .trim();
  input.value = text;
  input.focus();
  autoResizeChatInput(input);
}

function autoResizeChatInput(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}


function handleChatAttachment(input) {
  const files = Array.from(input.files);
  if (!files.length) return;

  files.forEach(file => {
    chatAttachments.push(file);
    renderAttachmentChip(file);
  });
  input.value = '';
}

function renderAttachmentChip(file) {
  const bar = document.getElementById('attachmentPreviewBar');
  if (!bar) return;
  const chip = document.createElement('div');
  chip.className = 'attachment-chip';
  chip.dataset.filename = file.name;
  chip.innerHTML = `
    <span>📎 ${file.name}</span>
    <button onclick="removeAttachmentChip('${file.name}')" title="Remove">×</button>
  `;
  bar.appendChild(chip);
}

function removeAttachmentChip(filename) {
  chatAttachments = chatAttachments.filter(f => f.name !== filename);
  const chip = document.querySelector(
    `.attachment-chip[data-filename="${filename}"]`
  );
  if (chip) chip.remove();
}

// ── Chat Bar ──────────────────────────────────────────
function expandChat() {
  document.getElementById('chat-messages')?.classList.add('has-messages');
}

function collapseChat() {
  // Fixed floating bar — collapse yok
}

function handleChatInput(value) {
  const chips = document.getElementById('chat-chips');
  const sendBtn = document.getElementById('chat-send');
  if (value.trim().length > 0) {
    chips?.classList.add('hidden');
    sendBtn?.classList.add('active');
  } else {
    chips?.classList.remove('hidden');
    sendBtn?.classList.remove('active');
  }
}

function useChip(text) {
  const input = document.getElementById('chat-input');
  if (input) { input.value = text; input.focus(); handleChatInput(text); }
}

function addMessage(text, type) {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  expandChat();
  if (type === 'user') {
    const el = document.createElement('div');
    el.className = 'msg-user';
    el.textContent = text;
    msgs.appendChild(el);
  } else {
    const wrapper = document.createElement('div');
    wrapper.className = 'msg-ai';
    const avatarEl = document.createElement('div');
    avatarEl.className = 'msg-ai-avatar';
    avatarEl.textContent = 'M';
    const bubbleEl = document.createElement('div');
    bubbleEl.className = 'msg-ai-bubble';
    bubbleEl.textContent = text;
    wrapper.appendChild(avatarEl);
    wrapper.appendChild(bubbleEl);
    msgs.appendChild(wrapper);
  }
  msgs.scrollTop = msgs.scrollHeight;
  while (msgs.children.length > 20) msgs.removeChild(msgs.firstChild);
}

function showTyping() {
  const msgs = document.getElementById('chat-messages');
  if (!msgs) return;
  const el = document.createElement('div');
  el.className = 'msg-ai msg-typing';
  el.id = 'typing-indicator';
  el.innerHTML = `<div class="msg-ai-avatar">M</div><div class="msg-ai-bubble"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>`;
  msgs.appendChild(el);
  msgs.scrollTop = msgs.scrollHeight;
  expandChat();
}

function hideTyping() {
  const el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function showProgress() {
  const p = document.getElementById('chat-progress');
  if (p) p.classList.add('active');
}

function hideProgress() {
  const p = document.getElementById('chat-progress');
  if (p) p.classList.remove('active');
}

// ── Auth token helper ────────────────────────────
function getAuthToken() {
  try {
    const key = Object.keys(localStorage)
      .find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!key) return null;
    const data = JSON.parse(localStorage.getItem(key));
    return data?.access_token || null;
  } catch { return null; }
}

// ── Kullanım bilgisi ─────────────────────────────
let userUsage = null;
let userPlan = 'free';

async function loadUserUsage() {
  const token = getAuthToken();
  if (!token) return;

  try {
    const res = await fetch(API_URL + '/api/usage', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) return;
    userUsage = await res.json();
    userPlan = userUsage.plan;
    updateUsageUI();
  } catch (e) {
    console.warn('Usage yüklenemedi:', e);
  }
}

function updateUsageUI() {
  if (!userUsage) return;

  const planColors = { free: '#6B7280', pro: '#4F46E5', promax: '#7C3AED', business: '#059669', ultra: '#DC2626' };
  const badges = { free: '🆓 Ücretsiz', pro: '⭐ Pro', promax: '🚀 Pro Max', business: '🏢 İş Planı', ultra: '💎 Ultra' };

  const planEl = document.getElementById('sbPlanBadge');
  if (planEl) {
    planEl.textContent = badges[userPlan] || userPlan;
    planEl.style.background = (planColors[userPlan] || '#6B7280') + '20';
    planEl.style.color = planColors[userPlan] || '#6B7280';
    planEl.style.display = 'inline-flex';
  }

  const monthLimit = userUsage.limits?.ai_commands_per_month;
  if (monthLimit) {
    const used = userUsage.used?.this_month || 0;
    const pct = Math.min((used / monthLimit) * 100, 100);

    const usageBar = document.getElementById('sbUsageBar');
    const usageText = document.getElementById('sbUsageText');

    if (usageBar) {
      usageBar.style.width = pct + '%';
      usageBar.style.background = pct > 80 ? '#EF4444' : pct > 60 ? '#F59E0B' : '#4F46E5';
    }
    if (usageText) {
      usageText.textContent = 'Bu ay ' + used + ' / ' + monthLimit + ' AI komutu kullanıldı.';
    }
  }

  const teamBtn = document.getElementById('team-manage-btn');
  if (teamBtn) {
    teamBtn.style.display = (userUsage.plan === 'business' && userUsage.team_id) ? 'block' : 'none';
  }
}

function handleLockedFeature(feature) {
  const featureNames = {
    integrations: 'Entegrasyonlar',
    auto_report: 'Otomatik Rapor',
    competitor_analysis: 'Rakip Analizi',
    accounting_formulas: 'Muhasebe Formülleri'
  };
  showUpgradeModal(featureNames[feature] || feature);
}

function showUpgradeModal(featureName) {
  const existing = document.getElementById('upgradeModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'upgradeModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';

  const planInfo = userUsage || { plan: 'free' };

  modal.innerHTML = `
    <div style="background:white;border-radius:20px;padding:40px;max-width:440px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2);position:relative">
      <button onclick="document.getElementById('upgradeModal').remove()" style="position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;font-size:18px;color:#9CA3AF">✕</button>
      <div style="font-size:48px;margin-bottom:16px">🔒</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px;color:#111827">${featureName} Pro Plan Gerektirir</div>
      <div style="font-size:14px;color:#6B7280;margin-bottom:24px;line-height:1.6">
        Şu anki planınız: <strong>${planInfo.plan === 'free' ? 'Ücretsiz' : planInfo.plan}</strong><br>
        ${featureName} özelliğini kullanmak için Pro veya İş planına geçin.
      </div>
      <div style="background:#F9FAFB;border-radius:10px;padding:16px;text-align:left;margin-bottom:24px">
        <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#4F46E5">⭐ Pro Plan — $1/ay (ilk 1 ay)</div>
        <div style="font-size:12px;color:#6B7280;line-height:1.8">✓ 200 AI komut/ay<br>✓ Tüm entegrasyonlar<br>✓ Otomatik rapor<br>✓ Rakip analizi</div>
      </div>
      <div style="display:flex;gap:10px">
        <button onclick="document.getElementById('upgradeModal').remove()" style="flex:1;padding:11px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:white;color:#374151">Şimdi Değil</button>
        <button onclick="window.location.href='/pricing'" style="flex:2;padding:11px;border:none;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:#4F46E5;color:white">⬆️ Planı Yükselt</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

function showLimitModal(errorData) {
  const existing = document.getElementById('limitModal');
  if (existing) existing.remove();

  const isDaily = errorData.code === 'DAILY_LIMIT_REACHED';
  const modal = document.createElement('div');
  modal.id = 'limitModal';
  modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px)';

  const pct = Math.min(((errorData.used || 0) / (errorData.limit || 1)) * 100, 100);

  modal.innerHTML = `
    <div style="background:white;border-radius:20px;padding:40px;max-width:440px;width:90%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.2);position:relative">
      <button onclick="document.getElementById('limitModal').remove()" style="position:absolute;top:16px;right:16px;background:none;border:none;cursor:pointer;font-size:18px;color:#9CA3AF">✕</button>
      <div style="font-size:48px;margin-bottom:16px">${isDaily ? '⏰' : '📊'}</div>
      <div style="font-size:20px;font-weight:800;margin-bottom:8px;color:#111827">${isDaily ? 'Günlük Limit Doldu' : 'Aylık Limit Doldu'}</div>
      <div style="font-size:14px;color:#6B7280;margin-bottom:20px;line-height:1.6">
        ${errorData.error}<br>
        <strong>Kullanılan:</strong> ${errorData.used}/${errorData.limit} komut<br>
        <strong>Sıfırlanma:</strong> ${errorData.reset}
      </div>
      <div style="background:#F3F4F6;border-radius:100px;height:8px;margin-bottom:24px;overflow:hidden">
        <div style="width:${pct}%;height:100%;background:#EF4444;border-radius:100px"></div>
      </div>
      <div style="display:flex;gap:10px">
        <button onclick="document.getElementById('limitModal').remove()" style="flex:1;padding:11px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:white;color:#374151">Tamam</button>
        <button onclick="window.location.href='/pricing'" style="flex:2;padding:11px;border:none;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:#4F46E5;color:white">⬆️ Limiti Artır</button>
      </div>
    </div>`;

  document.body.appendChild(modal);
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
}

// Spin animation
(function() {
  const spinStyle = document.createElement('style');
  spinStyle.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(spinStyle);
})();

function handleCompareFile(input, role) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) {
    toast('File too large (max 10MB)', 'err');
    input.value = '';
    return;
  }
  const ext = file.name.split('.').pop().toLowerCase();
  if (!['xlsx', 'xls', 'csv'].includes(ext)) {
    toast('Only .xlsx, .xls, and CSV files are supported', 'err');
    input.value = '';
    return;
  }
  const nameEl = document.getElementById(role === 'my' ? 'myDataFileName' : 'rivalDataFileName');
  if (nameEl) nameEl.textContent = '⏳ ' + file.name;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const isCSV = ext === 'csv';
      const wb = XLSX.read(e.target.result, { type: isCSV ? 'string' : 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const csv = XLSX.utils.sheet_to_csv(ws);
      const rowCount = csv.split('\n').filter(function(r) { return r.trim(); }).length;
      if (nameEl) nameEl.textContent = '✅ ' + file.name + ' (' + rowCount + ' rows)';
      toast(tpl(role === 'my' ? 'toast_my_data_loaded_tpl' : 'toast_rival_data_loaded_tpl', {name: file.name}), 'ok');
    } catch(err) {
      if (nameEl) nameEl.textContent = '❌ ' + t('error');
      toast('Could not read file: ' + err.message, 'err');
    }
  };
  if (ext === 'csv') reader.readAsText(file, 'UTF-8');
  else reader.readAsBinaryString(file);
  input.value = '';
}

// ═══════════════════════════════════════════════════════════════
//  LANGUAGE CHANGE — re-render dynamic UI on lang switch
// ═══════════════════════════════════════════════════════════════
document.addEventListener('langchange', function() {
  if (typeof updateStatus === 'function') updateStatus();
  if (typeof renderVersionHistory === 'function') renderVersionHistory();
  if (typeof renderRecentFiles === 'function') renderRecentFiles();
  if (typeof renderSheetTabs === 'function') renderSheetTabs();
  if (typeof updateThemeIcon === 'function') updateThemeIcon();
});

// ═══════════════════════════════════════════════════════════════
//  YENİ AI ACTION HANDLER'LAR — v2 özellikler
// ═══════════════════════════════════════════════════════════════

function findTextColumn(headers) {
  const keywords = ['yorum', 'açıklama', 'not', 'metin', 'feedback', 'comment', 'description', 'text', 'görüş', 'şikayet'];
  const idx = (headers || []).findIndex(h => keywords.some(k => String(h).toLowerCase().includes(k)));
  return idx >= 0 ? idx : (headers || []).findIndex(h => h);
}

function findNumericColumn(rows) {
  const headers = rows[0] || [];
  for (let ci = 0; ci < headers.length; ci++) {
    const numCount = rows.slice(1).filter(r => {
      const v = parseFloat(String((r || [])[ci] || '').replace(/[,₺$€\s]/g, ''));
      return !isNaN(v);
    }).length;
    if (numCount > (rows.length - 1) * 0.5) return ci;
  }
  return -1;
}

// ── DUYGU ANALİZİ ─────────────────────────────────────────────
async function doSentimentAnalysis(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const textCol = findTextColumn(rows[0]);
  if (textCol === -1) { showToast('⚠️ Metin sütunu bulunamadı', 'error'); return; }

  const texts = rows.slice(1).map(r => (r || [])[textCol]).filter(Boolean).slice(0, 50);
  if (!texts.length) { showToast('⚠️ Analiz edilecek metin yok', 'error'); return; }

  showToast('⏳ Duygu analizi yapılıyor...', 'info');

  let labels;
  try {
    const token = getAuthToken();
    const res = await fetch(API_URL + '/api/sentiment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer ' + token } : {}) },
      body: JSON.stringify({ texts })
    });
    if (res.ok) {
      const result = await res.json();
      labels = result.labels;
    }
  } catch (e) { /* fallback below */ }

  if (!labels) {
    const pos = ['iyi', 'güzel', 'harika', 'mükemmel', 'teşekkür', 'memnun', 'süper', 'beğendim', 'sevdim', 'başarılı'];
    const neg = ['kötü', 'berbat', 'korkunç', 'rezalet', 'sorun', 'hata', 'bozuk', 'çalışmıyor', 'iade', 'şikayet'];
    labels = texts.map(t => {
      const txt = String(t).toLowerCase();
      const p = pos.filter(w => txt.includes(w)).length;
      const n = neg.filter(w => txt.includes(w)).length;
      return p > n ? 'Pozitif' : n > p ? 'Negatif' : 'Nötr';
    });
  }

  const newCol = (rows[0] || []).length;
  rows[0][newCol] = 'Duygu';
  labels.forEach((label, i) => {
    if (!rows[i + 1]) return;
    rows[i + 1][newCol] = label;
    const color = label === 'Pozitif' ? '#bbf7d0' : label === 'Negatif' ? '#fecaca' : '#fef08a';
    highlightCell(i + 1, newCol, color);
  });
  buildGrid(rows);
  showToast((data.reply || '✓ Duygu analizi tamamlandı') + ' (' + labels.length + ' satır)', 'success');
}

// ── KATEGORİ SINIFLANDIRMA ────────────────────────────────────
function doClassify(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const categories = Array.isArray(data.categories) ? data.categories : [];
  if (!categories.length) {
    showToast('⚠️ Kategori belirtilmedi. Örn: "giderleri personel kira araç olarak sınıfla"', 'info');
    return;
  }

  const newCol = (rows[0] || []).length;
  rows[0][newCol] = 'Kategori';
  let classified = 0;

  rows.slice(1).forEach((row, i) => {
    const txt = (row || []).join(' ').toLowerCase();
    let matched = 'Diğer';
    for (const cat of categories) {
      if (txt.includes(cat.toLowerCase())) { matched = cat; break; }
    }
    rows[i + 1][newCol] = matched;
    classified++;
  });

  buildGrid(rows);
  showToast((data.reply || '✓ Sınıflandırıldı') + ' (' + classified + ' satır, ' + categories.length + ' kategori)', 'success');
}

// ── AÇIKLAMA ──────────────────────────────────────────────────
function doExplain(data) {
  const formulaName = (data.formula_name || '').toLowerCase();
  const explanations = {
    vlookup:     'DÜŞEYARA (VLOOKUP) — Tabloda bir değer arar ve aynı satırdan başka sütunu döndürür. Örn: ürün koduna göre fiyat bul. Sözdizimi: =DÜŞEYARA(aranan; tablo; sütun; 0)',
    sumif:       'ETOPLA (SUMIF) — Belirli koşulu karşılayan hücreleri toplar. Örn: sadece İstanbul satışlarını topla. Sözdizimi: =ETOPLA(aralık; kriter; toplam_aralığı)',
    if:          'EĞER (IF) — Koşul doğruysa bir değer, yanlışsa başka bir değer. Sözdizimi: =EĞER(koşul; doğruysa; yanlışsa)',
    countif:     'EĞERSAY (COUNTIF) — Koşula uyan hücreleri sayar. Sözdizimi: =EĞERSAY(aralık; kriter)',
    index_match: 'İNDİS+KAÇINCI (INDEX+MATCH) — DÜŞEYARA\'dan güçlü, herhangi bir sütunda arayabilir. Sözdizimi: =İNDİS(döndürülecek; KAÇINCI(aranan; arama_sütunu; 0))',
    sumifs:      'ÇOKETOPLA (SUMIFS) — Birden fazla koşula göre toplar. Sözdizimi: =ÇOKETOPLA(toplam; aralık1; kriter1; aralık2; kriter2)',
    pivot:       'Pivot Tablo — Büyük verileri kategorilere göre özetler. Veri > Özet Tablo menüsünden oluşturulur.'
  };
  const text = explanations[formulaName] || 'Bu işlev seçili veriler üzerinde çalışır. Daha spesifik soru sormak için örn: "vlookup açıkla", "sumif nedir" diyebilirsiniz.';
  addMessage('💡 ' + text, 'ai');
  showToast(data.reply || '✓ Açıklama hazırlandı', 'success');
}

// ── ANOMALİ TESPİTİ ──────────────────────────────────────────
function doAnomalyDetection(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 3) return;

  let count = 0;
  (rows[0] || []).forEach((header, ci) => {
    const vals = rows.slice(1).map(r => parseFloat(String((r || [])[ci] || '').replace(/[,₺$€\s]/g, ''))).filter(n => !isNaN(n));
    if (vals.length < 3) return;

    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const std = Math.sqrt(vals.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0) / vals.length);
    if (std === 0) return;

    rows.slice(1).forEach((row, ri) => {
      const v = parseFloat(String((row || [])[ci] || '').replace(/[,₺$€\s]/g, ''));
      if (!isNaN(v) && Math.abs((v - mean) / std) > 2.5) {
        highlightCell(ri + 1, ci, data.color || '#fecaca');
        count++;
      }
    });
  });

  buildGrid(rows);
  showToast((data.reply || '✓ Anomali tespiti tamamlandı') + ' (' + count + ' aykırı değer)', count > 0 ? 'success' : 'info');
}

// ── FORECAST ──────────────────────────────────────────────────
function doForecast(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 3) return;

  const periods = parseInt(data.periods) || 3;
  const numCol = findNumericColumn(rows);
  if (numCol === -1) { showToast('⚠️ Sayısal sütun bulunamadı', 'error'); return; }

  const vals = rows.slice(1).map(r => parseFloat(String((r || [])[numCol] || '').replace(/[,₺$€\s]/g, ''))).filter(n => !isNaN(n));
  if (vals.length < 2) { showToast('⚠️ Tahmin için yeterli veri yok', 'error'); return; }

  const n = vals.length;
  const xMean = (n - 1) / 2;
  const yMean = vals.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  vals.forEach((v, i) => { num += (i - xMean) * (v - yMean); den += Math.pow(i - xMean, 2); });
  const slope = den !== 0 ? num / den : 0;
  const intercept = yMean - slope * xMean;

  const forecasts = [];
  for (let p = 0; p < periods; p++) {
    const fVal = Math.round((intercept + slope * (n + p)) * 100) / 100;
    forecasts.push(fVal);
    const newRow = new Array((rows[0] || []).length).fill('');
    newRow[0] = 'Tahmin ' + (p + 1);
    newRow[numCol] = fVal;
    rows.push(newRow);
    highlightCell(rows.length - 1, numCol, '#bfdbfe');
  }

  buildGrid(rows);
  showToast((data.reply || '✓ Tahmin hesaplandı') + ': ' + forecasts.map(v => Number(v).toLocaleString('tr-TR')).join(', '), 'success');
}

// ── ISIL HARİTA ───────────────────────────────────────────────
function doHeatmap(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const colors = ['#bfdbfe', '#ddd6fe', '#fef08a', '#fed7aa', '#fecaca'];
  let count = 0;

  (rows[0] || []).forEach((header, ci) => {
    const valRows = rows.slice(1).map((r, ri) => ({
      v: parseFloat(String((r || [])[ci] || '').replace(/[,₺$€\s]/g, '')),
      ri
    })).filter(x => !isNaN(x.v));

    if (valRows.length < 2) return;
    const mn = Math.min(...valRows.map(x => x.v));
    const mx = Math.max(...valRows.map(x => x.v));
    const range = mx - mn || 1;

    valRows.forEach(({ v, ri }) => {
      const idx = Math.min(Math.floor(((v - mn) / range) * colors.length), colors.length - 1);
      highlightCell(ri + 1, ci, colors[idx]);
      count++;
    });
  });

  buildGrid(rows);
  showToast((data.reply || '✓ Isıl harita uygulandı') + ' (' + count + ' hücre)', 'success');
}

// ── METİN ÇIKARIMI ────────────────────────────────────────────
function doExtract(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const type = data.type || 'email';
  const patterns = {
    email:  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    phone:  /(\+?90|0)?[\s\-]?[2-5]\d{2}[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2}/,
    tc_id:  /\b[1-9]\d{10}\b/,
    number: /-?\d+(?:[.,]\d+)?/,
    date:   /\b\d{1,2}[.\/-]\d{1,2}[.\/-]\d{2,4}\b/
  };
  const labels = { email: 'E-posta', phone: 'Telefon', tc_id: 'TC Kimlik', number: 'Sayı', date: 'Tarih', city: 'Şehir', name_split: 'Ad', tax_id: 'Vergi No' };
  const newCol = (rows[0] || []).length;
  rows[0][newCol] = labels[type] || 'Çıkarılan';
  let count = 0;

  if (type === 'name_split') {
    rows[0][newCol] = 'Ad';
    rows[0][newCol + 1] = 'Soyad';
    rows.slice(1).forEach((row, i) => {
      const parts = String((row || [])[0] || '').trim().split(/\s+/);
      rows[i + 1][newCol] = parts[0] || '';
      rows[i + 1][newCol + 1] = parts.slice(1).join(' ') || '';
      if (parts.length > 1) count++;
    });
  } else {
    const pat = patterns[type];
    rows.slice(1).forEach((row, i) => {
      const text = (row || []).join(' ');
      const m = pat ? text.match(pat) : null;
      rows[i + 1][newCol] = m ? m[0] : '';
      if (m) count++;
    });
  }

  buildGrid(rows);
  showToast((data.reply || '✓ Çıkarım yapıldı') + ' (' + count + ' bulunan)', 'success');
}

// ── GRUPLAMA ──────────────────────────────────────────────────
function doGroupBy(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const colName = String(data.column || '').toLowerCase();
  const headers = rows[0] || [];
  const groupCol = headers.findIndex(h => String(h).toLowerCase().includes(colName));

  if (groupCol === -1) {
    showToast('⚠️ "' + (data.column || '') + '" sütunu bulunamadı', 'error');
    return;
  }

  const groups = {};
  rows.slice(1).forEach(row => {
    const key = String((row || [])[groupCol] || 'Diğer');
    if (!groups[key]) groups[key] = { count: 0, sum: 0 };
    groups[key].count++;
    for (let ci = 0; ci < (row || []).length; ci++) {
      if (ci === groupCol) continue;
      const n = parseFloat(String(row[ci] || '').replace(/[,₺$€\s]/g, ''));
      if (!isNaN(n)) { groups[key].sum += n; break; }
    }
  });

  const lines = Object.entries(groups)
    .sort((a, b) => b[1].sum - a[1].sum)
    .slice(0, 15)
    .map(([k, v]) => k + ': ' + Number(v.sum).toLocaleString('tr-TR') + ' (' + v.count + ' kayıt)');

  addMsg('ai', '📊 <strong>Gruplama Sonuçları:</strong><br>' + lines.join('<br>'));
  showToast((data.reply || '✓ Gruplama tamamlandı') + ' (' + Object.keys(groups).length + ' grup)', 'success');
}

// ── KARŞILAŞTIRMA ─────────────────────────────────────────────
function doCompare(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const colToIdx = s => /^[A-Z]$/i.test(s) ? s.toUpperCase().charCodeAt(0) - 65 : (rows[0] || []).findIndex(h => String(h).toLowerCase().includes(String(s).toLowerCase()));
  const ci1 = colToIdx(data.column1 || 'B');
  const ci2 = colToIdx(data.column2 || 'C');

  if (ci1 === -1 || ci2 === -1) {
    showToast('⚠️ Karşılaştırılacak sütunlar bulunamadı. "A ve B sütununu karşılaştır" gibi deneyin', 'error');
    return;
  }

  const newCol = (rows[0] || []).length;
  rows[0][newCol] = 'Fark';
  rows[0][newCol + 1] = '%Değişim';
  let up = 0, down = 0;

  rows.slice(1).forEach((row, i) => {
    const v1 = parseFloat(String((row || [])[ci1] || '').replace(/[,₺$€\s]/g, ''));
    const v2 = parseFloat(String((row || [])[ci2] || '').replace(/[,₺$€\s]/g, ''));
    if (!isNaN(v1) && !isNaN(v2)) {
      const diff = v2 - v1;
      const pct = v1 !== 0 ? Math.round((diff / Math.abs(v1)) * 100) : 0;
      rows[i + 1][newCol] = Math.round(diff * 100) / 100;
      rows[i + 1][newCol + 1] = pct + '%';
      if (diff > 0) { highlightCell(i + 1, newCol, '#bbf7d0'); up++; }
      else if (diff < 0) { highlightCell(i + 1, newCol, '#fecaca'); down++; }
    }
  });

  buildGrid(rows);
  showToast('✓ Karşılaştırma: ' + up + ' artış, ' + down + ' düşüş', 'success');
}

// ── TOPLU AI İŞLEMİ ──────────────────────────────────────────
async function doBatchAI(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const task = data.task || 'summarize';
  const textCol = findTextColumn(rows[0]);
  const srcCol = textCol >= 0 ? textCol : 0;
  const taskLabels = { summarize: 'Özet', translate: 'Çeviri', generate_description: 'Açıklama', classify: 'Kategori', extract_keywords: 'Anahtar Kelimeler' };
  const newCol = (rows[0] || []).length;
  rows[0][newCol] = taskLabels[task] || 'AI Sonuç';

  const maxRows = 20;
  let processed = 0;
  showToast('⏳ Toplu işlem başladı (max ' + maxRows + ' satır)...', 'info');

  const token = getAuthToken();
  const headers = { 'Content-Type': 'application/json', ...(token ? { 'Authorization': 'Bearer ' + token } : {}) };

  for (let i = 1; i < Math.min(rows.length, maxRows + 1); i++) {
    const text = String((rows[i] || [])[srcCol] || '');
    if (!text.trim()) continue;
    try {
      const res = await fetch(API_URL + '/api/batch-ai', { method: 'POST', headers, body: JSON.stringify({ task, text }) });
      if (res.ok) {
        const r = await res.json();
        rows[i][newCol] = r.result || '';
        processed++;
        if (processed % 5 === 0) buildGrid(rows);
      }
    } catch (e) { /* skip row */ }
  }

  buildGrid(rows);
  showToast((data.reply || '✓ Toplu işlem tamamlandı') + ' (' + processed + ' satır)', 'success');
}

// ── GELİŞMİŞ VERİ TEMİZLEME ─────────────────────────────────
function doCleanData(data) {
  const rows = sheets[activeSheet];
  if (!rows || rows.length < 2) return;

  const check = data.check || 'trim';
  let changes = 0;

  rows.slice(1).forEach((row, ri) => {
    (row || []).forEach((cell, ci) => {
      let val = String(cell != null ? cell : '');
      let newVal = val;

      if (check === 'trim' || check === 'all') {
        newVal = newVal.trim().replace(/\s+/g, ' ');
      }
      if (check === 'currency' || check === 'all') {
        newVal = newVal.replace(/[₺$€£]/g, '').trim();
      }
      if (check === 'punctuation') {
        newVal = newVal.replace(/[.,;:!?'"()\[\]{}]/g, '').trim();
      }
      if (check === 'phones') {
        const digits = val.replace(/\D/g, '');
        if (digits.length === 10) newVal = '0' + digits;
        else if (digits.length === 11 && digits[0] === '0') newVal = digits;
      }
      if (check === 'fill_empty' && !newVal.trim()) {
        newVal = '-';
      }

      if (newVal !== val) { rows[ri + 1][ci] = newVal; changes++; }
    });
  });

  buildGrid(rows);
  showToast((data.reply || '✓ Veri temizlendi') + ' (' + changes + ' değişiklik)', 'success');
}

// ── FORMÜL ÜRETİCİ ────────────────────────────────────────────
function doGenerateFormula(data) {
  const rows = sheets[activeSheet];
  const headers = rows ? (rows[0] || []) : [];
  const ft = (data.formula_type || 'sum').toLowerCase();
  const h0 = headers[0] || 'A';
  const h1 = headers[1] || 'B';
  const h2 = headers[2] || 'C';

  const templates = {
    vlookup:     '=DÜŞEYARA(A2; $' + h2 + '$2:$' + h2 + '$100; 2; 0)\n💡 ' + h0 + ' sütunundaki değeri tablo ' + h2 + '\'de arar',
    sumif:       '=ETOPLA(' + h0 + ':' + h0 + '; "kriter"; ' + h1 + ':' + h1 + ')\n💡 ' + h0 + ' kriterine göre ' + h1 + ' toplar',
    if:          '=EĞER(' + h1 + '2>100; "Yüksek"; EĞER(' + h1 + '2>50; "Orta"; "Düşük"))\n💡 Değere göre etiket atar',
    countif:     '=EĞERSAY(' + h0 + ':' + h0 + '; "değer")\n💡 Kritere uyan kayıt sayar',
    index_match: '=İNDİS(' + h2 + ':' + h2 + '; KAÇINCI(A2; ' + h0 + ':' + h0 + '; 0))\n💡 VLOOKUP\'tan güçlü, herhangi sütunda arar',
    sumifs:      '=ÇOKETOPLA(' + h2 + ':' + h2 + '; ' + h0 + ':' + h0 + '; "kriter1"; ' + h1 + ':' + h1 + '; "kriter2")\n💡 Çoklu koşula göre toplar',
    average:     '=ORTALAMA(' + h1 + '2:' + h1 + '100)\n💡 ' + h1 + ' sütununun ortalaması'
  };

  const formula = templates[ft] || '=TOPLA(' + h1 + '2:' + h1 + '100)\n💡 ' + h1 + ' sütununu toplar';
  addMsg('ai', '📋 <strong>Formül önerisi:</strong><br><code>' + formula.replace(/\n/g, '</code><br>') + '</code>');
  showToast(data.reply || '✓ Formül oluşturuldu', 'success');
}

function toggleExportMenu(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('export-dropdown');
  if (!menu) return;

  if (menu.classList.contains('open')) {
    menu.classList.remove('open');
    const btn = document.getElementById('exportArrowBtn');
    if (btn) btn.classList.remove('open');
    setTimeout(() => { if (!menu.classList.contains('open')) menu.style.display = ''; }, 200);
    return;
  }

  try { renderIntegrationShortcuts(); } catch(err) { console.warn('[exp] renderIntegrationShortcuts error:', err); }

  const trigger = (e && e.currentTarget) || document.getElementById('exportArrowBtn');
  const toolbarBtn = document.getElementById('exportArrowBtn');

  if (trigger) {
    const r = trigger.getBoundingClientRect();
    const isSidebar = trigger.classList.contains('sb-item');

    if (isSidebar) {
      menu.style.top   = r.top + 'px';
      menu.style.left  = (r.right + 8) + 'px';
      menu.style.right = '';
    } else {
      menu.style.top   = (r.bottom + 6) + 'px';
      menu.style.right = Math.max(0, window.innerWidth - r.right) + 'px';
      menu.style.left  = '';
    }
  }

  menu.style.display = 'block';
  void menu.offsetHeight;
  menu.classList.add('open');
  if (toolbarBtn) toolbarBtn.classList.add('open');
}

document.addEventListener('click', function(e) {
  if (e.target.closest && (e.target.closest('#export-dropdown') || e.target.closest('.export-wrapper'))) return;
  var menu = document.getElementById('export-dropdown');
  if (menu && menu.classList.contains('open')) {
    menu.classList.remove('open');
    menu.style.display = '';
  }
  var btn = document.getElementById('exportArrowBtn');
  if (btn) btn.classList.remove('open');
});

function closeExportMenu() {
  const menu = document.getElementById('export-dropdown');
  const btn  = document.getElementById('exportArrowBtn');
  if (menu) menu.classList.remove('open');
  if (btn)  btn.classList.remove('open');
  setTimeout(() => { if (menu && !menu.classList.contains('open')) menu.style.display = ''; }, 200);
}

function renderIntegrationShortcuts() {
  const el = document.getElementById('exp-integrations-section');
  if (!el) return;
  const localIcon = (file) => `<img src="/images/integrations/${file}" width="28" height="28" style="border-radius:7px;object-fit:contain">`;
  const configs = [
    { key:'int_gs',      name:'Google Sheets',    fn:'exportToGSheets',      icon: localIcon('googlesheets.svg') },

    { key:'int_notion',  name:'Notion',           fn:'exportToNotion',       icon: localIcon('notion.svg') },
    { key:'int_slack',   name:'Slack',            fn:'exportToSlack',        icon: localIcon('slack.svg') },
    { key:'int_airtable',name:'Airtable',         fn:'exportToAirtable',     icon: localIcon('airtable.svg') },
    { key:'int_teams',   name:'Teams',            fn:'exportToTeams',        icon: localIcon('microsoftteams.svg') },
    { key:'int_trello',  name:'Trello',           fn:'exportToTrello',       icon: localIcon('trello.svg') },
    { key:'int_make',    name:'Make',             fn:'triggerMake',          icon: localIcon('make.svg') },
    { key:'int_drive',   name:'Drive',            fn:'exportToDrive',        icon: localIcon('googledrive.svg') },
    { key:'int_webhook', name:'Webhook',          fn:'triggerWebhook',       icon:'<svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="24" height="24" rx="5" fill="#4F46E5"/><path d="M9.5 8.5A4.2 4.2 0 008 12a4.2 4.2 0 004.2 4.2H14" stroke="white" stroke-width="1.8" stroke-linecap="round"/><path d="M14.5 15.5A4.2 4.2 0 0016 12a4.2 4.2 0 00-4.2-4.2H10" stroke="white" stroke-width="1.8" stroke-linecap="round"/><circle cx="7.5" cy="8" r="1.8" fill="white"/><circle cx="16.5" cy="16" r="1.8" fill="white"/></svg>' }
  ];

  const cards = configs.map(c => {
    const isConnected = (() => { try { return !!JSON.parse(localStorage.getItem(c.key)); } catch { return false; } })();
    const onclick = isConnected ? `${c.fn}()` : `window.open('integrations.html','_blank')`;
    const cls = isConnected ? 'exp-int-card' : 'exp-int-card disconnected';
    const dot = isConnected ? '<span class="exp-int-dot"></span>' : '';
    const title = isConnected ? `${c.name}'a aktar` : `${c.name} bağla`;
    return `<button class="${cls}" onclick="${onclick}" title="${title}">${c.icon}<span class="exp-int-card-name">${c.name}</span>${dot}</button>`;
  }).join('');

  el.style.display = '';
  el.innerHTML = `<div class="exp-separator"></div><div class="exp-int-header"><span>Entegrasyonlar</span><a href="integrations.html" target="_blank" onclick="closeExportMenu()">Yönet →</a></div><div class="exp-int-grid">${cards}</div>`;
}

async function exportToGSheets() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_gs') || '{}');
  if (!cfg.url) {
    if (confirm('Google Sheets bağlantısı kurulmamış. Entegrasyonlar sayfasına git?'))
      window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  const exportData = data.slice(0, Math.max(lastRow, 1));
  const authToken = getAuthToken();

  // Google OAuth token varsa doğrudan Sheets API ile yaz
  if (cfg.tokens?.access_token) {
    toast('Google Sheets\'e yazılıyor...', 'info');
    try {
      const resp = await fetch(API_URL + '/api/integrations/sheets/write', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
        body: JSON.stringify({
          accessToken: cfg.tokens.access_token,
          refreshToken: cfg.tokens.refresh_token,
          tokenExpiry: cfg.tokens.expiry_date,
          sheetId: cfg.url,
          sheetName: cfg.tab || 'Sheet1',
          startCell: cfg.cell || 'A1',
          data: exportData
        })
      });
      const result = await resp.json();
      if (result.newAccessToken) {
        const updated = JSON.parse(localStorage.getItem('int_gs') || '{}');
        updated.tokens = { ...updated.tokens, access_token: result.newAccessToken };
        localStorage.setItem('int_gs', JSON.stringify(updated));
      }
      if (result.success) {
        toast(`${result.rows} satır Google Sheets'e yazıldı`, 'ok');
        if (confirm('Google Sheets\'i aç?')) window.open(result.sheetUrl, '_blank');
      } else if (result.code === 'TOKEN_EXPIRED') {
        const updated = JSON.parse(localStorage.getItem('int_gs') || '{}');
        delete updated.tokens;
        localStorage.setItem('int_gs', JSON.stringify(updated));
        toast('Google token süresi doldu. Entegrasyonlar sayfasından tekrar bağlanın.', 'err');
      } else {
        toast('Google Sheets yazma hatası: ' + (result.error || ''), 'err');
      }
    } catch (err) {
      toast('Google Sheets aktarımı başarısız: ' + err.message, 'err');
    }
    return;
  }

  // Token yoksa CSV fallback
  toast('Google Sheets\'e aktarılıyor (CSV)...', 'info');
  try {
    const resp = await fetch(API_URL + '/api/integrations/sheets/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
      body: JSON.stringify({ sheetId: cfg.url, data: exportData, sheetName: cfg.tab || 'Sheet1' })
    });
    if (!resp.ok) throw new Error('Sunucu hatası: ' + resp.status);
    const result = await resp.json();
    const blob = new Blob([result.csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (cfg.tab || 'mocksheet') + '.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    toast(`CSV indirildi (${result.rows} satır). Doğrudan yazmak için Entegrasyonlar'dan Google ile bağlanın.`, 'ok');
  } catch (err) {
    toast('Google Sheets aktarımı başarısız: ' + err.message, 'err');
  }
}


async function exportToNotion() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_notion') || '{}');
  if (!cfg.token) {
    if (confirm('Notion bağlantısı kurulmamış. Entegrasyonlar sayfasına git?'))
      window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  const rows = data.slice(1, Math.max(lastRow, 1));
  const headers = data[0];
  if (!rows.length) { toast('Aktarılacak veri yok', 'err'); return; }
  toast(`${rows.length} satır Notion'a aktarılıyor...`, 'info');
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/notion/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ token: cfg.token, databaseId: cfg.dbId, headers, rows })
    });
    const result = await resp.json();
    if (result.success || result.count > 0) {
      toast(`${result.count}/${result.total} satır Notion'a aktarıldı`, 'ok');
      if (confirm('Notion veritabanını aç?'))
        window.open('https://www.notion.so/' + cfg.dbId.replace(/-/g, ''), '_blank');
    } else {
      toast('Notion aktarımı başarısız: ' + (result.error || ''), 'err');
    }
  } catch (err) {
    toast('Notion aktarımı başarısız: ' + err.message, 'err');
  }
}

async function triggerWebhook() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_webhook') || '{}');
  if (!cfg.url) {
    if (confirm('Webhook kurulmamış. Entegrasyonlar sayfasına git?'))
      window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/webhook/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ url: cfg.url, event: 'manual_export', secret: cfg.secret,
        data: { rows: lastRow, sheet: activeSheet } })
    });
    const result = await resp.json();
    if (result.success) toast('Webhook başarıyla tetiklendi', 'ok');
    else toast('Webhook gönderilemedi: ' + (result.error || ''), 'err');
  } catch (err) {
    toast('Webhook tetiklenemedi: ' + err.message, 'err');
  }
}

async function exportToSlack() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_slack') || '{}');
  if (!cfg.url) {
    if (confirm('Slack bağlantısı kurulmamış. Entegrasyonlar sayfasına git?'))
      window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  const previewRows = data.slice(0, Math.min(lastRow, 6));
  const csvPreview = previewRows.map(r => r.filter((_, i) => r.some(c => c !== '') && i < 8).join('\t')).join('\n');
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/slack/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        webhookUrl: cfg.url,
        title: '📊 Mocksheet Dışa Aktarım',
        message: `Veriler Mocksheet'ten gönderildi.\n\`\`\`\n${csvPreview}\n\`\`\``,
        fields: [
          { label: 'Sayfa', value: activeSheet || 'Sheet1' },
          { label: 'Satır sayısı', value: String(lastRow > 0 ? lastRow - 1 : 0) }
        ]
      })
    });
    const result = await resp.json();
    if (result.success) toast("Slack'e veri özeti gönderildi", 'ok');
    else toast("Slack gönderilemedi: " + (result.error || ''), 'err');
  } catch (err) {
    toast("Slack gönderilemedi: " + err.message, 'err');
  }
}

async function exportToAirtable() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_airtable') || 'null');
  if (!cfg?.token) {
    if (confirm('Airtable bağlantısı kurulmamış. Entegrasyonlar sayfasına git?')) window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  if (lastRow < 2) { toast('Aktarılacak veri yok (en az 1 başlık + 1 satır gerekli)', 'err'); return; }
  const headers = data[0];
  const rows = data.slice(1, lastRow);
  toast(`${rows.length} satır Airtable'a aktarılıyor...`, 'info');
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/airtable/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ token: cfg.token, baseId: cfg.baseId, tableName: cfg.tableName, headers, rows })
    });
    const result = await resp.json();
    if (result.success || result.count > 0) toast(`${result.count}/${result.total} satır Airtable'a aktarıldı`, 'ok');
    else toast('Airtable aktarımı başarısız: ' + (result.error || ''), 'err');
  } catch (err) {
    toast('Airtable aktarımı başarısız: ' + err.message, 'err');
  }
}

async function exportToTeams() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_teams') || 'null');
  if (!cfg?.url) {
    if (confirm('Microsoft Teams bağlantısı kurulmamış. Entegrasyonlar sayfasına git?')) window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  const previewRows = data.slice(0, Math.min(lastRow, 6));
  const tablePreview = previewRows.map(r => r.filter((_, i) => i < 6).join(' | ')).join('\n');
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/teams/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        webhookUrl: cfg.url,
        title: '📊 Mocksheet Dışa Aktarım',
        message: `Veriler Mocksheet'ten gönderildi:\n\n${tablePreview}`,
        fields: [
          { label: 'Sayfa', value: activeSheet || 'Sheet1' },
          { label: 'Toplam satır', value: String(lastRow > 0 ? lastRow - 1 : 0) }
        ]
      })
    });
    const result = await resp.json();
    if (result.success) toast("Teams'e veri özeti gönderildi", 'ok');
    else toast("Teams gönderilemedi: " + (result.error || ''), 'err');
  } catch (err) {
    toast("Teams gönderilemedi: " + err.message, 'err');
  }
}

async function exportToTrello() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_trello') || 'null');
  if (!cfg?.apiKey || !cfg?.token) {
    if (confirm('Trello bağlantısı kurulmamış. Entegrasyonlar sayfasına git?')) window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  if (lastRow < 2) { toast('Aktarılacak veri yok', 'err'); return; }
  const headers = data[0];
  const rows = data.slice(1, lastRow);
  toast(`${rows.length} satır Trello'ya kart olarak aktarılıyor...`, 'info');
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/trello/export', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ apiKey: cfg.apiKey, token: cfg.token, boardId: cfg.boardId, listName: cfg.listName, headers, rows })
    });
    const result = await resp.json();
    if (result.success || result.count > 0) toast(`${result.count}/${result.total} kart Trello'ya aktarıldı (Liste: ${result.listName || cfg.listName || 'ilk liste'})`, 'ok');
    else toast('Trello aktarımı başarısız: ' + (result.error || ''), 'err');
  } catch (err) {
    toast('Trello aktarımı başarısız: ' + err.message, 'err');
  }
}

async function triggerMake() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_make') || 'null');
  if (!cfg?.url) {
    if (confirm('Make bağlantısı kurulmamış. Entegrasyonlar sayfasına git?')) window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/make/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ url: cfg.url, event: 'manual_export', data: { rows: lastRow, sheet: activeSheet, source: 'Mocksheets' } })
    });
    const result = await resp.json();
    if (result.success) toast('Make senaryosu tetiklendi', 'ok');
    else toast('Make tetiklenemedi: ' + (result.error || ''), 'err');
  } catch (err) {
    toast('Make tetiklenemedi: ' + err.message, 'err');
  }
}

async function exportToDrive() {
  document.getElementById('export-dropdown').style.display = 'none';
  const cfg = JSON.parse(localStorage.getItem('int_drive') || 'null');
  if (!cfg?.token) {
    if (confirm('Google Drive bağlantısı kurulmamış. Entegrasyonlar sayfasına git?')) window.open('integrations.html', '_blank');
    return;
  }
  const data = sheets[activeSheet];
  let lastRow = 0;
  for (let r = 0; r < ROWS; r++) { if (data[r].some(c => c !== '')) lastRow = r + 1; }
  const exportData = data.slice(0, Math.max(lastRow, 1));
  const csv = '\uFEFF' + exportData.map(row => row.map(cell => {
    const s = String(cell ?? '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  }).join(',')).join('\r\n');
  toast("Google Drive'a yükleniyor...", 'info');
  try {
    const token = getAuthToken();
    const resp = await fetch(API_URL + '/api/integrations/drive/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ token: cfg.token, fileName: cfg.fileName || 'Mocksheets_Export', csv })
    });
    const result = await resp.json();
    if (result.success) toast(`"${result.fileName}" Google Drive'a yüklendi`, 'ok');
    else toast("Drive yükleme başarısız: " + (result.error || ''), 'err');
  } catch (err) {
    toast("Drive yükleme başarısız: " + err.message, 'err');
  }
}

/* cache bust Sat Mar 14 19:03:28 TSS 2026 */

// ════════════════════════════════════════════════════════
// TEMPLATE SİSTEMİ
// ════════════════════════════════════════════════════════

const TEMPLATES = {
  "💰 Muhasebe & Finans": [
    {
      id: "kdv_takip",
      icon: "🧾",
      name: "KDV Takip Tablosu",
      desc: "Aylık KDV beyannamesi için",
      isNew: true,
      data: [
        ["Fatura No", "Tarih", "Müşteri/Tedarikçi", "Matrah (₺)", "KDV Oranı (%)", "KDV Tutarı (₺)", "Toplam (₺)", "Tür"],
        ["FAT-001", "01.01.2026", "ABC Ltd.", "10000", "20", "2000", "12000", "Satış"],
        ["FAT-002", "05.01.2026", "XYZ A.Ş.", "5000", "20", "1000", "6000", "Satış"],
        ["FAT-003", "10.01.2026", "Tedarikçi A", "8000", "20", "1600", "9600", "Alış"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "TOPLAM", "=TOPLA(D2:D4)", "", "=TOPLA(F2:F4)", "=TOPLA(G2:G4)", ""],
      ]
    },
    {
      id: "gelir_gider",
      icon: "📊",
      name: "Gelir Gider Tablosu",
      desc: "Aylık kar/zarar takibi",
      data: [
        ["Kategori", "Açıklama", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Toplam"],
        ["GELİR", "Ürün Satışları", "45000", "52000", "48000", "61000", "55000", "67000", "328000"],
        ["GELİR", "Hizmet Gelirleri", "12000", "14000", "11000", "15000", "16000", "18000", "86000"],
        ["GELİR", "Diğer Gelirler", "2000", "1500", "3000", "2500", "1800", "2200", "13000"],
        ["GELİR", "TOPLAM GELİR", "59000", "67500", "62000", "78500", "72800", "87200", "427000"],
        ["GİDER", "Personel Giderleri", "25000", "25000", "26000", "26000", "27000", "27000", "156000"],
        ["GİDER", "Kira", "8000", "8000", "8000", "8000", "8000", "8000", "48000"],
        ["GİDER", "Elektrik/Su/Isınma", "1200", "1300", "1100", "900", "800", "950", "6250"],
        ["GİDER", "Pazarlama", "3500", "4000", "3800", "5000", "4200", "5500", "26000"],
        ["GİDER", "Diğer Giderler", "2300", "2100", "2500", "2800", "2400", "2600", "14700"],
        ["GİDER", "TOPLAM GİDER", "40000", "40400", "41400", "42700", "42400", "44050", "250950"],
        ["", "NET KAR/ZARAR", "19000", "27100", "20600", "35800", "30400", "43150", "176050"],
      ]
    },
    {
      id: "nakit_akis",
      icon: "💵",
      name: "Nakit Akış Tablosu",
      desc: "Haftalık nakit akışı takibi",
      data: [
        ["Tarih", "Açıklama", "Giriş (₺)", "Çıkış (₺)", "Bakiye (₺)", "Kategori", "Not"],
        ["01.01.2026", "Açılış Bakiyesi", "50000", "", "50000", "Açılış", ""],
        ["02.01.2026", "Müşteri Tahsilatı", "15000", "", "", "Tahsilat", "ABC Ltd."],
        ["03.01.2026", "Kira Ödemesi", "", "8000", "", "Gider", "Ocak kirası"],
        ["05.01.2026", "Tedarikçi Ödemesi", "", "12000", "", "Ödeme", "XYZ A.Ş."],
        ["08.01.2026", "Satış Geliri", "22000", "", "", "Gelir", ""],
        ["10.01.2026", "SGK Ödemesi", "", "5500", "", "Yasal", "Aralık SGK"],
        ["", "", "", "", "", "", ""],
      ]
    },
    {
      id: "cari_hesap",
      icon: "🏦",
      name: "Cari Hesap Takibi",
      desc: "Müşteri/tedarikçi borç alacak",
      data: [
        ["Firma Adı", "Tarih", "Belge No", "Borç (₺)", "Alacak (₺)", "Bakiye (₺)", "Vade", "Durum"],
        ["ABC Ltd.", "05.01.2026", "FAT-001", "", "12000", "", "05.02.2026", "Açık"],
        ["XYZ A.Ş.", "10.01.2026", "FAT-002", "8000", "", "", "10.02.2026", "Vadeli"],
        ["DEF Koll.", "15.01.2026", "FAT-003", "", "5500", "", "15.03.2026", "Açık"],
        ["GHI Ltd.", "20.01.2026", "FAT-004", "3000", "", "", "Ödenmiş", "Kapalı"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "TOPLAM", "", "", "", "", ""],
      ]
    },
    {
      id: "banka_mutabakat",
      icon: "🏧",
      name: "Banka Mutabakat",
      desc: "Banka hesap mutabakatı",
      data: [
        ["Tarih", "Açıklama", "Banka Hareketi (₺)", "Muhasebe Kaydı (₺)", "Fark (₺)", "Açıklama"],
        ["01.01.2026", "Açılış", "125000", "125000", "0", "Eşleşti"],
        ["05.01.2026", "Havale Girişi", "15000", "15000", "0", "Eşleşti"],
        ["08.01.2026", "EFT Çıkışı", "-8000", "-8000", "0", "Eşleşti"],
        ["12.01.2026", "Faiz Geliri", "250", "", "", "Kayıt Eksik"],
        ["15.01.2026", "Çek Tahsilatı", "22000", "22000", "0", "Eşleşti"],
        ["18.01.2026", "Komisyon Gideri", "-150", "-150", "0", "Eşleşti"],
        ["22.01.2026", "Müşteri Ödemesi", "38000", "38000", "0", "Eşleşti"],
        ["", "", "", "", "", ""],
      ]
    },
    {
      id: "fatura_takip",
      icon: "🗂️",
      name: "Fatura Takip",
      desc: "Alacak/borç fatura ve vade takibi",
      isNew: true,
      data: [
        ["Fatura No", "Tarih", "Firma", "Tür", "KDV Hariç (₺)", "KDV (₺)", "Toplam (₺)", "Vade Tarihi", "Ödeme Tarihi", "Kalan (₺)", "Durum"],
        ["FAT-2026-001", "03.01.2026", "ABC Ltd.", "Alacak", "25000", "5000", "30000", "03.02.2026", "", "30000", "Açık"],
        ["FAT-2026-002", "07.01.2026", "XYZ A.Ş.", "Alacak", "12000", "2400", "14400", "07.01.2026", "07.01.2026", "0", "Ödendi"],
        ["FAT-2026-003", "10.01.2026", "Tedarikçi A", "Borç", "18000", "3600", "21600", "10.02.2026", "", "21600", "Açık"],
        ["FAT-2026-004", "15.01.2026", "DEF Koll.", "Alacak", "8500", "1700", "10200", "30.01.2026", "28.01.2026", "0", "Ödendi"],
        ["FAT-2026-005", "18.01.2026", "Tedarikçi B", "Borç", "5000", "1000", "6000", "18.02.2026", "", "6000", "Açık"],
        ["FAT-2026-006", "22.01.2026", "GHI Ltd.", "Alacak", "32000", "6400", "38400", "22.02.2026", "", "38400", "Vadesi Geçmiş"],
        ["FAT-2026-007", "25.01.2026", "JKL A.Ş.", "Alacak", "15000", "3000", "18000", "25.02.2026", "", "18000", "Açık"],
        ["", "", "", "", "", "", "", "", "", "", ""],
        ["TOPLAM ALACAK", "", "", "", "", "", "", "", "", "86400", ""],
        ["TOPLAM BORÇ", "", "", "", "", "", "", "", "", "27600", ""],
      ]
    },
    {
      id: "aylik_butce",
      icon: "📆",
      name: "Aylık Bütçe Planı",
      desc: "Bütçe vs gerçekleşen karşılaştırması",
      isNew: true,
      data: [
        ["Kategori", "Alt Kategori", "Bütçe (₺)", "Gerçekleşen (₺)", "Fark (₺)", "Kullanım (%)", "Durum"],
        ["GELİR", "Ürün Satışları", "200000", "187500", "-12500", "93.75", "Altında"],
        ["GELİR", "Hizmet Gelirleri", "50000", "58000", "8000", "116.00", "Hedef Aşıldı"],
        ["GELİR", "Diğer Gelirler", "10000", "7800", "-2200", "78.00", "Altında"],
        ["GELİR", "TOPLAM GELİR", "260000", "253300", "-6700", "97.42", ""],
        ["GİDER", "Personel Giderleri", "110000", "112000", "2000", "101.82", "Aşıldı"],
        ["GİDER", "Kira", "32000", "32000", "0", "100.00", "Tamam"],
        ["GİDER", "Elektrik/Su/Isınma", "5000", "4250", "-750", "85.00", "Tasarruflu"],
        ["GİDER", "Pazarlama", "20000", "18500", "-1500", "92.50", "Tasarruflu"],
        ["GİDER", "Yazılım & Teknoloji", "8000", "9200", "1200", "115.00", "Aşıldı"],
        ["GİDER", "Seyahat & Konaklama", "5000", "3800", "-1200", "76.00", "Tasarruflu"],
        ["GİDER", "Diğer Giderler", "10000", "8700", "-1300", "87.00", "Tasarruflu"],
        ["GİDER", "TOPLAM GİDER", "190000", "188450", "-1550", "99.18", ""],
        ["", "NET KAR/ZARAR", "70000", "64850", "-5150", "92.64", ""],
      ]
    },
  ],

  "👥 Bordro & İK": [
    {
      id: "maas_bordro",
      icon: "💼",
      name: "Maaş Bordro Tablosu",
      desc: "2026 parametreli bordro",
      isNew: true,
      data: [
        ["Ad Soyad", "Pozisyon", "Brüt Maaş (₺)", "SGK İşçi (%15)", "İşsizlik (%1)", "GV Matrahı", "Gelir Vergisi", "Damga Vergisi", "Net Maaş (₺)"],
        ["Ahmet Yılmaz", "Müdür", "45000", "6750", "450", "37800", "5670", "426.60", "31703.40"],
        ["Ayşe Kaya", "Uzman", "28000", "4200", "280", "23520", "3528", "265.70", "19726.30"],
        ["Mehmet Demir", "Asistan", "20000", "3000", "200", "16800", "2520", "189.80", "14090.20"],
        ["Fatma Şahin", "Muhasebe", "22000", "3300", "220", "18480", "2772", "208.80", "15499.20"],
        ["Ali Çelik", "Satış", "18000", "2700", "180", "15120", "2268", "170.90", "12681.10"],
        ["Hüseyin Güneş", "Tasarım", "24000", "3600", "240", "20160", "3024", "228.00", "16908.00"],
        ["Zeynep Arslan", "İK Uzmanı", "21000", "3150", "210", "17640", "2646", "199.20", "14794.80"],
        ["", "", "", "", "", "", "", "", ""],
        ["TOPLAM", "", "178000", "26700", "1780", "", "22428", "1688.00", "125403.00"],
      ]
    },
    {
      id: "izin_takip",
      icon: "🏖️",
      name: "İzin Takip Tablosu",
      desc: "Yıllık izin hakkı ve kullanım",
      data: [
        ["Ad Soyad", "Kıdem (Yıl)", "İzin Hakkı (Gün)", "Kullanılan", "Kalan", "Planlanan Tarih", "Onay Durumu"],
        ["Ahmet Yılmaz", "8", "20", "5", "15", "15.07.2026", "Onaylandı"],
        ["Ayşe Kaya", "3", "14", "0", "14", "10.08.2026", "Bekliyor"],
        ["Mehmet Demir", "1", "14", "3", "11", "", ""],
        ["Fatma Şahin", "5", "14", "7", "7", "01.09.2026", "Onaylandı"],
        ["Ali Çelik", "12", "20", "10", "10", "", ""],
        ["", "", "", "", "", "", ""],
      ]
    },
    {
      id: "kidem_ihbar",
      icon: "📋",
      name: "Kıdem & İhbar Hesaplama",
      desc: "İşten çıkış tazminat tablosu",
      data: [
        ["Ad Soyad", "İşe Giriş", "İşten Çıkış", "Kıdem (Yıl)", "Günlük Ücret (₺)", "Kıdem Tazminatı (₺)", "İhbar Süresi (Gün)", "İhbar Tazminatı (₺)"],
        ["Ahmet Yılmaz", "15.03.2018", "15.03.2026", "8", "1500", "", "56", ""],
        ["Ayşe Kaya", "01.06.2021", "01.06.2026", "5", "933", "", "42", ""],
        ["Mehmet Demir", "10.01.2019", "10.01.2026", "7", "666", "", "56", ""],
        ["", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "personel_liste",
      icon: "👤",
      name: "Personel Listesi",
      desc: "Çalışan bilgileri ve iletişim",
      data: [
        ["Sicil No", "Ad Soyad", "TC Kimlik", "Pozisyon", "Departman", "İşe Giriş", "Telefon", "E-posta", "SGK Statüsü"],
        ["001", "Ahmet Yılmaz", "", "Müdür", "Yönetim", "15.03.2018", "0532 xxx xxxx", "ahmet@firma.com", "Aktif"],
        ["002", "Ayşe Kaya", "", "Uzman", "Muhasebe", "01.06.2021", "0541 xxx xxxx", "ayse@firma.com", "Aktif"],
        ["003", "Mehmet Demir", "", "Asistan", "Satış", "10.01.2019", "0551 xxx xxxx", "mehmet@firma.com", "Aktif"],
        ["", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "fazla_mesai",
      icon: "⏰",
      name: "Fazla Mesai Takibi",
      desc: "Aylık fazla mesai hesaplama",
      data: [
        ["Ad Soyad", "Normal Saat", "Fazla Mesai (Saat)", "FM Oranı", "Saatlik Ücret (₺)", "FM Ücreti (₺)", "Hafta Tatili (Saat)", "HT Ücreti (₺)", "Toplam (₺)"],
        ["Ahmet Yılmaz", "160", "12", "1.5", "281.25", "5062.50", "8", "4500.00", "9562.50"],
        ["Ayşe Kaya", "160", "6", "1.5", "175.00", "1575.00", "0", "0", "1575.00"],
        ["Mehmet Demir", "160", "20", "1.5", "125.00", "3750.00", "16", "4000.00", "7750.00"],
        ["Fatma Şahin", "160", "0", "1.5", "137.50", "0", "0", "0", "0"],
        ["Ali Çelik", "160", "15", "1.5", "112.50", "2531.25", "8", "2250.00", "4781.25"],
        ["", "", "", "", "", "", "", "", ""],
        ["TOPLAM", "", "53", "", "", "12918.75", "32", "10750.00", "23668.75"],
      ]
    },
    {
      id: "ise_alim",
      icon: "🎯",
      name: "İşe Alım Süreci",
      desc: "Aday başvuru ve mülakat takibi",
      isNew: true,
      data: [
        ["Aday No", "Ad Soyad", "Pozisyon", "Başvuru Tarihi", "Özgeçmiş", "Tel. Görüşmesi", "1. Mülakat", "2. Mülakat", "Teknik Test", "Teklif", "Durum"],
        ["ADY-001", "Kemal Avcı", "Yazılım Müh.", "05.01.2026", "Geçti", "Geçti", "10.01 — Geçti", "15.01 — Geçti", "Geçti", "Gönderildi", "Kabul Etti"],
        ["ADY-002", "Selin Çelik", "Muhasebe Uzm.", "06.01.2026", "Geçti", "Geçti", "11.01 — Geçti", "Planlandı", "", "", "Süreçte"],
        ["ADY-003", "Burak Kara", "Satış Uzm.", "08.01.2026", "Geçti", "Elendi", "", "", "", "", "Elendi"],
        ["ADY-004", "Merve Yıldız", "İK Uzmanı", "10.01.2026", "Geçti", "Geçti", "14.01 — Geçti", "19.01 — Bekliyor", "", "", "Süreçte"],
        ["ADY-005", "Emre Şahin", "Grafik Tasarım", "12.01.2026", "Geçti", "Geçti", "16.01 — Elendi", "", "", "", "Elendi"],
        ["ADY-006", "Derya Koç", "Proje Yön.", "15.01.2026", "Geçti", "Geçti", "20.01 — Geçti", "22.01 — Geçti", "Geçti", "Hazırlanıyor", "Süreçte"],
        ["", "", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "performans_degerlendirme",
      icon: "⭐",
      name: "Performans Değerlendirme",
      desc: "Yıllık çalışan performans formu",
      isNew: true,
      data: [
        ["Ad Soyad", "Pozisyon", "Dönem", "Hedef Tamamlama (%)", "Teknik (1-5)", "İletişim (1-5)", "Takım (1-5)", "Zaman Yön. (1-5)", "Genel Skor", "Performans Notu", "Zam Önerisi (%)"],
        ["Ahmet Yılmaz", "Müdür", "2025 Yıl Sonu", "92", "4", "5", "4", "4", "4.25", "İyi", "10"],
        ["Ayşe Kaya", "Uzman", "2025 Yıl Sonu", "105", "5", "4", "5", "4", "4.75", "Mükemmel", "15"],
        ["Mehmet Demir", "Asistan", "2025 Yıl Sonu", "78", "3", "3", "4", "3", "3.25", "Geliştirilmeli", "3"],
        ["Fatma Şahin", "Muhasebe", "2025 Yıl Sonu", "98", "4", "4", "4", "5", "4.25", "İyi", "10"],
        ["Ali Çelik", "Satış", "2025 Yıl Sonu", "115", "4", "5", "4", "4", "4.50", "Çok İyi", "12"],
        ["Hüseyin Güneş", "Tasarım", "2025 Yıl Sonu", "88", "5", "3", "4", "4", "4.00", "İyi", "8"],
        ["", "", "", "", "", "", "", "", "", "", ""],
      ]
    },
  ],

  "📦 Satış & Stok": [
    {
      id: "satis_takip",
      icon: "📈",
      name: "Satış Takip Tablosu",
      desc: "Günlük/aylık satış raporu",
      data: [
        ["Sipariş No", "Tarih", "Müşteri", "Ürün", "Miktar", "Birim Fiyat (₺)", "İndirim (%)", "KDV (%)", "Toplam (₺)", "Durum"],
        ["SP-001", "05.01.2026", "ABC Ltd.", "Laptop", "3", "35000", "5", "20", "", "Teslim Edildi"],
        ["SP-002", "08.01.2026", "XYZ A.Ş.", "Mouse", "50", "450", "0", "20", "", "Hazırlanıyor"],
        ["SP-003", "12.01.2026", "DEF Koll.", "Monitör", "10", "8500", "10", "20", "", "Kargoda"],
        ["SP-004", "15.01.2026", "GHI Ltd.", "Klavye", "25", "780", "0", "20", "", "Bekliyor"],
        ["", "", "", "", "", "", "", "", "", ""],
        ["TOPLAM", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "stok_kart",
      icon: "📦",
      name: "Stok Kartı",
      desc: "Ürün giriş/çıkış takibi",
      isNew: true,
      data: [
        ["Ürün Kodu", "Ürün Adı", "Kategori", "Birim", "Açılış Stok", "Giriş", "Çıkış", "Mevcut Stok", "Min. Stok", "Birim Maliyet (₺)", "Stok Değeri (₺)", "Durum"],
        ["PRD-001", "Laptop Dell", "Elektronik", "Adet", "10", "5", "8", "7", "3", "35000", "245000", "Normal"],
        ["PRD-002", "Mouse Logitech", "Çevre Birimleri", "Adet", "50", "30", "45", "35", "10", "450", "15750", "Normal"],
        ["PRD-003", "Monitör Samsung", "Elektronik", "Adet", "15", "0", "12", "3", "5", "8500", "25500", "KRİTİK"],
        ["PRD-004", "USB Hub", "Aksesuar", "Adet", "100", "50", "80", "70", "20", "120", "8400", "Normal"],
        ["PRD-005", "Kulaklık Sony", "Elektronik", "Adet", "25", "10", "28", "7", "5", "890", "6230", "Normal"],
        ["PRD-006", "Webcam Logitech", "Çevre Birimleri", "Adet", "30", "20", "48", "2", "10", "1250", "2500", "KRİTİK"],
        ["", "", "", "", "", "", "", "", "", "TOPLAM", "303380", ""],
      ]
    },
    {
      id: "fiyat_listesi",
      icon: "🏷️",
      name: "Fiyat Listesi",
      desc: "Ürün fiyat ve maliyet tablosu",
      data: [
        ["Ürün Kodu", "Ürün Adı", "Kategori", "Maliyet (₺)", "Kar Marjı (%)", "KDV Hariç (₺)", "KDV (%)", "Satış Fiyatı (₺)", "İndirimli Fiyat (₺)", "İndirim (%)"],
        ["PRD-001", "Laptop Dell", "Elektronik", "28000", "25", "", "20", "", "", "10"],
        ["PRD-002", "Mouse Logitech", "Çevre Birimleri", "320", "40", "", "20", "", "", "0"],
        ["PRD-003", "Monitör Samsung", "Elektronik", "6500", "30", "", "20", "", "", "5"],
        ["PRD-004", "USB Hub", "Aksesuar", "75", "60", "", "20", "", "", "0"],
        ["", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "satis_hedef",
      icon: "🎯",
      name: "Satış Hedef Takibi",
      desc: "Satış temsilcisi performansı",
      data: [
        ["Satış Temsilcisi", "Bölge", "Ocak Hedef", "Ocak Gerçek", "Ocak %", "Şubat Hedef", "Şubat Gerçek", "Şubat %", "Mart Hedef", "Mart Gerçek", "Mart %", "Q1 Toplam"],
        ["Ali Çelik", "İstanbul", "150000", "162000", "", "160000", "145000", "", "170000", "178000", "", ""],
        ["Fatma Şahin", "Ankara", "120000", "118000", "", "125000", "132000", "", "130000", "127000", "", ""],
        ["Hasan Kurt", "İzmir", "100000", "95000", "", "105000", "110000", "", "110000", "108000", "", ""],
        ["Zeynep Ar", "Bursa", "80000", "88000", "", "85000", "79000", "", "90000", "92000", "", ""],
        ["", "", "", "", "", "", "", "", "", "", "", ""],
        ["TOPLAM", "", "", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "tedarikci",
      icon: "🚚",
      name: "Tedarikçi Takibi",
      desc: "Tedarikçi sipariş ve ödeme",
      data: [
        ["Tedarikçi", "Ürün", "Sipariş Tarihi", "Teslim Tarihi", "Miktar", "Birim Fiyat (₺)", "Toplam (₺)", "Ödeme Vadesi", "Ödeme Durumu", "Not"],
        ["Tedarikçi A", "Laptop", "01.01.2026", "15.01.2026", "10", "28000", "280000", "30 Gün", "Ödendi", ""],
        ["Tedarikçi B", "Mouse", "05.01.2026", "12.01.2026", "100", "320", "32000", "15 Gün", "Bekliyor", ""],
        ["Tedarikçi C", "Monitör", "10.01.2026", "25.01.2026", "15", "6500", "97500", "45 Gün", "Kısmi", ""],
        ["Tedarikçi D", "USB Hub", "15.01.2026", "22.01.2026", "200", "75", "15000", "30 Gün", "Bekliyor", ""],
        ["", "", "", "", "", "", "424500", "", "", ""],
      ]
    },
    {
      id: "siparis_yonetim",
      icon: "🛒",
      name: "Sipariş Yönetimi",
      desc: "Müşteri sipariş ve teslimat takibi",
      isNew: true,
      data: [
        ["Sipariş No", "Müşteri", "Sipariş Tarihi", "Ürünler", "Tutar (₺)", "Ödeme Yöntemi", "Kargo Firması", "Takip No", "Tahmini Teslimat", "Durum"],
        ["ORD-001", "ABC Ltd.", "02.01.2026", "Laptop ×3", "105000", "Havale", "MNG Kargo", "MNG123456", "10.01.2026", "Teslim Edildi"],
        ["ORD-002", "XYZ A.Ş.", "05.01.2026", "Mouse ×50, Klavye ×20", "38100", "Kredi Kartı", "Yurtiçi", "YIC789012", "12.01.2026", "Kargoda"],
        ["ORD-003", "DEF Koll.", "08.01.2026", "Monitör ×10", "85000", "Vadeli", "Aras Kargo", "", "20.01.2026", "Hazırlanıyor"],
        ["ORD-004", "GHI Ltd.", "10.01.2026", "USB Hub ×100", "12000", "Havale", "PTT Kargo", "PTT345678", "15.01.2026", "Teslim Edildi"],
        ["ORD-005", "JKL A.Ş.", "12.01.2026", "Kulaklık ×5", "4450", "Kredi Kartı", "Sürat Kargo", "", "18.01.2026", "Onay Bekliyor"],
        ["ORD-006", "MNO Ltd.", "15.01.2026", "Laptop ×1, Mouse ×10", "39500", "Vadeli", "MNG Kargo", "", "22.01.2026", "Hazırlanıyor"],
        ["", "", "", "TOPLAM", "284050", "", "", "", "", ""],
      ]
    },
    {
      id: "depo_envanter",
      icon: "🏭",
      name: "Depo Envanter Sayımı",
      desc: "Depo bazlı stok sayım ve envanter",
      isNew: true,
      data: [
        ["Ürün Kodu", "Ürün Adı", "Depo", "Raf/Bölüm", "Sistem Stok", "Sayım Stoku", "Fark", "Birim Maliyet (₺)", "Toplam Değer (₺)", "Fark Tutarı (₺)", "Sayım Tarihi", "Sayımı Yapan"],
        ["PRD-001", "Laptop Dell", "Ana Depo", "A-01", "10", "9", "-1", "28000", "252000", "-28000", "15.01.2026", "Mehmet D."],
        ["PRD-002", "Mouse Logitech", "Ana Depo", "A-02", "35", "37", "2", "320", "11840", "640", "15.01.2026", "Mehmet D."],
        ["PRD-003", "Monitör Samsung", "Şube Depo", "B-01", "3", "3", "0", "6500", "19500", "0", "15.01.2026", "Fatma Ş."],
        ["PRD-004", "USB Hub", "Ana Depo", "A-03", "70", "68", "-2", "75", "5100", "-150", "15.01.2026", "Mehmet D."],
        ["PRD-005", "Kulaklık Sony", "Şube Depo", "B-02", "7", "8", "1", "890", "7120", "890", "15.01.2026", "Fatma Ş."],
        ["PRD-006", "Webcam Logitech", "Ana Depo", "A-04", "2", "2", "0", "1250", "2500", "0", "15.01.2026", "Mehmet D."],
        ["", "", "", "", "", "", "", "", "298060", "-26620", "", ""],
      ]
    },
  ],

  "📋 Proje Yönetimi": [
    {
      id: "proje_takvim",
      icon: "📅",
      name: "Proje Takvimi",
      desc: "Görev ve milestone takibi",
      isNew: true,
      data: [
        ["Görev No", "Görev Adı", "Proje", "Sorumlu", "Başlangıç", "Bitiş", "Süre (Gün)", "Tamamlanma (%)", "Öncelik", "Durum", "Not"],
        ["G-001", "Gereksinim Analizi", "Proje A", "Ahmet Y.", "01.01.2026", "07.01.2026", "7", "100", "Yüksek", "Tamamlandı", ""],
        ["G-002", "Tasarım", "Proje A", "Ayşe K.", "08.01.2026", "20.01.2026", "13", "75", "Yüksek", "Devam Ediyor", ""],
        ["G-003", "Geliştirme", "Proje A", "Mehmet D.", "21.01.2026", "15.02.2026", "26", "20", "Yüksek", "Bekliyor", ""],
        ["G-004", "Test", "Proje A", "Fatma Ş.", "16.02.2026", "28.02.2026", "13", "0", "Orta", "Bekliyor", ""],
        ["G-005", "Yayına Alma", "Proje A", "Ali Ç.", "01.03.2026", "05.03.2026", "5", "0", "Yüksek", "Bekliyor", ""],
        ["", "", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "butce_takip",
      icon: "💰",
      name: "Proje Bütçe Takibi",
      desc: "Bütçe vs gerçekleşen gider",
      data: [
        ["Kategori", "Bütçe (₺)", "Ocak Harcama", "Şubat Harcama", "Mart Harcama", "Toplam Harcama", "Kalan Bütçe", "Kullanım (%)"],
        ["Personel", "500000", "45000", "46000", "47000", "", "", ""],
        ["Yazılım Lisansları", "50000", "15000", "0", "5000", "", "", ""],
        ["Donanım", "80000", "35000", "20000", "0", "", "", ""],
        ["Danışmanlık", "120000", "30000", "30000", "30000", "", "", ""],
        ["Pazarlama", "75000", "10000", "15000", "12000", "", "", ""],
        ["Diğer", "30000", "2000", "3000", "1500", "", "", ""],
        ["TOPLAM", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "risk_matrisi",
      icon: "⚠️",
      name: "Risk Matrisi",
      desc: "Proje risk değerlendirmesi",
      data: [
        ["Risk No", "Risk Tanımı", "Kategori", "Olasılık (1-5)", "Etki (1-5)", "Risk Skoru", "Seviye", "Sorumlu", "Aksiyon", "Durum"],
        ["R-001", "Geç teslim", "Zaman", "3", "4", "", "", "Ahmet Y.", "Takvim sıkıştırması", "Açık"],
        ["R-002", "Bütçe aşımı", "Maliyet", "2", "5", "", "", "Ayşe K.", "Haftalık takip", "İzleniyor"],
        ["R-003", "Kaynak yetersizliği", "İnsan", "3", "3", "", "", "Fatma Ş.", "Yedek kaynak", "Açık"],
        ["R-004", "Teknik sorun", "Teknik", "2", "4", "", "", "Mehmet D.", "Test süreci", "Kapalı"],
        ["", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "toplanti_tutanak",
      icon: "📝",
      name: "Toplantı Tutanağı",
      desc: "Aksiyon maddeleri takibi",
      data: [
        ["Toplantı Tarihi", "Konu", "Katılımcılar", "Aksiyon Maddesi", "Sorumlu", "Termin", "Durum", "Not"],
        ["15.01.2026", "Sprint Planlaması", "Ahmet, Ayşe, Mehmet", "API entegrasyonu tamamla", "Mehmet D.", "22.01.2026", "Devam Ediyor", ""],
        ["15.01.2026", "Sprint Planlaması", "Ahmet, Ayşe, Mehmet", "UI tasarımları hazırla", "Ayşe K.", "20.01.2026", "Tamamlandı", ""],
        ["15.01.2026", "Sprint Planlaması", "Ahmet, Ayşe, Mehmet", "Test senaryoları yaz", "Fatma Ş.", "25.01.2026", "Bekliyor", ""],
        ["22.01.2026", "Bütçe Değerlendirme", "Ahmet, Ayşe", "Q1 bütçe raporunu hazırla", "Ayşe K.", "29.01.2026", "Devam Ediyor", ""],
        ["22.01.2026", "Bütçe Değerlendirme", "Ahmet, Ayşe", "Tedarikçi tekliflerini topla", "Ali Ç.", "28.01.2026", "Bekliyor", ""],
        ["", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "yapilacaklar",
      icon: "✅",
      name: "Yapılacaklar Listesi",
      desc: "Günlük görev ve öncelik yönetimi",
      isNew: true,
      data: [
        ["No", "Görev", "Kategori", "Öncelik", "Atanan", "Bitiş", "Tahmini Süre (Saat)", "Tamamlanma (%)", "Durum"],
        ["1", "Müşteri teklifini hazırla", "Satış", "Yüksek", "Ali Ç.", "20.01.2026", "3", "100", "Tamamlandı"],
        ["2", "Ocak ayı fatura kontrolü", "Muhasebe", "Yüksek", "Ayşe K.", "19.01.2026", "2", "100", "Tamamlandı"],
        ["3", "Yeni çalışan oryantasyonu", "İK", "Orta", "Fatma Ş.", "21.01.2026", "4", "50", "Devam Ediyor"],
        ["4", "Sunucu bakımı planla", "Teknik", "Düşük", "Mehmet D.", "22.01.2026", "2", "0", "Bekliyor"],
        ["5", "Haftalık ekip toplantısı", "Yönetim", "Orta", "Ahmet Y.", "20.01.2026", "1", "0", "Planlandı"],
        ["6", "Tedarikçi ödeme planı", "Finans", "Yüksek", "Ayşe K.", "21.01.2026", "1.5", "0", "Bekliyor"],
        ["7", "Yeni stok siparişi ver", "Satın Alma", "Yüksek", "Ali Ç.", "19.01.2026", "1", "100", "Tamamlandı"],
        ["8", "Web sitesi güncellemesi", "Teknik", "Orta", "Mehmet D.", "25.01.2026", "6", "20", "Devam Ediyor"],
        ["", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "sprint_backlog",
      icon: "🚀",
      name: "Sprint Backlog",
      desc: "Agile sprint planlama ve story point",
      isNew: true,
      data: [
        ["ID", "Kullanıcı Hikayesi", "Tür", "Öncelik", "Story Point", "Atanan", "Sprint", "Durum", "Başlangıç", "Bitiş"],
        ["US-001", "Kullanıcı şifre değiştirebilmeli", "Feature", "Yüksek", "3", "Mehmet D.", "Sprint 5", "Tamamlandı", "05.01.2026", "07.01.2026"],
        ["US-002", "Dashboard'a KPI kartları ekle", "Feature", "Yüksek", "8", "Ayşe K.", "Sprint 5", "Devam Ediyor", "08.01.2026", "15.01.2026"],
        ["US-003", "PDF export özelliği", "Feature", "Orta", "5", "Mehmet D.", "Sprint 5", "Devam Ediyor", "10.01.2026", "16.01.2026"],
        ["US-004", "Arama optimizasyonu", "Bug Fix", "Yüksek", "2", "Ali Ç.", "Sprint 5", "Tamamlandı", "06.01.2026", "06.01.2026"],
        ["US-005", "Mobil görünüm düzeltmeleri", "Bug Fix", "Orta", "5", "Ayşe K.", "Sprint 5", "Bekliyor", "", ""],
        ["US-006", "Çoklu dil desteği", "Feature", "Düşük", "13", "Mehmet D.", "Sprint 6", "Backlog", "", ""],
        ["US-007", "Bildirim sistemi", "Feature", "Orta", "8", "Ali Ç.", "Sprint 6", "Backlog", "", ""],
        ["", "", "", "Sprint 5 Toplam SP:", "23", "", "", "Tamamlanan SP:", "5", ""],
      ]
    },
  ],

  "📊 Veri Analizi": [
    {
      id: "satis_analiz",
      icon: "📉",
      name: "Satış Trend Analizi",
      desc: "Aylık satış karşılaştırması",
      data: [
        ["Ay", "2024 Satış (₺)", "2025 Satış (₺)", "2026 Satış (₺)", "2024-25 Değişim (%)", "2025-26 Değişim (%)", "En Yüksek Yıl"],
        ["Ocak", "125000", "148000", "175000", "", "", ""],
        ["Şubat", "118000", "135000", "162000", "", "", ""],
        ["Mart", "142000", "168000", "195000", "", "", ""],
        ["Nisan", "155000", "172000", "210000", "", "", ""],
        ["Mayıs", "168000", "185000", "225000", "", "", ""],
        ["Haziran", "175000", "198000", "240000", "", "", ""],
        ["", "", "", "", "", "", ""],
        ["TOPLAM", "", "", "", "", "", ""],
      ]
    },
    {
      id: "musteri_analiz",
      icon: "👥",
      name: "Müşteri RFM Analizi",
      desc: "Recency/Frequency/Monetary",
      isNew: true,
      data: [
        ["Müşteri ID", "Müşteri Adı", "Son Alışveriş", "Alışveriş Sayısı", "Toplam Harcama (₺)", "R Skoru", "F Skoru", "M Skoru", "RFM Skoru", "Segment"],
        ["M001", "ABC Ltd.", "15.01.2026", "24", "285000", "", "", "", "", ""],
        ["M002", "XYZ A.Ş.", "08.01.2026", "18", "192000", "", "", "", "", ""],
        ["M003", "DEF Koll.", "20.12.2025", "8", "75000", "", "", "", "", ""],
        ["M004", "GHI Ltd.", "05.11.2025", "3", "28000", "", "", "", "", ""],
        ["M005", "JKL A.Ş.", "01.10.2025", "1", "8500", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "kpi_dashboard",
      icon: "🎯",
      name: "KPI Dashboard",
      desc: "Temel performans göstergeleri",
      data: [
        ["KPI Adı", "Hedef", "Gerçekleşen", "Tamamlanma (%)", "Durum", "Trend", "Önceki Dönem", "Değişim (%)"],
        ["Aylık Gelir (₺)", "500000", "487000", "97.40", "Altında", "▼", "520000", "-6.35"],
        ["Yeni Müşteri", "50", "63", "126.00", "Hedef Aşıldı", "▲", "45", "+40.00"],
        ["Müşteri Memnuniyeti", "90", "87", "96.67", "Altında", "▼", "88", "-1.14"],
        ["Ortalama Sipariş (₺)", "8500", "9200", "108.24", "Hedef Aşıldı", "▲", "7800", "+17.95"],
        ["Müşteri Kayıp Oranı (%)", "5", "3.2", "64.00", "Hedef Aşıldı", "▼", "4.1", "-21.95"],
        ["Net Kar Marjı (%)", "25", "22.5", "90.00", "Altında", "▼", "24", "-6.25"],
        ["Aktif Müşteri Sayısı", "200", "218", "109.00", "Hedef Aşıldı", "▲", "195", "+11.79"],
        ["", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "anket_analiz",
      icon: "📋",
      name: "Anket Sonuç Analizi",
      desc: "Müşteri/çalışan anket verileri",
      data: [
        ["Soru", "Çok İyi (5)", "İyi (4)", "Orta (3)", "Kötü (2)", "Çok Kötü (1)", "Toplam", "Ortalama", "NPS"],
        ["Ürün kalitesi", "45", "32", "15", "5", "3", "100", "4.11", "+42"],
        ["Hizmet hızı", "38", "28", "22", "8", "4", "100", "3.88", "+34"],
        ["Fiyat/Performans", "28", "35", "25", "10", "2", "100", "3.77", "+26"],
        ["Müşteri desteği", "52", "24", "14", "6", "4", "100", "4.14", "+48"],
        ["Teslimat süreci", "40", "30", "18", "8", "4", "100", "3.94", "+36"],
        ["", "", "", "", "", "", "", "Genel Ort.", "+37.2"],
      ]
    },
    {
      id: "urun_karlilik",
      icon: "📊",
      name: "Ürün Karlılık Analizi",
      desc: "Ürün bazlı gelir, maliyet, kar marjı",
      isNew: true,
      data: [
        ["Ürün Kodu", "Ürün Adı", "Kategori", "Satış Adedi", "Birim Satış (₺)", "Toplam Gelir (₺)", "Birim Maliyet (₺)", "Toplam Maliyet (₺)", "Brüt Kar (₺)", "Kar Marjı (%)"],
        ["PRD-001", "Laptop Dell", "Elektronik", "28", "35000", "980000", "28000", "784000", "196000", "20.00"],
        ["PRD-002", "Mouse Logitech", "Çevre Birimleri", "145", "450", "65250", "320", "46400", "18850", "28.89"],
        ["PRD-003", "Monitör Samsung", "Elektronik", "22", "8500", "187000", "6500", "143000", "44000", "23.53"],
        ["PRD-004", "USB Hub", "Aksesuar", "230", "120", "27600", "75", "17250", "10350", "37.50"],
        ["PRD-005", "Kulaklık Sony", "Elektronik", "48", "890", "42720", "590", "28320", "14400", "33.71"],
        ["PRD-006", "Webcam Logitech", "Çevre Birimleri", "35", "1250", "43750", "820", "28700", "15050", "34.40"],
        ["", "TOPLAM", "", "508", "", "1346320", "", "1047670", "298650", "22.18"],
      ]
    },
    {
      id: "sikayet_takip",
      icon: "📢",
      name: "Müşteri Şikayet Takibi",
      desc: "Şikayet, çözüm süresi ve memnuniyet",
      isNew: true,
      data: [
        ["Şikayet No", "Müşteri", "Tarih", "Kanal", "Konu", "Öncelik", "Atanan", "Hedef Çözüm", "Gerçek Çözüm", "Süre (Gün)", "Çözüm", "Müşteri Memnuniyeti (1-5)"],
        ["SIK-001", "ABC Ltd.", "03.01.2026", "E-posta", "Ürün hasarlı geldi", "Yüksek", "Ali Ç.", "05.01.2026", "04.01.2026", "1", "Yeni ürün gönderildi", "5"],
        ["SIK-002", "XYZ A.Ş.", "07.01.2026", "Telefon", "Fatura tutarsızlığı", "Orta", "Ayşe K.", "10.01.2026", "09.01.2026", "2", "Fatura düzeltildi", "4"],
        ["SIK-003", "DEF Koll.", "10.01.2026", "Web Form", "Geç teslimat", "Orta", "Fatma Ş.", "14.01.2026", "13.01.2026", "3", "Kargo ile görüşüldü", "3"],
        ["SIK-004", "GHI Ltd.", "14.01.2026", "E-posta", "Teknik destek gecikmesi", "Düşük", "Mehmet D.", "17.01.2026", "", "", "Açık", ""],
        ["SIK-005", "JKL A.Ş.", "17.01.2026", "Telefon", "Yanlış ürün gönderildi", "Yüksek", "Ali Ç.", "19.01.2026", "18.01.2026", "1", "Doğru ürün gönderildi", "4"],
        ["", "", "", "", "", "", "", "", "Ort. Çözüm:", "1.75 gün", "", "Ort. Memnuniyet: 4.0"],
      ]
    },
  ],

  "🏢 Genel İşletme": [
    {
      id: "toplanti_takvim",
      icon: "📅",
      name: "Toplantı Takvimi",
      desc: "Haftalık toplantı programı",
      data: [
        ["Tarih", "Saat", "Toplantı Adı", "Organizatör", "Katılımcılar", "Yer/Platform", "Süre (Dk)", "Gündem", "Durum"],
        ["Pazartesi 19.01", "09:00", "Haftalık Ekip Toplantısı", "Ahmet Y.", "Tüm Ekip", "Zoom", "60", "Haftalık durum", "Planlandı"],
        ["Salı 20.01", "14:00", "Müşteri Görüşmesi", "Fatma Ş.", "Satış Ekibi, ABC Ltd.", "Ofis", "90", "Yeni teklif", "Planlandı"],
        ["Çarşamba 21.01", "10:00", "Sprint Review", "Mehmet D.", "Teknik Ekip", "Teams", "60", "Sprint değerlendirme", "Planlandı"],
        ["Perşembe 22.01", "15:00", "Bütçe Değerlendirme", "Ayşe K.", "Yönetim", "Toplantı Odası", "120", "Q1 bütçe", "Planlandı"],
        ["", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "gider_takip",
      icon: "💳",
      name: "Gider Takip Formu",
      desc: "Departman bazlı gider takibi",
      data: [
        ["Tarih", "Çalışan", "Departman", "Gider Türü", "Açıklama", "Tutar (₺)", "KDV", "Toplam (₺)", "Belge No", "Onay Durumu"],
        ["05.01.2026", "Ahmet Yılmaz", "Satış", "Ulaşım", "Müşteri ziyareti", "250", "20", "300", "GID-001", "Onaylandı"],
        ["08.01.2026", "Ayşe Kaya", "Muhasebe", "Kırtasiye", "Ofis malzemeleri", "180", "20", "216", "GID-002", "Onaylandı"],
        ["10.01.2026", "Mehmet Demir", "Teknik", "Yazılım", "Lisans yenileme", "1500", "20", "1800", "GID-003", "Bekliyor"],
        ["", "", "", "", "", "", "", "", "", ""],
        ["TOPLAM", "", "", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "iletisim_listesi",
      icon: "📞",
      name: "İletişim Listesi",
      desc: "Firma ve kişi rehberi",
      data: [
        ["Ad Soyad / Firma", "Unvan", "Telefon", "E-posta", "Şehir", "Kategori", "Son İletişim", "Not"],
        ["ABC Ltd. — Mehmet Bey", "Satın Alma Müdürü", "0212 xxx xxxx", "mehmet@abc.com", "İstanbul", "Müşteri", "15.01.2026", "VIP"],
        ["XYZ A.Ş. — Ayşe Hanım", "Genel Müdür", "0312 xxx xxxx", "ayse@xyz.com", "Ankara", "Müşteri", "08.01.2026", ""],
        ["Tedarikçi A", "Satış Temsilcisi", "0232 xxx xxxx", "satis@tedarikci.com", "İzmir", "Tedarikçi", "12.01.2026", ""],
        ["DEF Koll. — Hasan Bey", "Finans Direktörü", "0224 xxx xxxx", "hasan@def.com", "Bursa", "Müşteri", "10.01.2026", ""],
        ["Tedarikçi B — Zeynep H.", "Bölge Müdürü", "0322 xxx xxxx", "zeynep@tedb.com", "Adana", "Tedarikçi", "05.01.2026", "Öncelikli"],
        ["", "", "", "", "", "", "", ""],
      ]
    },
    {
      id: "vardiya_plani",
      icon: "🕐",
      name: "Vardiya Planı",
      desc: "Haftalık personel vardiya çizelgesi",
      isNew: true,
      data: [
        ["Ad Soyad", "Pozisyon", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar", "Toplam Saat"],
        ["Ahmet Yılmaz", "Müdür", "09:00-18:00", "09:00-18:00", "09:00-18:00", "09:00-18:00", "09:00-18:00", "İzin", "İzin", "45"],
        ["Ayşe Kaya", "Uzman", "08:00-17:00", "08:00-17:00", "08:00-17:00", "08:00-17:00", "08:00-17:00", "İzin", "İzin", "45"],
        ["Mehmet Demir", "Asistan", "İzin", "10:00-19:00", "10:00-19:00", "10:00-19:00", "10:00-19:00", "10:00-19:00", "İzin", "45"],
        ["Fatma Şahin", "Muhasebe", "09:00-18:00", "09:00-18:00", "İzin", "09:00-18:00", "09:00-18:00", "İzin", "İzin", "36"],
        ["Ali Çelik", "Satış", "10:00-19:00", "10:00-19:00", "10:00-19:00", "İzin", "10:00-19:00", "10:00-16:00", "İzin", "42"],
        ["Hüseyin Güneş", "Tasarım", "İzin", "İzin", "09:00-18:00", "09:00-18:00", "09:00-18:00", "09:00-18:00", "09:00-18:00", "45"],
        ["Zeynep Arslan", "İK", "09:00-18:00", "09:00-18:00", "09:00-18:00", "09:00-18:00", "İzin", "İzin", "İzin", "36"],
        ["", "", "", "", "", "", "", "Toplam:", "", "294"],
      ]
    },
    {
      id: "arac_takip",
      icon: "🚗",
      name: "Araç Takibi",
      desc: "Şirket araçları kullanım ve bakım",
      isNew: true,
      data: [
        ["Plaka", "Marka/Model", "Kullanan", "Amaç", "Tarih", "Başlangıç KM", "Bitiş KM", "Toplam KM", "Yakıt (Lt)", "Yakıt Tutarı (₺)", "Diğer Gider (₺)", "Not"],
        ["34 ABC 001", "Toyota Corolla", "Ali Çelik", "Müşteri Ziyareti", "15.01.2026", "45200", "45450", "250", "18.5", "925", "", "İstanbul içi"],
        ["34 ABC 001", "Toyota Corolla", "Fatma Şahin", "Tedarikçi Toplantısı", "17.01.2026", "45450", "45850", "400", "29.6", "1480", "", "Ankara yolculuğu"],
        ["06 DEF 234", "Renault Symbol", "Mehmet Demir", "Depo Transferi", "16.01.2026", "28100", "28350", "250", "20.0", "1000", "150", "Lastik şişirmesi"],
        ["06 DEF 234", "Renault Symbol", "Ahmet Yılmaz", "Müşteri Ziyareti", "18.01.2026", "28350", "28600", "250", "20.0", "1000", "", ""],
        ["34 GHI 567", "Ford Transit", "Dış Servis", "Teslimat", "15.01.2026", "62300", "62900", "600", "72.0", "3600", "500", "6 aylık bakım"],
        ["34 GHI 567", "Ford Transit", "Ali Çelik", "Toplu Teslimat", "19.01.2026", "62900", "63250", "350", "42.0", "2100", "", ""],
        ["", "", "", "TOPLAM", "", "", "", "2100", "202.1", "10105", "650", ""],
      ]
    },
  ],
};

function renderTemplatePanel() {
  const list = document.getElementById('templateList');
  if (!list || list.dataset.rendered) return;
  list.dataset.rendered = '1';

  let html = '';
  const entries = Object.entries(TEMPLATES);
  entries.forEach(([catName, items], catIndex) => {
    const catId = 'cat_' + catIndex;
    const isFirst = catIndex === 0;
    html += `
      <div class="tmpl-category" id="${catId}">
        <div class="tmpl-cat-header" onclick="toggleCategory('${catId}')">
          <div class="tmpl-cat-left">
            <span>${catName}</span>
            <span class="tmpl-cat-badge">${items.length}</span>
          </div>
          <span class="tmpl-cat-arrow ${isFirst ? 'open' : ''}" id="arrow_${catId}">›</span>
        </div>
        <div class="tmpl-items ${isFirst ? 'open' : ''}" id="items_${catId}">
    `;
    items.forEach(item => {
      html += `
        <div class="tmpl-item" id="tmpl_${item.id}"
             onclick="loadTemplate('${item.id}')"
             title="${item.name} — ${item.desc}">
          <span class="tmpl-item-icon">${item.icon}</span>
          <div class="tmpl-item-text">
            <div class="tmpl-item-name">${item.name}</div>
            <div class="tmpl-item-desc">${item.desc}</div>
          </div>
          ${item.isNew ? '<span class="tmpl-new-badge">YENİ</span>' : ''}
        </div>
      `;
    });
    html += `</div></div>`;
    if (catIndex < entries.length - 1) html += `<div class="tmpl-cat-divider"></div>`;
  });

  list.innerHTML = html;
}

function toggleCategory(catId) {
  const items = document.getElementById('items_' + catId);
  const arrow = document.getElementById('arrow_' + catId);
  if (!items) return;
  const isOpen = items.classList.contains('open');
  items.classList.toggle('open', !isOpen);
  if (arrow) arrow.classList.toggle('open', !isOpen);
}

function loadTemplate(id) {
  if (id === 'blank') {
    const blankData = [];
    for (let r = 0; r < 20; r++) blankData.push(new Array(10).fill(''));
    const sheetName = 'Yeni Tablo';
    sheets[sheetName] = blankData;
    activeSheet = sheetName;
    buildGrid(blankData);
    if (typeof addMessage === 'function') addMessage('✓ Boş tablo oluşturuldu. Düzenlemeye başlayabilirsiniz.', 'ai');
    if (typeof showToast === 'function') showToast('✓ Boş tablo oluşturuldu', 'success');
    return;
  }

  let found = null;
  Object.values(TEMPLATES).forEach(items => {
    const item = items.find(t => t.id === id);
    if (item) found = item;
  });
  if (!found) return;

  document.querySelectorAll('.tmpl-item').forEach(el => el.classList.remove('active'));
  const activeEl = document.getElementById('tmpl_' + id);
  if (activeEl) activeEl.classList.add('active');

  const sheetName = found.name;
  sheets[sheetName] = found.data.map(row => [...row]);
  activeSheet = sheetName;
  buildGrid(sheets[sheetName]);

  if (typeof showToast === 'function') showToast(`✓ "${found.name}" şablonu yüklendi`, 'success');
  if (typeof addMessage === 'function') addMessage(
    `📋 **${found.name}** şablonu yüklendi.\n\n${found.desc}\n\nAI komutlarıyla düzenleyebilirsiniz. Örn: "KDV hesapla", "Topla", "Sırala"`,
    'ai'
  );
}

function filterTemplates(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    document.querySelectorAll('.tmpl-item').forEach(el => el.style.display = '');
    document.querySelectorAll('.tmpl-category').forEach(el => el.style.display = '');
    document.querySelectorAll('.tmpl-cat-divider').forEach(el => el.style.display = '');
    return;
  }
  Object.entries(TEMPLATES).forEach(([catName, items], catIndex) => {
    const catId = 'cat_' + catIndex;
    let catHasMatch = false;
    items.forEach(item => {
      const el = document.getElementById('tmpl_' + item.id);
      if (!el) return;
      const matches = item.name.toLowerCase().includes(q) ||
                      item.desc.toLowerCase().includes(q) ||
                      catName.toLowerCase().includes(q);
      el.style.display = matches ? '' : 'none';
      if (matches) catHasMatch = true;
    });
    const catEl = document.getElementById(catId);
    if (catEl) catEl.style.display = catHasMatch ? '' : 'none';
    if (catHasMatch) {
      const itemsEl = document.getElementById('items_' + catId);
      const arrowEl = document.getElementById('arrow_' + catId);
      if (itemsEl) itemsEl.classList.add('open');
      if (arrowEl) arrowEl.classList.add('open');
    }
  });
  document.querySelectorAll('.tmpl-cat-divider').forEach(el => el.style.display = q ? 'none' : '');
}

function switchSidebarTab() {} // no-op: single-panel sidebar

// ── Sidebar New Functions ────────────────────────────────────────

function toggleSbSection(id, triggerEl) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle('open');
  if (triggerEl) triggerEl.classList.toggle('open');
}

function toggleTmplCat(catId) {
  const items = document.getElementById(catId);
  const key = catId.replace('cat_', '');
  const arrow = document.getElementById('catarrow_' + key);
  if (!items) return;
  items.classList.toggle('open');
  if (arrow) arrow.classList.toggle('open');
}

function handleSidebarSearch(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.sb-sheet-tab').forEach(el => {
    const name = el.querySelector('.sb-sheet-tab-name')?.textContent || '';
    el.style.display = !q || name.toLowerCase().includes(q) ? '' : 'none';
  });
  document.querySelectorAll('.sb-tmpl-item').forEach(el => {
    const text = el.textContent.toLowerCase();
    const matches = !q || text.includes(q);
    el.style.display = matches ? '' : 'none';
    if (matches && q) {
      el.closest('.sb-tmpl-items')?.classList.add('open');
      const catId = el.closest('.sb-tmpl-items')?.id;
      if (catId) {
        document.getElementById('catarrow_' + catId.replace('cat_', ''))?.classList.add('open');
      }
      document.getElementById('tmplSection')?.classList.add('open');
      document.getElementById('tmplTrigger')?.classList.add('open');
    }
  });
}

function renderSheetList() {
  const container = document.getElementById('sheetListContainer');
  if (!container) return;
  let html = '';
  Object.keys(sheets || {}).forEach(name => {
    const isActive = name === activeSheet;
    const escapedName = name.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    html += `<div class="sb-sheet-tab ${isActive ? 'active' : ''}" data-sheet="${escapedName}" onclick="switchSheet(this.dataset.sheet)">
      <span class="sb-sheet-tab-icon">📄</span>
      <span class="sb-sheet-tab-name">${escHtml(name)}</span>
      <span class="sb-sheet-tab-close" onclick="event.stopPropagation();deleteSheetDirect(this.closest('.sb-sheet-tab').dataset.sheet)">×</span>
    </div>`;
  });
  container.innerHTML = html;
}

function updateSidebarUser() {
  try {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!key) return;
    const session = JSON.parse(localStorage.getItem(key));
    const email = session?.user?.email || '';
    if (!email) return;
    const meta = session?.user?.user_metadata || {};
    const name = meta.full_name || meta.name || email.split('@')[0];
    const initial = name[0].toUpperCase();

    const avatar = document.getElementById('sbAvatar');
    const nameEl = document.getElementById('sbUserName');
    if (avatar) avatar.textContent = initial;
    if (nameEl) nameEl.textContent = name;

    // dropdown
    const udAvatar = document.getElementById('sbUdAvatar');
    const udName = document.getElementById('sbUdName');
    const udEmail = document.getElementById('sbUdEmail');
    if (udAvatar) udAvatar.textContent = initial;
    if (udName) udName.textContent = name;
    if (udEmail) udEmail.textContent = email;

    // plan dot + upgrade visibility
    const planMeta = session?.user?.user_metadata;
    const planRaw = planMeta?.plan || localStorage.getItem('user_plan') || 'free';
    const planLower = planRaw.toLowerCase();
    const dot = document.getElementById('sbPlanDot');
    const planLabel = document.getElementById('sbPlanLabel');
    const upgradeWrap = document.getElementById('sbUpgradeWrap');
    const udUpgrade = document.getElementById('sbUdUpgrade');
    const dotClass = planLower.includes('business') ? 'business' : planLower.includes('pro') ? 'pro' : 'free';
    const planDisplay = planLower.includes('business') ? 'Business Plan' : planLower.includes('pro') ? 'Pro Plan' : 'Free Plan';
    if (dot) dot.className = 'sb-plan-dot ' + dotClass;
    if (planLabel) planLabel.textContent = planDisplay;
    const isBusiness = planLower.includes('business');
    if (upgradeWrap) upgradeWrap.style.display = isBusiness ? 'none' : '';
    if (udUpgrade) udUpgrade.style.display = isBusiness ? 'none' : '';
  } catch(e) {}
}

function toggleUserMenu() {
  const dd = document.getElementById('userDropdown');
  if (!dd) return;
  const isOpen = dd.style.display !== 'none';
  dd.style.display = isOpen ? 'none' : 'block';
  if (!isOpen) {
    setTimeout(() => document.addEventListener('click', _closeUserMenuOutside, {once: true}), 0);
  }
}

function _closeUserMenuOutside(e) {
  const dd = document.getElementById('userDropdown');
  const wrap = document.querySelector('.sb-user-wrap');
  if (dd && wrap && !wrap.contains(e.target)) dd.style.display = 'none';
}

function toggleDarkMode() {
  toggleTheme();
  const isDark = document.body.classList.contains('dark');
  const toggle = document.getElementById('darkToggle');
  if (toggle) toggle.classList.toggle('on', isDark);
}

function focusChatInput() {
  const input = document.getElementById('chat-input') ||
                document.querySelector('input[placeholder*="komut"]') ||
                document.querySelector('input[placeholder*="command"]');
  if (input) { input.focus(); if (typeof expandChat === 'function') expandChat(); }
}

function showKeyboardShortcuts() {
  showModal(
    '<h2 style="margin-bottom:12px">⌨️ Klavye Kısayolları</h2>' +
    '<table style="width:100%;font-size:13px;border-collapse:collapse">' +
    '<tr><td style="padding:6px 12px 6px 0;color:#94a3b8">Enter</td><td>Komut gönder</td></tr>' +
    '<tr><td style="padding:6px 12px 6px 0;color:#94a3b8">Escape</td><td>Sohbeti kapat</td></tr>' +
    '<tr><td style="padding:6px 12px 6px 0;color:#94a3b8">Ctrl+S</td><td>Kaydet</td></tr>' +
    '<tr><td style="padding:6px 12px 6px 0;color:#94a3b8">Ctrl+E</td><td>Dışa aktar</td></tr>' +
    '</table>' +
    '<div class="modal-foot"><button class="btn btn-ghost" onclick="closeModal()">Kapat</button></div>'
  );
}

document.addEventListener('DOMContentLoaded', () => {
  const isDark = document.body.classList.contains('dark') ||
                 localStorage.getItem('theme') === 'dark';
  const toggle = document.getElementById('darkToggle');
  if (toggle && isDark) toggle.classList.add('on');
});

// ═══════════════════════════════════════════════════════════════
//  PDF IMPORT FEATURE
// ═══════════════════════════════════════════════════════════════

let _pdfData = null;
let _pdfSelectedId = null;

function openPdfModal() {
  document.getElementById('pdfModal').classList.add('open');
  _pdfResetStep1();
}

function closePdfModal() {
  document.getElementById('pdfModal').classList.remove('open');
  _pdfData = null;
  _pdfSelectedId = null;
}

function pdfModalClickOutside(e) {
  if (e.target === document.getElementById('pdfModal')) closePdfModal();
}

function pdfGoBack() { _pdfResetStep1(); }

function _pdfResetStep1() {
  _pdfData = null;
  _pdfSelectedId = null;
  document.getElementById('pdfStep1').style.display = '';
  document.getElementById('pdfStep2').style.display = 'none';
  document.getElementById('pdfUploadProgress').style.display = 'none';
  document.getElementById('pdfUploadError').style.display = 'none';
  document.getElementById('pdfImportBtn').style.display = 'none';
  document.getElementById('pdfBackBtn').style.display = 'none';
  document.getElementById('pdfProgressFill').style.width = '0%';
  document.getElementById('pdfFileInput').value = '';
  document.getElementById('pdfModalTitle').textContent = 'PDF\'ten Veri İçe Aktar';
}

function pdfDragOver(e) {
  e.preventDefault();
  document.getElementById('pdfDropZone').classList.add('dragover');
}

function pdfDragLeave(e) {
  document.getElementById('pdfDropZone').classList.remove('dragover');
}

function pdfDrop(e) {
  e.preventDefault();
  document.getElementById('pdfDropZone').classList.remove('dragover');
  const file = e.dataTransfer.files[0];
  if (file) _pdfProcessFile(file);
}

function pdfFileSelected(e) {
  const file = e.target.files[0];
  if (file) _pdfProcessFile(file);
}

async function _pdfProcessFile(file) {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    _pdfShowUploadError('Lütfen geçerli bir PDF dosyası seçin.');
    return;
  }
  const sizeMB = file.size / (1024 * 1024);
  if (sizeMB > 30) {
    _pdfShowUploadError(`Dosya çok büyük: ${sizeMB.toFixed(1)}MB. Maksimum boyut 30MB'tır.`);
    return;
  }

  document.getElementById('pdfUploadProgress').style.display = '';
  document.getElementById('pdfUploadError').style.display = 'none';
  document.getElementById('pdfProgressLabel').textContent = 'PDF analiz ediliyor... (Claude görsel olarak tarayıyor)';

  let prog = 0;
  const progInterval = setInterval(() => {
    prog = Math.min(prog + Math.random() * 6, 88);
    document.getElementById('pdfProgressFill').style.width = prog + '%';
  }, 500);

  try {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('pdf', file);

    const res = await fetch(API_URL + '/api/pdf/extract', {
      method: 'POST',
      headers: token ? { 'Authorization': 'Bearer ' + token } : {},
      body: formData
    });

    clearInterval(progInterval);
    document.getElementById('pdfProgressFill').style.width = '100%';

    if (res.status === 401) { window.location.href = 'auth.html'; return; }
    if (res.status === 413) { _pdfShowUploadError('Dosya boyutu sunucu limitini aşıyor. Daha küçük bir PDF deneyin.'); return; }
    if (res.status === 429 || res.status === 403) {
      const d = await res.json().catch(() => ({}));
      _pdfShowUploadError(d.error || 'Aylık AI kullanım limitine ulaştınız.');
      return;
    }
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      _pdfShowUploadError(d.error || 'PDF analiz hatası. Lütfen tekrar deneyin.');
      return;
    }

    const data = await res.json();
    if (data.error) { _pdfShowUploadError(data.error); return; }

    _pdfData = data;
    _pdfShowStep2(data);

  } catch (err) {
    clearInterval(progInterval);
    _pdfShowUploadError('Sunucuya bağlanılamadı: ' + err.message);
  }
}

function _pdfShowUploadError(msg) {
  document.getElementById('pdfUploadProgress').style.display = 'none';
  const el = document.getElementById('pdfUploadError');
  el.textContent = msg;
  el.style.display = '';
}

function _pdfShowStep2(data) {
  document.getElementById('pdfStep1').style.display = 'none';
  document.getElementById('pdfStep2').style.display = '';
  document.getElementById('pdfBackBtn').style.display = '';
  document.getElementById('pdfModalTitle').textContent = 'Tabloyu Seçin ve Önizleyin';

  const sum = data.document_summary || {};
  document.getElementById('pdfDocType').textContent = '📄 ' + (sum.type || 'belge').toUpperCase();

  const pagesEl = document.getElementById('pdfDocPages');
  pagesEl.textContent = sum.page_count ? sum.page_count + ' sayfa' : '';
  pagesEl.style.display = sum.page_count ? '' : 'none';

  const qEl = document.getElementById('pdfDocQuality');
  const qMap = { 'yüksek': ['pdf-badge-q-high', '✓ Yüksek Kalite'], 'orta': ['pdf-badge-q-mid', '~ Orta Kalite'], 'düşük': ['pdf-badge-q-low', '⚠ Düşük Kalite'] };
  const [qCls, qTxt] = qMap[data.extraction_quality] || qMap['orta'];
  qEl.className = 'pdf-badge ' + qCls;
  qEl.textContent = qTxt;

  document.getElementById('pdfDocDesc').textContent = sum.description || '';

  if (data.warnings && data.warnings.length > 0) {
    document.getElementById('pdfWarningsList').innerHTML = data.warnings.map(w => `<li>${escHtml(String(w))}</li>`).join('');
    document.getElementById('pdfWarningsBox').style.display = '';
  } else {
    document.getElementById('pdfWarningsBox').style.display = 'none';
  }

  const tables = data.tables || [];

  if (tables.length === 0) {
    document.getElementById('pdfNoTableMsg').style.display = '';
    document.getElementById('pdfTableSelector').style.display = 'none';
    document.getElementById('pdfTablePreview').style.display = 'none';
    return;
  }

  document.getElementById('pdfNoTableMsg').style.display = 'none';
  document.getElementById('pdfImportBtn').style.display = '';

  if (tables.length > 1) {
    const list = document.getElementById('pdfTableList');
    list.innerHTML = tables.map((t, i) => `
      <label class="pdf-table-radio${i === 0 ? ' selected' : ''}" onclick="pdfSelectTable(${t.id}, this)">
        <input type="radio" name="pdfTableChoice" value="${t.id}" ${i === 0 ? 'checked' : ''}>
        <div>
          <div class="pdf-table-radio-label">${escHtml(String(t.title))}</div>
          <div class="pdf-table-radio-meta">${t.row_count} satır · ${t.col_count} sütun${t.page ? ' · Sayfa ' + t.page : ''}</div>
        </div>
      </label>
    `).join('');
    document.getElementById('pdfTableSelector').style.display = '';
  } else {
    document.getElementById('pdfTableSelector').style.display = 'none';
  }

  _pdfSelectedId = tables[0].id;
  _pdfRenderPreview(tables[0]);
}

function pdfSelectTable(id, labelEl) {
  _pdfSelectedId = id;
  document.querySelectorAll('.pdf-table-radio').forEach(el => el.classList.remove('selected'));
  if (labelEl) labelEl.classList.add('selected');
  const table = (_pdfData.tables || []).find(t => t.id === id);
  if (table) _pdfRenderPreview(table);
}

function _pdfRenderPreview(table) {
  document.getElementById('pdfPreviewMeta').textContent =
    `(${table.row_count} satır, ${table.col_count} sütun — ilk 10 satır)`;

  const headers = table.headers || [];
  const rows = (table.rows || []).slice(0, 10);

  let html = '<thead><tr>' + headers.map(h => `<th>${escHtml(String(h))}</th>`).join('') + '</tr></thead><tbody>';
  html += rows.map(row =>
    '<tr>' + headers.map((_, i) => `<td>${escHtml(String(row[i] ?? ''))}</td>`).join('') + '</tr>'
  ).join('');
  html += '</tbody>';
  document.getElementById('pdfPreviewTable').innerHTML = html;
  document.getElementById('pdfTablePreview').style.display = '';
}

function pdfImport() {
  if (!_pdfData || _pdfSelectedId === null) return;
  const table = (_pdfData.tables || []).find(t => t.id === _pdfSelectedId);
  if (!table) { toast('Tablo bulunamadı.', 'err'); return; }

  const gridData = [table.headers, ...table.rows];
  const newRows = Math.max(ROWS, gridData.length);
  const grid = Array.from({ length: newRows }, () => Array(COLS).fill(''));
  gridData.forEach((row, r) => {
    (row || []).forEach((cell, c) => {
      if (c < COLS) grid[r][c] = String(cell ?? '');
    });
  });

  sheets[activeSheet] = grid;
  addHistory('file', `PDF'ten "${table.title}" tablosu içe aktarıldı`);
  buildGrid(grid);
  closePdfModal();
  toast(`✓ "${table.title}" aktarıldı — ${table.row_count} satır, ${table.col_count} sütun`, 'ok');
}

// ── Toolbar: file rename ─────────────────────────────────────
function renameFile(name) {
  if (!name.trim()) return;
  const saved = document.getElementById('tbSaved');
  if (saved) {
    saved.classList.add('visible');
    setTimeout(() => saved.classList.remove('visible'), 2000);
  }
}

// ── Toolbar: keyboard shortcuts ──────────────────────────────
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
    e.preventDefault();
    downloadFile();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    const saved = document.getElementById('tbSaved');
    if (saved) {
      saved.classList.add('visible');
      setTimeout(() => saved.classList.remove('visible'), 2000);
    }
  }
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); toggleFormat('bold'); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'i') { e.preventDefault(); toggleFormat('italic'); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'u') { e.preventDefault(); toggleFormat('underline'); }
});

