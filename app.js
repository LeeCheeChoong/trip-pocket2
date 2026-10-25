"use strict";
/* ---------- constants ---------- */
const TYPES = ["flight", "stay", "food", "sightseeing", "shopping", "transport"];
const TYPE_LABEL = { flight: "Flight", stay: "Stay", food: "Food", sightseeing: "Sightseeing", shopping: "Shopping", transport: "Transport" };
const TYPE_CAT = { flight: "transport", stay: "stay", food: "food", sightseeing: "activities", shopping: "shopping", transport: "transport" };
const CATS = ["stay", "food", "transport", "activities", "shopping", "other"];
const CAT_LABEL = { stay: "Stay", food: "Food", transport: "Transport", activities: "Activities", shopping: "Shopping", other: "Other", settlement: "Settle up" };
const CURRENCIES = [
  ["SGD","Singapore dollar"],["USD","US dollar"],["EUR","Euro"],["JPY","Japanese yen"],["GBP","British pound"],["AUD","Australian dollar"],
  ["MYR","Malaysian ringgit"],["THB","Thai baht"],["IDR","Indonesian rupiah"],["KRW","South Korean won"],["CNY","Chinese yuan"],["HKD","Hong Kong dollar"],
  ["TWD","New Taiwan dollar"],["VND","Vietnamese dong"],["PHP","Philippine peso"],["INR","Indian rupee"],["NZD","New Zealand dollar"],["CAD","Canadian dollar"],
  ["CHF","Swiss franc"],["AED","UAE dirham"],["SEK","Swedish krona"],["NOK","Norwegian krone"],["DKK","Danish krone"],["ISK","Icelandic króna"],
  ["CZK","Czech koruna"],["HUF","Hungarian forint"],["PLN","Polish złoty"],["RON","Romanian leu"],["TRY","Turkish lira"],["ZAR","South African rand"],
  ["BRL","Brazilian real"],["MXN","Mexican peso"],["ILS","Israeli shekel"]
];
const CUR_NAME = Object.fromEntries(CURRENCIES);
const AV_COLORS = ["#1d4fa6", "#f0661a", "#14806a", "#8a45c4", "#d23f6e", "#0f7ea8"];
const PACK_TEMPLATE = {
  Documents: ["Passport (6+ months validity)", "Travel insurance details", "Offline copies of bookings", "Some cash in local currency"],
  Tech: ["Phone charger", "Power bank", "Universal adapter", "Earphones"],
  Clothes: ["T-shirts", "Trousers / shorts", "Underwear & socks", "Light jacket", "Sleepwear", "Comfy walking shoes"],
  Toiletries: ["Toothbrush & toothpaste", "Sunscreen", "Medication", "Deodorant"],
  "Day bag": ["Reusable water bottle", "Foldable umbrella", "Tissues & wet wipes"]
};
const RATE_API = "https://api.frankfurter.dev/v1/";
const CFG = window.TP_CONFIG;
const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey);

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
const icon = (n, cls = "") => `<svg class="i ${cls}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const clone = o => JSON.parse(JSON.stringify(o ?? null));
const round2 = n => Math.round(n * 100) / 100;
function lsGet(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } }

function pad(n) { return String(n).padStart(2, "0"); }
function ymd(d) { return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; }
function parseD(s) { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, (m || 1) - 1, d || 1); }
function today() { return ymd(new Date()); }
function addDays(s, n) { const d = parseD(s); d.setDate(d.getDate() + n); return ymd(d); }
function diffDays(a, b) { return Math.round((parseD(b) - parseD(a)) / 86400000); }
const DF = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const DFL = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const fmtD = s => s ? DF.format(parseD(s)) : "";
const fmtDL = s => s ? DFL.format(parseD(s)) : "";
function fmtRange(a, b) {
  const A = parseD(a), B = parseD(b);
  const sameYear = A.getFullYear() === B.getFullYear();
  const o1 = { day: "numeric", month: "short" };
  return `${A.toLocaleDateString("en-GB", sameYear ? o1 : { ...o1, year: "numeric" })} – ${B.toLocaleDateString("en-GB", { ...o1, year: "numeric" })}`;
}
const NF = {};
function fmtM(n, cur) {
  if (n == null || isNaN(n)) return "—";
  try { NF[cur] ??= new Intl.NumberFormat("en-SG", { style: "currency", currency: cur }); const s = NF[cur].format(n); return cur === "SGD" ? s.replace("$", "S$") : s; }
  catch { return `${cur} ${Number(n).toFixed(2)}`; }
}
function fmtRate(r) { if (!r) return "—"; r = Number(r); return r >= 100 ? r.toFixed(2) : r >= 1 ? r.toFixed(4) : Number(r.toPrecision(4)).toString(); }
function tripDays(t) { const out = []; if (!t.start || !t.end) return out; const n = diffDays(t.start, t.end); for (let i = 0; i <= Math.min(n, 60); i++) out.push(addDays(t.start, i)); return out; }
function countdown(t) {
  const td = today(), n = diffDays(t.start, t.end) + 1;
  if (td < t.start) { const d = diffDays(td, t.start); return { cls: "", text: d === 1 ? "Tomorrow!" : `in ${d} days`, state: "up" }; }
  if (td <= t.end) return { cls: "now", text: `Day ${diffDays(t.start, td) + 1} of ${n}`, state: "now" };
  const d = diffDays(t.end, td);
  return { cls: "past", text: d < 31 ? `${d} day${d === 1 ? "" : "s"} ago` : parseD(t.end).toLocaleDateString("en-GB", { month: "short", year: "numeric" }), state: "past" };
}
function hashN(s) { let h = 0; for (const c of String(s)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
const mapsUrl = q => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);
function person(t, id) { return (t.people || []).find(p => p.id === id); }
function personName(t, id) { return person(t, id)?.name || "Someone"; }
function avatar(t, id) { const i = (t.people || []).findIndex(p => p.id === id); const nm = personName(t, id); return `<span class="avatar" style="background:${AV_COLORS[(i < 0 ? 0 : i) % AV_COLORS.length]}">${esc(nm.slice(0, 1).toUpperCase())}</span>`; }
const byCreated = (a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || ""));

/* ---------- row mapping: JS objects are camelCase, columns are snake_case ---------- */
const RENAME = { start: "start_date", end: "end_date" };
const RENAME_BACK = Object.fromEntries(Object.entries(RENAME).map(([a, b]) => [b, a]));
const toSnake = s => RENAME[s] || s.replace(/[A-Z]/g, c => "_" + c.toLowerCase());
const toCamel = s => RENAME_BACK[s] || s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
function toRow(o) { const r = {}; for (const [k, v] of Object.entries(o)) if (v !== undefined && k !== "createdAt") r[toSnake(k)] = v; return r; }
function fromRow(r) { const o = {}; for (const [k, v] of Object.entries(r)) if (k !== "user_id") o[toCamel(k)] = v; return o; }

/* ---------- state ---------- */
const S = { status: "loading", user: null, trips: {}, tripId: null, tab: "plan", items: [], expenses: [], photos: [], rates: {}, prefs: {}, photoDay: "all", online: navigator.onLine, authMode: "signin" };
const tripRef = () => S.trips[S.tripId];
const queueKey = () => "tp_receipt_queue_" + (S.user?.id || "anon");

/* ---------- data access ---------- */
function writeErr(e) {
  if (!navigator.onLine) return "You're offline. Reconnect and try again.";
  if (e?.code === "42501" || /row-level security/i.test(e?.message || "")) return "You don't have permission to change that.";
  if (/JWT|session/i.test(e?.message || "")) return "Your session expired. Sign in again.";
  return "Couldn't save that change. Check your connection and try again.";
}
async function run(promise) {
  const { data, error } = await promise;
  if (error) { toast(writeErr(error)); throw error; }
  return data;
}
/* one write at a time per row */
const chains = {};
function write(key, fn) {
  const p = (chains[key] || Promise.resolve()).then(fn);
  chains[key] = p.catch(() => {});
  return p;
}
const insertRows = (table, rows) => run(sb.from(table).insert(rows.map(toRow)));
const setRow = (table, obj) => write(table + "/" + obj.id, () => run(sb.from(table).upsert(toRow(obj))));
const updRow = (table, id, fields) => write(table + "/" + id, () => run(sb.from(table).update(toRow(fields)).eq("id", id))).then(soon);
const delRow = (table, id) => write(table + "/" + id, () => run(sb.from(table).delete().eq("id", id))).then(soon);
function updTrip(fields) {
  const t = tripRef(); if (!t) return Promise.resolve();
  Object.assign(t, clone(fields));
  scheduleRender();
  return updRow("trips", t.id, fields).catch(() => {});
}

async function loadTrips() {
  const rows = await run(sb.from("trips").select("*").order("start_date"));
  const next = {};
  for (const r of rows) next[r.id] = fromRow(r);
  S.trips = next;
  await signPaths(Object.values(next).map(t => t.cover));
}
async function loadChildren(id) {
  const [items, exps, photos] = await Promise.all([
    run(sb.from("items").select("*").eq("trip_id", id)),
    run(sb.from("expenses").select("*").eq("trip_id", id)),
    run(sb.from("photos").select("*").eq("trip_id", id))
  ]);
  if (S.tripId !== id) return;
  S.items = items.map(fromRow); S.expenses = exps.map(fromRow); S.photos = photos.map(fromRow);
  await signPaths([...S.photos.map(p => p.path), ...S.expenses.map(e => e.receipt)]);
}
async function loadRates() {
  const rows = await run(sb.from("rates").select("*"));
  const r = {}; for (const row of rows) r[row.date] = fromRow(row);
  S.rates = r;
}
async function loadPrefs() {
  const row = await run(sb.from("prefs").select("*").maybeSingle());
  if (row) { S.prefs = fromRow(row); return; }
  S.prefs = { lastConvert: "SGD", lastConvertByTrip: {}, exampleSeeded: false };
  await run(sb.from("prefs").upsert({ user_id: S.user.id, ...toRow(S.prefs) }));
}
function savePrefs() { return write("prefs", () => run(sb.from("prefs").upsert({ user_id: S.user.id, ...toRow(S.prefs) }))).catch(() => {}); }

/* refresh after local writes and remote changes */
let refreshTimer = null;
function soon() {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(async () => {
    try { await loadTrips(); if (S.tripId && S.trips[S.tripId]) await loadChildren(S.tripId); else if (S.tripId) return closeTrip(); scheduleRender(); } catch {}
  }, 250);
}
let channel = null;
function subscribeLive() {
  channel?.unsubscribe();
  const f = `user_id=eq.${S.user.id}`;
  channel = sb.channel("tp-" + S.user.id);
  for (const table of ["trips", "items", "expenses", "photos"]) channel.on("postgres_changes", { event: "*", schema: "public", table, filter: f }, soon);
  channel.subscribe();
}

/* ---------- photo & receipt storage (private bucket, signed URLs) ---------- */
const urlCache = {};
async function signPaths(paths) {
  const need = [...new Set(paths.filter(p => p && !(urlCache[p]?.exp > Date.now() + 120000)))];
  if (!need.length) return;
  const { data } = await sb.storage.from(CFG.mediaBucket).createSignedUrls(need, 3600);
  for (const d of data || []) if (d.signedUrl) urlCache[d.path] = { url: d.signedUrl, exp: Date.now() + 3600e3 };
}
const mediaUrl = p => (p && urlCache[p]?.url) || "";
async function uploadMedia(blob, tripId, kind) {
  const ext = { "image/png": "png", "image/webp": "webp", "image/gif": "gif" }[blob.type] || "jpg";
  const path = `${S.user.id}/${tripId}/${kind}/${uid()}.${ext}`;
  const { error } = await sb.storage.from(CFG.mediaBucket).upload(path, blob, { contentType: blob.type || "image/jpeg", upsert: false });
  if (error) throw error;
  urlCache[path] = { url: URL.createObjectURL(blob), exp: Date.now() + 3000e3 };
  return path;
}
function removeMedia(paths) { const p = paths.filter(Boolean); if (p.length) sb.storage.from(CFG.mediaBucket).remove(p).catch(() => {}); }

/* ---------- rendering ---------- */
let renderPending = false, renderQueued = false;
function isEditing() {
  const a = document.activeElement;
  return a && $("#app").contains(a) && (a.tagName === "TEXTAREA" || (a.tagName === "INPUT" && !["checkbox", "radio", "file", "button"].includes(a.type)) || a.tagName === "SELECT");
}
function scheduleRender() { if (renderQueued) return; renderQueued = true; requestAnimationFrame(() => { renderQueued = false; render(); }); }
document.addEventListener("focusout", () => setTimeout(() => { if (renderPending && !isEditing()) { renderPending = false; render(); } }, 0));
function render() {
  if (isEditing()) { renderPending = true; return; }
  if (S.status === "signedout") { $("#app").innerHTML = authView(); return afterAuthRender(); }
  const t = tripRef();
  const y = window.scrollY;
  $("#app").innerHTML = t ? tripView(t) : dashboard();
  if (t) window.scrollTo(0, y);
  afterRender();
}

function brandBand(extra = "") {
  return `<header class="band"><svg class="trail" viewBox="0 0 260 90" aria-hidden="true"><path d="M0 80 C 80 70, 140 20, 250 12" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="4 7"/></svg>
    <div class="wrap"><div class="brand"><span class="brand-mark">${icon("flight")}</span>Trip Pocket</div><span class="spacer"></span>${extra}</div></header>`;
}

/* ----- sign in / sign up ----- */
function authView() {
  const up = S.authMode === "signup";
  return `<div class="auth">${brandBand()}
    <main class="auth-main wrap"><form class="auth-card" id="auth-form" novalidate>
      <div><h1>${up ? "Start planning" : "Welcome back"}</h1>
        <p>${up ? "Create an account to keep your trips, budgets and photos in one place." : "Sign in to see your trips on any device."}</p></div>
      <div class="auth-tabs" role="tablist"><button type="button" role="tab" aria-selected="${!up}" data-auth="signin">Sign in</button><button type="button" role="tab" aria-selected="${up}" data-auth="signup">Create account</button></div>
      <label class="field"><span>Email</span><input class="inp" type="email" id="au-email" name="email" autocomplete="email" required placeholder="you@example.com"></label>
      <label class="field"><span>Password</span><input class="inp" type="password" id="au-pass" name="password" autocomplete="${up ? "new-password" : "current-password"}" required minlength="6" placeholder="${up ? "At least 6 characters" : "Your password"}"></label>
      <div id="au-msg" aria-live="polite"></div>
      <button class="btn primary" type="submit" id="au-submit" style="padding-block:12px">${up ? "Create account" : "Sign in"}</button>
      ${up ? `<p class="hint">New accounts start with an example trip so you can see how everything works.</p>` : ""}
    </form></main></div>`;
}
function afterAuthRender() {
  $$("[data-auth]").forEach(b => b.onclick = () => { S.authMode = b.dataset.auth; render(); $("#au-email")?.focus(); });
  const f = $("#auth-form"); if (!f) return;
  f.onsubmit = async e => {
    e.preventDefault();
    const email = f.email.value.trim(), password = f.password.value, msg = $("#au-msg"), btn = $("#au-submit");
    const say = (text, ok) => { msg.innerHTML = text ? `<div class="${ok ? "auth-ok" : "auth-err"}">${esc(text)}</div>` : ""; };
    if (!/^\S+@\S+\.\S+$/.test(email)) return say("Enter a valid email address.");
    if (password.length < 6) return say("Use at least 6 characters for your password.");
    btn.disabled = true; say("");
    try {
      if (S.authMode === "signup") {
        const { data, error } = await sb.auth.signUp({ email, password });
        if (error) throw error;
        if (!data.session) {
          if (data.user && !(data.user.identities || []).length) say("An account with this email already exists. Sign in instead.");
          else say("Account created. Check your email to confirm it, then sign in.", true);
        }
      } else {
        const { error } = await sb.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      const m = err?.message || "";
      say(/invalid login/i.test(m) ? "That email and password don't match. Try again." : /already registered/i.test(m) ? "An account with this email already exists. Sign in instead." : /not confirmed/i.test(m) ? "Confirm your email first, then sign in." : /rate limit/i.test(m) ? "Too many attempts. Wait a minute and try again." : m || "Something went wrong. Try again.");
    } finally { btn.disabled = false; }
  };
}

function coverHTML(t, cls = "") {
  const pal = "cv" + (hashN(t.destination || t.name) % 5);
  const code = (t.destination || t.name || "TRP").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
  const url = mediaUrl(t.cover);
  const img = url ? `<img src="${esc(url)}" alt="" loading="lazy" onerror="this.remove()">` : "";
  return `<div class="cover ${pal} ${cls} ${url ? "has-img" : ""}">
    <svg class="plane" viewBox="0 0 300 170" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 150 C 70 120, 120 40, 310 30" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="5 7"/></svg>
    ${img}<div class="shade"></div>
    <div class="gen-name">${esc(t.destination || t.name)}</div>
    <div class="stamp"><div><b>${esc(code)}</b>${esc(t.start ? parseD(t.start).toLocaleDateString("en-GB", { month: "short", year: "2-digit" }) : "")}</div></div>
  </div>`;
}

function dashboard() {
  const trips = Object.values(S.trips).filter(t => t.start && t.end);
  const td = today();
  const upcoming = trips.filter(t => t.end >= td).sort((a, b) => a.start.localeCompare(b.start));
  const past = trips.filter(t => t.end < td).sort((a, b) => b.start.localeCompare(a.start));
  const next = upcoming[0];
  let greet = "Plan it, pack it, track every yen.";
  if (next) { const c = countdown(next); greet = c.state === "now" ? `You're on ${esc(next.name)} right now. ${esc(c.text)}, have fun out there.` : `Next up: ${esc(next.name)}, ${esc(c.text)}.`; }
  const card = t => { const c = countdown(t); return `<button class="card ${c.state === "past" ? "past" : ""}" data-act="open" data-id="${esc(t.id)}">
      ${coverHTML(t)}
      <div class="body"><h3>${esc(t.name)}</h3>
      <div class="meta">${icon("cal")}<span>${esc(fmtRange(t.start, t.end))}</span></div>
      <div class="meta"><span class="pill ${c.cls}">${esc(c.text)}</span>${t.example ? '<span class="pill ex">Example</span>' : ""}${(t.people || []).length > 1 ? `<span>${t.people.length} travellers</span>` : ""}</div></div>
    </button>`; };
  let body;
  if (S.status === "loading") body = `<div class="cards" style="margin-top:22px"><div class="skel"></div><div class="skel"></div></div>`;
  else if (S.status === "error") body = `<div class="empty">${icon("cloud-off")}<h2>Couldn't load your trips</h2><p>Check your connection, then try again.</p><button class="btn primary" data-act="retry">Try again</button></div>`;
  else if (!trips.length) body = `<div class="empty">${icon("flight")}<h2>No trips yet</h2><p>Your trips will appear here as cards with a countdown. Start with the first one.</p><button class="btn primary" data-act="new-trip">${icon("plus")}Plan a trip</button></div>`;
  else body = `
    ${upcoming.length ? `<div class="section-h"><h2>Upcoming & now</h2><span class="count">${upcoming.length}</span></div><div class="cards">${upcoming.map(card).join("")}</div>` : `<div class="section-h"><h2>Upcoming</h2></div><div class="empty"><p>Nothing booked yet. Somewhere warm, maybe?</p><button class="btn primary" data-act="new-trip">${icon("plus")}Plan a trip</button></div>`}
    ${past.length ? `<div class="section-h"><h2>Past trips</h2><span class="count">${past.length}</span></div><div class="cards">${past.map(card).join("")}</div>` : ""}`;
  const acct = `<span class="acct"><span class="em">${esc(S.user?.email || "")}</span><button class="btn ghost sm" data-act="sign-out">Sign out</button></span>
    ${S.status === "ready" ? `<button class="btn primary" data-act="new-trip">${icon("plus")}New trip</button>` : ""}`;
  return `${brandBand(acct)}
    <main class="wrap"><section class="hero"><h1>Where to next?</h1><p>${greet}</p></section>${queueBanner()}${body}</main>
    <footer class="foot wrap">Exchange rates: ECB reference rates via Frankfurter. Each expense keeps the rate from the day you logged it.</footer>`;
}

