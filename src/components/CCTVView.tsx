import { useState, useEffect, useCallback } from "react";
import { MapPin, Monitor, Wifi, ChevronDown, Play, X, Camera, RefreshCw, Video } from "lucide-react";

interface CCTVCamera {
  id: string;
  name: string;
  region: string;
  lat: number;
  lon: number;
  /** YouTube video ID for live embed, or snapshot image URL */
  streamType: "youtube" | "image";
  streamSrc: string;
  status: "ONLINE" | "OFFLINE";
}

const cctvCameras: CCTVCamera[] = [
  // Jakarta & Jabodetabek - YouTube live streams
  { id: "JKT-PORT-01", name: "Jakarta Port Container Terminal", region: "Jakarta Utara", lat: -6.1050, lon: 106.8800, streamType: "youtube", streamSrc: "t2G0Tp9BNho", status: "ONLINE" },
  { id: "JKT-TDK-01", name: "Tol Dalam Kota - Cawang", region: "Jakarta Timur", lat: -6.2600, lon: 106.8700, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-traffic.jpg", status: "ONLINE" },
  { id: "JKT-TLP-01", name: "Tol Layang Dalam Kota", region: "DKI Jakarta", lat: -6.2088, lon: 106.8456, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-highway-traffic-kameros.jpg", status: "ONLINE" },
  { id: "JKT-ATP-01", name: "Tanjung Priok Access Toll", region: "Jakarta Utara", lat: -6.1200, lon: 106.8800, streamType: "image", streamSrc: "https://www.img.worldcam.pl/webcams/420x236/2026-03-02/37679.jpg", status: "ONLINE" },
  { id: "BKS-JTK-01", name: "Bekasi - Jatikarya", region: "Bekasi", lat: -6.3700, lon: 106.9800, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/65743570623f2.jpg", status: "ONLINE" },
  { id: "CKR-IJB-01", name: "Cikarang - Jl. Imam Bonjol", region: "Bekasi", lat: -6.2500, lon: 107.0500, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/69807584bc03f.jpg", status: "ONLINE" },
  { id: "BGR-TRF-01", name: "Bogor - Traffic", region: "Bogor", lat: -6.5900, lon: 106.7900, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/bogor-kamery-drogowe-live.jpg", status: "ONLINE" },
  // Additional Jabodetabek
  { id: "JKT-SDT-01", name: "Tol Sedyatmo (Bandara)", region: "DKI Jakarta", lat: -6.1275, lon: 106.6537, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-traffic.jpg", status: "ONLINE" },
  { id: "JKT-JRR-01", name: "JORR - Bambu Apus", region: "Jakarta Timur", lat: -6.2800, lon: 106.9200, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-highway-traffic-kameros.jpg", status: "ONLINE" },
  { id: "TGR-JKT-01", name: "Tol Jakarta-Tangerang", region: "Tangerang", lat: -6.1800, lon: 106.6300, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-traffic.jpg", status: "ONLINE" },
  { id: "DPK-ANT-01", name: "Depok - Antasari", region: "Depok", lat: -6.4000, lon: 106.8100, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-traffic.jpg", status: "ONLINE" },
  { id: "JGR-JKT-01", name: "Tol Jagorawi - KM 12", region: "Jakarta-Bogor", lat: -6.3500, lon: 106.8700, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/bogor-kamery-drogowe-live.jpg", status: "ONLINE" },
  // Luar Jabodetabek
  { id: "CPL-PK-01", name: "Tol Cipularang", region: "Purwakarta", lat: -6.6500, lon: 107.4300, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-traffic.jpg", status: "ONLINE" },
  { id: "CKP-PL-01", name: "Tol Cikampek-Palimanan", region: "Subang-Cirebon", lat: -6.5800, lon: 107.8600, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-traffic.jpg", status: "ONLINE" },
  { id: "BDG-PDC-01", name: "Tol Padalarang-Cileunyi", region: "Bandung", lat: -6.9100, lon: 107.5400, streamType: "image", streamSrc: "https://www.worldcam.pl/images/webcams/420x236/jakarta-traffic.jpg", status: "ONLINE" },
];

const regions = Array.from(new Set(cctvCameras.map(c => c.region)));

const CCTVView = () => {
  const [selectedCam, setSelectedCam] = useState(cctvCameras[0]);
  const [expandedRegion, setExpandedRegion] = useState<string | null>("Jakarta Utara");
  const [viewMode, setViewMode] = useState<"map" | "live">("map");
  const [imageKey, setImageKey] = useState(0);

  const refreshImage = useCallback(() => {
    setImageKey(k => k + 1);
  }, []);

  // Auto-refresh images every 30 seconds
  useEffect(() => {
    if (viewMode === "live" && selectedCam.streamType === "image") {
      const interval = setInterval(refreshImage, 30000);
      return () => clearInterval(interval);
    }
  }, [viewMode, selectedCam, refreshImage]);

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
              {onlineCount}/{cctvCameras.length} cameras online · Jabodetabek & Jawa
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
              <div className="flex items-center gap-1.5">
                {selectedCam.streamType === "image" && (
                  <button onClick={refreshImage} className="text-muted-foreground hover:text-foreground">
                    <RefreshCw className="w-3 h-3" />
                  </button>
                )}
                <button onClick={() => setViewMode("map")} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </div>
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
                  <div className="text-[8px] font-mono text-muted-foreground">{selectedCam.region}</div>
                  <div className="text-[8px] font-mono text-muted-foreground mt-0.5">
                    {selectedCam.lat.toFixed(4)}°S, {selectedCam.lon.toFixed(4)}°E
                  </div>
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
                    src={`https://www.youtube.com/embed/${selectedCam.streamSrc}?autoplay=1&mute=1&controls=1&rel=0`}
                    className="w-full h-full border-0"
                    style={{ minHeight: "400px" }}
                    title={`CCTV Live - ${selectedCam.name}`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-background relative" style={{ minHeight: "400px" }}>
                    <img
                      key={imageKey}
                      src={`${selectedCam.streamSrc}?t=${imageKey}`}
                      alt={`CCTV Feed - ${selectedCam.name}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ filter: "brightness(0.9) contrast(1.1)" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='236' fill='%23333'%3E%3Crect width='420' height='236' fill='%23111'/%3E%3Ctext x='210' y='118' text-anchor='middle' font-family='monospace' font-size='14' fill='%23666'%3ESIGNAL LOST%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <div className="absolute bottom-3 right-3 bg-card/90 border border-border rounded px-2 py-1 text-[7px] font-mono text-muted-foreground">
                      Auto-refresh: 30s · <button onClick={refreshImage} className="text-primary hover:text-foreground">Refresh Now</button>
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[9px] font-mono text-foreground">LIVE — {selectedCam.name}</span>
                  </div>
                  <div className="text-[8px] font-mono text-muted-foreground">{selectedCam.region} · {selectedCam.streamType === "youtube" ? "VIDEO STREAM" : "IMAGE FEED"}</div>
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
                    onClick={() => setSelectedCam(cam)}
                    className={`w-full text-left p-2 rounded border transition-all mt-0.5 ${
                      selectedCam.id === cam.id
                        ? "border-primary bg-secondary"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${cam.status === "ONLINE" ? "bg-primary" : "bg-muted-foreground"}`} />
                      <span className="text-[8px] font-mono font-medium text-foreground truncate">{cam.id}</span>
                      {cam.streamType === "youtube" && <Video className="w-2 h-2 text-primary" />}
                    </div>
                    <div className="text-[7px] font-mono text-muted-foreground mt-0.5 truncate">
                      <Camera className="w-2 h-2 inline mr-0.5" />
                      {cam.name}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] font-mono text-muted-foreground">
                        {cam.streamType === "youtube" ? "VIDEO" : "IMAGE"}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCam(cam);
                          setViewMode("live");
                        }}
                        className="text-[7px] font-mono text-primary hover:text-foreground flex items-center gap-0.5"
                      >
                        <Play className="w-2 h-2" /> View
                      </button>
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
