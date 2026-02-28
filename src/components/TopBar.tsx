import { Bell, Search, Signal, Clock, Wifi, Lock } from "lucide-react";
import { useState, useEffect } from "react";

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-9 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
          <Lock className="w-3 h-3" />
          <span>SECURE CHANNEL</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
          <Signal className="w-3 h-3" />
          <span>SAT-LINK ACTIVE</span>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-muted-foreground">
          <Wifi className="w-3 h-3" />
          <span>ENCRYPTED</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-[10px] font-mono text-foreground">
        <Clock className="w-3 h-3 text-muted-foreground" />
        <span>{time.toLocaleTimeString("id-ID", { hour12: false })}</span>
        <span className="text-muted-foreground text-[9px]">WIB</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="p-1 text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-3.5 h-3.5" />
        </button>
        <button className="relative p-1 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-3.5 h-3.5" />
          <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>
        <div className="w-5 h-5 rounded bg-secondary flex items-center justify-center text-[8px] font-bold text-foreground">
          OP
        </div>
      </div>
    </div>
  );
};

export default TopBar;
