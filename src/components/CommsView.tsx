import { useState, useRef, useEffect } from "react";
import { Radio, Send, Shield, Lock, Users, Trash2, Eye, EyeOff } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isOwn: boolean;
  readAt?: number; // timestamp when read
  blurred?: boolean;
}

const onlineAgents = [
  { id: "A-01", name: "FROG-01", division: "Cyber Intel", status: "ONLINE" },
  { id: "A-05", name: "EAGLE-05", division: "Field Ops", status: "ONLINE" },
  { id: "A-12", name: "HAWK-12", division: "SIGINT", status: "ONLINE" },
  { id: "A-07", name: "WOLF-07", division: "Maritime", status: "BUSY" },
  { id: "A-03", name: "VIPER-03", division: "Surveillance", status: "OFFLINE" },
  { id: "A-09", name: "COBRA-09", division: "Analysis", status: "ONLINE" },
];

const BLUR_DELAY_MS = 5 * 60 * 1000; // 5 minutes

const CommsView = () => {
  const [selectedAgent, setSelectedAgent] = useState(onlineAgents[0]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [deleteCountdown, setDeleteCountdown] = useState("23:59:47");

  // Auto-purge countdown
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000).toString().padStart(2, "0");
      const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, "0");
      const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, "0");
      setDeleteCountdown(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-blur messages after 5 minutes of being read
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages((prev) => {
        let changed = false;
        const updated: Record<string, Message[]> = {};
        for (const [agentId, msgs] of Object.entries(prev)) {
          updated[agentId] = msgs.map((msg) => {
            if (msg.readAt && !msg.blurred && now - msg.readAt >= BLUR_DELAY_MS) {
              changed = true;
              return { ...msg, blurred: true };
            }
            return msg;
          });
        }
        return changed ? updated : prev;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mark messages as read when viewing
  useEffect(() => {
    setMessages((prev) => {
      const agentMsgs = prev[selectedAgent.id];
      if (!agentMsgs) return prev;
      const now = Date.now();
      const updated = agentMsgs.map((msg) =>
        !msg.readAt ? { ...msg, readAt: now } : msg
      );
      return { ...prev, [selectedAgent.id]: updated };
    });
  }, [selectedAgent.id, messages[selectedAgent.id]?.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages, selectedAgent]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", { hour12: false, hour: "2-digit", minute: "2-digit" });
    const msg: Message = {
      id: Date.now().toString(),
      sender: "OPERATOR",
      text: input.trim(),
      time: timeStr,
      isOwn: true,
      readAt: Date.now(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id] || []), msg],
    }));
    setInput("");

    // Simulated auto-reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: selectedAgent.name,
        text: `Copy that. ${selectedAgent.name} acknowledges. Over.`,
        time: timeStr,
        isOwn: false,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id] || []), reply],
      }));
    }, 1500);
  };

  const agentMessages = messages[selectedAgent.id] || [];

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Radio className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">SECURE COMMUNICATIONS</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              E2E Encrypted · Auto-purge in {deleteCountdown} · Messages blur after 5min
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono">
          <Lock className="w-3 h-3 text-primary" />
          <span className="text-primary">AES-256</span>
          <EyeOff className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">5min AUTO-BLUR</span>
          <Trash2 className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">24h DELETE</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Agent List */}
        <div className="bg-card border border-border rounded overflow-hidden flex flex-col">
          <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-[8px] font-mono text-muted-foreground tracking-wider">AGENTS</span>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {onlineAgents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left p-2 rounded border transition-all ${
                  selectedAgent.id === agent.id
                    ? "border-primary bg-secondary"
                    : "border-border bg-card hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${
                    agent.status === "ONLINE" ? "bg-primary" :
                    agent.status === "BUSY" ? "bg-destructive" : "bg-muted-foreground"
                  }`} />
                  <span className="text-[8px] font-mono font-medium text-foreground">{agent.name}</span>
                </div>
                <div className="text-[7px] font-mono text-muted-foreground mt-0.5">{agent.division}</div>
                <div className="text-[7px] font-mono mt-0.5">
                  <span className={
                    agent.status === "ONLINE" ? "text-primary" :
                    agent.status === "BUSY" ? "status-warning" : "text-muted-foreground"
                  }>{agent.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-3 bg-card border border-border rounded flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                selectedAgent.status === "ONLINE" ? "bg-primary pulse-dot" : "bg-muted-foreground"
              }`} />
              <div>
                <div className="text-[10px] font-mono font-medium text-foreground">{selectedAgent.name}</div>
                <div className="text-[8px] font-mono text-muted-foreground">{selectedAgent.division} · {selectedAgent.status}</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[8px] font-mono text-primary">ENCRYPTED</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
            {agentMessages.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
                  <p className="text-[9px] font-mono text-muted-foreground">Secure channel established</p>
                  <p className="text-[8px] font-mono text-muted-foreground mt-1">Messages are encrypted end-to-end</p>
                  <p className="text-[8px] font-mono text-muted-foreground">Auto-blur after 5 min · Auto-delete in {deleteCountdown}</p>
                </div>
              </div>
            )}
            {agentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded px-3 py-1.5 relative ${
                  msg.isOwn
                    ? "bg-secondary border border-border"
                    : "bg-muted border border-border"
                } ${msg.blurred ? "select-none" : ""}`}>
                  {msg.blurred && (
                    <div className="absolute inset-0 backdrop-blur-md bg-card/50 rounded flex items-center justify-center z-10">
                      <div className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground">
                        <EyeOff className="w-3 h-3" />
                        <span>MESSAGE EXPIRED</span>
                      </div>
                    </div>
                  )}
                  <div className="text-[8px] font-mono text-primary mb-0.5">{msg.sender}</div>
                  <div className="text-[10px] font-mono text-foreground">{msg.text}</div>
                  <div className="text-[7px] font-mono text-muted-foreground text-right mt-0.5 flex items-center justify-end gap-1">
                    {msg.time}
                    {msg.readAt && !msg.blurred && <Eye className="w-2 h-2 text-primary" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-border flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type secure message..."
              className="flex-1 bg-muted border border-border rounded px-3 py-1.5 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
              spellCheck={false}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim()}
              className="bg-secondary border border-border rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommsView;
