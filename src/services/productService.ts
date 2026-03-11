import { supabase } from '../lib/supabase';
import { Product, INITIAL_PRODUCTS } from '../types';

export const productService = {
  async getProducts(): Promise<Product[]> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;

      if (!data || data.length === 0) {
        // If no products in DB, return initial products as fallback
        return INITIAL_PRODUCTS;
      }

      return data as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return INITIAL_PRODUCTS;
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    } catch (error) {
      console.error(`Error fetching product ${id}:`, error);
      return INITIAL_PRODUCTS.find(p => p.id === id) || null;
    }
  },

  async incrementDownloads(id: string): Promise<void> {
    try {
      const product = await this.getProductById(id);
      if (!product) return;

      const { error } = await supabase
        .from('products')
        .update({ downloads: (Number(product.downloads) || 0) + 1 })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error(`Error incrementing downloads for ${id}:`, error);
    }
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Product;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Helper to seed the database if needed
  async seedDatabase(): Promise<void> {
    try {
      const { data } = await supabase.from('products').select('id').limit(1);
      if (data && data.length > 0) return; // Already seeded

      const { error } = await supabase.from('products').insert(
        INITIAL_PRODUCTS.map(({ id, ...rest }) => rest)
      );

      if (error) throw error;
      console.log('Database seeded successfully');
    } catch (error) {
      console.error('Error seeding database:', error);
    }
  }
};
