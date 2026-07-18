# Intégration Odoo CRM — Guide complet

Ce guide explique **de A à Z** comment connecter le backend Elite à une
instance Odoo, pour que **chaque demande de réunion reçue sur le site crée
automatiquement une piste (lead) dans Odoo CRM**. L'équipe commerciale
retrouve ainsi la même demande dans son pipeline Odoo habituel — sans
ressaisie, sans copier-coller.

> **Important à comprendre avant de commencer.**
> L'intégration est **optionnelle et désactivée par défaut**
> (`ODOO_ENABLED=false`). Le site, le tableau de bord, les emails et Zoom
> fonctionnent parfaitement **sans** Odoo. Activer Odoo est un **ajout** :
> ça n'est jamais un point de panne. Si Odoo est en panne, mal configuré,
> ou injoignable, la demande de réunion aboutit quand même normalement —
> l'erreur est simplement journalisée.

---

## 1. Ce que fait l'intégration (vue d'ensemble)

```
┌─────────────────┐   1. Le visiteur envoie      ┌──────────────────────┐
│  Site Elite     │──── une demande de réunion ──▶│  Backend Laravel     │
│  (formulaire)   │                               │  (API + dashboard)   │
└─────────────────┘                               └──────────┬───────────┘
                                                             │
                             2. Un événement est émis        │
                                (MeetingRequestCreated)      │
                                                             ▼
                                                  ┌──────────────────────┐
                                                  │ File d'attente (queue)│
                                                  │ SyncMeetingRequest    │
                                                  │        ToOdoo         │
                                                  └──────────┬───────────┘
                                                             │
                             3. Appel API JSON-RPC           │
                                (si ODOO_ENABLED=true)       ▼
                                                  ┌──────────────────────┐
                                                  │       Odoo CRM        │
                                                  │  Nouvelle piste       │
                                                  │  (crm.lead)           │
                                                  └──────────────────────┘
```

**En clair :**

1. Un visiteur remplit le formulaire « Planifier une réunion Zoom ».
2. Le backend enregistre la demande **et** émet un événement.
3. Un *listener* en file d'attente (`SyncMeetingRequestToOdoo`) crée une
   piste dans Odoo via son API standard JSON-RPC.
4. La demande apparaît dans **CRM → Pistes** dans Odoo, prête à être
   traitée par un commercial.

Le fait que ça passe par une **file d'attente** (queue) garantit que le
visiteur reçoit une réponse instantanée : la synchronisation Odoo se fait
en arrière-plan, elle ne ralentit jamais le formulaire.

---

## 2. Prérequis

