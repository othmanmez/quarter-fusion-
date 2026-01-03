// Service d'impression Quarter Fusion pour Tablette
const http = require('http');
const { ThermalPrinter, PrinterTypes, CharacterSet } = require('node-thermal-printer');

const PORT = 9000;
const PRINTER_IP = '192.168.1.12';
const HOST = '0.0.0.0'; // Écouter sur toutes les interfaces (pas seulement localhost)

console.log('🖨️  Service d\'impression Quarter Fusion (Tablette)');
console.log(`📡 Écoute sur ${HOST}:${PORT}`);
console.log('✅ Prêt à imprimer !');

const server = http.createServer(async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/print') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const order = JSON.parse(body);
        
        console.log(`🖨️  Impression commande #${order.orderNumber}...`);
        console.log(`   Client: ${order.customerName}`);
        console.log(`   Total: ${order.total}€`);
        
        // Créer l'imprimante
        const printer = new ThermalPrinter({
          type: PrinterTypes.EPSON,
          interface: `tcp://${PRINTER_IP}:9100`,
          characterSet: 'PC850_MULTILINGUAL',
          removeSpecialCharacters: false,
          lineCharacter: '=',
          width: 48,
        });

        // Formatage du ticket
        printer.alignCenter();
        printer.setTextSize(1, 1);
        printer.bold(true);
        printer.println('QUARTER FUSION');
        printer.bold(false);
        printer.setTextSize(0, 0);
        printer.drawLine();
        
        printer.println('');
        printer.setTextDoubleHeight(true);
        printer.bold(true);
        printer.println(`COMMANDE #${order.orderNumber}`);
        printer.bold(false);
        printer.setTextDoubleHeight(false);
        printer.println('');
        
        printer.drawLine();
        
        // Client
        printer.alignLeft();
        printer.bold(true);
        printer.println(`CLIENT: ${order.customerName}`);
        printer.bold(false);
        printer.println(`Tel: ${order.phone}`);
        
        if (order.isDelivery && order.deliveryAddress) {
          printer.println(`Adresse: ${order.deliveryAddress}`);
          if (order.city) printer.println(`Ville: ${order.city}`);
        }
        
        printer.drawLine();
        
        // Articles
        printer.bold(true);
        printer.println('ARTICLES:');
        printer.bold(false);
        printer.println('');
        
        order.items.forEach(item => {
          const line = `${item.quantity}x ${item.title}`;
          const price = `${(item.price * item.quantity).toFixed(2)}E`;
          const spaces = ' '.repeat(48 - line.length - price.length);
          printer.println(line + spaces + price);
          
          if (item.customizations && item.customizations.length > 0) {
            item.customizations.forEach(custom => {
              if (custom.selectedOptions && custom.selectedOptions.length > 0) {
                custom.selectedOptions.forEach(opt => {
                  printer.println(`  * ${opt}`);
                });
              }
            });
          }
        });
        
        printer.drawLine();
        
        // Total
        printer.setTextSize(1, 1);
        printer.bold(true);
        const totalLine = `TOTAL: ${order.total.toFixed(2)}E`;
        const totalSpaces = ' '.repeat(Math.floor((48 - totalLine.length) / 2));
        printer.println(totalSpaces + totalLine);
        printer.bold(false);
        printer.setTextSize(0, 0);
        
        printer.drawLine();
        
        // Paiement
        printer.alignCenter();
        printer.println(`Paiement: ${order.paymentMethod === 'ESPECES' ? 'Especes' : 'Carte'}`);
        
        if (order.notes) {
          printer.println('');
          printer.println(`Note: ${order.notes}`);
        }
        
        printer.println('');
        printer.println('Merci et a bientot !');
        printer.println('');
        printer.println('');
        printer.println('');
        
        printer.cut();
        
        // Exécuter l'impression
        await printer.execute();
        
        console.log(`✅ Commande #${order.orderNumber} imprimée !`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Ticket imprimé' }));
        
      } catch (error) {
        console.error('❌ Erreur:', error);
        console.error('   Détails:', error.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'online', message: 'Service opérationnel' }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n🎯 Service démarré sur ${HOST}:${PORT}`);
  console.log(`📱 Accessible depuis le réseau local`);
  console.log(`🖨️  Imprimante: ${PRINTER_IP}:9100`);
  console.log(`\n💡 Pour arrêter : Ctrl+C\n`);
});

// Gestion propre de l'arrêt
process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du service d\'impression...');
  server.close(() => {
    console.log('✅ Service arrêté proprement.');
    process.exit(0);
  });
});