function queueBanner() {
  const q = lsGet(queueKey(), []);
  if (!q.length) return "";
  return `<div class="banner" style="margin-top:16px">${icon("receipt")}<span>${q.length} receipt${q.length > 1 ? "s" : ""} saved offline. ${S.online ? "Reading and converting now…" : "They'll be read and converted when you're back online."}</span></div>`;
}

function tripView(t) {
  const c = countdown(t);
  const tabs = [["plan", "Itinerary", "cal"], ["money", "Money", "wallet"], ["photos", "Photos", "photo"], ["extras", "Packing & more", "bag"]];
  const panel = { plan: planTab, money: moneyTab, photos: photosTab, extras: extrasTab }[S.tab](t);
  return `<header class="trip-head">${coverHTML(t)}
      <div class="inner" style="position:absolute;inset:0">
        <div class="top"><button class="icon-btn" data-act="home" aria-label="All trips">${icon("back")}</button><span style="flex:1"></span>
          <button class="icon-btn" data-act="edit-trip" aria-label="Edit trip">${icon("edit")}</button></div>
        <h1>${esc(t.name)}</h1>
        <div class="sub"><span>${esc(t.destination)}</span><span>·</span><span>${esc(fmtRange(t.start, t.end))}</span><span class="pill ${c.cls}">${esc(c.text)}</span>${t.example ? '<span class="pill ex">Example trip</span>' : ""}</div>
      </div></header>
    <nav class="tabs"><div class="wrap" role="tablist">${tabs.map(([k, l, ic]) => `<button class="tab" role="tab" aria-selected="${S.tab === k}" data-act="tab" data-tab="${k}">${icon(ic)}${l}</button>`).join("")}</div></nav>
    <main class="wrap panel">${queueBanner()}${panel}</main>
    <button class="btn primary fab" data-act="scan">${icon("receipt")}Scan receipt</button>`;
}

