import { useState } from "react";
import { Map, Layers, Globe, Navigation } from "lucide-react";

const basemaps = [
  {
    id: "dark-gray",
    label: "Dark Gray Canvas",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    description: "Dark Gray Military Intelligence",
  },
  {
    id: "dark-intel",
    label: "Dark Intel",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png",
    description: "Ultra-dark intelligence operations view",
  },
  {
    id: "streets-night",
    label: "Streets (Night)",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    description: "Dark street navigation with labels",
  },
  {
    id: "satellite",
    label: "Satellite Imagery",
    tileUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    description: "Esri World Satellite Imagery",
  },
  {
    id: "topo",
    label: "Topographic Military",
    tileUrl: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    description: "Topographic map with terrain data",
  },
  {
    id: "jakarta-sector",
    label: "Jakarta Sector",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    description: "Jakarta metropolitan area — focused view",
    center: { lat: -6.2088, lon: 106.8456, zoom: 12 },
  },
  {
    id: "natuna",
    label: "Natuna Theater",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    description: "Natuna strategic zone",
    center: { lat: 3.99, lon: 108.38, zoom: 7 },
  },
  {
    id: "realtime-data",
    label: "Realtime Data",
    tileUrl: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    description: "Dark map with realtime coordinate data",
  },
];

const realtimePoints = [
  { name: "Jakarta Command", lat: -6.2088, lon: 106.8456, type: "HQ" },
  { name: "Surabaya Naval", lat: -7.2575, lon: 112.7521, type: "NAVAL" },
  { name: "Natuna Outpost", lat: 3.9934, lon: 108.3829, type: "OUTPOST" },
  { name: "Makassar Station", lat: -5.1477, lon: 119.4327, type: "STATION" },
  { name: "Manado Radar", lat: 1.4748, lon: 124.8421, type: "RADAR" },
  { name: "Jayapura Base", lat: -2.5337, lon: 140.7183, type: "BASE" },
  { name: "Pontianak SIGINT", lat: -0.0263, lon: 109.3425, type: "SIGINT" },
  { name: "Ambon Watch", lat: -3.6954, lon: 128.1814, type: "WATCH" },
];

const MapModesView = () => {
  const [activeMap, setActiveMap] = useState(basemaps[0]);

  // Build iframe URL based on map type
  const getMapUrl = () => {
    const bm = activeMap;
    if (bm.id === "satellite") {
      // Use ArcGIS satellite embed
      return "https://www.arcgis.com/apps/mapviewer/index.html?webmap=c03a526d94704bfb839445e80de95495";
    }
    // For CartoDB/OSM based maps, use OSM embed with appropriate filter
    const center = (bm as any).center;
    if (center) {
      const delta = 0.5;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${center.lon - delta}%2C${center.lat - delta}%2C${center.lon + delta}%2C${center.lat + delta}&layer=mapnik`;
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=93%2C-12%2C141%2C8&layer=mapnik`;
  };

  const getFilter = () => {
    if (activeMap.id === "satellite") return "brightness(0.85) contrast(1.1) saturate(0.9)";
    if (activeMap.id === "topo") return "grayscale(60%) brightness(0.45) contrast(1.3) sepia(0.15)";
    if (activeMap.id === "dark-intel") return "grayscale(100%) brightness(0.3) contrast(1.5) hue-rotate(180deg)";
    if (activeMap.id === "streets-night") return "grayscale(100%) brightness(0.35) contrast(1.4) hue-rotate(190deg) saturate(0.4)";
    // Default dark gray - not too dark
    return "grayscale(100%) brightness(0.3) contrast(1.5) hue-rotate(180deg)";
  };

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">INTELLIGENCE MAP CENTER</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {basemaps.length} basemap modes · Palantir-style intelligence mapping
            </p>
          </div>
        </div>
      </div>

      {/* Basemap selector */}
      <div className="flex gap-1 flex-wrap">
        {basemaps.map((bm) => (
          <button
            key={bm.id}
            onClick={() => setActiveMap(bm)}
            className={`px-2 py-0.5 text-[8px] font-mono rounded border transition-colors ${
              activeMap.id === bm.id
                ? "border-primary bg-secondary text-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {bm.label}
          </button>
        ))}
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Map */}
        <div className="col-span-3 bg-card border border-border rounded overflow-hidden relative">
          <iframe
            key={activeMap.id}
            src={getMapUrl()}
            className="w-full h-full border-0"
            style={{ minHeight: "400px", filter: getFilter() }}
            title={activeMap.label}
            sandbox="allow-scripts allow-same-origin"
          />

          <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-foreground font-medium">{activeMap.label}</div>
            <div className="text-[8px] font-mono text-muted-foreground">{activeMap.description}</div>
          </div>

          <div className="absolute top-2 right-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[8px] font-mono text-primary">{realtimePoints.length} ACTIVE NODES</div>
            <div className="text-[7px] font-mono text-muted-foreground">REALTIME TRACKING</div>
          </div>

          {/* Overlay markers for realtime points */}
          {realtimePoints.map((pt, i) => (
            <div
              key={pt.name}
              className="absolute group cursor-pointer"
              style={{
                top: `${15 + (i % 4) * 20}%`,
                left: `${10 + (i % 5) * 18}%`,
              }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary/80 border border-primary animate-pulse" />
              <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-card border border-border rounded px-2 py-1 whitespace-nowrap z-10">
                <div className="text-[8px] font-mono text-foreground">{pt.name}</div>
                <div className="text-[7px] font-mono text-primary">{pt.type}</div>
              </div>
            </div>
          ))}

          <div className="absolute bottom-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[8px] font-mono text-muted-foreground">CLASSIFICATION: RESTRICTED</div>
          </div>
        </div>

        {/* Sidebar data */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-muted-foreground" />
              <span className="text-[8px] font-mono text-muted-foreground tracking-wider">MAP LAYERS</span>
            </div>
            <div className="p-2 space-y-1">
              {["Intel Grid", "Coordinate Overlay", "Unit Positions", "Threat Zones", "Maritime Lanes", "Radar Coverage"].map((layer) => (
                <div key={layer} className="flex items-center justify-between text-[8px] font-mono">
                  <span className="text-secondary-foreground">{layer}</span>
                  <span className="text-primary">ON</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
              <Navigation className="w-3 h-3 text-muted-foreground" />
              <span className="text-[8px] font-mono text-muted-foreground tracking-wider">ACTIVE NODES</span>
            </div>
            <div className="p-2 space-y-1">
              {realtimePoints.map((pt) => (
                <div key={pt.name} className="text-[7px] font-mono">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">{pt.name}</span>
                    <span className="text-primary">{pt.type}</span>
                  </div>
                  <div className="text-muted-foreground">{pt.lat.toFixed(4)}° {pt.lon.toFixed(4)}°</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded overflow-hidden">
            <div className="px-2.5 py-1.5 border-b border-border flex items-center gap-1.5">
              <Map className="w-3 h-3 text-muted-foreground" />
              <span className="text-[8px] font-mono text-muted-foreground tracking-wider">MAP INFO</span>
            </div>
            <div className="p-2 space-y-1 text-[8px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Source</span><span className="text-foreground">CartoDB / OSM</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Projection</span><span className="text-foreground">EPSG:3857</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Updates</span><span className="text-primary">REALTIME</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Classification</span><span className="status-warning">RESTRICTED</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModesView;
