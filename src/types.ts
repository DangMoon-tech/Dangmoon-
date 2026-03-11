import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  file_url?: string;
  rating: number;
  downloads: number;
  is_free: boolean;
  created_at?: string;
}

export const CATEGORIES = [
  'All Products',
  'AI Tools',
  'Creative',
  'Developer',
  'Figma Resources',
  'Free',
  'Icons & Graphics',
  'Most Downloaded',
  'Notion Templates',
  'SaaS Landing Pages',
  'Templates',
  'UI Kits'
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Dt',
    description: 'Premium SaaS Landing Page Template built with React and Tailwind CSS.',
    price: 60,
    category: 'SaaS Landing Pages',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    downloads: 1250,
    is_free: false
  },
  {
    id: '2',
    name: 'Dr',
    description: 'Modern Icon Set for developer tools and dashboards.',
    price: 10,
    category: 'Icons & Graphics',
    image_url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    downloads: 850,
    is_free: false
  },
  {
    id: '3',
    name: 'D',
    description: 'Creative Asset Pack for digital designers.',
    price: 50,
    category: 'Creative',
    image_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    downloads: 2100,
    is_free: false
  },
  {
    id: '4',
    name: 'Free Template',
    description: 'A simple starter template for your next project.',
    price: 0,
    category: 'Free',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
    rating: 4.2,
    downloads: 5000,
    is_free: true
  }
];
