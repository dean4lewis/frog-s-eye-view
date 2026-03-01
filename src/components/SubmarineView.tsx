import { useState } from "react";
import { Ship, Anchor, Navigation, Radio, ExternalLink } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const submarines = [
  { name: "KRI Nagapasa-403", class: "Chang Bogo (Type 209/1400)", status: "PATROL", area: "Laut Natuna", depth: "150m", crew: 40, year: 2017 },
  { name: "KRI Ardadedali-404", class: "Chang Bogo (Type 209/1400)", status: "PATROL", area: "Selat Malaka", depth: "120m", crew: 40, year: 2018 },
  { name: "KRI Alugoro-405", class: "Chang Bogo (Type 209/1400)", status: "DOCK", area: "Surabaya", depth: "—", crew: 40, year: 2021 },
  { name: "KRI Cakra-401", class: "Type 209/1300", status: "PATROL", area: "Selat Sunda", depth: "80m", crew: 34, year: 1981 },
  { name: "KRI Nanggala-402", class: "Type 209/1300", status: "DECOMMISSIONED", area: "—", depth: "—", crew: 0, year: 1981 },
];

const navalBases = [
  { name: "Pangkalan Utama TNI AL II", location: "Surabaya", lat: -7.2, lon: 112.75, type: "Markas Armada Timur" },
  { name: "Pangkalan Utama TNI AL III", location: "Jakarta", lat: -6.1, lon: 106.85, type: "Markas Armada Barat" },
  { name: "Pangkalan Utama TNI AL IV", location: "Tanjung Pinang", lat: 0.92, lon: 104.45, type: "Pangkalan Kapal Selam" },
  { name: "Pangkalan Utama TNI AL V", location: "Makassar", lat: -5.14, lon: 119.42, type: "Markas Armada Tengah" },
];

const SubmarineView = () => {
  const [selectedSub, setSelectedSub] = useState(submarines[0]);

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Ship className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">SUBMARINE FLEET COMMAND</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {submarines.filter(s => s.status === "PATROL").length} units on patrol · TNI AL Fleet
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.marinetraffic.com/en/ais/home/centerx:112/centery:-6/zoom:6"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> MarineTraffic
          </a>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Map with submarine positions */}
        <div className="col-span-3 bg-card border border-border rounded overflow-hidden relative">
          <iframe
            src="https://www.marinetraffic.com/en/ais/embed/centerx:112.7/centery:-4.5/zoom:5/maptype:4"
            className="w-full h-full border-0"
            style={{ minHeight: "400px", filter: "brightness(0.85) contrast(1.1)" }}
            title="Naval Fleet Map"
            allow="fullscreen"
          />

          <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-foreground font-medium">SUBMARINE TRACKING</div>
            <div className="text-[8px] font-mono text-muted-foreground">Live Maritime Data — Indonesia EEZ</div>
          </div>

          <div className="absolute top-2 right-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[8px] font-mono text-primary">{submarines.filter(s => s.status === "PATROL").length} UNITS ACTIVE</div>
            <div className="text-[7px] font-mono text-muted-foreground">CLASSIFIED POSITIONS</div>
          </div>
        </div>

        {/* Submarine List */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <DashboardPanel title="Fleet Registry" icon={<Anchor className="w-3 h-3" />}>
            <div className="space-y-1.5">
              {submarines.map((sub) => (
                <button
                  key={sub.name}
                  onClick={() => setSelectedSub(sub)}
                  className={`w-full text-left p-2 rounded border transition-all ${
                    selectedSub.name === sub.name
                      ? "border-primary bg-secondary"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <div className="text-[8px] font-mono font-medium text-foreground truncate">{sub.name}</div>
                  <div className="text-[7px] font-mono text-muted-foreground mt-0.5">{sub.class}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-[7px] font-mono ${
                      sub.status === "PATROL" ? "text-primary" :
                      sub.status === "DOCK" ? "status-warning" : "text-muted-foreground"
                    }`}>{sub.status}</span>
                    <span className="text-[7px] font-mono text-muted-foreground">{sub.area}</span>
                  </div>
                </button>
              ))}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Selected Unit" icon={<Navigation className="w-3 h-3" />}>
            <div className="space-y-1 text-[8px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground text-[7px]">{selectedSub.name}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Class</span><span className="text-foreground text-[7px]">{selectedSub.class.split(" ")[0]}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Status</span><span className="text-primary">{selectedSub.status}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Area</span><span className="text-foreground">{selectedSub.area}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Depth</span><span className="text-foreground">{selectedSub.depth}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Crew</span><span className="text-foreground">{selectedSub.crew}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Comm.</span><span className="text-foreground">{selectedSub.year}</span></div>
            </div>
          </DashboardPanel>

          <DashboardPanel title="Naval Bases" icon={<Radio className="w-3 h-3" />}>
            <div className="space-y-1">
              {navalBases.map((base) => (
                <div key={base.name} className="text-[7px] font-mono">
                  <div className="text-foreground">{base.location}</div>
                  <div className="text-muted-foreground">{base.type}</div>
                </div>
              ))}
            </div>
          </DashboardPanel>
        </div>
      </div>
    </div>
  );
};

export default SubmarineView;
