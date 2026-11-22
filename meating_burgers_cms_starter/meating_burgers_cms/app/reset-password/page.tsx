
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (password.length < 8) {
      setMessage("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setBusy(true);

    const { error } = await supabase.auth.updateUser({ password });

    setBusy(false);

    if (error) {
      setMessage(`Could not update password: ${error.message}`);
      return;
    }

    setMessage("Password updated successfully. Redirecting to login...");

    window.setTimeout(() => {
      router.replace("/login");
    }, 1800);
  }

  return (
    <main className="loginbox">
      <a className="brand" href="/">
        MEATING<span>.</span>
      </a>

      <h1>Reset Password</h1>
      <p className="muted">
        Enter and confirm your new password.
      </p>

      <form onSubmit={updatePassword}>
        <div className="field">
          <label>New Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label>Confirm New Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your new password"
          />
        </div>

        <button
          type="submit"
          style={{ width: "100%", marginTop: 18 }}
          disabled={busy}
        >
          {busy ? "Updating..." : "Update Password"}
        </button>

        {message && (
          <p className="muted" role="status">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
