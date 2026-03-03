import { useState } from "react";
import { Ship, Anchor, Navigation, Radio, Waves, MapPin } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const submarines = [
  { name: "KRI Nagapasa-403", class: "Chang Bogo (Type 209/1400)", status: "PATROL", area: "Laut Natuna", depth: "150m", crew: 40, year: 2017, lat: 4.0, lon: 108.0 },
  { name: "KRI Ardadedali-404", class: "Chang Bogo (Type 209/1400)", status: "PATROL", area: "Selat Malaka", depth: "120m", crew: 40, year: 2018, lat: 2.5, lon: 101.0 },
  { name: "KRI Alugoro-405", class: "Chang Bogo (Type 209/1400)", status: "DOCK", area: "Surabaya", depth: "—", crew: 40, year: 2021, lat: -7.25, lon: 112.75 },
  { name: "KRI Cakra-401", class: "Type 209/1300", status: "PATROL", area: "Selat Sunda", depth: "80m", crew: 34, year: 1981, lat: -6.1, lon: 105.7 },
  { name: "KRI Nanggala-402", class: "Type 209/1300", status: "DECOMMISSIONED", area: "—", depth: "—", crew: 0, year: 1981, lat: 0, lon: 0 },
];

const navalBases = [
  { name: "Lantamal II", location: "Surabaya", lat: -7.2, lon: 112.75, type: "Markas Armada Timur" },
  { name: "Lantamal III", location: "Jakarta", lat: -6.1, lon: 106.85, type: "Markas Armada Barat" },
  { name: "Lantamal IV", location: "Tanjung Pinang", lat: 0.92, lon: 104.45, type: "Pangkalan Kapal Selam" },
  { name: "Lantamal V", location: "Makassar", lat: -5.14, lon: 119.42, type: "Markas Armada Tengah" },
];

type MapSource = "maritime" | "kkp" | "vtc";

const SubmarineView = () => {
  const [selectedSub, setSelectedSub] = useState(submarines[0]);
  const [mapSource, setMapSource] = useState<MapSource>("maritime");

  const getMapSrc = () => {
    switch (mapSource) {
      case "maritime":
        return "https://www.marinetraffic.com/en/ais/embed/centerx:109.8/centery:-2.9/zoom:5/maptype:4/shownames:false/mmsi:0/shipid:0/port:0/showmenu:false/showsearch:false";
      case "kkp":
        return "https://sidako.kkp.go.id/sidako/map";
      case "vtc":
        return "https://vtc.kkp.go.id/#7/-2.9/109.8";
      default:
        return "https://www.marinetraffic.com/en/ais/embed/centerx:109.8/centery:-2.9/zoom:5/maptype:4/shownames:false/mmsi:0/shipid:0/port:0/showmenu:false/showsearch:false";
    }
  };

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Ship className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">SUBMARINE FLEET COMMAND</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {submarines.filter(s => s.status === "PATROL").length} units on patrol · TNI AL Fleet · Realtime Maritime Data
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {([
            { id: "maritime" as MapSource, label: "MarineTraffic" },
            { id: "kkp" as MapSource, label: "KKP SIDAKO" },
            { id: "vtc" as MapSource, label: "KKP VTC" },
          ]).map((src) => (
            <button
              key={src.id}
              onClick={() => setMapSource(src.id)}
              className={`px-2 py-0.5 text-[8px] font-mono rounded border transition-colors ${
                mapSource === src.id
                  ? "border-primary bg-secondary text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {src.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Map with maritime data */}
        <div className="col-span-3 bg-card border border-border rounded overflow-hidden relative">
          <iframe
            key={mapSource}
            src={getMapSrc()}
            className="w-full h-full border-0"
            style={{ minHeight: "400px" }}
            title="Maritime Fleet Map"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />

          <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-foreground font-medium flex items-center gap-1.5">
              <Waves className="w-3 h-3 text-primary" />
              MARITIME TRACKING — {mapSource === "maritime" ? "AIS Data" : mapSource === "kkp" ? "SIDAKO KKP" : "VTC KKP"}
            </div>
            <div className="text-[8px] font-mono text-muted-foreground">Indonesia EEZ · Realtime Vessel Positions</div>
          </div>

          <div className="absolute top-2 right-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[8px] font-mono text-primary">{submarines.filter(s => s.status === "PATROL").length} SUBS ON PATROL</div>
            <div className="text-[7px] font-mono text-muted-foreground">CLASSIFIED POSITIONS</div>
          </div>

          <div className="absolute bottom-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[8px] font-mono text-muted-foreground">Click vessels on map for details</div>
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
              {selectedSub.lat !== 0 && (
                <div className="flex justify-between"><span className="text-muted-foreground">Position</span><span className="text-primary">{selectedSub.lat.toFixed(2)}° {selectedSub.lon.toFixed(2)}°</span></div>
              )}
            </div>
          </DashboardPanel>

          <DashboardPanel title="Naval Bases" icon={<Radio className="w-3 h-3" />}>
            <div className="space-y-1.5">
              {navalBases.map((base) => (
                <div key={base.name} className="text-[7px] font-mono">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-2 h-2 text-primary" />
                    <span className="text-foreground">{base.location}</span>
                  </div>
                  <div className="text-muted-foreground ml-3">{base.type}</div>
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
