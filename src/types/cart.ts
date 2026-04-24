/**
 * Shared cart types — used by both C1 (merchant) and C2 (customer) screens.
 */

export type CartItem = {
  id:         string;
  name:       string;
  /** Formatted label e.g. "$30.00" */
  priceLabel: string;
  /** Raw number for calculations */
  priceValue: number;
  quantity:   number;
};

export type CartState = {
  items:      CartItem[];
  selectedId: string | null;
  /** Sum of all (price × qty) */
  total:      number;
  /** Formatted total "$0.00" */
  chargeAmount: string;
  /** Number of unique line items */
  orderCount: number;
};

export type CartActions = {
  addOrIncrement: (id: string, name: string, priceLabel: string, priceValue: number) => void;
  changeQty:      (id: string, delta: number) => void;
  deleteItem:     (id: string) => void;
  setSelectedId:  (id: string | null) => void;
  clearCart:      () => void;
};
