import { MessageSquareDashed } from "lucide-react";

function NoConversationPlaceholder() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 select-none">
            {/* Glowing icon bubble */}
            <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-[#7A5AF8]/10 border border-[#7A5AF8]/20 flex items-center justify-center animate-pulse">
                    <MessageSquareDashed className="w-9 h-9 text-[#8B6EFC]/60" />
                </div>
                {/* Decorative rings */}
                <div className="absolute inset-0 rounded-2xl border border-[#8B6EFC]/10 scale-110 opacity-50" />
                <div className="absolute inset-0 rounded-2xl border border-[#8B6EFC]/5 scale-125 opacity-30" />
            </div>

            <div className="text-center space-y-1.5">
                <h3 className="text-slate-200 font-semibold text-lg">No conversation selected</h3>
                <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                    Pick a chat from the sidebar or start a new conversation with a contact.
                </p>
            </div>
            <div className="flex gap-1.5 mt-2">
                {[0, 1, 2].map((i) => (
                    <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#7A5AF8]/40"
                        style={{ animationDelay: `${i * 0.3}s` }}
                    />
                ))}
            </div>
        </div>
    );
}

export default NoConversationPlaceholder;
