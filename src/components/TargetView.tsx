import { useState } from "react";
import DashboardPanel from "./DashboardPanel";
import { Crosshair, Search, Plus, Filter } from "lucide-react";

const mockTargets = [
  { id: "T-001", name: "ALPHA-BRAVO", status: "ACTIVE", priority: "HIGH", location: "Jakarta", lastSeen: "14:32", ops: "OP-GARUDA-12" },
  { id: "T-002", name: "CHARLIE-DELTA", status: "ACTIVE", priority: "HIGH", location: "Surabaya", lastSeen: "14:15", ops: "OP-GARUDA-12" },
  { id: "T-003", name: "ECHO-FOXTROT", status: "MONITORING", priority: "MED", location: "Bandung", lastSeen: "13:45", ops: "OP-NUSANTARA-8" },
  { id: "T-004", name: "GOLF-HOTEL", status: "MONITORING", priority: "LOW", location: "Medan", lastSeen: "12:30", ops: "OP-RAJAWALI-3" },
  { id: "T-005", name: "INDIA-JULIET", status: "ACTIVE", priority: "HIGH", location: "Makassar", lastSeen: "14:28", ops: "OP-GARUDA-12" },
  { id: "T-006", name: "KILO-LIMA", status: "DORMANT", priority: "LOW", location: "Denpasar", lastSeen: "2d ago", ops: "-" },
];

const TargetView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = mockTargets.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Crosshair className="w-5 h-5 text-primary" />
          <div>
            <h2 className="text-sm font-bold text-foreground">Data Target — Intelligence Database</h2>
            <p className="text-[10px] font-mono text-muted-foreground">
              {mockTargets.length} targets registered | {mockTargets.filter(t => t.status === "ACTIVE").length} active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search target..."
              className="bg-secondary border border-border rounded px-7 py-1.5 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary"
            />
          </div>
          <button className="bg-primary/20 text-primary border border-primary/30 rounded px-3 py-1.5 text-[10px] font-mono flex items-center gap-1 hover:bg-primary/30 transition-colors">
            <Plus className="w-3 h-3" /> Add Target
          </button>
          <button className="bg-secondary border border-border rounded px-3 py-1.5 text-[10px] font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>
      </div>

      {/* Target Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "CODENAME", "STATUS", "PRIORITY", "LOCATION", "LAST SEEN", "OPERATION"].map(h => (
                <th key={h} className="text-left px-3 py-2 text-[9px] font-mono text-muted-foreground tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((target) => (
              <tr key={target.id} className="border-b border-border hover:bg-secondary/30 cursor-pointer transition-colors">
                <td className="px-3 py-2.5 text-[10px] font-mono text-accent">{target.id}</td>
                <td className="px-3 py-2.5 text-[10px] font-mono font-bold text-foreground">{target.name}</td>
                <td className="px-3 py-2.5">
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded ${
                    target.status === "ACTIVE" ? "bg-primary/20 text-primary" :
                    target.status === "MONITORING" ? "bg-accent/20 text-accent" :
                    "bg-secondary text-muted-foreground"
                  }`}>
                    {target.status}
                  </span>
                </td>
                <td className="px-3 py-2.5">
                  <span className={`text-[9px] font-mono ${
                    target.priority === "HIGH" ? "status-danger" :
                    target.priority === "MED" ? "status-warning" : "text-muted-foreground"
                  }`}>
                    {target.priority}
                  </span>
                </td>
                <td className="px-3 py-2.5 text-[10px] font-mono text-foreground">{target.location}</td>
                <td className="px-3 py-2.5 text-[10px] font-mono text-muted-foreground">{target.lastSeen}</td>
                <td className="px-3 py-2.5 text-[10px] font-mono text-accent">{target.ops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mt-3">
        <DashboardPanel title="Priority Breakdown">
          <div className="space-y-2 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">HIGH</span><span className="status-danger">3</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">MEDIUM</span><span className="status-warning">1</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">LOW</span><span className="text-muted-foreground">2</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Status Distribution">
          <div className="space-y-2 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">ACTIVE</span><span className="status-online">3</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">MONITORING</span><span className="text-accent">2</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">DORMANT</span><span className="text-muted-foreground">1</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Coverage Area">
          <div className="space-y-2 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">Jawa</span><span className="text-foreground">3</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sumatera</span><span className="text-foreground">1</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sulawesi</span><span className="text-foreground">1</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Bali</span><span className="text-foreground">1</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Recent Actions">
          <div className="space-y-1 text-[9px] font-mono text-muted-foreground">
            <div>T-001 photo updated</div>
            <div>T-005 location changed</div>
            <div>T-002 new intel note</div>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
};

export default TargetView;
