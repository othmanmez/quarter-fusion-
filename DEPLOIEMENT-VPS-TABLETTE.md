# Guide Complet - VPS + Tablette Android

## Architecture Simple et Efficace

```
┌──────────────────────────┐
│  CLIENTS (Internet)      │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│  VPS - Site Next.js      │
│  (Hetzner 4,51€/mois)    │
│  - nginx + PM2           │
│  - MongoDB Atlas         │
│  - APIs                  │
└────────┬─────────────────┘
         │ Internet
         ▼
┌──────────────────────────┐
│  TABLETTE ANDROID        │
│  (Termux - Gratuit)      │
│  - Service d'impression  │
│  - Port 9000             │
└────────┬─────────────────┘
         │ WiFi local
         ▼
┌──────────────────────────┐
│  IMPRIMANTE THERMIQUE    │
│  192.168.1.12:9100       │
└──────────────────────────┘
```

**Coût total** : 4,51€/mois (VPS seulement)

---

## PARTIE 1 : Créer et Configurer le VPS

### Étape 1.1 : Créer un compte Hetzner

1. Allez sur https://www.hetzner.com
2. Cliquez sur "Sign Up"
3. Vérifiez votre email
4. Connectez-vous à https://console.hetzner.cloud

### Étape 1.2 : Créer le VPS

1. **Créer un projet** :
   - Cliquez sur "New Project"
   - Nom : "Quarter Fusion"

2. **Ajouter un serveur** :
   - Cliquez sur "Add Server"
   - **Location** : Nuremberg, Germany (proche de la France)
   - **Image** : Ubuntu 22.04
   - **Type** : Shared vCPU > CX22 (2 vCPU, 4GB RAM) - 4,51€/mois
   - **Volume** : Aucun
   - **Network** : Default
   - **SSH Key** : On va le créer maintenant

3. **Créer votre clé SSH** (sur votre PC WSL) :

```bash
# Générer la clé
ssh-keygen -t ed25519 -C "quarterfusion-vps"
# Appuyez sur Entrée 3 fois

# Afficher la clé publique
cat ~/.ssh/id_ed25519.pub
```

4. **Copier la clé dans Hetzner** :
   - Copiez tout le résultat de la commande ci-dessus
   - Dans Hetzner, cliquez sur "Add SSH Key"
   - Collez la clé
   - Nom : "Ma clé SSH"
   - Cliquez sur "Add SSH Key"
   - Sélectionnez cette clé

5. **Finaliser** :
   - **Name** : quarter-fusion
   - **Cloud config** : Laissez vide
   - Cliquez sur "Create & Buy now"

6. **Noter l'IP** :
   - Une fois créé, **notez l'adresse IP publique**
   - Exemple : 65.108.123.45

### Étape 1.3 : Première connexion

```bash
# Remplacez VOTRE_IP par l'IP de votre VPS
ssh root@VOTRE_IP

# Répondez "yes" à la question de connexion
```

Vous êtes maintenant connecté à votre VPS !

---

## PARTIE 2 : Installation Automatique

J'ai créé un script qui fait tout automatiquement. Sur votre VPS :

### Script d'installation complète

```bash
# Télécharger et exécuter le script d'installation
curl -o setup.sh https://raw.githubusercontent.com/VOTRE_REPO/quarter-fusion/main/scripts/vps-setup.sh
chmod +x setup.sh
./setup.sh
```

**OU si vous préférez faire manuellement, suivez les étapes ci-dessous** :

### Installation manuelle étape par étape

#### 2.1 - Mettre à jour le système

```bash
apt update && apt upgrade -y
```

#### 2.2 - Installer Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Doit afficher v20.x
```

#### 2.3 - Installer les outils nécessaires

```bash
apt install -y nginx git ufw fail2ban
npm install -g pm2
```

#### 2.4 - Configurer le firewall

```bash
# Autoriser SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
ufw status
```

#### 2.5 - Créer un utilisateur non-root

```bash
# Créer l'utilisateur
adduser quarterfusion
# Définissez un mot de passe

# Donner les droits sudo
usermod -aG sudo quarterfusion

