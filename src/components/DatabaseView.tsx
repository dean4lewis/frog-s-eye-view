import { Database, HardDrive, Shield, Users, Search } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const dbStats = [
  { label: "Total Records", value: "1,247,891" },
  { label: "Target Profiles", value: "128" },
  { label: "Agent Records", value: "47" },
  { label: "Intelligence Reports", value: "2,341" },
  { label: "CCTV Archives", value: "89,012" },
  { label: "SIGINT Intercepts", value: "12,567" },
  { label: "Operation Files", value: "156" },
  { label: "Evidence Files", value: "4,523" },
];

const recentQueries = [
  { query: "SELECT * FROM targets WHERE priority = 'HIGH'", time: "14:32", rows: 3 },
  { query: "SELECT * FROM reports WHERE date > '2026-02-25'", time: "14:15", rows: 12 },
  { query: "SELECT * FROM intercepts WHERE region = 'NATUNA'", time: "13:45", rows: 47 },
  { query: "SELECT * FROM agents WHERE status = 'ON DUTY'", time: "13:30", rows: 5 },
];

const DatabaseView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Database className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">DATABASE MANAGEMENT</h2>
          <p className="text-[9px] font-mono text-muted-foreground">Intelligence database · Encrypted storage</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "DB SIZE", value: "47.3 GB", icon: HardDrive },
          { label: "ENCRYPTION", value: "AES-256", icon: Shield },
          { label: "USERS", value: "12", icon: Users },
          { label: "QUERIES/MIN", value: "234", icon: Search },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-card border border-border rounded p-2.5 text-center">
              <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
              <div className="text-sm font-bold font-mono text-foreground">{s.value}</div>
              <div className="text-[8px] text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <DashboardPanel title="Database Statistics" icon={<Database className="w-3 h-3" />}>
          <div className="space-y-1">
            {dbStats.map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[9px] font-mono">
                <span className="text-muted-foreground">{s.label}</span>
                <span className="text-foreground">{s.value}</span>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Recent Queries" icon={<Search className="w-3 h-3" />}>
          <div className="space-y-1.5">
            {recentQueries.map((q, i) => (
              <div key={i} className="bg-muted/30 rounded p-1.5">
                <div className="text-[7px] font-mono text-primary truncate">{q.query}</div>
                <div className="flex justify-between text-[7px] font-mono text-muted-foreground mt-0.5">
                  <span>{q.time}</span>
                  <span>{q.rows} rows</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
};

export default DatabaseView;
