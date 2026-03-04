import { useState, useRef, useEffect } from "react";
import { Radio, Send, Shield, Lock, Users, Trash2, Eye, EyeOff, Mic, Paperclip, Image as ImageIcon, FileText } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  senderCode: string;
  text: string;
  time: string;
  isOwn: boolean;
  readAt?: number;
  blurred?: boolean;
  type?: "text" | "voice" | "image" | "pdf";
  duration?: string; // for voice
}

// Division agents mapped to login codenames
const divisionAgents = [
  { id: "AN91840491831", codename: "ALPHA-NET", division: "Cyber Intelligence", status: "ONLINE" as const },
  { id: "TOM918491568140", codename: "TANGO-OPS", division: "Field Operations", status: "ONLINE" as const },
  { id: "PEMP4814813013", codename: "PAPA-ECHO", division: "Maritime SIGINT", status: "ONLINE" as const },
  { id: "ADMIN1337", codename: "COMMAND", division: "Central Command", status: "ONLINE" as const },
  { id: "STAFFSUS020820", codename: "STAFF-SUS", division: "Special Staff", status: "BUSY" as const },
  { id: "SENOPATITANPALENC4N4", codename: "SENOPATI", division: "Strategic Ops", status: "ONLINE" as const },
];

const BLUR_DELAY_MS = 5 * 60 * 1000; // 5 minutes

