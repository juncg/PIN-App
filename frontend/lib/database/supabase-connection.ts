import { createClient } from "@supabase/supabase-js";
import { Database } from "./supabase";

const supabaseKey = process.env.SUPABASE_API_KEY || "";
const supabaseUrl = process.env.SUPABASE_URL || "http://127.0.0.1:8000";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);
