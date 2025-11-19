import { ThermalPrinter, PrinterTypes } from 'node-thermal-printer';

interface OrderItem {
  title: string;
  quantity: number;
  price: number;
  description?: string;
  customizations?: Array<{
    name: string;
    selectedOptions: string[];
    priceExtra: number;
  }>;
}

interface PrintOrder {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  isDelivery: boolean;
  deliveryAddress?: string;
  city?: string;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
}

/**
 * Configuration de l'imprimante thermique
 * À adapter selon votre modèle d'imprimante
 */
export function getPrinterConfig() {
  return {
    type: PrinterTypes.EPSON, // ou STAR, TANCA
    interface: process.env.PRINTER_INTERFACE || 'tcp://192.168.1.100', // IP de l'imprimante
    // Ou pour USB : 'usb://04b8:0e15'
    // Ou pour connexion série : '/dev/usb/lp0'
    characterSet: 'PC850_MULTILINGUAL',
    width: 48, // Largeur en caractères (48 pour 80mm, 32 pour 58mm)
    removeSpecialCharacters: false,
  };
}

/**
 * Créer une instance de l'imprimante
 */
export function createPrinter() {
  const config = getPrinterConfig();
  const printer = new ThermalPrinter(config);
  return printer;
}

/**
 * Formater un prix en euros
 */
function formatPrice(price: number): string {
  return price.toFixed(2) + '€';
}

/**
 * Centrer un texte
 */
function centerText(text: string, width: number): string {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
}

/**
 * Créer une ligne de séparation
 */
function separator(width: number, char: string = '-'): string {
  return char.repeat(width);
}

/**
 * Aligner un texte à gauche et un autre à droite
 */
function alignLeftRight(left: string, right: string, width: number): string {
  const spaces = Math.max(1, width - left.length - right.length);
  return left + ' '.repeat(spaces) + right;
}

/**
 * Imprimer un ticket de commande
 */
export async function printOrderTicket(order: PrintOrder): Promise<boolean> {
  try {
    const printer = createPrinter();
    const width = 48;

    printer.newLine();
    
    // ========== EN-TÊTE ==========
    printer.alignCenter();
    printer.println('================================================');
    printer.setTextDoubleHeight();
    printer.setTextDoubleWidth();
    printer.bold(true);
    printer.println('QUARTER');
    printer.println('FUSION');
    printer.bold(false);
    printer.setTextNormal();
    printer.println('6 passage de l\'aurore - 95800 Cergy');
    printer.println('Tel: 01 30 17 31 78');
    printer.println('================================================');

    // ========== TYPE DE COMMANDE + N° ==========
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.invert(true);
    if (order.isDelivery) {
      printer.println('  LIVRAISON  ');
    } else {
      printer.println(' CLICK & COLLECT ');
    }
    printer.invert(false);
    printer.bold(false);
    printer.setTextNormal();
    printer.newLine();

    // Numéro de commande
    printer.bold(true);
    printer.println('N° ' + order.orderNumber);
    printer.bold(false);
    
    // Date et heure
    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString('fr-FR');
    const timeStr = date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    printer.println(dateStr + ' - ' + timeStr);
    printer.println('================================================');

    // ========== CLIENT ==========
    printer.alignLeft();
    printer.bold(true);
    printer.println('CLIENT: ' + order.customerName.toUpperCase());
    printer.bold(false);
    printer.println('Tel: ' + order.customerPhone);
    
    if (order.isDelivery && order.deliveryAddress) {
      printer.println('Adresse: ' + order.deliveryAddress);
      if (order.city) {
        printer.println(order.city);
      }
    }
    printer.println('------------------------------------------------');

    // ========== ARTICLES ==========
    let subtotal = 0;

    order.items.forEach((item, index) => {
      // Nom de l'article
      printer.bold(true);
      const itemLine = `${item.quantity}x ${item.title}`;
      const itemPrice = item.price * item.quantity;
      printer.println(alignLeftRight(itemLine, formatPrice(itemPrice), width));
      printer.bold(false);
      
      subtotal += itemPrice;

      // Personnalisations (condensées)
      if (item.customizations && item.customizations.length > 0) {
        item.customizations.forEach((custom) => {
          custom.selectedOptions.forEach((option) => {
            if (custom.priceExtra > 0) {
              printer.println(
                alignLeftRight(`  + ${option}`, `+${formatPrice(custom.priceExtra)}`, width)
              );
              subtotal += custom.priceExtra * item.quantity;
            } else {
              printer.println(`  + ${option}`);
            }
          });
        });
      }
    });

    // ========== TOTAL ==========
    printer.println('------------------------------------------------');
    printer.alignLeft();
    
    // Total
    printer.bold(true);
    printer.setTextDoubleHeight();
    printer.println(alignLeftRight('TOTAL:', formatPrice(order.total), width));
    printer.setTextNormal();
    printer.bold(false);
    
    // Paiement
    printer.println(alignLeftRight('Paiement:', order.paymentMethod.toUpperCase(), width));
    
    // Notes
    if (order.notes) {
      printer.println('------------------------------------------------');
      printer.bold(true);
      printer.println('Notes: ' + order.notes);
      printer.bold(false);
    }

    // ========== FIN ==========
    printer.println('================================================');
    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println('BON APPETIT !');
    printer.bold(false);
    printer.setTextNormal();
    printer.println('Merci pour votre confiance');
    printer.println('@quarterfusion');
    printer.println('================================================');
    printer.newLine();
    printer.newLine();

    // QR Code ou code-barres (optionnel)
    // printer.printQR(order.orderNumber, { cellSize: 8 });
    // printer.newLine();

    // Coupe du papier
    printer.cut();

    // Envoyer à l'imprimante
    await printer.execute();
    
    console.log(`✅ Ticket imprimé pour la commande ${order.orderNumber}`);
    return true;

  } catch (error) {
    console.error('❌ Erreur lors de l\'impression du ticket:', error);
    return false;
  }
}

