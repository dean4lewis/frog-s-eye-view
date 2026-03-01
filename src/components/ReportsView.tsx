import { FileText, Calendar, Download, Filter } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const reports = [
  { id: "RPT-2026-047", title: "Laporan Harian Agen Lapangan", agent: "EAGLE-05", date: "2026-03-01", status: "APPROVED", type: "DAILY" },
  { id: "RPT-2026-046", title: "Analisa Jaringan Target T-001", agent: "COBRA-09", date: "2026-02-28", status: "APPROVED", type: "ANALYSIS" },
  { id: "RPT-2026-045", title: "SIGINT Report — Selat Malaka", agent: "HAWK-12", date: "2026-02-28", status: "PENDING", type: "SIGINT" },
  { id: "RPT-2026-044", title: "Maritime Patrol Report", agent: "WOLF-07", date: "2026-02-27", status: "APPROVED", type: "PATROL" },
  { id: "RPT-2026-043", title: "Cyber Threat Assessment", agent: "FROG-01", date: "2026-02-27", status: "APPROVED", type: "ASSESSMENT" },
  { id: "RPT-2026-042", title: "OP-GARUDA-12 Weekly Summary", agent: "COMMAND", date: "2026-02-26", status: "CLASSIFIED", type: "OPSUMMARY" },
];

const ReportsView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">LAPORAN</h2>
            <p className="text-[9px] font-mono text-muted-foreground">{reports.length} reports · Intelligence documentation</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button className="bg-secondary border border-border rounded px-2.5 py-1 text-[9px] font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground">
            <Filter className="w-3 h-3" /> Filter
          </button>
          <button className="bg-secondary border border-border rounded px-2.5 py-1 text-[9px] font-mono text-muted-foreground flex items-center gap-1 hover:text-foreground">
            <Download className="w-3 h-3" /> Export
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {["ID", "TITLE", "AGENT", "DATE", "TYPE", "STATUS"].map(h => (
                <th key={h} className="text-left px-2.5 py-1.5 text-[8px] font-mono text-muted-foreground tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id} className="border-b border-border hover:bg-muted/50 cursor-pointer transition-colors">
                <td className="px-2.5 py-2 text-[9px] font-mono text-primary">{r.id}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-foreground">{r.title}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-muted-foreground">{r.agent}</td>
                <td className="px-2.5 py-2 text-[9px] font-mono text-muted-foreground">{r.date}</td>
                <td className="px-2.5 py-2 text-[8px] font-mono text-muted-foreground">{r.type}</td>
                <td className="px-2.5 py-2">
                  <span className={`text-[8px] font-mono ${
                    r.status === "APPROVED" ? "text-primary" :
                    r.status === "PENDING" ? "status-warning" :
                    r.status === "CLASSIFIED" ? "status-active" : "text-muted-foreground"
                  }`}>{r.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsView;
