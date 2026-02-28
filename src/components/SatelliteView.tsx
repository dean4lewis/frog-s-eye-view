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
  { name: "LAPAN-A4 (LAPAN-Tubsat)", type: "Observasi/Surveillance", operator: "LAPAN/BRIN", orbit: "LEO", status: "ACTIVE", year: 2007 },
  // Military/Classified
  { name: "CHINASAT-11 (Lease)", type: "Militer/Komunikasi", operator: "TNI", orbit: "GEO", status: "CLASSIFIED", year: 2013 },
  { name: "NUSANTARA-SAT", type: "Intelijen/Pertahanan", operator: "BIN/TNI", orbit: "LEO", status: "CLASSIFIED", year: 2024 },
  { name: "SAT-PERTAHANAN-1", type: "Militer ISR", operator: "Kemenhan", orbit: "LEO", status: "CLASSIFIED", year: 2025 },
  { name: "GARUDA-EYE (ISR)", type: "Surveillance/Recon", operator: "TNI AU", orbit: "LEO SSO", status: "CLASSIFIED", year: 2025 },
  { name: "RAJAWALI-SAT", type: "SIGINT/ELINT", operator: "BIN", orbit: "LEO", status: "CLASSIFIED", year: 2026 },
];

const SatelliteView = () => {
  return (
    <div className="h-full p-3 overflow-y-auto">
      <div className="mb-4 flex items-center gap-3">
        <Satellite className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-sm font-bold text-foreground">Satelit Indonesia</h2>
          <p className="text-[10px] font-mono text-muted-foreground">
            Complete Indonesian Satellite Registry — {indonesianSatellites.length} satellites tracked
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {indonesianSatellites.map((sat) => (
          <DashboardPanel key={sat.name} title={sat.name} icon={<Satellite className="w-3 h-3" />}>
            <div className="grid grid-cols-5 gap-4 text-[10px] font-mono">
              <div>
                <span className="text-muted-foreground block">TYPE</span>
                <span className="text-foreground">{sat.type}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">OPERATOR</span>
                <span className="text-foreground">{sat.operator}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">ORBIT</span>
                <span className="text-foreground">{sat.orbit}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">YEAR</span>
                <span className="text-foreground">{sat.year}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">STATUS</span>
                <span className={sat.status === "CLASSIFIED" ? "text-accent" : "status-online"}>
                  {sat.status}
                </span>
              </div>
            </div>
          </DashboardPanel>
        ))}
      </div>
    </div>
  );
};

export default SatelliteView;
