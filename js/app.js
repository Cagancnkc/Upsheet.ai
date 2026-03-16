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
let recentFiles = [];
let colWidths = {};
let rowHeights = {};
let versionHistory = []; // [{type, desc, time, snapshot, metaSnap}]
let historyRestoreIdx = -1;
let apiKey = localStorage.getItem('openai_key') || '';
let chatHistory = [];
let clipboard = null;
let cutSource = null;
let dirtyCells = new Set(); // tracks modified cells for optimized localStorage saves

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
    console.warn('buildGrid: geçersiz data', data);
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
}

function getCellMeta() {
  if (!cellMeta[activeSheet]) cellMeta[activeSheet] = {};
  return cellMeta[activeSheet];
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
    if (e.key === 'z') { e.preventDefault(); toast('Geri al işlevi yakında!', 'ok'); }
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
  document.getElementById('mbCells').textContent = '⚡ ' + filled + ' hücre';
  document.getElementById('mbRows').textContent = '↕ ' + activeRows + ' satır';

  // Right section of status bar
  document.getElementById('sbFilled').textContent = filled.toLocaleString('tr-TR');
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
      const fmt = n => n.toLocaleString('tr-TR', {maximumFractionDigits: 2});
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
  document.getElementById('stSum').textContent = numCount ? total.toLocaleString('tr-TR', {maximumFractionDigits: 2}) : '0';
  document.getElementById('stAvg').textContent = numCount ? (total / numCount).toLocaleString('tr-TR', {maximumFractionDigits: 2}) : '0';
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
  const meta = getCellMeta();
  const key = selRow + '_' + selCol;
  if (!meta[key]) meta[key] = {};
  meta[key][type] = !meta[key][type];
  const td = getCell(selRow, selCol);
  if (td) td.classList.toggle(type);
  document.getElementById('tb' + type.charAt(0).toUpperCase() + type.slice(1)).classList.toggle('on', meta[key][type]);
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
  toast('Birleştirme özelliği yakında!', 'ok');
}

function addFilter() {
  toast('Filtre eklendi (simülasyon)', 'ok');
}

function clearHighlights() {
  document.querySelectorAll('.cell.hi').forEach(el => el.classList.remove('hi'));
  toast('Vurgular temizlendi', 'ok');
}

// ═══════════════════════════════════════════════════════════════
//  COPY / PASTE
// ═══════════════════════════════════════════════════════════════
function copyCell() {
  const data = sheets[activeSheet];
  clipboard = data[selRow][selCol];
  cutSource = null;
  toast('Kopyalandı', 'ok');
}

