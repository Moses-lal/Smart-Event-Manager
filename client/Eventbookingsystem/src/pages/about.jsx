import React from "react";
import { Link } from "react-router-dom";

const team = [
  {
    name: "Moses lal",
    role: "Founder & CEO",
    avatar: "M",
    color: "bg-blue-600",
    desc: "Passionate about connecting people through amazing experiences.",
  },
  {
    name: "Pratha Jha",
    role: "Head of Product",
    avatar: "P",
    color: "bg-purple-600",
    desc: "Building seamless user experiences one feature at a time.",
  },
  {
    name: "Arjun Singh",
    role: "Lead Engineer",
    avatar: "A",
    color: "bg-green-600",
    desc: "Making real-time booking technology work like magic.",
  },
];

const values = [
  {
    icon: "⚡",
    title: "Real-Time Experience",
    desc: "We believe in instant updates. No delays, no confusion — just live seat availability.",
    color: "bg-yellow-900/20 border-yellow-700/50",
  },
  {
    icon: "🛡️",
    title: "Trust & Security",
    desc: "Your data and bookings are protected with industry-standard security practices.",
    color: "bg-blue-900/20 border-blue-700/50",
  },
  {
    icon: "🎯",
    title: "User First",
    desc: "Every feature we build starts with one question — does this make life easier?",
    color: "bg-green-900/20 border-green-700/50",
  },
  {
    icon: "🌍",
    title: "Accessible to All",
    desc: "From small local events to large festivals — booking is accessible for everyone.",
    color: "bg-purple-900/20 border-purple-700/50",
  },
];

const About = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-white">

      {/* Hero */}
      <section className="py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-600/20 blur-3xl rounded-full pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-6 font-medium">
            🎟️ About EventBook
          </div>
          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            We're Building the
            <br />
            <span className="text-blue-400">Future of Events</span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            EventBook was founded with a simple mission — make event booking
            fast, fair and fun for everyone in India.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gray-900 border border-gray-800 rounded-3xl p-10 md:p-16">
          <h2 className="text-3xl font-black text-white mb-6">Our Mission</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              We started EventBook because we were tired of outdated, confusing
              ticket booking platforms. No real-time updates. No seat selection.
              No transparency.
            </p>
            <p>
              So we built something better. A platform where you can see exactly
              which seats are available right now, pick the zone that suits your
              budget, and confirm your booking instantly.
            </p>
            <p>
              Whether it's a tech summit, music festival, sports event or food
              fair — EventBook makes sure you never miss out on what matters.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Our Values</h2>
            <p className="text-gray-500">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className={`border ${value.color} rounded-2xl p-6 flex gap-4`}
              >
                <div className="text-3xl">{value.icon}</div>
                <div>
                  <h3 className="font-bold text-white mb-1">{value.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              Meet the Team
            </h2>
            <p className="text-gray-500">The people behind EventBook</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center hover:border-blue-700 transition"
              >
                <div className={`w-20 h-20 ${member.color} rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4`}>
                  {member.avatar}
                </div>
                <h3 className="font-bold text-white text-lg">{member.name}</h3>
                <p className="text-blue-400 text-sm font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {member.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black text-white mb-3">Built With</h2>
          <p className="text-gray-500 mb-10">
            Modern technology for a modern experience
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "React.js", icon: "⚛️", color: "bg-blue-900/30 border-blue-700 text-blue-400" },
              { label: "Node.js", icon: "🟢", color: "bg-green-900/30 border-green-700 text-green-400" },
              { label: "Express.js", icon: "🚀", color: "bg-gray-800 border-gray-600 text-gray-400" },
              { label: "MongoDB", icon: "🍃", color: "bg-green-900/30 border-green-700 text-green-400" },
              { label: "Socket.IO", icon: "⚡", color: "bg-yellow-900/30 border-yellow-700 text-yellow-400" },
              { label: "Tailwind CSS", icon: "🎨", color: "bg-cyan-900/30 border-cyan-700 text-cyan-400" },
            ].map((tech) => (
              <div
                key={tech.label}
                className={`border ${tech.color} px-5 py-3 rounded-xl font-semibold text-sm flex items-center gap-2`}
              >
                <span>{tech.icon}</span>
                <span>{tech.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-16 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Join EventBook Today
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Be part of the future of event booking in India.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-10 py-4 rounded-xl transition text-lg"
            >
              Get Started Free 
            </Link>
            <Link
              to="/login"
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold px-10 py-4 rounded-xl transition text-lg"
            >
              Login →
            </Link>
          </div>
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

export default About;