/* ----- itinerary ----- */
function planTab(t) {
  const days = tripDays(t), td = today();
  const byDay = {};
  for (const it of S.items) (byDay[it.day] ||= []).push(it);
  Object.values(byDay).forEach(a => a.sort((x, y) => (x.time || "99").localeCompare(y.time || "99")));
  const H = t.homeCurrency || "SGD";
  const dayHTML = (d, i) => {
    const list = byDay[d] || [];
    const tot = list.reduce((s, it) => s + (Number(it.cost) || 0) * (convApprox(it.currency || H, H, d) ?? 0), 0);
    return `<section class="day ${d === td ? "today" : ""}" id="day-${d}">
      <div class="day-h"><span class="day-n">Day ${i + 1}</span><h3>${esc(fmtD(d))}</h3>${d === td ? '<span class="pill now">Today</span>' : ""}
        <span class="tot num">${tot ? "≈ " + esc(fmtM(tot, H)) : ""}</span>
        <button class="icon-btn" data-act="add-item" data-day="${d}" aria-label="Add to ${esc(fmtD(d))}">${icon("plus")}</button></div>
      ${list.length ? `<ul class="items">${list.map(itemRow).join("")}</ul>` : `<div class="empty-day">A free day. <button class="btn ghost sm" data-act="add-item" data-day="${d}">Add something</button></div>`}
    </section>`;
  };
  const orphans = S.items.filter(it => !days.includes(it.day));
  return `<div class="daychips">${days.map((d, i) => `<button class="daychip ${d === td ? "today" : ""}" data-act="jump" data-day="${d}"><b>Day ${i + 1}</b><span>${esc(fmtD(d))}</span></button>`).join("")}</div>
    <div class="grid2" style="grid-template-columns:minmax(0,1fr)">
      <div class="box">${days.map(dayHTML).join("")}
        ${orphans.length ? `<section class="day"><div class="day-h"><span class="day-n">?</span><h3>Outside trip dates</h3></div><ul class="items">${orphans.map(itemRow).join("")}</ul></section>` : ""}
      </div>
      ${ideasBox(t)}
    </div>`;
}
function itemRow(it) {
  const t = tripRef(), H = t.homeCurrency || "SGD", cur = it.currency || H;
  const cost = Number(it.cost) || 0;
  const r = cur !== H ? convApprox(cur, H, it.day) : null;
  return `<li class="item" data-act="edit-item" data-id="${esc(it.id)}">
    <span class="t">${esc(it.time || "—")}</span>
    <span class="typ ${esc(it.type)}" title="${esc(TYPE_LABEL[it.type] || "")}">${icon(TYPES.includes(it.type) ? it.type : "sightseeing")}</span>
    <div style="min-width:0"><div class="ttl">${esc(it.title)}</div>
      ${it.place ? `<a class="place" href="${esc(mapsUrl(it.place))}" target="_blank" rel="noopener" data-stop>${icon("pin")}${esc(it.place)}</a>` : ""}
      ${it.notes ? `<div class="note">${esc(it.notes)}</div>` : ""}</div>
    <div class="cost num">${cost ? esc(fmtM(cost, cur)) + (r ? `<small>≈ ${esc(fmtM(cost * r, H))}</small>` : "") : ""}${it.expenseId ? `<div class="logged">✓ in expenses</div>` : ""}</div>
  </li>`;
}
function ideasBox(t) {
  const ideas = t.ideas || [];
  return `<div class="box"><div class="box-h">${icon("bulb")}<h2>Ideas</h2><span class="muted small">Places you might squeeze in</span></div>
    ${ideas.length ? `<ul class="ideas">${ideas.map(x => `<li class="idea"><span class="typ">${icon(TYPES.includes(x.type) ? x.type : "sightseeing")}</span>
      <div class="txt"><b>${esc(x.title)}</b>${x.place ? `<a class="place small" href="${esc(mapsUrl(x.place))}" target="_blank" rel="noopener">${esc(x.place)}</a>` : ""}${x.notes ? `<div class="muted small">${esc(x.notes)}</div>` : ""}</div>
      <button class="btn sm" data-act="schedule-idea" data-id="${esc(x.id)}">Schedule</button>
      <button class="icon-btn" data-act="del-idea" data-id="${esc(x.id)}" aria-label="Remove idea">${icon("x")}</button></li>`).join("")}</ul>` : `<p class="muted small">Nothing here yet. Jot down places you hear about, then schedule them onto a day.</p>`}
    <form class="row" data-form="idea" style="margin-top:12px;grid-template-columns:minmax(0,2fr) minmax(0,1.4fr) auto">
      <input class="inp" id="idea-title" name="title" placeholder="Idea, e.g. Ghibli Museum" required>
      <input class="inp" id="idea-place" name="place" placeholder="Place (for Maps)">
      <button class="btn" type="submit">${icon("plus")}Add</button></form></div>`;
}

/* ----- rates & conversion ----- */
function tableOn(date) {
  const keys = Object.keys(S.rates).sort();
  if (!keys.length) return null;
  const k = keys.filter(x => x <= date).pop() || keys[0];
  return S.rates[k];
}
function crossRate(tbl, from, to) {
  if (from === to) return 1;
  const r = tbl?.rates; if (!r) return null;
  const f = from === "EUR" ? 1 : r[from], g = to === "EUR" ? 1 : r[to];
  return f && g ? g / f : null;
}
function convApprox(from, to, date) { return from === to ? 1 : crossRate(tableOn(date || today()), from, to); }
async function fetchTable(date) {
  if (!navigator.onLine) return null;
  const want = date >= today() ? "latest" : date;
  try {
    const ctl = new AbortController(); const tm = setTimeout(() => ctl.abort(), 5000);
    const res = await fetch(RATE_API + want + "?base=EUR", { signal: ctl.signal }); clearTimeout(tm);
    if (!res.ok) return null;
    const j = await res.json();
    if (!j?.rates || !j.date) return null;
    const tbl = { date: j.date, base: "EUR", source: "ECB via Frankfurter", rates: j.rates, fetchedAt: new Date().toISOString() };
    if (!S.rates[j.date]) { S.rates[j.date] = tbl; sb.from("rates").upsert({ user_id: S.user.id, ...toRow(tbl) }).then(() => {}); }
    return tbl;
  } catch { return null; }
}
/* Resolves the best rate for converting on `date`: a saved table for that day (or the day before),
   else a live ECB table, else the closest saved table on or before that day. */
async function getRate(from, to, date) {
  if (from === to) return { rate: 1, source: "Same currency", date, fetchedAt: new Date().toISOString(), live: true };
  const saved = tableOn(date);
  let tbl = saved && saved.date <= date && diffDays(saved.date, date) <= 1 && crossRate(saved, from, to) ? saved : null, live = !!tbl;
  if (!tbl) { tbl = await fetchTable(date); live = !!tbl; }
  if (!tbl) tbl = saved;
  const rate = crossRate(tbl, from, to);
  if (!rate) return null;
  return { rate, source: tbl.source || "ECB", date: tbl.date, fetchedAt: tbl.fetchedAt, live };
}
/* An expense's value in currency H. Uses its locked home amount, crossing via the rate table of the day it was logged when H differs. */
function valueIn(e, H) {
  if (e.currency === H) return Number(e.amount) || 0;
  if (e.homeAmount == null) return null;
  if (e.homeCurrency === H) return Number(e.homeAmount) || 0;
  const tbl = S.rates[e.rateDate] || tableOn(e.rateDate || e.date);
  const r = crossRate(tbl, e.homeCurrency, H);
  return r == null ? null : (Number(e.homeAmount) || 0) * r;
}

/* ----- money ----- */
function moneyTab(t) {
  const H = t.homeCurrency || "SGD";
  const spend = S.expenses.filter(e => e.category !== "settlement");
  let total = 0, missing = 0; const byCat = {};
  for (const e of spend) { const v = valueIn(e, H); if (v == null) { missing++; continue; } total += v; byCat[e.category || "other"] = (byCat[e.category || "other"] || 0) + v; }
  const budget = Number(t.budget) || 0, left = budget - total, pct = budget ? Math.min(100, total / budget * 100) : 0;
  const cats = CATS.map(c => [c, byCat[c] || 0]).sort((a, b) => b[1] - a[1]);
  const maxCat = Math.max(1, ...cats.map(c => c[1]));
  const days = tripDays(t), td = today();
  const dayN = td >= t.start && td <= t.end ? diffDays(t.start, td) + 1 : null;
  const perDay = budget && days.length ? budget / days.length : 0;
  const budgetBox = `<div class="box"><div class="box-h">${icon("wallet")}<h2>Budget</h2><span class="pill">${esc(H)}</span><button class="btn ghost sm" data-act="edit-trip">Edit</button></div>
    <div class="budget-top"><span class="big num">${esc(fmtM(total, H))}</span><span class="muted">spent${budget ? ` of ${esc(fmtM(budget, H))}` : ""}</span></div>
    ${budget ? `<div class="bar ${left < 0 ? "over" : ""}" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>
    <div class="budget-meta"><span class="${left < 0 ? "left-bad" : "left-good"} num">${left < 0 ? `${esc(fmtM(-left, H))} over budget` : `${esc(fmtM(left, H))} left`}</span>
      <span class="muted num">${Math.round(pct)}% used${perDay ? ` · ${esc(fmtM(perDay, H))}/day planned` : ""}${dayN ? ` · day ${dayN} of ${days.length}` : ""}</span></div>` : `<p class="muted small">No budget set. <button class="btn ghost sm" data-act="edit-trip">Set one</button></p>`}
    ${missing ? `<p class="hint">${missing} expense${missing > 1 ? "s" : ""} couldn't be shown in ${esc(H)} because no saved rate covers that currency.</p>` : ""}
    <p class="hint">Totals are in the trip's home currency. Each expense keeps the rate from the day it was logged.</p></div>`;
  const catBox = `<div class="box"><div class="box-h"><h2>By category</h2></div>
    ${total ? `<div class="cats">${cats.filter(c => c[1] > 0).map(([c, v]) => `<div class="cat-row"><span>${CAT_LABEL[c]}</span><span class="track"><i style="width:${v / maxCat * 100}%"></i></span><span class="v num">${esc(fmtM(v, H))}</span></div>`).join("")}</div>` : `<p class="muted small">Your spending by category shows up here once you log an expense.</p>`}</div>`;
  return `<div class="grid2">${budgetBox}${catBox}</div>${splitBox(t, H)}${expensesBox(t, H)}`;
}
function balances(t, H) {
  const ids = (t.people || []).map(p => p.id), bal = Object.fromEntries(ids.map(i => [i, 0]));
  for (const e of S.expenses) {
    const v = valueIn(e, H); if (v == null || !e.paidBy) continue;
    const among = (e.splitAmong || []).filter(i => i in bal); const list = among.length ? among : ids;
    if (e.paidBy in bal) bal[e.paidBy] += v;
    for (const i of list) bal[i] -= v / list.length;
  }
  const deb = [], cred = [];
  for (const [i, v] of Object.entries(bal)) { if (v < -0.005) deb.push([i, -v]); else if (v > 0.005) cred.push([i, v]); }
  deb.sort((a, b) => b[1] - a[1]); cred.sort((a, b) => b[1] - a[1]);
  const tx = []; let a = 0, b = 0;
  while (a < deb.length && b < cred.length) {
    const m = Math.min(deb[a][1], cred[b][1]);
    if (m >= 0.01) tx.push({ from: deb[a][0], to: cred[b][0], amount: round2(m) });
    deb[a][1] -= m; cred[b][1] -= m;
    if (deb[a][1] < 0.005) a++; if (cred[b][1] < 0.005) b++;
  }
  return { bal, tx };
}
function splitBox(t, H) {
  const people = t.people || [];
  if (people.length < 2) return `<div class="box"><div class="box-h"><h2>Split costs</h2></div><p class="muted small">Travelling with friends? Add them to the trip and Trip Pocket works out who owes whom. <button class="btn ghost sm" data-act="edit-trip">Add travellers</button></p></div>`;
  const { bal, tx } = balances(t, H);
  return `<div class="grid2"><div class="box"><div class="box-h"><h2>Who's up, who's down</h2></div><div class="people">
      ${people.map(p => { const v = bal[p.id] || 0; return `<div class="person">${avatar(t, p.id)}<span class="nm">${esc(p.name)}</span><span class="num ${v > 0.005 ? "pos" : v < -0.005 ? "neg" : "muted"}">${Math.abs(v) < 0.005 ? "all square" : (v > 0 ? "gets back " : "owes ") + esc(fmtM(Math.abs(v), H))}</span></div>`; }).join("")}</div></div>
    <div class="box"><div class="box-h"><h2>Settle up</h2></div>
      ${tx.length ? `<div style="display:grid;gap:8px">${tx.map(x => `<div class="transfer">${avatar(t, x.from)}<b>${esc(personName(t, x.from))}</b><span class="muted">pays</span><b>${esc(personName(t, x.to))}</b><span class="amt num">${esc(fmtM(x.amount, H))}</span>
        <button class="btn sm" data-act="settle" data-from="${esc(x.from)}" data-to="${esc(x.to)}" data-amount="${x.amount}">Mark paid</button></div>`).join("")}</div>` : `<p class="muted small">Everyone's even. Nice.</p>`}</div></div>`;
}
function expensesBox(t, H) {
  const list = [...S.expenses].sort((a, b) => (b.date || "").localeCompare(a.date || "") || byCreated(a, b));
  let lastDate = "", rows = "";
  for (const e of list) {
    if (e.date !== lastDate) { rows += `<li class="exp-date">${esc(fmtD(e.date))}</li>`; lastDate = e.date; }
    const v = valueIn(e, H);
    const settle = e.category === "settlement";
    const rateTxt = e.currency !== e.homeCurrency ? `<span class="mono">1 ${esc(e.currency)} = ${esc(fmtRate(e.rate))} ${esc(e.homeCurrency)}</span> · ${esc(e.rateManual ? "your rate" : (e.rateSource || "ECB"))}${e.rateDate ? ", " + esc(fmtDL(e.rateDate)) : ""}` : "";
    const rc = mediaUrl(e.receipt);
    rows += `<li class="exp ${settle ? "settle" : ""}" data-act="edit-exp" data-id="${esc(e.id)}">
      <span class="ico">${rc ? `<img src="${esc(rc)}" alt="" loading="lazy" onerror="this.remove()">` : icon(settle ? "settlement" : (CATS.includes(e.category) ? e.category : "other"))}</span>
      <div style="min-width:0"><div class="m">${esc(e.merchant || CAT_LABEL[e.category] || "Expense")}${e.needsReview ? ' <span class="pill warn">Check</span>' : ""}</div>
        <div class="r">${esc(CAT_LABEL[e.category] || "Other")} · paid by ${esc(personName(t, e.paidBy))}${rateTxt ? " · " + rateTxt : ""}</div></div>
      <div class="a num">${esc(fmtM(e.amount, e.currency))}${e.currency !== H ? `<small>${v == null ? "no rate" : esc(fmtM(v, H))}${e.homeCurrency !== H && v != null ? ` (logged ${esc(fmtM(e.homeAmount, e.homeCurrency))})` : ""}</small>` : ""}</div></li>`;
  }
  return `<div class="box"><div class="box-h">${icon("receipt")}<h2>Expenses</h2><span class="muted small">${S.expenses.length}</span>
      <button class="btn sm" data-act="add-exp">${icon("plus")}Add</button><button class="btn sm primary" data-act="scan">${icon("camera")}Scan</button></div>
    ${list.length ? `<ul class="exp-list">${rows}</ul>` : `<div class="empty">${icon("receipt")}<p>No expenses yet. Scan a receipt or add one by hand, in any currency.</p></div>`}</div>`;
}

