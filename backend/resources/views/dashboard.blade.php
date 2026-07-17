@extends('layouts.app')

@section('title', 'Demandes de réunion')

@section('content')
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px">
  <h1 style="font-size:22px;font-weight:600;margin:0">Demandes de réunion</h1>
  <div style="display:flex;gap:10px;align-items:center">
    <span id="live-dot" title="Temps réel" style="width:9px;height:9px;border-radius:50%;background:#666;display:inline-block"></span>
    <select id="filter-status" style="width:auto">
      <option value="pending">En attente</option>
      <option value="accepted">Acceptées</option>
      <option value="">Toutes</option>
    </select>
  </div>
</div>

<div id="requests" class="grid" style="grid-template-columns:repeat(auto-fill,minmax(340px,1fr))"></div>
<p id="empty" class="muted" style="display:none;text-align:center;padding:60px 0">Aucune demande pour le moment.</p>
@endsection

@push('scripts')
<script type="module">
  import Echo from 'https://esm.sh/laravel-echo@2.2.7';
  import Pusher from 'https://esm.sh/pusher-js@8.4.0';

  const ME = @json(['id' => $user->id, 'name' => $user->name, 'admin' => $user->isAdmin()]);
  const REVERB = @json($reverb);
  const container = document.getElementById('requests');
  const statusFilter = document.getElementById('filter-status');
  const URGENCY = { high: 'Haute', normal: 'Normale', low: 'Basse' };
  const STATUS = { pending: 'En attente', accepted: 'Acceptée', completed: 'Terminée', cancelled: 'Annulée' };

  function esc(s) { const d = document.createElement('div'); d.textContent = s ?? ''; return d.innerHTML; }

  function card(r) {
    const acceptedBy = r.assigned_employee ? `<div class="muted" style="font-size:12.5px;margin-top:10px">Prise en charge : <strong style="color:var(--teal)">${esc(r.assigned_employee.name)}</strong></div>` : '';
    const btn = r.status === 'pending'
      ? `<button class="btn" style="width:100%;justify-content:center;margin-top:14px" onclick="acceptRequest(${r.id}, '${r.reference}', this)">Accepter</button>`
      : '';
    // zoom_start_url only comes back from the API for the assignee or an
    // admin (see MeetingRequestResource) — safe to render whenever present.
    const zoom = r.zoom_start_url
      ? `<a href="${esc(r.zoom_start_url)}" target="_blank" rel="noopener noreferrer" class="btn" style="width:100%;justify-content:center;margin-top:10px;text-decoration:none">Démarrer sur Zoom</a>`
      : (r.status !== 'pending' && !r.zoom_link
          ? `<div class="muted" style="font-size:12px;margin-top:10px">Zoom non configuré — ajoutez un lien manuellement.</div>`
          : '');
    return `
      <div class="card" id="req-${r.id}" data-status="${r.status}">
        <div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:10px">
          <strong style="font-size:15.5px">${esc(r.full_name)}</strong>
          <span class="badge ${r.urgency}">${URGENCY[r.urgency] ?? r.urgency}</span>
        </div>
        <div class="muted" style="font-size:13px;line-height:1.8">
          ${r.company ? esc(r.company) + '<br>' : ''}
          ${r.email ? `<a href="mailto:${esc(r.email)}">${esc(r.email)}</a> · ` : ''}${esc(r.phone ?? '')}<br>
          Souhaite : <strong style="color:var(--text)">${esc(r.preferred_date)} à ${esc((r.preferred_time || '').slice(0,5))}</strong><br>
          ${r.message ? `<em>« ${esc(r.message.slice(0, 140))}${r.message.length > 140 ? '…' : ''} »</em><br>` : ''}
          <span style="font-size:12px">Reçue : ${new Date(r.created_at).toLocaleString('fr-FR')}</span>
        </div>
        <div style="margin-top:10px"><span class="badge ${r.status}">${STATUS[r.status] ?? r.status}</span></div>
        ${acceptedBy}
        ${btn}
        ${zoom}
      </div>`;
  }

  async function load() {
    const status = statusFilter.value;
    const qs = status ? `?status=${status}&per_page=60` : '?per_page=60';
    const res = await api(`/api/meeting-requests${qs}`);
    container.innerHTML = res.data.map(card).join('');
    document.getElementById('empty').style.display = res.data.length ? 'none' : 'block';
  }

  window.acceptRequest = async (id, reference, btn) => {
    btn.disabled = true;
    btn.textContent = '…';
    try {
      const r = await api(`/api/meeting-requests/${reference}/accept`, { method: 'POST' });
      toast('Demande acceptée — elle est à vous.');
      applyAccepted({ id, accepted_by: r.data.assigned_employee, status: r.data.status });
    } catch (ex) {
      if (ex.status === 409) {
        toast(ex.body?.accepted_by ? `Déjà acceptée par ${ex.body.accepted_by}.` : 'Cette demande a déjà été acceptée.');
        applyAccepted({ id, accepted_by: { name: ex.body?.accepted_by }, status: 'accepted' });
      } else {
        toast('Erreur : ' + ex.message);
        btn.disabled = false;
        btn.textContent = 'Accepter';
      }
    }
  };

  // A card was accepted (by me, by someone else, or via broadcast): if the
  // dashboard is filtered on "pending", the card leaves; otherwise it flips
  // to its accepted state in place.
  function applyAccepted({ id, accepted_by, status }) {
    const el = document.getElementById(`req-${id}`);
    if (!el) return;
    if (statusFilter.value === 'pending') {
      el.style.transition = 'opacity .5s'; el.style.opacity = '0';
      setTimeout(() => { el.remove(); if (!container.children.length) document.getElementById('empty').style.display = 'block'; }, 500);
    } else {
      load();
    }
  }

  // ── Real-time via Reverb ─────────────────────────────────────────────
  window.Pusher = Pusher;
  const echo = new Echo({
    broadcaster: 'reverb',
    key: REVERB.key,
    wsHost: REVERB.host,
    wsPort: REVERB.port,
    wssPort: REVERB.port,
    forceTLS: REVERB.scheme === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: { headers: { 'X-CSRF-TOKEN': CSRF } },
  });

  echo.connector.pusher.connection.bind('connected', () => {
    document.getElementById('live-dot').style.background = 'var(--teal)';
  });
  echo.connector.pusher.connection.bind('disconnected', () => {
    document.getElementById('live-dot').style.background = '#c66';
  });

  echo.private('employees')
    .listen('.meeting-request.created', () => { load(); toast('Nouvelle demande de réunion reçue.'); })
    .listen('.meeting-request.accepted', (e) => {
      if (e.accepted_by?.id !== ME.id) toast(`${e.accepted_by?.name} a accepté une demande.`);
      applyAccepted({ id: e.id, accepted_by: e.accepted_by, status: e.status });
    })
    .listen('.meeting-request.reassigned', () => load());

  statusFilter.addEventListener('change', load);
  load();
</script>
@endpush
