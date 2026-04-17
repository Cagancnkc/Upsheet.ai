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
    if (e.key === 'z') { e.preventDefault(); toast(t('toast_undo_soon'), 'ok'); }
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
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  if (!meta[key]) meta[key] = {};
  meta[key].fontFamily = family;
  const inp = getInput(selRow, selCol);
  if (inp) inp.style.fontFamily = family;
}

function applyFontSize(size) {
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  if (!meta[key]) meta[key] = {};
  meta[key].fontSize = parseInt(size);
  const inp = getInput(selRow, selCol);
  if (inp) inp.style.fontSize = size + 'px';
}

function updateToolbarState() {
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  const m = meta[key] || {};
  document.getElementById('tbBold').classList.toggle('on', !!m.bold);
  document.getElementById('tbItalic').classList.toggle('on', !!m.italic);
  document.getElementById('tbUnderline').classList.toggle('on', !!m.underline);
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

  // ── Sidebar sheet list ──────────────────────
  const sbList = document.getElementById('sbSheetList');
  sbList.innerHTML = '';
  Object.keys(sheets).forEach(name => {
    const count = sheetCellCount(name);
    const item = document.createElement('div');
    item.className = 'sb-item' + (name === activeSheet ? ' active' : '');
    item.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
      <span style="flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${name}</span>
      <span class="badge">${count}</span>`;
    item.onclick = () => switchSheet(name);
    item.addEventListener('contextmenu', e => showSheetCtx(e, name));
    sbList.appendChild(item);
  });
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
      document.title = 'ExcelAI — ' + file.name;
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
    } catch(err) {
      toast('Could not read file: ' + err.message, 'err');
    }
  };

  if (isCSV) reader.readAsText(file, 'UTF-8');
  else reader.readAsBinaryString(file);
  if (e.target) e.target.value = '';
}

function downloadFile() {
  const fileName = document.getElementById('fileNameInput').value || 'ExcelAI.xlsx';
  const wb = XLSX.utils.book_new();
  Object.entries(sheets).forEach(([name, data]) => {
    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, name);
  });
  XLSX.writeFile(wb, fileName.endsWith('.xlsx') ? fileName : fileName + '.xlsx');
  toast(tpl('toast_downloaded_tpl', {name: fileName}), 'ok');
  // Export webhook
  try {
    const _wh = JSON.parse(localStorage.getItem('int_webhook') || '{}');
    if (_wh.url && (_wh.trigger === 'export' || _wh.trigger === 'all')) {
      fetch(API_URL + '/api/integrations/webhook/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: _wh.url, event: 'export', data: { filename: fileName, rows: (sheets[activeSheet] || []).length, format: 'xlsx', timestamp: new Date().toISOString() } }) }).catch(() => {});
    }
  } catch(_e) {}
}

function downloadCSV() {
  const baseName = (document.getElementById('fileNameInput').value || 'ExcelAI')
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
  document.title = 'ExcelAI — ' + name;
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
  el.innerHTML = recentFiles.map(f => `
    <div class="rf-item${f.name === activeName ? ' active' : ''}" onclick="">
      <div class="file-icon-xs">XL</div>
      <div class="rf-item-info">
        <div class="rf-item-name">${f.name}</div>
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
  document.title = 'ExcelAI — ' + val;
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
  } else {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.body.classList.contains('dark');
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = isDark ? t('theme_light') : t('theme_dark');
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
  if (!el) return;
  el.innerHTML = `<span style="color:#16a34a;">● Connected</span>`;
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
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const undoBtn = undoable ? `<button class="toast-undo" onclick="undo();this.closest('.toast').remove()">${t('undo')}</button>` : '';
  t.innerHTML = `<div class="toast-bar"></div><div class="toast-body">${icons[type]||icons.ok}<span>${msg}</span>${undoBtn}</div>`;
  container.appendChild(t);
  const hide = () => { t.classList.add('leaving'); setTimeout(() => t.remove(), 310); };
  setTimeout(hide, 3000);
}
function showToast(msg, type, undoable) { toast(msg, type, undoable); }

function undo() {
  if (!versionHistory || versionHistory.length < 2) { toast(t('toast_nothing_undo'), 'info'); return; }
  versionHistory.shift();
  const prev = versionHistory[0];
  sheets = JSON.parse(JSON.stringify(prev.snap.sheets));
  cellMeta = JSON.parse(JSON.stringify(prev.snap.cellMeta));
  activeSheet = prev.snap.activeSheet;
  buildGrid();
  if (typeof renderSheetTabs === 'function') renderSheetTabs();
  updateStatus();
  toast(t('toast_undone'), 'info');
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

function useChipCmd(text) {
  const inp = document.getElementById('chatInput');
  if (inp) { inp.value = text; inp.focus(); }
  sendChatMessage();
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
  item.innerHTML = `<span>${icon}</span><span style="max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${att.name}</span><button onclick="removeChatAttachment('${att.name}')" style="background:none;border:none;cursor:pointer;color:#f97316;font-size:14px;padding:0;line-height:1;">×</button>`;
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
  if (isProcessing) { console.log('[Guard] sendChat engellendi — işlem devam ediyor'); return; }
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg && !chatAttachments.length) return;
  isProcessing = true;
  input.value = '';
  input.style.height = '34px';

  const displayMsg = msg || chatAttachments.map(a => `📎 ${a.name}`).join(', ');
  addMsg('user', displayMsg);
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
  const system = `You are an Excel AI assistant. Analyze the user's Excel data, suggest formulas, and provide insights.
Active sheet: "${activeSheet}"
First 20 rows, 10 columns of data:
${sheetCtx}

Kısa ve net Türkçe yanıtlar ver. Formül önerileri için standart Excel formatını kullan (=TOPLA(), =ORTALAMA(), =SUM(), =AVERAGE(), vb.).`;

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
    default:
      break;
  }

  // changes varsa grid'i yenile
  if (result.changes && result.changes.length > 0) {
    refreshGrid();
    if (typeof showToast === 'function') showToast(result.reply || '✓ Güncellendi', 'success');
  }
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
  if (typeof showToast === 'function')
    showToast((data.reply || '✓ Değerler güncellendi') + ' (' + changed + ' hücre)', 'success');
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

  let highlighted = 0;
  for (let r = 1; r < sheet.length; r++) {
    const cols = targetCol >= 0 ? [targetCol] : headers.map(function(_, i) { return i; });
    cols.forEach(function(c) {
      const raw = sheet[r][c];
      const num = parseFloat(String(raw || '').replace(',', '.'));
      let match = false;

      if (condition === 'negative' || condition === 'value < 0' || condition === 'negatif' || condition === 'isnegative') match = !isNaN(num) && num < 0;
      else if (condition === 'positive' || condition === 'value > 0' || condition === 'pozitif' || condition === 'ispositive') match = !isNaN(num) && num > 0;
      else if (condition === 'high') match = !isNaN(num) && num > 0;
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
          <div style="font-size:12px;color:#6b6b6b;margin-top:3px;">"${document.getElementById('cmdInput').value}"</div>
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
    summary: `Create a short, clear executive summary from this Excel data.`,
    formula: `Suggest useful Excel formulas for this data structure.`,
    // legacy Turkish keys for backward compat
    analiz:  `Analyze the data in the active sheet "${activeSheet}" and highlight key insights.`,
    grafik:  `Suggest the most suitable chart type for this data and explain why.`,
    özet:    `Create a short, clear executive summary from this Excel data.`,
    formül:  `Suggest useful Excel formulas for this data structure.`,
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
  const sb = document.getElementById('sidebar');
  const icon = document.getElementById('sbCollapseIcon');
  const btn = document.getElementById('sbCollapseBtn');
  const collapsed = sb.classList.toggle('collapsed');
  document.body.classList.toggle('sidebar-collapsed', collapsed);
  const poly = icon.querySelector('polyline');
  if (poly) poly.setAttribute('points', collapsed ? '9 18 15 12 9 6' : '15 18 9 12 15 6');
  btn.title = collapsed ? 'Kenar Çubuğunu Genişlet' : 'Kenar Çubuğunu Daralt';
  localStorage.setItem('sb_collapsed', collapsed ? '1' : '0');
}

function init() {
  try { const s = localStorage.getItem('recent_files'); if (s) recentFiles = JSON.parse(s); } catch(e) {}
  renderRecentFiles();
  renderSheetTabs();
  buildGrid();
  if (!loadChatHistory()) addWelcomeMsg();
  updateApiStatus();
  initOnboardBanner();
  checkEmptyState();
  renderVersionHistory();
  loadHistory();
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
  versionHistory.unshift({ type, desc: text, text, time: Date.now() });
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
        <div class="vh-desc" title="${entry.desc}">${entry.desc}</div>
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
      html += `<td class="${v ? 'hv' : ''}" title="${v}">${v.length > 10 ? v.substring(0,10)+'…' : v}</td>`;
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
        return `<div class="es-recent-item" onclick="loadRecentFile(${i})">📄 ${f.name || 'File'}</div>`;
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
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.body.classList.add(savedTheme);
  updateThemeIcon();
  setTimeout(loadUserUsage, 500);

  const gw = document.getElementById('gridWrap');
  if (gw) gw.addEventListener('input', () => {
    clearTimeout(_cellEditTimer);
    _cellEditTimer = setTimeout(() => {
      const ref = colLetter(selCol) + (selRow + 1);
      addHistory('manual', ref + ' edited');
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
      ['excel_autosave_v1','excel_autosave_v2','excel_autosave_v3'].forEach(function(k) {
        try { localStorage.removeItem(k); } catch(e) {}
      });
      // Also prune chat history if needed
      if (serialized.length > MB4 * 1.5) {
        try { localStorage.removeItem('chat_history'); } catch(e) {}
      }
    }

    localStorage.setItem('excel_autosave', serialized);
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
        localStorage.setItem('excel_autosave', JSON.stringify(minPayload));
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
    const raw = localStorage.getItem('excel_autosave');
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
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const undoBtn  = undoable ? `<button class="toast-undo" onclick="undo();this.closest('.toast').remove()">${t('undo')}</button>` : '';
  const closeBtn = `<button class="toast-close" onclick="this.closest('.toast').remove()">×</button>`;
  t.innerHTML = `<div class="toast-bar"></div><div class="toast-body">${ICONS[type]||ICONS.ok}<span class="toast-msg">${msg}</span>${undoBtn}${closeBtn}</div><div class="toast-progress-wrap"><div class="toast-progress"></div></div>`;
  container.appendChild(t);
  const pb = t.querySelector('.toast-progress');
  if (pb) requestAnimationFrame(function() { pb.style.transition = 'width ' + duration + 'ms linear'; pb.style.width = '0%'; });
  var hide = function() { t.classList.add('leaving'); setTimeout(function() { if (t.parentNode) t.remove(); }, 310); };
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
  selRow2 = ROWS - 1; selCol2 = COLS - 1;
  if (typeof highlightSelection === 'function') highlightSelection();
  toast(t('toast_all_selected'), 'info');
}

// ── 6. Extra keyboard shortcuts ──────────────────────────────
document.addEventListener('keydown', function(e) {
  var ctrl = e.ctrlKey || e.metaKey;
  var tag  = document.activeElement ? document.activeElement.tagName : '';
  var inInput = (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT');

  // Ctrl+Enter → send chat (when chat input active)
  if (ctrl && e.key === 'Enter') {
    var ci = document.getElementById('chatInput');
    if (ci && document.activeElement === ci && !ci.disabled) {
      e.preventDefault();
      // sendChatMessage kullan — isProcessing guard zaten çift çağrıyı önler
      if (typeof sendChatMessage === 'function') sendChatMessage();
    }
  }

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
    var r1 = Math.min(selRow, selRow2 !== undefined ? selRow2 : selRow);
    var r2 = Math.max(selRow, selRow2 !== undefined ? selRow2 : selRow);
    var c1 = Math.min(selCol, selCol2 !== undefined ? selCol2 : selCol);
    var c2 = Math.max(selCol, selCol2 !== undefined ? selCol2 : selCol);
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
    var req = indexedDB.open('ExcelAI', 1);
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
  var uploadRes   = await sb.storage.from('excel-files').upload(storagePath, file, { upsert: false });
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

    var upRes = await sb.storage.from('excel-files').upload(recRes.data.storage_path, blob, { upsert: true });
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
async function syncFromSupabase(fileId) {
  try {
    var recRes = await sb.from('files').select('*').eq('id', fileId).single();
    if (recRes.error) return;
    var blobRes = await sb.storage.from('excel-files').download(recRes.data.storage_path);
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
  try {
    var db     = await openIDB();
    var cached = await idbGet(db, 'files', fileId);
    if (cached) {
      sheets      = cached.data;
      activeSheet = Object.keys(sheets)[0];
      currentFileId = fileId;
      document.getElementById('fileName').textContent        = cached.name;
      document.getElementById('fileNameInput').value         = cached.name;
      document.title = 'ExcelAI — ' + cached.name;
      buildGrid();
      renderSheetTabs();
      // Highlight active sidebar item
      var list = document.getElementById('recentFiles');
      if (list) list.querySelectorAll('.sb-file-item').forEach(function(el) {
        el.classList.toggle('active', el.dataset.id === String(fileId));
      });
      // Background sync from cloud
      syncFromSupabase(fileId);
      return;
    }

    // Not cached — download from Supabase
    var recRes = await sb.from('files').select('*').eq('id', fileId).single();
    if (recRes.error) { toast(t('toast_file_not_found'), 'err'); return; }
    var blobRes = await sb.storage.from('excel-files').download(recRes.data.storage_path);
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
    document.title = 'ExcelAI — ' + recRes.data.name;
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
    var blobRes = await sb.storage.from('excel-files').download(recRes.data.storage_path);
    if (blobRes.error) throw blobRes.error;

    var versionPath = recRes.data.storage_path.replace('.xlsx', '_v' + Date.now() + '.xlsx');
    await sb.storage.from('excel-files').upload(versionPath, blobRes.data, { upsert: false });

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
    var blobRes = await sb.storage.from('excel-files').download(verRes.data.storage_path);
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
      await sb.storage.from('excel-files').remove([recRes.data.storage_path]);
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

function handleChatKeydown(event) {
  if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
    event.preventDefault();
    sendChatMessage();
  }
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

// ── MAIN SEND FUNCTION ─────────────────────────────

async function sendChatMessage() {
  if (isProcessing) { console.log('[Guard] sendChatMessage engellendi — işlem devam ediyor'); return; }
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  if (!input) return;

  const message = input.value.trim();
  if (!message) return;
  isProcessing = true;

  // Open floating chat panel (if closed)
  if (typeof openFloatingChat === 'function') openFloatingChat();

  input.value = '';
  autoResizeChatInput(input);
  sendBtn.disabled = true;
  sendBtn.classList.add('loading');
  sendBtn.innerHTML = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
         style="animation:spin 0.8s linear infinite">
      <circle cx="12" cy="12" r="10" stroke="currentColor"
              stroke-width="3" stroke-dasharray="31.4"
              stroke-dashoffset="10"/>
    </svg>
  `;

  if (typeof addMsg === 'function') addMsg('user', message);

  try {
    // 2D array gönder — AI sütun adlarını daha iyi anlar
    const sheetContext = sheets[activeSheet] || [];

    const token = getAuthToken();
    console.warn('[CALL #' + (++CALL_COUNTER) + '] sendChatMessage → fetch /api/chat', new Error().stack.split('\n')[2]?.trim());
    const response = await fetch(API_URL + '/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify({ message, sheetContext })
    });

    if (response.status === 429) {
      const errorData = await response.json();
      showLimitModal(errorData);
      return;
    }

    if (response.status === 403) {
      const errorData = await response.json();
      if (errorData.code === 'FEATURE_NOT_AVAILABLE') {
        handleLockedFeature(errorData.feature);
      }
      return;
    }

    if (!response.ok) throw new Error('Server error: ' + response.status);

    const data = await response.json();

    if (data.usage) {
      userUsage = { ...userUsage, used: { today: data.usage.commands_used_today, this_month: data.usage.commands_used_month }, limits: { ...userUsage?.limits, ai_commands_per_month: data.usage.monthly_limit, ai_commands_per_day: data.usage.daily_limit } };
      updateUsageUI();
    }

    if (data.reply && typeof addMsg === 'function') {
      addMsg('ai', data.reply);
    }

    let applied = false;
    if (data.action && data.action !== 'message') {
      if (typeof applyAIChanges === 'function') {
        applyAIChanges(data);
        applied = true;
      }
      // Webhook tetikle
      try {
        const _wh = JSON.parse(localStorage.getItem('int_webhook') || '{}');
        if (_wh.url && (_wh.trigger === 'ai_action' || _wh.trigger === 'all')) {
          const _payload = { source: 'Mocksheet', event: 'ai_action', timestamp: new Date().toISOString(), data: { action: data.action, reply: data.reply, changes_count: (data.changes || []).length, sheet: activeSheet || 'Sheet1', rows: (sheets[activeSheet] || []).length } };
          fetch(API_URL + '/api/integrations/webhook/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: _wh.url, event: 'ai_action', data: _payload }) }).catch(() => { fetch(_wh.url, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(_payload) }); });
        }
      } catch(_e) { console.warn('Webhook trigger failed:', _e); }
    }

    // Her action handler kendi toast'unu çağırıyor
    // message action için ek toast gereksiz (addMsg zaten gösteriyor)

  } catch (error) {
    console.error('Chat error:', error);
    showToast('Connection error. Please try again.', 'error');
    if (typeof addMsg === 'function') {
      addMsg('ai', '❌ An error occurred. Please try again.');
    }
  } finally {
    isProcessing = false;
    sendBtn.disabled = false;
    sendBtn.classList.remove('loading');
    sendBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M8.707 1.396a1 1 0 0 0-1.414 0L2.22 6.47 1.69 7l1.06 1.06.53-.53L7 3.56V14.25a.75.75 0 0 0 1.5 0V3.56l3.72 3.97.53.53L13.81 7l-.53-.53-4.573-5.074z"
          fill="currentColor"/>
      </svg>
    `;
    chatAttachments = [];
    const bar = document.getElementById('attachmentPreviewBar');
    if (bar) bar.innerHTML = '';
  }
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

  const planColors = { free: '#6B7280', pro: '#4F46E5', business: '#059669' };
  const badges = { free: '🆓 Ücretsiz', pro: '⭐ Pro', business: '🏢 İş Planı' };

  const planEl = document.getElementById('plan-badge');
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

    const usageBar = document.getElementById('usage-bar-fill');
    const usageText = document.getElementById('usage-text');

    if (usageBar) {
      usageBar.style.width = pct + '%';
      usageBar.style.background = pct > 80 ? '#EF4444' : pct > 60 ? '#F59E0B' : '#4F46E5';
    }
    if (usageText) {
      usageText.textContent = used + ' / ' + monthLimit + ' komut';
    }
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
        <div style="font-size:13px;font-weight:700;margin-bottom:8px;color:#4F46E5">⭐ Pro Plan — ₺499/ay</div>
        <div style="font-size:12px;color:#6B7280;line-height:1.8">✓ 200 AI komut/ay<br>✓ Tüm entegrasyonlar<br>✓ Otomatik rapor<br>✓ Rakip analizi</div>
      </div>
      <div style="display:flex;gap:10px">
        <button onclick="document.getElementById('upgradeModal').remove()" style="flex:1;padding:11px;border:1.5px solid #E5E7EB;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:white;color:#374151">Şimdi Değil</button>
        <button onclick="window.location.href='billing.html'" style="flex:2;padding:11px;border:none;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:#4F46E5;color:white">⬆️ Planı Yükselt</button>
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
        <button onclick="window.location.href='billing.html'" style="flex:2;padding:11px;border:none;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;background:#4F46E5;color:white">⬆️ Limiti Artır</button>
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
    toast('Only Excel (.xlsx, .xls) and CSV files are supported', 'err');
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

/* cache bust Sat Mar 14 19:03:28 TSS 2026 */