/* ----- photos ----- */
function photosTab(t) {
  const days = tripDays(t);
  const list = sortedPhotos();
  return `<div class="box"><div class="box-h">${icon("photo")}<h2>Photos</h2><span class="muted small">${S.photos.length}</span></div>
    <div class="drop" id="drop">${icon("upload")}<p style="margin:6px 0 10px"><b>Drop photos here</b> or pick several at once</p>
      <label class="btn primary">${icon("photo")}Choose photos<input type="file" id="photo-input" accept="image/*" multiple hidden></label></div>
    <div class="filter-row" style="margin:14px 0 10px"><button class="chip" aria-pressed="${S.photoDay === "all"}" data-act="photo-day" data-day="all">All</button>
      ${days.map((d, i) => `<button class="chip" aria-pressed="${S.photoDay === d}" data-act="photo-day" data-day="${d}">Day ${i + 1}</button>`).join("")}</div>
    ${list.length ? `<div class="gallery">${list.map(p => `<button class="ph" data-act="lightbox" data-id="${esc(p.id)}" aria-label="${esc(p.caption || "Photo")}"><img src="${esc(mediaUrl(p.path))}" alt="${esc(p.caption)}" loading="lazy">${p.path === t.cover ? '<span class="cov">Cover</span>' : ""}${p.caption ? `<span class="cap">${esc(p.caption)}</span>` : ""}</button>`).join("")}</div>`
      : `<div class="empty">${icon("photo")}<p>${S.photos.length ? "No photos tagged to this day yet." : "Your trip photos will live here. Tag them to a day and pick a favourite as the cover."}</p></div>`}</div>`;
}
function sortedPhotos() {
  return S.photos.filter(p => S.photoDay === "all" || p.day === S.photoDay).sort((a, b) => (a.day || "").localeCompare(b.day || "") || String(a.createdAt || "").localeCompare(String(b.createdAt || "")));
}

/* ----- extras ----- */
function extrasTab(t) {
  const pack = t.packing || [];
  const done = pack.filter(p => p.done).length, pct = pack.length ? done / pack.length * 100 : 0;
  const groups = {}; for (const p of pack) (groups[p.cat || "Other"] ||= []).push(p);
  const packBox = `<div class="box"><div class="box-h">${icon("bag")}<h2>Packing</h2><span class="muted small num">${done}/${pack.length}</span>
      <button class="btn ghost sm" data-act="pack-template">${pack.length ? "Add starter items" : "Use starter list"}</button></div>
    ${pack.length ? `<div class="bar"><i style="width:${pct}%"></i></div><p class="hint">${pct === 100 ? "All packed. Bon voyage!" : pct > 60 ? "Nearly there, zip it up soon." : "Plenty of time. Or is there?"}</p>` : ""}
    ${Object.entries(groups).map(([g, arr]) => `<div class="pack-cat">${esc(g)}</div>${arr.map(p => `<div class="check"><input type="checkbox" id="pk-${esc(p.id)}" data-act="pack-toggle" data-id="${esc(p.id)}" ${p.done ? "checked" : ""}><label class="bx" for="pk-${esc(p.id)}"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></label><label class="lbl" for="pk-${esc(p.id)}">${esc(p.text)}</label><button class="icon-btn" data-act="pack-del" data-id="${esc(p.id)}" aria-label="Remove ${esc(p.text)}">${icon("x")}</button></div>`).join("")}`).join("")}
    ${!pack.length ? `<p class="muted small">Start from the starter list or add your own items.</p>` : ""}
    <form class="row" data-form="pack" style="margin-top:12px;grid-template-columns:minmax(0,2fr) minmax(0,1fr) auto">
      <input class="inp" id="pack-text" name="text" placeholder="Add an item" required>
      <input class="inp" id="pack-cat" name="cat" placeholder="Group" list="pack-cats"><datalist id="pack-cats">${Object.keys(PACK_TEMPLATE).map(k => `<option value="${k}">`).join("")}</datalist>
      <button class="btn" type="submit">${icon("plus")}Add</button></form></div>`;
  const bk = t.bookings || [];
  const bkBox = `<div class="box"><div class="box-h">${icon("star")}<h2>Bookings</h2><button class="btn sm" data-act="add-booking">${icon("plus")}Add</button></div>
    ${bk.length ? bk.map(b => `<div class="booking"><span class="typ">${icon(TYPES.includes(b.kind) ? b.kind : "other")}</span>
      <div style="min-width:0"><b>${esc(b.title)}</b><div class="muted small">${esc([b.when ? fmtD(b.when) : "", b.notes].filter(Boolean).join(" · "))}</div>
      ${b.code ? `<div style="margin-top:4px;display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span class="code">${esc(b.code)}</span><button class="btn ghost sm copy-btn" data-act="copy" data-text="${esc(b.code)}">${icon("copy")}Copy</button></div>` : ""}</div>
      <button class="icon-btn" data-act="edit-booking" data-id="${esc(b.id)}" aria-label="Edit booking">${icon("edit")}</button></div>`).join("") : `<p class="muted small">Keep flight, hotel and tour confirmation codes here, one tap to copy at the check-in desk.</p>`}</div>`;
  const notesBox = `<div class="box"><div class="box-h">${icon("edit")}<h2>Notes</h2><span class="save-state" id="notes-state"></span></div>
    <textarea class="notes" id="notes" placeholder="Visa info, phrases, wifi passwords, that ramen place your cousin mentioned…">${esc(t.notes || "")}</textarea></div>`;
  return `<div class="grid2">${packBox}<div style="display:grid;gap:18px;align-content:start;min-width:0">${bkBox}${notesBox}</div></div>`;
}

/* ---------- after render: wire non-click inputs ---------- */
let notesTimer = null;
function afterRender() {
  const notes = $("#notes");
  if (notes) notes.oninput = () => {
    $("#notes-state").textContent = "Typing…";
    clearTimeout(notesTimer);
    notesTimer = setTimeout(async () => {
      const t = tripRef(); if (!t) return; t.notes = notes.value;
      try { await write("trips/" + t.id, () => run(sb.from("trips").update({ notes: notes.value }).eq("id", t.id))); $("#notes-state") && ($("#notes-state").textContent = "Saved"); } catch {}
    }, 800);
  };
  const drop = $("#drop"), pin = $("#photo-input");
  if (pin) pin.onchange = () => { uploadPhotos([...pin.files]); pin.value = ""; };
  if (drop) {
    drop.ondragover = e => { e.preventDefault(); drop.classList.add("over"); };
    drop.ondragleave = () => drop.classList.remove("over");
    drop.ondrop = e => { e.preventDefault(); drop.classList.remove("over"); uploadPhotos([...e.dataTransfer.files]); };
  }
}

