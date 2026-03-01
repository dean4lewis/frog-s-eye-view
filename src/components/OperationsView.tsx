import { Shield, Calendar, Users, FileText, Plus } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const operations = [
  { id: "OP-GARUDA-12", name: "Operasi Garuda XII", status: "ACTIVE", priority: "HIGH", targets: 5, agents: 12, start: "2026-01-15", area: "Jakarta-Surabaya" },
  { id: "OP-NUSANTARA-8", name: "Operasi Nusantara VIII", status: "ACTIVE", priority: "MED", targets: 3, agents: 8, start: "2026-02-01", area: "Bandung" },
  { id: "OP-RAJAWALI-3", name: "Operasi Rajawali III", status: "STANDBY", priority: "LOW", targets: 2, agents: 4, start: "2025-11-20", area: "Medan" },
  { id: "OP-ELANG-5", name: "Operasi Elang V", status: "COMPLETED", priority: "HIGH", targets: 7, agents: 15, start: "2025-06-01", area: "Makassar" },
  { id: "OP-HARIMAU-1", name: "Operasi Harimau I", status: "PLANNING", priority: "HIGH", targets: 0, agents: 0, start: "TBD", area: "Natuna" },
];

const OperationsView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">ADMINISTRASI OPERASI</h2>
            <p className="text-[9px] font-mono text-muted-foreground">{operations.length} operations · {operations.filter(o => o.status === "ACTIVE").length} active</p>
          </div>
        </div>
        <button className="bg-secondary border border-border rounded px-2.5 py-1 text-[9px] font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground">
          <Plus className="w-3 h-3" /> New Operation
        </button>
      </div>

      <div className="space-y-2">
        {operations.map((op) => (
          <div key={op.id} className="bg-card border border-border rounded p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-mono font-medium text-foreground">{op.id}</span>
                <span className="text-[9px] font-mono text-muted-foreground ml-2">{op.name}</span>
              </div>
              <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${
                op.status === "ACTIVE" ? "bg-secondary text-primary" :
                op.status === "COMPLETED" ? "bg-muted text-muted-foreground" :
                op.status === "PLANNING" ? "bg-secondary status-warning" :
                "bg-muted text-muted-foreground"
              }`}>{op.status}</span>
            </div>
            <div className="grid grid-cols-5 gap-2 text-[8px] font-mono">
              <div><span className="text-muted-foreground">Priority: </span><span className={
                op.priority === "HIGH" ? "status-critical" : op.priority === "MED" ? "status-warning" : "text-muted-foreground"
              }>{op.priority}</span></div>
              <div><span className="text-muted-foreground">Targets: </span><span className="text-foreground">{op.targets}</span></div>
              <div><span className="text-muted-foreground">Agents: </span><span className="text-foreground">{op.agents}</span></div>
              <div><span className="text-muted-foreground">Start: </span><span className="text-foreground">{op.start}</span></div>
              <div><span className="text-muted-foreground">Area: </span><span className="text-foreground">{op.area}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OperationsView;
