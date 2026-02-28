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
        "Encryption: AES-256 | Clearance: LEVEL 5",
        "────────────────────────────────────────────",
        "",
        initialMessage || "Hello Frog Welcome back! how are u today",
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
    const newLines = [...lines, `root@intl-srvid ~ % ${cmd}`];

    switch (cmd.toLowerCase().trim()) {
      case "help":
        newLines.push(
          "",
          "  status       System status overview",
          "  satellites   Indonesian satellite registry",
          "  targets      Active target count",
          "  ops          Active operations",
          "  scan         Network sweep",
          "  clear        Clear terminal",
          "  whoami       Current operator",
          ""
        );
        break;
      case "status":
        newLines.push(
          "",
          "  SYSTEM STATUS          OPERATIONAL",
          "  Uptime                 847d 14h 23m",
          "  Active Satellites      14",
          "  Active Agents          47",
          "  Targets Monitored      128",
          "  CPU 34%  RAM 67%  NET OK",
          ""
        );
        break;
      case "satellites":
        newLines.push(
          "",
          "  PALAPA-D          COMSAT      ACTIVE",
          "  TELKOM-3S         COMSAT      ACTIVE",
          "  BRIsat            FINSAT      ACTIVE",
          "  LAPAN-A2/ORARI    OBSRV       ACTIVE",
          "  SATRIA-1          INET        ACTIVE",
          "  PSN-VI            DEFSAT      CLASSIFIED",
          "  NUSANTARA-SAT     INTEL       CLASSIFIED",
          ""
        );
        break;
      case "targets":
        newLines.push("", "  Monitored: 128  |  Priority: 12  |  New (24h): 3", "");
        break;
      case "ops":
        newLines.push(
          "",
          "  OP-GARUDA-12      ACTIVE     HIGH",
          "  OP-NUSANTARA-8    ACTIVE     MEDIUM",
          "  OP-RAJAWALI-3     STANDBY    LOW",
          ""
        );
        break;
      case "scan":
        newLines.push("", "  Scanning... [████████████████████] 100%", "  No threats detected.", "");
        break;
      case "clear":
        setLines([]);
        setInput("");
        return;
      case "whoami":
        newLines.push("", "  Operator: FROG-01", "  Clearance: LEVEL 5", "  Division: Cyber Intelligence", "");
        break;
      default:
        newLines.push(`  command not found: ${cmd}`, "");
    }

    setLines(newLines);
    setInput("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-8"
          style={{ backgroundColor: "rgba(0,0,0,0.75)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="w-full max-w-3xl rounded-lg overflow-hidden border border-border shadow-2xl bg-terminal">
            {/* macOS Title Bar */}
            <div className="flex items-center justify-between px-4 py-2 bg-secondary border-b border-border">
              <div className="flex items-center gap-2">
                <button onClick={onClose} className="w-3 h-3 rounded-full bg-destructive hover:opacity-80" />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(35, 80%, 50%)" }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(120, 40%, 40%)" }} />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground">root@intl-srvid — bash</span>
              <div className="flex items-center gap-1.5">
                <Minus className="w-3 h-3 text-muted-foreground" />
                <Maximize2 className="w-3 h-3 text-muted-foreground" />
                <X className="w-3 h-3 text-muted-foreground cursor-pointer hover:text-foreground" onClick={onClose} />
              </div>
            </div>

            {/* Terminal Body */}
            <div ref={scrollRef} className="h-96 overflow-y-auto p-4 font-mono text-xs">
              {lines.map((line, i) => (
                <div key={i} className="text-terminal leading-relaxed whitespace-pre">
                  {line}
                </div>
              ))}
              <div className="flex items-center text-terminal">
                <span>root@intl-srvid ~ %&nbsp;</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && input.trim() && handleCommand(input)}
                  className="flex-1 bg-transparent outline-none text-terminal font-mono text-xs caret-transparent"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="typing-cursor text-primary">▊</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TerminalOverlay;
