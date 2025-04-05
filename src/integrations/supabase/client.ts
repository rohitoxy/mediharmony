
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kcnsnwaezgxnakoseflx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjbnNud2Flemd4bmFrb3NlZmx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1OTU1NjcsImV4cCI6MjA1NDE3MTU2N30.ZV95rNzZB2b8swBPz05OQdNg9Fj9Igj8V8doRB_S2H4";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Helper type for medication_history table until Supabase types are regenerated
export type MedicationHistoryRow = {
  id: string;
  medication_id: string;
  patient_id: string;
  medicine_name: string;
  dosage: string;
  scheduled_time: string;
  taken_time: string | null;
  status: 'scheduled' | 'taken' | 'missed';
  notes: string | null;
  created_at: string;
}
