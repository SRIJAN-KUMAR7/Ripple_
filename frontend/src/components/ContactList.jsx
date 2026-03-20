import { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { Loader2, UserPlusIcon } from "lucide-react";

function ContactList() {
    const { allContacts, selectedUser, setSelectedUser, getAllContactst, isUserLoading } = useChatStore();

    useEffect(() => {
        getAllContactst();
    }, [getAllContactst]);

    if (isUserLoading) {
        return (
            <div className="flex items-center justify-center py-10">
                <Loader2 className="w-6 h-6 text-[#ff8563] animate-spin" />
            </div>
        );
    }

    if (!allContacts || allContacts.length === 0) {
        return (
            <div className="flex flex-col items-center py-10 gap-2 text-slate-500">
                <UserPlusIcon className="w-8 h-8 text-slate-600" />
                <span className="text-sm">No contacts found.</span>
            </div>
        );
    }

    return (
        <div className="space-y-0.5">
            {allContacts.map((contact) => {
                const isSelected = selectedUser?._id === contact._id;
                const isOnline = contact.isOnline;
                return (
                    <button
                        key={contact._id}
                        onClick={() => setSelectedUser(contact)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${isSelected
                            ? "bg-[#ff8563]/15 border border-[#ff8563]/30"
                            : "hover:bg-white/5 border border-transparent"
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
                            <p className={`text-sm font-medium truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                                {contact.fullName}
                            </p>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {isOnline ? (
                                    <span className="text-emerald-400">● Online</span>
                                ) : (
                                    "Offline"
                                )}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}

export default ContactList;
