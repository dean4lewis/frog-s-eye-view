import { useState } from "react";
import { Map, Ship, Crosshair, Radar, ExternalLink, Layers } from "lucide-react";

const mapModes = [
  { id: "dark", label: "Dark Intelligence", filter: "grayscale(100%) brightness(0.2) contrast(1.8) sepia(0.1) hue-rotate(180deg)" },
  { id: "satellite", label: "Satellite Imagery", filter: "brightness(0.7) contrast(1.3) saturate(0.8)" },
  { id: "topo", label: "Topographic", filter: "grayscale(80%) brightness(0.4) contrast(1.4)" },
  { id: "marine", label: "Marine Traffic", filter: "none" },
];

const strategicPoints = [
  { name: "Selat Malaka", lat: 2.5, lon: 101.0, type: "maritime", threat: "HIGH" },
  { name: "Selat Sunda", lat: -6.1, lon: 105.7, type: "maritime", threat: "MED" },
  { name: "Selat Lombok", lat: -8.4, lon: 115.7, type: "maritime", threat: "LOW" },
  { name: "Laut Natuna Utara", lat: 4.0, lon: 108.0, type: "territorial", threat: "HIGH" },
  { name: "Selat Makassar", lat: -1.0, lon: 118.0, type: "maritime", threat: "MED" },
  { name: "Laut Banda", lat: -5.5, lon: 129.5, type: "maritime", threat: "LOW" },
  { name: "Selat Karimata", lat: -1.5, lon: 108.5, type: "maritime", threat: "MED" },
  { name: "Laut Arafura", lat: -7.5, lon: 135.0, type: "maritime", threat: "MED" },
];

const navalVessels = [
  { name: "KRI Raden Eddy Martadinata", type: "Frigate", class: "PKR 10514", status: "PATROL", area: "Natuna" },
  { name: "KRI I Gusti Ngurah Rai", type: "Frigate", class: "PKR 10514", status: "PATROL", area: "Selat Malaka" },
  { name: "KRI Sultan Hasanuddin", type: "Corvette", class: "SIGMA 9113", status: "ACTIVE", area: "Makassar" },
  { name: "KRI Diponegoro", type: "Corvette", class: "SIGMA 9113", status: "DOCK", area: "Surabaya" },
  { name: "KRI Nagapasa", type: "Submarine", class: "Chang Bogo", status: "PATROL", area: "Classified" },
  { name: "KRI Alugoro", type: "Submarine", class: "Chang Bogo", status: "DOCK", area: "Surabaya" },
  { name: "KRI Bung Tomo", type: "Corvette", class: "Bung Tomo", status: "PATROL", area: "Selat Sunda" },
];

const MilitaryMapView = () => {
  const [activeMode, setActiveMode] = useState(mapModes[0]);

  const getMapSrc = () => {
    if (activeMode.id === "marine") {
      return "https://www.marinetraffic.com/en/ais/embed/centerx:112.7/centery:-4.5/zoom:5/maptype:4";
    }
    return "https://www.openstreetmap.org/export/embed.html?bbox=93%2C-14%2C143%2C10&layer=mapnik";
  };

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Map className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">MILITARY INTELLIGENCE MAP</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              Strategic maritime surveillance · Indonesia Exclusive Economic Zone
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {mapModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setActiveMode(mode)}
              className={`px-2 py-0.5 text-[8px] font-mono rounded border transition-colors ${
                activeMode.id === mode.id
                  ? "border-primary bg-secondary text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Map */}
        <div className="col-span-3 bg-card border border-border rounded overflow-hidden relative">
          <iframe
            src={getMapSrc()}
            className="w-full h-full border-0"
            style={{
              minHeight: "400px",
              filter: activeMode.id === "marine" ? "none" : activeMode.filter,
            }}
            title="Military Intelligence Map"
            allow="fullscreen"
          />

          <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-foreground">INDONESIA EEZ MONITOR</div>
            <div className="text-[8px] font-mono text-muted-foreground">Mode: {activeMode.label}</div>
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex gap-2 flex-wrap">
            <a
              href="https://experience.arcgis.com/experience/76ae080f4cfc4c2dba1af0a3fbb804e1"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/90 border border-border rounded px-2 py-1 text-[8px] font-mono text-primary hover:bg-secondary transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-2.5 h-2.5" /> ArcGIS Maritime
            </a>
            <a
              href="https://www.marinetraffic.com/en/ais/home/centerx:109.8/centery:-2.9/zoom:7"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/90 border border-border rounded px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Ship className="w-2.5 h-2.5" /> MarineTraffic Live
            </a>
            <a
              href="https://geoservices.big.go.id/portal/apps/webappviewer/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-card/90 border border-border rounded px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <Layers className="w-2.5 h-2.5" /> BIG Geoportal
            </a>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
              <Crosshair className="w-3 h-3 text-muted-foreground" />
              <span className="text-[8px] font-mono text-muted-foreground tracking-wider">STRATEGIC CHOKEPOINTS</span>
            </div>
            <div className="p-2 space-y-1">
              {strategicPoints.map((pt) => (
                <div key={pt.name} className="flex items-center justify-between text-[8px] font-mono">
                  <span className="text-secondary-foreground truncate">{pt.name}</span>
                  <span className={
                    pt.threat === "HIGH" ? "status-critical" :
                    pt.threat === "MED" ? "status-warning" : "text-muted-foreground"
                  }>{pt.threat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
              <Ship className="w-3 h-3 text-muted-foreground" />
              <span className="text-[8px] font-mono text-muted-foreground tracking-wider">NAVAL FLEET TRACKER</span>
            </div>
            <div className="p-2 space-y-1.5">
              {navalVessels.map((vessel) => (
                <div key={vessel.name} className="text-[8px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground truncate text-[7px]">{vessel.name}</span>
                    <span className={
                      vessel.status === "PATROL" ? "text-primary" :
                      vessel.status === "DOCK" ? "status-warning" : "text-foreground"
                    }>{vessel.status}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground text-[7px]">
                    <span>{vessel.class}</span>
                    <span>{vessel.area}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
              <Radar className="w-3 h-3 text-muted-foreground" />
              <span className="text-[8px] font-mono text-muted-foreground tracking-wider">RADAR COVERAGE</span>
            </div>
            <div className="p-2 space-y-1 text-[8px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Natuna OTH-R</span><span className="text-primary">ACTIVE</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Pontianak ELINT</span><span className="text-primary">ACTIVE</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Makassar C-Band</span><span className="text-primary">ACTIVE</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Jayapura S-Band</span><span className="status-warning">MAINT</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Manado X-Band</span><span className="text-primary">ACTIVE</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MilitaryMapView;