const CommsView = () => {
  const [selectedAgent, setSelectedAgent] = useState(divisionAgents[1]); // default chat target
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [deleteCountdown, setDeleteCountdown] = useState("23:59:47");
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);

  // Current user (simulate logged in as ADMIN1337 / COMMAND)
  const currentUser = divisionAgents.find(a => a.id === "ADMIN1337")!;
  const otherAgents = divisionAgents.filter(a => a.id !== currentUser.id);

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

  // Auto-blur messages after 5 minutes
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

  // Mark messages as read
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

  // Voice recording timer
  useEffect(() => {
    if (!isRecording) { setRecordTime(0); return; }
    const interval = setInterval(() => setRecordTime(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const sendMessage = (type: Message["type"] = "text", text?: string) => {
    const content = text || input.trim();
    if (!content && type === "text") return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", { hour12: false, hour: "2-digit", minute: "2-digit" });
    
    const displayText = type === "voice" ? `🎙️ Voice Note (${content})` :
                        type === "image" ? `📷 Image attachment` :
                        type === "pdf" ? `📄 Document: ${content}` : content;
    
    const msg: Message = {
      id: Date.now().toString(),
      sender: currentUser.codename,
      senderCode: currentUser.id,
      text: displayText,
      time: timeStr,
      isOwn: true,
      readAt: Date.now(),
      type,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id] || []), msg],
    }));
    setInput("");

    // Auto-reply from agent
    setTimeout(() => {
      const replies: Record<string, string> = {
        "AN91840491831": "ALPHA-NET copy. Cyber recon data incoming. Over.",
        "TOM918491568140": "TANGO-OPS received. Field team en route. Over.",
        "PEMP4814813013": "PAPA-ECHO acknowledges. Maritime intercept active. Over.",
        "STAFFSUS020820": "STAFF-SUS noted. Forwarding to command. Over.",
        "SENOPATITANPALENC4N4": "SENOPATI confirms. Strategic assessment underway. Over.",
      };
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: selectedAgent.codename,
        senderCode: selectedAgent.id,
        text: replies[selectedAgent.id] || `${selectedAgent.codename} acknowledges. Over.`,
        time: timeStr,
        isOwn: false,
        type: "text",
      };
      setMessages((prev) => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id] || []), reply],
      }));
    }, 1500);
  };

  const handleVoiceToggle = () => {
    if (isRecording) {
      const mins = Math.floor(recordTime / 60);
      const secs = recordTime % 60;
      sendMessage("voice", `${mins}:${secs.toString().padStart(2, "0")}`);
      setIsRecording(false);
    } else {
      setIsRecording(true);
    }
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
              E2E Encrypted · Auto-purge {deleteCountdown} · Blur 5min
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono">
          <Lock className="w-3 h-3 text-primary" />
          <span className="text-primary">AES-256</span>
          <EyeOff className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">5min BLUR</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Agent List - Division Based */}
        <div className="bg-card border border-border rounded overflow-hidden flex flex-col">
          <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
            <Users className="w-3 h-3 text-muted-foreground" />
            <span className="text-[8px] font-mono text-muted-foreground tracking-wider">DIVISION AGENTS</span>
          </div>
          <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
            {otherAgents.map((agent) => {
              const unread = (messages[agent.id] || []).filter(m => !m.readAt && !m.isOwn).length;
              return (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left p-2 rounded border transition-all ${
                    selectedAgent.id === agent.id
                      ? "border-primary bg-secondary"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        agent.status === "ONLINE" ? "bg-primary" :
                        agent.status === "BUSY" ? "bg-destructive" : "bg-muted-foreground"
                      }`} />
                      <span className="text-[8px] font-mono font-medium text-foreground">{agent.codename}</span>
                    </div>
                    {unread > 0 && (
                      <span className="bg-destructive text-[7px] font-mono text-foreground rounded-full w-3.5 h-3.5 flex items-center justify-center">{unread}</span>
                    )}
                  </div>
                  <div className="text-[7px] font-mono text-muted-foreground mt-0.5">{agent.division}</div>
                  <div className="text-[6px] font-mono text-muted-foreground mt-0.5 truncate opacity-60">{agent.id.slice(0, 8)}...</div>
                  <div className="text-[7px] font-mono mt-0.5">
                    <span className={
                      agent.status === "ONLINE" ? "text-primary" :
                      agent.status === "BUSY" ? "status-warning" : "text-muted-foreground"
                    }>{agent.status}</span>
                  </div>
                </button>
              );
            })}
          </div>
          {/* Current user info */}
          <div className="px-2.5 py-2 border-t border-border bg-secondary/50">
            <div className="text-[7px] font-mono text-muted-foreground">LOGGED IN AS</div>
            <div className="text-[9px] font-mono text-primary font-medium">{currentUser.codename}</div>
            <div className="text-[7px] font-mono text-muted-foreground">{currentUser.division}</div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-3 bg-card border border-border rounded flex flex-col overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                selectedAgent.status === "ONLINE" ? "bg-primary pulse-dot" : "bg-muted-foreground"
              }`} />
              <div>
                <div className="text-[10px] font-mono font-medium text-foreground">{selectedAgent.codename}</div>
                <div className="text-[8px] font-mono text-muted-foreground">{selectedAgent.division} · {selectedAgent.id.slice(0, 10)}...</div>
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
                  <p className="text-[9px] font-mono text-muted-foreground">Secure channel with {selectedAgent.codename}</p>
                  <p className="text-[8px] font-mono text-muted-foreground mt-1">E2E encrypted · Auto-blur 5min · Auto-delete {deleteCountdown}</p>
                </div>
              </div>
            )}
            {agentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded px-3 py-1.5 relative ${
                  msg.isOwn ? "bg-secondary border border-border" : "bg-muted border border-border"
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

          {/* Input with attachments */}
          <div className="px-3 py-2 border-t border-border">
            {isRecording && (
              <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-destructive/10 border border-destructive/30 rounded">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-[9px] font-mono text-destructive">RECORDING {Math.floor(recordTime / 60)}:{(recordTime % 60).toString().padStart(2, "0")}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => sendMessage("pdf", "Laporan_Intel_" + Date.now() + ".pdf")}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Send PDF"
                >
                  <FileText className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => sendMessage("image")}
                  className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Send Image"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleVoiceToggle}
                  className={`p-1.5 rounded transition-colors ${isRecording ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                  title="Voice Note"
                >
                  <Mic className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type secure message..."
                className="flex-1 bg-muted border border-border rounded px-3 py-1.5 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
                spellCheck={false}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="bg-secondary border border-border rounded p-1.5 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommsView;
