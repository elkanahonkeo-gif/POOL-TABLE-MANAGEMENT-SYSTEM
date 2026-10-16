// ---------- Helpers ----------
  const $ = id => document.getElementById(id);
  const pad = n => String(n).padStart(2, '0');
  const uid = () => Math.random().toString(36).slice(2, 8);
  const hms = s => `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  const fmtDT = ms => new Date(ms).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  const fmtT = ms => new Date(ms).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  const KES_PER_USD = 129; // fixed demo rate: change to today's rate
  const money = n => `$${n.toFixed(2)} (KSh ${Math.round(n * KES_PER_USD).toLocaleString('en-US')})`;
  const initials = name => name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  const toDateInput = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const toTimeInput = d => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  const todayAt = (h, m) => { const d = new Date(); d.setHours(h, m, 0, 0); return d.getTime(); };
  const isToday = ms => new Date(ms).toDateString() === new Date().toDateString();
  const HR = 3600000;

  // ---------- Navigation ----------
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    $(id).classList.add('active');
    window.scrollTo(0, 0);
    renderAll();
  }
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', ic: '▦' },
    { id: 'tables', label: 'Pool Tables', ic: '▤' },
    { id: 'customers', label: 'Customers', ic: '☺' },
    { id: 'sessions', label: 'Playing Sessions', ic: '◷', badge: true },
    { id: 'reservations', label: 'Reservations', ic: '▥' },
    { id: 'payments', label: 'Payments', ic: '▭' },
    { id: 'reports', label: 'Reports', ic: '▁▃▅', soon: true },
    { id: 'staff', label: 'Staff Management', ic: '⚇' },
    { id: 'settings', label: 'Settings', ic: '⚙' }
  ];
  function buildShell() {
    document.querySelectorAll('.screen[data-crumb]').forEach(sec => {
      const current = sec.id;
      sec.querySelector('[data-sidebar]').innerHTML = `
        <div class="brand"><div class="logo" style="width:40px;height:40px;font-size:18px">8</div>
          <div><div class="brand-name">Cue House</div><div class="brand-sub">Table Management</div></div></div>
        <div class="venue"><div><div class="v-name">ELKOZZ@RESTAURANTS</div><div class="v-sub">Main floor · 12 tables</div></div><span>⌃⌄</span></div>
        <div class="nav-label">Workspace</div>
        <nav class="nav">
          ${navItems.map(n => `
            <button class="nav-item ${n.id === current ? 'active' : ''}" ${n.soon ? 'data-soon' : `data-go="${n.id}"`}>
              <span class="ic">${n.ic}</span>${n.label}${n.badge ? '<span class="badge" data-badge="sessions"></span>' : ''}
            </button>`).join('')}
        </nav>
        <div class="sidebar-foot">
          <div class="shift"><b>Shift in progress</b>Opened today at 10:00 AM</div>
          <button class="nav-item logout" data-go="login"><span class="ic">⎋</span>Logout</button>
        </div>`;
      sec.querySelector('[data-topbar]').innerHTML = `
        <div class="crumb">Workspace &nbsp;›&nbsp; <b>${sec.dataset.crumb}</b></div>
        <div class="top-right">
          <div class="clock"><span class="dot"></span><span class="clockText"></span></div>
          <div class="bell" title="Customer messages"><svg class="icon" viewBox="0 0 24 24"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0"/></svg><span class="bell-count" style="display:none"></span></div>
          <div class="user"><div class="avatar cashier-ini">EL</div><div><div class="u-name cashier-name">Elikanah</div><div class="u-role">Cashier</div></div></div>
        </div>`;
    });
  }

  function tickClock() {
    const txt = new Date().toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    document.querySelectorAll('.clockText').forEach(el => el.textContent = txt);
  }

  // ---------- Login ----------
  const pw = $('pw'), toggle = $('togglePw'), eye = $('eyeIcon');
  toggle.addEventListener('click', () => {
    const showing = pw.type === 'text';
    pw.type = showing ? 'password' : 'text';
    toggle.setAttribute('aria-label', showing ? 'Show password' : 'Hide password');
    eye.innerHTML = showing
      ? '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'
      : '<path d="M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.9 5.1A10 10 0 0112 5c6.5 0 10 7 10 7a18 18 0 01-3.2 4.1M6.6 6.6A18 18 0 002 12s3.5 7 10 7a10 10 0 005.4-1.6"/>';
  });

  // ---------- Dashboard chart ----------
  const revenue = [{ d: 'Sat', v: 470 }, { d: 'Sun', v: 640 }, { d: 'Mon', v: 520 }, { d: 'Tue', v: 700 }, { d: 'Wed', v: 430 }, { d: 'Thu', v: 350 }, { d: 'Fri', v: 846 }];
  $('bars').innerHTML = revenue.map((r, i) => {
    const hi = i === revenue.length - 1;
    return `<div class="bar-wrap">${hi ? '<span class="bar-tip">$846 · KSh 109k</span>' : ''}<div class="bar ${hi ? 'hi' : ''}" style="height:${(r.v / 900) * 100}%"></div><span class="bar-label">${r.d}</span></div>`;
  }).join('');

  // ---------- Data ----------
  const ago = min => Date.now() - min * 60000;
  const tables = [
    { n: 1,  type: 'Standard', ft: 8, rate: 18, status: 'available', session: null },
    { n: 2,  type: 'Standard', ft: 8, rate: 18, status: 'occupied', session: { name: 'James Wilson', phone: '', start: ago(84), hours: 3 } },
    { n: 3,  type: 'Standard', ft: 8, rate: 18, status: 'occupied', session: { name: 'Sarah Chen', phone: '', start: ago(42), hours: 2 } },
    { n: 4,  type: 'Standard', ft: 8, rate: 18, status: 'available', session: null },
    { n: 5,  type: 'Standard', ft: 8, rate: 18, status: 'occupied', session: { name: 'Michael Brown', phone: '', start: ago(125), hours: 4 } },
    { n: 6,  type: 'Standard', ft: 8, rate: 18, status: 'available', session: null },
    { n: 7,  type: 'Standard', ft: 8, rate: 18, status: 'available', session: null },
    { n: 8,  type: 'Standard', ft: 8, rate: 18, status: 'occupied', session: { name: 'Daniel Kim', phone: '', start: ago(18), hours: 2 } },
    { n: 9,  type: 'Premium',  ft: 9, rate: 24, status: 'available', session: null },
    { n: 10, type: 'Premium',  ft: 9, rate: 24, status: 'occupied', session: { name: 'Olivia Martin', phone: '', start: ago(56), hours: 2 } },
    { n: 11, type: 'Premium',  ft: 9, rate: 24, status: 'available', session: null },
    { n: 12, type: 'Premium',  ft: 9, rate: 24, status: 'available', session: null }
  ];
  const HOURLY_KES = 500; // every table: KSh 500 per hour
  tables.forEach(t => t.rate = HOURLY_KES / KES_PER_USD);
  const customers = [
    { id: 'c1', name: 'James Wilson', phone: '', visits: 4, spent: 96, lastTable: 2 },
    { id: 'c2', name: 'Sarah Chen', phone: '', visits: 6, spent: 180, lastTable: 3 },
    { id: 'c3', name: 'Michael Brown', phone: '', visits: 2, spent: 72, lastTable: 5 },
    { id: 'c4', name: 'Emma Davis', phone: '', visits: 3, spent: 54, lastTable: 6 },
    { id: 'c5', name: 'Daniel Kim', phone: '', visits: 5, spent: 110, lastTable: 8 },
    { id: 'c6', name: 'Olivia Martin', phone: '', visits: 7, spent: 240, lastTable: 10 },
    { id: 'c7', name: 'Noah Taylor', phone: '', visits: 1, spent: 0, lastTable: 11 },
    { id: 'c8', name: 'Ethan Clark', phone: '', visits: 2, spent: 36, lastTable: 4 }
  ];
  const history = [
    { name: 'Ethan Clark', phone: '', table: 4, start: todayAt(15, 0), end: todayAt(16, 0), hours: 1, amount: 18, status: 'Completed' },
    { name: 'Ava Robinson', phone: '', table: 7, start: todayAt(13, 0), end: todayAt(14, 0), hours: 1, amount: 18, status: 'Completed' },
    { name: 'Liam Harris', phone: '', table: 1, start: todayAt(12, 0), end: todayAt(13, 30), hours: 1.5, amount: 27, status: 'Ended early' }
  ];
  const reservations = [
    { id: 'R1', name: 'Emma Davis', phone: '', table: 6, start: todayAt(17, 0), hours: 2, status: 'Upcoming' },
    { id: 'R2', name: 'Noah Taylor', phone: '', table: 11, start: todayAt(18, 0), hours: 2, status: 'Upcoming' }
  ];
  const messages = [];

  const tableOf = n => tables.find(t => t.n === n);
  const endOf = s => s.start + s.hours * HR;

  function upsertCustomer(name, phone) {
    let c = customers.find(x => x.name.toLowerCase() === name.toLowerCase());
    if (!c) { c = { id: uid(), name, phone: '', visits: 0, spent: 0, lastTable: null }; customers.push(c); }
    if (phone) c.phone = phone;
    return c;
  }

  // Reserved-table marking (used by reservations)
  function markTable(r) {
    const t = tableOf(r.table);
    if (t.status === 'available') {
      t.status = 'reserved';
      t.time = `${fmtT(r.start)} – ${fmtT(r.start + r.hours * HR)}`;
      t.who = r.name;
      t.resId = r.id;
    }
  }
  function releaseTable(r) {
    const t = tableOf(r.table);
    if (t && t.resId === r.id) { t.status = 'available'; t.time = null; t.who = null; t.resId = null; }
  }
  reservations.forEach(r => { if (r.status === 'Upcoming') markTable(r); });
  customers.forEach(c => { if (c.name === 'Emma Davis' || c.name === 'Noah Taylor') c.visits = c.visits || 0; });
  // Customers from reservations
  reservations.forEach(r => { const c = upsertCustomer(r.name, r.phone); c.lastTable = r.table; });
  // Customers from history for "last table"
  history.forEach(h => { const c = upsertCustomer(h.name, h.phone); c.lastTable = h.table; });

  function startSession(n, d) {
    const t = tableOf(n);
    const c = upsertCustomer(d.name, d.phone);
    c.visits += 1;
    c.lastTable = n;
    if (d.phone) c.phone = d.phone;
    if (d.resId) {
      const r = reservations.find(x => x.id === d.resId);
      if (r) r.status = 'Started';
    }
    t.session = { name: d.name, phone: d.phone || '', start: d.start, hours: d.hours };
    t.status = 'occupied';
    t.time = null; t.who = null; t.resId = null;
  }

  function finishSession(t, status) {
    const s = t.session;
    const now = Date.now();
    const completed = status === 'Completed';
    const amount = completed
      ? t.rate * s.hours
      : Math.max(0, Math.round(t.rate * ((now - s.start) / HR) * 100) / 100);
    const end = completed ? endOf(s) : now;
    history.unshift({ id: uid(), paid: false, method: '', name: s.name, phone: s.phone, table: t.n, start: s.start, end, hours: s.hours, amount, status });
    const c = customers.find(x => x.name === s.name);
    if (c) { c.spent += amount; c.lastTable = t.n; }
    t.session = null;
    t.status = 'available';
    return s;
  }

  function createReservation(d) {
    const r = { id: uid(), name: d.name, phone: d.phone, table: d.table, start: d.start, hours: d.hours, status: 'Upcoming' };
    reservations.unshift(r);
    markTable(r);
    upsertCustomer(d.name, d.phone);
  }
  function cancelReservation(id) {
    const r = reservations.find(x => x.id === id);
    r.status = 'Cancelled';
    releaseTable(r);
    renderAll();
  }
  function startReservation(id) {
    const r = reservations.find(x => x.id === id);
    const t = tableOf(r.table);
    if (t.status === 'occupied') { showToast(`Table ${pad(t.n)} is already in play. End that session first.`, 'Table busy'); return; }
    startSession(r.table, { name: r.name, phone: r.phone, start: Date.now(), hours: r.hours, resId: r.id });
    renderAll();
  }

  // ---------- Messages ----------
  function updateBell() {
    const unread = messages.filter(m => !m.read).length;
    document.querySelectorAll('.bell-count').forEach(el => {
      el.textContent = unread;
      el.style.display = unread ? 'grid' : 'none';
    });
  }
  function sendEndMessage(t, s) {
    const text = `Hi ${s.name}, your ${s.hours} hr session at Table ${pad(t.n)} has ended. Thank you for playing at Cue House!`;
    messages.unshift({ name: s.name, phone: s.phone || '', table: t.n, amount: t.rate * s.hours, text, time: Date.now(), read: false });
    updateBell();
    showToast(`Message sent to ${s.name}${s.phone ? ' at ' + s.phone : ' (no phone number saved)'}. Table ${pad(t.n)} has been reset.`, 'Time is up!');
  }
  function renderMsgs() {
    $('msgList').innerHTML = messages.length
      ? messages.map(m => `
        <div class="msg-item">
          <div class="top"><span>${m.name}</span><span class="muted" style="font-size:11.5px;font-weight:600">${fmtT(m.time)}</span></div>
          <div class="meta">Table ${pad(m.table)} · ${m.phone || 'No phone number saved'} · ${money(m.amount)}</div>
          <div class="body">${m.text}</div>
        </div>`).join('')
      : '<div class="muted" style="text-align:center;padding:30px">No messages yet.</div>';
  }
  function openMsgs() { messages.forEach(m => m.read = true); updateBell(); renderMsgs(); $('msgPanel').classList.add('show'); }
  function closeMsgs() { $('msgPanel').classList.remove('show'); }

  // ---------- Toast & alarm ----------
  let audioCtx = null;
  function getCtx() {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = audioCtx || new AC();
    return audioCtx;
  }
  document.addEventListener('click', () => { const c = getCtx(); if (c && c.state === 'suspended') c.resume(); }, true);
  function beep() {
    const c = getCtx(); if (!c) return;
    for (let i = 0; i < 3; i++) {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'square'; o.frequency.value = 880;
      o.connect(g); g.connect(c.destination);
      const t0 = c.currentTime + i * 0.45;
      g.gain.setValueAtTime(0.15, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.35);
      o.start(t0); o.stop(t0 + 0.36);
    }
  }
  let toastTimer = null;
  function showToast(msg, title = 'Notice') {
    $('toastTitle').textContent = title;
    $('toastText').textContent = msg;
    $('toast').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('toast').classList.remove('show'), 8000);
  }

  // ---------- Modal (start / edit / reserve) ----------
  const HOURS = Array.from({ length: 10 }, (_, i) => i + 1);
  $('mHours').innerHTML = HOURS.map(h => `<option value="${h}">${h} hr${h > 1 ? 's' : ''}</option>`).join('');
  let modalState = null;

  function openModal(mode, tableN = null, pre = {}) {
    modalState = { mode };
    let opts;
    if (mode === 'edit') opts = tables.filter(t => t.n === tableN);
    else if (mode === 'reserve') opts = tables;
    else opts = tables.filter(t => t.status !== 'occupied');
    $('mTable').innerHTML = opts.map(t =>
      `<option value="${t.n}">Table ${pad(t.n)} · ${t.type} · ${money(t.rate)}/hr${t.status === 'available' ? '' : ' · ' + t.status}</option>`).join('');
    $('mTable').disabled = mode === 'edit';
    if (tableN && opts.some(t => t.n === tableN)) $('mTable').value = String(tableN);

    const start = pre.start ? new Date(pre.start) : new Date();
    $('mName').value = pre.name || '';
    $('mPhone').value = pre.phone || '';
    $('mDate').value = toDateInput(start);
    $('mTime').value = toTimeInput(start);
    $('mHours').value = String(pre.hours || 1);

    const titles = { start: 'Start session', edit: 'Manage session', reserve: 'New reservation' };
    $('mTitle').textContent = titles[mode];
    $('mActions').innerHTML = mode === 'edit'
      ? `<button class="btn btn-red spacer" id="mEndBtn">End &amp; reset table</button>
         <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn btn-green" id="mConfirm">Save changes</button>`
      : `<button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
         <button class="btn btn-green" id="mConfirm">${mode === 'reserve' ? 'Save reservation' : 'Start session'}</button>`;
    updateSummary();
    $('modal').classList.add('show');
    setTimeout(() => $('mName').focus(), 50);
  }

  function updateSummary() {
    const t = tableOf(Number($('mTable').value));
    if (!t) return;
    const name = $('mName').value.trim();
    const start = new Date(`${$('mDate').value}T${$('mTime').value}`);
    const hours = Number($('mHours').value);
    const valid = !isNaN(start) && name.length > 0;
    $('mSub').textContent = `${t.type} · ${t.ft} ft · ${money(t.rate)}/hr`;
    $('mEnd').textContent = isNaN(start) ? '—' : fmtDT(start.getTime() + hours * HR);
    $('mAmt').textContent = money(t.rate * hours);
    const c = $('mConfirm');
    if (c) c.disabled = !valid;
  }

  function confirmModal() {
    const n = Number($('mTable').value);
    const name = $('mName').value.trim();
    const phone = $('mPhone').value.trim();
    const start = new Date(`${$('mDate').value}T${$('mTime').value}`).getTime();
    const hours = Number($('mHours').value);
    if (!name || isNaN(start)) return;

    if (modalState.mode === 'reserve') {
      createReservation({ name, phone, table: n, start, hours });
      showToast(`Reservation saved for ${name} at Table ${pad(n)}.`, 'Reservation saved');
    } else if (modalState.mode === 'edit') {
      const t = tableOf(n);
      t.session.name = name; t.session.phone = phone; t.session.start = start; t.session.hours = hours;
      const c = customers.find(x => x.name === t.session.name);
      if (c && phone) c.phone = phone;
    } else {
      startSession(n, { name, phone, start, hours });
      showToast(`Session started for ${name} at Table ${pad(n)}.`, 'Session started');
    }
    closeModal();
    renderAll();
  }

  function endSession() {
    const t = tableOf(Number($('mTable').value));
    finishSession(t, 'Ended early');
    closeModal();
    renderAll();
  }
  function closeModal() { $('modal').classList.remove('show'); modalState = null; }

  $('mClear').addEventListener('click', () => { $('mName').value = ''; $('mName').focus(); updateSummary(); });
  ['mName', 'mPhone', 'mDate', 'mTime', 'mHours', 'mTable'].forEach(id => $(id).addEventListener('input', updateSummary));
  $('mTable').addEventListener('change', updateSummary);
  $('mHours').addEventListener('change', updateSummary);
  $('modal').addEventListener('click', e => {
    if (e.target.id === 'modal') closeModal();
    if (e.target.id === 'mEndBtn') endSession();
    if (e.target.id === 'mConfirm') confirmModal();
  });

  // ---------- Rendering ----------
  let filter = 'all', query = '', custQuery = '', sessTab = 'active', resFilter = 'upcoming';

  function cardHTML(t) {
    const num = pad(t.n);
    let body = '', extra = '', foot = '';
    if (t.status === 'available') {
      body = `<div class="tcard-body"><div class="table-art"></div><div class="info"><div class="ready">Ready to play</div><div class="sm">Cleaned &amp; ready for guests</div></div></div>`;
      foot = `<button class="btn btn-green btn-sm" data-start="${t.n}">▷ Start Session</button>`;
    } else if (t.status === 'occupied') {
      const s = t.session;
      body = `<div class="cust-line"><span class="av">${initials(s.name)}</span><div><div class="who">${s.name}</div><div class="sm">Customer</div></div></div>`;
      extra = `
        <div class="times">
          <div><span>Start time</span><b>${fmtDT(s.start)}</b></div>
          <div><span>Finish time</span><b>${fmtDT(endOf(s))}</b></div>
        </div>
        <div class="left-row"><span>Time left</span><b data-left="${t.n}">${hms(Math.max(0, Math.floor((endOf(s) - Date.now()) / 1000)))}</b></div>
        <div class="amt-row"><span>${s.hours} hr session</span><b>${money(t.rate * s.hours)}</b></div>`;
      foot = `<button class="btn btn-ghost btn-sm" data-manage="${t.n}">Manage session</button>`;
    } else {
      body = `<div class="tcard-body"><div class="table-art"></div><div class="info"><div class="big" style="font-size:15px">${t.time}</div><div class="sm">${t.who}</div></div></div>`;
      foot = `<button class="btn btn-ghost btn-sm" data-go="reservations">View booking</button>`;
    }
    return `
      <div class="card tcard ${t.status}">
        <div class="tcard-top">
          <div><h4>Table ${num}</h4><div class="spec">${t.type} · ${t.ft} ft</div></div>
          <span class="status ${t.status}"><span class="d"></span>${t.status[0].toUpperCase() + t.status.slice(1)}</span>
        </div>
        ${body}${extra}
        <div class="tcard-foot"><div class="rate">${money(t.rate)} <small>/ hr</small></div>${foot}</div>
      </div>`;
  }

  function renderTables() {
    const q = query.trim().toLowerCase();
    const list = tables.filter(t => {
      const name = t.session ? t.session.name : (t.who || '');
      return (filter === 'all' || t.status === filter) && (!q || `table ${t.n} ${name}`.toLowerCase().includes(q));
    });
    $('tableGrid').innerHTML = list.length ? list.map(cardHTML).join('') : `<div class="empty-note">No tables match your filter.</div>`;
    const counts = { all: tables.length, available: 0, occupied: 0, reserved: 0 };
    tables.forEach(t => counts[t.status]++);
    Object.keys(counts).forEach(k => document.querySelectorAll(`[data-count="${k}"]`).forEach(el => el.textContent = counts[k]));
    $('footCount').textContent = `Showing ${list.length} of ${tables.length} tables · Main floor`;
    document.querySelectorAll('[data-kpi="available"]').forEach(el => el.textContent = counts.available);
    document.querySelectorAll('[data-kpi="occupied"]').forEach(el => el.textContent = counts.occupied);
    document.querySelectorAll('[data-kpi="reserved"]').forEach(el => el.textContent = counts.reserved);
    document.querySelectorAll('[data-kpi="active"]').forEach(el => el.textContent = counts.occupied);
  }

  function renderDash() {
    $('miniGrid').innerHTML = tables.map(t => `<div class="mini ${t.status[0]}"><span class="d"></span>${pad(t.n)}</div>`).join('');
    const active = tables.filter(t => t.status === 'occupied');
    $('dashSessions').innerHTML = active.map(t => `
      <div class="sess"><div class="tnum">${pad(t.n)}</div>
        <div><div class="who">${t.session.name}</div><div class="when">Started ${fmtT(t.session.start)} · ${money(t.rate)}/hr</div></div>
        <div class="time"><span data-left="${t.n}">${hms(Math.max(0, Math.floor((endOf(t.session) - Date.now()) / 1000)))}</span><small>● In play</small></div>
      </div>`).join('') || '<div class="muted">No active sessions.</div>';
  }

  function renderSessions() {
    const active = tables.filter(t => t.status === 'occupied');
    const todays = history.filter(h => isToday(h.start));
    const revenue = todays.reduce((sum, h) => sum + h.amount, 0);
    document.querySelectorAll('[data-sk="active"]').forEach(el => el.textContent = active.length);
    document.querySelectorAll('[data-sk="revenue"]').forEach(el => el.textContent = money(revenue));
    document.querySelectorAll('[data-sk="done"]').forEach(el => el.textContent = todays.length);
    document.querySelectorAll('[data-badge="sessions"]').forEach(el => el.textContent = active.length || '');
    document.querySelectorAll('[data-scount="active"]').forEach(el => el.textContent = active.length);
    document.querySelectorAll('[data-scount="history"]').forEach(el => el.textContent = history.length);

    if (sessTab === 'active') {
      $('sessHead').innerHTML = `<tr><th>Table</th><th>Customer</th><th>Phone</th><th>Started</th><th>Finishes</th><th>Time left</th><th>Amount</th><th></th></tr>`;
      $('sessBody').innerHTML = active.length ? active.map(t => {
        const s = t.session;
        return `<tr>
          <td><b>Table ${pad(t.n)}</b><div class="muted" style="font-size:11.5px">${t.type}</div></td>
          <td><div class="cust"><span class="av">${initials(s.name)}</span>${s.name}</div></td>
          <td class="muted">${s.phone || '—'}</td>
          <td class="muted">${fmtDT(s.start)}</td>
          <td class="muted">${fmtDT(endOf(s))}</td>
          <td><b data-left="${t.n}" style="color:var(--amber);font-variant-numeric:tabular-nums">${hms(Math.max(0, Math.floor((endOf(s) - Date.now()) / 1000)))}</b></td>
          <td class="amt">${money(t.rate * s.hours)}<div class="muted" style="font-size:11px;font-weight:500">${s.hours} hr</div></td>
          <td><div class="row-actions"><button class="btn btn-ghost btn-sm" data-manage="${t.n}">Manage</button><button class="btn btn-red btn-sm" data-endnow="${t.n}">End now</button></div></td>
        </tr>`;
      }).join('') : `<tr><td colspan="8" class="empty">No sessions in play. Start one from Pool Tables or click "+ Start new session".</td></tr>`;
    } else {
      $('sessHead').innerHTML = `<tr><th>Table</th><th>Customer</th><th>Phone</th><th>Started</th><th>Ended</th><th>Hours</th><th>Amount</th><th>Status</th></tr>`;
      $('sessBody').innerHTML = history.length ? history.map(h => `<tr>
          <td><b>Table ${pad(h.table)}</b></td>
          <td><div class="cust"><span class="av">${initials(h.name)}</span>${h.name}</div></td>
          <td class="muted">${h.phone || '—'}</td>
          <td class="muted">${fmtDT(h.start)}</td>
          <td class="muted">${fmtDT(h.end)}</td>
          <td>${h.hours} hr</td>
          <td class="amt">${money(h.amount)}</td>
          <td><span class="pill ${h.status === 'Completed' ? '' : 'grey'}">${h.status}</span></td>
        </tr>`).join('') + `<tr style="background:#f7f9f8"><td colspan="6"><b>Total · ${history.length} sessions</b></td><td class="amt" colspan="2">${money(history.reduce((s, h) => s + h.amount, 0))}</td></tr>` : `<tr><td colspan="8" class="empty">No finished sessions yet.</td></tr>`;
    }
  }

  function renderCustomers() {
    const q = custQuery.trim().toLowerCase();
    const list = customers.filter(c => !q || c.name.toLowerCase().includes(q) || (c.phone || '').includes(q));
    $('custCount').textContent = `${list.length} customer${list.length === 1 ? '' : 's'}`;
    $('custBody').innerHTML = list.length ? list.map(c => `<tr>
        <td><div class="cust"><span class="av">${initials(c.name)}</span>${c.name}</div></td>
        <td class="muted">${c.phone || '—'}</td>
        <td>${c.visits}</td>
        <td class="amt">${money(c.spent)}</td>
        <td class="muted">${c.lastTable ? 'Table ' + pad(c.lastTable) : '—'}</td>
        <td><div class="row-actions"><button class="btn btn-green btn-sm" data-cstart="${c.id}">▷ Start session</button> <button class="btn btn-red btn-sm" data-cdel="${c.id}">Delete</button></div></td>
      </tr>`).join('') : `<tr><td colspan="6" class="empty">No customers match your search.</td></tr>`;
  }

  function renderReservations() {
    const counts = { upcoming: 0, started: 0, cancelled: 0, all: reservations.length };
    reservations.forEach(r => counts[r.status.toLowerCase()]++);
    Object.keys(counts).forEach(k => document.querySelectorAll(`[data-rcount="${k}"]`).forEach(el => el.textContent = counts[k]));
    const list = reservations.filter(r => resFilter === 'all' || r.status.toLowerCase() === resFilter);
    const pill = { Upcoming: 'indigo', Started: 'amber', Cancelled: 'red' };
    $('resBody').innerHTML = list.length ? list.map(r => {
      const t = tableOf(r.table);
      const actions = r.status === 'Upcoming'
        ? `<button class="btn btn-green btn-sm" data-rstart="${r.id}">▷ Start now</button><button class="btn btn-ghost btn-sm" data-rcancel="${r.id}">Cancel</button>`
        : '<span class="muted" style="font-size:12px">—</span>';
      return `<tr>
        <td><div class="cust"><span class="av">${initials(r.name)}</span>${r.name}</div></td>
        <td class="muted">${r.phone || '—'}</td>
        <td><b>Table ${pad(t.n)}</b><div class="muted" style="font-size:11.5px">${t.type}</div></td>
        <td class="muted">${fmtDT(r.start)}</td>
        <td>${r.hours} hr</td>
        <td class="amt">${money(t.rate * r.hours)}</td>
        <td><span class="pill ${pill[r.status]}">${r.status}</span></td>
        <td><div class="row-actions">${actions}</div></td>
      </tr>`;
    }).join('') : `<tr><td colspan="8" class="empty">No reservations in this list. Click "+ New reservation" to add one.</td></tr>`;
  }

  function syncTabs() {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.toggle('active', b.dataset.filter === filter));
    document.querySelectorAll('[data-stab]').forEach(b => b.classList.toggle('active', b.dataset.stab === sessTab));
    document.querySelectorAll('[data-rf]').forEach(b => b.classList.toggle('active', b.dataset.rf === resFilter));
  }

  function renderAll() {
    tickClock();
    renderTables();
    renderDash();
    renderSessions();
    renderCustomers();
    renderReservations();
    updateBell();
    applyCashier();
    renderStaffPage();
    renderPayments();
    saveData();
  }

  // ---------- Events (delegated) ----------
  document.addEventListener('click', e => {
    const t = e.target;
    const go = t.closest('[data-go]');
    if (go) return showScreen(go.dataset.go);
    if (t.closest('[data-soon]')) return showToast('This screen will be built next.', 'Coming soon');
    if (t.closest('.bell')) return openMsgs();

    const f = t.closest('[data-filter]'); if (f) { filter = f.dataset.filter; return renderAll(); }
    const st = t.closest('[data-stab]'); if (st) { sessTab = st.dataset.stab; return renderAll(); }
    const rf = t.closest('[data-rf]'); if (rf) { resFilter = rf.dataset.rf; return renderAll(); }

    const start = t.closest('[data-start]'); if (start) return openModal('start', Number(start.dataset.start));
    const manage = t.closest('[data-manage]'); if (manage) return openModal('edit', Number(manage.dataset.manage));
    const endNow = t.closest('[data-endnow]');
    if (endNow) { finishSession(tableOf(Number(endNow.dataset.endnow)), 'Ended early'); return renderAll(); }
    const cs = t.closest('[data-cstart]');
    if (cs) { const c = customers.find(x => x.id === cs.dataset.cstart); return openModal('start', null, { name: c.name, phone: c.phone }); }
    const rs = t.closest('[data-rstart]'); if (rs) return startReservation(rs.dataset.rstart);
    const rc = t.closest('[data-rcancel]'); if (rc) return cancelReservation(rc.dataset.rcancel);

    const ack = t.closest('[data-ack]'); if (ack) return acknowledgeAlert(ack.dataset.ack);
    const mp = t.closest('[data-markpaid]');
    if (mp) {
      const id = mp.dataset.markpaid;
      const h = history.find(x => x.id === id);
      const sel = document.querySelector(`[data-pm='${id}']`);
      h.paid = true;
      h.method = sel ? sel.value : 'Cash';
      showToast(`${money(h.amount)} recorded for ${h.name} (${h.method}).`, 'Payment recorded');
      return renderAll();
    }
    const up = t.closest('[data-unpay]');
    if (up) { const h = history.find(x => x.id === up.dataset.unpay); h.paid = false; h.method = ''; return renderAll(); }
    const pt = t.closest('[data-ptab]'); if (pt) { payTab = pt.dataset.ptab; return renderAll(); }
    const suse = t.closest('[data-suse]'); if (suse) { useStaff(Number(suse.dataset.suse)); return renderAll(); }
    const sdel = t.closest('[data-sdel]'); if (sdel) { removeStaff(Number(sdel.dataset.sdel)); return renderAll(); }
    const cdel = t.closest('[data-cdel]'); if (cdel) return deleteCustomer(cdel.dataset.cdel);
    const act = t.closest('[data-action]');
    if (act) {
      if (act.dataset.action === 'new-session') return openModal('start', null);
      if (act.dataset.action === 'new-res') return openModal('reserve', null, { start: Date.now() + HR });
      if (act.dataset.action === 'add-customer') return addCustomer();
    }
  });

  document.addEventListener('input', e => {
    if (e.target.id === 'search') { query = e.target.value; renderAll(); }
    if (e.target.id === 'custSearch') { custQuery = e.target.value; renderAll(); }
  });

  function addCustomer() {
    const name = $('cName').value.trim();
    const phone = $('cPhone').value.trim();
    if (!name) return showToast('Please type the customer name first.', 'Name needed');
    const existed = customers.some(c => c.name.toLowerCase() === name.toLowerCase());
    upsertCustomer(name, phone);
    $('cName').value = ''; $('cPhone').value = '';
    showToast(existed ? `${name} was already saved. Details updated.` : `${name} saved to customers.`, 'Customer saved');
    renderAll();
  }

  // ---------- Cashier account: login, reset password, edit ----------
  const account = { username: 'Elikanah', password: 'pool2026', name: 'Elikanah' };
  $('setUser').value = account.username;
  $('setName').value = account.name;
  const staff = [{ name: account.name, username: account.username, password: account.password }];
  let activeIdx = 0;
  function renderStaff() {
    $('staffList').innerHTML = staff.map((st, i) => { const nm = st.name; return `
      <div style='display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0f4f1'>
        <span class='av'>${nm.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}</span>
        <div style='flex:1'><b>${nm}</b> <span class='muted' style='font-size:12px'>@${st.username}</span>${i === activeIdx ? " <span class='pill'>On duty</span>" : ''}</div>
        ${i === activeIdx ? '' : `<button class='btn btn-ghost btn-sm' onclick='useStaff(${i})'>Switch to</button>`}
        ${staff.length > 1 ? `<button class='btn btn-red btn-sm' onclick='removeStaff(${i})'>Remove</button>` : ''}
      </div>`; }).join('');
  }
  function useStaff(i, silent) {
    activeIdx = i;
    const st = staff[i];
    account.name = st.name;
    account.username = st.username;
    account.password = st.password;
    $('setName').value = st.name;
    $('setUser').value = st.username;
    applyCashier();
    renderStaff();
    if (!silent) showToast(`${st.name} is now on duty.`, 'Cashier switched');
  }
  function addStaff() {
    const n = $('newPerson').value.trim();
    const u = $('newUser').value.trim();
    const p = $('newPass').value;
    if (!n) { showToast('Type the full name of the new person first.', 'Name needed'); return; }
    if (!u) { showToast('Give the new person a username.', 'Username needed'); return; }
    if (staff.some(s => s.username === u)) { showToast('That username is already used by someone on the list.', 'Username taken'); return; }
    if (p.length < 6) { showToast('Password must be at least 6 characters.', 'Password needed'); return; }
    staff.push({ name: n, username: u, password: p });
    $('newPerson').value = ''; $('newUser').value = ''; $('newPass').value = '';
    useStaff(staff.length - 1);
  }
  function removeStaff(i) {
    if (staff.length < 2) return;
    const wasActive = i === activeIdx;
    staff.splice(i, 1);
    if (wasActive) {
      useStaff(0, true);
    } else if (i < activeIdx) {
      activeIdx--;
    }
    renderStaff();
  }
  renderStaff();
  function applyCashier() {
    const parts = account.name.trim().split(/\s+/);
    const ini = parts.map(p => p[0]).slice(0, 2).join('').toUpperCase();
    document.querySelectorAll('.cashier-name').forEach(el => el.textContent = account.name);
    document.querySelectorAll('.cashier-ini').forEach(el => el.textContent = ini);
    document.querySelectorAll('.cashier-first').forEach(el => el.textContent = parts[0]);
  }
  function saveName() {
    const n = $('setName').value.trim();
    if (!n) { showToast('Please type the new cashier name first.', 'Name needed'); return; }
    account.name = n;
    staff[activeIdx].name = n;
    renderStaff();
    applyCashier();
    showToast(`Cashier changed to ${n}.`, 'Cashier updated');
  }
  function setLoginErr(msg) { const e = $('loginErr'); e.textContent = msg; e.style.display = msg ? 'block' : 'none'; }
  function doLogin() {
    const u = $('user').value.trim(), p = $('pw').value;
    const idx = staff.findIndex(s => s.username === u && s.password === p);
    if (idx < 0) { setLoginErr('Wrong username or password. Please try again or reset your password.'); return; }
    useStaff(idx, true);
    setLoginErr('');
    showScreen('dashboard');
  }
  function togglePwVis(on, ids) { ids.forEach(id => $(id).type = on ? 'text' : 'password'); }
  function openReset() {
    $('rUser').value = $('user').value.trim();
    $('rNew').value = ''; $('rConfirm').value = ''; $('rErr').textContent = '';
    $('resetModal').classList.add('show');
    setTimeout(() => $('rNew').focus(), 50);
  }
  function closeReset() { $('resetModal').classList.remove('show'); }
  function saveReset() {
    const u = $('rUser').value.trim(), n = $('rNew').value, c = $('rConfirm').value;
    const idx = staff.findIndex(s => s.username === u);
    if (idx < 0) return $('rErr').textContent = 'No staff member has that username.';
    if (n.length < 6) return $('rErr').textContent = 'New password must be at least 6 characters.';
    if (n !== c) return $('rErr').textContent = 'The two passwords do not match.';
    staff[idx].password = n;
    if (idx === activeIdx) account.password = n;
    $('pw').value = '';
    closeReset();
    setLoginErr('');
    showToast('Password reset. Log in with your new password.', 'Password reset');
  }
  function saveAccount() {
    const u = $('setUser').value.trim(), cur = $('setCur').value, n = $('setNew').value, c = $('setConfirm').value;
    const err = $('setErr');
    const fail = m => { err.style.color = 'var(--red)'; err.textContent = m; };
    if (!u) return fail('Username cannot be empty.');
    if (cur !== account.password) return fail('Current password is wrong.');
    if (n && n.length < 6) return fail('New password must be at least 6 characters.');
    if (n !== c) return fail('New passwords do not match.');
    account.username = u;
    if (n) account.password = n;
    staff[activeIdx].username = u;
    if (n) staff[activeIdx].password = n;
    $('setCur').value = ''; $('setNew').value = ''; $('setConfirm').value = '';
    err.style.color = 'var(--green)';
    err.textContent = 'Saved. Use the new details at your next login.';
  }

  // ---------- Owner alarm: time limit reached ----------
  const ownerAlerts = [];
  let ownerAlarmTimer = null;
  function raiseOwnerAlert(t, s) {
    const amount = t.rate * s.hours;
    const now = Date.now();
    ownerAlerts.unshift({ id: uid(), table: t.n, name: s.name, hours: s.hours, amount, time: now, acked: false });
    messages.unshift({ name: 'Owner alert', phone: '', table: t.n, amount, text: `Time limit reached: ${s.name}'s ${s.hours} hr session on Table ${pad(t.n)} has ended. The table was reset to available.`, time: now, read: false });
    updateBell();
    renderOwnerAlerts();
    beep();
    if (!ownerAlarmTimer) {
      ownerAlarmTimer = setInterval(() => {
        if (ownerAlerts.some(a => !a.acked)) beep();
        else stopOwnerAlarm();
      }, 3000);
    }
  }
  function renderOwnerAlerts() {
    const open = ownerAlerts.filter(a => !a.acked);
    const panel = $('ownerPanel');
    panel.style.display = open.length ? 'flex' : 'none';
    panel.innerHTML = open.map(a => `
      <div class="owner-card">
        <div class="oc-head">⏰ Time limit reached · Table ${pad(a.table)}</div>
        <div class="oc-body"><b>${a.name}</b> finished a ${a.hours} hr session at ${fmtT(a.time)}.<br>Amount: ${money(a.amount)} · The table was reset to available.</div>
        <div class="oc-actions"><button class="btn btn-ghost btn-sm" data-go="tables">Open tables</button><button class="btn btn-red btn-sm" data-ack="${a.id}">Acknowledge</button></div>
      </div>`).join('');
  }
  function acknowledgeAlert(id) {
    const a = ownerAlerts.find(x => x.id === id);
    if (a) a.acked = true;
    renderOwnerAlerts();
    if (!ownerAlerts.some(x => !x.acked)) stopOwnerAlarm();
  }
  function stopOwnerAlarm() {
    clearInterval(ownerAlarmTimer);
    ownerAlarmTimer = null;
  }

  // ---------- Live timers, auto reset & alarm ----------
  function tick() {
    const now = Date.now();
    let changed = false;
    tables.forEach(t => {
      if (t.status !== 'occupied' || !t.session) return;
      const end = endOf(t.session);
      if (now >= end) {
        const s = finishSession(t, 'Completed');
        sendEndMessage(t, s);
        raiseOwnerAlert(t, s);
        changed = true;
      } else {
        const left = hms(Math.floor((end - now) / 1000));
        document.querySelectorAll(`[data-left="${t.n}"]`).forEach(el => el.textContent = left);
      }
    });
    if (changed) renderAll();
  }
  setInterval(tick, 1000);
  setInterval(tickClock, 15000);

  // ---------- Payments ----------
  let payTab = 'unpaid';
  function renderPayments() {
    history.forEach(h => {
      if (!h.id) h.id = uid();
      if (h.paid === undefined) { h.paid = false; h.method = ''; }
    });
    const paid = history.filter(h => h.paid);
    const unpaid = history.filter(h => !h.paid);
    const sum = arr => arr.reduce((s, h) => s + h.amount, 0);
    const setP = (k, v) => document.querySelectorAll(`[data-pst='${k}']`).forEach(el => el.textContent = v);
    setP('paidTotal', money(sum(paid)));
    setP('unpaidTotal', money(sum(unpaid)));
    setP('paidCount', `${paid.length} paid`);
    setP('unpaidCount', `${unpaid.length} unpaid`);
    setP('methods', ['Cash', 'M-Pesa', 'Card'].map(m => `${m} ${money(sum(paid.filter(h => h.method === m)))}`).join(' · '));
    document.querySelectorAll('[data-pcount]').forEach(el => {
      const k = el.dataset.pcount;
      el.textContent = k === 'unpaid' ? unpaid.length : k === 'paid' ? paid.length : history.length;
    });
    document.querySelectorAll('[data-ptab]').forEach(b => b.classList.toggle('active', b.dataset.ptab === payTab));
    const list = payTab === 'paid' ? paid : payTab === 'unpaid' ? unpaid : history;
    $('payBody').innerHTML = list.length ? list.map(h => `<tr>
        <td><b>Table ${pad(h.table)}</b></td>
        <td><div class='cust'><span class='av'>${initials(h.name)}</span>${h.name}</div></td>
        <td class='muted'>${fmtDT(h.end)}</td>
        <td>${h.hours} hr</td>
        <td class='amt'>${money(h.amount)}</td>
        <td><span class='pill ${h.paid ? '' : 'amber'}'>${h.paid ? h.method : 'Unpaid'}</span></td>
        <td>${h.paid
          ? `<div class='row-actions'><button class='btn btn-ghost btn-sm' data-unpay='${h.id}'>Undo</button></div>`
          : `<div class='row-actions'><select class='select' data-pm='${h.id}'><option>Cash</option><option>M-Pesa</option><option>Card</option></select><button class='btn btn-green btn-sm' data-markpaid='${h.id}'>Mark paid</button></div>`}</td>
      </tr>`).join('') : `<tr><td colspan='7' class='empty'>${payTab === 'paid' ? 'No payments recorded yet.' : 'Nothing waiting to be paid.'}</td></tr>`;
  }

  // ---------- Staff management page ----------
  function renderStaffPage() {
    const roleOf = s => s.role || 'Cashier';
    document.querySelectorAll('[data-stf="total"]').forEach(el => el.textContent = staff.length);
    document.querySelectorAll('[data-stf="on"]').forEach(el => el.textContent = staff[activeIdx].name);
    document.querySelectorAll('[data-stf="mgr"]').forEach(el => el.textContent = staff.filter(s => roleOf(s) === 'Manager').length);
    $('staffBody').innerHTML = staff.map((s, i) => {
      const on = i === activeIdx;
      const ini = s.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
      return `<tr>
        <td><div class='cust'><span class='av'>${ini}</span>${s.name}</div></td>
        <td class='muted'>${s.username}</td>
        <td><span class='pill ${roleOf(s) === 'Manager' ? 'amber' : ''}'>${roleOf(s)}</span></td>
        <td>${on ? "<span class='pill'>On duty</span>" : "<span class='pill grey'>Off duty</span>"}</td>
        <td><div class='row-actions'>${on ? '' : `<button class='btn btn-green btn-sm' data-suse='${i}'>Put on duty</button>`}${staff.length > 1 ? `<button class='btn btn-red btn-sm' data-sdel='${i}'>Remove</button>` : ''}</div></td>
      </tr>`;
    }).join('');
  }
  function addStaffPage() {
    const n = $('spName').value.trim(), u = $('spUser').value.trim(), p = $('spPass').value, r = $('spRole').value;
    if (!n) { showToast('Type the full name first.', 'Name needed'); return; }
    if (!u) { showToast('Give the new person a username.', 'Username needed'); return; }
    if (staff.some(s => s.username === u)) { showToast('That username is already used by someone on the list.', 'Username taken'); return; }
    if (p.length < 6) { showToast('Password must be at least 6 characters.', 'Password needed'); return; }
    staff.push({ name: n, username: u, password: p, role: r });
    $('spName').value = ''; $('spUser').value = ''; $('spPass').value = ''; $('spRole').value = 'Cashier';
    showToast(`${n} was added as ${r}. Use Put on duty to start their shift.`, 'Staff added');
    renderAll();
  }

  // ---------- Saved storage (kept in this browser) ----------
  const STORE_KEY = 'cuehouse-pool-system-v1';
  function saveData() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        customers, history, reservations, messages, ownerAlerts, staff, activeIdx,
        tables: tables.map(t => ({ n: t.n, status: t.status, session: t.session, time: t.time || null, who: t.who || null, resId: t.resId || null }))
      }));
    } catch (e) { /* storage unavailable: keep working in memory */ }
    dbSave();
  }
  function loadData() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return false;
      const d = JSON.parse(raw);
      const fill = (arr, src) => { arr.length = 0; (src || []).forEach(x => arr.push(x)); };
      fill(customers, d.customers);
      fill(history, d.history);
      fill(reservations, d.reservations);
      fill(messages, d.messages);
      fill(ownerAlerts, d.ownerAlerts);
      if (d.staff && d.staff.length) fill(staff, d.staff);
      activeIdx = Math.min(d.activeIdx || 0, staff.length - 1);
      (d.tables || []).forEach(saved => { const t = tableOf(saved.n); if (t) Object.assign(t, saved); });
      return true;
    } catch (e) { return false; }
  }
  function deleteCustomer(id) {
    const i = customers.findIndex(c => c.id === id);
    if (i >= 0) customers.splice(i, 1);
    renderAll();
  }
  function eraseAll() {
    const word = $('eraseWord').value.trim();
    if ($('erasePw').value !== account.password) { showToast('Wrong password for the person on duty. Nothing was erased.', 'Password needed'); return; }
    if (word !== 'ERASE') { showToast('Type the word ERASE in the box to confirm.', 'Not erased'); return; }
    customers.length = 0; history.length = 0; reservations.length = 0; messages.length = 0; ownerAlerts.length = 0;
    tables.forEach(t => { t.status = 'available'; t.session = null; t.time = null; t.who = null; t.resId = null; });
    stopOwnerAlarm();
    staff.length = 0;
    staff.push({ name: 'Elikanah', username: 'Elikanah', password: 'pool2026' });
    $('eraseWord').value = '';
    $('erasePw').value = '';
    useStaff(0, true);
    updateBell();
    renderOwnerAlerts();
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    renderAll();
    showToast('All saved names and records were erased.', 'Erased');
  }

  // ---------- Shared online storage (npoint.io, via fetch) ----------
  const SHARE_URL = 'https://api.npoint.io/f7be49bad932c062e822';
  let shareReady = false, pendingShare = false, shareTimer = null, lastShareJson = '', lastRemoteJson = '';
  function setDbStatus(msg) { document.querySelectorAll('.dbStatus').forEach(el => el.textContent = msg); }
  function snapshot() {
    return {
      customers, history, reservations, messages, ownerAlerts, staff, activeIdx,
      tables: tables.map(t => ({ n: t.n, status: t.status, session: t.session, time: t.time || null, who: t.who || null, resId: t.resId || null }))
    };
  }
  function applySnapshot(d) {
    const fill = (arr, src) => { arr.length = 0; (src || []).forEach(x => arr.push(x)); };
    fill(customers, d.customers); fill(history, d.history); fill(reservations, d.reservations);
    fill(messages, d.messages); fill(ownerAlerts, d.ownerAlerts);
    if (d.staff && d.staff.length) fill(staff, d.staff);
    activeIdx = Math.min(d.activeIdx || 0, staff.length - 1);
    (d.tables || []).forEach(saved => { const t = tableOf(saved.n); if (t) Object.assign(t, saved); });
  }
  async function fetchShared() {
    const res = await fetch(SHARE_URL, { method: 'GET', cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.text();
  }
  async function sendShared(body) {
    const opts = { headers: { 'Content-Type': 'application/json' }, body };
    let res = await fetch(SHARE_URL, { ...opts, method: 'PUT' });
    if (!res.ok) res = await fetch(SHARE_URL, { ...opts, method: 'POST' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  }
  function nowTime() {
    return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  }
  // Called whenever data changes: waits 0.8 s, then sends the latest copy.
  function dbSave() {
    if (!shareReady) return;
    const json = JSON.stringify(snapshot());
    if (json === lastShareJson) return;
    pendingShare = true;
    clearTimeout(shareTimer);
    shareTimer = setTimeout(async () => {
      try {
        await sendShared(json);
        lastShareJson = json;
        lastRemoteJson = json;
        pendingShare = false;
        setDbStatus('Shared online · saved ' + nowTime());
      } catch (e) {
        setDbStatus('Could not save online (' + e.message + '). Kept in this browser.');
      }
    }, 800);
  }
  // Loads the shared copy when the page opens.
  async function initShared() {
    try {
      const text = await fetchShared();
      const data = text ? JSON.parse(text) : null;
      if (data && data.customers) {
        applySnapshot(data);
        useStaff(activeIdx, true);
        lastShareJson = JSON.stringify(snapshot());
        lastRemoteJson = text;
      }
      shareReady = true;
      setDbStatus('Shared online · connected ' + nowTime());
      renderAll();
      dbSave();
    } catch (e) {
      setDbStatus('Offline: could not reach the shared store (' + e.message + '). Using this browser only.');
    }
  }
  // Picks up changes made by other users (skipped while this copy has unsaved changes).
  async function pullShared() {
    if (!shareReady || pendingShare) return;
    try {
      const text = await fetchShared();
      if (!text || text === lastRemoteJson) return;
      const data = JSON.parse(text);
      if (!data || !data.customers) return;
      lastRemoteJson = text;
      applySnapshot(data);
      useStaff(activeIdx, true);
      lastShareJson = JSON.stringify(snapshot());
      renderAll();
      setDbStatus('Shared online · updated ' + nowTime());
    } catch (e) { /* keep the current view and try again later */ }
  }

  buildShell();
  if (loadData()) useStaff(activeIdx, true);
  renderAll();
  setInterval(saveData, 3000);
  initShared();
  setInterval(pullShared, 15000);
