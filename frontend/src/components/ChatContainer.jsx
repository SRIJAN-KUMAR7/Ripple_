import { useState, useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import {
    Send,
    Paperclip,
    Smile,
    Check,
    CheckCheck,
    Loader2,
    ChevronLeft,
    FileIcon,
    X,
    Download,
    Lock,
    LockOpen,
    ShieldCheck
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import EmojiPicker from "emoji-picker-react";

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

function MessageBubble({ msg, isMine }) {
    const isImage = !!msg.image;
    const isFile = !!msg.file;
    const hasText = !!msg.text;
    const isTextOnly = hasText && !isImage && !isFile;
    const isEncrypted = msg.isEncrypted;

    return (
        <div className={`flex items-end gap-2 ${isMine ? "flex-row-reverse" : "flex-row"}`}>
            {!isMine && (
                <img
                    src={msg.sender?.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender?.fullName}`}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
                />
            )}

            <div className={`max-w-[75%] flex flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}>

                {/* Image */}
                {isImage && (
                    <img
                        src={msg.image}
                        alt="attachment"
                        className="rounded-2xl max-w-full max-h-72 object-cover cursor-pointer hover:opacity-90 transition-opacity shadow-md"
                    />
                )}

                {/* File attachment */}
                {isFile && (
                    <div
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                        style={{
                            backgroundColor: isMine ? 'var(--accent)' : 'var(--bg-elevated)',
                            border: isMine ? 'none' : '1px solid var(--border-subtle)',
                            color: isMine ? '#fff' : 'var(--text-primary)'
                        }}
                    >
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
                            <FileIcon className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-medium truncate max-w-[130px]">{msg.fileType || "File"}</p>
                        <a
                            href={msg.file}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className="p-1.5 rounded-lg transition-all"
                            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
                        >
                            <Download className="w-3.5 h-3.5" />
                        </a>
                    </div>
                )}

                {/* Text — NO background wrapper, just plain text */}
                {hasText && (
                    <div
                        className={`text-sm leading-relaxed px-1 ${isTextOnly ? "" : "mt-1"}`}
                        style={{ color: 'var(--text-primary)' }}
                    >
                        {msg.text}
                    </div>
                )}

                {/* Time + read receipt + encryption indicator */}
                <div className="flex items-center gap-1.5 px-1">
                    {/* 🔒 padlock if this message was E2E encrypted */}
                    {isEncrypted && (
                        <Lock
                            className="w-3 h-3"
                            style={{ color: 'var(--text-muted)' }}
                            title="End-to-end encrypted"
                        />
                    )}
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>
                        {formatMsgTime(msg.createdAt)}
                    </span>
                    {isMine && (
                        msg.read
                            ? <CheckCheck className="w-3 h-3 text-emerald-400" />
                            : <Check className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />
                    )}
                </div>
            </div>
        </div>
    );
}

function DateDivider({ label }) {
    return (
        <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
            <span className="text-[10px] uppercase tracking-widest px-2" style={{ color: 'var(--text-muted)' }}>
                {label}
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
        </div>
    );
}

function ChatContainer() {
    const {
        selectedUser,
        setSelectedUser,
        messages,
        isMessagesLoading,
        getMessages,
        sendMessage,
        subscribeToMessages,
        unsubscribeFromMessages,
        getSharedKeyStatus,
    } = useChatStore();
    const { authUser, onlineUsers } = useAuthStore();
    const { theme } = useThemeStore();
    const [text, setText] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isE2EReady, setIsE2EReady] = useState(false); // true when shared key is derived
    const fileInputRef = useRef(null);
    const bottomRef = useRef(null);
    const emojiPickerRef = useRef(null);

    useEffect(() => {
        if (selectedUser?._id) {
            getMessages(selectedUser._id);
            subscribeToMessages();
            // Check whether E2E shared key is available for this conversation
            getSharedKeyStatus(selectedUser._id).then(setIsE2EReady);
        }
        return () => unsubscribeFromMessages();
    }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages, getSharedKeyStatus]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Close emoji picker on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    const handleSend = async (e) => {
        e.preventDefault();
        const trimmed = text.trim();
        if (!trimmed && !imagePreview && !filePreview) return;

        const messageData = { text: trimmed };
        if (imagePreview) messageData.image = imagePreview;
        if (filePreview) {
            messageData.file = filePreview.data;
            messageData.fileType = filePreview.name;
        }

        setText("");
        setImagePreview(null);
        setFilePreview(null);
        setShowEmojiPicker(false);

        await sendMessage(messageData);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = "";  // reset so same file can be selected again

        const reader = new FileReader();
        reader.onloadend = () => {
            if (file.type.startsWith("image/")) {
                setImagePreview(reader.result);
                setFilePreview(null);
            } else {
                setFilePreview({ name: file.name, data: reader.result, type: file.type });
                setImagePreview(null);
            }
        };
        reader.readAsDataURL(file);
    };

    const onEmojiClick = (emojiData) => {
        setText(prev => prev + emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const isOnline = onlineUsers.includes(selectedUser?._id);
    const grouped = groupByDate(messages || []);

    return (
        <div className="flex flex-col h-full">
            {/* ── Header ── */}
            <div className="flex items-center gap-3 px-4 py-3 flex-shrink-0 chat-header-bg">
                <button
                    onClick={() => setSelectedUser(null)}
                    className="p-1 rounded-lg transition-all md:hidden"
                    style={{ color: 'var(--text-muted)' }}
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
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2" style={{ ringColor: 'var(--bg-surface)' }} />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{selectedUser?.fullName}</h3>
                    <p className={`text-xs ${isOnline ? "text-emerald-400" : ""}`} style={!isOnline ? { color: 'var(--text-muted)' } : {}}>
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>

                {/* 🔐 E2E encryption badge — visible once shared key is established */}
                {isE2EReady && (
                    <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                        style={{
                            backgroundColor: 'rgba(52, 211, 153, 0.12)',
                            color: '#34d399',
                            border: '1px solid rgba(52, 211, 153, 0.25)',
                        }}
                        title="End-to-end encrypted — messages are encrypted in your browser and can only be read by you and the recipient."
                    >
                        <ShieldCheck className="w-3 h-3" />
                        <span>E2E Encrypted</span>
                    </div>
                )}
            </div>

            {/* ── Messages ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 no-scrollbar" style={{ backgroundColor: 'var(--bg-base)' }}>
                {isMessagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} />
                    </div>
                ) : messages && messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-2" style={{ color: 'var(--text-muted)' }}>
                        <p className="text-sm">No messages yet. Say hi! 👋</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([date, msgs]) => (
                        <div key={date}>
                            <DateDivider label={date} />
                            <div className="space-y-4">
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

            {/* ── File/Image Preview ── */}
            {(imagePreview || filePreview) && (
                <div className="px-4 py-3 input-bar-bg flex items-center gap-4">
                    <div className="relative">
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover" style={{ border: '1px solid var(--border-subtle)' }} />
                        ) : (
                            <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                                <FileIcon className="w-6 h-6" style={{ color: 'var(--text-muted)' }} />
                            </div>
                        )}
                        <button
                            onClick={() => { setImagePreview(null); setFilePreview(null); }}
                            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                    {filePreview && <span className="text-xs truncate max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>{filePreview.name}</span>}
                </div>
            )}

            {/* ── Input Bar ── */}
            <form onSubmit={handleSend} className="flex items-center gap-2 px-3 py-3 flex-shrink-0 input-bar-bg">
                <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />

                {/* Attachment */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2.5 rounded-xl transition-all flex-shrink-0"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--accent-bg)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                    <Paperclip className="w-5 h-5" />
                </button>

                {/* Text Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isE2EReady ? "Write a message..." : "Write a message..."}
                        className="chat-input w-full rounded-xl py-2.5 pl-4 pr-11 text-sm transition-all"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2" ref={emojiPickerRef}>
                        <button
                            type="button"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="transition-colors"
                            style={{ color: showEmojiPicker ? 'var(--accent)' : 'var(--text-muted)' }}
                        >
                            <Smile className="w-4 h-4" />
                        </button>

                        {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl rounded-2xl overflow-hidden">
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    theme={theme === "light" ? "light" : "dark"}
                                    width={320}
                                    height={400}
                                    searchDisabled={false}
                                    skinTonesDisabled
                                    lazyLoadEmojis
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Lock indicator — shows E2E status left of send button */}
                {isE2EReady ? (
                    <Lock
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: '#34d399' }}
                        title="End-to-end encrypted"
                    />
                ) : (
                    <LockOpen
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: 'var(--text-muted)' }}
                        title="Not yet encrypted — waiting for partner's public key"
                    />
                )}

                {/* Send */}
                <button
                    type="submit"
                    disabled={!text.trim() && !imagePreview && !filePreview}
                    className="p-2.5 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
                    style={{ backgroundColor: 'var(--accent)' }}
                >
                    <Send className="w-4 h-4" />
                </button>
            </form>
        </div>
    );
}

export default ChatContainer;