# Copier les clés SSH
mkdir -p /home/quarterfusion/.ssh
cp ~/.ssh/authorized_keys /home/quarterfusion/.ssh/
chown -R quarterfusion:quarterfusion /home/quarterfusion/.ssh
chmod 700 /home/quarterfusion/.ssh
chmod 600 /home/quarterfusion/.ssh/authorized_keys

# Basculer vers ce user
su - quarterfusion
```

---

## PARTIE 3 : Déployer le Site

### 3.1 - Cloner votre projet

Si votre projet est sur GitHub :

```bash
cd ~
git clone https://github.com/VOTRE_USERNAME/quarter-fusion.git
cd quarter-fusion
```

Si votre projet n'est pas encore sur GitHub, uploadez-le d'abord :

```bash
# Sur votre PC WSL
cd /mnt/c/Users/othma/OneDrive/Bureau/quarter-fusion--1

# Initialiser Git si pas déjà fait
git init
git add .
git commit -m "Initial commit"

# Créer un repo sur GitHub puis :
git remote add origin https://github.com/VOTRE_USERNAME/quarter-fusion.git
git push -u origin main
```

### 3.2 - Installer les dépendances

```bash
cd ~/quarter-fusion
npm install
```

### 3.3 - Configurer les variables d'environnement

```bash
nano .env.local
```

Copiez cette configuration (adaptez les valeurs) :

```env
# Base de données MongoDB
DATABASE_URL=mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

# NextAuth - IMPORTANT : Changez l'URL par votre IP VPS
NEXTAUTH_URL=http://VOTRE_IP_VPS
NEXTAUTH_SECRET=ZX3cmpK5nCaFIz/lol2M5SQApw6BH5ThCBnd45vIKvo=

# Email Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=quarterfusion@gmail.com
EMAIL_PASS=fpcplcoqhgfmlkok
ADMIN_EMAIL=quarterfusion@gmail.com

# Impression à distance via tablette
AUTO_PRINT_ENABLED=true
REMOTE_PRINT_ENABLED=true

# URL du service sur la tablette (vous la configurerez après)
# Format : http://IP_TABLETTE:9000
PRINTER_PUBLIC_URL=http://192.168.1.33:9000

# Token de sécurité - GÉNÉREZ-EN UN NOUVEAU !
PRINTER_AUTH_TOKEN=CHANGEZ_MOI_AVEC_UN_TOKEN_SECURISE
```

**Générer un token sécurisé** :
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copiez le résultat et remplacez `CHANGEZ_MOI_AVEC_UN_TOKEN_SECURISE`.

**Sauvegardez** : Ctrl+O puis Entrée, puis Ctrl+X

### 3.4 - Générer Prisma et construire le projet

```bash
npx prisma generate
npm run build
```

Cette étape peut prendre 2-3 minutes.

### 3.5 - Démarrer avec PM2

```bash
# Démarrer le site
pm2 start npm --name "quarter-fusion" -- start

# Sauvegarder la configuration PM2
pm2 save