/**
 * Tester l'imprimante
 */
export async function testPrinter(): Promise<boolean> {
  try {
    const printer = createPrinter();
    
    printer.alignCenter();
    printer.setTextDoubleHeight();
    printer.bold(true);
    printer.println('TEST IMPRIMANTE');
    printer.bold(false);
    printer.setTextNormal();
    printer.newLine();
    
    printer.alignLeft();
    printer.println('Imprimante connectee avec succes !');
    printer.println('Date: ' + new Date().toLocaleString('fr-FR'));
    printer.newLine();
    printer.newLine();
    
    printer.cut();
    
    await printer.execute();
    console.log('✅ Test d\'impression réussi');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'impression:', error);
    return false;
  }
}

/**
 * Vérifier si l'imprimante est disponible
 */
export async function checkPrinterStatus(): Promise<boolean> {
  try {
    const printer = createPrinter();
    // Tentative de connexion simple
    await printer.isPrinterConnected();
    return true;
  } catch (error) {
    console.error('❌ Imprimante non disponible:', error);
    return false;
  }
}

/**
 * Vérifier la connexion à l'imprimante (pour l'API)
 */
export async function checkPrinterConnection(): Promise<boolean> {
  try {
    const enabled = process.env.AUTO_PRINT_ENABLED === 'true';
    if (!enabled) {
      return false;
    }

    const printerInterface = process.env.PRINTER_INTERFACE;
    if (!printerInterface) {
      return false;
    }

    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: printerInterface,
      characterSet: 'PC850_MULTILINGUAL',
      removeSpecialCharacters: false,
      lineCharacter: '=',
      width: parseInt(process.env.PRINTER_WIDTH || '48'),
    });

    // Test de connexion simple
    const isConnected = await printer.isPrinterConnected();
    return isConnected;
  } catch (error) {
    console.error('Erreur lors de la vérification de la connexion:', error);
    return false;
  }
}

/**
 * Imprimer un ticket de test (pour l'admin)
 */
export async function printTestTicket() {
  try {
    const enabled = process.env.AUTO_PRINT_ENABLED === 'true';
    if (!enabled) {
      throw new Error('Impression désactivée');
    }

    const printerInterface = process.env.PRINTER_INTERFACE;
    if (!printerInterface) {
      throw new Error('Interface imprimante non configurée');
    }

    const printer = new ThermalPrinter({
      type: PrinterTypes.EPSON,
      interface: printerInterface,
      characterSet: 'PC850_MULTILINGUAL',
      removeSpecialCharacters: false,
      lineCharacter: '=',
      width: parseInt(process.env.PRINTER_WIDTH || '48'),
    });

    // Vérifier la connexion
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) {
      throw new Error('Imprimante non connectée');
    }

    // Créer le ticket de test
    printer.alignCenter();
    printer.setTextSize(1, 1);
    printer.bold(true);
    printer.println('QUARTER FUSION');
    printer.bold(false);
    printer.setTextSize(0, 0);
    printer.println('6 passage de l\'aurore');
    printer.println('95800 Cergy');
    printer.println('Tel: 01 30 17 31 78');
    printer.newLine();

    printer.drawLine();
    printer.newLine();

    printer.setTextSize(1, 1);
    printer.bold(true);
    printer.println('TICKET DE TEST');
    printer.bold(false);
    printer.setTextSize(0, 0);
    printer.newLine();

    const now = new Date();
    const dateStr = now.toLocaleDateString('fr-FR');
    const timeStr = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    printer.alignLeft();
    printer.println(`Date: ${dateStr}`);
    printer.println(`Heure: ${timeStr}`);
    printer.newLine();

    printer.drawLine();
    printer.newLine();

    printer.alignCenter();
    printer.println('Si vous voyez ce ticket,');
    printer.println('l\'imprimante fonctionne !');
    printer.newLine();

    printer.setTextSize(1, 1);
    printer.bold(true);
    printer.println('TEST REUSSI');
    printer.bold(false);
    printer.setTextSize(0, 0);
    printer.newLine();

    printer.drawLine();
    printer.newLine();

    printer.println('Configuration:');
    printer.alignLeft();
    printer.println(`Type: EPSON`);
    printer.println(`Interface: ${printerInterface}`);
    printer.println(`Largeur: ${process.env.PRINTER_WIDTH || '48'} car.`);
    printer.newLine();

    printer.alignCenter();
    printer.println('Merci !');
    printer.newLine();
    printer.newLine();

    // Couper le papier
    printer.cut();

    // Envoyer à l'imprimante
    await printer.execute();

    console.log('✅ Ticket de test imprimé avec succès');
  } catch (error) {
    console.error('❌ Erreur lors de l\'impression du ticket de test:', error);
    throw error;
  }
}

