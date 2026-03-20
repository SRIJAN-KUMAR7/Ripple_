import { LogOut, MessageSquare } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function ProfileHeader() {
    const { authUser, logout } = useAuthStore();

    return (
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#1f1f1f]">
            {/* Logo + Brand */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#ff8563]/20 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-[#ff8563]" />
                </div>
                <span className="text-white font-semibold text-base tracking-wide">Ripple</span>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <img
                        src={authUser?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser?.fullName}`}
                        alt={authUser?.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ff8563]/40"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-1 ring-[#0f0f0f]" />
                </div>
                <button
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#ff8563] hover:bg-[#ff8563]/10 transition-all"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default ProfileHeader;