# Démarrer PM2 au démarrage du serveur
pm2 startup
# Copiez et exécutez la commande affichée
```

Votre site tourne maintenant sur http://VOTRE_IP_VPS:3000

### 3.6 - Configurer nginx (proxy inverse)

```bash
sudo nano /etc/nginx/sites-available/quarter-fusion
```

Copiez cette configuration (remplacez VOTRE_IP_VPS) :

```nginx
server {
    listen 80;
    server_name VOTRE_IP_VPS;

    # Logs
    access_log /var/log/nginx/quarter-fusion-access.log;
    error_log /var/log/nginx/quarter-fusion-error.log;

    # Limite de taille des requêtes (pour upload images)
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

**Activer la configuration** :
```bash
sudo ln -s /etc/nginx/sites-available/quarter-fusion /etc/nginx/sites-enabled/
sudo nginx -t  # Vérifier qu'il n'y a pas d'erreur
sudo systemctl restart nginx
```

**Tester** : Ouvrez http://VOTRE_IP_VPS dans votre navigateur

---

## PARTIE 4 : Configurer la Tablette Android

### 4.1 - Prérequis

- Une tablette ou téléphone Android (même vieux, Android 7+)
- Connectée au même WiFi que l'imprimante
- Branchée sur secteur (pour rester allumée 24/7)

### 4.2 - Installer Termux

1. Ouvrez le **Play Store**
2. Cherchez "Termux"
3. Installez **Termux** (F-Droid version recommandée si disponible)
4. Ouvrez Termux

### 4.3 - Configuration initiale de Termux

```bash
# Mettre à jour les paquets
pkg update && pkg upgrade

# Installer Node.js
pkg install nodejs

# Vérifier l'installation
node --version
```

### 4.4 - Créer le service d'impression

```bash
# Créer le dossier
mkdir ~/quarter-fusion-printer
cd ~/quarter-fusion-printer

# Installer les dépendances
npm init -y
npm install express node-thermal-printer dotenv
```

### 4.5 - Télécharger le script d'impression

J'ai déjà créé le script `printer-service-tablet.js` dans votre projet.

**Copiez-le sur la tablette** :

Option 1 - Via GitHub :
```bash
curl -o printer-service.js https://raw.githubusercontent.com/VOTRE_REPO/quarter-fusion/main/printer-service-tablet.js
```

Option 2 - Copier manuellement :
```bash
nano printer-service.js
```
Puis copiez le contenu du fichier `printer-service-tablet.js`.

### 4.6 - Configurer les variables d'environnement

```bash
nano .env
```

Copiez cette configuration :

```env
# Port du service (ne pas changer)
PORT=9000

# IP et port de votre imprimante
PRINTER_INTERFACE=tcp://192.168.1.12:9100

# Type d'imprimante
PRINTER_TYPE=EPSON

# Largeur du ticket
PRINTER_WIDTH=48

# Token d'authentification (MÊME que sur le VPS)
PRINTER_AUTH_TOKEN=VOTRE_TOKEN_GENERE_SUR_LE_VPS
```

**Remplacez** :
- `192.168.1.12` par l'IP de votre imprimante
- `VOTRE_TOKEN_GENERE_SUR_LE_VPS` par le même token que dans le VPS

### 4.7 - Trouver l'IP de la tablette

```bash
# Dans Termux
ip route get 1.1.1.1 | awk '{print $7}'
```

**Notez cette IP** (exemple : 192.168.1.33)

### 4.8 - Démarrer le service

```bash
node printer-service.js
```

Vous devriez voir :
```
🖨️  SERVICE D'IMPRESSION QUARTER FUSION
✅ Service démarré sur le port 9000
```

### 4.9 - Tester l'impression

**Depuis votre PC** (ou depuis le VPS), testez :

```bash
# Remplacez 192.168.1.33 par l'IP de votre tablette
curl http://192.168.1.33:9000/health
```

Vous devriez voir :
```json
{"status":"ok","service":"Quarter Fusion Print Service"}
```

**Tester l'impression** :
```bash
curl -X POST http://192.168.1.33:9000/printer/test \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN"
```

Un ticket de test devrait s'imprimer !

### 4.10 - Rendre le service permanent

Pour que le service démarre automatiquement :

```bash
# Installer Termux:Boot (Play Store)
# Puis créer le script de démarrage
mkdir -p ~/.termux/boot
nano ~/.termux/boot/start-printer.sh
```

Copiez :
```bash
#!/data/data/com.termux/files/usr/bin/bash
cd ~/quarter-fusion-printer
node printer-service.js > printer.log 2>&1 &
```

Rendez exécutable :
```bash
chmod +x ~/.termux/boot/start-printer.sh
```

**Redémarrez la tablette** et le service démarrera automatiquement !

---

## PARTIE 5 : Connecter le VPS et la Tablette

### 5.1 - Mettre à jour les variables sur le VPS

```bash
# Sur le VPS
cd ~/quarter-fusion
nano .env.local
```

Modifiez :
```env
PRINTER_PUBLIC_URL=http://IP_TABLETTE:9000
```

Remplacez `IP_TABLETTE` par l'IP de votre tablette (ex: 192.168.1.33).

**Redémarrez le site** :
```bash
pm2 restart quarter-fusion
```

### 5.2 - Rendre la tablette accessible depuis Internet

**Option A** : Utiliser votre IP publique (simple mais nécessite ouverture de port)

1. Trouvez votre IP publique : https://www.whatismyip.com
2. Sur votre routeur (192.168.1.1), redirigez le port 9000 vers l'IP de la tablette
3. Changez dans le VPS :
```env
PRINTER_PUBLIC_URL=http://VOTRE_IP_PUBLIQUE:9000
```

**Option B** : Utiliser un tunnel (Cloudflare, ngrok) - gratuit

```bash
# Sur la tablette dans Termux
pkg install cloudflared
cloudflared tunnel --url http://localhost:9000
```

Cloudflared vous donnera une URL du type :
`https://abc-def-ghi.trycloudflare.com`

Utilisez cette URL dans le VPS :
```env
PRINTER_PUBLIC_URL=https://abc-def-ghi.trycloudflare.com
```

---

## PARTIE 6 : Tests Complets

### 6.1 - Tester le site

Ouvrez http://VOTRE_IP_VPS dans votre navigateur

- ✅ Page d'accueil s'affiche
- ✅ Menu visible
- ✅ Click & Collect fonctionne
- ✅ Livraison fonctionne

### 6.2 - Tester une commande complète

1. Passez une commande test
2. Vérifiez que l'email est reçu
3. Vérifiez que le ticket s'imprime automatiquement
4. Vérifiez l'admin : http://VOTRE_IP_VPS/admin

### 6.3 - Tester l'impression depuis l'admin

1. Connectez-vous à l'admin
2. Allez dans "Commandes"
3. Cliquez sur "Réimprimer" sur une commande
4. Le ticket doit s'imprimer

---

## PARTIE 7 : Domaine Personnalisé (Optionnel mais Recommandé)

### 7.1 - Acheter un domaine

Allez sur :
- **Namecheap** : https://www.namecheap.com (~10€/an)
- **OVH** : https://www.ovh.com (~5€/an pour .fr)

Achetez un domaine, exemple : `quarterfusion.fr`

### 7.2 - Configurer le DNS

Dans les paramètres DNS de votre domaine :

```
Type: A
Name: @
Value: IP_DE_VOTRE_VPS
TTL: 300

Type: A
Name: www
Value: IP_DE_VOTRE_VPS
TTL: 300
```

Attendez 5-30 minutes pour la propagation DNS.

### 7.3 - Installer SSL (HTTPS gratuit)

```bash
# Sur le VPS
sudo apt install -y certbot python3-certbot-nginx

# Obtenir le certificat
sudo certbot --nginx -d quarterfusion.fr -d www.quarterfusion.fr

# Suivez les instructions
# Choisissez : Redirect HTTP to HTTPS
```

### 7.4 - Mettre à jour NEXTAUTH_URL

```bash
cd ~/quarter-fusion
nano .env.local
```

Changez :
```env
NEXTAUTH_URL=https://quarterfusion.fr
```

Redémarrez :
```bash
pm2 restart quarter-fusion
```

**Votre site est maintenant sur HTTPS !** 🎉

---

## Maintenance

### Commandes utiles

```bash
# Voir les logs
pm2 logs quarter-fusion

# Redémarrer
pm2 restart quarter-fusion

# Statut
pm2 status

# Mettre à jour le site
cd ~/quarter-fusion
git pull
npm install
npm run build
pm2 restart quarter-fusion
```

### Surveillance de la tablette

```bash
# Sur la tablette
cd ~/quarter-fusion-printer
cat printer.log
```

---

## Coûts Finaux

- **VPS Hetzner** : 4,51€/mois
- **Domaine** : ~8€/an (~0,67€/mois)
- **Tablette** : Gratuit (utilisez ce que vous avez)

**Total** : ~5,20€/mois

---

## Vous Êtes Prêt ! 🚀

Votre site est maintenant :
- ✅ Hébergé sur un VPS professionnel
- ✅ Rapide et fiable
- ✅ Avec impression automatique
- ✅ Accessible 24/7
- ✅ Sécurisé

**Besoin d'aide ?** Suivez simplement ce guide étape par étape !
