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

export type VariantProduct = {
  id:           string;
  name:         string;
  imageSource:  ImageSourcePropType;
  hasVariants:  true;
  variants:     ProductVariant[];
};
