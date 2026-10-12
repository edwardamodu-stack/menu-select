
"use client";

import { useState } from "react";

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  items: {
    name: string;
    quantity: number;
    lineTotal: number;
  }[];
  total: number;
  status: string;
  created_at: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        headers: { Authorization: `Bearer ${password}` },
        cache: "no-store",
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Unable to load orders.");
        return;
      }

      setOrders(result.orders);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    const response = await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${password}`,
      },
      body: JSON.stringify({ id, status }),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Unable to update order.");
      return;
    }

    await loadOrders();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold">Menu Select — Orders</h1>
        <p className="mb-6 text-gray-600">Private order management</p>

        <form
          className="mb-6 flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void loadOrders();
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Admin password"
            required
            className="min-w-0 flex-1 rounded-lg border p-3"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-3 text-white disabled:opacity-50"
          >
            {loading ? "Loading..." : "View orders"}
          </button>
        </form>

        {error && <p className="mb-4 text-red-600">{error}</p>}

        <div className="space-y-4">
          {orders.map((order) => (
            <article key={order.id} className="rounded-xl border bg-white p-5">
              <div className="flex flex-wrap justify-between gap-2">
                <h2 className="text-lg font-bold">
                  Order #{order.id} — {order.customer_name}
                </h2>
                <span className="font-semibold">{order.status}</span>
              </div>

              <p className="text-gray-600">{order.phone}</p>
              <p className="text-sm text-gray-500">
                {new Date(order.created_at).toLocaleString("en-NG")}
              </p>

              <ul className="my-3 list-inside list-disc">
                {order.items.map((item, index) => (
                  <li key={`${item.name}-${index}`}>
                    {item.name} × {item.quantity} — ₦
                    {item.lineTotal.toLocaleString("en-NG")}
                  </li>
                ))}
              </ul>

              <p className="mb-4 font-bold">
                Total: ₦{order.total.toLocaleString("en-NG")}
              </p>

              <div className="flex flex-wrap gap-2">
                {["pending", "confirmed", "completed", "cancelled"].map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => void updateStatus(order.id, status)}
                      disabled={loading || order.status === status}
                      className="rounded-lg border px-3 py-2 text-sm disabled:opacity-40"
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
            </article>
          ))}
        </div>

        {!loading && orders.length === 0 && !error && (
          <p className="text-gray-500">No orders loaded yet.</p>
        )}
      </div>
    </main>
  );
}
