import { useState, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { CloudCog, EyeIcon, EyeOffIcon, LoaderIcon, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";


const IMAGES = [
  "https://plus.unsplash.com/premium_photo-1719282201356-9a00daff3af5?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://plus.unsplash.com/premium_photo-1673453421713-6e871ddd9823?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8ZW5lcmd5fGVufDB8fDB8fHww",
  "https://images.unsplash.com/photo-1543269664-7eef42226a21?q=80&w=2070&auto=format&fit=crop",
];

function SignUpPage() {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { signup, isSigningUp, googleLogin } = useAuthStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(formData);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImageIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await googleLogin(tokenResponse.access_token);
    },
    onError: () => {
      toast.error("Google Login Failed");
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8  text-slate-200 font-sans">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-[#191724] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-indigo-900/10 relative">
        <div className="relative hidden md:flex md:w-[45%] lg:w-1/2 bg-[#15131D] overflow-hidden">


          {IMAGES.map((imgSrc, index) => (
            <img
              key={imgSrc}
              src={imgSrc}
              alt={`slide-${index}`}
              className={`absolute inset-0 w-full h-full object-cover transition-all ease-in-out ${index === activeImageIndex
                ? "opacity-100 scale-105 duration-[3000ms]"
                : "opacity-0 scale-100 duration-[3000ms]"
                }`}
            />
          ))}

          <div className="absolute inset-0 bg-[#15131D]/40 mix-blend-overlay z-[1]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#191724] via-[#191724]/60 to-transparent z-[2]" />

          <div className="relative w-full p-8 lg:p-12 flex flex-col justify-between z-10">
            <div className="flex justify-between items-center w-full">
              {/* Logo / Branding */}
              <div className="text-white font-semibold text-2xl tracking-wide flex items-center gap-2">
                <MessageSquare className="w-7 h-7 text-[#8B6EFC]" />
                Ripple
              </div>
              <Link to="/" className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                Home Page <span>→</span>
              </Link>
            </div>

            <div className="mb-6 text-left">
              <h2 className="text-3xl lg:text-4xl font-medium text-white mb-3 leading-tight">
                Connect Instantly,<br />With End-to-End Encryption.
              </h2>

              <div className="flex gap-2">
                {IMAGES.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`h-1.5 rounded-full transition-all duration-[800ms] ease-in-out ${index === activeImageIndex
                      ? "w-8 bg-[#8B6EFC]"
                      : "w-4 bg-white/20 hover:bg-white/40"
                      }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - FORM */}
        <div className="w-full md:w-[55%] lg:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <div className="w-full max-w-[400px] mx-auto">

            {/* Mobile Logo visibility */}
            <div className="md:hidden flex items-center gap-2 text-white font-semibold text-2xl mb-8">
              <MessageSquare className="w-7 h-7 text-[#8B6EFC]" />
              Ripple
            </div>

            <h2 className="text-3xl font-medium text-white mb-2 tracking-tight">Create an account</h2>
            <p className="text-slate-400 text-sm mb-6">
              Already have an account?{" "}
              <Link to="/login" className="text-[#8B6EFC] hover:text-[#9F87FF] transition-colors underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* FULL NAME */}
              <div>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#222030] border border-[#3A364D] rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#8B6EFC] focus:border-[#8B6EFC] transition-all text-sm font-light"
                  placeholder="Full name"
                />
              </div>

              {/* EMAIL */}
              <div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#222030] border border-[#3A364D] rounded-xl py-3 px-4 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#8B6EFC] focus:border-[#8B6EFC] transition-all text-sm font-light"
                  placeholder="Email"
                />
              </div>

              {/* PASSWORD */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-[#222030] border border-[#3A364D] rounded-xl py-3 pl-4 pr-12 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#8B6EFC] focus:border-[#8B6EFC] transition-all text-sm font-light"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOffIcon className="w-5 h-5 opacity-70" /> : <EyeIcon className="w-5 h-5 opacity-70" />}
                </button>
              </div>

              {/* TERMS CHECKBOX */}
              <div className="flex items-center gap-3 pt-1 pb-1">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id="terms"
                    className="peer w-[18px] h-[18px] appearance-none border border-[#3A364D] bg-[#222030] rounded-[4px] checked:bg-[#8B6EFC] checked:border-[#8B6EFC] transition-all cursor-pointer"
                    required
                  />
                  <svg className="absolute w-[10px] h-[10px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <label htmlFor="terms" className="text-sm text-slate-400 cursor-pointer select-none">
                  I agree to the <span className="text-white hover:underline transition-all">Terms & Conditions</span>
                </label>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full bg-[#7A5AF8] hover:bg-[#684CE0] text-white rounded-xl py-3 font-medium transition-all active:scale-[0.98] flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_20px_rgba(122,90,248,0.25)] hover:shadow-[0_4px_25px_rgba(122,90,248,0.35)] text-sm"
              >
                {isSigningUp ? (
                  <LoaderIcon className="w-5 h-5 animate-spin" />
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            {/* DIVIDER */}
            <div className="mt-6 mb-5 flex items-center gap-4">
              <div className="h-px bg-[#3A364D] flex-1"></div>
              <span className="text-slate-500 text-xs tracking-wider">Or register with</span>
              <div className="h-px bg-[#3A364D] flex-1"></div>
            </div>

            {/* SOCIAL BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleGoogleLogin()}
                className="flex-1 flex items-center justify-center gap-2 bg-transparent border border-[#3A364D] hover:bg-[#222030] text-slate-300 rounded-xl py-2.5 transition-all text-sm font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default SignUpPage;