/* ---------- actions ---------- */
const ACT = {
  open: b => openTrip(b.dataset.id),
  home: () => closeTrip(),
  retry: () => startSession(),
  "sign-out": async () => { await sb.auth.signOut(); },
  tab: b => { S.tab = b.dataset.tab; render(); window.scrollTo({ top: Math.min(window.scrollY, 180) }); },
  jump: b => $("#day-" + b.dataset.day)?.scrollIntoView({ behavior: "smooth", block: "start" }),
  "new-trip": () => tripSheet(null),
  "edit-trip": () => tripSheet(tripRef()),
  "add-item": b => itemSheet({ day: b.dataset.day }),
  "edit-item": b => { const it = S.items.find(x => x.id === b.dataset.id); if (it) itemSheet(it); },
  "schedule-idea": b => { const x = (tripRef().ideas || []).find(i => i.id === b.dataset.id); if (x) itemSheet({ title: x.title, place: x.place, type: x.type || "sightseeing", notes: x.notes, fromIdea: x.id, day: defaultDay() }); },
  "del-idea": b => updTrip({ ideas: (tripRef().ideas || []).filter(i => i.id !== b.dataset.id) }),
  "add-exp": () => expenseSheet({}),
  "edit-exp": b => { const e = S.expenses.find(x => x.id === b.dataset.id); if (e) expenseSheet({ expense: e }); },
  scan: () => expenseSheet({ scan: true }),
  settle: b => recordSettlement(b.dataset.from, b.dataset.to, Number(b.dataset.amount)),
  "photo-day": b => { S.photoDay = b.dataset.day; render(); },
  lightbox: b => lightbox(b.dataset.id),
  "pack-toggle": b => { const t = tripRef(); updTrip({ packing: (t.packing || []).map(p => p.id === b.dataset.id ? { ...p, done: b.checked } : p) }); },
  "pack-del": b => { const t = tripRef(); updTrip({ packing: (t.packing || []).filter(p => p.id !== b.dataset.id) }); },
  "pack-template": () => {
    const t = tripRef(), have = new Set((t.packing || []).map(p => p.text.toLowerCase()));
    const add = []; for (const [cat, arr] of Object.entries(PACK_TEMPLATE)) for (const text of arr) if (!have.has(text.toLowerCase())) add.push({ id: uid(), text, cat, done: false });
    if (!add.length) return toast("You already have every starter item.");
    updTrip({ packing: [...(t.packing || []), ...add] }); toast(`Added ${add.length} starter items`);
  },
  "add-booking": () => bookingSheet(null),
  "edit-booking": b => bookingSheet((tripRef().bookings || []).find(x => x.id === b.dataset.id)),
  copy: async b => {
    const txt = b.dataset.text;
    try { await navigator.clipboard.writeText(txt); b.classList.add("done"); b.innerHTML = icon("check") + "Copied"; setTimeout(() => { b.classList.remove("done"); b.innerHTML = icon("copy") + "Copy"; }, 1600); }
    catch { const code = b.parentElement.querySelector(".code"); if (code) { const r = document.createRange(); r.selectNodeContents(code); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } toast("Code selected. Press copy on your keyboard."); }
  }
};
document.addEventListener("click", e => {
  if (e.target.closest("[data-stop]")) return;
  const b = e.target.closest("[data-act]");
  if (!b || b.tagName === "INPUT") return;
  ACT[b.dataset.act]?.(b, e);
});
document.addEventListener("change", e => { const b = e.target; if (b.matches?.("input[data-act]")) ACT[b.dataset.act]?.(b, e); });
document.addEventListener("submit", e => {
  const f = e.target.closest("form[data-form]"); if (!f) return; e.preventDefault();
  const t = tripRef(), fd = Object.fromEntries(new FormData(f));
  if (f.dataset.form === "idea") updTrip({ ideas: [...(t.ideas || []), { id: uid(), title: fd.title.trim(), place: fd.place.trim(), type: "sightseeing", notes: "" }] });
  if (f.dataset.form === "pack") updTrip({ packing: [...(t.packing || []), { id: uid(), text: fd.text.trim(), cat: fd.cat.trim() || "Other", done: false }] });
  f.reset(); document.activeElement?.blur();
});
function defaultDay() { const t = tripRef(), td = today(); return td >= t.start && td <= t.end ? td : t.start; }

/* ---------- trip open/close ---------- */
async function openTrip(id) {
  if (!S.trips[id]) return;
  S.tripId = id; S.items = []; S.expenses = []; S.photos = []; S.photoDay = "all";
  try { history.replaceState(null, "", "#" + id); } catch {}
  render(); window.scrollTo(0, 0);
  try { await loadChildren(id); } catch {}
  scheduleRender();
}
function closeTrip() {
  S.tripId = null; S.items = []; S.expenses = []; S.photos = [];
  try { history.replaceState(null, "", location.pathname + location.search); } catch {}
  render(); window.scrollTo(0, 0);
}

/* ---------- sheets ---------- */
let sheetClose = null;
function openSheet(html, mount, onClose) {
  closeSheet();
  const layer = $("#layer");
  layer.innerHTML = `<div class="scrim" id="scrim"><div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div></div>`;
  const scrim = $("#scrim");
  scrim.addEventListener("mousedown", e => { if (e.target === scrim) closeSheet(); });
  $$("[data-close]", scrim).forEach(b => b.onclick = () => closeSheet());
  sheetClose = onClose || null;
  document.body.style.overflow = "hidden";
  mount?.(scrim.querySelector(".sheet"));
  setTimeout(() => scrim.querySelector("[autofocus]")?.focus(), 50);
}
function closeSheet() { const f = sheetClose; sheetClose = null; f?.(); $("#layer").innerHTML = ""; document.body.style.overflow = ""; if (renderPending) { renderPending = false; render(); } }
document.addEventListener("keydown", e => { if (e.key === "Escape") { if ($("#picker")) $("#picker").remove(); else if ($(".lightbox")) closeLightbox(); else if ($("#scrim")) closeSheet(); } });
const sheetHead = title => `<div class="sheet-h"><h2>${esc(title)}</h2><button class="icon-btn" data-close aria-label="Close">${icon("x")}</button></div>`;
const curOptions = sel => CURRENCIES.map(([c, n]) => `<option value="${c}" ${c === sel ? "selected" : ""}>${c} · ${esc(n)}</option>`).join("");

