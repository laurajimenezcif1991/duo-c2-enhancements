/**
 * Sample product data — ST Debit Nudge Experiment
 *
 * Matches the Figma grid (Smart Terminal Glass 2.0 · node 3759:969 / 14:10212).
 * Photos use the 10 local mock-item images; label-only products use a solid color.
 */
import { ProductCardProps } from '../components/register/ProductCard';
import type { ProductVariant, VariantProduct } from '../types/variants';

// ─── Local mock images (assets/mock-items/) ───────────────────────────────────
const img0  = require('../../assets/mock-items/image.png');
const img1  = require('../../assets/mock-items/polos.png');        // Polo T-Shirt (main card)
const img2  = require('../../assets/mock-items/image-2.png');
const img3  = require('../../assets/mock-items/image-3.png');
const img4  = require('../../assets/mock-items/image-4.png');
const img5  = require('../../assets/mock-items/image-5.png');
const img6  = require('../../assets/mock-items/image-6.png');
const img7  = require('../../assets/mock-items/image-7.png');
const img8  = require('../../assets/mock-items/image-8.png');
const img9  = require('../../assets/mock-items/image-9.png');

export const SAMPLE_PRODUCTS: (ProductCardProps & { id: string })[] = [
  // ── Row 1 ─────────────────────────────────────────────────────────────────
  {
    id:            'p1',
    name:          'Yellow Leather Backpack',
    price:         '$30.00',
    originalPrice: '$35.00',
    quantity:      20,
    status:        'in-stock',
    imageSource:   img0,
  },
  {
    id:         'p2',
    name:       'Hair Pin',
    price:      '$35.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#1976D2',
    labelText:  'HAIRP',
  },
  {
    id:          'p3',
    name:        'Polo T-Shirt',
    price:       '$19.99',
    status:      'in-stock',
    imageSource: img1,
    hasVariants: true,
  },
  {
    id:            'p4',
    name:          'Leather Belts',
    price:         '$30.00',
    originalPrice: '$35.00',
    quantity:      5,
    status:        'low-in-stock',
    imageSource:   img2,
  },
  // ── Row 2 ─────────────────────────────────────────────────────────────────
  {
    id:         'p5',
    name:       'Travel Backpack',
    price:      '$30.00',
    quantity:   0,
    status:     'out-of-stock',
    imageSource: img3,
  },
  {
    id:         'p6',
    name:       'Flight Jacket',
    price:      '',
    seeAll:     true,
    status:     'in-stock',
    imageSource: img4,
  },
  {
    id:            'p7',
    name:          'Nike Sneakers',
    price:         '$30.00',
    originalPrice: '$35.00',
    quantity:      20,
    status:        'in-stock',
    imageSource:   img5,
  },
  {
    id:         'p8',
    name:       'Levis Jeans',
    price:      '$35.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#C62828',
    labelText:  'LEVIS',
  },
  // ── Row 3 ─────────────────────────────────────────────────────────────────
  {
    id:         'p9',
    name:       'Coffe Mugs',
    price:      '$35.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#EF6C0F',
    labelText:  'CMUGS',
  },
  {
    id:         'p10',
    name:       'Card Holders',
    price:      '$35.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#00796B',
    labelText:  'CARDH',
  },
  {
    id:         'p11',
    name:       'Bnew T-Shirt Collection',
    price:      '',
    seeAll:     true,
    status:     'in-stock',
    imageSource: img6,
  },
  {
    id:            'p12',
    name:          'Brown Jacket',
    price:         '$30.00',
    originalPrice: '$35.00',
    quantity:      20,
    status:        'in-stock',
    imageSource:   img7,
  },
  // ── Row 4 ─────────────────────────────────────────────────────────────────
  {
    id:         'p13',
    name:       'Leather Wallet',
    price:      '$35.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#8B0053',
    labelText:  'WALLE',
  },
  {
    id:         'p14',
    name:       "Men's Long Sleeve Shirt",
    price:      '$30.00',
    quantity:   3,
    status:     'low-in-stock',
    imageSource: img8,
  },
  {
    id:       'p15',
    name:     'Women Yellow Scarf',
    price:    '$35.00',
    quantity: 47,
    status:   'in-stock',
    imageSource: img9,
  },
  {
    id:         'p16',
    name:       'Necklace',
    price:      '$35.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#2E7D32',
    labelText:  'NECKL',
  },
  // ── Row 5 ─────────────────────────────────────────────────────────────────
  {
    id:         'p17',
    name:       'High Heel',
    price:      '$35.00',
    quantity:   47,
    status:     'in-stock',
    imageSource: img0,   // reuse closest match
  },
  {
    id:         'p18',
    name:       'Yellow Socks',
    price:      '$25.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#F9A825',
    labelText:  'YSOCKS',
  },
  {
    id:         'p19',
    name:       'Bracelet',
    price:      '$40.00',
    quantity:   12,
    status:     'in-stock',
    labelColor: '#7B1FA2',
    labelText:  'BRACE',
  },
  {
    id:            'p20',
    name:          'Blue Coat',
    price:         '$30.00',
    originalPrice: '$35.00',
    quantity:      20,
    status:        'in-stock',
    imageSource:   img7,  // reuse closest match
  },
];

