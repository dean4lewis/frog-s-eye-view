import { Eye, Activity, AlertTriangle, Radio, Satellite, Shield, Monitor } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const liveFeeds = [
  { id: "CAM-JKT-01", location: "Jakarta Pusat", status: "ONLINE", type: "CCTV" },
  { id: "CAM-SBY-03", location: "Surabaya Utara", status: "ONLINE", type: "CCTV" },
  { id: "SAT-PAL-D", location: "GEO 113°E", status: "TRACKING", type: "SATELLITE" },
  { id: "DRN-EH-02", location: "Natuna Airspace", status: "ACTIVE", type: "DRONE" },
  { id: "RAD-NTN-01", location: "Natuna OTH-R", status: "SCANNING", type: "RADAR" },
  { id: "SIG-MLK-01", location: "Selat Malaka", status: "INTERCEPT", type: "SIGINT" },
];

const threatAlerts = [
  { time: "14:45", alert: "Unidentified vessel entering Natuna EEZ", level: "HIGH" },
  { time: "14:32", alert: "Cyber intrusion attempt — firewall blocked", level: "MED" },
  { time: "14:15", alert: "Unusual drone activity — Kalimantan border", level: "HIGH" },
  { time: "13:58", alert: "Communication anomaly — CH-03", level: "LOW" },
];

const MonitoringView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">MONITORING CENTER</h2>
          <p className="text-[9px] font-mono text-muted-foreground">
            Real-time surveillance overview · All systems
          </p>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "FEEDS ACTIVE", value: "47", icon: Monitor, color: "text-primary" },
          { label: "ALERTS (24h)", value: "12", icon: AlertTriangle, color: "status-warning" },
          { label: "SAT PASSES", value: "6", icon: Satellite, color: "text-primary" },
          { label: "SIGINT HITS", value: "23", icon: Radio, color: "text-foreground" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded p-2.5 text-center">
              <Icon className="w-3.5 h-3.5 text-muted-foreground mx-auto mb-1" />
              <div className={`text-lg font-bold font-mono ${stat.color}`}>{stat.value}</div>
              <div className="text-[8px] text-muted-foreground">{stat.label}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
        <DashboardPanel title="Live Feeds" icon={<Activity className="w-3 h-3" />}>
          <div className="space-y-1.5">
            {liveFeeds.map((feed) => (
              <div key={feed.id} className="flex items-center justify-between text-[9px] font-mono p-1.5 bg-muted/30 rounded">
                <div>
                  <div className="text-foreground">{feed.id}</div>
                  <div className="text-muted-foreground text-[8px]">{feed.location}</div>
                </div>
                <div className="text-right">
                  <div className={
                    feed.status === "ONLINE" || feed.status === "ACTIVE" || feed.status === "TRACKING" ? "text-primary" :
                    feed.status === "INTERCEPT" ? "status-warning" : "text-muted-foreground"
                  }>{feed.status}</div>
                  <div className="text-muted-foreground text-[8px]">{feed.type}</div>
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Threat Alerts" icon={<AlertTriangle className="w-3 h-3" />}>
          <div className="space-y-1.5">
            {threatAlerts.map((alert, i) => (
              <div key={i} className="p-1.5 bg-muted/30 rounded">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <span className="text-muted-foreground">{alert.time}</span>
                  <span className={
                    alert.level === "HIGH" ? "status-critical" :
                    alert.level === "MED" ? "status-warning" : "text-muted-foreground"
                  }>{alert.level}</span>
                </div>
                <div className="text-[8px] font-mono text-secondary-foreground mt-0.5">{alert.alert}</div>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="System Health" icon={<Shield className="w-3 h-3" />}>
          <div className="space-y-2 text-[9px] font-mono">
            {[
              { label: "CPU Load", value: 34, max: 100 },
              { label: "Memory", value: 67, max: 100 },
              { label: "Network", value: 89, max: 100 },
              { label: "Storage", value: 42, max: 100 },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex justify-between text-muted-foreground mb-0.5">
                  <span>{m.label}</span>
                  <span className="text-foreground">{m.value}%</span>
                </div>
                <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </DashboardPanel>

        <DashboardPanel title="Active Channels" icon={<Radio className="w-3 h-3" />}>
          <div className="space-y-1 text-[9px] font-mono">
            {[
              { ch: "CH-01", name: "Command Net", status: "ACTIVE" },
              { ch: "CH-02", name: "Field Ops", status: "ACTIVE" },
              { ch: "CH-03", name: "Emergency", status: "STANDBY" },
              { ch: "CH-04", name: "SIGINT", status: "ACTIVE" },
              { ch: "CH-05", name: "Maritime", status: "ACTIVE" },
              { ch: "CH-06", name: "Air Defense", status: "STANDBY" },
            ].map((ch) => (
              <div key={ch.ch} className="flex items-center justify-between">
                <span className="text-muted-foreground">{ch.ch} {ch.name}</span>
                <span className={ch.status === "ACTIVE" ? "text-primary" : "status-warning"}>{ch.status}</span>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
};

export default MonitoringView;