/* Searchable currency picker, layered over the sheet */
function pickCurrency(current, onPick) {
  const el = document.createElement("div");
  el.className = "scrim"; el.id = "picker"; el.style.zIndex = 55;
  const tbl = tableOn(today());
  el.innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-label="Choose currency"><div class="grab"></div>${sheetHead("Convert into")}
    <input class="inp" id="cur-search" placeholder="Search: SGD, yen, euro…" autocomplete="off"><ul class="picker-list" id="cur-list"></ul></div>`;
  document.body.appendChild(el);
  const list = $("#cur-list", el), inp = $("#cur-search", el);
  const draw = () => {
    const q = inp.value.trim().toLowerCase();
    const rows = CURRENCIES.filter(([c, n]) => !q || c.toLowerCase().includes(q) || n.toLowerCase().includes(q));
    list.innerHTML = rows.map(([c, n]) => `<li><button data-code="${c}" aria-selected="${c === current}"><b>${c}</b><span>${esc(n)}</span>${c !== "EUR" && tbl && !tbl.rates[c] ? '<span class="no-rate">enter rate yourself</span>' : ""}</button></li>`).join("") || `<li class="muted small" style="padding:10px">No currency matches “${esc(inp.value)}”.</li>`;
  };
  draw();
  inp.oninput = draw;
  inp.onkeydown = e => { if (e.key === "Enter") { const f = list.querySelector("button"); f?.click(); } };
  list.onclick = e => { const b = e.target.closest("button[data-code]"); if (!b) return; el.remove(); onPick(b.dataset.code); };
  el.addEventListener("mousedown", e => { if (e.target === el) el.remove(); });
  $("[data-close]", el).onclick = () => el.remove();
  setTimeout(() => inp.focus(), 50);
}

/* ----- trip form ----- */
function tripSheet(t) {
  const isNew = !t;
  const v = t || { name: "", destination: "", start: addDays(today(), 30), end: addDays(today(), 34), homeCurrency: "SGD", localCurrency: "SGD", budget: "", people: [{ id: "me", name: "You" }], scanDefault: "" };
  openSheet(`${sheetHead(isNew ? "Plan a new trip" : "Edit trip")}
    <form class="form" id="trip-form">
      <label class="field"><span>Trip name</span><input class="inp" id="tf-name" name="name" required value="${esc(v.name)}" placeholder="Seoul autumn leaves" autofocus></label>
      <label class="field"><span>Destination</span><input class="inp" id="tf-dest" name="destination" required value="${esc(v.destination)}" placeholder="Seoul, South Korea"></label>
      <div class="row"><label class="field"><span>Start</span><input class="inp" type="date" id="tf-start" name="start" required value="${esc(v.start)}"></label>
        <label class="field"><span>End</span><input class="inp" type="date" id="tf-end" name="end" required value="${esc(v.end)}"></label></div>
      <div class="row"><label class="field"><span>Home currency</span><select class="inp" id="tf-home" name="homeCurrency">${curOptions(v.homeCurrency || "SGD")}</select></label>
        <label class="field"><span>Local currency</span><select class="inp" id="tf-local" name="localCurrency">${curOptions(v.localCurrency || v.homeCurrency || "SGD")}</select></label></div>
      ${!isNew ? `<p class="hint">Changing the home currency doesn't re-convert past expenses. They keep the rate from the day you logged them, and totals cross over using that day's rates.</p>` : ""}
      <div class="row"><label class="field"><span>Budget (home currency)</span><input class="inp num" type="number" min="0" step="any" id="tf-budget" name="budget" value="${esc(v.budget ?? "")}" placeholder="3000"></label>
        <label class="field"><span>Receipt scans convert into</span><select class="inp" id="tf-scan" name="scanDefault"><option value="">Last used (default SGD)</option>${curOptions(v.scanDefault)}</select></label></div>
      <label class="field"><span>Travellers</span><input class="inp" id="tf-people" name="people" value="${esc((v.people || []).map(p => p.name).join(", "))}" placeholder="You, Mei, Jun"><span class="hint">Comma-separated. The first person is you.</span></label>
      ${!isNew ? `<div id="del-zone"><button type="button" class="btn ghost danger sm" id="tf-del">${icon("trash")}Delete trip</button></div>` : ""}
      <div class="sheet-foot"><button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">${isNew ? "Create trip" : "Save changes"}</button></div>
    </form>`, sheet => {
    const f = $("#trip-form", sheet);
    f.onsubmit = async e => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(f));
      if (fd.end < fd.start) return toast("The trip ends before it starts. Check the dates.");
      const old = v.people || [];
      const names = fd.people.split(",").map(s => s.trim()).filter(Boolean);
      const people = (names.length ? names : ["You"]).map((n, i) => old.find(p => p.name === n) || (i === 0 && old[0] ? { ...old[0], name: n } : { id: uid(), name: n }));
      const data = { name: fd.name.trim(), destination: fd.destination.trim(), start: fd.start, end: fd.end, homeCurrency: fd.homeCurrency, localCurrency: fd.localCurrency, budget: fd.budget === "" ? null : Number(fd.budget), scanDefault: fd.scanDefault, people };
      try {
        if (isNew) {
          const id = uid();
          await setRow("trips", { id, ...data, cover: null, ideas: [], packing: [], bookings: [], notes: "" });
          closeSheet(); S.trips[id] = { id, ...data, ideas: [], packing: [], bookings: [], notes: "" }; S.tab = "plan"; openTrip(id); soon();
          toast("Trip created. Time to fill in the days!");
        } else { closeSheet(); await updTrip(data); toast("Trip updated"); }
      } catch {}
    };
    const del = $("#tf-del", sheet);
    if (del) del.onclick = () => {
      $("#del-zone", sheet).innerHTML = `<div class="confirm-row"><span>Delete this trip with its itinerary, expenses and photos?</span><button type="button" class="btn sm" id="del-no">Keep it</button><button type="button" class="btn sm primary" id="del-yes">Delete</button></div>`;
      $("#del-no", sheet).onclick = () => tripSheet(t);
      $("#del-yes", sheet).onclick = () => deleteTrip(t);
    };
  });
}
async function deleteTrip(t) {
  closeSheet();
  const paths = [...S.photos.map(p => p.path), ...S.expenses.map(e => e.receipt)];
  closeTrip();
  try {
    await delRow("trips", t.id); // items, expenses and photo rows go with it
    removeMedia(paths);
    delete S.trips[t.id]; render();
    toast("Trip deleted");
  } catch {}
}

/* ----- itinerary item form ----- */
function itemSheet(it) {
  const t = tripRef(), isNew = !it.id, days = tripDays(t), H = t.homeCurrency || "SGD";
  const v = { time: "", title: "", place: "", type: "sightseeing", cost: "", currency: t.localCurrency || H, notes: "", ...it };
  openSheet(`${sheetHead(isNew ? "Add to itinerary" : "Edit plan")}
    <form class="form" id="item-form">
      <div class="seg" role="radiogroup" aria-label="Type">${TYPES.map(k => `<label><input type="radio" name="type" value="${k}" ${v.type === k ? "checked" : ""}><span>${icon(k)}${TYPE_LABEL[k]}</span></label>`).join("")}</div>
      <label class="field"><span>What</span><input class="inp" id="if-title" name="title" required value="${esc(v.title)}" placeholder="Lunch at Nishiki Market" autofocus></label>
      <label class="field"><span>Where</span><input class="inp" id="if-place" name="place" value="${esc(v.place)}" placeholder="Name or address, opens in Google Maps"></label>
      <div class="row"><label class="field"><span>Day</span><select class="inp" id="if-day" name="day">${days.map((d, i) => `<option value="${d}" ${d === v.day ? "selected" : ""}>Day ${i + 1} · ${esc(fmtD(d))}</option>`).join("")}</select></label>
        <label class="field"><span>Time</span><input class="inp" type="time" id="if-time" name="time" value="${esc(v.time)}"></label></div>
      <div class="row"><label class="field"><span>Cost</span><input class="inp num" type="number" min="0" step="any" id="if-cost" name="cost" value="${esc(v.cost ?? "")}" placeholder="0"></label>
        <label class="field"><span>Currency</span><select class="inp" id="if-cur" name="currency">${curOptions(v.currency)}</select></label></div>
      <label class="field"><span>Notes</span><textarea class="inp" id="if-notes" name="notes" rows="2" placeholder="Book ahead, cash only, etc.">${esc(v.notes)}</textarea></label>
      ${v.expenseId ? `<p class="hint">✓ This cost is logged in Money. Edit the amount there.</p>` : `<label class="check" style="padding:0"><input type="checkbox" id="if-exp" name="asExpense"><span class="bx"><svg viewBox="0 0 24 24"><path d="M5 12l5 5L20 7"/></svg></span><span class="lbl">Also log this cost as an expense (paid by ${esc(personName(t, t.people?.[0]?.id))})</span></label>`}
      <div id="del-zone"></div>
      <div class="sheet-foot">${!isNew ? `<button type="button" class="btn ghost danger grow" id="if-del">${icon("trash")}Delete</button>` : ""}<button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">${isNew ? "Add" : "Save"}</button></div>
    </form>`, sheet => {
    const f = $("#item-form", sheet);
    f.onsubmit = async e => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(f));
      const id = v.id || uid();
      const data = { id, tripId: t.id, day: fd.day, time: fd.time, title: fd.title.trim(), place: fd.place.trim(), type: fd.type, cost: fd.cost === "" ? null : Number(fd.cost), currency: fd.currency, notes: fd.notes.trim(), expenseId: v.expenseId || null };
      closeSheet();
      try {
        if (fd.asExpense && data.cost) {
          const expId = uid();
          const amt = data.cost, cur = data.currency, date = data.day <= today() ? data.day : today();
          const r = await getRate(cur, H, date);
          await setRow("expenses", { id: expId, tripId: t.id, date: data.day, merchant: data.title, amount: amt, currency: cur, homeCurrency: H, rate: r?.rate ?? null, rateSource: r?.source || null, rateDate: r?.date || null, rateFetchedAt: r?.fetchedAt || null, rateManual: false, homeAmount: r ? round2(amt * r.rate) : null, category: TYPE_CAT[data.type] || "other", paidBy: t.people?.[0]?.id || null, splitAmong: (t.people || []).map(p => p.id), receipt: null, itemId: id, needsReview: !r });
          data.expenseId = expId;
          if (!r) toast("Logged, but no saved rate covers that currency. Add the rate in Money.");
        }
        await setRow("items", data);
        if (v.fromIdea) updTrip({ ideas: (t.ideas || []).filter(i => i.id !== v.fromIdea) });
        soon();
        toast(isNew ? `Added to ${fmtD(data.day)}` : "Saved");
      } catch {}
    };
    const del = $("#if-del", sheet);
    if (del) del.onclick = () => {
      $("#del-zone", sheet).innerHTML = `<div class="confirm-row"><span>Remove “${esc(v.title)}” from the plan?</span><button type="button" class="btn sm primary" id="del-yes">Remove</button></div>`;
      $("#del-yes", sheet).onclick = () => { closeSheet(); delRow("items", v.id).then(() => toast("Removed")).catch(() => {}); };
    };
  });
}

/* ----- booking form ----- */
function bookingSheet(b) {
  const t = tripRef(), isNew = !b;
  const v = b || { kind: "stay", title: "", code: "", when: t.start, notes: "" };
  openSheet(`${sheetHead(isNew ? "Add booking" : "Edit booking")}
    <form class="form" id="bk-form">
      <div class="seg">${TYPES.filter(k => k !== "food" && k !== "shopping").concat("other").map(k => `<label><input type="radio" name="kind" value="${k}" ${v.kind === k ? "checked" : ""}><span>${icon(k)}${TYPE_LABEL[k] || "Other"}</span></label>`).join("")}</div>
      <label class="field"><span>What</span><input class="inp" id="bf-title" name="title" required value="${esc(v.title)}" placeholder="SQ634 Singapore → Tokyo" autofocus></label>
      <div class="row"><label class="field"><span>Confirmation code</span><input class="inp mono" id="bf-code" name="code" value="${esc(v.code)}" placeholder="ABC123"></label>
        <label class="field"><span>Date</span><input class="inp" type="date" id="bf-when" name="when" value="${esc(v.when)}"></label></div>
      <label class="field"><span>Notes</span><input class="inp" id="bf-notes" name="notes" value="${esc(v.notes)}" placeholder="Seat 42A, check-in from 3pm"></label>
      <div class="sheet-foot">${!isNew ? `<button type="button" class="btn ghost danger grow" id="bf-del">${icon("trash")}Delete</button>` : ""}<button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit">Save</button></div>
    </form>`, sheet => {
    const f = $("#bk-form", sheet);
    f.onsubmit = e => {
      e.preventDefault();
      const fd = Object.fromEntries(new FormData(f));
      const nb = { id: v.id || uid(), kind: fd.kind, title: fd.title.trim(), code: fd.code.trim(), when: fd.when, notes: fd.notes.trim() };
      const list = (t.bookings || []).filter(x => x.id !== nb.id).concat(nb).sort((a, b) => (a.when || "").localeCompare(b.when || ""));
      closeSheet(); updTrip({ bookings: list }).then(() => toast("Booking saved"));
    };
    const del = $("#bf-del", sheet);
    if (del) del.onclick = () => { closeSheet(); updTrip({ bookings: (t.bookings || []).filter(x => x.id !== v.id) }); };
  });
}

/* ----- expense form & receipt scanner ----- */
function convertTarget(t) {
  const p = S.prefs || {};
  return (p.lastConvertByTrip || {})[t.id] || t.scanDefault || p.lastConvert || "SGD";
}
function expenseSheet({ expense, scan }) {
  const t = tripRef(), H = t.homeCurrency || "SGD", ids = (t.people || []).map(p => p.id);
  const isNew = !expense;
  const lastPayer = [...S.expenses].sort(byCreated)[0]?.paidBy;
  const e = expense ? clone(expense) : { date: defaultDay() > today() ? today() : defaultDay(), merchant: "", amount: "", currency: t.localCurrency || H, homeCurrency: scan ? convertTarget(t) : H, category: "food", paidBy: ids[0] || null, splitAmong: ids, receipt: null, note: "" };
  const st = { e, rate: e.rate ?? null, info: e.rateSource ? { source: e.rateSource, date: e.rateDate, fetchedAt: e.rateFetchedAt } : null, manual: !!e.rateManual, file: null, prepared: null, upload: null, scanMs: null, touched: new Set(), reqId: 0, started: Date.now() };
  const showPick = scan && !e.receipt;
  const peopleSeg = (name, type, sel) => (t.people || []).map(p => `<label><input type="${type}" name="${name}" value="${esc(p.id)}" ${sel.includes(p.id) ? "checked" : ""}><span>${esc(p.name)}</span></label>`).join("");
  const rcUrl = mediaUrl(e.receipt);
  openSheet(`${sheetHead(scan ? "Scan a receipt" : isNew ? "Add expense" : "Edit expense")}
    <div class="form">
      <div id="rc-zone">${showPick ? `<div class="rc-pick">
          <label>${icon("camera")}Take photo<input type="file" accept="image/*" capture="environment" id="rc-cam"></label>
          <label>${icon("upload")}Upload<input type="file" accept="image/*" id="rc-file"></label></div>` : rcUrl ? `<div class="rc-preview"><img src="${esc(rcUrl)}" alt="Receipt"><div class="muted small">Receipt attached</div></div>` : ""}</div>
      <form class="form" id="exp-form">
        <div class="row"><label class="field"><span>Merchant</span><input class="inp" id="ef-merchant" name="merchant" value="${esc(e.merchant)}" placeholder="Ichiran Shibuya"></label>
          <label class="field"><span>Date</span><input class="inp" type="date" id="ef-date" name="date" value="${esc(e.date)}"></label></div>
        <div class="row"><label class="field"><span>Total</span><input class="inp num" type="number" min="0" step="any" id="ef-amount" name="amount" value="${esc(e.amount)}" placeholder="0" required ${scan ? "" : "autofocus"}></label>
          <label class="field"><span>Paid in</span><select class="inp" id="ef-cur" name="currency">${curOptions(e.currency)}</select></label></div>
        <div class="conv" id="conv">
          <div class="field"><span>Convert into</span><button type="button" class="inp cur-btn" id="ef-to"><span><b>${esc(e.homeCurrency)}</b> · ${esc(CUR_NAME[e.homeCurrency] || "")}</span>${icon("next")}</button></div>
          <div class="out num" id="conv-out">—</div>
          <div class="rate-line" id="rate-line">Enter a total to convert.</div>
          <div class="rate-edit"><label for="ef-rate">Rate</label><input class="inp num" type="number" step="any" min="0" id="ef-rate" value="${st.rate ?? ""}"><button type="button" class="btn ghost sm" id="ef-refetch">Use saved rate</button></div>
        </div>
        <div class="field"><span>Category</span><div class="seg">${CATS.map(c => `<label><input type="radio" name="category" value="${c}" ${e.category === c ? "checked" : ""}><span>${icon(c)}${CAT_LABEL[c]}</span></label>`).join("")}${e.category === "settlement" ? `<label><input type="radio" name="category" value="settlement" checked><span>${CAT_LABEL.settlement}</span></label>` : ""}</div></div>
        ${(t.people || []).length > 1 ? `<div class="field"><span>Paid by</span><div class="seg">${peopleSeg("paidBy", "radio", [e.paidBy])}</div></div>
          <div class="field"><span>Split between</span><div class="seg">${peopleSeg("splitAmong", "checkbox", e.splitAmong?.length ? e.splitAmong : ids)}</div></div>` : ""}
        <div id="del-zone"></div>
        <div class="sheet-foot">${!isNew ? `<button type="button" class="btn ghost danger grow" id="ef-del">${icon("trash")}Delete</button>` : `<span class="muted small grow" id="ef-timer"></span>`}<button type="button" class="btn" data-close>Cancel</button><button class="btn primary" type="submit" id="ef-save">Save expense</button></div>
      </form></div>`, sheet => {
    const f = $("#exp-form", sheet);
    const fld = n => f.elements[n];
    ["merchant", "date", "amount", "currency"].forEach(n => fld(n).addEventListener("input", () => st.touched.add(n)));

    const paint = () => {
      const amt = Number(fld("amount").value), from = fld("currency").value, to = st.e.homeCurrency;
      $("#ef-to", sheet).innerHTML = `<span><b>${esc(to)}</b> · ${esc(CUR_NAME[to] || "")}</span>${icon("next")}`;
      $("#conv-out", sheet).textContent = amt && st.rate ? fmtM(amt * st.rate, to) : "—";
      let line;
      if (from === to) line = "Same currency, no conversion needed.";
      else if (!st.rate) line = navigator.onLine ? `No rate found for ${from} → ${to}. Type the rate above.` : "You're offline. Type a rate, or save and we'll use the latest saved rate.";
      else if (st.manual) line = `1 ${from} = ${fmtRate(st.rate)} ${to} · your rate`;
      else {
        const i = st.info || {};
        const fetched = i.fetchedAt ? new Date(i.fetchedAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
        line = `1 ${from} = ${fmtRate(st.rate)} ${to} · ${i.source || "ECB"}, ${fmtDL(i.date)}${fetched ? ` · fetched ${fetched}` : ""}`;
        if (i.date && fld("date").value && diffDays(i.date, fld("date").value) > 4) line += " · latest available rate";
      }
      $("#rate-line", sheet).textContent = line;
      if (!st.manual || $("#ef-rate", sheet) !== document.activeElement) $("#ef-rate", sheet).value = st.rate ? fmtRate(st.rate) : "";
      $("#ef-refetch", sheet).hidden = !st.manual;
    };
    const lookup = async () => {
      if (st.manual) return paint();
      const from = fld("currency").value, to = st.e.homeCurrency, date = fld("date").value || today();
      const my = ++st.reqId;
      $("#rate-line", sheet).textContent = "Getting the rate…";
      const r = await getRate(from, to, date > today() ? today() : date);
      if (my !== st.reqId) return;
      st.rate = r?.rate ?? null; st.info = r;
      paint();
    };
    fld("amount").addEventListener("input", paint);
    fld("currency").addEventListener("change", () => { st.manual = false; lookup(); });
    fld("date").addEventListener("change", () => { if (!st.manual) lookup(); });
    $("#ef-rate", sheet).addEventListener("input", ev => { const n = Number(ev.target.value); st.manual = n > 0; st.rate = n > 0 ? n : null; paint(); });
    $("#ef-refetch", sheet).onclick = () => { st.manual = false; lookup(); };
    $("#ef-to", sheet).onclick = () => pickCurrency(st.e.homeCurrency, code => { st.e.homeCurrency = code; st.manual = false; lookup(); });
    if (expense && st.rate) paint(); else lookup();

    /* receipt handling */
    const onFile = async file => {
      if (!file) return;
      st.file = file; st.started = Date.now();
      const url = URL.createObjectURL(file);
      $("#rc-zone", sheet).innerHTML = `<div class="rc-preview"><img src="${url}" alt="Receipt"><div><div class="scan-state" id="scan-state"><span class="spinner"></span>Preparing photo…</div><div class="muted small" id="scan-sub">Check every field before saving.</div></div></div>`;
      try { st.prepared = await downscale(file, 1600, 0.85); } catch { st.prepared = file; }
      if (!navigator.onLine) {
        $("#scan-state", sheet).innerHTML = icon("cloud-off") + "You're offline";
        $("#scan-sub", sheet).textContent = "Save now and this receipt will be read and converted when you're back online.";
        $("#ef-save", sheet).textContent = "Save for later";
        return;
      }
      st.upload = uploadMedia(st.prepared, t.id, "receipts").catch(err => { st.uploadErr = err; return null; });
      $("#scan-state", sheet).innerHTML = `<span class="spinner"></span>Reading receipt…`;
      const t0 = performance.now();
      try {
        const r = await readReceipt(st.prepared, t);
        st.scanMs = performance.now() - t0;
        applyScan(r);
        $("#scan-state", sheet).innerHTML = icon("check") + `Read in ${(st.scanMs / 1000).toFixed(1)} s`;
        $("#scan-sub", sheet).textContent = "Suggested fields are filled in. Check them, then save.";
      } catch (err) {
        $("#scan-state", sheet).innerHTML = icon("x") + "Couldn't read it";
        $("#scan-sub", sheet).textContent = scanErr(err);
        fld("amount").focus();
      }
    };
    const applyScan = r => {
      if (!r || typeof r !== "object") return;
      const set = (n, val) => { if (val == null || val === "" || st.touched.has(n)) return; fld(n).value = val; fld(n).closest(".field")?.classList.add("flash"); };
      set("merchant", typeof r.merchant === "string" ? r.merchant.slice(0, 80) : null);
      if (/^\d{4}-\d{2}-\d{2}$/.test(r.date || "")) set("date", r.date);
      if (Number(r.total) > 0) set("amount", Number(r.total));
      const cur = String(r.currency || "").toUpperCase();
      if (CUR_NAME[cur] && !st.touched.has("currency")) { fld("currency").value = cur; fld("currency").closest(".field")?.classList.add("flash"); }
      if (CATS.includes(r.category)) { const rb = f.querySelector(`input[name=category][value=${r.category}]`); if (rb) rb.checked = true; }
      const lp = lastPayer && [...f.querySelectorAll("input[name=paidBy]")].find(x => x.value === lastPayer); if (lp) lp.checked = true;
      st.manual = false; lookup();
    };
    $("#rc-cam", sheet)?.addEventListener("change", ev => onFile(ev.target.files[0]));
    $("#rc-file", sheet)?.addEventListener("change", ev => onFile(ev.target.files[0]));
    if (scan) { const tick = setInterval(() => { const el = $("#ef-timer", sheet); if (!el) return clearInterval(tick); if (st.file) el.textContent = `${Math.round((Date.now() - st.started) / 1000)} s`; }, 1000); }

    f.onsubmit = async ev => {
      ev.preventDefault();
      const fd = new FormData(f);
      const amount = Number(fd.get("amount"));
      if (!(amount > 0)) { toast("Add the total amount first."); fld("amount").focus(); return; }
      const from = fd.get("currency"), to = st.e.homeCurrency, date = fd.get("date") || today();
      const doc = {
        id: st.e.id || uid(), tripId: t.id,
        date, merchant: String(fd.get("merchant") || "").trim(), amount, currency: from, homeCurrency: to,
        rate: from === to ? 1 : st.rate, rateSource: from === to ? "Same currency" : st.manual ? "Manual" : (st.info?.source || null),
        rateDate: from === to || st.manual ? date : (st.info?.date || null),
        rateFetchedAt: st.manual ? new Date().toISOString() : (st.info?.fetchedAt || null), rateManual: st.manual,
        category: fd.get("category") || "other",
        paidBy: fd.get("paidBy") || st.e.paidBy || ids[0] || null,
        splitAmong: (t.people || []).length > 1 ? fd.getAll("splitAmong") : ids,
        receipt: st.e.receipt || null, itemId: st.e.itemId || null, note: st.e.note || "", needsReview: false
      };
      doc.homeAmount = doc.rate ? round2(amount * doc.rate) : null;
      if (!doc.rate) doc.needsReview = true;
      if (st.file && !navigator.onLine) { await queueReceipt(t, doc, st.prepared || st.file); closeSheet(); return; }
      const btn = $("#ef-save", sheet); btn.disabled = true;
      if (st.upload) { btn.textContent = "Saving photo…"; const up = await st.upload; if (up) doc.receipt = up; else toast("The photo couldn't be stored, but the expense is saved."); }
      try {
        await setRow("expenses", doc);
        if (scan) rememberConvert(t, to);
        const secs = Math.round((Date.now() - st.started) / 1000);
        closeSheet(); soon();
        toast(isNew ? `Saved ${fmtM(amount, from)}${doc.homeAmount && from !== to ? ` (${fmtM(doc.homeAmount, to)})` : ""}${scan && st.file ? ` in ${secs} s` : ""}` : "Expense updated");
      } catch { btn.disabled = false; btn.textContent = "Save expense"; }
    };
    const del = $("#ef-del", sheet);
    if (del) del.onclick = () => {
      $("#del-zone", sheet).innerHTML = `<div class="confirm-row"><span>Delete this expense${e.receipt ? " and its receipt photo" : ""}?</span><button type="button" class="btn sm primary" id="del-yes">Delete</button></div>`;
      $("#del-yes", sheet).onclick = async () => {
        closeSheet();
        try {
          await delRow("expenses", e.id);
          removeMedia([e.receipt]);
          const it = S.items.find(x => x.expenseId === e.id); if (it) updRow("items", it.id, { expenseId: null }).catch(() => {});
          toast("Expense deleted");
        } catch {}
      };
    };
  });
}
function rememberConvert(t, code) {
  const p = S.prefs;
  if (p.lastConvert === code && (p.lastConvertByTrip || {})[t.id] === code) return;
  p.lastConvert = code; p.lastConvertByTrip = { ...(p.lastConvertByTrip || {}), [t.id]: code };
  savePrefs();
}
function scanErr(e) {
  switch (e?.code) {
    case "not_configured": return "Receipt reading isn't set up yet. Type the details instead.";
    case "rate_limited": return "Too many scans just now. Type the details, or try again in a minute.";
    case "too_large": case "bad_request": return "That image couldn't be read. Try a JPEG or PNG photo.";
    case "refused": case "unreadable": return "The receipt wasn't readable. Type the details instead.";
    default: return "Something went wrong reading it. Type the details instead.";
  }
}
function blobToDataURL(b) { return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(b); }); }
async function readReceipt(blob, t) {
  const dataUrl = await blobToDataURL(blob);
  const { data, error } = await sb.functions.invoke("scan-receipt", {
    body: { image: dataUrl.split(",")[1], mediaType: blob.type || "image/jpeg", destination: t.destination, start: t.start, end: t.end }
  });
  if (error) { let code = "upstream_error"; try { code = (await error.context.json()).error || code; } catch {} throw { code }; }
  return data;
}
function downscale(file, max, q) {
  return new Promise((res, rej) => {
    const img = new Image(), url = URL.createObjectURL(file);
    img.onload = () => {
      const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
      if (s === 1 && file.type === "image/jpeg" && file.size < 2.5e6) { URL.revokeObjectURL(url); return res(file); }
      const c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      c.toBlob(b => b ? res(b) : rej(new Error("encode")), "image/jpeg", q);
    };
    img.onerror = () => { URL.revokeObjectURL(url); rej(new Error("decode")); };
    img.src = url;
  });
}

/* ----- offline receipt queue (kept on this device until it can be processed) ----- */
async function queueReceipt(t, doc, blob) {
  let small = blob; try { small = await downscale(blob, 1100, 0.72); } catch {}
  const data = await blobToDataURL(small);
  const q = lsGet(queueKey(), []);
  q.push({ id: uid(), tripId: t.id, doc, image: data, queuedAt: Date.now() });
  if (!lsSet(queueKey(), q)) { toast("Not enough space on this device to keep the photo offline. Try again when online."); return; }
  toast("Saved offline. We'll read and convert it when you're back online.");
  scheduleRender();
}
let processing = false;
async function processQueue() {
  if (processing || !navigator.onLine || !S.user) return;
  let q = lsGet(queueKey(), []);
  if (!q.length) return;
  processing = true;
  for (const job of [...q]) {
    const t = S.trips[job.tripId];
    if (!t) continue;
    try {
      const blob = await (await fetch(job.image)).blob();
      const doc = { ...job.doc, id: uid() };
      doc.receipt = await uploadMedia(blob, t.id, "receipts").catch(() => null);
      if (!doc.amount || !doc.merchant) {
        try { const r = await readReceipt(blob, t); if (!doc.merchant && r?.merchant) doc.merchant = String(r.merchant).slice(0, 80); if (!doc.amount && Number(r?.total) > 0) doc.amount = Number(r.total); if (r?.currency && CUR_NAME[String(r.currency).toUpperCase()]) doc.currency = String(r.currency).toUpperCase(); if (/^\d{4}-\d{2}-\d{2}$/.test(r?.date || "")) doc.date = r.date; } catch {}
      }
      if (!doc.rateManual) {
        const rr = await getRate(doc.currency, doc.homeCurrency, doc.date > today() ? today() : doc.date);
        if (rr) Object.assign(doc, { rate: rr.rate, rateSource: rr.source, rateDate: rr.date, rateFetchedAt: rr.fetchedAt });
      }
      doc.homeAmount = doc.rate && doc.amount ? round2(doc.amount * doc.rate) : null;
      doc.needsReview = true;
      await setRow("expenses", doc);
      q = lsGet(queueKey(), []).filter(x => x.id !== job.id); lsSet(queueKey(), q);
      toast(`Offline receipt added${doc.merchant ? ": " + doc.merchant : ""}. Give it a quick check.`);
    } catch { break; }
  }
  processing = false; soon();
}
window.addEventListener("online", () => { S.online = true; scheduleRender(); processQueue(); });
window.addEventListener("offline", () => { S.online = false; scheduleRender(); });

/* ----- settle up ----- */
async function recordSettlement(from, to, amount) {
  const t = tripRef(), H = t.homeCurrency || "SGD";
  try {
    await setRow("expenses", { id: uid(), tripId: t.id, date: today(), merchant: `${personName(t, from)} paid ${personName(t, to)}`, amount, currency: H, homeCurrency: H, rate: 1, rateSource: "Same currency", rateDate: today(), rateFetchedAt: new Date().toISOString(), rateManual: false, homeAmount: amount, category: "settlement", paidBy: from, splitAmong: [to], receipt: null, itemId: null, needsReview: false });
    soon();
    toast(`Recorded: ${personName(t, from)} paid ${personName(t, to)} ${fmtM(amount, H)}`);
  } catch {}
}

/* ----- photos ----- */
async function uploadPhotos(files) {
  const t = tripRef(); if (!t) return;
  const imgs = files.filter(f => f.type.startsWith("image/"));
  if (!imgs.length) return toast("Pick image files (JPEG, PNG, WebP or GIF).");
  const days = tripDays(t);
  let ok = 0, firstPath = null;
  toast(`Uploading ${imgs.length} photo${imgs.length > 1 ? "s" : ""}…`);
  for (const f of imgs) {
    try {
      let blob = f;
      if (f.size > 6e6 || !["image/jpeg", "image/png", "image/webp", "image/gif"].includes(f.type)) blob = await downscale(f, 2600, 0.88);
      const path = await uploadMedia(blob, t.id, "photos");
      const shot = f.lastModified ? ymd(new Date(f.lastModified)) : "";
      const day = S.photoDay !== "all" ? S.photoDay : days.includes(shot) ? shot : null;
      await setRow("photos", { id: uid(), tripId: t.id, path, caption: "", day });
      ok++; firstPath ||= path;
    } catch (e) { toast(/exceeded|too large|size/i.test(e?.message || "") ? `${f.name} is too large (max 20 MB).` : `Couldn't upload ${f.name}.`); }
  }
  if (ok) toast(`${ok} photo${ok > 1 ? "s" : ""} added. Tap one to caption it.`);
  if (firstPath && !t.cover) await updTrip({ cover: firstPath });
  soon();
}
let lbIndex = 0, lbList = [];
function lightbox(id) {
  const t = tripRef();
  lbList = sortedPhotos();
  lbIndex = Math.max(0, lbList.findIndex(p => p.id === id));
  const el = document.createElement("div"); el.className = "lightbox"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
  document.body.appendChild(el); document.body.style.overflow = "hidden";
  const draw = () => {
    const p = lbList[lbIndex]; if (!p) return closeLightbox();
    const days = tripDays(t);
    el.innerHTML = `<div class="lb-top"><span class="small" style="opacity:.75">${lbIndex + 1} / ${lbList.length}</span><span style="flex:1"></span>
        <button class="icon-btn" id="lb-x" aria-label="Close">${icon("x")}</button></div>
      <div class="stage"><img src="${esc(mediaUrl(p.path))}" alt="${esc(p.caption)}">
        ${lbList.length > 1 ? `<button class="icon-btn nav prev" id="lb-prev" aria-label="Previous">${icon("back")}</button><button class="icon-btn nav next" id="lb-next" aria-label="Next">${icon("next")}</button>` : ""}</div>
      <div class="lb-foot"><input class="inp" id="lb-cap" placeholder="Add a caption" value="${esc(p.caption)}">
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center"><select class="inp" id="lb-day" style="width:auto"><option value="">No day</option>${days.map((d, i) => `<option value="${d}" ${p.day === d ? "selected" : ""}>Day ${i + 1} · ${esc(fmtD(d))}</option>`).join("")}</select>
          <button class="btn sm" id="lb-cover">${icon("star")}${t.cover === p.path ? "This is the cover" : "Set as cover"}</button>
          <button class="btn sm" id="lb-full">Full screen</button><span style="flex:1"></span><span id="lb-del-zone"><button class="btn sm" id="lb-del">${icon("trash")}Delete</button></span></div></div>`;
    $("#lb-x", el).onclick = closeLightbox;
    $("#lb-prev", el) && ($("#lb-prev", el).onclick = () => { lbIndex = (lbIndex - 1 + lbList.length) % lbList.length; draw(); });
    $("#lb-next", el) && ($("#lb-next", el).onclick = () => { lbIndex = (lbIndex + 1) % lbList.length; draw(); });
    $("#lb-cap", el).onchange = ev => { p.caption = ev.target.value.trim(); updRow("photos", p.id, { caption: p.caption }).catch(() => {}); };
    $("#lb-day", el).onchange = ev => { p.day = ev.target.value || null; updRow("photos", p.id, { day: p.day }).catch(() => {}); };
    $("#lb-cover", el).onclick = () => { updTrip({ cover: p.path }); toast("Cover photo updated"); draw(); };
    $("#lb-full", el).onclick = () => { el.requestFullscreen?.().catch(() => toast("Full screen isn't available here.")); };
    $("#lb-del", el).onclick = () => {
      $("#lb-del-zone", el).innerHTML = `<button class="btn sm" id="lb-del-yes" style="background:var(--bad);color:#fff">Delete photo</button>`;
      $("#lb-del-yes", el).onclick = async () => {
        try { await delRow("photos", p.id); removeMedia([p.path]); if (t.cover === p.path) updTrip({ cover: null }); lbList.splice(lbIndex, 1); if (lbIndex >= lbList.length) lbIndex = 0; toast("Photo deleted"); draw(); } catch {}
      };
    };
  };
  el.onkeydown = ev => { if (ev.target.tagName === "INPUT") return; if (ev.key === "ArrowLeft") $("#lb-prev", el)?.click(); if (ev.key === "ArrowRight") $("#lb-next", el)?.click(); };
  el.tabIndex = -1; draw(); el.focus();
}
function closeLightbox() { if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); $(".lightbox")?.remove(); document.body.style.overflow = ""; scheduleRender(); }

