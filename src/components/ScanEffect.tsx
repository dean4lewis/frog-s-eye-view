import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const bootSequence = [
  "INTL-SRVID BOOT SEQUENCE INITIATED...",
  "Loading kernel modules...",
  "Initializing encryption layer... AES-256 ✓",
  "Connecting to satellite network...",
  "PALAPA-D ................ CONNECTED",
  "TELKOM-3S ............... CONNECTED",
  "BRIsat .................. CONNECTED",
  "SATRIA-1 ................ CONNECTED",
  "Establishing secure channels... ✓",
  "Loading intelligence database... ✓",
  "Syncing agent reports... ✓",
  "CCTV Network check... 342/350 ONLINE",
  "All systems operational.",
  "",
  "ACCESS GRANTED — CLEARANCE LEVEL 5",
];

const ScanEffect = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (indexRef.current < bootSequence.length) {
        indexRef.current += 1;
        setVisibleCount(indexRef.current);
        setProgress((indexRef.current / bootSequence.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 180);
    return () => clearInterval(interval);
  }, [onComplete]);

  const visibleLines = bootSequence.slice(0, visibleCount);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-center"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-lg px-8">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-[0.2em]">INTL-SRVID</h1>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest">SURVEILLANCE INTELLIGENCE SYSTEM</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded p-4 mb-4 h-64 overflow-y-auto font-mono text-[10px]">
          {visibleLines.map((line, i) => (
            <div
              key={i}
              className={`leading-relaxed ${
                line.includes("✓") || line.includes("CONNECTED") || line.includes("ACCESS GRANTED")
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {line}
            </div>
          ))}
          <span className="typing-cursor text-primary">█</span>
        </div>

        <div className="w-full h-0.5 bg-secondary rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="text-[9px] font-mono text-muted-foreground text-center mt-2">
          INITIALIZING {Math.round(progress)}%
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scan-line absolute inset-0" />
      </div>
    </motion.div>
  );
};

export default ScanEffect;
