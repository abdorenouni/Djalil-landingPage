@extends('layouts.app')

@section('title', 'Administration')

@section('content')
<h1 style="font-size:22px;font-weight:600;margin:0 0 24px">Administration</h1>

{{-- KPI strip --}}
<div id="kpis" class="grid" style="grid-template-columns:repeat(auto-fit,minmax(160px,1fr));margin-bottom:28px"></div>

{{-- Filters --}}
<div class="card" style="margin-bottom:20px">
  <div class="grid" style="grid-template-columns:2fr 1fr 1fr 1fr 1fr auto;align-items:end">
    <div><label>Recherche</label><input id="f-search" placeholder="Nom, email, société, téléphone…"></div>
    <div><label>Statut</label>
      <select id="f-status">
        <option value="">Tous</option>
        <option value="pending">En attente</option>
        <option value="accepted">Acceptée</option>
        <option value="completed">Terminée</option>
        <option value="cancelled">Annulée</option>
      </select>
    </div>
    <div><label>Du</label><input id="f-from" type="date"></div>
    <div><label>Au</label><input id="f-to" type="date"></div>
    <div><label>Employé</label><select id="f-employee"><option value="">Tous</option></select></div>
    <button class="btn ghost" onclick="exportCsv()">Exporter CSV</button>
  </div>
</div>

{{-- Requests table --}}
<div class="card" style="padding:0;overflow-x:auto;margin-bottom:32px">
  <table>
    <thead><tr>
      <th>Client</th><th>Contact</th><th>Souhait</th><th>Urgence</th><th>Statut</th><th>Assignée à</th><th>Reçue</th><th></th>
    </tr></thead>
    <tbody id="rows"></tbody>
  </table>
</div>

<div class="grid" style="grid-template-columns:1fr 1fr">
  {{-- Employee performance --}}
  <div class="card">
    <h2 style="font-size:15px;margin:0 0 14px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">Performance équipe</h2>
    <table><thead><tr><th>Employé</th><th>Assignées</th><th>En cours</th><th>Terminées</th><th>Délai moyen</th></tr></thead>
      <tbody id="perf"></tbody></table>
  </div>

  {{-- Activity log --}}
  <div class="card">
    <h2 style="font-size:15px;margin:0 0 14px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)">Journal d'activité</h2>
    <table><thead><tr><th>Quand</th><th>Qui</th><th>Action</th></tr></thead>
      <tbody id="logs"></tbody></table>
  </div>
</div>
@endsection

@push('scripts')
<script type="module">
  import Echo from 'https://esm.sh/laravel-echo@2.2.7';
  import Pusher from 'https://esm.sh/pusher-js@8.4.0';

  const REVERB = @json($reverb);
  const STATUS = { pending: 'En attente', accepted: 'Acceptée', completed: 'Terminée', cancelled: 'Annulée' };
  const URGENCY = { high: 'Haute', normal: 'Normale', low: 'Basse' };
  let employees = [];

  function esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }

  function filters() {
    return {
      search: document.getElementById('f-search').value,
      status: document.getElementById('f-status').value,
      date_from: document.getElementById('f-from').value,
      date_to: document.getElementById('f-to').value,
      assigned_employee_id: document.getElementById('f-employee').value,
    };
  }

  function qs(obj) {
    return Object.entries(obj).filter(([, v]) => v).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  }

  async function loadEmployees() {
    const res = await api('/api/admin/employees');
    employees = res.data;
    document.getElementById('f-employee').innerHTML =
      '<option value="">Tous</option>' + employees.map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('');
  }

  async function loadRequests() {
    const res = await api(`/api/meeting-requests?per_page=50&${qs(filters())}`);
    document.getElementById('rows').innerHTML = res.data.map(r => `
      <tr>
        <td><strong>${esc(r.full_name)}</strong><br><span class="muted">${esc(r.company ?? '')}</span></td>
        <td class="muted">${esc(r.email)}<br>${esc(r.phone)}</td>
        <td>${esc(r.preferred_date)}<br><span class="muted">${esc((r.preferred_time || '').slice(0,5))}</span></td>
        <td><span class="badge ${r.urgency}">${URGENCY[r.urgency]}</span></td>
        <td><span class="badge ${r.status}">${STATUS[r.status]}</span></td>
        <td>${r.assigned_employee ? esc(r.assigned_employee.name) : '<span class="muted">—</span>'}</td>
        <td class="muted">${new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
        <td>${r.status !== 'pending' ? `<select onchange="reassign('${r.reference}', this)" style="width:auto;font-size:12px">
              <option value="">Réassigner…</option>
              ${employees.map(e => `<option value="${e.id}">${esc(e.name)}</option>`).join('')}
            </select>` : ''}</td>
      </tr>`).join('');
  }

  async function loadStats() {
    const res = await api('/api/admin/stats');
    const s = res.by_status;
    document.getElementById('kpis').innerHTML = Object.entries(STATUS).map(([k, label]) => `
      <div class="card" style="text-align:center">
        <div style="font-size:30px;font-weight:700;color:var(--teal)">${s[k] ?? 0}</div>
        <div class="muted" style="font-size:12px;letter-spacing:.08em;text-transform:uppercase">${label}</div>
      </div>`).join('');
    document.getElementById('perf').innerHTML = res.employee_performance.map(p => `
      <tr><td>${esc(p.name)}</td><td>${p.total_assigned}</td><td>${p.in_progress}</td><td>${p.completed}</td>
      <td class="muted">${p.avg_minutes_to_accept != null ? p.avg_minutes_to_accept + ' min' : '—'}</td></tr>`).join('');
  }

  async function loadLogs() {
    const res = await api('/api/admin/activity-logs?per_page=15');
    document.getElementById('logs').innerHTML = res.data.map(l => `
      <tr><td class="muted" style="white-space:nowrap">${new Date(l.created_at).toLocaleString('fr-FR')}</td>
      <td>${esc(l.user?.name ?? 'Visiteur')}</td><td class="muted">${esc(l.action)}</td></tr>`).join('');
  }

  window.reassign = async (reference, select) => {
    if (!select.value) return;
    try {
      await api(`/api/admin/meeting-requests/${reference}/reassign`, {
        method: 'POST',
        body: JSON.stringify({ employee_id: Number(select.value) }),
      });
      toast('Demande réassignée.');
      refresh();
    } catch (ex) { toast('Erreur : ' + ex.message); select.value = ''; }
  };

  window.exportCsv = () => {
    window.location.href = `/api/admin/meeting-requests/export?${qs(filters())}`;
  };

  function refresh() { loadRequests(); loadStats(); loadLogs(); }

  ['f-search', 'f-status', 'f-from', 'f-to', 'f-employee'].forEach(id => {
    let t;
    document.getElementById(id).addEventListener('input', () => { clearTimeout(t); t = setTimeout(loadRequests, 350); });
  });

  window.Pusher = Pusher;
  const echo = new Echo({
    broadcaster: 'reverb', key: REVERB.key,
    wsHost: REVERB.host, wsPort: REVERB.port, wssPort: REVERB.port,
    forceTLS: REVERB.scheme === 'https', enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth', auth: { headers: { 'X-CSRF-TOKEN': CSRF } },
  });
  echo.private('employees')
    .listen('.meeting-request.created', refresh)
    .listen('.meeting-request.accepted', refresh)
    .listen('.meeting-request.reassigned', refresh);

  await loadEmployees();
  refresh();
</script>
@endpush
