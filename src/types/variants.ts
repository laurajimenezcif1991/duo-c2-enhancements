/**
 * Variant types — Item Detail Drawer
 *
 * Used when a product has colour × size combinations that the merchant
 * must select before adding the item to the cart.
 */

import { ImageSourcePropType } from 'react-native';

export type VariantStatus = 'in-stock' | 'low-in-stock' | 'out-of-stock';

export type ProductVariant = {
  id:           string;
  color:        string;
  size:         string;
  price:        string;
  priceValue:   number;
  stock:        number;
  status:       VariantStatus;
  imageSource:  ImageSourcePropType;
};

// ─── Modifier groups ──────────────────────────────────────────────────────────

export type ModifierOption = {
  id:    string;
  label: string;
  price: string;  // e.g. "+$0", "+$1"
};

export type ModifierGroup =
  | { type: 'checkbox'; id: string; title: string; hint: string; options: ModifierOption[] }
  | { type: 'radio';    id: string; title: string; hint: string; options: ModifierOption[] };

export type VariantProduct = {
  id:              string;
  name:            string;
  imageSource:     ImageSourcePropType;
  hasVariants:     true;
  variants:        ProductVariant[];
  modifierGroups?: ModifierGroup[];
};
