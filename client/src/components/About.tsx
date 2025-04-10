export function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-16 bg-white flex items-center justify-center">
      <div className="max-w-4xl w-full space-y-10">
        <h1 className="text-4xl font-bold text-zinc-900 border-b-4 border-red-500 inline-block pb-2">
          About Exclusive
        </h1>

        <p className="text-lg text-zinc-700 leading-8">
          Welcome to{" "}
          <span className="text-red-500 font-semibold">Exclusive</span> — your
          trusted destination for premium products, hand-picked just for you. We
          are passionate about delivering not only the highest quality, but also
          a seamless and enjoyable shopping experience.
        </p>

        <p className="text-zinc-600 leading-7">
          Founded with the idea that online shopping should be exciting and
          rewarding, we created a platform that combines style, functionality,
          and customer-first thinking. Every item on our site is chosen with
          care, keeping quality and value at the core.
        </p>

        <div className="bg-zinc-100 p-6 rounded-xl shadow-sm">
          <h2 className="text-2xl font-semibold text-zinc-800 mb-2">
            Why Choose Us?
          </h2>
          <ul className="list-disc pl-6 text-zinc-700 space-y-2">
            <li>Curated selection of trending products</li>
            <li>Fast and reliable shipping</li>
            <li>Secure payments & customer-friendly policies</li>
            <li>24/7 support and assistance</li>
          </ul>
        </div>

        <p className="text-zinc-600 leading-7">
          We’re constantly evolving, adding new products and features that make
          your experience better. Your satisfaction is our top priority.
        </p>

        <p className="text-zinc-700 italic">
          Thanks for being part of our journey.
        </p>
      </div>
    </div>
  );
}
