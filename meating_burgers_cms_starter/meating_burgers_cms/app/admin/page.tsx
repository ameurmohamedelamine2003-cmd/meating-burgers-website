"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Dish={id:string;name:string;description:string|null;price:number;image_url:string|null;category:string|null;is_available:boolean};
const blank={name:"",description:"",price:"",image_url:"",category:"Burgers",is_available:true};
export default function Admin(){
 const supabase=createClient();const router=useRouter();const [dishes,setDishes]=useState<Dish[]>([]);const [form,setForm]=useState(blank);const [editing,setEditing]=useState<string|null>(null);const [message,setMessage]=useState("Loading your menu...");const [email,setEmail]=useState("");
 async function load(){const {data:{user}}=await supabase.auth.getUser();if(!user){router.replace("/login");return;}setEmail(user.email||"");const {data,error}=await supabase.from("dishes").select("*").order("sort_order");if(error)setMessage(error.message);else{setDishes((data||[]) as Dish[]);setMessage("");}}
 useEffect(()=>{load();},[]);
 async function save(e:React.FormEvent){e.preventDefault();const payload={name:form.name,description:form.description,price:Number(form.price),image_url:form.image_url||null,category:form.category,is_available:form.is_available};const result=editing?await supabase.from("dishes").update(payload).eq("id",editing):await supabase.from("dishes").insert(payload);if(result.error){setMessage(result.error.message);return;}setForm(blank);setEditing(null);setMessage("Menu saved successfully.");load();}
 function edit(d:Dish){setEditing(d.id);setForm({name:d.name,description:d.description||"",price:String(d.price),image_url:d.image_url||"",category:d.category||"Burgers",is_available:d.is_available});window.scrollTo({top:0,behavior:"smooth"});}
 async function remove(id:string){if(!confirm("Delete this menu item?"))return;const {error}=await supabase.from("dishes").delete().eq("id",id);if(error)setMessage(error.message);else{setMessage("Item deleted.");load();}}
 async function logout(){await supabase.auth.signOut();router.push("/login");router.refresh();}
 return <main className="adminshell"><header className="adminhead"><div><a className="brand" href="/">MEATING<span>.</span></a><h1>Website Dashboard</h1><p className="muted">Signed in as {email}</p></div><div className="toolbar"><a className="btn secondary" href="/" target="_blank">View Website ↗</a><button className="secondary" onClick={logout}>Sign Out</button></div></header>
 <section className="panel"><h2>{editing?"Edit Menu Item":"Add a Menu Item"}</h2><form onSubmit={save}><div className="formgrid">
 <div className="field"><label>Dish name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="e.g. Double Smash Burger"/></div>
 <div className="field"><label>Price (USD) *</label><input required type="number" min="0" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="14.99"/></div>
 <div className="field"><label>Category</label><select value={form.category} onChange={e=>setForm({...form,category:e.target.value})}><option>Burgers</option><option>Sides</option><option>Drinks</option><option>Desserts</option><option>Specials</option></select></div>
 <div className="field"><label>Image URL</label><input value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} placeholder="https://..."/></div>
 <div className="field full"><label>Description</label><textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the dish and ingredients"/></div>
 <div className="field"><label>Availability</label><select value={form.is_available?"yes":"no"} onChange={e=>setForm({...form,is_available:e.target.value==="yes"})}><option value="yes">Available on website</option><option value="no">Hidden from website</option></select></div>
 </div><div className="toolbar" style={{marginTop:18}}><button>{editing?"Save Changes":"Add to Menu"}</button>{editing&&<button type="button" className="secondary" onClick={()=>{setEditing(null);setForm(blank)}}>Cancel</button>}</div></form></section>
 <section className="panel"><div className="adminhead"><div><h2>Your Menu</h2><p className="muted">Add, edit, hide or delete dishes. Changes appear on the public website.</p></div><strong>{dishes.length} items</strong></div>{message&&<p className="muted">{message}</p>}{dishes.length>0?<div style={{overflowX:"auto"}}><table className="table"><thead><tr><th>Dish</th><th>Price</th><th>Status</th><th>Actions</th></tr></thead><tbody>{dishes.map(d=><tr key={d.id}><td><strong>{d.name}</strong><div className="muted">{d.category}</div></td><td>${Number(d.price).toFixed(2)}</td><td>{d.is_available?"Visible":"Hidden"}</td><td><div className="toolbar"><button className="secondary" onClick={()=>edit(d)}>Edit</button><button className="danger" onClick={()=>remove(d.id)}>Delete</button></div></td></tr>)}</tbody></table></div>:<p className="muted">Your menu is empty. Add your first dish above.</p>}</section>
 <p className="muted">Tip: Use a direct image URL for now. A future version can include image uploads, restaurant hours, gallery and promotions.</p></main>;
}
