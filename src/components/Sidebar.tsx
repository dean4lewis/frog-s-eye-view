import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Satellite, Radar, Eye, Shield, Monitor, Users, FileText,
  Map, Ship, Plane, Crosshair, Database, Terminal, Radio,
  ChevronDown, Activity, Globe, Cpu
} from "lucide-react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuGroups = [
  {
    label: "COMMAND",
    items: [
      { id: "dashboard", icon: Monitor, label: "Dashboard" },
      { id: "globe", icon: Globe, label: "3D Globe View" },
      { id: "monitoring", icon: Eye, label: "Monitoring View" },
    ],
  },
  {
    label: "ASSETS",
    items: [
      { id: "satellites", icon: Satellite, label: "Satelit Indonesia" },
      { id: "radar", icon: Radar, label: "Radar Systems" },
      { id: "drones", icon: Plane, label: "Drone & Pesawat" },
      { id: "submarines", icon: Ship, label: "Kapal Selam" },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { id: "targets", icon: Crosshair, label: "Data Target" },
      { id: "agents", icon: Users, label: "Agen Lapangan" },
      { id: "analysis", icon: Activity, label: "Analisa" },
      { id: "operations", icon: Shield, label: "Operasi" },
    ],
  },
  {
    label: "SURVEILLANCE",
    items: [
      { id: "cctv", icon: Monitor, label: "CCTV Network" },
      { id: "digital", icon: Cpu, label: "Digital Monitor" },
      { id: "mapping", icon: Map, label: "Mapping Wilayah" },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      { id: "terminal", icon: Terminal, label: "Terminal" },
      { id: "reports", icon: FileText, label: "Laporan" },
      { id: "comms", icon: Radio, label: "Komunikasi" },
      { id: "database", icon: Database, label: "Database" },
    ],
  },
];

const Sidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["COMMAND", "ASSETS", "INTELLIGENCE"]);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]
    );
  };

  return (
    <div className="w-64 h-screen bg-sidebar border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-foreground tracking-wider">INTL-SRVID</h1>
            <p className="text-[10px] text-muted-foreground font-mono">SURVEILLANCE SYSTEM v2.1</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary pulse-dot" />
          <span className="text-[10px] font-mono text-primary">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-thin">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-1">
            <button
              onClick={() => toggleGroup(group.label)}
              className="w-full px-4 py-2 flex items-center justify-between text-[10px] font-mono tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {group.label}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  expandedGroups.includes(group.label) ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
            <AnimatePresence>
              {expandedGroups.includes(group.label) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`w-full px-4 py-2 flex items-center gap-3 text-xs transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary border-r-2 border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {item.label}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="text-[9px] font-mono text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>UPTIME</span>
            <span className="status-online">99.97%</span>
          </div>
          <div className="flex justify-between">
            <span>ENCRYPTION</span>
            <span className="status-online">AES-256</span>
          </div>
          <div className="flex justify-between">
            <span>CLEARANCE</span>
            <span className="status-warning">LEVEL 5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
