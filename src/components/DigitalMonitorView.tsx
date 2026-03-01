import { Cpu, Search, Globe, Camera, MessageSquare, Bookmark } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const monitoredAccounts = [
  { platform: "Twitter/X", handle: "@target_alpha", posts: 47, flagged: 3, status: "MONITORING" },
  { platform: "Instagram", handle: "@t_bravo_id", posts: 128, flagged: 5, status: "MONITORING" },
  { platform: "Telegram", handle: "Group: Intel-Watch", posts: 312, flagged: 12, status: "ACTIVE" },
  { platform: "Facebook", handle: "Charlie D.", posts: 89, flagged: 1, status: "ARCHIVED" },
  { platform: "TikTok", handle: "@echo_fox", posts: 56, flagged: 2, status: "MONITORING" },
];

const keywords = [
  { term: "natuna", hits: 234, trend: "↑" },
  { term: "operasi militer", hits: 89, trend: "→" },
  { term: "selat malaka", hits: 156, trend: "↑" },
  { term: "kapal asing", hits: 67, trend: "↓" },
  { term: "drone surveillance", hits: 45, trend: "→" },
];

const DigitalMonitorView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Cpu className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">DIGITAL MONITORING</h2>
          <p className="text-[9px] font-mono text-muted-foreground">Social media tracking · Keyword monitoring · Digital evidence</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <DashboardPanel title="Monitored Accounts" icon={<Globe className="w-3 h-3" />}>
          <div className="space-y-1.5">
            {monitoredAccounts.map((acc) => (
              <div key={acc.handle} className="bg-muted/30 rounded p-2 text-[9px] font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-foreground">{acc.handle}</span>
                  <span className={acc.status === "ACTIVE" ? "text-primary" : acc.status === "ARCHIVED" ? "text-muted-foreground" : "status-warning"}>{acc.status}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5 text-muted-foreground text-[8px]">
                  <span>{acc.platform}</span>
                  <span>{acc.posts} posts · {acc.flagged} flagged</span>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <div className="flex flex-col gap-2">
          <DashboardPanel title="Keyword Monitor" icon={<Search className="w-3 h-3" />}>
            <div className="space-y-1">
              {keywords.map((kw) => (
                <div key={kw.term} className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-foreground">"{kw.term}"</span>
                  <span className="text-muted-foreground">{kw.hits} hits {kw.trend}</span>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Evidence Capture" icon={<Camera className="w-3 h-3" />}>
            <div className="space-y-1 text-[9px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Screenshots</span><span className="text-foreground">234</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Archived Posts</span><span className="text-foreground">567</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Bookmarks</span><span className="text-foreground">89</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Documents</span><span className="text-foreground">45</span></div>
            </div>
          </DashboardPanel>

          <DashboardPanel title="Quick Actions" icon={<Bookmark className="w-3 h-3" />}>
            <div className="space-y-1">
              {["New Screenshot Capture", "Archive URL", "Add Keyword", "Export Evidence"].map((action) => (
                <button key={action} className="w-full text-left text-[9px] font-mono text-muted-foreground hover:text-foreground py-0.5 transition-colors">
                  → {action}
                </button>
              ))}
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
};

export default DigitalMonitorView;
