
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setBusy(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  async function forgotPassword() {
    setMessage("");

    if (!email.trim()) {
      setMessage("Enter your email address first.");
      return;
    }

    setResetBusy(true);

    const { error } = await supabase.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: `${window.location.origin}/reset-password`,
      }
    );

    setResetBusy(false);

    if (error) {
      setMessage(`Could not send reset email: ${error.message}`);
      return;
    }

    setMessage(
      "Password reset link sent. Check your email inbox and spam folder."
    );
  }

  return (
    <main className="loginbox">
      <a className="brand" href="/">
        MEATING<span>.</span>
      </a>

      <h1>Owner Login</h1>
      <p className="muted">
        Sign in to manage your restaurant website.
      </p>

      <form onSubmit={submit}>
        <div className="field">
          <label>Email address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="owner@restaurant.com"
            autoComplete="email"
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label>Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
          />
        </div>

        <div style={{ textAlign: "right", marginTop: 10 }}>
          <button
            type="button"
            className="muted"
            onClick={forgotPassword}
            disabled={resetBusy}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            {resetBusy ? "Sending..." : "Forgot Password?"}
          </button>
        </div>

        <button
          type="submit"
          style={{ width: "100%", marginTop: 18 }}
          disabled={busy}
        >
          {busy ? "Signing in..." : "Sign In"}
        </button>

        {message && (
          <p className="error" role="status" aria-live="polite">
            {message}
          </p>
        )}
      </form>

      <p className="muted">
        <a href="/">← Back to website</a>
      </p>
    </main>
  );
}
