
import { createClient } from "@/lib/supabase/server";

type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
};

const CATEGORY_IMAGES: Record<string, string> = {
  Burgers:
    "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000",
  Sides:
    "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=1000",
  Drinks:
    "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=1000",
  Desserts:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000",
  Specials:
    "https://images.unsplash.com/photo-1559847844-5315695dadae?w=1000",
};

const CATEGORIES = [
  "Burgers",
  "Sides",
  "Drinks",
  "Desserts",
  "Specials",
];

export default async function Home() {
  let dishes: Dish[] = [];

  let restaurant = {
    name: "MEATING BURGERS",
    tagline: "BIG FLAVOR. NO SHORTCUTS.",
    address: "31 NW 9th St, Miami, FL 33136",
    phone: "+1 786-881-1473",
    hours: "Check our current hours before visiting.",
  };

  try {
    const supabase = await createClient();

    const all: Dish[] = [];
    const pageSize = 500;

    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("dishes")
        .select(
          "id,name,description,price,image_url,category,is_available"
        )
        .eq("is_available", true)
        .order("sort_order", { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) throw error;

      all.push(...((data || []) as Dish[]));

      if (!data || data.length < pageSize) break;
    }

    dishes = all;

    const { data: settings } = await supabase
      .from("restaurant_settings")
      .select("*")
      .eq("id", 1)
      .maybeSingle();

    if (settings) {
      restaurant = { ...restaurant, ...settings };
    }
  } catch (error) {
    console.error("Could not load restaurant content", error);
  }

  const sample: Dish[] = [
    {
      id: "sample1",
      name: "The Classic",
      description:
        "Juicy beef patty, American cheese, lettuce, tomato and house sauce.",
      price: 12.5,
      image_url: null,
      category: "Burgers",
      is_available: true,
    },
    {
      id: "sample2",
      name: "Double Trouble",
      description:
        "Two smashed patties, double cheese, pickles and signature sauce.",
      price: 15,
      image_url: null,
      category: "Burgers",
      is_available: true,
    },
    {
      id: "sample3",
      name: "Crispy Fries",
      description: "Golden crispy fries, seasoned and served hot.",
      price: 5.5,
      image_url: null,
      category: "Sides",
      is_available: true,
    },
    {
      id: "sample4",
      name: "Fresh Lemonade",
      description: "Refreshing house lemonade.",
      price: 4,
      image_url: null,
      category: "Drinks",
      is_available: true,
    },
    {
      id: "sample5",
      name: "Chocolate Cake",
      description: "Rich chocolate dessert.",
      price: 6.5,
      image_url: null,
      category: "Desserts",
      is_available: true,
    },
  ];

  const menu = dishes.length ? dishes : sample;

  const grouped = CATEGORIES.map((category) => ({
    category,
    items: menu.filter(
      (dish) => (dish.category || "Burgers") === category
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <a className="brand" href="#">
            MEATING<span>.</span>
          </a>

          <div className="navlinks">
            <a href="#menu">Menu</a>
            <a href="#about">Our Story</a>
            <a href="#visit">Find Us</a>
          </div>

          <a className="btn" href="#menu">
            Explore Menu
          </a>
        </nav>

        <section className="hero">
          <div>
            <div className="eyebrow">
              Downtown Miami · Burgers & Good Times
            </div>

            <h1>
              {restaurant.tagline || "BIG FLAVOR. NO SHORTCUTS."}
            </h1>

            <p>
              Made for big appetites and good company. Find your next
              favorite meal, made fresh and served with attitude.
            </p>

            <div className="actions">
              <a className="btn" href="#menu">
                View the Menu
              </a>

              <a
                className="btn secondary"
                href={`tel:${restaurant.phone}`}
              >
                Call the Restaurant
              </a>
            </div>

            <span className="notice">
              Independent website concept · Confirm business details
              before launch
            </span>
          </div>

          <div
            className="heroimg"
            role="img"
            aria-label="Illustrative burger photograph"
          />
        </section>

        <section className="section" id="menu">
          <div className="eyebrow">Made to hit the spot</div>
          <h2>THE MENU</h2>

          {grouped.map((group) => (
            <section
              key={group.category}
              style={{ marginTop: 34 }}
            >
              <div className="adminhead">
                <h3>{group.category.toUpperCase()}</h3>

                <span className="muted">
                  {group.items.length} items
                </span>
              </div>

              <div className="cards">
                {group.items.map((dish) => (
                  <article className="dish" key={dish.id}>
                    <img
                      src={
                        dish.image_url ||
                        CATEGORY_IMAGES[
                          dish.category || "Burgers"
                        ] ||
                        CATEGORY_IMAGES.Burgers
                      }
                      alt={dish.name}
                      loading="lazy"
                    />

                    <div className="dishbody">
                      <div className="dishhead">
                        <strong>{dish.name}</strong>

                        <span className="price">
                          ${Number(dish.price).toFixed(2)}
                        </span>
                      </div>

                      {dish.description && (
                        <p className="muted">
                          {dish.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {!dishes.length && (
            <p className="muted">
              Sample menu shown for preview. Replace sample items
              with the restaurant's approved menu.
            </p>
          )}
        </section>

        <section className="section" id="about">
          <div className="eyebrow">Good food. Good people.</div>

          <h2>MORE THAN A BURGER</h2>

          <p className="muted">
            A neighborhood spot for stacked burgers, crispy sides
            and the kind of meal worth coming back for. Replace this
            story with the restaurant’s approved brand story before
            publishing.
          </p>
        </section>

        <section className="section" id="visit">
          <div className="eyebrow">Come through</div>

          <h2>FIND US IN MIAMI</h2>

          <p className="muted">{restaurant.address}</p>

          <p>
            <a href={`tel:${restaurant.phone}`}>
              {restaurant.phone}
            </a>
          </p>

          <p className="muted">{restaurant.hours}</p>

          <div className="actions">
            <a
              className="btn"
              target="_blank"
              rel="noreferrer"
              href="https://www.google.com/maps/search/?api=1&query=31+NW+9th+St+Miami+FL+33136"
            >
              Get Directions
            </a>
          </div>
        </section>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} {restaurant.name}.
            All rights reserved.
          </span>

          <a href="/login">Owner Login</a>
        </footer>
      </div>
    </main>
  );
}
