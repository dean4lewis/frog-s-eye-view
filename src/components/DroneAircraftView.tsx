import { Plane, Shield } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const drones = [
  { name: "CH-4 Rainbow", type: "UCAV", status: "READY", base: "Halim PK", range: "3,500 km", endurance: "40h" },
  { name: "Elang Hitam", type: "MALE UCAV", status: "ACTIVE", base: "Lanud Iswahjudi", range: "2,000 km", endurance: "30h" },
  { name: "Wulung", type: "Tactical UAV", status: "MAINT", base: "Surabaya", range: "120 km", endurance: "6h" },
  { name: "Rajawali 720", type: "Recon UAV", status: "READY", base: "Pontianak", range: "150 km", endurance: "8h" },
  { name: "Black Eagle", type: "MALE UAV", status: "READY", base: "Makassar", range: "1,500 km", endurance: "24h" },
];

const aircraft = [
  { name: "F-16 C/D Fighting Falcon", type: "Fighter", qty: 33, status: "OPERATIONAL", base: "Lanud Iswahjudi" },
  { name: "Su-27/30 Flanker", type: "Air Superiority", qty: 16, status: "OPERATIONAL", base: "Lanud Sultan Hasanuddin" },
  { name: "T-50i Golden Eagle", type: "Lead-in Fighter", qty: 16, status: "OPERATIONAL", base: "Lanud Iswahjudi" },
  { name: "CN-235 MPA", type: "Maritime Patrol", qty: 9, status: "OPERATIONAL", base: "Various" },
  { name: "C-130 Hercules", type: "Transport", qty: 24, status: "OPERATIONAL", base: "Lanud Halim" },
  { name: "Boeing 737-2X9 Surveiller", type: "SIGINT", qty: 3, status: "OPERATIONAL", base: "Lanud Halim" },
  { name: "KFX/IFX (KF-21)", type: "5th Gen Fighter", qty: 0, status: "DEVELOPMENT", base: "—" },
  { name: "Rafale F4", type: "Multirole", qty: 6, status: "ON ORDER", base: "TBD" },
];

const DroneAircraftView = () => {
  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center gap-2.5 mb-1">
        <Plane className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">DRONE & PESAWAT MILITER</h2>
          <p className="text-[9px] font-mono text-muted-foreground">TNI AU Fleet Registry · {drones.length} UAVs · {aircraft.length} Aircraft Types</p>
        </div>
      </div>

      <h3 className="text-[9px] font-mono text-muted-foreground tracking-wider mt-1">UNMANNED AERIAL VEHICLES</h3>
      <div className="grid grid-cols-1 gap-1.5">
        {drones.map((d) => (
          <div key={d.name} className="bg-card border border-border rounded p-2.5">
            <div className="grid grid-cols-6 gap-3 text-[9px] font-mono items-center">
              <span className="text-foreground font-medium">{d.name}</span>
              <span className="text-muted-foreground">{d.type}</span>
              <span className="text-muted-foreground">{d.base}</span>
              <span className="text-muted-foreground">{d.range}</span>
              <span className="text-muted-foreground">{d.endurance}</span>
              <span className={`text-right ${d.status === "ACTIVE" ? "text-primary" : d.status === "MAINT" ? "status-warning" : "text-foreground"}`}>{d.status}</span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-[9px] font-mono text-muted-foreground tracking-wider mt-2">MILITARY AIRCRAFT</h3>
      <div className="grid grid-cols-1 gap-1.5">
        {aircraft.map((a) => (
          <div key={a.name} className="bg-card border border-border rounded p-2.5">
            <div className="grid grid-cols-5 gap-3 text-[9px] font-mono items-center">
              <span className="text-foreground font-medium">{a.name}</span>
              <span className="text-muted-foreground">{a.type}</span>
              <span className="text-muted-foreground">x{a.qty}</span>
              <span className="text-muted-foreground">{a.base}</span>
              <span className={`text-right ${
                a.status === "OPERATIONAL" ? "text-primary" :
                a.status === "DEVELOPMENT" ? "status-warning" : "text-foreground"
              }`}>{a.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DroneAircraftView;