// ─── Polo T-Shirt variant images (exported from Figma assets/mock-items) ─────
const imgPoloBlue  = require('../../assets/mock-items/Thumbnail.png');    // Blue polo
const imgPoloOos   = require('../../assets/mock-items/Thumbnail-1.png');  // Gray/OOS polo
const imgPoloGreen = require('../../assets/mock-items/Thumbnail-2.png');  // Green polo
const imgPoloRed   = require('../../assets/mock-items/polo-red.png');     // Red polo

// ─── Polo T-Shirt variants (p3) ───────────────────────────────────────────────
// Colors: Blue · Red · Green  |  Sizes: S · M · L · XL
// Figma: Register-App-2025 · node 6539:116671 (Product List View Pattern)

const POLO_VARIANTS: ProductVariant[] = [
  // ── Blue ──────────────────────────────────────────────────────────────────
  { id: 'p3-blue-s',  color: 'Blue',  size: 'S',  price: '$19.99', priceValue: 19.99, stock: 30, status: 'in-stock',     imageSource: imgPoloBlue },
  { id: 'p3-blue-m',  color: 'Blue',  size: 'M',  price: '$19.99', priceValue: 19.99, stock: 30, status: 'in-stock',     imageSource: imgPoloBlue },
  { id: 'p3-blue-l',  color: 'Blue',  size: 'L',  price: '$19.99', priceValue: 19.99, stock: 30, status: 'in-stock',     imageSource: imgPoloBlue },
  { id: 'p3-blue-xl', color: 'Blue',  size: 'XL', price: '$19.99', priceValue: 19.99, stock:  0, status: 'out-of-stock', imageSource: imgPoloOos  },
  // ── Red ───────────────────────────────────────────────────────────────────
  { id: 'p3-red-s',   color: 'Red',   size: 'S',  price: '$19.99', priceValue: 19.99, stock:  5, status: 'low-in-stock', imageSource: imgPoloRed  },
  { id: 'p3-red-m',   color: 'Red',   size: 'M',  price: '$19.99', priceValue: 19.99, stock: 40, status: 'in-stock',     imageSource: imgPoloRed  },
  { id: 'p3-red-l',   color: 'Red',   size: 'L',  price: '$19.99', priceValue: 19.99, stock: 40, status: 'in-stock',     imageSource: imgPoloRed  },
  { id: 'p3-red-xl',  color: 'Red',   size: 'XL', price: '$19.99', priceValue: 19.99, stock: 40, status: 'in-stock',     imageSource: imgPoloRed  },
  // ── Green ─────────────────────────────────────────────────────────────────
  { id: 'p3-grn-s',   color: 'Green', size: 'S',  price: '$19.99', priceValue: 19.99, stock: 30, status: 'in-stock',     imageSource: imgPoloGreen },
  { id: 'p3-grn-m',   color: 'Green', size: 'M',  price: '$19.99', priceValue: 19.99, stock: 30, status: 'in-stock',     imageSource: imgPoloGreen },
  { id: 'p3-grn-l',   color: 'Green', size: 'L',  price: '$19.99', priceValue: 19.99, stock: 30, status: 'in-stock',     imageSource: imgPoloGreen },
  { id: 'p3-grn-xl',  color: 'Green', size: 'XL', price: '$19.99', priceValue: 19.99, stock: 30, status: 'in-stock',     imageSource: imgPoloGreen },
];

const imgPolosMain = require('../../assets/mock-items/polos.png');

export const VARIANT_PRODUCTS: Record<string, VariantProduct> = {
  p3: {
    id:          'p3',
    name:        'Polo T-Shirt',
    imageSource: imgPolosMain,
    hasVariants: true,
    variants:    POLO_VARIANTS,
  },
};
