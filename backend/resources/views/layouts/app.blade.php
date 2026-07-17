<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>@yield('title', 'Espace équipe') — Elite Promotion</title>
  <style>
    :root { --teal:#2bbdb0; --bg:#0b0d0e; --surface:#14171a; --line:rgba(255,255,255,.08); --text:#f3f4f1; --muted:rgba(243,244,241,.55); }
    * { box-sizing:border-box; }
    body { margin:0; font-family:system-ui,-apple-system,'Segoe UI',sans-serif; background:var(--bg); color:var(--text); min-height:100vh; }
    a { color:var(--teal); text-decoration:none; }
    header.topbar { display:flex; align-items:center; justify-content:space-between; padding:14px 28px; border-bottom:1px solid var(--line); background:var(--surface); position:sticky; top:0; z-index:10; }
    .brand { font-weight:700; letter-spacing:.14em; text-transform:uppercase; font-size:14px; color:var(--text); }
    .brand span { color:var(--teal); }
    nav.main a { margin-left:22px; font-size:13px; letter-spacing:.08em; text-transform:uppercase; color:var(--muted); }
    nav.main a.active, nav.main a:hover { color:var(--teal); }
    main { max-width:1200px; margin:0 auto; padding:32px 24px 80px; }
    .card { background:var(--surface); border:1px solid var(--line); border-radius:10px; padding:20px; }
    .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:8px; border:none; cursor:pointer; font-size:13px; font-weight:600; letter-spacing:.04em; background:var(--teal); color:#04211e; transition:opacity .2s; }
    .btn:hover { opacity:.88; }
    .btn:disabled { opacity:.4; cursor:not-allowed; }
    .btn.ghost { background:transparent; border:1px solid var(--line); color:var(--muted); }
    .badge { display:inline-block; padding:3px 10px; border-radius:99px; font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; }
    .badge.high { background:rgba(224,106,106,.15); color:#e88; }
    .badge.normal { background:rgba(43,189,176,.14); color:var(--teal); }
    .badge.low { background:rgba(255,255,255,.07); color:var(--muted); }
    .badge.pending { background:rgba(240,190,80,.14); color:#e8c06a; }
    .badge.accepted { background:rgba(43,189,176,.14); color:var(--teal); }
    .badge.completed { background:rgba(120,200,120,.14); color:#8c8; }
    .badge.cancelled { background:rgba(255,255,255,.07); color:var(--muted); }
    input, select { background:var(--bg); border:1px solid var(--line); color:var(--text); border-radius:8px; padding:10px 12px; font-size:14px; width:100%; }
    input:focus, select:focus { outline:1px solid var(--teal); }
    label { display:block; font-size:11px; letter-spacing:.1em; text-transform:uppercase; color:var(--muted); margin:0 0 6px; }
    table { width:100%; border-collapse:collapse; font-size:13.5px; }
    th { text-align:left; padding:10px 12px; color:var(--muted); font-size:11px; letter-spacing:.08em; text-transform:uppercase; border-bottom:1px solid var(--line); }
    td { padding:12px; border-bottom:1px solid var(--line); vertical-align:top; }
    .toast { position:fixed; bottom:24px; right:24px; background:var(--surface); border:1px solid var(--teal); border-radius:10px; padding:14px 20px; font-size:14px; z-index:100; box-shadow:0 10px 40px rgba(0,0,0,.5); }
    .muted { color:var(--muted); }
    .grid { display:grid; gap:16px; }
  </style>
  @stack('head')
</head>
<body>
@auth
  <header class="topbar">
    <div class="brand">ELITE <span>PROMOTION</span> — Espace équipe</div>
    <nav class="main">
      <a href="{{ route('dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">Demandes</a>
      @if(auth()->user()->isAdmin())
        <a href="{{ route('admin') }}" class="{{ request()->routeIs('admin') ? 'active' : '' }}">Administration</a>
      @endif
      <a href="#" onclick="logout(event)">Déconnexion ({{ auth()->user()->name }})</a>
    </nav>
  </header>
@endauth

<main>@yield('content')</main>

<script>
  const CSRF = document.querySelector('meta[name="csrf-token"]').content;

  async function api(path, options = {}) {
    const res = await fetch(path, {
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': CSRF, ...(options.headers || {}) },
      credentials: 'same-origin',
      ...options,
    });
    const body = res.status === 204 ? null : await res.json().catch(() => null);
    if (!res.ok) throw Object.assign(new Error(body?.message || `HTTP ${res.status}`), { status: res.status, body });
    return body;
  }

  function toast(msg, ms = 3800) {
    const el = document.createElement('div');
    el.className = 'toast'; el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), ms);
  }

  async function logout(e) {
    e.preventDefault();
    await api('/api/logout', { method: 'POST' });
    window.location.href = '/login';
  }
</script>
@stack('scripts')
</body>
</html>
