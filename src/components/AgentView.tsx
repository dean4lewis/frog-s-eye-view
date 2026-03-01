import { Users, FileText, Search, Plus } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const agents = [
  { id: "A-01", codename: "FROG-01", division: "Cyber Intel", status: "ON DUTY", location: "Jakarta", reports: 47 },
  { id: "A-03", codename: "VIPER-03", division: "Surveillance", status: "OFF DUTY", location: "Bandung", reports: 32 },
  { id: "A-05", codename: "EAGLE-05", division: "Field Ops", status: "ON DUTY", location: "Surabaya", reports: 61 },
  { id: "A-07", codename: "WOLF-07", division: "Maritime", status: "ON DUTY", location: "Natuna", reports: 28 },
  { id: "A-09", codename: "COBRA-09", division: "Analysis", status: "ON DUTY", location: "Jakarta", reports: 54 },
  { id: "A-12", codename: "HAWK-12", division: "SIGINT", status: "ON DUTY", location: "Pontianak", reports: 39 },
  { id: "A-15", codename: "TIGER-15", division: "Field Ops", status: "LEAVE", location: "—", reports: 22 },
];

const recentReports = [
  { agent: "EAGLE-05", time: "14:32", subject: "Target T-047 visual confirmation", status: "APPROVED" },
  { agent: "HAWK-12", time: "14:15", subject: "SIGINT intercept — Selat Malaka", status: "PENDING" },
  { agent: "FROG-01", time: "13:45", subject: "Cyber intrusion analysis report", status: "APPROVED" },
  { agent: "WOLF-07", time: "13:30", subject: "Maritime patrol — Natuna sector", status: "PENDING" },
  { agent: "COBRA-09", time: "12:00", subject: "Target network analysis update", status: "APPROVED" },
];

const AgentView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <Users className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">AGEN LAPANGAN</h2>
            <p className="text-[9px] font-mono text-muted-foreground">{agents.length} registered · {agents.filter(a => a.status === "ON DUTY").length} on duty</p>
          </div>
        </div>
        <button className="bg-secondary border border-border rounded px-2.5 py-1 text-[9px] font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground">
          <Plus className="w-3 h-3" /> Add Agent
        </button>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "CODENAME", "DIVISION", "STATUS", "LOCATION", "REPORTS"].map(h => (
                <th key={h} className="text-left px-2.5 py-1.5 text-[8px] font-mono text-muted-foreground tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id} className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <td className="px-2.5 py-2 text-[9px] font-mono text-primary">{agent.id}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono font-medium text-foreground">{agent.codename}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-muted-foreground">{agent.division}</td>
                <td className="px-2.5 py-2">
                  <span className={`text-[8px] font-mono ${
                    agent.status === "ON DUTY" ? "text-primary" :
                    agent.status === "LEAVE" ? "status-warning" : "text-muted-foreground"
                  }`}>{agent.status}</span>
                </td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-secondary-foreground">{agent.location}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-muted-foreground">{agent.reports}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DashboardPanel title="Recent Reports" icon={<FileText className="w-3 h-3" />} className="mt-2">
        <div className="space-y-1.5">
          {recentReports.map((r, i) => (
            <div key={i} className="flex items-center justify-between text-[9px] font-mono p-1.5 bg-muted/30 rounded">
              <div>
                <span className="text-primary mr-2">{r.agent}</span>
                <span className="text-muted-foreground mr-2">{r.time}</span>
                <span className="text-secondary-foreground">{r.subject}</span>
              </div>
              <span className={r.status === "APPROVED" ? "text-primary" : "status-warning"}>{r.status}</span>
            </div>
          ))}
        </div>
      </DashboardPanel>
    </div>
  );
};

export default AgentView;
