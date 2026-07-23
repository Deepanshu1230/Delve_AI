"use client"

import { createClient, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {  useRouter } from 'next/navigation'

const supabase= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Dashboard(){
   const [user,setUser]=useState<User | null>(null);
   const router=useRouter();
    useEffect(()=>{
    async function getInfo(){
        const {data,error}=await supabase.auth.getUser();
        if(data.user){
            setUser(data.user);

        }
        

    }

    getInfo();
        

    },[]);


    async function handleLogout(){
        await supabase.auth.getUser();
        setUser(null);
    }
    return <div className="pt-6">
        {user?.email ? <button onClick={()=>{ handleLogout()}} className="bg-green"> Logout</button> :<button onClick={()=> { router.push('/auth')}}>Login</button> }
        Hi we are on the dashboard
        {user?.email}
    </div>
}