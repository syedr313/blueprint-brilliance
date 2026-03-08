import { forwardRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Mic } from "lucide-react";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

const AiTutor = forwardRef<HTMLButtonElement>((_, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm Lingua, your English learning assistant. Ask me anything about English! 🌟", isUser: false },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), text: input, isUser: true };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    // Simulated response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "That's a great question! Let me help you with that. Keep practicing and you'll master it! 💪",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        ref={ref}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-50 w-14 h-14 md:w-16 md:h-16 rounded-full gradient-secondary shadow-elevated flex items-center justify-center text-secondary-foreground"
        animate={{ scale: isOpen ? 1 : [1, 1.03, 1] }}
        transition={isOpen ? {} : { repeat: Infinity, duration: 3 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 right-4 md:bottom-24 md:right-6 z-50 w-[calc(100vw-2rem)] md:w-96 h-[60vh] md:h-[500px] rounded-2xl glass border border-border/50 shadow-elevated flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="gradient-secondary p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary-foreground/20 flex items-center justify-center">
                <span className="text-lg">🦉</span>
              </div>
              <div>
                <h3 className="font-display text-secondary-foreground text-sm">Lingua</h3>
                <p className="text-secondary-foreground/70 text-xs">AI English Tutor</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.isUser
                        ? "gradient-primary text-primary-foreground rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Lingua anything..."
                  className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button className="p-2.5 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors">
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSend}
                  className="p-2.5 rounded-xl gradient-primary text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

AiTutor.displayName = "AiTutor";

export default AiTutor;