function cutCell() {
  const data = sheets[activeSheet];
  clipboard = data[selRow][selCol];
  cutSource = {r: selRow, c: selCol, sheet: activeSheet};
  toast('Kesildi', 'ok');
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
      toast('Satır eklendi', 'ok');
      break;
    case 'insertRowBelow':
      data.splice(selRow + 1, 0, Array(COLS).fill(''));
      data.pop();
      buildGrid();
      toast('Satır eklendi', 'ok');
      break;
    case 'insertColLeft':
      data.forEach(row => { row.splice(selCol, 0, ''); row.pop(); });
      buildGrid();
      toast('Sütun eklendi', 'ok');
      break;
    case 'insertColRight':
      data.forEach(row => { row.splice(selCol + 1, 0, ''); row.pop(); });
      buildGrid();
      toast('Sütun eklendi', 'ok');
      break;
    case 'deleteRow':
      data.splice(selRow, 1);
      data.push(Array(COLS).fill(''));
      buildGrid();
      toast('Satır silindi', 'ok');
      break;
    case 'deleteCol':
      data.forEach(row => { row.splice(selCol, 1); row.push(''); });
      buildGrid();
      toast('Sütun silindi', 'ok');
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
      <span class="stab-del" onclick="event.stopPropagation();deleteSheetDirect('${name.replace(/'/g,"\\'")}');" title="Sheet'i Sil">×</span>`;
    tab.onclick = () => switchSheet(name);
    tab.ondblclick = () => renameSheet(name);
    tab.addEventListener('contextmenu', e => showSheetCtx(e, name));
    tabs.appendChild(tab);
  });

  const addBtn = document.createElement('div');
  addBtn.className = 'stab-add';
  addBtn.title = 'Yeni sheet';
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
  const newName = prompt('Sheet adını girin:', oldName);
  if (!newName || newName === oldName || sheets[newName]) return;
  const data = sheets[oldName];
  const meta = cellMeta[oldName];
  delete sheets[oldName];
  delete cellMeta[oldName];
  sheets[newName] = data;
  if (meta) cellMeta[newName] = meta;
  if (activeSheet === oldName) activeSheet = newName;
  renderSheetTabs();
  toast(`"${newName}" olarak yeniden adlandırıldı`, 'ok');
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
    toast('Bu dosya çok büyük (max 10MB). Daha küçük bir dosya seçin.', 'err');
    e.target.value = '';
    return;
  }
  if (file.size > MB5) {
    toast('Büyük dosya yükleniyor, lütfen bekleyin...', 'warning');
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

      addHistory('file', '"' + file.name + '" yüklendi');

      if (trimmedRows) {
        toast('Dosyanızda ' + trimmedRows.toLocaleString('tr-TR') + ' satır var. İlk 5.000 satır gösteriliyor.', 'info');
      } else {
        toast('"' + file.name + '" yüklendi', 'ok');
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
      toast('Dosya okunamadı: ' + err.message, 'err');
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
  toast(`"${fileName}" indirildi`, 'ok');
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
  toast(`"${fileName}" indirildi`, 'ok');
}

function newFile() {
  const name = 'Yeni Dosya.xlsx';
  sheets = { Sheet1: createEmptySheet(), Sheet2: createEmptySheet() };
  cellMeta = {};
  activeSheet = 'Sheet1';
  document.getElementById('fileName').textContent = name;
  document.getElementById('fileNameInput').value = name;
  document.title = 'ExcelAI — ' + name;
  addRecentFile(name);
  renderSheetTabs();
  buildGrid();
  addHistory('file', 'Yeni dosya oluşturuldu');
  toast('Yeni dosya oluşturuldu', 'ok');
}

function addRecentFile(name) {
  const entry = { name, time: Date.now() };
  recentFiles = [entry, ...recentFiles.filter(f => f.name !== name)].slice(0, 5);
  try { localStorage.setItem('recent_files', JSON.stringify(recentFiles)); } catch(e) {}
  renderRecentFiles();
}

function fmtTime(ts) {
  const diff = Date.now() - ts;
  if (diff < 60000)  return 'Az önce';
  if (diff < 3600000) return Math.floor(diff/60000) + ' dk önce';
  if (diff < 86400000) return Math.floor(diff/3600000) + ' sa önce';
  return new Date(ts).toLocaleDateString('tr-TR', {day:'numeric',month:'short'});
}

function renderRecentFiles() {
  const el = document.getElementById('recentFiles');
  if (!el) return;
  const fileNameEl = document.getElementById('fileName');
  const activeName = fileNameEl ? fileNameEl.textContent : '';
  if (!recentFiles.length) {
    el.innerHTML = `<div style="padding:6px 10px;font-size:11px;color:#6b6b6b;">Henüz dosya açılmadı</div>`;
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
  const val = inp.value.trim() || 'Yeni Dosya.xlsx';
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
    return String(a[col]).localeCompare(String(b[col]), 'tr');
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
    <p>Seçili sheet'teki verilerde arama yapın</p>
    <div class="fgroup">
      <label class="flabel">Aranan Metin</label>
      <input class="finput" id="frFind" placeholder="Aranacak metin...">
    </div>
    <div class="fgroup">
      <label class="flabel">Yeni Metin</label>
      <input class="finput" id="frReplace" placeholder="Yeni metin (boş bırakabilirsiniz)...">
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
  showModal(`
    <h2>⚙️ API Ayarları</h2>
    <p>OpenAI API anahtarınızı girerek AI özelliklerini etkinleştirin</p>
    <div class="fgroup">
      <label class="flabel">OpenAI API Key</label>
      <input class="finput" id="apiKeyInput" type="password" placeholder="sk-..." value="${apiKey}">
      <div class="fhint">Anahtarınız yalnızca tarayıcınızda saklanır, hiçbir sunucuya gönderilmez.</div>
    </div>
    <div class="fgroup">
      <label class="flabel">Model</label>
      <select class="finput" id="modelSelect">
        <option value="gpt-4o" ${apiKey ? '' : ''}>GPT-4o (Önerilen)</option>
        <option value="gpt-4o-mini">GPT-4o Mini (Hızlı)</option>
        <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
      </select>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal()">İptal</button>
      <button class="btn btn-primary" onclick="saveSettings()">Kaydet</button>
    </div>
  `);
}

function saveSettings() {
  apiKey = document.getElementById('apiKeyInput').value.trim();
  localStorage.setItem('openai_key', apiKey);
  closeModal();
  updateApiStatus();
  if (apiKey) {
    document.getElementById('onboardBanner').classList.add('hidden');
    document.body.classList.remove('with-banner');
  }
  toast(apiKey ? 'API key kaydedildi' : 'API key temizlendi', 'ok');
}

function updateApiStatus() {
  const el = document.getElementById('apiKeyStatus');
  if (!el) return;
  if (apiKey) {
    el.innerHTML = `<span style="color:#16a34a;">● Bağlı</span>`;
  } else {
    el.innerHTML = `<span style="color:#94a3b8;cursor:pointer;" onclick="openSettings()">API key ekle</span>`;
  }
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
  const container = document.getElementById('toasts');
  if (!container) return;
  while (container.children.length >= 3) container.firstChild.remove();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const undoBtn = undoable ? `<button class="toast-undo" onclick="undo();this.closest('.toast').remove()">Geri Al</button>` : '';
  t.innerHTML = `<div class="toast-bar"></div><div class="toast-body">${icons[type]||icons.ok}<span>${msg}</span>${undoBtn}</div>`;
  container.appendChild(t);
  const hide = () => { t.classList.add('leaving'); setTimeout(() => t.remove(), 310); };
  setTimeout(hide, 3000);
}
function showToast(msg, type, undoable) { toast(msg, type, undoable); }

function undo() {
  if (!versionHistory || versionHistory.length < 2) { toast('Geri alınacak işlem yok', 'info'); return; }
  versionHistory.shift();
  const prev = versionHistory[0];
  sheets = JSON.parse(JSON.stringify(prev.snap.sheets));
  cellMeta = JSON.parse(JSON.stringify(prev.snap.cellMeta));
  activeSheet = prev.snap.activeSheet;
  buildGrid();
  if (typeof renderSheetTabs === 'function') renderSheetTabs();
  updateStatus();
  toast('Geri alındı', 'info');
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
  document.getElementById('mbAI').textContent = '🤖 ' + aiActionCount + ' işlem';
  const sbEl = document.getElementById('sbLastAI');
  if (sbEl) sbEl.textContent = 'Son: AI · ' + (desc.length > 22 ? desc.substring(0, 22) + '…' : desc);
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

  // Use selected range if multi-cell selection exists
  const useRange = selStart && selEnd &&
    (selStart.r !== selEnd.r || selStart.c !== selEnd.c);
  const startRow = useRange ? Math.min(selStart.r, selEnd.r) : 0;
  const startCol = useRange ? Math.min(selStart.c, selEnd.c) : 0;
  const endCol   = useRange ? Math.min(Math.max(selStart.c, selEnd.c), startCol + 9) : 9;

  const rows = [];
  let count = 0;
  const maxRows = 30;

  for (let r = startRow; r < data.length && count < maxRows; r++) {
    const row = data[r].slice(startCol, endCol + 1);
    // Skip entirely empty rows
    if (!row.some(function(cell) { return cell !== ''; })) continue;
    // Compact large numbers: 1000000 → "1M", 1500 → "1.5K"
    const formatted = row.map(function(cell) {
      const n = parseFloat(cell);
      if (!isNaN(n) && isFinite(n)) {
        if (Math.abs(n) >= 1e9)  return (n / 1e9).toFixed(1).replace(/\.0$/, '') + 'B';
        if (Math.abs(n) >= 1e6)  return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
        if (Math.abs(n) >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
      }
      return cell;
    });
    rows.push(formatted.join(','));
    count++;
  }

  return rows.join('\n') || '(Veri yok)';
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

async function sendChat() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  input.style.height = '34px';

  addMsg('user', msg);
  chatHistory.push({role: 'user', content: msg});

  // Loading state
  const _fcSubtitle  = document.getElementById('fcSubtitle');
  const _fcSendIcon  = document.getElementById('fcSendIcon');
  const _fcSpinner   = document.getElementById('fcSpinner');
  const _chatInputEl = document.getElementById('chatInput');
  if (_fcSubtitle) { _fcSubtitle.textContent = 'AI düşünüyor...'; _fcSubtitle.classList.add('loading'); }
  if (_fcSendIcon)  _fcSendIcon.style.display  = 'none';
  if (_fcSpinner)   _fcSpinner.style.display   = 'block';
  if (_chatInputEl) _chatInputEl.disabled = true;

  // Rotating loading messages
  const _loadMsgs = [
    'Tablo analiz ediliyor...',
    'Değişiklikler hesaplanıyor...',
    'Sonuçlar uygulanıyor...',
    'Veri işleniyor...',
    'Yanıt hazırlanıyor...'
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
      reply = await processAICommand(msg, getSheetContext(), activeSheet, chatHistory.slice(-8));
      if (!reply || reply?.error === 'offline') {
        clearInterval(_loadTimer);
        loader.remove();
        if (typeof showToast === 'function') showToast('⚡ AI özelliği yakında aktif olacak!', 'info');
        return;
      }
    } else if (apiKey) {
      reply = await callOpenAI(msg);
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
    _loaderBubble.style.cssText = '';
    _loaderBubble.innerHTML = `<span style="color:#f87171;">Hata: ${err.message}</span>`;
  } finally {
    if (_fcSubtitle) { _fcSubtitle.textContent = 'Çevrimiçi'; _fcSubtitle.classList.remove('loading'); }
    if (_fcSendIcon)  _fcSendIcon.style.display  = '';
    if (_fcSpinner)   _fcSpinner.style.display   = 'none';
    if (_chatInputEl) { _chatInputEl.disabled = false; _chatInputEl.focus(); }
  }

  const msgs = document.getElementById('chatMsgs');
  setTimeout(() => msgs.scrollTo({top: msgs.scrollHeight, behavior: 'smooth'}), 0);
}

async function callOpenAI(userMsg) {
  const sheetCtx = getSheetContext();
  const system = `Sen bir Excel AI asistanısın. Kullanıcının Excel verilerini analiz et, formüller öner, içgörüler sun.
Aktif sheet: "${activeSheet}"
İlk 20 satır, 10 sütun verisi:
${sheetCtx}

Kısa, net ve Türkçe yanıtlar ver. Formül önerilerinde Excel formatını kullan (=TOPLA(), =ORTALAMA() vb.).`;

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
  if (!resp.ok) throw new Error(`API Hatası: ${resp.status}`);
  const data = await resp.json();
  return data.choices[0].message.content;
}

function generateLocalReply(msg) {
  const data = sheets[activeSheet];
  const lower = msg.toLowerCase();

  if (lower.includes('analiz') || lower.includes('incele')) {
    let filled = 0, numeric = 0, total = 0;
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        if (data[r][c]) { filled++; const v = parseFloat(data[r][c]); if (!isNaN(v)) { numeric++; total += v; } }
      }
    return `📊 "${activeSheet}" analizi:\n• ${filled} dolu hücre\n• ${numeric} sayısal değer\n• Toplam: ${total.toLocaleString('tr-TR', {maximumFractionDigits:2})}\n• Ortalama: ${numeric ? (total/numeric).toLocaleString('tr-TR', {maximumFractionDigits:2}) : 'N/A'}\n\nAI tam analiz için OpenAI API anahtarı ekleyin (ayarlar ⚙️).`;
  }

  if (lower.includes('formül') || lower.includes('formula')) {
    return `💡 Sık kullanılan Excel formülleri:\n• =TOPLA(A1:A10) — Toplam\n• =ORTALAMA(A1:A10) — Ortalama\n• =EĞER(A1>100;"Yüksek";"Düşük") — Koşul\n• =MAK(A1:A10) — En büyük\n• =MİN(A1:A10) — En küçük\n• =BAĞ_DEĞ_SAY(A1:A10) — Dolu hücre sayısı\n\nHangi formül için detay istiyorsunuz?`;
  }

  if (lower.includes('toplam') || lower.includes('sum')) {
    let total = 0, count = 0;
    for (let r = 0; r < ROWS; r++) {
      const v = parseFloat(data[r][selCol]);
      if (!isNaN(v)) { total += v; count++; }
    }
    return `${colLetter(selCol)} sütunu toplamı: ${total.toLocaleString('tr-TR', {maximumFractionDigits:2})}\n(${count} sayısal değer)`;
  }

  if (lower.includes('boş') || lower.includes('temizle')) {
    return `Boş satırları temizlemek için:\n1. Sağ tıklayın → Satırı Sil seçin\n2. Ya da Bul&Değiştir'i kullanın\n3. Otomatik temizlik için API anahtarı ekleyin ⚙️`;
  }

  if (lower.includes('grafik') || lower.includes('chart')) {
    return `📈 Veri görselleştirme önerileri:\n• Satış verisi → Çizgi grafik\n• Kategori karşılaştırma → Çubuk grafik\n• Oran gösterimi → Pasta grafik\n• Dağılım analizi → Scatter plot\n\nGrafik ekleme için Excel'e aktarın (İndir butonu) ve Excel'de grafik ekleyin.`;
  }

  if (lower.includes('pivot')) {
    return `📋 Pivot tablo oluşturmak için:\n1. Veri aralığınızı seçin\n2. Dosyayı indirin (İndir butonu)\n3. Excel'de Ekle → PivotTable seçin\n\nAlternatif: Verilerinizi açıklayın, ben gruplama formülleri önereyim!`;
  }

  return `Merhaba! Excel veriniz hakkında yardımcı olmaktan mutluluk duyarım. 🤖\n\nŞunları yapabilirim:\n• Veri analizi ve istatistik\n• Formül önerileri\n• Veri temizleme ipuçları\n• Grafik önerileri\n\n💡 Tam AI deneyimi için ⚙️ ayarlardan OpenAI API anahtarı ekleyin!`;
}

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
  const el = document.createElement('div');
  el.className = `msg ${role}`;
  const initials = role === 'ai' ? 'AI' : 'Sen';
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
    bubble.title = 'Tekrar göndermek için tıkla';
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
  addMsg('ai', `Merhaba! Ben ExcelAI asistanınım. 👋\n\nVerinizi analiz edebilir, formül önerebilir ve veri işleme konusunda yardımcı olabilirim.\n\nBir soru sorun veya aşağıdaki önerilerden birini seçin!`);
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
  // ⚡ Hızlı İşlemler
  {group:'⚡ HIZLI İŞLEMLER', name:'Seçili alanı topla',       shortcut:'Ctrl+Shift+T', icon:'sum',      action:'sumSelection'},
  {group:'⚡ HIZLI İŞLEMLER', name:'Tabloyu sırala',            shortcut:'Ctrl+Shift+S', icon:'sort',     action:'sortData'},
  {group:'⚡ HIZLI İŞLEMLER', name:'Boş satırları temizle',     shortcut:'',             icon:'clean',    action:'cleanEmptyRows'},
  {group:'⚡ HIZLI İŞLEMLER', name:'Tekrar edenleri sil',       shortcut:'',             icon:'dedup',    action:'removeDuplicates'},
  // 🤖 AI Komutları
  {group:'🤖 AI KOMUTLARI',   name:'Seçili alanı analiz et',    shortcut:'',             icon:'ai',       action:'aiAnalyze'},
  {group:'🤖 AI KOMUTLARI',   name:'Otomatik grafik oluştur',   shortcut:'',             icon:'chart',    action:'aiChart'},
  {group:'🤖 AI KOMUTLARI',   name:'Veriden özet çıkar',        shortcut:'',             icon:'summary',  action:'aiSummary'},
  {group:'🤖 AI KOMUTLARI',   name:'Formül öner',               shortcut:'',             icon:'formula',  action:'aiFormula'},
  // 📁 Dosya
  {group:'📁 DOSYA',           name:'Excel yükle',               shortcut:'Ctrl+O',       icon:'upload',   action:'triggerUpload'},
  {group:'📁 DOSYA',           name:'XLSX indir',                shortcut:'Ctrl+S',       icon:'download', action:'downloadFile'},
  {group:'📁 DOSYA',           name:'Yeni dosya',                shortcut:'Ctrl+N',       icon:'new',      action:'newFile'},
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
  const isQuestion = q.endsWith('?') || q.startsWith('neden') || q.startsWith('nasıl') ||
                     q.startsWith('ne ') || q.startsWith('analiz') || q.length > 30;

  if (q && isQuestion) {
    cmdRender([], q, true);
    return;
  }

  const filtered = q
    ? CMD_DEFS.filter(c => c.name.toLowerCase().includes(q) || c.group.toLowerCase().includes(q))
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
          <div style="font-size:13px;color:#f97316;font-weight:500;">AI'a sor</div>
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
        <span>Sonuç bulunamadı</span>
      </div>`;
    return;
  }

  let html = '';
  let lastGroup = null;
  items.forEach((cmd, idx) => {
    if (cmd.group !== lastGroup) {
      html += `<div class="cmd-group-label">${cmd.group}</div>`;
      lastGroup = cmd.group;
    }
    const nameHtml = highlight(cmd.name, query);
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
      case 'aiAnalyze':      cmdAIAction('analiz'); break;
      case 'aiChart':        cmdAIAction('grafik'); break;
      case 'aiSummary':      cmdAIAction('özet'); break;
      case 'aiFormula':      cmdAIAction('formül'); break;
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
  toast(`${colLetter(selCol)} toplamı: ${total.toLocaleString('tr-TR', {maximumFractionDigits:2})} (${count} değer)`, 'ok');
}

function cmdCleanEmptyRows() {
  const data = sheets[activeSheet];
  let removed = 0;
  for (let r = data.length - 1; r >= 0; r--) {
    if (data[r].every(c => c === '')) {
      data.splice(r, 1);
      removed++;
    }
  }
  while (data.length < ROWS) data.push(Array(COLS).fill(''));
  buildGrid();
  toast(removed ? `${removed} boş satır temizlendi` : 'Boş satır bulunamadı', removed ? 'ok' : 'err');
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
  toast(removed ? `${removed} tekrarlı satır silindi` : 'Tekrarlı satır bulunamadı', removed ? 'ok' : 'err');
}

function cmdAIAction(type) {
  const prompts = {
    analiz:  `Aktif sheet "${activeSheet}" verilerini analiz et ve önemli içgörüler sun.`,
    grafik:  `Bu veriler için en uygun grafik tipini öner ve neden bu tipin uygun olduğunu açıkla.`,
    özet:    `Bu Excel verilerinden kısa ve net bir yönetici özeti (executive summary) çıkar.`,
    formül:  `Bu veri yapısı için kullanışlı Excel formülleri öner.`,
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
  if (names.length <= 1) { toast('Son sheet silinemez', 'err'); return; }
  if (!confirm(`"${name}" sheet'ini silmek istediğinizden emin misiniz?`)) return;
  const idx = names.indexOf(name);
  delete sheets[name];
  delete cellMeta[name];
  const remaining = Object.keys(sheets);
  const nextSheet = remaining[Math.min(idx, remaining.length - 1)];
  switchSheet(nextSheet);
  toast(`"${name}" silindi`, 'ok');
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
    let newName = name + ' (Kopya)';
    let i = 2;
    while (sheets[newName]) newName = name + ` (Kopya ${i++})`;
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
    toast(`"${newName}" oluşturuldu`, 'ok');
  } else if (action === 'delete') {
    const names = Object.keys(sheets);
    if (names.length <= 1) { toast('Son sheet silinemez', 'err'); return; }
    const idx = names.indexOf(name);
    delete sheets[name];
    delete cellMeta[name];
    const remaining = Object.keys(sheets);
    const nextSheet = remaining[Math.min(idx, remaining.length - 1)];
    switchSheet(nextSheet);
    toast(`"${name}" silindi`, 'ok');
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
    labels.push(data[r][c1] || `Satır ${r + 1}`);
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
    values.forEach((_, i) => labels.push(`Değer ${i + 1}`));
    datasets.push({
      label: 'Veri',
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
    toast('Geçersiz aralık — örn: A1:B10', 'err');
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
  document.getElementById('chartModalTitle').textContent = titleVal || 'Grafik';

  // Sync modal type switcher
  document.querySelectorAll('.cm-type-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.t === chartCurrentType);
  });

  renderChart(titleVal);
  chartAutoUpdate = true;
  toast('Grafik oluşturuldu!', 'ok');
}

// ── Chart modal: click outside to close ─────
function chartModalClickOutside(e) {
  if (e.target === document.getElementById('chartModal')) closeChartPanel();
}

// ── Render / re-render (dark Amplemarket theme)
function renderChart(title) {
  const extracted = extractChartData(chartCurrentRange);
  if (!extracted) { toast('Veri okunamadı', 'err'); return; }

  const { labels, datasets } = extracted;
  if (!datasets || datasets.length === 0) { toast('Seçili aralıkta veri yok', 'err'); return; }

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
    console.warn('History kaydetme hatası:', e);
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
    console.warn('History yükleme hatası:', e);
  }
}

function fmtHistoryTime(ts) {
  const d = Date.now() - ts;
  if (d < 60000) return 'Az önce';
  if (d < 3600000) return Math.floor(d / 60000) + ' dk önce';
  if (d < 86400000) return Math.floor(d / 3600000) + ' sa önce';
  return new Date(ts).toLocaleDateString('tr-TR', {day:'numeric', month:'short'});
}

const VH_ICONS = {
  ai:     {emoji:'⚡', cls:'ai'},
  manual: {emoji:'✏️', cls:'manual'},
  file:   {emoji:'📁', cls:'file'}
};

function renderVersionHistory() {
  const list = document.getElementById('vhList');
  if (!list) return;
  if (versionHistory.length === 0) {
    list.innerHTML = '<div id="vhEmpty">Henüz işlem yok</div>';
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
    (entry.type === 'ai' ? 'AI işlemi' : entry.type === 'file' ? 'Dosya işlemi' : 'Manuel düzenleme');

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
  toast('Geçmişe geri dönüldü', 'ok');
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
        return `<div class="es-recent-item" onclick="loadRecentFile(${i})">📄 ${f.name || 'Dosya'}</div>`;
      }).join('');
      esRecent.style.display = recentFiles.length ? '' : 'none';
    }
  }
}

