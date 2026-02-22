import React from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "🎪",
    title: "Browse Events",
    desc: "Explore events across music, tech, sports, food and more.",
  },
  {
    icon: "💺",
    title: "Pick Your Seat",
    desc: "Choose your perfect seat with our interactive VIP, Premium and Standard zones.",
  },
  {
    icon: "⚡",
    title: "Real-Time Booking",
    desc: "See seat availability update live as others book. No double bookings ever.",
  },
  {
    icon: "🎟️",
    title: "Instant Confirmation",
    desc: "Get your booking confirmed instantly with a unique booking ID.",
  },
  {
    icon: "👑",
    title: "VIP Experience",
    desc: "Upgrade to VIP or Premium zones for the best experience at any event.",
  },
  {
    icon: "🛡️",
    title: "Secure & Reliable",
    desc: "Your bookings and data are safe with our secure platform.",
  },
];

const categories = [
  { icon: "🎵", label: "Music", color: "bg-pink-900/30 border-pink-700 text-pink-400" },
  { icon: "💻", label: "Tech", color: "bg-blue-900/30 border-blue-700 text-blue-400" },
  { icon: "⚽", label: "Sports", color: "bg-green-900/30 border-green-700 text-green-400" },
  { icon: "🍕", label: "Food", color: "bg-yellow-900/30 border-yellow-700 text-yellow-400" },
  { icon: "🎨", label: "Art", color: "bg-purple-900/30 border-purple-700 text-purple-400" },
  { icon: "🎭", label: "Other", color: "bg-gray-800 border-gray-600 text-gray-400" },
];

const Home = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white">

      {/* Hero */}
      <section className="py-28 px-4 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
             India's Smartest Event Booking Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Book Events,
            <br />
            <span className="text-blue-400">Pick Your Seat</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover amazing events near you. Choose your perfect seat in
            real-time and enjoy a seamless booking experience like never before.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition text-lg"
            >
              Get Started Free 
            </Link>
            <Link
              to="/login"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition text-lg"
            >
              Login →
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              Browse by Category
            </h2>
            <p className="text-gray-500">Find events that match your interests</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                to="/login"
                className={`border-2 ${cat.color} rounded-2xl p-5 text-center hover:scale-105 transition-transform`}
              >
                <p className="text-3xl mb-2">{cat.icon}</p>
                <p className="text-sm font-semibold">{cat.label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              Why Choose EventBook?
            </h2>
            <p className="text-gray-500">
              Everything you need for a perfect event experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-blue-700 transition"
              >
                <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              How It Works
            </h2>
            <p className="text-gray-500">Book your event in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Browse Events",
                desc: "Explore events by category, location or date.",
              },
              {
                step: "02",
                icon: "💺",
                title: "Pick Your Seat",
                desc: "Use our live seat map to choose VIP, Premium or Standard seats.",
              },
              {
                step: "03",
                icon: "✅",
                title: "Confirm Booking",
                desc: "Complete your booking instantly with a unique booking ID.",
              },
            ].map((step, i) => (
              <div key={step.step} className="text-center relative">
                {/* Connector line */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-px bg-gray-800 z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-blue-500 font-black text-sm mb-2">
                    {step.step}
                  </div>
                  <h3 className="font-bold text-white mb-2 text-lg">
                    {step.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-16 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of users who book events with EventBook every day.
          </p>
          <Link
            to="/register"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl transition text-lg inline-block"
          >
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <p className="text-white font-bold text-xl mb-2">🎟️ EventKroBook</p>
          <p className="text-gray-600 text-sm mb-6">
            India's Smartest Event Booking Platform
          </p>
          <div className="flex justify-center gap-6 text-sm mb-6">
            <Link to="/" className="text-gray-500 hover:text-white transition">Home</Link>
            <Link to="/about" className="text-gray-500 hover:text-white transition">About</Link>
            <Link to="/login" className="text-gray-500 hover:text-white transition">Login</Link>
            <Link to="/register" className="text-gray-500 hover:text-white transition">Register</Link>
          </div>
          <p className="text-xs text-gray-700">© 2025 EventBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;