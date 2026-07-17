# Déploiement VPS — Elite Backend

Guide pas-à-pas pour mettre le backend en production sur un VPS Linux
(Ubuntu 22.04/24.04). Durée estimée : 30–45 minutes.

## 1. Prérequis serveur

```bash
sudo apt update
sudo apt install -y nginx postgresql supervisor unzip \
  php8.4-fpm php8.4-cli php8.4-pgsql php8.4-mbstring php8.4-xml \
  php8.4-curl php8.4-zip php8.4-intl php8.4-gd
# Composer
curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
```

> PHP 8.3 fonctionne aussi — adapter `fastcgi_pass` dans nginx.conf.

## 2. Base de données

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE elite WITH LOGIN PASSWORD 'CHOISIR_UN_MOT_DE_PASSE_FORT';
CREATE DATABASE elite_backend OWNER elite;
SQL
```

## 3. Application

```bash
sudo mkdir -p /var/www/elite-backend
# Déposer le contenu de l'archive elite-backend/ ici, puis :
cd /var/www/elite-backend
composer install --no-dev --optimize-autoloader

cp deploy/.env.production.example .env
nano .env          # compléter DB_PASSWORD, REVERB_*, MAIL_*, domaines
php artisan key:generate

php artisan migrate --force
php artisan db:seed --force   # crée les comptes (voir §7) — UNIQUEMENT au 1er déploiement

php artisan config:cache && php artisan route:cache && php artisan view:cache

sudo chown -R www-data:www-data storage bootstrap/cache
```

Secrets Reverb (3 valeurs à coller dans `.env`) :

```bash
echo "REVERB_APP_ID=$(shuf -i 100000-999999 -n 1)"
echo "REVERB_APP_KEY=$(openssl rand -hex 16)"
echo "REVERB_APP_SECRET=$(openssl rand -hex 16)"
```

## 4. nginx + TLS

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/elite-backend
# Éditer : remplacer api.elite-promotion.dz par le domaine réel
sudo ln -s /etc/nginx/sites-available/elite-backend /etc/nginx/sites-enabled/
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d api.elite-promotion.dz
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Processus permanents (supervisor)

```bash
sudo cp deploy/supervisor.conf /etc/supervisor/conf.d/elite-backend.conf
# Éditer si le chemin d'installation diffère de /var/www/elite-backend
sudo supervisorctl reread && sudo supervisorctl update
sudo supervisorctl status     # elite-reverb + elite-queue_00/01 → RUNNING
```

## 6. Tâches planifiées

```bash
sudo crontab -u www-data -e
# Ajouter :
* * * * * cd /var/www/elite-backend && php artisan schedule:run >> /dev/null 2>&1
```

## 7. Comptes

Le seeder crée **un seul administrateur** — `mar.elitee@gmail.com` / `1234` —
et 3 comptes employés provisoires (Sarah/Karim/Yacine, mot de passe
`password`) qui servent uniquement à tester la file partagée avec plusieurs
personnes. **À faire avant le lancement réel :**

1. Changer le mot de passe admin :
   ```bash
   php artisan tinker
   >>> $u = App\Models\User::where('email','mar.elitee@gmail.com')->first();
   >>> $u->password = 'NOUVEAU_MOT_DE_PASSE'; $u->save();
   ```
   (Le cast `hashed` du modèle chiffre automatiquement — jamais de mot de
   passe en clair en base.)
2. Remplacer les 3 employés provisoires par les vrais employés du client :
   ```bash
   php artisan tinker
   >>> App\Models\User::factory()->employee()->create(['name' => 'Nom Réel', 'email' => 'email@reel.dz', 'password' => 'mot-de-passe-temporaire']);
   >>> App\Models\User::where('email', 'sarah@elite-promotion.dz')->delete(); // idem karim@/yacine@
   ```

## 7bis. Aucune donnée de démonstration en production

Le seeder ne crée **aucune** demande de réunion fictive — seulement les
comptes ci-dessus. `db:seed` est donc sûr à exécuter même en production
(il ne pollue jamais la liste de demandes réelles). Si des données de test
apparaissent malgré tout sur un environnement partagé, les supprimer :

```bash
php artisan tinker
>>> App\Models\ActivityLog::whereIn('subject_id', App\Models\MeetingRequest::pluck('id'))->delete();
>>> App\Models\MeetingRequest::withTrashed()->forceDelete();
```

## 8. Côté frontend (Vercel)

Dans les variables d'environnement du projet Vercel :

```
VITE_BACKEND_URL=https://api.elite-promotion.dz
```

puis redéployer le front. Vérifier que `.env` backend contient bien :

- `FRONTEND_URL=https://elite-promotion.dz` (CORS)
- `SANCTUM_STATEFUL_DOMAINS=elite-promotion.dz,www.elite-promotion.dz`
- `SESSION_DOMAIN=.elite-promotion.dz`

