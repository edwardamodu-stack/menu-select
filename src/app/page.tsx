"use client";

import { useState } from "react";

const menuItems = [
  {
    id: 1,
    name: "White Rice and Stew",
    category: "Rice Dishes",
    price: 2500,
    description: "White rice served with stew.",
  },
  {
    id: 2,
    name: "White Rice and Vegetable",
    category: "Rice Dishes",
    price: 2500,
    description: "White rice served with vegetable sauce.",
  },
  {
    id: 3,
    name: "Fufu with Egusi",
    category: "Swallow",
    price: 2500,
    description: "Fufu served with egusi soup.",
  },
  {
    id: 4,
    name: "Fufu with Vegetable Soup",
    category: "Swallow",
    price: 2500,
    description: "Fufu served with vegetable soup.",
  },
  {
    id: 5,
    name: "Eba with Egusi",
    category: "Swallow",
    price: 2500,
    description: "Eba served with egusi soup.",
  },
  {
    id: 6,
    name: "Eba with Vegetable Soup",
    category: "Swallow",
    price: 2500,
    description: "Eba served with vegetable soup.",
  },
  {
    id: 7,
    name: "Semo with Egusi",
    category: "Swallow",
    price: 2500,
    description: "Semo served with egusi soup.",
  },
  {
    id: 8,
    name: "Semo with Vegetable Soup",
    category: "Swallow",
    price: 2500,
    description: "Semo served with vegetable soup.",
  },
  {
    id: 9,
    name: "Shawarma",
    category: "Sunday Special",
    price: 6000,
    description: "Available on Sundays only.",
    sundayOnly: true,
  },
];
export default function Home() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);

  const total = menuItems.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] || 0),
    0
  );

  function updateQuantity(id: number, change: number) {
    setQuantities((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + change),
    }));
  }

  const selectedCount = Object.values(quantities).reduce(
    (sum, quantity) => sum + quantity,
    0
  );

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <h1 className="text-2xl font-bold tracking-tight">
            Menu<span className="text-orange-600">Select</span>
          </h1>
          <span className="text-sm text-stone-500">A better way to order</span>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-600">
          Welcome to Menu Select
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Good food.
          <br />
          Easy choices.
        </h2>
        <p className="mt-4 max-w-xl text-stone-600">
          Explore the menu, choose your favourites, and build your order.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {menuItems
  .filter(
    (item) =>
      !("sundayOnly" in item) ||
      new Intl.DateTimeFormat("en-US", {
        timeZone: "Africa/Lagos",
        weekday: "short",
      }).format(new Date()) === "Sun"
  )
  .map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-orange-600">
                {item.category}
              </p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <span className="shrink-0 font-bold">
                  {item.price.toLocaleString("en-NG", {
                    style: "currency",
                    currency: "NGN",
                    maximumFractionDigits: 0,
                  })}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {item.description}
              </p>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-stone-500">Quantity</span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={!quantities[item.id]}
                    aria-label={`Remove one ${item.name}`}
                    className="h-9 w-9 rounded-full border border-stone-300 text-lg disabled:opacity-30"
                  >
                    −
                  </button>
                  <span className="w-4 text-center font-semibold">
                    {quantities[item.id] || 0}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    aria-label={`Add one ${item.name}`}
                    className="h-9 w-9 rounded-full bg-orange-600 text-lg text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-2xl bg-stone-900 p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-stone-300">Your order</p>
              <p className="mt-1 text-xl font-semibold">
                {selectedCount} {selectedCount === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-stone-300">Total</p>
              <p className="mt-1 text-2xl font-bold">
                ₦{total.toLocaleString("en-NG")}
              </p>
            </div>
          </div>
          <button
            disabled={selectedCount === 0}
           onClick={() => setShowCheckout(true)}
            className="mt-5 w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Continue to checkout
          </button>
        </section>
        {showCheckout && (
  <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
    <h2 className="text-2xl font-bold">Checkout</h2>
    <form
      className="mt-6 space-y-4"
      
onSubmit={async (event) => {
  event.preventDefault();

  const items = menuItems
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({
      id: item.id,
      quantity: quantities[item.id],
    }));

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phone,
        items,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error || "Unable to place order.");
      return;
    }

    alert(`Order placed successfully! Order number: ${result.orderId}`);
    setQuantities({});
    setCustomerName("");
    setPhone("");
    setShowCheckout(false);
  } catch {
    alert("Could not connect to the server. Please try again.");
  }
}}

    >
      <div>
        <label htmlFor="customerName" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          id="customerName"
          type="text"
          required
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
          className="w-full rounded-xl border border-stone-300 px-4 py-3"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1 block text-sm font-medium">
          Phone number
        </label>
        <input
          id="phone"
          type="tel"
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          className="w-full rounded-xl border border-stone-300 px-4 py-3"
          placeholder="Enter your phone number"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-orange-600 px-5 py-3 font-semibold text-white"
      >
        Place order · ₦{total.toLocaleString("en-NG")}
      </button>
    </form>
  </section>
)}
      </section>

      <footer className="border-t border-stone-200 px-6 py-6 text-center text-sm text-stone-500">
        Powered by MenuSelect
      </footer>
    </main>
  );
}