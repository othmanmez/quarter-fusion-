/**
 * SERVICE D'IMPRESSION POUR TABLETTE
 *
 * Ce service doit tourner sur votre tablette Android avec Termux
 * Il reçoit les commandes du site web et imprime sur l'imprimante Epson
 *
 * Installation sur tablette :
 * 1. pkg install nodejs
 * 2. npm install express node-thermal-printer
 * 3. node printer-service-tablet.js
 */

const express = require('express');
const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');

const app = express();
app.use(express.json());
app.use(express.text());

// Configuration de l'imprimante
const PRINTER_IP = '192.168.1.12';  // IP de votre imprimante Epson
const PRINTER_PORT = 9100;           // Port standard pour imprimantes réseau
const PORT = 9000;                   // Port du service sur la tablette

// Middleware pour les logs
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Route de test - pour vérifier que le service fonctionne
 */
app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    printer: {
      ip: PRINTER_IP,
      port: PRINTER_PORT
    },
    service: {
      port: PORT,
      uptime: process.uptime()
    }
  });
});

/**
 * Route d'impression - reçoit les commandes d'impression du site
 */
app.post('/print', async (req, res) => {
  try {
    console.log('📥 Réception d\'une commande d\'impression...');

    const order = req.body;

    // Validation
    if (!order.orderNumber || !order.items) {
      return res.status(400).json({
        success: false,
        error: 'Données invalides - orderNumber et items requis'
      });
    }

    console.log(`🖨️  Impression de la commande: ${order.orderNumber}`);

    // Initialiser l'imprimante
    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${PRINTER_IP}:${PRINTER_PORT}`,
      characterSet: 'PC858_EURO',
      removeSpecialCharacters: false,
      lineCharacter: "-",
      options: {
        timeout: 5000
      }
    });

    // Vérifier la connexion
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error(`Impossible de se connecter à l'imprimante ${PRINTER_IP}:${PRINTER_PORT}`);
    }

    console.log('✅ Connexion à l\'imprimante OK');

    // Construire le ticket
    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.setTextDoubleWidth();
    printer.bold(true);
    printer.println('QUARTER FUSION');
    printer.setTextNormal();
    printer.bold(false);
    printer.println('6 passage de l\'aurore');
    printer.println('95800 Cergy');
    printer.println('Tel: 01 30 17 31 78');
    printer.drawLine();

    // Type de commande
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println(order.isDelivery ? 'LIVRAISON' : 'CLICK & COLLECT');
    printer.setTextNormal();
    printer.bold(false);
    printer.newLine();

    // Numéro de commande
    printer.alignCenter();
    printer.bold(true);
    printer.println(`N° ${order.orderNumber}`);
    printer.bold(false);

    // Date et heure
    const date = new Date(order.createdAt || Date.now());
    const dateStr = date.toLocaleDateString('fr-FR');
    const timeStr = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    printer.println(`${dateStr} - ${timeStr}`);
    printer.drawLine();

    // Informations client
    printer.alignLeft();
    printer.bold(true);
    printer.println(`CLIENT: ${order.customerName.toUpperCase()}`);
    printer.bold(false);
    printer.println(`Tel: ${order.customerPhone}`);

    if (order.isDelivery && order.deliveryAddress) {
      printer.println(`Adresse: ${order.deliveryAddress}`);
      if (order.city) {
        printer.println(order.city);
      }
    }

    printer.drawLine();

    // Articles
    for (const item of order.items) {
      printer.bold(true);
      const itemLine = `${item.quantity}x ${item.title}`;
      const itemTotal = (item.price * item.quantity).toFixed(2);
      printer.tableCustom([
        { text: itemLine, align: 'LEFT', width: 0.7 },
        { text: `${itemTotal}€`, align: 'RIGHT', width: 0.3 }
      ]);
      printer.bold(false);

      // Personnalisations
      if (item.customizations && item.customizations.length > 0) {
        for (const custom of item.customizations) {
          if (custom.selectedOptions) {
            for (const option of custom.selectedOptions) {
              let optionText = `  + ${option}`;
              if (custom.priceExtra > 0) {
                printer.tableCustom([
                  { text: optionText, align: 'LEFT', width: 0.7 },
                  { text: `+${custom.priceExtra.toFixed(2)}€`, align: 'RIGHT', width: 0.3 }
                ]);
              } else {
                printer.println(optionText);
              }
            }
          }
        }
      }
    }

    // Total
    printer.drawLine();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.tableCustom([
      { text: 'TOTAL:', align: 'LEFT', width: 0.5, bold: true },
      { text: `${order.total.toFixed(2)}€`, align: 'RIGHT', width: 0.5, bold: true }
    ]);
    printer.setTextNormal();
    printer.bold(false);

    // Méthode de paiement
    printer.println(`Paiement: ${order.paymentMethod || 'ESPECES'}`);

    // Notes
    if (order.notes) {
      printer.drawLine();
      printer.bold(true);
      printer.println(`Notes: ${order.notes}`);
      printer.bold(false);
    }

    // Pied de page
    printer.drawLine();
    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println('BON APPETIT !');
    printer.setTextNormal();
    printer.bold(false);
    printer.println('Merci pour votre confiance');
    printer.println('@quarterfusion');
    printer.drawLine();

    printer.newLine();
    printer.newLine();
    printer.newLine();

    // Couper le papier
    printer.cut();

    // Envoyer à l'imprimante
    await printer.execute();
    console.log('✅ Ticket imprimé avec succès !');

    res.json({
      success: true,
      message: 'Ticket imprimé',
      orderNumber: order.orderNumber
    });

  } catch (error) {
    console.error('❌ Erreur d\'impression:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Route de test d'impression
 */
app.post('/test', async (req, res) => {
  try {
    console.log('🧪 Test d\'impression...');

    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: `tcp://${PRINTER_IP}:${PRINTER_PORT}`,
      characterSet: 'PC858_EURO',
      options: {
        timeout: 5000
      }
    });

    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error(`Imprimante non accessible sur ${PRINTER_IP}:${PRINTER_PORT}`);
    }

    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println('TEST IMPRIMANTE');
    printer.setTextNormal();
    printer.bold(false);
    printer.newLine();
    printer.println('Quarter Fusion');
    printer.println('Service d\'impression');
    printer.newLine();
    printer.println(`Date: ${new Date().toLocaleDateString('fr-FR')}`);
    printer.println(`Heure: ${new Date().toLocaleTimeString('fr-FR')}`);
    printer.newLine();
    printer.println('Imprimante: Epson TM-T20III');
    printer.println(`IP: ${PRINTER_IP}:${PRINTER_PORT}`);
    printer.newLine();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println('TEST OK !');
    printer.setTextNormal();
    printer.bold(false);
    printer.newLine();
    printer.newLine();
    printer.cut();

    await printer.execute();
    console.log('✅ Test d\'impression réussi !');

    res.json({
      success: true,
      message: 'Test d\'impression réussi'
    });

  } catch (error) {
    console.error('❌ Erreur test:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════════╗');
  console.log('║     SERVICE D\'IMPRESSION QUARTER FUSION - TABLETTE        ║');
  console.log('╚═══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✅ Service démarré sur le port ${PORT}`);
  console.log(`🖨️  Imprimante: ${PRINTER_IP}:${PRINTER_PORT}`);
  console.log('');
  console.log('📡 Endpoints disponibles:');
  console.log(`   - GET  /status  : Vérifier le statut du service`);
  console.log(`   - POST /test    : Test d'impression`);
  console.log(`   - POST /print   : Imprimer une commande`);
  console.log('');
  console.log('💡 Pour tester depuis votre réseau local:');
  console.log(`   curl http://VOTRE_IP_TABLETTE:${PORT}/status`);
  console.log('');
  console.log('⚠️  IMPORTANT: Gardez cette fenêtre ouverte !');
  console.log('');
});

// Gestion de l'arrêt propre
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du service d\'impression...');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Erreur non gérée:', error);
});
