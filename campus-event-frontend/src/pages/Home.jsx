import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex items-center justify-center overflow-hidden font-sans">
      
      {/* Dynamic Background Animated Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700 pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-60 h-60 bg-purple-500 rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-bounce [animation-duration:8s] pointer-events-none"></div>

      {/* Main Glassmorphism Presentation Container */}
      <div className="relative max-w-3xl mx-4 text-center bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-16 rounded-3xl shadow-2xl shadow-black/40 tracking-wide transition-all duration-500 hover:border-blue-500/30">
        
        {/* Subtle Decorative Animated Badge */}
        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6 animate-pulse">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></span>
          Get Started with Campus Events
        </span>

        {/* Main Title with Premium Gradient Typography */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-sm">
          Campus Event <br className="hidden md:inline"/>Management System
        </h1>

        {/* Subtle separator line */}
        <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6 rounded-full"></div>

        {/* Dynamic Descriptive Subtitle */}
        <p className="mt-6 text-slate-300 text-base md:text-xl font-light leading-relaxed max-w-xl mx-auto">
          Experience an Intelligent Event Recommendation and Attendance System tailored perfectly to your university lifestyle.
        </p>

        {/* Animated Interactive CTA Button Grid */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/register" 
            className="group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 text-center"
          >
            Get Started
            <span className="inline-block ml-2 transform transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <Link 
            to="/login" 
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-slate-200 font-medium rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-sm hover:-translate-y-0.5 text-center"
          >
            Sign In
          </Link>
        </div>

      </div>

      {/* Modern Mini Bottom Footer Accent */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-slate-500 text-xs tracking-wider">
        copyright &copy; 2026 Campus Event Management System. All rights reserved.
      </div>
    </div>
  );
}

export default Home;