import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  py-10 px-6">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-10 bg-zinc-100 p-10 rounded-2xl shadow-lg">
        {/* Info Section */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-zinc-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-zinc-700 mb-6">
            Have a question or just want to say hello? Fill out the form and
            we’ll get back to you as soon as possible.
          </p>
          <div className="flex items-center gap-3 text-red-500 mb-3">
            <FaEnvelope />
            <p className="text-zinc-700">support@exclusive.com</p>
          </div>
          <div className="flex items-center gap-3 text-red-500">
            <FaPhoneAlt />
            <p className="text-zinc-700">+1 234 567 890</p>
          </div>
        </div>

        {/* Form Section */}
        <form className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            className="p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            className="p-3 border border-zinc-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            required
            rows={4}
            className="p-3 border border-zinc-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}
