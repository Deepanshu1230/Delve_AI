import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient(){
    return createClient(
        "https://nrewsqjfjynklbqgxfnw.supabase.co",
        process.env.SUPABASE_SECRET_KEY!
    )
}