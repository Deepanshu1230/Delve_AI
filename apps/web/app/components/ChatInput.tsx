// components/ChatInput.tsx
import { useState, useRef, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ChatInput({ onSubmit, disabled }: { onSubmit: (v: string) => void; disabled: boolean }) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!value.trim() || disabled) return;
        onSubmit(value.trim());
        setValue("");
      }}
      className="flex items-end gap-2 rounded-3xl bg-white/20 backdrop-blur-2xl border border-white/30 p-2 shadow-2xl relative"
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          // Submit on Enter, allow new lines with Shift+Enter
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!value.trim() || disabled) return;
            onSubmit(value.trim());
            setValue("");
          }
        }}
        placeholder="Ask anything or search the web..."
        className="flex-1 bg-transparent outline-none text-white placeholder-white/70 px-4 py-3 resize-none max-h-[200px] min-h-[50px] overflow-y-auto leading-relaxed"
        disabled={disabled}
        rows={1}
      />
      <button 
        type="submit" 
        disabled={disabled || !value.trim()} 
        className="rounded-full bg-white text-blue-900 p-3 mb-1 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-md shrink-0 flex items-center justify-center"
      >
        <ArrowUp size={20} strokeWidth={2.5} />
      </button>
    </form>
  );
}