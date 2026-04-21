import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      sports_categories: {
        Row: {
          id: string;
          name: string;
          description: string;
          icon: string;
          min_age: number;
          max_age: number;
          registration_fee: number;
          is_active: boolean;
          created_at: string;
        };
      };
      participants: {
        Row: {
          id: string;
          user_id: string;
          full_name: string;
          email: string;
          phone: string;
          date_of_birth: string;
          country: string;
          school_club: string;
          registration_type: 'individual' | 'school' | 'club';
          photo_url: string;
          id_document_url: string;
          created_at: string;
        };
      };
      registrations: {
        Row: {
          id: string;
          participant_id: string;
          sport_id: string;
          payment_status: 'pending' | 'completed' | 'failed';
          payment_method: string;
          payment_reference: string;
          registration_date: string;
          status: 'registered' | 'confirmed' | 'cancelled';
        };
      };
      events: {
        Row: {
          id: string;
          sport_id: string;
          title: string;
          description: string;
          event_date: string;
          venue: string;
          status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
          created_at: string;
        };
      };
      results: {
        Row: {
          id: string;
          event_id: string;
          participant_id: string;
          position: number;
          score: string;
          medal: 'gold' | 'silver' | 'bronze' | '';
          created_at: string;
        };
      };
    };
  };
};
