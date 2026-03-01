import { useState } from "react";
import { Map, Layers, Globe, ExternalLink, Navigation } from "lucide-react";

const basemaps = [
  {
    id: "dark-gray",
    label: "Dark Gray Canvas",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    embedUrl: "https://www.arcgis.com/apps/mapviewer/index.html?webmap=&basemapUrl=https://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=93%2C-12%2C141%2C8&layer=mapnik",
    filter: "grayscale(100%) brightness(0.2) contrast(1.8) sepia(0.1) hue-rotate(180deg)",
    description: "Dark Gray Military Intelligence",
  },
  {
    id: "satellite",
    label: "Satellite Imagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    embedUrl: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=93%2C-12%2C141%2C8&layer=mapnik",
    filter: "brightness(0.7) contrast(1.3) saturate(0.8)",
    description: "Esri World Satellite Imagery",
  },
  {
    id: "streets-night",
    label: "Streets (Night)",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer",
    embedUrl: "",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=93%2C-12%2C141%2C8&layer=mapnik",
    filter: "grayscale(100%) brightness(0.15) contrast(2.0) hue-rotate(200deg) saturate(0.3)",
    description: "Dark street view with intelligence overlay",
  },
  {
    id: "topo",
    label: "Topographic Military",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",
    embedUrl: "",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=93%2C-12%2C141%2C8&layer=mapnik",
    filter: "grayscale(80%) brightness(0.35) contrast(1.5) sepia(0.2)",
    description: "Topographic map with terrain data",
  },
  {
    id: "foto-udara",
    label: "Basemap Foto Udara",
    url: "",
    embedUrl: "https://tanahair.indonesia.go.id/portal-web",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=104%2C-8%2C114%2C-4&layer=mapnik",
    filter: "brightness(0.75) contrast(1.2)",
    description: "BIG Indonesia aerial imagery",
  },
  {
    id: "rbi",
    label: "Basemap RBI",
    url: "",
    embedUrl: "https://tanahair.indonesia.go.id/portal-web",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=104%2C-8%2C114%2C-4&layer=mapnik",
    filter: "grayscale(60%) brightness(0.4) contrast(1.3)",
    description: "Rupa Bumi Indonesia — BIG",
  },
  {
    id: "dark-intel",
    label: "Dark Gray Intelligence",
    url: "",
    embedUrl: "",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=93%2C-12%2C141%2C8&layer=mapnik",
    filter: "grayscale(100%) brightness(0.12) contrast(2.2) hue-rotate(190deg)",
    description: "Ultra-dark intelligence operations view",
  },
  {
    id: "realtime-data",
    label: "Realtime Data Overlay",
    url: "",
    embedUrl: "",
    iframeSrc: "https://www.openstreetmap.org/export/embed.html?bbox=104%2C-8%2C114%2C-4&layer=mapnik",
    filter: "grayscale(100%) brightness(0.25) contrast(1.6) sepia(0.15) hue-rotate(180deg)",
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
        <div className="flex items-center gap-1.5">
          <a
            href="https://geoservices.big.go.id/portal/apps/webappviewer/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> BIG Geoportal
          </a>
          <a
            href="https://experience.arcgis.com/experience/76ae080f4cfc4c2dba1af0a3fbb804e1"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> ArcGIS
          </a>
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
            src={activeMap.iframeSrc}
            className="w-full h-full border-0"
            style={{ minHeight: "400px", filter: activeMap.filter }}
            title={activeMap.label}
          />

          <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[9px] font-mono text-foreground font-medium">{activeMap.label}</div>
            <div className="text-[8px] font-mono text-muted-foreground">{activeMap.description}</div>
          </div>

          <div className="absolute top-2 right-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[8px] font-mono text-primary">{realtimePoints.length} ACTIVE NODES</div>
            <div className="text-[7px] font-mono text-muted-foreground">REALTIME TRACKING</div>
          </div>

          {/* Coordinate overlay */}
          <div className="absolute bottom-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
            <div className="text-[8px] font-mono text-muted-foreground">CENTER: -2.5°S 118.0°E</div>
            <div className="text-[8px] font-mono text-muted-foreground">ZOOM: REGIONAL</div>
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
              <span className="text-[8px] font-mono text-muted-foreground tracking-wider">EXTERNAL MAPS</span>
            </div>
            <div className="p-2 space-y-1">
              {[
                { label: "Palantir Foundry Map", url: "https://www.palantir.com/docs/foundry/map/overview" },
                { label: "ArcGIS Maritime", url: "https://experience.arcgis.com/experience/76ae080f4cfc4c2dba1af0a3fbb804e1" },
                { label: "BIG Geoportal", url: "https://geoservices.big.go.id/portal/apps/webappviewer/index.html" },
                { label: "MarineTraffic", url: "https://www.marinetraffic.com/en/ais/home/centerx:109.8/centery:-2.9/zoom:7" },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[8px] font-mono text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ExternalLink className="w-2.5 h-2.5" /> {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModesView;
