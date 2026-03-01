import { Activity, Users, Crosshair, TrendingUp } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const relations = [
  { from: "T-001 ALPHA-BRAVO", to: "T-002 CHARLIE-DELTA", type: "Associate", freq: "14 meetings" },
  { from: "T-001 ALPHA-BRAVO", to: "T-005 INDIA-JULIET", type: "Financial", freq: "8 transactions" },
  { from: "T-002 CHARLIE-DELTA", to: "T-003 ECHO-FOXTROT", type: "Communication", freq: "23 calls" },
  { from: "T-003 ECHO-FOXTROT", to: "T-004 GOLF-HOTEL", type: "Family", freq: "—" },
  { from: "T-005 INDIA-JULIET", to: "T-006 KILO-LIMA", type: "Business", freq: "3 meetings" },
];

const AnalysisView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">ANALISA INTELIJEN</h2>
          <p className="text-[9px] font-mono text-muted-foreground">Relationship mapping · Target analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "Targets", value: "128", icon: Crosshair },
          { label: "Relations", value: "47", icon: Users },
          { label: "Networks", value: "12", icon: TrendingUp },
          { label: "Flags", value: "8", icon: Activity },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded p-2.5 text-center">
              <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
              <div className="text-lg font-bold font-mono text-foreground">{s.value}</div>
              <div className="text-[8px] text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      <DashboardPanel title="Target Relations" icon={<Users className="w-3 h-3" />}>
        <div className="space-y-1.5">
          {relations.map((r, i) => (
            <div key={i} className="bg-muted/30 rounded p-2 text-[9px] font-mono">
              <div className="flex items-center gap-2">
                <span className="text-primary">{r.from}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-foreground">{r.to}</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-muted-foreground">{r.type}</span>
                <span className="text-muted-foreground">{r.freq}</span>
              </div>
            </div>
          ))}
        </div>
      </DashboardPanel>

      <DashboardPanel title="Priority Summary" icon={<Activity className="w-3 h-3" />}>
        <div className="space-y-1 text-[9px] font-mono">
          <div className="flex justify-between"><span className="text-muted-foreground">Critical Targets</span><span className="status-critical">3</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Active Networks</span><span className="status-warning">5</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Pending Analysis</span><span className="text-foreground">12</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Closed Cases</span><span className="text-muted-foreground">47</span></div>
        </div>
      </DashboardPanel>
    </div>
  );
};

export default AnalysisView;
