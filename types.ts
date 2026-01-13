
export type Category = 'All' | 'Living Room' | 'Bedroom' | 'Dining' | 'Office' | 'Outdoor';

export interface Product {
  id: string;
  name: string;
  category: Category;
  price: number;
  discountPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  isNew?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface SortOption {
  label: string;
  value: 'default' | 'price-asc' | 'price-desc' | 'rating';
}
