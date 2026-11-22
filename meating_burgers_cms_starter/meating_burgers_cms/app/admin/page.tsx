
"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type Dish = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  sort_order?: number;
};

const CATEGORIES = ["Burgers", "Sides", "Drinks", "Desserts", "Specials"];

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  image_url: "",
  category: "Burgers",
  is_available: true,
};

export default function Admin() {
  const supabase = createClient();
  const router = useRouter();

  const [dishes, setDishes] = useState<Dish[]>([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("Loading your menu...");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);

  const loadDishes = useCallback(async () => {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.replace("/login");
      return;
    }

    setEmail(user.email || "");

    const all: Dish[] = [];
    const pageSize = 500;

    for (let from = 0; ; from += pageSize) {
      const { data, error } = await supabase
        .from("dishes")
        .select(
          "id,name,description,price,image_url,category,is_available,sort_order"
        )
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true })
        .range(from, from + pageSize - 1);

      if (error) {
        setMessage(`Could not load menu: ${error.message}`);
        return;
      }

      all.push(...((data || []) as Dish[]));

      if (!data || data.length < pageSize) break;
    }

    setDishes(all);
    setMessage("");
  }, [router, supabase]);

  useEffect(() => {
    void loadDishes();
  }, [loadDishes]);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (busy) return;

    setBusy(true);
    setMessage("");

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      image_url: form.image_url.trim() || null,
      category: form.category,
      is_available: form.is_available,
    };

    if (
      !payload.name ||
      !Number.isFinite(payload.price) ||
      payload.price < 0
    ) {
      setMessage("Please enter a dish name and a valid price.");
      setBusy(false);
      return;
    }

    let error;

    if (editingId) {
      ({ error } = await supabase
        .from("dishes")
        .update(payload)
        .eq("id", editingId));
    } else {
      const nextOrder =
        dishes.reduce(
          (max, dish) => Math.max(max, dish.sort_order || 0),
          0
        ) + 1;

      ({ error } = await supabase
        .from("dishes")
        .insert({ ...payload, sort_order: nextOrder }));
    }

    if (error) {
      setMessage(`Save failed: ${error.message}`);
      setBusy(false);
      return;
    }

    setForm(EMPTY_FORM);
    setEditingId(null);

    await loadDishes();

    setMessage(
      editingId
        ? "Dish updated successfully."
        : "Dish added successfully."
    );

    setBusy(false);
  }

  function startEdit(dish: Dish) {
    setEditingId(dish.id);

    setForm({
      name: dish.name,
      description: dish.description || "",
      price: String(dish.price),
      image_url: dish.image_url || "",
      category: dish.category || "Burgers",
      is_available: dish.is_available,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteDish(id: string) {
    if (!window.confirm("Delete this menu item? This cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from("dishes")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(`Delete failed: ${error.message}`);
    } else {
      await loadDishes();
      setMessage("Dish deleted.");
    }
  }

  async function changePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPasswordMessage("");

    if (passwordBusy) return;

    if (newPassword.length < 8) {
      setPasswordMessage("The new password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage("The new passwords do not match.");
      return;
    }

    if (newPassword === currentPassword) {
      setPasswordMessage("Choose a password different from the current one.");
      return;
    }

    setPasswordBusy(true);

    const { error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

    if (signInError) {
      setPasswordMessage("The current password is incorrect.");
      setPasswordBusy(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setPasswordMessage(`Could not change password: ${error.message}`);
      setPasswordBusy(false);
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordMessage("Password changed successfully.");
    setPasswordBusy(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="adminshell">
      <header className="adminhead">
        <div>
          <a className="brand" href="/">
            MEATING<span>.</span>
          </a>

          <h1>Website Dashboard</h1>
          <p className="muted">Signed in as {email}</p>
        </div>

        <div className="toolbar">
          <a
            className="btn secondary"
            href="/"
            target="_blank"
            rel="noreferrer"
          >
            View Website ↗
          </a>

          <button
            className="secondary"
            type="button"
            onClick={logout}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* CHANGE PASSWORD */}
      <section className="panel">
        <h2>Change Password</h2>

        <p className="muted">
          Update the password for this restaurant owner account.
        </p>

        <form onSubmit={changePassword}>
          <div className="formgrid">
            <div className="field full">
              <label>Current Password</label>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label>New Password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Confirm New Password</label>
              <input
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="toolbar" style={{ marginTop: 18 }}>
            <button type="submit" disabled={passwordBusy}>
              {passwordBusy ? "Changing..." : "Update Password"}
            </button>
          </div>
        </form>

        {passwordMessage && (
          <p className="muted" role="status" aria-live="polite">
            {passwordMessage}
          </p>
        )}
      </section>

      {/* ADD OR EDIT DISH */}
      <section className="panel">
        <h2>{editingId ? "Edit Menu Item" : "Add a Menu Item"}</h2>

        <form onSubmit={save}>
          <div className="formgrid">
            <div className="field">
              <label>Dish name *</label>
              <input
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="e.g. Double Smash Burger"
              />
            </div>

            <div className="field">
              <label>Price (USD) *</label>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                placeholder="14.99"
              />
            </div>

            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                {CATEGORIES.map((category) => (
                  <option key={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Image URL (optional)</label>
              <input
                type="url"
                value={form.image_url}
                onChange={(e) =>
                  setForm({ ...form, image_url: e.target.value })
                }
                placeholder="https://..."
              />
            </div>

            <div className="field full">
              <label>Description</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the dish and ingredients"
              />
            </div>

            <div className="field">
              <label>Availability</label>
              <select
                value={form.is_available ? "yes" : "no"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_available: e.target.value === "yes",
                  })
                }
              >
                <option value="yes">Available on website</option>
                <option value="no">Hidden from website</option>
              </select>
            </div>
          </div>

          <div className="toolbar" style={{ marginTop: 18 }}>
            <button type="submit" disabled={busy}>
              {busy
                ? "Saving..."
                : editingId
                ? "Save Changes"
                : "Add to Menu"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY_FORM);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="muted" role="status">
            {message}
          </p>
        )}
      </section>

      {/* MENU LIST */}
      <section className="panel">
        <div className="adminhead">
          <div>
            <h2>Your Menu</h2>
            <p className="muted">
              No fixed item limit in the app. Add as many dishes as your
              restaurant needs.
            </p>
          </div>

          <strong>{dishes.length} items</strong>
        </div>

        {dishes.length ? (
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Dish</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {dishes.map((dish) => (
                  <tr key={dish.id}>
                    <td>
                      <strong>{dish.name}</strong>
                      <div className="muted">{dish.category}</div>
                    </td>

                    <td>${Number(dish.price).toFixed(2)}</td>

                    <td>
                      {dish.is_available ? "Visible" : "Hidden"}
                    </td>

                    <td>
                      <div className="toolbar">
                        <button
                          type="button"
                          className="secondary"
                          onClick={() => startEdit(dish)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger"
                          onClick={() => void deleteDish(dish.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">
            No dishes yet. Add your first dish above.
          </p>
        )}
      </section>
    </main>
  );
}
