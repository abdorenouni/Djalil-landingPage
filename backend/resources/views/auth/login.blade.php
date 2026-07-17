@extends('layouts.app')

@section('title', 'Connexion')

@section('content')
<div style="max-width:400px;margin:10vh auto 0">
  <div class="card" style="padding:32px">
    <div class="brand" style="text-align:center;margin-bottom:28px">ELITE <span>PROMOTION</span></div>
    <form id="login-form">
      <div style="margin-bottom:18px">
        <label for="email">Email</label>
        <input id="email" type="email" name="email" required autocomplete="username">
      </div>
      <div style="margin-bottom:24px">
        <label for="password">Mot de passe</label>
        <input id="password" type="password" name="password" required autocomplete="current-password">
      </div>
      <div id="login-error" class="muted" style="color:#e88;font-size:13px;margin-bottom:14px;display:none"></div>
      <button class="btn" type="submit" style="width:100%;justify-content:center">Se connecter</button>
    </form>
  </div>
</div>
@endsection

@push('scripts')
<script>
  document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = document.getElementById('login-error');
    err.style.display = 'none';
    try {
      await api('/api/login', {
        method: 'POST',
        body: JSON.stringify({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
        }),
      });
      window.location.href = '/dashboard';
    } catch (ex) {
      err.textContent = ex.body?.errors?.email?.[0] || ex.message;
      err.style.display = 'block';
    }
  });
</script>
@endpush