/* ---------- toasts ---------- */
function toast(msg) {
  const el = document.createElement("div"); el.className = "toast"; el.textContent = msg;
  $("#toasts").appendChild(el); setTimeout(() => el.remove(), 3800);
}

/* ---------- example trips for new accounts ---------- */
async function seedExample() {
  const X = window.TP_EXAMPLE; if (!X) return;
  const td = today(), idMap = {}, newId = old => (idMap[old] ||= uid());
  const trips = [], items = [], exps = [];
  for (const [key, tr] of Object.entries(X.trips)) {
    const [anchor, offset] = X.anchor[key];
    const shift = s => s ? addDays(s, diffDays(anchor, addDays(td, offset))) : s;
    trips.push({ ...clone(tr), id: newId(key), start: shift(tr.start), end: shift(tr.end), bookings: (tr.bookings || []).map(b => ({ ...b, when: shift(b.when) })), cover: null, example: true });
    for (const [iid, it] of Object.entries(X.items[key] || {})) items.push({ ...clone(it), id: newId(iid), tripId: newId(key), day: shift(it.day), expenseId: it.expenseId ? newId(it.expenseId) : null });
    for (const [eid, e] of Object.entries(X.expenses[key] || {})) exps.push({ ...clone(e), id: newId(eid), tripId: newId(key), date: shift(e.date), itemId: e.itemId ? newId(e.itemId) : null });
  }
  await insertRows("trips", trips);
  await Promise.all([insertRows("items", items), insertRows("expenses", exps),
    run(sb.from("rates").upsert(X.rates.map(r => ({ user_id: S.user.id, ...toRow(r) })), { ignoreDuplicates: true }))]);
}

