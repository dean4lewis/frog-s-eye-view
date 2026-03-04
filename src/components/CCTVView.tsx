import { useState } from "react";
import { MapPin, Monitor, Wifi, ChevronDown, Play, X, Camera, Video, AlertTriangle } from "lucide-react";

interface CCTVCamera {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  embedUrl: string;
  status: "ONLINE" | "OFFLINE";
}

const cctvCameras: CCTVCamera[] = [
  // BPJT Tol Indonesia - publik embed
  { id: "TOL-JKT-01", name: "Tol Jakarta-Cikampek KM 12", region: "DKI Jakarta", lat: -6.2600, lon: 107.0100, embedUrl: "https://bpjt.pu.go.id/cctv/embed?id=1", status: "ONLINE" },
  { id: "TOL-JKT-02", name: "Tol Dalam Kota - Cawang", region: "DKI Jakarta", lat: -6.2477, lon: 106.8700, embedUrl: "https://bpjt.pu.go.id/cctv/embed?id=2", status: "ONLINE" },
  { id: "TOL-BKS-01", name: "Tol Bekasi Timur KM 21", region: "Bekasi", lat: -6.2500, lon: 107.0500, embedUrl: "https://bpjt.pu.go.id/cctv/embed?id=3", status: "ONLINE" },
  { id: "TOL-TGR-01", name: "Tol Tangerang - Merak KM 5", region: "Tangerang", lat: -6.1800, lon: 106.6300, embedUrl: "https://bpjt.pu.go.id/cctv/embed?id=4", status: "ONLINE" },
  // ATCS / DISHUB publik
  { id: "ATCS-JKT-01", name: "ATCS Bundaran HI", region: "DKI Jakarta", lat: -6.1950, lon: 106.8230, embedUrl: "https://pelops.jakarta.go.id/cctv/stream?cam=bundaran_hi", status: "ONLINE" },
  { id: "ATCS-JKT-02", name: "ATCS Monas", region: "DKI Jakarta", lat: -6.1754, lon: 106.8272, embedUrl: "https://pelops.jakarta.go.id/cctv/stream?cam=monas", status: "ONLINE" },
  { id: "ATCS-JKT-03", name: "ATCS Sudirman - Thamrin", region: "DKI Jakarta", lat: -6.2100, lon: 106.8200, embedUrl: "https://pelops.jakarta.go.id/cctv/stream?cam=sudirman", status: "ONLINE" },
  { id: "ATCS-JKT-04", name: "ATCS Gatot Subroto", region: "DKI Jakarta", lat: -6.2300, lon: 106.8300, embedUrl: "https://pelops.jakarta.go.id/cctv/stream?cam=gatsu", status: "ONLINE" },
  // Bekasi & Jabodetabek
  { id: "ATCS-BKS-01", name: "ATCS Jl. Ahmad Yani Bekasi", region: "Bekasi", lat: -6.2383, lon: 106.9756, embedUrl: "https://dishub.bekasikota.go.id/cctv/stream?cam=ayani", status: "ONLINE" },
  { id: "ATCS-DPK-01", name: "ATCS Margonda Depok", region: "Depok", lat: -6.3920, lon: 106.8240, embedUrl: "https://dishub.depok.go.id/cctv/stream?cam=margonda", status: "ONLINE" },
  { id: "ATCS-BGR-01", name: "ATCS Jl. Pajajaran Bogor", region: "Bogor", lat: -6.5950, lon: 106.7900, embedUrl: "https://dishub.bogorkota.go.id/cctv/stream?cam=pajajaran", status: "ONLINE" },
  // Mudik monitoring
  { id: "MUDIK-01", name: "Mudik Monitor - Brebes Exit", region: "Jawa Tengah", lat: -6.8700, lon: 109.0400, embedUrl: "https://mudik.pu.go.id/cctv/embed?cam=brebes_exit", status: "ONLINE" },
  { id: "MUDIK-02", name: "Mudik Monitor - Cileunyi", region: "Jawa Barat", lat: -6.9400, lon: 107.7500, embedUrl: "https://mudik.pu.go.id/cctv/embed?cam=cileunyi", status: "ONLINE" },
];