function loadSampleData() {
  const data = sheets[activeSheet];
  const sample = [
    ['Ürün','Ocak','Şubat','Mart','Toplam'],
    ['Laptop','45000','52000','48000','145000'],
    ['Telefon','32000','38000','41000','111000'],
    ['Tablet','18000','21000','19500','58500'],
    ['Aksesuar','8500','9200','10100','27800'],
    ['Yazılım','12000','14000','15500','41500'],
  ];
  sample.forEach((row, r) => row.forEach((v, c) => { data[r][c] = v; }));
  buildGrid();
  updateStatus();
  addHistory('file', 'Örnek veri yüklendi');
  toast('Örnek veri yüklendi', 'ok');
}

// ═══════════════════════════════════════════════════════════════
//  ONBOARDING BANNER
// ═══════════════════════════════════════════════════════════════
function initOnboardBanner() {
  const dismissed = localStorage.getItem('ob_dismissed');
  const banner = document.getElementById('onboardBanner');
  if (!apiKey && !dismissed) {
    banner.classList.remove('hidden');
    document.body.classList.add('with-banner');
  } else {
    banner.classList.add('hidden');
  }
}

function closeOnboardBanner() {
  localStorage.setItem('ob_dismissed', '1');
  document.getElementById('onboardBanner').classList.add('hidden');
  document.body.classList.remove('with-banner');
}

