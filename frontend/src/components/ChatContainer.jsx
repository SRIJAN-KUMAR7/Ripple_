import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import {
    Send,
    Paperclip,
    Smile,
    Mic,
    Check,
    CheckCheck,
    Loader2,
    ChevronLeft,
} from "lucide-react";

/* ─── helpers ─────────────────────────────────────────────── */
function formatMsgTime(dateStr) {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function groupByDate(messages) {
    return (messages || []).reduce((groups, msg) => {
        const date = new Date(msg.createdAt).toLocaleDateString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
        if (!groups[date]) groups[date] = [];
        groups[date].push(msg);
        return groups;
    }, {});
}

/* ─── Message bubble ──────────────────────────────────────── */
function MessageBubble({ msg, isMine }) {
    return (
        <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
            {!isMine && (
                <img
                    src={msg.sender?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender?.fullName}`}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
                />
            )}

            <div className={`max-w-[68%] flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                <div
                    className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${isMine
                        ? "bg-[#ff8563] text-white rounded-br-sm shadow-lg shadow-[#ff8563]/20"
                        : "bg-[#1f1f1f] text-slate-200 border border-[#2f2f2f] rounded-bl-sm"
                        }`}
                >
                    {msg.image && (
                        <img
                            src={msg.image}
                            alt="attachment"
                            className="rounded-lg mb-2 max-w-full max-h-52 object-cover cursor-pointer"
                        />
                    )}
                    {msg.text && <span>{msg.text}</span>}
                </div>

                {/* Time + read receipt */}
                <div className="flex items-center gap-1 px-1">
                    <span className="text-[10px] text-slate-600">{formatMsgTime(msg.createdAt)}</span>
                    {isMine && (
                        msg.read
                            ? <CheckCheck className="w-3 h-3 text-[#ff8563]" />
                            : <Check className="w-3 h-3 text-slate-600" />
                    )}
                </div>
            </div>
        </div>
    );
}

/* ─── Date divider ────────────────────────────────────────── */
function DateDivider({ label }) {
    return (
        <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-[#1f1f1f]" />
            <span className="text-[10px] text-slate-600 uppercase tracking-widest bg-transparent px-2">
                {label}
            </span>
            <div className="flex-1 h-px bg-[#1f1f1f]" />
        </div>
    );
}

/* ─── Main container ──────────────────────────────────────── */
function ChatContainer() {
    const { selectedUser, setSelectedUser, messages, isMessagesLoading, getMessages, sendMessage } = useChatStore();
    const { authUser } = useAuthStore();
    const [text, setText] = useState("");
    const bottomRef = useRef(null);

    // Fetch messages when selected user changes
    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
        }
    }, [selectedUser?._id, getMessages]);

    // Auto scroll to bottom whenever messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        setText(""); // optimistic clear
        await sendMessage({ text: trimmed });
    };

    const isOnline = selectedUser?.isOnline;
    const grouped = groupByDate(messages || []);

    return (
        <div className="flex flex-col h-full">
            {/* ── Header ─────────────────────────────────────────── */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1f1f1f] bg-[#0f0f0f] flex-shrink-0">
                {/* Back button (useful on mobile) */}
                <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-all md:hidden"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="relative">
                    <img
                        src={selectedUser?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${selectedUser?.fullName}`}
                        alt={selectedUser?.fullName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    {isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#191724]" />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-100 truncate">{selectedUser?.fullName}</h3>
                    <p className={`text-xs ${isOnline ? "text-emerald-400" : "text-slate-500"}`}>
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>

                {/* Extra action icons */}
                <div className="flex items-center gap-1">
                    <button className="p-2 rounded-lg text-slate-500 hover:text-[#ff8563] hover:bg-[#ff8563]/10 transition-all">
                        <Mic className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* ── Message area ───────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 scrollbar-thin scrollbar-thumb-[#3A364D] scrollbar-track-transparent no-scrollbar">
                {isMessagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 text-[#ff8563] animate-spin" />
                    </div>
                ) : messages && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
                        <p className="text-sm">No messages yet. Say hi! 👋</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([date, msgs]) => (
                        <div key={date}>
                            <DateDivider label={date} />
                            <div className="space-y-2">
                                {msgs.map((msg) => (
                                    <MessageBubble
                                        key={msg._id}
                                        msg={msg}
                                        isMine={msg.senderId === authUser?._id}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
                <div ref={bottomRef} />
            </div>

            {/* ── Input bar ──────────────────────────────────────── */}
            <form
                onSubmit={handleSend}
                className="flex items-center gap-2 px-3 py-3 border-t border-[#1f1f1f] bg-[#0f0f0f] flex-shrink-0"
            >
                {/* Attachment */}
                <button
                    type="button"
                    className="p-2 rounded-xl text-slate-500 hover:text-[#ff8563] hover:bg-[#ff8563]/10 transition-all flex-shrink-0"
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                {/* Text input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write a message..."
                        className="w-full bg-[#1f1f1f] border border-[#2f2f2f] rounded-xl py-2.5 pl-4 pr-11 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#ff8563] focus:border-[#ff8563] transition-all"
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-[#ff8563] transition-colors"
                    >
                        <Smile className="w-4 h-4" />
                    </button>
                </div>

                {/* Send */}
                <button
                    type="submit"
                    disabled={!text.trim()}
                    className="p-2.5 rounded-xl bg-[#ff8563] text-white hover:bg-[#e67757] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-md shadow-[#ff8563]/30 flex-shrink-0"
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}

export default ChatContainer;
