
const menuItems = [
  { name: "Jollof Rice", category: "Main Dishes", price: "₦3,500", description: "Smoky Nigerian jollof rice." },
  { name: "Grilled Chicken", category: "Main Dishes", price: "₦4,500", description: "Tender chicken, grilled to perfection." },
  { name: "Puff Puff", category: "Small Chops", price: "₦1,500", description: "Golden, soft Nigerian puff puff." },
  { name: "Fresh Zobo", category: "Drinks", price: "₦1,000", description: "Refreshing hibiscus drink." },
];

export default function Home() {
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
          Welcome to
        </p>
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Good food.
          <br />
          Easy choices.
        </h2>
        <p className="mt-4 max-w-xl text-stone-600">
          Explore the menu, discover your favourites, and find something
          delicious today.
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {menuItems.map((item) => (
            <article
              key={item.name}
              className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-orange-600">
                {item.category}
              </p>
              <div className="mt-3 flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <span className="shrink-0 font-bold">{item.price}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-stone-200 px-6 py-6 text-center text-sm text-stone-500">
        Powered by MenuSelect
      </footer>
    </main>
  );
}