// Cell edit debounce for manual history
let _cellEditTimer = null;
document.addEventListener('DOMContentLoaded', () => {
  const gw = document.getElementById('gridWrap');
  if (gw) gw.addEventListener('input', () => {
    clearTimeout(_cellEditTimer);
    _cellEditTimer = setTimeout(() => {
      const ref = colLetter(selCol) + (selRow + 1);
      addHistory('manual', ref + ' düzenlendi');
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
  if (tx) tx.textContent = state === 'saved' ? 'Kaydedildi ✓' : state === 'saving' ? 'Kaydediliyor...' : 'Kaydedilmedi';
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
    toast('Kaydedildi', 'ok');
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
        toast('Depolama doluydu; sadece aktif sheet kaydedildi', 'warning');
      } catch(e2) {
        toast('Depolama alanı dolu — kayıt yapılamadı', 'err');
      }
    } else {
      toast('Kayıt başarısız', 'err');
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
    if (fn) fn.textContent = f.name || 'Dosya';
    toast((f.name || 'Dosya') + ' yüklendi', 'ok');
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
  const container = document.getElementById('toasts');
  if (!container) return;
  while (container.children.length >= 3) container.firstChild.remove();
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  const undoBtn  = undoable ? `<button class="toast-undo" onclick="undo();this.closest('.toast').remove()">Geri Al</button>` : '';
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
      btn.innerHTML = '<svg class="btn-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> İndiriliyor...';
    }
    _origDownload.apply(this, arguments);
    if (btn) {
      setTimeout(function() {
        btn.disabled = false;
        btn.innerHTML = origHTML;
        toast('⬇ Dosya indirildi', 'info');
      }, 400);
    }
  };
})();

// ── 4. Extend command palette ────────────────────────────────
(function() {
  if (typeof CMD_DEFS === 'undefined') return;
  CMD_DEFS.push(
    {group:'🤖 AI KOMUTLARI',   name:'AI Asistanı Aç/Kapat', shortcut:'Ctrl+D', icon:'chat',      action:'toggleChat'},
    {group:'📊 GÖRÜNÜM',         name:'Grafiği Aç/Kapat',      shortcut:'',       icon:'chartOpen', action:'toggleChart'},
    {group:'📁 DOSYA',           name:'CSV İndir',              shortcut:'',       icon:'csvDown',   action:'downloadCSV'},
    {group:'⚡ HIZLI İŞLEMLER', name:'Tüm Hücreleri Seç',      shortcut:'Ctrl+A', icon:'selectAll', action:'selectAll'}
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
  if (!sheets || !sheets[activeSheet]) { toast('Önce bir dosya yükleyin', 'info'); return; }
  selRow = 0; selCol = 0;
  selRow2 = ROWS - 1; selCol2 = COLS - 1;
  if (typeof highlightSelection === 'function') highlightSelection();
  toast('Tüm hücreler seçildi', 'info');
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
      if (typeof sendChat === 'function') sendChat();
    }
  }

  // Ctrl+Shift+Z → redo
  if (ctrl && e.shiftKey && e.key === 'Z') {
    e.preventDefault();
    if (typeof redo === 'function') redo();
    else toast('Yeniden yapmak mevcut değil', 'info');
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
    toast(count + ' hücre temizlendi', 'info', true);
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
  if (text) text.textContent = state === 'syncing' ? 'Kaydediliyor...' : state === 'synced' ? 'Buluta kaydedildi ✓' : 'Kaydedilmemiş değişiklikler';
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
    toast('Buluta yükleme başarısız: ' + uploadRes.error.message, 'err');
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
    toast('Dosya kaydedilemedi', 'err');
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
    label:          'İlk yükleme'
  });

  // Cache in IndexedDB
  var db = await openIDB();
  await idbPut(db, 'files', { id: fileRecord.id, name: file.name, data: parsedSheets, updatedAt: new Date().toISOString() });
  await idbPut(db, 'meta',  { key: 'lastFileId', value: fileRecord.id });

  setSyncBadge('synced');
  toast('\u2713 ' + file.name + ' buluta y\u00fcklendi', 'success');
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
    toast('Otomatik kaydetme başarısız', 'warning');
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
    if (recRes.error) { toast('Dosya bulunamadı', 'err'); return; }
    var blobRes = await sb.storage.from('excel-files').download(recRes.data.storage_path);
    if (blobRes.error) { toast('Dosya indirilemedi', 'err'); return; }
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
    toast('Dosya açılamadı', 'err');
    console.error('loadFileById error:', e);
  }
}