## 9. Vérification finale

```bash
# API publique (doit répondre 201 + une référence UUID)
curl -X POST https://api.elite-promotion.dz/api/meeting-requests \
  -H "Content-Type: application/json" -H "Accept: application/json" \
  -d '{"full_name":"Test","email":"t@t.dz","phone":"+213 555 000 000",
       "preferred_date":"2026-12-01","preferred_time":"10:00"}'

# Auth (doit répondre 401)
curl -s -o /dev/null -w "%{http_code}" https://api.elite-promotion.dz/api/meeting-requests

# Santé
curl -s -o /dev/null -w "%{http_code}" https://api.elite-promotion.dz/up
```

Tableau de bord équipe : `https://api.elite-promotion.dz/dashboard`
Panneau admin : `https://api.elite-promotion.dz/admin`

## 10. Zoom (optionnel) — création automatique de la réunion

Sans configuration, tout fonctionne déjà : l'employé colle un lien Zoom
créé manuellement via le champ « lien Zoom » du tableau de bord. Pour que
la réunion Zoom se crée **automatiquement** dès qu'une demande est acceptée
(avec envoi du vrai lien au client par email) :

1. Aller sur **marketplace.zoom.us** → *Develop* → *Build App*.
2. Choisir **Server-to-Server OAuth** (le type "JWT" est obsolète, ne pas
   l'utiliser).
3. Ajouter le scope **`meeting:write:admin`**.
4. Copier les 3 valeurs affichées (Account ID, Client ID, Client Secret)
   dans `.env` :
   ```
   ZOOM_ACCOUNT_ID=...
   ZOOM_CLIENT_ID=...
   ZOOM_CLIENT_SECRET=...
   ```
5. `php artisan config:cache` puis tester : accepter une demande depuis le
   tableau de bord → la carte affiche un bouton **« Démarrer sur Zoom »**
   et l'email client contient le vrai lien de réunion.

Si les identifiants sont absents, faux, ou si l'API Zoom est indisponible,
rien ne casse : l'acceptation réussit normalement, l'événement est
simplement journalisé (`storage/logs/laravel.log`) et l'employé peut
toujours coller un lien à la main.

## 11. Odoo (optionnel) — synchronisation CRM

Désactivé par défaut (`ODOO_ENABLED=false`) — aucune demande n'est envoyée
vers Odoo tant que ce n'est pas activé. Principe : chaque nouvelle demande
de réunion crée automatiquement une **piste (lead) dans Odoo CRM**
(`crm.lead`), pour que l'équipe commerciale retrouve la même demande dans
Odoo sans ressaisie.

Pour activer, une fois qu'une instance Odoo existe (Odoo Online ou
auto-hébergé) :

1. Dans Odoo : *Paramètres* → *Utilisateurs* → créer un utilisateur
   technique dédié à cette intégration, générer une **clé API** pour ce
   compte (menu utilisateur → *Préférences* → *Sécurité du compte* →
   *Nouvelle clé API*).
2. Compléter dans `.env` :
   ```
   ODOO_ENABLED=true
   ODOO_URL=https://nom-instance.odoo.com
   ODOO_DATABASE=nom-de-la-base
   ODOO_USERNAME=utilisateur-technique@domaine.dz
   ODOO_API_KEY=la-cle-generee-a-letape-1
   ```
3. `php artisan config:cache`.

Le code qui appelle Odoo se trouve dans `app/Services/OdooClient.php`
(API JSON-RPC standard d'Odoo) et `app/Listeners/SyncMeetingRequestToOdoo.php`.
Comme pour Zoom, toute erreur Odoo est journalisée sans jamais bloquer une
demande de réunion — l'intégration est un ajout, jamais un point de
défaillance pour le site.

**Si le client utilise déjà Odoo pour autre chose** (comptabilité, stock…),
ce module de synchronisation est le seul point à connecter — aucune autre
partie du site ni du tableau de bord n'a besoin d'Odoo pour fonctionner.

## Mises à jour ultérieures

```bash
cd /var/www/elite-backend
php artisan down
# déposer le nouveau code, puis :
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache && php artisan route:cache && php artisan view:cache
sudo supervisorctl restart all
php artisan up
```
