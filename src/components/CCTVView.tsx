import { useState, useEffect, useCallback } from "react";
import { MapPin, Monitor, Wifi, ChevronDown, Play, X, Camera, RefreshCw, Video } from "lucide-react";

interface CCTVCamera {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  streamType: "youtube" | "image" | "skyline";
  streamSrc: string;
  status: "ONLINE" | "OFFLINE";
}

const cctvCameras: CCTVCamera[] = [
  // Jakarta - SkylineWebcams embed (verified working)
  { id: "JKT-SKY-01", name: "Jakarta City Streets Live", region: "DKI Jakarta", lat: -6.1751, lon: 106.8130, streamType: "skyline", streamSrc: "https://www.skylinewebcams.com/en/webcam/indonesia/jakarta/jakarta/streets.html", status: "ONLINE" },
  // Bromo / Semeru volcano cams (verified 24/7 working)
  { id: "BROMO-01", name: "Bromo Tengger Semeru 4K Live", region: "Jawa Timur", lat: -7.9425, lon: 112.9530, streamType: "youtube", streamSrc: "-ioZYIHMB5w", status: "ONLINE" },
  { id: "SEMERU-A", name: "Semeru Volcano Eruption 4K (CAM A)", region: "Jawa Timur", lat: -8.1077, lon: 112.9224, streamType: "youtube", streamSrc: "Zg6Zc-oWDD0", status: "ONLINE" },
  { id: "SEMERU-B", name: "Semeru Volcano (CAM B)", region: "Jawa Timur", lat: -8.1100, lon: 112.9200, streamType: "youtube", streamSrc: "xPBtcSCu5No", status: "ONLINE" },
  { id: "BROMO-02", name: "Bromo Penanjakan South View 4K", region: "Jawa Timur", lat: -7.9200, lon: 112.9400, streamType: "youtube", streamSrc: "4vmPmQYKzcQ", status: "ONLINE" },
  // Bali
  { id: "BALI-01", name: "Bali Denpasar Live Camera", region: "Bali", lat: -8.6500, lon: 115.2167, streamType: "youtube", streamSrc: "hHzx2nL_9uY", status: "ONLINE" },
  // Demak Smart City
  { id: "DMK-SMART", name: "CCTV Demak Smart City Live", region: "Jawa Tengah", lat: -6.8935, lon: 110.6381, streamType: "youtube", streamSrc: "0OV-Ji-buHY", status: "ONLINE" },
  // Toll roads
  { id: "TOL-ARUS", name: "Pantauan CCTV Tol Indonesia", region: "Nasional", lat: -6.6000, lon: 107.0000, streamType: "youtube", streamSrc: "G6Bb2GR7l0o", status: "ONLINE" },
];

const regions = Array.from(new Set(cctvCameras.map(c => c.region)));

const CCTVView = () => {
  const [selectedCam, setSelectedCam] = useState(cctvCameras[0]);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(regions[0]);
  const [viewMode, setViewMode] = useState<"map" | "live">("live");

  const onlineCount = cctvCameras.filter(c => c.status === "ONLINE").length;

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">CCTV SURVEILLANCE NETWORK</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {onlineCount}/{cctvCameras.length} cameras online · Indonesia Live
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
          {/* Browser bar */}
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary border-b border-border shrink-0">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(35, 80%, 50%)" }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(120, 30%, 35%)" }} />
            </div>
            <div className="flex-1 bg-muted rounded px-3 py-0.5 text-[9px] font-mono text-muted-foreground text-center truncate">
              {viewMode === "map"
                ? `intl-srvid.mil.id/cctv/${selectedCam.id} — ${selectedCam.name}`
                : `LIVE FEED — ${selectedCam.name} — ${selectedCam.region}`}
            </div>
            {viewMode === "live" && (
              <button onClick={() => setViewMode("map")} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
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
                    <Play className="w-2.5 h-2.5" /> Play Live Feed
                  </button>
                </div>
              </>
            ) : (
              <>
                {selectedCam.streamType === "youtube" ? (
                  <iframe
                    key={selectedCam.id}
                    src={`https://www.youtube.com/embed/${selectedCam.streamSrc}?autoplay=1&mute=1&controls=1&rel=0`}
                    className="w-full h-full border-0"
                    style={{ minHeight: "400px" }}
                    title={`CCTV Live - ${selectedCam.name}`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : selectedCam.streamType === "skyline" ? (
                  <iframe
                    key={selectedCam.id}
                    src={selectedCam.streamSrc}
                    className="w-full h-full border-0"
                    style={{ minHeight: "400px" }}
                    title={`CCTV Live - ${selectedCam.name}`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-background" style={{ minHeight: "400px" }}>
                    <span className="text-muted-foreground font-mono text-xs">No feed available</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[9px] font-mono text-foreground">LIVE — {selectedCam.name}</span>
                  </div>
                  <div className="text-[8px] font-mono text-muted-foreground">{selectedCam.region} · YOUTUBE LIVE STREAM</div>
                </div>
              </>
            )}
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
                    onClick={() => { setSelectedCam(cam); setViewMode("live"); }}
                    className={`w-full text-left p-2 rounded border transition-all mt-0.5 ${
                      selectedCam.id === cam.id
                        ? "border-primary bg-secondary"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${cam.status === "ONLINE" ? "bg-primary" : "bg-muted-foreground"}`} />
                      <Video className="w-2 h-2 text-primary" />
                      <span className="text-[8px] font-mono font-medium text-foreground truncate">{cam.id}</span>
                    </div>
                    <div className="text-[7px] font-mono text-muted-foreground mt-0.5 truncate">
                      {cam.name}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] font-mono text-primary">LIVE VIDEO</span>
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
