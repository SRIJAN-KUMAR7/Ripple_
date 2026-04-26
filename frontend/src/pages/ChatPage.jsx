import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

function ChatPage() {
  const { activeTab, selectedUser, isSidebarCollapsed, toggleSidebar } = useChatStore();

  return (
    <div className="relative w-full h-screen flex overflow-hidden" style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* LEFT SIDE - Collapsible Sidebar */}
      <div
        className={`transition-all duration-300 ease-in-out flex flex-col flex-shrink-0 sidebar-bg relative ${
          isSidebarCollapsed ? "w-16" : "w-80"
        }`}
      >
        {/* Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-5 z-20 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)',
          }}
          title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed
            ? <PanelLeftOpen className="w-3 h-3" />
            : <PanelLeftClose className="w-3 h-3" />
          }
        </button>

        <div className="relative flex flex-col h-full overflow-hidden">
          {/* Profile header - hides labels when collapsed */}
          {!isSidebarCollapsed ? (
            <ProfileHeader />
          ) : (
            <div className="flex items-center justify-center py-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
              {/* Just the avatar when collapsed */}
            </div>
          )}

          {/* Tab switch only visible when expanded */}
          {!isSidebarCollapsed && <ActiveTabSwitch />}

          <div className="flex-1 overflow-y-auto py-2 px-2 no-scrollbar">
            {!isSidebarCollapsed
              ? (activeTab === "chats" ? <ChatsList /> : <ContactList />)
              : null
            }
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Chat area */}
      <div className="flex-1 flex flex-col min-w-0 chat-bg">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;
