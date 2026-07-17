# Elite Backend — Demandes de réunion Zoom

Backend Laravel de production pour le site vitrine Elite Promotion Immobilière : les visiteurs demandent une réunion Zoom, l'équipe se répartit les demandes en temps réel, les administrateurs pilotent l'activité.

| Couche | Technologie |
| --- | --- |
| Framework | Laravel 13 (PHP 8.4) — API REST + dashboard Blade |
| Base de données | PostgreSQL 16 |
| Authentification | Laravel Sanctum (mode SPA — sessions + cookies) |
| Temps réel | Laravel Reverb (WebSockets) + Laravel Echo |
| Files d'attente | Queue `database` (notifications, emails) |
| Tests | PHPUnit 12 — 20 tests / 60 assertions, exécutés sur PostgreSQL |

> **Note versions** : le projet a été généré sur Laravel 13 (version stable actuelle, fenêtre de support la plus longue). L'architecture demandée — Sanctum, Reverb, Eloquent, Repository + Service — est strictement identique à Laravel 12 ; aucun code de ce dépôt n'utilise d'API spécifique à la v13.

---

## Démarrage rapide

```bash
composer install
cp .env.example .env          # puis: php artisan key:generate
php artisan migrate --seed    # comptes de démo + demandes d'exemple

php artisan serve             # API + dashboard  → http://localhost:8000
php artisan reverb:start      # WebSockets       → ws://localhost:8080
php artisan queue:work        # notifications / emails
```

Comptes seedés (mot de passe : `password`) :

- `admin@elite-promotion.dz` — administrateur
- `sarah@elite-promotion.dz`, `karim@…`, `yacine@…` — employés

Dashboard équipe : `http://localhost:8000/dashboard` · Admin : `/admin`

```bash
php artisan test              # suite complète sur PostgreSQL (elite_backend_test)
```

---

## Architecture & décisions

### Vue d'ensemble

```
Visiteur (site React)                 Employés / Admins (dashboard Blade)
       │ POST /api/meeting-requests          │ session Sanctum + CSRF
       ▼                                     ▼
┌─────────────────────────── Laravel ────────────────────────────┐
│  Controller (validation FormRequest, autorisation Policy)      │
│      └── MeetingRequestService  ← toutes les règles métier     │
│              ├── DB::transaction + SELECT … FOR UPDATE         │
│              ├── ActivityLogger (audit)                        │
│              └── Events ──► Reverb (WebSocket) ──► dashboards  │
│                     └────► Listener (queued) ──► Notifications │
│      └── MeetingRequestRepository ← toutes les lectures        │
└────────────────────────────────────────────────────────────────┘
                        PostgreSQL 16
```

### Structure des dossiers

```
app/
├── Enums/            UserRole, MeetingRequestStatus (+ machine à états), Urgency
├── Events/           MeetingRequestCreated / Accepted / Reassigned (ShouldBroadcast)
├── Exceptions/       MeetingRequestConflictException → rend 409 automatiquement
├── Http/
│   ├── Controllers/  Api/ (REST) + DashboardController (shell Blade)
│   ├── Middleware/   EnsureUserIsAdmin
│   ├── Requests/     Store / Update / Reassign (validation)
│   └── Resources/    MeetingRequestResource (forme de sortie unique)
├── Listeners/        SendMeetingRequestAcceptedNotifications (queued, fan-out)
├── Models/           User, MeetingRequest, ActivityLog
├── Notifications/    AcceptedNotification (employé/admin), CustomerReceived (client)
├── Policies/         MeetingRequestPolicy (matrice d'autorisation)
├── Repositories/     MeetingRequestRepository (toutes les requêtes de lecture)
└── Services/         MeetingRequestService (règles métier), ActivityLogger (audit)
```

### Pourquoi ces choix

**Service + Repository — mais pas plus.** Le service détient les règles métier et les transactions ; le repository détient les requêtes de lecture (filtres, agrégats, verrous). Les contrôleurs font exactement quatre choses : valider, autoriser, déléguer, formater. Pas d'interfaces + bindings spéculatifs : une seule implémentation existe, l'abstraction supplémentaire serait du bruit — en ajouter le jour où un second backend existe est un refactoring de dix minutes.

**Concurrence : verrouillage pessimiste.** `accept()` s'exécute dans `DB::transaction` et relit la ligne avec `lockForUpdate()` (`SELECT … FOR UPDATE`). PostgreSQL sérialise tous les acceptants sur cette ligne : le second reprend la main *après* le commit du premier, relit un statut `accepted`, et reçoit une `MeetingRequestConflictException` rendue en **409 Conflict** avec le message « This request has already been accepted. ». Dix clics simultanés → un gagnant, neuf 409 propres. Le test `test_row_lock_actually_blocks_concurrent_acceptors` prouve le blocage réel avec deux connexions PDO indépendantes sur PostgreSQL — pas une simulation.

**Événements après commit.** Broadcast et notifications partent seulement une fois la transaction commitée : une acceptation annulée ne notifie jamais personne.

**Notifications extensibles.** Un seul listener (queued) fait le fan-out : employé assigné (database), admins (database + mail), client (mail, désactivable par env `MEETING_REQUESTS_NOTIFY_CUSTOMER`). Ajouter Slack/SMS = ajouter un canal dans `via()` — aucun autre fichier ne change.

**Enums PHP natifs, machine à états.** `MeetingRequestStatus::canTransitionTo()` centralise les transitions légales (pending→accepted, accepted→completed…). Toute mutation passe par le service, donc aucune route ne peut contourner la machine à états. Colonnes `string` en base (pas de type enum PG) : ajouter un statut est un changement de code, pas un DDL.

