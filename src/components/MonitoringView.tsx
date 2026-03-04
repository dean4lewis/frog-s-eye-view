import { useState, useEffect } from "react";
import { Eye, Activity, AlertTriangle, Radio, Satellite, Shield, Monitor, Globe } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const liveFeeds = [
  { id: "CAM-JKT-01", location: "Jakarta Pusat", status: "ONLINE", type: "CCTV" },
  { id: "CAM-SBY-03", location: "Surabaya Utara", status: "ONLINE", type: "CCTV" },
  { id: "SAT-PAL-D", location: "GEO 113°E", status: "TRACKING", type: "SATELLITE" },
  { id: "DRN-EH-02", location: "Natuna Airspace", status: "ACTIVE", type: "DRONE" },
  { id: "RAD-NTN-01", location: "Natuna OTH-R", status: "SCANNING", type: "RADAR" },
  { id: "SIG-MLK-01", location: "Selat Malaka", status: "INTERCEPT", type: "SIGINT" },
];

const globalAlerts = [
  { time: "15:02", alert: "Iran meluncurkan uji coba rudal balistik jarak menengah di Teluk Persia", level: "HIGH", region: "Timur Tengah" },
  { time: "14:58", alert: "Rusia membuka pusat perekrutan tentara baru di 12 wilayah — target 300.000 personel", level: "HIGH", region: "Eropa Timur" },
  { time: "14:45", alert: "Kapal tidak dikenal memasuki ZEE Natuna — identifikasi tertunda", level: "HIGH", region: "Indonesia" },
  { time: "14:38", alert: "Korea Utara meluncurkan rudal ICBM ke Laut Jepang — status pemantauan aktif", level: "HIGH", region: "Asia Timur" },
  { time: "14:32", alert: "Percobaan intrusi siber pada infrastruktur kritis — firewall memblokir", level: "MED", region: "Indonesia" },
  { time: "14:20", alert: "China menambah armada kapal perang di Laut China Selatan — 7 kapal baru", level: "HIGH", region: "Asia Tenggara" },
  { time: "14:15", alert: "Aktivitas drone mencurigakan di perbatasan Kalimantan", level: "HIGH", region: "Indonesia" },
  { time: "14:02", alert: "NATO mengadakan latihan militer besar-besaran di Baltik — 40.000 tentara", level: "MED", region: "Eropa" },
  { time: "13:58", alert: "Anomali komunikasi terdeteksi pada frekuensi CH-03", level: "LOW", region: "Indonesia" },
  { time: "13:45", alert: "Israel melancarkan serangan udara di Gaza — korban sipil dilaporkan meningkat", level: "HIGH", region: "Timur Tengah" },
  { time: "13:30", alert: "Iran dan Rusia menandatangani perjanjian kerjasama militer baru", level: "MED", region: "Global" },
  { time: "13:15", alert: "Myanmar: bentrokan bersenjata di perbatasan — pengungsi meningkat", level: "MED", region: "Asia Tenggara" },
  { time: "12:50", alert: "Houthi Yemen menyerang kapal dagang di Laut Merah dengan drone", level: "HIGH", region: "Timur Tengah" },
  { time: "12:30", alert: "Rusia menggelar rudal hipersonik Zircon di Kaliningrad", level: "HIGH", region: "Eropa" },
];

const MonitoringView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Eye className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">MONITORING CENTER</h2>
          <p className="text-[9px] font-mono text-muted-foreground">
            Realtime surveillance · {currentTime.toLocaleTimeString("id-ID", { hour12: false })} WIB
          </p>
        </div>
      </div>

      {/* Status Grid */}
      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: "FEEDS ACTIVE", value: "47", icon: Monitor, color: "text-primary" },
          { label: "GLOBAL ALERTS", value: String(globalAlerts.length), icon: AlertTriangle, color: "status-warning" },
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

        {/* GLOBAL THREAT ALERTS - Indonesian */}
        <DashboardPanel title="Global Threat Alerts" icon={<Globe className="w-3 h-3" />}>
          <div className="space-y-1.5 max-h-[300px] overflow-y-auto">
            {globalAlerts.map((alert, i) => (
              <div key={i} className="p-1.5 bg-muted/30 rounded">
                <div className="flex items-center justify-between text-[9px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">{alert.time}</span>
                    <span className="text-[7px] px-1 py-0.5 rounded bg-secondary text-muted-foreground">{alert.region}</span>
                  </div>
                  <span className={`flex items-center gap-0.5 ${
                    alert.level === "HIGH" ? "status-critical" :
                    alert.level === "MED" ? "status-warning" : "text-muted-foreground"
                  }`}>
                    {alert.level === "HIGH" && <AlertTriangle className="w-2.5 h-2.5" />}
                    {alert.level}
                  </span>
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
