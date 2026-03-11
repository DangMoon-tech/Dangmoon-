import { supabase } from '../lib/supabase';

export const storageService = {
  async uploadFile(bucket: string, path: string, file: File): Promise<string | null> {
    try {
      console.log(`Uploading to bucket "${bucket}", path "${path}"`);
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        // If 'assets' bucket is missing, try 'asset'
        if (bucket === 'assets' && (error.message.toLowerCase().includes('not found') || (error as any).status === 404)) {
          console.warn('Bucket "assets" not found, trying "asset"');
          return this.uploadFile('asset', path, file);
        }
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      console.log('Upload successful, public URL:', publicUrl);
      return publicUrl;
    } catch (error: any) {
      console.error('Error in storageService.uploadFile:', error);
      // If we've already tried 'asset' and it failed, or if it's a different error
      return null;
    }
  },

  getPublicUrl(bucket: string, path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    return publicUrl;
  }
};
