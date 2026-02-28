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
    <div className="w-60 h-screen bg-sidebar border-r border-border flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-secondary flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-primary" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-foreground tracking-[0.15em]">INTL-SRVID</h1>
            <p className="text-[9px] font-mono text-muted-foreground">SURVEILLANCE v2.1</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary pulse-dot" />
          <span className="text-[9px] font-mono text-muted-foreground">SYSTEM ONLINE</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-1">
        {menuGroups.map((group) => (
          <div key={group.label} className="mb-0.5">
            <button
              onClick={() => toggleGroup(group.label)}
              className="w-full px-4 py-1.5 flex items-center justify-between text-[9px] font-mono tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
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
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => onSectionChange(item.id)}
                        className={`w-full px-4 py-1.5 flex items-center gap-2.5 text-[11px] transition-all ${
                          isActive
                            ? "bg-secondary text-foreground border-r-2 border-primary"
                            : "text-muted-foreground hover:text-secondary-foreground hover:bg-muted"
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
      <div className="p-3 border-t border-border">
        <div className="text-[8px] font-mono text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>UPTIME</span>
            <span className="text-foreground">99.97%</span>
          </div>
          <div className="flex justify-between">
            <span>ENCRYPTION</span>
            <span className="text-foreground">AES-256</span>
          </div>
          <div className="flex justify-between">
            <span>CLEARANCE</span>
            <span className="text-primary">LEVEL 5</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