**Identifiants publics = UUID.** Le routing lie `{meetingRequest}` sur `reference` (UUID), jamais l'id séquentiel : rien d'énumérable n'est exposé, l'id interne reste aux jointures.

**Dashboard servi par Laravel.** Le front React reste intact ; le dashboard employés/admin est rendu par Blade sur la même origine que l'API — la session Sanctum et le CSRF fonctionnent sans configuration cross-domain, et il n'existe qu'un seul chemin de code métier (le dashboard consomme la même API REST que celle testée).

### Sécurité

| Menace | Contre-mesure |
| --- | --- |
| Injection SQL | Eloquent/query builder uniquement — 100 % requêtes paramétrées (y compris la recherche `ILIKE`, échappée) |
| XSS | Blade échappe par défaut ; le dashboard passe toute donnée par `esc()` côté JS ; React échappe nativement |
| CSRF | Sessions Sanctum + `X-CSRF-TOKEN` sur le dashboard ; seule la route publique du formulaire (sans session) est exemptée |
| Brute force | Login limité 5 tentatives/min par email+IP, avec délais |
| Spam formulaire | 5 soumissions/min/IP (configurable), IP source journalisée |
| Mass assignment | Champs de propriété (`assigned_employee_id`, `accepted_at`, `status`) non fillables — modifiables uniquement via le service |
| Élévation de privilèges | Policy sur chaque action + middleware `admin` + désactivation de compte (`is_active`) coupant tout accès via `Policy::before` |
| Fuite de données | Resource API à liste blanche ; canal WebSocket privé (auth session obligatoire) |
| Audit | `activity_logs` immuable : qui, quoi, quand, IP, contexte JSON — création, acceptation, réassignation, statut, connexions |

### Temps réel

Événements broadcastés sur le canal privé `employees` (autorisation : `routes/channels.php`, tout compte actif) :

| Événement | Payload | Effet dashboard |
| --- | --- | --- |
| `meeting-request.created` | nouvelle demande | la carte apparaît + toast |
| `meeting-request.accepted` | id, acceptant | la carte disparaît / se désactive partout |
| `meeting-request.reassigned` | id, nouvel employé | rafraîchissement |

### API

| Méthode | Route | Accès | Codes |
| --- | --- | --- | --- |
| POST | `/api/meeting-requests` | public (throttle 5/min/IP) | 201, 422, 429 |
| POST | `/api/login` · `/api/logout` · GET `/api/me` | — / session | 200, 422 |
| GET | `/api/meeting-requests?status=&urgency=&search=&date_from=&date_to=&assigned_employee_id=` | staff | 200 |
| GET | `/api/meeting-requests/{reference}` | staff | 200, 404 |
| POST | `/api/meeting-requests/{reference}/accept` | staff | 200, **409**, 401/403 |
| PATCH | `/api/meeting-requests/{reference}` | propriétaire ou admin | 200, 403, 409, 422 |
| DELETE | `/api/meeting-requests/{reference}` | admin | 204, 403 |
| POST | `/api/admin/meeting-requests/{reference}/reassign` | admin | 200, 403, 409 |
| GET | `/api/admin/stats` · `/employees` · `/activity-logs` | admin | 200 |
| GET | `/api/admin/meeting-requests/export` (CSV streamé) | admin | 200 |

### Schéma PostgreSQL

- **users** — + `role` (admin/employee, indexé), `phone`, `is_active`
- **meeting_requests** — `reference` UUID unique, coordonnées visiteur, `preferred_date/time`, `urgency` (dérivée de la proximité de la date), `status`, `assigned_employee_id` FK→users (SET NULL), `accepted_at`, `zoom_link`, `scheduled_at`, `source_ip`, timestamps TZ, soft delete. Index composite `(status, created_at)` = chemin chaud du dashboard.
- **activity_logs** — acteur nullable FK, `action`, sujet polymorphe (prêt pour de futurs domaines CRM/ERP), `context` JSONB, IP, immuable.
- **notifications** — table standard Laravel (canal database).
- **jobs / sessions / cache** — infrastructure queue + session en base (aucune dépendance Redis ; swap possible par simple env).

---

## Intégration au site React (elite-site)

Changements **minimaux** effectués — rien d'existant n'est modifié :

1. **Nouveau** `src/pages/RendezVous.tsx` — formulaire « Demander une réunion Zoom » dans le style du site.
2. `src/App.tsx` — +2 lignes : import + route `/rendez-vous`.
3. `.env.example` / `.env` — `VITE_BACKEND_URL=http://localhost:8000`.

La page n'est volontairement pas ajoutée au menu global — à lier où vous voulez (`<Link to="/rendez-vous">`). CORS est déjà configuré côté Laravel (`FRONTEND_URL`, credentials).

---

## Production

```bash
php artisan config:cache && php artisan route:cache && php artisan view:cache
```

Processus à superviser (systemd/Supervisor) :

| Processus | Commande |
| --- | --- |
| HTTP | php-fpm derrière nginx (ou Octane) |
| WebSockets | `php artisan reverb:start` (proxy nginx `/app` → :8080, TLS) |
| Queue | `php artisan queue:work --tries=3 --timeout=90` |
| Scheduler | cron `* * * * * php artisan schedule:run` |

`.env` production : `APP_ENV=production`, `APP_DEBUG=false`, vrais identifiants PostgreSQL, `MAIL_MAILER=smtp`, `REVERB_SCHEME=https`, `SANCTUM_STATEFUL_DOMAINS` + `FRONTEND_URL` sur le domaine réel, `SESSION_DOMAIN` adapté.

Montée en charge : Reverb scale horizontalement avec Redis (`REVERB_SCALING_ENABLED=true`) ; queue → Redis/SQS par simple `QUEUE_CONNECTION` ; le schéma (index sur les chemins chauds, agrégats en une requête) tient des milliers de demandes sans modification.
