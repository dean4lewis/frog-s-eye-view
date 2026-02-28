import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Maximize2 } from "lucide-react";

interface TerminalOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const TerminalOverlay = ({ isOpen, onClose, initialMessage }: TerminalOverlayProps) => {
  const [lines, setLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setLines([
        "INTL-SRVID Surveillance Terminal v2.1.0",
        "Copyright (c) 2026 INTL-SRVID Intelligence Division",
        "Encryption: AES-256 | Clearance: LEVEL 5",
        "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
        "",
        initialMessage || "Hello Frog Welcome back! how are u today 🐸",
        "",
        "Type 'help' for available commands.",
        "",
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, initialMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [lines]);

  const handleCommand = (cmd: string) => {
    const newLines = [...lines, `root@intl-srvid:~$ ${cmd}`];

    switch (cmd.toLowerCase().trim()) {
      case "help":
        newLines.push(
          "Available commands:",
          "  status     - System status",
          "  satellites - List Indonesian satellites",
          "  targets    - Active targets count",
          "  ops        - Active operations",
          "  scan       - Run network scan",
          "  clear      - Clear terminal",
          "  whoami     - Current operator",
          ""
        );
        break;
      case "status":
        newLines.push(
          "┌─────────────────────────────────┐",
          "│ SYSTEM STATUS: OPERATIONAL      │",
          "│ Uptime: 847d 14h 23m            │",
          "│ Active Satellites: 14           │",
          "│ Active Agents: 47              │",
          "│ Targets Monitored: 128         │",
          "│ CPU: 34% | RAM: 67% | NET: OK  │",
          "└─────────────────────────────────┘",
          ""
        );
        break;
      case "satellites":
        newLines.push(
          "Indonesian Satellite Network:",
          "  [ACTIVE] PALAPA-D          - Komunikasi",
          "  [ACTIVE] TELKOM-3S         - Komunikasi",
          "  [ACTIVE] BRIsat            - Banking",
          "  [ACTIVE] LAPAN-A2/ORARI    - Observasi",
          "  [ACTIVE] LAPAN-A3/IPB      - Observasi",
          "  [CLASSIFIED] SATRIA-1      - Internet",
          "  [CLASSIFIED] CHINASAT-11   - Militer",
          "  [CLASSIFIED] PSN-VI        - Pertahanan",
          "  [CLASSIFIED] NUSANTARA-SAT - Intel",
          ""
        );
        break;
      case "targets":
        newLines.push("Active monitored targets: 128", "Priority targets: 12", "New targets (24h): 3", "");
        break;
      case "ops":
        newLines.push(
          "Active Operations: 7",
          "  OP-GARUDA-12    [ACTIVE]  Priority: HIGH",
          "  OP-NUSANTARA-8  [ACTIVE]  Priority: MEDIUM",
          "  OP-RAJAWALI-3   [STANDBY] Priority: LOW",
          ""
        );
        break;
      case "scan":
        newLines.push("Initiating network scan...", "[████████████████████] 100%", "Scan complete. No threats detected.", "");
        break;
      case "clear":
        setLines([]);
        setInput("");
        return;
      case "whoami":
        newLines.push("Operator: FROG-01", "Clearance: LEVEL 5", "Division: Cyber Intelligence", "");
        break;
      default:
        newLines.push(`Command not found: ${cmd}`, "Type 'help' for available commands.", "");
    }

    setLines(newLines);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl glow-primary" style={{ backgroundColor: "hsl(220, 25%, 5%)" }}>
            {/* macOS Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-destructive hover:opacity-80" />
                <button className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(45, 100%, 50%)" }} />
                <button className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(120, 60%, 45%)" }} />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">root@intl-srvid — bash — 80×24</span>
              <div className="flex items-center gap-1">
                <Minus className="w-3 h-3 text-muted-foreground" />
                <Maximize2 className="w-3 h-3 text-muted-foreground" />
                <X className="w-3 h-3 text-muted-foreground cursor-pointer" onClick={onClose} />
              </div>
            </div>

            {/* Terminal Body */}
            <div ref={scrollRef} className="h-96 overflow-y-auto p-4 font-mono text-xs">
              {lines.map((line, i) => (
                <div key={i} className="text-terminal-green leading-relaxed whitespace-pre">
                  {line}
                </div>
              ))}
              <div className="flex items-center text-terminal-green">
                <span>root@intl-srvid:~$&nbsp;</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && input.trim() && handleCommand(input)}
                  className="flex-1 bg-transparent outline-none text-terminal-green font-mono text-xs"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="typing-cursor text-terminal-green">█</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalOverlay;
