/**
 * Shared cart types — used by both C1 (merchant) and C2 (customer) screens.
 */

/** A single modifier add-on selected from a checkbox/radio group */
export type CartAddOn = {
  label: string;   // e.g. "Free of cost"
  price: string;   // e.g. "+$0"
};

/** A discount applied to an item (also reused for fees) */
export type CartAppliedModifier = {
  label:   string;   // e.g. "Godaddy"
  value:   string;   // e.g. "10%"
  type:    '$' | '%';
  postTax: boolean;
};

export type CartItem = {
  id:         string;
  name:       string;
  /** Formatted label e.g. "$30.00" */
  priceLabel: string;
  /** Raw number for calculations */
  priceValue: number;
  quantity:   number;
  /** Optional note added via the modifier form */
  note?:      string;
  /** Modifier add-ons selected (checkboxes + radios) */
  addOns?:    CartAddOn[];
  /** Applied item-level discount */
  discount?:  CartAppliedModifier | null;
  /** Applied item-level fee */
  fee?:       CartAppliedModifier | null;
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

export type AddToCartPayload = {
  id:         string;
  name:       string;
  priceLabel: string;
  priceValue: number;
  note?:      string;
  addOns?:    CartAddOn[];
  discount?:  CartAppliedModifier | null;
  fee?:       CartAppliedModifier | null;
};

export type UpdateItemPayload = {
  note?:     string | undefined;
  addOns?:   CartAddOn[] | undefined;
  discount?: CartAppliedModifier | null | undefined;
  fee?:      CartAppliedModifier | null | undefined;
  quantity?: number | undefined;
};

export type CartActions = {
  addOrIncrement: (payload: AddToCartPayload) => void;
  updateItem:     (id: string, updates: UpdateItemPayload) => void;
  changeQty:      (id: string, delta: number) => void;
  deleteItem:     (id: string) => void;
  setSelectedId:  (id: string | null) => void;
  clearCart:      () => void;
};
