import {
  getCustomizationExtra,
  getCartItemUnitPrice,
  getCartItemTotal,
  getCartSubtotal,
} from '../lib/pricing';

describe('getCustomizationExtra', () => {
  it('retourne 0 si aucune personnalisation', () => {
    expect(getCustomizationExtra([])).toBe(0);
    expect(getCustomizationExtra(undefined)).toBe(0);
  });

  it('additionne les priceExtra des personnalisations', () => {
    const customizations = [
      { name: 'Sauce', priceExtra: 0.5 },
      { name: 'Fromage', priceExtra: 1.0 },
    ];
    expect(getCustomizationExtra(customizations)).toBeCloseTo(1.5);
  });

  it('ignore les priceExtra non numériques', () => {
    const customizations = [
      { name: 'Option', priceExtra: 'gratuit' },
      { name: 'Fromage', priceExtra: 1.0 },
    ];
    expect(getCustomizationExtra(customizations as any)).toBeCloseTo(1.0);
  });

  it('ignore les priceExtra null/undefined', () => {
    const customizations = [
      { name: 'Option' },
      { name: 'Fromage', priceExtra: 0.5 },
    ];
    expect(getCustomizationExtra(customizations as any)).toBeCloseTo(0.5);
  });
});

describe('getCartItemUnitPrice', () => {
  it('retourne le prix de base sans personnalisation', () => {
    const cartItem = { item: { price: 8.5, title: 'Burger' }, quantity: 1 };
    expect(getCartItemUnitPrice(cartItem)).toBeCloseTo(8.5);
  });

  it('ajoute les extras de personnalisation au prix de base', () => {
    const cartItem = {
      item: {
        price: 8.5,
        title: 'Burger',
        customizations: [{ name: 'Bacon', priceExtra: 1.5 }],
      },
      quantity: 1,
    };
    expect(getCartItemUnitPrice(cartItem)).toBeCloseTo(10.0);
  });

  it('retourne 0 si le prix est manquant', () => {
    const cartItem = { item: { title: 'Burger' }, quantity: 1 };
    expect(getCartItemUnitPrice(cartItem as any)).toBe(0);
  });
});

describe('getCartItemTotal', () => {
  it('multiplie le prix unitaire par la quantité', () => {
    const cartItem = {
      item: { price: 8.5, title: 'Burger' },
      quantity: 3,
    };
    expect(getCartItemTotal(cartItem)).toBeCloseTo(25.5);
  });

  it('avec personnalisation et plusieurs unités', () => {
    const cartItem = {
      item: {
        price: 8.0,
        title: 'Burger',
        customizations: [{ name: 'Bacon', priceExtra: 1.0 }],
      },
      quantity: 2,
    };
    expect(getCartItemTotal(cartItem)).toBeCloseTo(18.0);
  });

  it('retourne prix unitaire si quantité vaut 1', () => {
    const cartItem = { item: { price: 5.5, title: 'Soda' }, quantity: 1 };
    expect(getCartItemTotal(cartItem)).toBeCloseTo(5.5);
  });
});

describe('getCartSubtotal', () => {
  it('retourne 0 pour un panier vide', () => {
    expect(getCartSubtotal([])).toBe(0);
  });

  it('retourne 0 si le panier est invalide', () => {
    expect(getCartSubtotal(null as any)).toBe(0);
  });

  it('additionne les totaux de chaque article', () => {
    const cart = [
      { item: { price: 8.5, title: 'Burger' }, quantity: 2 },
      { item: { price: 3.0, title: 'Soda' }, quantity: 1 },
    ];
    expect(getCartSubtotal(cart)).toBeCloseTo(20.0);
  });

  it('prend en compte les personnalisations', () => {
    const cart = [
      {
        item: {
          price: 8.0,
          title: 'Burger',
          customizations: [{ name: 'Bacon', priceExtra: 1.0 }],
        },
        quantity: 2,
      },
      { item: { price: 2.5, title: 'Eau' }, quantity: 2 },
    ];
    expect(getCartSubtotal(cart)).toBeCloseTo(23.0);
  });

  it('calcul correct avec commande mixte', () => {
    const cart = [
      { item: { price: 10.0, title: 'Menu Solo' }, quantity: 1 },
      { item: { price: 6.0, title: 'Menu Duo', customizations: [{ name: 'Extra', priceExtra: 2.0 }] }, quantity: 2 },
      { item: { price: 1.5, title: 'Sauce' }, quantity: 3 },
    ];
    // 10 + (6+2)*2 + 1.5*3 = 10 + 16 + 4.5 = 30.5
    expect(getCartSubtotal(cart)).toBeCloseTo(30.5);
  });
});

describe('Calcul du total avec livraison', () => {
  it('click-and-collect : pas de frais de livraison', () => {
    const cart = [{ item: { price: 15.0, title: 'Menu' }, quantity: 1 }];
    const subtotal = getCartSubtotal(cart);
    const deliveryFee = 0;
    expect(subtotal + deliveryFee).toBeCloseTo(15.0);
  });

  it('livraison : frais ajoutés au sous-total', () => {
    const cart = [{ item: { price: 15.0, title: 'Menu' }, quantity: 1 }];
    const subtotal = getCartSubtotal(cart);
    const deliveryFee = 2.5;
    expect(subtotal + deliveryFee).toBeCloseTo(17.5);
  });

  it('livraison avec ville personnalisée (frais différents)', () => {
    const cart = [{ item: { price: 20.0, title: 'Commande' }, quantity: 2 }];
    const subtotal = getCartSubtotal(cart);
    const deliveryFee = 3.5;
    expect(subtotal + deliveryFee).toBeCloseTo(43.5);
  });
});
