import { Radar as RadarIcon, Radio, Map, Shield } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const radarSystems = [
  { name: "Natuna OTH-R", type: "Over-The-Horizon", range: "3,000 km", status: "ACTIVE", location: "Ranai, Natuna" },
  { name: "Pontianak ELINT", type: "Electronic Intelligence", range: "800 km", status: "ACTIVE", location: "Pontianak" },
  { name: "Makassar C-Band", type: "Air Surveillance", range: "450 km", status: "ACTIVE", location: "Makassar" },
  { name: "Jayapura S-Band", type: "Air Defense", range: "400 km", status: "MAINT", location: "Jayapura" },
  { name: "Manado X-Band", type: "Fire Control", range: "200 km", status: "ACTIVE", location: "Manado" },
  { name: "Jakarta AEWC", type: "Airborne Early Warning", range: "600 km", status: "ACTIVE", location: "Halim PK" },
  { name: "Surabaya Naval", type: "Surface Search", range: "350 km", status: "ACTIVE", location: "Surabaya" },
  { name: "Biak Long Range", type: "Long Range Search", range: "500 km", status: "ACTIVE", location: "Biak" },
];

const RadarView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <RadarIcon className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">RADAR SYSTEMS</h2>
          <p className="text-[9px] font-mono text-muted-foreground">{radarSystems.length} systems tracked · National Air Defense</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {radarSystems.map((radar) => (
          <div key={radar.name} className="bg-card border border-border rounded p-2.5">
            <div className="grid grid-cols-5 gap-3 text-[9px] font-mono items-center">
              <span className="text-foreground font-medium">{radar.name}</span>
              <span className="text-muted-foreground">{radar.type}</span>
              <span className="text-muted-foreground">{radar.range}</span>
              <span className="text-muted-foreground">{radar.location}</span>
              <span className={`text-right ${radar.status === "ACTIVE" ? "text-primary" : "status-warning"}`}>{radar.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        <DashboardPanel title="Coverage" icon={<Map className="w-3 h-3" />}>
          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">Western</span><span className="text-primary">98%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Central</span><span className="text-primary">94%</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Eastern</span><span className="status-warning">78%</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Threats Detected" icon={<Shield className="w-3 h-3" />}>
          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">Aircraft</span><span className="text-foreground">0</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Maritime</span><span className="status-warning">2</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Unknown</span><span className="status-critical">1</span></div>
          </div>
        </DashboardPanel>
        <DashboardPanel title="Comms" icon={<Radio className="w-3 h-3" />}>
          <div className="space-y-1 text-[9px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">Data Link</span><span className="text-primary">OK</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Sat Link</span><span className="text-primary">OK</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">HF Radio</span><span className="text-primary">OK</span></div>
          </div>
        </DashboardPanel>
      </div>
    </div>
  );
};

export default RadarView;
