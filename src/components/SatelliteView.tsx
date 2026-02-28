import DashboardPanel from "./DashboardPanel";
import { Satellite } from "lucide-react";

const indonesianSatellites = [
  { name: "PALAPA-D", type: "Komunikasi", operator: "Indosat", orbit: "GEO 113°E", status: "ACTIVE", year: 2009 },
  { name: "TELKOM-3S", type: "Komunikasi", operator: "Telkom", orbit: "GEO 118°E", status: "ACTIVE", year: 2017 },
  { name: "TELKOM-4 (Merah Putih)", type: "Komunikasi", operator: "Telkom", orbit: "GEO 108°E", status: "ACTIVE", year: 2018 },
  { name: "BRIsat", type: "Banking/Komunikasi", operator: "BRI", orbit: "GEO 150.5°E", status: "ACTIVE", year: 2016 },
  { name: "PSN-VI (Nusantara Satu)", type: "Komunikasi", operator: "PSN", orbit: "GEO 146°E", status: "ACTIVE", year: 2019 },
  { name: "SATRIA-1", type: "Internet/VSAT", operator: "BAKTI", orbit: "GEO 146°E", status: "ACTIVE", year: 2023 },
  { name: "LAPAN-A2/ORARI", type: "Observasi Bumi", operator: "LAPAN/BRIN", orbit: "LEO 650km", status: "ACTIVE", year: 2015 },
  { name: "LAPAN-A3/IPB", type: "Observasi Bumi", operator: "LAPAN/BRIN", orbit: "LEO 505km", status: "ACTIVE", year: 2016 },
  { name: "LAPAN-A4 (LAPAN-Tubsat)", type: "Observasi", operator: "LAPAN/BRIN", orbit: "LEO", status: "ACTIVE", year: 2007 },
  { name: "CHINASAT-11 (Lease)", type: "Militer/Komunikasi", operator: "TNI", orbit: "GEO", status: "CLASSIFIED", year: 2013 },
  { name: "NUSANTARA-SAT", type: "Intelijen/Pertahanan", operator: "BIN/TNI", orbit: "LEO", status: "CLASSIFIED", year: 2024 },
  { name: "SAT-PERTAHANAN-1", type: "Militer ISR", operator: "Kemenhan", orbit: "LEO", status: "CLASSIFIED", year: 2025 },
  { name: "GARUDA-EYE (ISR)", type: "Surveillance/Recon", operator: "TNI AU", orbit: "LEO SSO", status: "CLASSIFIED", year: 2025 },
  { name: "RAJAWALI-SAT", type: "SIGINT/ELINT", operator: "BIN", orbit: "LEO", status: "CLASSIFIED", year: 2026 },
];

const SatelliteView = () => {
  return (
    <div className="h-full p-3 overflow-y-auto">
      <div className="mb-3 flex items-center gap-2.5">
        <Satellite className="w-4 h-4 text-muted-foreground" />
        <div>
          <h2 className="text-xs font-bold text-foreground tracking-wide">SATELIT INDONESIA</h2>
          <p className="text-[9px] font-mono text-muted-foreground">
            {indonesianSatellites.length} satellites tracked
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-1.5">
        {indonesianSatellites.map((sat) => (
          <div key={sat.name} className="bg-card border border-border rounded p-2.5">
            <div className="grid grid-cols-6 gap-3 text-[9px] font-mono items-center">
              <div className="col-span-1">
                <span className="text-foreground font-medium">{sat.name}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{sat.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{sat.operator}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{sat.orbit}</span>
              </div>
              <div>
                <span className="text-muted-foreground">{sat.year}</span>
              </div>
              <div className="text-right">
                <span className={sat.status === "CLASSIFIED" ? "status-active" : "text-foreground"}>
                  {sat.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SatelliteView;
