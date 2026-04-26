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
            <div
                className="flex rounded-lg p-0.5"
                style={{ backgroundColor: 'var(--bg-elevated)' }}
            >
                {tabs.map(({ id, label, icon: Icon }) => {
                    const isActive = activeTab === id;
                    return (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200"
                            style={
                                isActive
                                    ? {
                                          backgroundColor: 'var(--accent)',
                                          color: '#ffffff',
                                          boxShadow: '0 2px 8px rgba(255,133,99,0.3)',
                                      }
                                    : {
                                          color: 'var(--text-muted)',
                                          backgroundColor: 'transparent',
                                      }
                            }
                            onMouseEnter={e => {
                                if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                            onMouseLeave={e => {
                                if (!isActive) e.currentTarget.style.color = 'var(--text-muted)';
                            }}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default ActiveTabSwitch;
