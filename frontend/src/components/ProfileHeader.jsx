import { LogOut, MessageSquare, Sun, Moon } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

function ProfileHeader() {
    const { authUser, logout } = useAuthStore();
    const { theme, setTheme } = useThemeStore();

    return (
        <div className="flex items-center justify-between px-4 py-4 chat-header-bg">
            {/* Logo + Brand */}
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--accent-bg)' }}>
                    <MessageSquare className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                </div>
                <span className="font-semibold text-base tracking-wide" style={{ color: 'var(--text-primary)' }}>Ripple</span>
            </div>

            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--accent-bg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Avatar */}
                <div className="relative">
                    <img
                        src={authUser?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${authUser?.fullName}`}
                        alt={authUser?.fullName}
                        className="w-8 h-8 rounded-full object-cover ring-2"
                        style={{ ringColor: 'var(--accent)' }}
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-400 rounded-full ring-1" style={{ ringColor: 'var(--bg-surface)' }} />
                </div>

                {/* Logout */}
                <button
                    onClick={logout}
                    title="Logout"
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--accent-bg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default ProfileHeader;
