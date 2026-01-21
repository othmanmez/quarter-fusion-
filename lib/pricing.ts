export function getCustomizationExtra(customizations?: any[]): number {
  if (!Array.isArray(customizations)) return 0;
  return customizations.reduce((sum, custom) => {
    const extra = typeof custom?.priceExtra === 'number' ? custom.priceExtra : 0;
    return sum + extra;
  }, 0);
}

export function getCartItemUnitPrice(cartItem: any): number {
  const basePrice = cartItem?.item?.price ?? cartItem?.price ?? 0;
  const extras = getCustomizationExtra(
    cartItem?.item?.customizations ?? cartItem?.customizations
  );
  return basePrice + extras;
}

export function getCartItemTotal(cartItem: any): number {
  const quantity = cartItem?.quantity ?? 1;
  return getCartItemUnitPrice(cartItem) * quantity;
}

export function getCartSubtotal(cart: any[]): number {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((total, item) => total + getCartItemTotal(item), 0);
}
