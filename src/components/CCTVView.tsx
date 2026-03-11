import { useState, useMemo } from "react";
import { Monitor, Wifi, ChevronDown, Camera, Search, MapPin, Grid3X3 } from "lucide-react";
import { cctvCameras, regions, type CCTVCamera } from "@/data/cctvCameras";

const CCTVView = () => {
  const [selectedCam, setSelectedCam] = useState<CCTVCamera>(cctvCameras[0]);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(regions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [gridMode, setGridMode] = useState(false);
  const [gridCams, setGridCams] = useState<CCTVCamera[]>(cctvCameras.slice(0, 4));

  const filteredCameras = useMemo(() => {
    if (!searchQuery) return cctvCameras;
    const q = searchQuery.toLowerCase();
    return cctvCameras.filter(c =>
      c.site_name.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q) ||
      c.kelurahan.toLowerCase().includes(q) ||
      c.kecamatan.toLowerCase().includes(q) ||
      c.walikota.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredRegions = useMemo(() => {
    return regions.filter(r => filteredCameras.some(c => c.walikota === r));
  }, [filteredCameras]);

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-primary" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">CCTV SURVEILLANCE NETWORK</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {cctvCameras.length} kamera · Jakarta Smart City · Balitower
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono">
          <button
            onClick={() => setGridMode(false)}
            className={`px-2 py-0.5 rounded border transition-colors ${!gridMode ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            Single View
          </button>
          <button
            onClick={() => { setGridMode(true); setGridCams(cctvCameras.slice(0, 4)); }}
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${gridMode ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            <Grid3X3 className="w-2.5 h-2.5" /> 2x2 Grid
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
              cctv.balitower.co.id/{selectedCam.site_name} — {selectedCam.kelurahan}, {selectedCam.kecamatan}
            </div>
          </div>

          {/* Live Feed Area */}
          <div className="relative flex-1">
            {gridMode ? (
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                {gridCams.map((cam, i) => (
                  <div key={cam.cctv_id} className="relative border border-border/50">
                    <iframe
                      src={cam.url}
                      className="w-full h-full border-0"
                      title={`CCTV ${cam.site_name}`}
                      allow="autoplay"
                      sandbox="allow-scripts allow-same-origin"
                    />
                    <div className="absolute top-1 left-1 bg-card/90 border border-border rounded px-1.5 py-0.5 backdrop-blur-sm">
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                        <span className="text-[7px] font-mono text-foreground">{cam.site_name}</span>
                      </div>
                      <div className="text-[6px] font-mono text-muted-foreground">{cam.kelurahan}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full relative" style={{ minHeight: "400px" }}>
                <iframe
                  key={`live-${selectedCam.cctv_id}`}
                  src={selectedCam.url}
                  className="w-full h-full border-0"
                  title={`CCTV Live - ${selectedCam.site_name}`}
                  allow="autoplay"
                  sandbox="allow-scripts allow-same-origin"
                />

                {/* Camera info overlay */}
                <div className="absolute top-2 left-2 bg-card/95 border border-border rounded px-3 py-2 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[10px] font-mono text-foreground font-medium">LIVE SURVEILLANCE</span>
                  </div>
                  <div className="text-[9px] font-mono text-foreground">{selectedCam.location || selectedCam.site_name}</div>
                  <div className="text-[8px] font-mono text-muted-foreground">
                    {selectedCam.kelurahan}, {selectedCam.kecamatan} · {selectedCam.walikota}
                  </div>
                  <div className="text-[8px] font-mono text-primary mt-1">
                    <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                    {selectedCam.lat.toFixed(4)}°, {selectedCam.lng.toFixed(4)}°
                  </div>
                </div>

                {/* Status bar */}
                <div className="absolute bottom-0 left-0 right-0 bg-card/90 border-t border-border px-3 py-1.5 backdrop-blur-sm">
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
                        CAM-{selectedCam.cctv_id} · HLS STREAM
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-muted-foreground">
                      BALITOWER CCTV NETWORK
                    </span>
                  </div>
                </div>

                {/* Grid overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
                  backgroundSize: "20px 20px"
                }} />

                {/* Corner markers */}
                <div className="absolute top-1 left-1 w-4 h-4 border-l border-t border-primary/40 pointer-events-none" />
                <div className="absolute top-1 right-1 w-4 h-4 border-r border-t border-primary/40 pointer-events-none" />
                <div className="absolute bottom-7 left-1 w-4 h-4 border-l border-b border-primary/40 pointer-events-none" />
                <div className="absolute bottom-7 right-1 w-4 h-4 border-r border-b border-primary/40 pointer-events-none" />
              </div>
            )}
          </div>
        </div>

        {/* Camera List Sidebar */}
        <div className="flex flex-col gap-1 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kamera..."
              className="w-full pl-6 pr-2 py-1.5 bg-card border border-border rounded text-[8px] font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary"
            />
          </div>

          <div className="text-[8px] font-mono text-muted-foreground px-1">
            {filteredCameras.length} KAMERA DITEMUKAN
          </div>

          {/* Camera list */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
            {filteredRegions.map((region) => {
              const camsInRegion = filteredCameras.filter(c => c.walikota === region);
              const isExpanded = expandedRegion === region;
              return (
                <div key={region}>
                  <button
                    onClick={() => setExpandedRegion(isExpanded ? null : region)}
                    className="w-full text-left px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground flex items-center justify-between bg-secondary/50 rounded"
                  >
                    <span>{region} ({camsInRegion.length})</span>
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                  </button>
                  {isExpanded && camsInRegion.map((cam) => (
                    <button
                      key={cam.cctv_id}
                      onClick={() => {
                        setSelectedCam(cam);
                        if (gridMode) {
                          const idx = gridCams.findIndex(g => g.cctv_id === cam.cctv_id);
                          if (idx === -1) {
                            setGridCams(prev => [cam, ...prev.slice(0, 3)]);
                          }
                        }
                      }}
                      className={`w-full text-left p-1.5 rounded border transition-all mt-0.5 ${
                        selectedCam.cctv_id === cam.cctv_id
                          ? "border-primary bg-secondary"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <Camera className="w-2 h-2 text-primary" />
                        <span className="text-[7px] font-mono font-medium text-foreground truncate">{cam.site_name}</span>
                      </div>
                      <div className="text-[6px] font-mono text-muted-foreground mt-0.5 truncate">
                        {cam.location || cam.kelurahan} · {cam.kecamatan}
                      </div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CCTVView;
