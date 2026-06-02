import { Link } from "react-router-dom";
import { MessageSquare, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";

const LandingPage = () => {
    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] p-4 md:p-8 flex flex-col items-center">
            {/* Header / Logo */}
            <header className="w-full max-w-7xl flex justify-between items-center mb-8 px-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#ff8563] flex items-center justify-center">
                        <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">Ripple</span>
                </div>
                <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                    Sign In
                </Link>
            </header>

            {/* Main Hero Container - Matches the Image aesthetic */}
            <main className="w-full max-w-7xl flex-1 flex flex-col items-center justify-center relative overflow-hidden rounded-[2.5rem] md:rounded-[4rem] min-h-[70vh] shadow-2xl">
                {/* Background Image with Moving Waves effect */}
                <div 
                    className="absolute inset-0 bg-cover bg-center animate-ocean"
                    style={{ 
                        backgroundImage: "url('/hero-bg.png')",
                    }}
                />
                
                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl font-bold text-[#1a1a2e] mb-8 tracking-tight leading-[1.1]">
                        Connect the world,<br />
                        <span className="opacity-90">one ripple at a time..</span>
                    </h1>
                    
                    <p className="text-[#1a1a2e]/60 text-lg md:text-xl max-w-xl mb-10 leading-relaxed font-medium">
                        Experience the next generation of seamless communication.
                    </p>

                    {/* Premium Button */}
                    <Link 
                        to="/signup" 
                        className="group flex items-center gap-3 bg-white pl-8 pr-2 py-2 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
                    >
                        <span className="text-[#1a1a2e] font-bold text-lg">Get started free</span>
                        <div className="w-12 h-12 rounded-full bg-[#1a1a2e] flex items-center justify-center group-hover:bg-[#ff8563] transition-colors">
                            <ArrowRight className="w-6 h-6 text-white" />
                        </div>
                    </Link>
                </div>
            </main>





            {/* Features Section (below the main rounded hero) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl mt-20 pb-24">

    {/* Card 1 */}
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-orange-500/30 hover:bg-white/[0.06]">
        
        {/* Glow */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-orange-500/10 via-transparent to-transparent" />

        <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-7 shadow-lg shadow-orange-500/10">
                <Zap className="w-7 h-7" />
            </div>

            <h3 className="text-white text-2xl font-semibold tracking-tight mb-3">
                Lightning Fast
            </h3>

            <p className="text-slate-400 leading-relaxed text-[15px]">
                Experience ultra-fast messaging with real-time delivery and
                seamless synchronization across all your devices.
            </p>
        </div>
    </div>

    {/* Card 2 */}
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-blue-500/30 hover:bg-white/[0.06]">

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-blue-500/10 via-transparent to-transparent" />

        <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-7 shadow-lg shadow-blue-500/10">
                <Shield className="w-7 h-7" />
            </div>

            <h3 className="text-white text-2xl font-semibold tracking-tight mb-3">
                Enterprise Security
            </h3>

            <p className="text-slate-400 leading-relaxed text-[15px]">
                Industry-grade encryption and advanced security architecture
                keep every conversation completely private.
            </p>
        </div>
    </div>

    {/* Card 3 */}
    <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 transition-all duration-500 hover:-translate-y-2 hover:border-purple-500/30 hover:bg-white/[0.06]">

        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />

        <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-7 shadow-lg shadow-purple-500/10">
                <Sparkles className="w-7 h-7" />
            </div>

            <h3 className="text-white text-2xl font-semibold tracking-tight mb-3">
                Elegant Experience
            </h3>

            <p className="text-slate-400 leading-relaxed text-[15px]">
                Crafted with precision to deliver a clean, intuitive, and
                visually stunning user experience.
            </p>
        </div>
    </div>

</div>
        </div>
    );
};

export default LandingPage;

