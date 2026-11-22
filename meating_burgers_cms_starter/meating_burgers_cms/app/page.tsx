import { createClient } from "@/lib/supabase/server";

type Dish = { id: string; name: string; description: string | null; price: number; image_url: string | null; category: string | null; is_available: boolean };

export default async function Home() {
  let dishes: Dish[] = [];
  let restaurant = { name: "MEATING BURGERS", tagline: "BIG FLAVOR. NO SHORTCUTS.", address: "31 NW 9th St, Miami, FL 33136", phone: "+1 786-881-1473", hours: "Check our current hours before visiting." };
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("dishes").select("*").eq("is_available", true).order("sort_order");
    if (data) dishes = data as Dish[];
    const { data: settings } = await supabase.from("restaurant_settings").select("*").eq("id", 1).maybeSingle();
    if (settings) restaurant = { ...restaurant, ...settings };
  } catch {}
  const sample = [
    {id:"sample1",name:"The Classic",description:"Juicy beef patty, American cheese, lettuce, tomato and house sauce.",price:12.5,image_url:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",category:"Burgers"},
    {id:"sample2",name:"Double Trouble",description:"Two smashed patties, double cheese, pickles and signature sauce.",price:15,image_url:"https://images.unsplash.com/photo-1553979459-d2229ba7433a?w=800",category:"Burgers"},
    {id:"sample3",name:"Crispy Chicken",description:"Crispy chicken, slaw, pickles and a creamy spicy sauce.",price:13.5,image_url:"https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800",category:"Burgers"}
  ];
  const menu = dishes.length ? dishes : sample;
  return <main><div className="wrap">
    <nav className="nav"><a className="brand" href="#">MEATING<span>.</span></a><div className="navlinks"><a href="#menu">Menu</a><a href="#about">Our Story</a><a href="#visit">Find Us</a></div><a className="btn" href="#menu">Explore Menu</a></nav>
    <section className="hero"><div><div className="eyebrow">Downtown Miami · Burgers & Good Times</div><h1>{restaurant.tagline || "BIG FLAVOR. NO SHORTCUTS."}</h1><p>Made for big appetites and good company. Find your next favorite burger, made fresh and served with attitude.</p><div className="actions"><a className="btn" href="#menu">View the Menu</a><a className="btn secondary" href={`tel:${restaurant.phone}`}>Call the Restaurant</a></div><span className="notice">Independent website concept · Confirm business details before launch</span></div><div className="heroimg" role="img" aria-label="Illustrative burger photograph"/></section>
    <section className="section" id="menu"><div className="eyebrow">Made to hit the spot</div><h2>THE MENU</h2><div className="cards">{menu.map(d=><article className="dish" key={d.id}><img src={d.image_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800"} alt={d.name}/><div className="dishbody"><div className="dishhead"><strong>{d.name}</strong><span className="price">${Number(d.price).toFixed(2)}</span></div><p className="muted">{d.description}</p></div></article>)}</div>{!dishes.length&&<p className="muted">Sample menu shown for preview. The restaurant owner can replace these items from the admin dashboard after setup.</p>}</section>
    <section className="section" id="about"><div className="eyebrow">Good food. Good people.</div><h2>MORE THAN A BURGER</h2><p className="muted">A neighborhood spot for stacked burgers, crispy sides and the kind of meal worth coming back for. Replace this story with the restaurant’s approved brand story before publishing.</p></section>
    <section className="section" id="visit"><div className="eyebrow">Come through</div><h2>FIND US IN MIAMI</h2><p className="muted">{restaurant.address}</p><p><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a></p><p className="muted">{restaurant.hours}</p><div className="actions"><a className="btn" target="_blank" rel="noreferrer" href="https://www.google.com/maps/search/?api=1&query=31+NW+9th+St+Miami+FL+33136">Get Directions</a></div></section>
    <footer className="footer"><span>© {new Date().getFullYear()} {restaurant.name}. All rights reserved.</span><a href="/login">Owner Login</a></footer>
  </div></main>;
}
