import { useChatStore } from "../store/useChatStore";
import { MessageCircle, Users } from "lucide-react";

function ActiveTabSwitch() {
    const { activeTab, setActiveTab } = useChatStore();

    const tabs = [
        { id: "chats", label: "Chats", icon: MessageCircle },
        { id: "contacts", label: "Contacts", icon: Users },
    ];

    return (
        <div className="px-3 py-2">
            <div className="flex bg-[#1f1f1f] rounded-lg p-0.5">
                {tabs.map(({ id, label, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setActiveTab(id)}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === id
                            ? "bg-[#ff8563] text-white shadow-md shadow-[#ff8563]/30"
                            : "text-slate-400 hover:text-slate-200"
                            }`}
                    >
                        <Icon className="w-3.5 h-3.5" />
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ActiveTabSwitch;
