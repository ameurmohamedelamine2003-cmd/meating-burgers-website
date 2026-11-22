"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState(""); const [busy,setBusy]=useState(false);
  const router=useRouter(); const supabase=createClient();
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage("");const {error}=await supabase.auth.signInWithPassword({email,password});setBusy(false);if(error){setMessage(error.message);return;}router.push("/admin");router.refresh();}
  return <main className="loginbox"><a className="brand" href="/">MEATING<span>.</span></a><h1>Owner Login</h1><p className="muted">Sign in to manage your restaurant website.</p><form onSubmit={submit}><div className="field"><label>Email address</label><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="owner@restaurant.com"/></div><div className="field" style={{marginTop:14}}><label>Password</label><input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Your password"/></div><button style={{width:"100%",marginTop:18}} disabled={busy}>{busy?"Signing in...":"Sign In"}</button>{message&&<p className="error">{message}</p>}</form><p className="muted"><a href="/">← Back to website</a></p></main>;
}