// ── Version history ───────────────────────────────────────────
async function saveVersion(label) {
  if (!currentFileId) { toast('Önce bir dosya açın', 'warning'); return; }
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
      label:          label || ('Versiyon ' + nextVersion)
    });

    setSyncBadge('synced');
    toast('\u2713 Versiyon ' + nextVersion + ' kaydedildi', 'success');
  } catch(e) {
    setSyncBadge('unsaved');
    toast('Versiyon kaydedilemedi', 'err');
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
    toast('Eski versiyona geri d\u00f6nd\u00fc', 'info');
  } catch(e) {
    toast('Versiyon y\u00fcklenemedi', 'err');
  }
}

// ── Share file ────────────────────────────────────────────────
async function shareFile(fileId) {
  var fid = fileId || currentFileId;
  if (!fid) { toast('Önce bir dosya açın', 'warning'); return; }
  try {
    var token = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15));
    var res = await sb.from('files').update({ share_token: token, is_shared: true }).eq('id', fid);
    if (res.error) throw res.error;
    var shareUrl = window.location.origin + '/shared.html?token=' + token;
    if (navigator.clipboard) navigator.clipboard.writeText(shareUrl).catch(function(){});
    showShareModal(shareUrl);
    if (fid === currentFileId) currentFileId = fid; // ensure stays set
  } catch(e) {
    toast('Paylaşım başarısız', 'err');
  }
}

