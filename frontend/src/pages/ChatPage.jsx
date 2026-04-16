import { useChatStore } from "../store/useChatStore";

import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";

function ChatPage() {
  const { activeTab, selectedUser, isSidebarCollapsed, toggleSidebar } = useChatStore();

  return (
    <div className="relative w-full h-screen bg-[#0f0f0f] flex overflow-hidden">
      {/* LEFT SIDE */}
      <div className={`transition-all duration-300 ease-in-out flex flex-col border-r border-[#1f1f1f] bg-[#0f0f0f] ${isSidebarCollapsed ? "w-20" : "w-80"}`}>
        <div className="relative flex flex-col h-full overflow-hidden">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5 
              [&::-webkit-scrollbar]:w-1.5
              [&::-webkit-scrollbar-track]:transparent
              [&::-webkit-scrollbar-thumb]:rounded-full
              [&::-webkit-scrollbar-thumb]:bg-[#1f1f1f]">
            {activeTab === "chats" ? <ChatsList /> : <ContactList />}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col bg-[#0f0f0f] min-w-0">
        {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
      </div>
    </div>
  );
}

export default ChatPage;
