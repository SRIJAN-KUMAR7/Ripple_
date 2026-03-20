import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

function formatTime(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatsList() {
    const { chats, selectedUser, setSelectedUser, getMyChatPartners, isUserLoading } = useChatStore();
    const { authUser } = useAuthStore();

    useEffect(() => {
        getMyChatPartners();
    }, [getMyChatPartners]);

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-[#ff8563] animate-spin" />
            </div>
        );
    }

    if (!chats || chats.length === 0) {
        return (
            <div className="text-center py-10 text-slate-500 text-sm">
                No recent chats yet.
            </div>
        );
    }

    return (
        <div className="space-y-0.5">
            {chats.map((chat) => {
                const isSelected = selectedUser?._id === chat._id;
                const isOnline = chat.isOnline;
                return (
                    <button
                        key={chat._id}
                        onClick={() => setSelectedUser(chat)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group text-left ${isSelected
                            ? "bg-[#ff8563]/15 border border-[#ff8563]/30"
                            : "hover:bg-white/5 border border-transparent"
                            }`}
                    >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={chat.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${chat.fullName}`}
                                alt={chat.fullName}
                                className="w-11 h-11 rounded-full object-cover"
                            />
                            {isOnline && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0f0f0f]" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <span className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                                    {chat.fullName}
                                </span>
                                {chat.lastMessageAt && (
                                    <span className="text-xs text-slate-500 flex-shrink-0 ml-1">
                                        {formatTime(chat.lastMessageAt)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-0.5">
                                {chat.lastMessage || (isOnline ? "Online" : "Tap to chat")}
                            </p>
                        </div>

                        {/* Unread badge */}
                        {chat.unreadCount > 0 && (
                            <span className="flex-shrink-0 min-w-[20px] h-5 flex items-center justify-center bg-[#ff8563] text-white text-[10px] font-bold rounded-full px-1">
                                {chat.unreadCount}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export default ChatsList;
