import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import { Loader2, UserPlusIcon } from "lucide-react";

function ContactList() {
    const { allContacts, selectedUser, setSelectedUser, getAllContactst, isUserLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);


    useEffect(() => {
        getAllContactst();
    }, [getAllContactst]);

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--accent)' }} />
            </div>
        );
    }

    const filteredContacts = showOnlineOnly
        ? allContacts.filter(contact => onlineUsers.includes(contact._id))
        : allContacts;

    if (!allContacts || allContacts.length === 0) {
        return (
            <div className="flex flex-col items-center py-10 gap-2">
                <UserPlusIcon className="w-8 h-8" style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>No contacts found.</span>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {/* Filter Toggle */}
            <div className="px-3 py-1 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'var(--text-muted)' }}>All Contacts</span>
                <button
                    onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                    className="flex items-center gap-2 cursor-pointer"
                >
                    <span className="text-[10px] transition-colors" style={{ color: showOnlineOnly ? '#34d399' : 'var(--text-muted)' }}>Online Only</span>
                    <div className="w-7 h-4 rounded-full p-0.5 transition-colors" style={{ backgroundColor: showOnlineOnly ? '#10b981' : 'var(--border-subtle)' }}>
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${showOnlineOnly ? 'translate-x-3' : 'translate-x-0'}`} />
                    </div>
                </button>
            </div>

            <div className="space-y-0.5">
                {filteredContacts.length === 0 ? (
                    <div className="text-center py-8 text-xs" style={{ color: 'var(--text-muted)' }}>No online contacts</div>
                ) : (
                    filteredContacts.map((contact) => {

                    const isSelected = selectedUser?._id === contact._id;
                    const isOnline = onlineUsers.includes(contact._id);
                    return (
                        <button
                            key={contact._id}
                            onClick={() => setSelectedUser(contact)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left border ${
                                isSelected ? "list-item-selected" : "border-transparent list-item-hover"
                            }`}
                        >
                        {/* Avatar */}
                        <div className="relative flex-shrink-0">
                            <img
                                src={contact.profilePic || `https://api.dicebear.com/7.x/initials/svg?seed=${contact.fullName}`}
                                alt={contact.fullName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            {isOnline && (
                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#0f0f0f]" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                                {contact.fullName}
                            </p>
                            <p className="text-xs mt-0.5">
                                {isOnline ? (
                                    <span className="text-emerald-400">● Online</span>
                                ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>Offline</span>
                                )}
                            </p>
                        </div>
                    </button>
                );
                    })
                )}
            </div>
        </div>
    );
}

export default ContactList;
