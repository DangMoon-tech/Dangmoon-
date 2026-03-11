import { supabase } from '../lib/supabase';

export const settingsService = {
  async getSetting(key: string): Promise<string | null> {
    try {
      let query = supabase
        .from('site_settings')
        .select('value')
        .eq('key', key);

      // Try to order by updated_at if it exists, otherwise just take the first one
      const { data, error } = await query
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        // Fallback for cases where updated_at might not exist yet
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', key)
          .limit(1)
          .maybeSingle();
        
        if (fallbackError) throw fallbackError;
        if (fallbackData?.value) return fallbackData.value;
      }
      
      if (data?.value) return data.value;
      
      return null;
    } catch (error) {
      console.error(`Error fetching setting ${key}:`, error);
      return null;
    }
  },

  async updateSetting(key: string, value: string): Promise<void> {
    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        key, 
        value, 
        updated_at: new Date().toISOString() 
      }, {
        onConflict: 'key'
      });

    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      throw error;
    }
  }
};