| Élément | Détail |
|---|---|
| Une instance Odoo | **Odoo Online** (`https://votre-societe.odoo.com`) **ou** Odoo auto-hébergé. Version 14 ou plus récente (l'API JSON-RPC est identique depuis des années). |
| Le module **CRM** installé | Menu Odoo → *Applications* → installer **CRM** s'il n'y est pas. C'est lui qui fournit le modèle `crm.lead`. |
| Un compte administrateur Odoo | Pour créer l'utilisateur technique et sa clé API (étape 3). |
| Le backend déjà déployé et fonctionnel | Voir `DEPLOYMENT.md`. Le worker de file d'attente doit tourner (supervisor `elite-queue`). |

> **Le client n'a pas encore d'Odoo ?** Ce n'est pas un problème. On peut
> déployer le site aujourd'hui avec `ODOO_ENABLED=false`, et activer Odoo
> plus tard en 5 minutes (uniquement une modification de `.env`, aucun
> changement de code). Rien ne presse.

---

## 3. Étape par étape

### Étape 3.1 — Créer un utilisateur technique dédié dans Odoo

On ne branche **jamais** une intégration sur le compte personnel d'un
employé (si cet employé part, tout casse). On crée un utilisateur dédié.

1. Dans Odoo : *Paramètres* → *Utilisateurs et sociétés* → *Utilisateurs*.
2. Cliquer **Nouveau**.
3. Nom : par exemple `Intégration Site Web`.
4. Adresse email de connexion : par exemple `integration@votre-societe.dz`.
5. Dans l'onglet *Droits d'accès*, donner au minimum le rôle
   **Ventes : Utilisateur** (Sales / User) — suffisant pour créer des
   pistes. (Un rôle *Administrateur* fonctionne aussi mais n'est pas
   nécessaire.)
6. **Enregistrer**.

### Étape 3.2 — Générer une clé API pour cet utilisateur

La clé API remplace le mot de passe dans les appels automatisés — c'est
plus sûr et révocable indépendamment.

1. Toujours dans Odoo, se connecter **en tant que** l'utilisateur technique
   (ou rester admin et ouvrir sa fiche → *Préférences*).
2. Menu utilisateur (en haut à droite) → *Mon profil* / *Préférences*.
3. Onglet **Sécurité du compte** → section **Clés API** → *Nouvelle clé API*.
4. Donner un nom (ex. `Backend Elite`), valider — Odoo affiche la clé
   **une seule fois**. La copier immédiatement.

> Si la section « Clés API » n'apparaît pas, activer d'abord le
> **mode développeur** : *Paramètres* → tout en bas → *Activer le mode
> développeur*.

### Étape 3.3 — Trouver le nom exact de la base de données

L'API Odoo exige le **nom de la base** (database), différent du domaine.

- **Odoo Online :** c'est en général le sous-domaine, ex. pour
  `https://elite-immo.odoo.com` la base est souvent `elite-immo`. En cas de
  doute, aller sur `https://elite-immo.odoo.com/web/database/manager` ou
  regarder *Paramètres* → *Activer le mode développeur* → l'info base
  s'affiche en bas de page.
- **Odoo auto-hébergé :** c'est le nom choisi à la création de la base
  (celui affiché dans le sélecteur de base à la connexion).

### Étape 3.4 — Renseigner le fichier `.env` du backend

Ouvrir `/var/www/elite-backend/.env` et compléter le bloc Odoo :

```dotenv
# ── Odoo (optionnel) — synchronisation CRM ───────────────────────────
ODOO_ENABLED=true
ODOO_URL=https://elite-immo.odoo.com
ODOO_DATABASE=elite-immo
ODOO_USERNAME=integration@votre-societe.dz
ODOO_API_KEY=la-cle-copiee-a-letape-3.2
```

| Variable | Valeur | Exemple |
|---|---|---|
| `ODOO_ENABLED` | `true` pour activer | `true` |
| `ODOO_URL` | URL complète de l'instance, **sans** `/` final | `https://elite-immo.odoo.com` |
| `ODOO_DATABASE` | Nom de la base (étape 3.3) | `elite-immo` |
| `ODOO_USERNAME` | Email de connexion de l'utilisateur technique | `integration@votre-societe.dz` |
| `ODOO_API_KEY` | Clé API générée (étape 3.2) | `a1b2c3d4e5f6...` |

### Étape 3.5 — Recharger la configuration

```bash
cd /var/www/elite-backend
php artisan config:cache
sudo supervisorctl restart elite-queue:*   # recharge le worker de file d'attente
```

> **Pourquoi redémarrer le worker ?** Le listener Odoo tourne dans le
> processus de file d'attente. Celui-ci garde l'ancienne config en mémoire
> tant qu'on ne le redémarre pas — sans ce redémarrage, `ODOO_ENABLED=true`
> ne serait pas pris en compte.

---

## 4. Tableau de correspondance des champs

Chaque demande de réunion est convertie en piste `crm.lead` comme suit
(défini dans `app/Listeners/SyncMeetingRequestToOdoo.php`) :

| Demande de réunion (site) | Champ Odoo (`crm.lead`) | Remarque |
|---|---|---|
| `full_name` | `name` | Titre de la piste : « Demande de réunion — {nom} » |
| `full_name` | `contact_name` | Nom du contact |
| `email` | `email_from` | Email du prospect |
| `phone` | `phone` | Téléphone |
| `company` | `partner_name` | Société (si fournie) |
| `message` | `description` | Message libre du visiteur |
| `preferred_date` | `date_deadline` | Date souhaitée = échéance attendue |

Les autres champs Odoo (commercial assigné, équipe de vente, étiquettes…)
prennent leurs **valeurs par défaut Odoo**. La section 6 explique comment
les personnaliser.

---

## 5. Comment ça marche techniquement

Trois fichiers, tous déjà présents dans le backend :

| Fichier | Rôle |
|---|---|
| `config/services.php` (bloc `odoo`) | Lit les 5 variables `.env`. |
| `app/Services/OdooClient.php` | Client JSON-RPC : authentifie (uid mis en cache 1 h), puis appelle `execute_kw` sur `crm.lead`. |
| `app/Listeners/SyncMeetingRequestToOdoo.php` | Écoute l'événement `MeetingRequestCreated` et crée la piste. En file d'attente, réessaie 3 fois. |

**Protocole :** Odoo expose une API **JSON-RPC 2.0** standard
([documentation officielle](https://www.odoo.com/documentation/latest/developer/reference/external_api.html)).
Le client s'authentifie via le service `common.authenticate` (retourne un
`uid`), puis appelle les modèles via `object.execute_kw`. Aucune
bibliothèque tierce, aucune dépendance supplémentaire — juste des appels
HTTP JSON.

**Garde-fous intégrés :**

- `isEnabled()` vérifie que les 5 variables sont remplies **avant** tout
  appel. Si l'une manque, le listener ne fait rien (aucune erreur).
- Tout appel est enveloppé dans un `try/catch` avec `report($e)` : une
  panne Odoo est journalisée mais **ne bloque jamais** l'acceptation d'une
  demande.
- `$tries = 3` : en file d'attente, un échec réseau temporaire est
  automatiquement réessayé jusqu'à 3 fois.
- L'`uid` d'authentification est mis en cache 1 heure — on ne
  ré-authentifie pas à chaque appel.

---

## 6. Personnaliser la synchronisation (optionnel)

Le mapping par défaut convient à la plupart des cas. Pour aller plus loin,
éditer `app/Listeners/SyncMeetingRequestToOdoo.php`, méthode `handle()`.

### Assigner automatiquement un commercial ou une équipe de vente

Odoo identifie commerciaux et équipes par leur **id numérique**. Pour les
trouver : dans Odoo, ouvrir la fiche du commercial / de l'équipe et lire
l'id dans l'URL (`...#id=7&model=res.users`), ou activer le mode
développeur qui affiche les id.

```php
$this->odoo->createLead([
    'name'          => "Demande de réunion — {$r->full_name}",
    'contact_name'  => $r->full_name,
    'email_from'    => $r->email,
    'phone'         => $r->phone,
    'partner_name'  => $r->company,
    'description'   => $r->message,
    'date_deadline' => $r->preferred_date->toDateString(),
    'user_id'       => 7,   // id du commercial responsable
    'team_id'       => 1,   // id de l'équipe de vente
]);
```

### Créer une opportunité plutôt qu'une piste

Par défaut Odoo crée une **piste** (lead). Pour créer directement une
**opportunité** (avec étape de pipeline) :

```php
'type' => 'opportunity',
```

### Ajouter une étiquette (tag) « Site Web »

Les étiquettes se passent au format Odoo `[(6, 0, [ids])]`. Récupérer d'abord
l'id de l'étiquette dans *CRM → Configuration → Étiquettes*, puis :

```php
'tag_ids' => [[6, 0, [3]]],   // 3 = id de l'étiquette « Site Web »
```

Après toute modification de code : `php artisan config:cache` puis
`sudo supervisorctl restart elite-queue:*`.

---

## 7. Tester l'intégration

### 7.1 — Test rapide via le formulaire réel

1. Aller sur le site → page **Meeting Zoom** → envoyer une demande de test.
2. Dans Odoo : **CRM → Pistes** → la piste « Demande de réunion — {nom} »
   doit apparaître en quelques secondes.

### 7.2 — Test isolé via Tinker (sans passer par le formulaire)

```bash
cd /var/www/elite-backend
php artisan tinker
```

```php
// Vérifier que la config est bien lue
>>> app(App\Services\OdooClient::class)->isEnabled();
=> true   // si false : une des 5 variables ODOO_* est vide ou config non rechargée

// Créer une piste de test directement
>>> app(App\Services\OdooClient::class)->createLead([
...   'name' => 'TEST intégration',
...   'contact_name' => 'Test',
...   'email_from' => 'test@test.dz',
... ]);
=> 42   // l'id numérique de la piste créée dans Odoo — succès !
```

Si l'appel renvoie un **id numérique**, l'authentification et la création
fonctionnent. Supprimer ensuite la piste de test dans Odoo.

### 7.3 — Vérifier que la file d'attente tourne

La synchro passe par la file d'attente. Vérifier que le worker est actif :

```bash
sudo supervisorctl status elite-queue:*   # doit être RUNNING
```

Pour voir les jobs traités en direct pendant un test :

```bash
php artisan queue:work --once -v   # traite un job et affiche le résultat
```

---

## 8. Dépannage

| Symptôme | Cause probable | Solution |
|---|---|---|
| `isEnabled()` renvoie `false` | Une variable `ODOO_*` est vide, ou `config:cache` pas relancé | Vérifier le `.env`, refaire `php artisan config:cache` |
| `Odoo authentication failed` | Mauvais username / clé API / base | Revérifier étapes 3.1–3.3 ; tester le login manuellement dans Odoo |
| `Odoo API error: ... object ... crm.lead` | Module CRM non installé, ou droits insuffisants | Installer CRM ; donner le rôle *Ventes : Utilisateur* à l'utilisateur technique |
| Piste absente dans Odoo mais aucune erreur | Le worker de file d'attente ne tourne pas | `sudo supervisorctl restart elite-queue:*` |
| `i/o timeout` / `could not resolve host` | `ODOO_URL` incorrect ou Odoo injoignable depuis le VPS | Vérifier l'URL (sans `/` final) ; tester `curl https://...odoo.com` depuis le serveur |
| Erreur `Access Denied` sur `date_deadline` | Champ personnalisé/verrouillé dans cette instance Odoo | Retirer le champ du mapping (section 6) |

**Où lire les erreurs :** toutes les erreurs Odoo sont journalisées dans
`storage/logs/laravel.log`. Les jobs échoués après 3 tentatives sont dans
la table `failed_jobs` :

```bash
php artisan queue:failed          # lister les échecs
php artisan queue:retry all       # les rejouer après correction
tail -f storage/logs/laravel.log  # suivre les erreurs en direct
```

---

## 9. Sécurité

- **La clé API n'est jamais dans le code** — uniquement dans `.env`, hors
  du dépôt Git.
- **Utilisateur dédié** : révoquer l'accès Odoo de l'intégration = supprimer
  la clé API, sans toucher aux comptes des employés.
- **Portée minimale** : le rôle *Ventes : Utilisateur* suffit ; ne pas
  donner *Administrateur* sauf nécessité.
- **Aucune donnée sensible** ne transite : uniquement les coordonnées que le
  visiteur a lui-même saisies dans le formulaire public.

---

## 10. Résumé express (checklist)

- [ ] Module **CRM** installé dans Odoo
- [ ] Utilisateur technique créé (rôle *Ventes : Utilisateur*)
- [ ] Clé API générée et copiée
- [ ] Nom exact de la base de données identifié
- [ ] 5 variables `ODOO_*` renseignées dans `.env` (`ODOO_ENABLED=true`)
- [ ] `php artisan config:cache`
- [ ] `sudo supervisorctl restart elite-queue:*`
- [ ] Test via formulaire → piste visible dans **CRM → Pistes**

Une fois ces cases cochées, chaque demande de réunion du site alimente
automatiquement le pipeline commercial dans Odoo. 🎉
