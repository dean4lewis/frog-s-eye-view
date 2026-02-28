import { Bell, Search, Signal, Clock, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

const TopBar = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-10 bg-card border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
          <Signal className="w-3 h-3 text-primary" />
          <span>SAT-LINK: <span className="status-online">ACTIVE</span></span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground">
          <Wifi className="w-3 h-3 text-primary" />
          <span>SECURE-NET: <span className="status-online">ENCRYPTED</span></span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-mono text-primary">
        <Clock className="w-3 h-3" />
        <span>{time.toLocaleTimeString("id-ID", { hour12: false })}</span>
        <span className="text-muted-foreground">UTC+7</span>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-1 text-muted-foreground hover:text-foreground transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="relative p-1 text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive" />
        </button>
        <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
          OP
        </div>
      </div>
    </div>
  );
};

export default TopBar;
