#!/bin/bash

###############################################################################
# SCRIPT D'INSTALLATION AUTOMATIQUE - VPS Quarter Fusion
###############################################################################
#
# Ce script installe et configure automatiquement tout ce dont vous avez
# besoin sur votre VPS pour héberger Quarter Fusion.
#
# UTILISATION :
#   1. Connectez-vous à votre VPS en SSH : ssh root@VOTRE_IP
#   2. Téléchargez ce script :
#      curl -o setup.sh https://raw.githubusercontent.com/VOTRE_REPO/quarter-fusion/main/scripts/vps-setup.sh
#   3. Rendez-le exécutable : chmod +x setup.sh
#   4. Exécutez-le : ./setup.sh
#
###############################################################################

set -e  # Arrêter en cas d'erreur

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_step() {
    echo -e "${BLUE}==>${NC} ${GREEN}$1${NC}"
}

print_error() {
    echo -e "${RED}❌ ERREUR: $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  ATTENTION: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Vérifier que le script est exécuté en tant que root
if [[ $EUID -ne 0 ]]; then
   print_error "Ce script doit être exécuté en tant que root (avec sudo)"
   exit 1
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║        INSTALLATION AUTOMATIQUE - QUARTER FUSION VPS         ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""

# Variables
GITHUB_REPO=""
DOMAIN_NAME=""
USER_NAME="quarterfusion"

# Questions interactives
read -p "URL de votre dépôt GitHub (ex: https://github.com/user/quarter-fusion): " GITHUB_REPO
read -p "Nom de domaine (laissez vide si vous n'en avez pas encore): " DOMAIN_NAME
read -p "Voulez-vous créer un utilisateur non-root? (recommandé) [Y/n]: " CREATE_USER

if [[ $CREATE_USER != "n" && $CREATE_USER != "N" ]]; then
    read -p "Nom d'utilisateur [quarterfusion]: " USER_INPUT
    if [[ ! -z "$USER_INPUT" ]]; then
        USER_NAME="$USER_INPUT"
    fi
fi

echo ""
print_step "Configuration:"
echo "  - Dépôt GitHub: $GITHUB_REPO"
echo "  - Domaine: ${DOMAIN_NAME:-"Non configuré (utilisation de l'IP)"}"
echo "  - Utilisateur: $USER_NAME"
echo ""
read -p "Continuer? [Y/n]: " CONFIRM

if [[ $CONFIRM == "n" || $CONFIRM == "N" ]]; then
    print_warning "Installation annulée"
    exit 0
fi

###############################################################################
# ÉTAPE 1 : Mise à jour du système
###############################################################################
print_step "Mise à jour du système..."
apt update && apt upgrade -y
print_success "Système mis à jour"

###############################################################################
# ÉTAPE 2 : Installation de Node.js 20 LTS
###############################################################################
print_step "Installation de Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
print_success "Node.js $(node --version) installé"

###############################################################################
# ÉTAPE 3 : Installation des outils système
###############################################################################
print_step "Installation de nginx, git, et outils de sécurité..."
apt install -y nginx git ufw fail2ban curl
print_success "Outils installés"

###############################################################################
# ÉTAPE 4 : Installation de PM2
###############################################################################
print_step "Installation de PM2..."
npm install -g pm2
print_success "PM2 installé"

###############################################################################
# ÉTAPE 5 : Configuration du firewall
###############################################################################
print_step "Configuration du firewall UFW..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
print_success "Firewall configuré et activé"

###############################################################################
# ÉTAPE 6 : Création de l'utilisateur non-root
###############################################################################
if [[ $CREATE_USER != "n" && $CREATE_USER != "N" ]]; then
    print_step "Création de l'utilisateur $USER_NAME..."

    if id "$USER_NAME" &>/dev/null; then
        print_warning "L'utilisateur $USER_NAME existe déjà"
    else
        adduser --disabled-password --gecos "" $USER_NAME
        echo "$USER_NAME:$(openssl rand -base64 12)" | chpasswd
        usermod -aG sudo $USER_NAME

        # Copier les clés SSH
        if [ -d /root/.ssh ]; then
            mkdir -p /home/$USER_NAME/.ssh
            cp /root/.ssh/authorized_keys /home/$USER_NAME/.ssh/ 2>/dev/null || true
            chown -R $USER_NAME:$USER_NAME /home/$USER_NAME/.ssh
            chmod 700 /home/$USER_NAME/.ssh
            chmod 600 /home/$USER_NAME/.ssh/authorized_keys 2>/dev/null || true
        fi

        print_success "Utilisateur $USER_NAME créé"
    fi
fi

###############################################################################
# ÉTAPE 7 : Clonage du projet
###############################################################################
print_step "Clonage du projet GitHub..."

if [[ -z "$GITHUB_REPO" ]]; then
    print_warning "Aucun dépôt GitHub spécifié, ignoré"
else
    USER_HOME="/home/$USER_NAME"
    PROJECT_DIR="$USER_HOME/quarter-fusion"

    if [ -d "$PROJECT_DIR" ]; then
        print_warning "Le projet existe déjà, mise à jour..."
        cd "$PROJECT_DIR"
        sudo -u $USER_NAME git pull
    else
        sudo -u $USER_NAME git clone "$GITHUB_REPO" "$PROJECT_DIR"
    fi

    cd "$PROJECT_DIR"
    print_success "Projet cloné dans $PROJECT_DIR"
fi

###############################################################################
# ÉTAPE 8 : Installation des dépendances Node.js
###############################################################################
if [ -d "$PROJECT_DIR" ]; then
    print_step "Installation des dépendances npm..."
    cd "$PROJECT_DIR"
    sudo -u $USER_NAME npm install
    print_success "Dépendances installées"
fi

###############################################################################
# ÉTAPE 9 : Configuration des variables d'environnement
###############################################################################
print_step "Configuration des variables d'environnement..."

if [ -d "$PROJECT_DIR" ]; then
    ENV_FILE="$PROJECT_DIR/.env.local"

    if [ ! -f "$ENV_FILE" ]; then
        # Générer un secret NextAuth
        NEXTAUTH_SECRET=$(openssl rand -base64 32)
        PRINTER_TOKEN=$(openssl rand -base64 32)

        cat > "$ENV_FILE" << EOF
# Base de données MongoDB
DATABASE_URL=mongodb+srv://quarterfusion:Quarter2025%21@cluster0.5brzic0.mongodb.net/quarter-fusion?retryWrites=true&w=majority&appName=Cluster0

# NextAuth
NEXTAUTH_URL=http://$(curl -s ifconfig.me)
NEXTAUTH_SECRET=$NEXTAUTH_SECRET

# Email Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=quarterfusion@gmail.com
EMAIL_PASS=fpcplcoqhgfmlkok
ADMIN_EMAIL=quarterfusion@gmail.com

# Impression à distance
AUTO_PRINT_ENABLED=true
REMOTE_PRINT_ENABLED=true
PRINTER_PUBLIC_URL=http://192.168.1.33:9000
PRINTER_AUTH_TOKEN=$PRINTER_TOKEN
EOF
        chown $USER_NAME:$USER_NAME "$ENV_FILE"
        print_success "Fichier .env.local créé"
        print_warning "IMPORTANT: Token d'impression: $PRINTER_TOKEN"
        print_warning "Notez ce token pour la configuration de la tablette!"
    else
        print_warning ".env.local existe déjà, non modifié"
    fi
fi

###############################################################################
# ÉTAPE 10 : Build du projet
###############################################################################
if [ -d "$PROJECT_DIR" ]; then
    print_step "Build du projet Next.js..."
    cd "$PROJECT_DIR"
    sudo -u $USER_NAME npx prisma generate
    sudo -u $USER_NAME npm run build
    print_success "Projet compilé"
fi

###############################################################################
# ÉTAPE 11 : Configuration de PM2
###############################################################################
if [ -d "$PROJECT_DIR" ]; then
    print_step "Configuration de PM2..."
    cd "$PROJECT_DIR"

    # Arrêter les processus PM2 existants
    sudo -u $USER_NAME pm2 delete quarter-fusion 2>/dev/null || true

    # Démarrer le projet
    sudo -u $USER_NAME pm2 start npm --name "quarter-fusion" -- start
    sudo -u $USER_NAME pm2 save

    # Configurer le démarrage automatique
    env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER_NAME --hp /home/$USER_NAME

    print_success "PM2 configuré et démarré"
fi

###############################################################################
# ÉTAPE 12 : Configuration de nginx
###############################################################################
print_step "Configuration de nginx..."

SERVER_NAME="${DOMAIN_NAME:-$(curl -s ifconfig.me)}"
NGINX_CONF="/etc/nginx/sites-available/quarter-fusion"

cat > "$NGINX_CONF" << EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    access_log /var/log/nginx/quarter-fusion-access.log;
    error_log /var/log/nginx/quarter-fusion-error.log;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Activer le site
ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Tester et redémarrer nginx
nginx -t
systemctl restart nginx

print_success "nginx configuré"

###############################################################################
# ÉTAPE 13 : Installation de Certbot (SSL) si domaine fourni
###############################################################################
if [[ ! -z "$DOMAIN_NAME" ]]; then
    print_step "Installation de Certbot pour SSL..."
    apt install -y certbot python3-certbot-nginx

    print_warning "Pour activer SSL, exécutez manuellement:"
    echo "  sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME"
fi

###############################################################################
# FIN
###############################################################################
echo ""
echo "╔═══════════════════════════════════════════════════════════════╗"
echo "║                                                               ║"
echo "║                  ✅ INSTALLATION TERMINÉE !                   ║"
echo "║                                                               ║"
echo "╚═══════════════════════════════════════════════════════════════╝"
echo ""
print_success "Votre site est maintenant accessible sur:"
echo "  👉 http://$SERVER_NAME"
echo ""
print_success "Interface admin:"
echo "  👉 http://$SERVER_NAME/admin"
echo "  Email: quarterfusion@gmail.com"
echo "  Mot de passe: admin123"
echo ""
print_warning "PROCHAINES ÉTAPES:"
echo "  1. Configurez la tablette Android avec Termux"
echo "  2. Utilisez le token d'impression affiché ci-dessus"
echo "  3. Testez une commande complète"
if [[ ! -z "$DOMAIN_NAME" ]]; then
    echo "  4. Activez SSL avec: sudo certbot --nginx -d $DOMAIN_NAME"
fi
echo ""
print_success "Commandes utiles:"
echo "  - Voir les logs: pm2 logs quarter-fusion"
echo "  - Redémarrer: pm2 restart quarter-fusion"
echo "  - Statut: pm2 status"
echo ""
print_success "Bon lancement avec Quarter Fusion ! 🚀"
echo ""