/* ---------- session ---------- */
let started = null;
async function startSession() {
  if (started === S.user.id) return;
  started = S.user.id;
  S.status = "loading"; render();
  try {
    await loadPrefs();
    await loadTrips();
    if (!S.prefs.exampleSeeded) {
      // only the first tab or device to claim the seed loads the examples
      const claimed = await run(sb.rpc("claim_example_seed"));
      S.prefs.exampleSeeded = true;
      if (claimed && !Object.keys(S.trips).length) { await seedExample(); await loadTrips(); }
    }
    await loadRates();
    S.status = "ready";
    subscribeLive();
    const h = location.hash.slice(1);
    if (h && S.trips[h]) openTrip(h); else render();
    processQueue();
  } catch { started = null; S.status = "error"; render(); }
}
function endSession() {
  channel?.unsubscribe(); channel = null; started = null;
  Object.assign(S, { status: "signedout", user: null, trips: {}, tripId: null, items: [], expenses: [], photos: [], rates: {}, prefs: {} });
  for (const k in urlCache) delete urlCache[k];
  closeSheet(); render();
}
sb.auth.onAuthStateChange((event, session) => {
  if (session?.user) { S.user = session.user; setTimeout(startSession, 0); }
  else if (event === "SIGNED_OUT" || event === "INITIAL_SESSION") endSession();
});
render();
