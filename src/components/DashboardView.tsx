import DashboardPanel from "./DashboardPanel";
import GlobeScene from "./GlobeScene";
import {
  Satellite, Shield, Users, Crosshair, Activity,
  AlertTriangle, Eye, Radio
} from "lucide-react";

interface DashboardViewProps {
  onOpenTerminal: () => void;
}

const stats = [
  { label: "Satelit Aktif", value: "14", icon: Satellite, status: "nominal" },
  { label: "Target Diawasi", value: "128", icon: Crosshair, status: "nominal" },
  { label: "Agen Lapangan", value: "47", icon: Users, status: "nominal" },
  { label: "Operasi Aktif", value: "7", icon: Shield, status: "active" },
  { label: "Ancaman", value: "3", icon: AlertTriangle, status: "critical" },
  { label: "CCTV Online", value: "342", icon: Eye, status: "nominal" },
];

const recentActivities = [
  { time: "14:32", event: "Target T-047 terdeteksi di Surabaya", priority: "HIGH" },
  { time: "14:28", event: "Satelit PALAPA-D realignment complete", priority: "LOW" },
  { time: "14:15", event: "Agen A-12 submit laporan harian", priority: "MED" },
  { time: "13:58", event: "OP-GARUDA-12 status update", priority: "HIGH" },
  { time: "13:45", event: "New SIGINT intercept — Selat Malaka", priority: "HIGH" },
  { time: "13:30", event: "CCTV-JKT-047 motion detected", priority: "MED" },
];

const satellites = [
  { name: "PALAPA-D", type: "COMSAT", status: "ACTIVE" },
  { name: "TELKOM-3S", type: "COMSAT", status: "ACTIVE" },
  { name: "BRIsat", type: "FINSAT", status: "ACTIVE" },
  { name: "LAPAN-A2", type: "OBSRV", status: "ACTIVE" },
  { name: "SATRIA-1", type: "INET", status: "ACTIVE" },
  { name: "PSN-VI", type: "DEFSAT", status: "CLASSIFIED" },
];

const DashboardView = ({ onOpenTerminal }: DashboardViewProps) => {
  return (
    <div className="h-full flex flex-col gap-2 p-2 overflow-y-auto">
      {/* Stats */}
      <div className="grid grid-cols-6 gap-1.5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card border border-border rounded p-2.5 flex flex-col items-center gap-1">
              <Icon className="w-3.5 h-3.5 text-muted-foreground" />
              <span className={`text-base font-bold font-mono ${
                stat.status === "critical" ? "status-critical" :
                stat.status === "active" ? "status-active" : "text-foreground"
              }`}>{stat.value}</span>
              <span className="text-[8px] text-muted-foreground text-center">{stat.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main */}
      <div className="grid grid-cols-3 gap-2 flex-1 min-h-0">
        <div className="col-span-2 bg-card border border-border rounded overflow-hidden relative" style={{ minHeight: "380px" }}>
          <div className="absolute top-2 left-2.5 z-10 text-[9px] font-mono text-muted-foreground tracking-wider">
            3D ORBITAL VIEW — INDONESIA
          </div>
          <GlobeScene onSatelliteClick={onOpenTerminal} />
        </div>

        <div className="flex flex-col gap-2">
          <DashboardPanel title="Activity Feed" icon={<Activity className="w-3 h-3" />}>
            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {recentActivities.map((act, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[9px] font-mono">
                  <span className="text-muted-foreground shrink-0">{act.time}</span>
                  <span className={`shrink-0 px-1 rounded text-[7px] ${
                    act.priority === "HIGH" ? "bg-destructive/15 status-critical" :
                    act.priority === "MED" ? "bg-secondary text-muted-foreground" :
                    "bg-secondary text-muted-foreground"
                  }`}>{act.priority}</span>
                  <span className="text-secondary-foreground">{act.event}</span>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Satellite Network" icon={<Satellite className="w-3 h-3" />}>
            <div className="space-y-1">
              {satellites.map((sat) => (
                <div key={sat.name} className="flex items-center justify-between text-[9px] font-mono">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1 h-1 rounded-full ${sat.status === "ACTIVE" ? "bg-primary" : "bg-muted-foreground"}`} />
                    <span className="text-foreground">{sat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{sat.type}</span>
                    <span className={sat.status === "CLASSIFIED" ? "status-active" : "text-muted-foreground"}>
                      {sat.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Comms" icon={<Radio className="w-3 h-3" />}>
            <div className="space-y-0.5 text-[9px] font-mono text-muted-foreground">
              <div>CH-01 Command <span className="text-foreground">ACTIVE</span></div>
              <div>CH-02 Field Ops <span className="text-foreground">ACTIVE</span></div>
              <div>CH-03 Emergency <span className="status-warning">STANDBY</span></div>
              <div>CH-04 SIGINT <span className="text-foreground">ACTIVE</span></div>
            </div>
          </DashboardPanel>
        </div>
      </div>

      {/* Bottom */}
      <div className="grid grid-cols-4 gap-2">
        <DashboardPanel title="Drone Fleet" icon={<Shield className="w-3 h-3" />}>
          <div className="space-y-0.5 text-[9px] font-mono">
            <div className="flex justify-between text-secondary-foreground"><span>CH-4 Rainbow</span><span className="text-muted-foreground">READY</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>Elang Hitam</span><span className="text-foreground">ACTIVE</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>Wulung</span><span className="status-warning">MAINT</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>Rajawali 720</span><span className="text-muted-foreground">READY</span></div>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Kapal Selam" icon={<Eye className="w-3 h-3" />}>
          <div className="space-y-0.5 text-[9px] font-mono">
            <div className="flex justify-between text-secondary-foreground"><span>KRI Nagapasa</span><span className="text-foreground">PATROL</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>KRI Ardadedali</span><span className="text-foreground">PATROL</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>KRI Alugoro</span><span className="status-warning">DOCK</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>KRI Cakra</span><span className="text-foreground">PATROL</span></div>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Pesawat Militer" icon={<Shield className="w-3 h-3" />}>
          <div className="space-y-0.5 text-[9px] font-mono">
            <div className="flex justify-between text-secondary-foreground"><span>F-16 Falcon</span><span className="text-muted-foreground">READY</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>Su-27 Flanker</span><span className="text-muted-foreground">READY</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>T-50i Eagle</span><span className="text-foreground">ACTIVE</span></div>
            <div className="flex justify-between text-secondary-foreground"><span>CN-235 MPA</span><span className="status-warning">MAINT</span></div>
          </div>
        </DashboardPanel>

        <DashboardPanel title="Threat Assessment" icon={<AlertTriangle className="w-3 h-3" />}>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[9px] font-mono">
              <span className="text-muted-foreground">CYBER</span>
              <span className="status-warning">ELEVATED</span>
            </div>
            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: "65%", backgroundColor: "hsl(35, 80%, 50%)" }} />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono">
              <span className="text-muted-foreground">MARITIME</span>
              <span className="text-muted-foreground">LOW</span>
            </div>
            <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "25%" }} />
            </div>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
};

export default DashboardView;
