/** Free standard shipping from this subtotal; a flat fee below it. */
export const FREE_SHIPPING_FROM = 50;
export const SHIPPING_FEE = 7;

export const shippingFor = (subtotal: number) => (subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE);

export const usd = (n: number) => `$${n.toFixed(2)}`;
