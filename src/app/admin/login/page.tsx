"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("adminUser", JSON.stringify(data.user));
      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
        👋 Welcome back, Admin
      </h1>

      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          Admin Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-2 rounded-lg hover:opacity-90"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
