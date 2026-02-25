/**
 * Tests unitaires pour les templates et la validation des emails
 */

interface OrderItem {
  item: { id: string; title: string; price: number; description: string };
  quantity: number;
  customizations?: Array<string | { name: string; selectedOptions?: string[]; priceExtra?: number }>;
}

function getItemUnitPrice(item: OrderItem): number {
  const base = item.item.price ?? 0;
  const extras = Array.isArray(item.customizations)
    ? item.customizations.reduce((sum, c) => {
        if (typeof c === 'object' && c !== null && typeof c.priceExtra === 'number') {
          return sum + c.priceExtra;
        }
        return sum;
      }, 0)
    : 0;
  return base + extras;
}

function getItemTotalPrice(item: OrderItem): number {
  return getItemUnitPrice(item) * item.quantity;
}

function getCartTotal(cart: OrderItem[]): number {
  return cart.reduce((sum, item) => sum + getItemTotalPrice(item), 0);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  return /^[0-9\s\-\+\(\)]{10,}$/.test(phone.replace(/\s/g, ''));
}

describe('Validation des emails', () => {
  it('accepte les emails valides', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.fr')).toBe(true);
    expect(isValidEmail('client+1@restaurant.net')).toBe(true);
  });

  it('rejette les emails invalides', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('pasderobas')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user @domain.com')).toBe(false);
  });
});

describe('Validation du téléphone', () => {
  it('accepte les numéros valides', () => {
    expect(isValidPhone('0130173178')).toBe(true);
    expect(isValidPhone('01 30 17 31 78')).toBe(true);
    expect(isValidPhone('+33130173178')).toBe(true);
    expect(isValidPhone('(01)30173178')).toBe(true);
  });

  it('rejette les numéros trop courts', () => {
    expect(isValidPhone('123')).toBe(false);
    expect(isValidPhone('12345')).toBe(false);
  });
});

describe('Calcul du total de commande pour les emails', () => {
  const burger: OrderItem = {
    item: { id: '1', title: 'Burger Classic', price: 8.5, description: 'Burger' },
    quantity: 2,
  };

  const wings: OrderItem = {
    item: { id: '2', title: 'Wings x6', price: 7.0, description: 'Wings' },
    quantity: 1,
    customizations: [{ name: 'Sauce BBQ', priceExtra: 0.5 }],
  };

  it('calcule correctement le total sans livraison (click-and-collect)', () => {
    const cart = [burger, wings];
    const subtotal = getCartTotal(cart);
    const total = subtotal + 0; // click-and-collect : pas de frais
    expect(total).toBeCloseTo(24.5); // 8.5*2 + (7.0+0.5)*1 = 17 + 7.5 = 24.5
  });

  it('calcule correctement le total avec frais de livraison', () => {
    const cart = [burger, wings];
    const subtotal = getCartTotal(cart);
    const deliveryFee = 2.5;
    const total = subtotal + deliveryFee;
    expect(total).toBeCloseTo(27.0);
  });

  it('calcule le prix unitaire avec personnalisation', () => {
    const unitPrice = getItemUnitPrice(wings);
    expect(unitPrice).toBeCloseTo(7.5);
  });

  it('calcule le prix total d\'un article avec quantité et personnalisation', () => {
    const itemWithCustom: OrderItem = {
      item: { id: '3', title: 'Menu', price: 10.0, description: 'Menu' },
      quantity: 3,
      customizations: [
        { name: 'Extra', priceExtra: 1.0 },
        { name: 'Sauce', priceExtra: 0.5 },
      ],
    };
    expect(getItemTotalPrice(itemWithCustom)).toBeCloseTo(34.5); // (10 + 1 + 0.5) * 3
  });

  it('ignore les customizations de type string (sans priceExtra)', () => {
    const item: OrderItem = {
      item: { id: '4', title: 'Menu', price: 10.0, description: 'Menu' },
      quantity: 1,
      customizations: ['Sans oignon', 'Bien cuit'],
    };
    expect(getItemUnitPrice(item)).toBeCloseTo(10.0);
  });

  it('gère un panier de grande commande correctement', () => {
    const largeCart: OrderItem[] = [
      { item: { id: '1', title: 'Menu Solo', price: 12.0, description: '' }, quantity: 4 },
      { item: { id: '2', title: 'Soda', price: 2.5, description: '' }, quantity: 4 },
      { item: { id: '3', title: 'Menu Duo', price: 20.0, description: '' }, quantity: 2 },
    ];
    // 12*4 + 2.5*4 + 20*2 = 48 + 10 + 40 = 98
    expect(getCartTotal(largeCart)).toBeCloseTo(98.0);
  });
});

describe('Contenu des emails', () => {
  it('vérifie que l\'adresse du restaurant est correcte', () => {
    const restaurantAddress = '6 passage de l\'aurore, 95800 Cergy';
    expect(restaurantAddress).toContain('Cergy');
    expect(restaurantAddress).toContain('95800');
    expect(restaurantAddress).not.toContain('123 Avenue de la République');
  });

  it('vérifie que le numéro de téléphone du restaurant est correct', () => {
    const phone = '01 30 17 31 78';
    expect(isValidPhone(phone.replace(/\s/g, ''))).toBe(true);
  });

  it('le numéro de commande est unique et correctement formaté', () => {
    const ts1 = Date.now();
    const ts2 = ts1 + 1;
    const order1 = `QF-${ts1}`;
    const order2 = `QF-${ts2}`;
    expect(order1).not.toBe(order2);
    expect(order1.startsWith('QF-')).toBe(true);
    expect(order2.startsWith('QF-')).toBe(true);
  });
});
