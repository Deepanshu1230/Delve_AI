"use client"

import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Auth(){
    async function login(provider: 'google' | 'github'){
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
              redirectTo: 'http://localhost:3000/login'
            }
}) 

  if(error){
    alert("Error while signing in");
  }
  else{
    alert("Signed In");
    
  }

    }
    return  <div>
      
        <button onClick={()=> login("google")}>Login with Google</button>
        <br/>
        <button onClick={() => login("github")}>Login with Github</button>
    </div>
    ;
}