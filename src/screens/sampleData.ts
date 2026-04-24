/**
 * Sample product data — ST Debit Nudge Experiment
 *
 * Matches the Figma grid (Smart Terminal Glass 2.0 · node 3759:969 / 14:10212).
 * Photos use the 10 local mock-item images; label-only products use a solid color.
 */
import { ProductCardProps } from '../components/register/ProductCard';

// ─── Local mock images (assets/mock-items/) ───────────────────────────────────
const img0  = require('../../assets/mock-items/image.png');
const img1  = require('../../assets/mock-items/image-1.png');
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
    id:         'p3',
    name:       'Polo T-Shirt',
    price:      '',
    seeAll:     true,
    status:     'in-stock',
    imageSource: img1,
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
