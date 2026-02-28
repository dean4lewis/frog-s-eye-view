import { useState } from "react";
import DashboardPanel from "./DashboardPanel";
import { Crosshair, Search, Plus, Filter } from "lucide-react";

const mockTargets = [
  { id: "T-001", name: "ALPHA-BRAVO", status: "ACTIVE", priority: "HIGH", location: "Jakarta", lastSeen: "14:32", ops: "OP-GARUDA-12" },
  { id: "T-002", name: "CHARLIE-DELTA", status: "ACTIVE", priority: "HIGH", location: "Surabaya", lastSeen: "14:15", ops: "OP-GARUDA-12" },
  { id: "T-003", name: "ECHO-FOXTROT", status: "MONITORING", priority: "MED", location: "Bandung", lastSeen: "13:45", ops: "OP-NUSANTARA-8" },
  { id: "T-004", name: "GOLF-HOTEL", status: "MONITORING", priority: "LOW", location: "Medan", lastSeen: "12:30", ops: "OP-RAJAWALI-3" },
  { id: "T-005", name: "INDIA-JULIET", status: "ACTIVE", priority: "HIGH", location: "Makassar", lastSeen: "14:28", ops: "OP-GARUDA-12" },
  { id: "T-006", name: "KILO-LIMA", status: "DORMANT", priority: "LOW", location: "Denpasar", lastSeen: "2d ago", ops: "—" },
];

const TargetView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const filtered = mockTargets.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <Crosshair className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">TARGET DATABASE</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {mockTargets.length} registered | {mockTargets.filter(t => t.status === "ACTIVE").length} active
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-muted border border-border rounded px-6 py-1 text-[10px] font-mono text-foreground placeholder:text-muted-foreground outline-none focus:border-primary w-40"
            />
          </div>
          <button className="bg-secondary border border-border rounded px-2.5 py-1 text-[9px] font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
            <Plus className="w-3 h-3" /> Add
          </button>
          <button className="bg-secondary border border-border rounded px-2.5 py-1 text-[9px] font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
            <Filter className="w-3 h-3" /> Filter
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "CODENAME", "STATUS", "PRIORITY", "LOCATION", "LAST SEEN", "OPERATION"].map(h => (
                <th key={h} className="text-left px-2.5 py-1.5 text-[8px] font-mono text-muted-foreground tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((target) => (
              <tr key={target.id} className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <td className="px-2.5 py-2 text-[9px] font-mono text-primary">{target.id}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono font-medium text-foreground">{target.name}</td>
                <td className="px-2.5 py-2">
                  <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                    target.status === "ACTIVE" ? "bg-secondary text-foreground" :
                    target.status === "MONITORING" ? "bg-muted text-muted-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>{target.status}</span>
                </td>
                <td className="px-2.5 py-2">
                  <span className={`text-[8px] font-mono ${
                    target.priority === "HIGH" ? "status-critical" :
                    target.priority === "MED" ? "status-warning" : "text-muted-foreground"
                  }`}>{target.priority}</span>
                </td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-secondary-foreground">{target.location}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-muted-foreground">{target.lastSeen}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-muted-foreground">{target.ops}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-4 gap-2 mt-3">
        <DashboardPanel title="Priority">
          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">HIGH</span><span className="status-critical">3</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">MED</span><span className="status-warning">1</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">LOW</span><span className="text-muted-foreground">2</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Status">
          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">ACTIVE</span><span className="text-foreground">3</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">MONITORING</span><span className="text-muted-foreground">2</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">DORMANT</span><span className="text-muted-foreground">1</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Coverage">
          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">Jawa</span><span className="text-foreground">3</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sumatera</span><span className="text-foreground">1</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sulawesi</span><span className="text-foreground">1</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Recent">
          <div className="space-y-0.5 text-[8px] font-mono text-muted-foreground">
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
