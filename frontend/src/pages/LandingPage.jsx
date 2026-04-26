import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 text-center">
            {/* Logo */}
            <div className="mb-12 flex items-center gap-3 animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-[#ff8563]/20 flex items-center justify-center border border-[#ff8563]/30">
                    <MessageSquare className="w-6 h-6 text-[#ff8563]" />
                </div>
                <span className="text-3xl font-bold tracking-tight text-white">Ripple</span>
            </div>

            {/* Hero Text */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight max-w-4xl leading-tight">
                Connect the world, <br />
                <span className="text-transparent bg-clip-text  bg-[#8B6EFC]">
                    one ripple at a time.
                </span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed font-light">
                Experience the next generation of seamless, real-time communication. 
                Fast, secure, and beautiful by design.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-20">
                <Link 
                    to="/signup" 
                    className="px-8 py-4 bg-[#ff8563] hover:bg-[#ff7043] text-white rounded-2xl font-semibold transition-all hover:scale-105 active:scale-[0.98] flex items-center gap-2 shadow-lg shadow-[#ff8563]/20"
                >
                    Get Started Free <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                    to="/login" 
                    className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl font-semibold transition-all"
                >
                    Sign In
                </Link>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left group">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Real-time Messaging</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Lightning fast message delivery with zero latency. Stay connected instantly.</p>
                </div>

                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left group">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 group-hover:scale-110 transition-transform">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Secure by Default</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">Your privacy is our priority. Encrypted conversations and secure data handling.</p>
                </div>

                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors text-left group">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">Premium Experience</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">A stunning interface designed for clarity and ease of use. Pure joy to use.</p>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