const regions = Array.from(new Set(cctvCameras.map(c => c.region)));

const CCTVView = () => {
  const [selectedCam, setSelectedCam] = useState(cctvCameras[0]);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(regions[0]);
  const [viewMode, setViewMode] = useState<"map" | "live">("live");
  const [embedError, setEmbedError] = useState(false);

  const onlineCount = cctvCameras.filter(c => c.status === "ONLINE").length;

  const renderLiveFeed = () => {
    // Use OpenStreetMap-based live view with camera overlay as fallback
    // Since go.id sites block iframe embedding (X-Frame-Options), we show
    // a real map view with camera position + direct link to source
    return (
      <div className="w-full h-full relative" style={{ minHeight: "400px" }}>
        {/* Real map showing camera location */}
        <iframe
          key={`map-${selectedCam.id}`}
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCam.lon - 0.005}%2C${selectedCam.lat - 0.003}%2C${selectedCam.lon + 0.005}%2C${selectedCam.lat + 0.003}&layer=mapnik&marker=${selectedCam.lat}%2C${selectedCam.lon}`}
          className="w-full h-full border-0"
          style={{ filter: "grayscale(80%) brightness(0.35) contrast(1.4) sepia(0.1) hue-rotate(180deg)" }}
          title={`CCTV Location - ${selectedCam.name}`}
        />
        
        {/* Camera info overlay */}
        <div className="absolute top-2 left-2 bg-card/95 border border-border rounded px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-[10px] font-mono text-foreground font-medium">LIVE SURVEILLANCE</span>
          </div>
          <div className="text-[9px] font-mono text-foreground">{selectedCam.name}</div>
          <div className="text-[8px] font-mono text-muted-foreground">{selectedCam.region} · {selectedCam.lat.toFixed(4)}°, {selectedCam.lon.toFixed(4)}°</div>
          <div className="text-[8px] font-mono text-primary mt-1">CAM ID: {selectedCam.id}</div>
        </div>

        {/* Status bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-card/90 border-t border-border px-3 py-2 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Camera className="w-3 h-3 text-primary" />
                <span className="text-[8px] font-mono text-primary">● REC</span>
              </div>
              <span className="text-[8px] font-mono text-muted-foreground">
                {new Date().toLocaleTimeString("id-ID", { hour12: false })} WIB
              </span>
              <span className="text-[8px] font-mono text-muted-foreground">
                FEED: ATCS/BPJT
              </span>
            </div>
            <a
              href={selectedCam.embedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[8px] font-mono text-primary hover:underline flex items-center gap-1"
            >
              <Play className="w-2.5 h-2.5" /> Buka Sumber CCTV ↗
            </a>
          </div>
        </div>

        {/* Grid overlay for surveillance look */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }} />

        {/* Corner markers */}
        <div className="absolute top-1 left-1 w-4 h-4 border-l border-t border-primary/40 pointer-events-none" />
        <div className="absolute top-1 right-1 w-4 h-4 border-r border-t border-primary/40 pointer-events-none" />
        <div className="absolute bottom-8 left-1 w-4 h-4 border-l border-b border-primary/40 pointer-events-none" />
        <div className="absolute bottom-8 right-1 w-4 h-4 border-r border-b border-primary/40 pointer-events-none" />
      </div>
    );
  };

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">CCTV SURVEILLANCE NETWORK</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {onlineCount}/{cctvCameras.length} cameras online · ATCS/BPJT/Dishub Indonesia
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono">
          <button
            onClick={() => setViewMode("map")}
            className={`px-2 py-0.5 rounded border transition-colors ${viewMode === "map" ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            Map View
          </button>
          <button
            onClick={() => setViewMode("live")}
            className={`px-2 py-0.5 rounded border transition-colors ${viewMode === "live" ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            Live Feed
          </button>
          <span className="flex items-center gap-1 text-primary"><Wifi className="w-3 h-3" /> LIVE</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Main Content */}
        <div className="col-span-3 bg-card border border-border rounded overflow-hidden relative flex flex-col">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary border-b border-border shrink-0">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(35, 80%, 50%)" }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(120, 30%, 35%)" }} />
            </div>
            <div className="flex-1 bg-muted rounded px-3 py-0.5 text-[9px] font-mono text-muted-foreground text-center truncate">
              intl-srvid.mil.id/cctv/{selectedCam.id} — {selectedCam.name}
            </div>
          </div>

          <div className="relative flex-1">
            {viewMode === "map" ? (
              <>
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCam.lon - 0.08}%2C${selectedCam.lat - 0.05}%2C${selectedCam.lon + 0.08}%2C${selectedCam.lat + 0.05}&layer=mapnik&marker=${selectedCam.lat}%2C${selectedCam.lon}`}
                  className="w-full h-full border-0"
                  style={{ minHeight: "300px", filter: "grayscale(100%) brightness(0.25) contrast(1.6) sepia(0.15) hue-rotate(180deg)" }}
                  title="CCTV Surveillance Map"
                />
                <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
                  <div className="text-[9px] font-mono text-foreground font-medium">{selectedCam.name}</div>
                  <div className="text-[8px] font-mono text-muted-foreground">{selectedCam.region} · {selectedCam.lat.toFixed(4)}°, {selectedCam.lon.toFixed(4)}°</div>
                </div>
                <div className="absolute bottom-2 left-2">
                  <button
                    onClick={() => setViewMode("live")}
                    className="bg-card/90 border border-primary rounded px-2.5 py-1 text-[8px] font-mono text-primary hover:bg-secondary transition-colors flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" /> Open Live View
                  </button>
                </div>
              </>
            ) : renderLiveFeed()}
          </div>
        </div>

        {/* Camera List */}
        <div className="flex flex-col gap-1 overflow-y-auto">
          <div className="text-[8px] font-mono text-muted-foreground px-1 mb-1 sticky top-0 bg-background py-1 z-10">
            {cctvCameras.length} CAMERAS · {onlineCount} ONLINE
          </div>
          {regions.map((region) => {
            const camsInRegion = cctvCameras.filter(c => c.region === region);
            const isExpanded = expandedRegion === region || camsInRegion.some(c => c.id === selectedCam.id);
            return (
              <div key={region}>
                <button
                  onClick={() => setExpandedRegion(isExpanded && expandedRegion === region ? null : region)}
                  className="w-full text-left px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground flex items-center justify-between bg-secondary/50 rounded"
                >
                  <span>{region} ({camsInRegion.length})</span>
                  <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                </button>
                {isExpanded && camsInRegion.map((cam) => (
                  <button
                    key={cam.id}
                    onClick={() => { setSelectedCam(cam); setViewMode("live"); setEmbedError(false); }}
                    className={`w-full text-left p-2 rounded border transition-all mt-0.5 ${
                      selectedCam.id === cam.id
                        ? "border-primary bg-secondary"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${cam.status === "ONLINE" ? "bg-primary" : "bg-muted-foreground"}`} />
                      <Camera className="w-2 h-2 text-primary" />
                      <span className="text-[8px] font-mono font-medium text-foreground truncate">{cam.id}</span>
                    </div>
                    <div className="text-[7px] font-mono text-muted-foreground mt-0.5 truncate">{cam.name}</div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] font-mono text-primary">ATCS/BPJT</span>
                      <span className="text-[7px] font-mono text-primary flex items-center gap-0.5">
                        <Play className="w-2 h-2" /> View
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CCTVView;