async function stopSharing() {
  if (!currentFileId) return;
  var res = await sb.from('files').update({ is_shared: false, share_token: null }).eq('id', currentFileId);
  if (res.error) { toast('Paylaşım kaldırılamadı', 'err'); return; }
  toast('Paylaşım kaldırıldı', 'info');
}

function showShareModal(shareUrl) {
  if (typeof showModal !== 'function') { alert('Paylaşım linki: ' + shareUrl); return; }
  showModal(
    '<h2>🔗 Paylaşım Linki</h2>' +
    '<p style="font-size:13px;color:#94a3b8;margin-bottom:12px;">Bu linke sahip herkes dosyanızı görüntüleyebilir.</p>' +
    '<div style="display:flex;gap:8px;align-items:center;">' +
      '<input class="finput" style="flex:1;font-size:12px;" readonly value="' + shareUrl + '" onclick="this.select()">' +
      '<button class="btn btn-primary" onclick="navigator.clipboard&&navigator.clipboard.writeText(\'' + shareUrl + '\');toast(\'Kopyalandı ✓\',\'ok\')">Kopyala</button>' +
    '</div>' +
    '<div class="modal-foot">' +
      '<button class="btn btn-ghost" style="color:#ef4444;" onclick="stopSharing();closeModal()">Paylaşımı Kaldır</button>' +
      '<button class="btn btn-ghost" onclick="closeModal()">Kapat</button>' +
    '</div>'
  );
}

// ── Delete file ───────────────────────────────────────────────
async function deleteFile(fileId) {
  if (!window.confirm('Bu dosyayı kalıcı olarak silmek istiyor musunuz?')) return;
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

    toast('Dosya silindi', 'info');
  } catch(e) {
    toast('Dosya silinemedi', 'err');
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
      '<button onclick="event.stopPropagation();shareFile(\'' + file.id + '\')" title="Paylaş">🔗</button>' +
      '<button onclick="event.stopPropagation();deleteFile(\'' + file.id + '\')" title="Sil">🗑</button>' +
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
    if (diff < 60000)          return 'Az önce';
    if (diff < 3600000)        return Math.floor(diff / 60000) + ' dk önce';
    if (diff < 86400000)       return Math.floor(diff / 3600000) + ' sa önce';
    if (diff < 7 * 86400000)   return Math.floor(diff / 86400000) + ' gün önce';
    return d.toLocaleDateString('tr-TR', { day:'2-digit', month:'short', year:'numeric' });
  } catch(e) { return ''; }
}
/* cache bust Sat Mar 14 19:03:28 TSS 2026 */
