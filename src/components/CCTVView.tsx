import { useState, useMemo, useCallback } from "react";
import { Monitor, Wifi, ChevronDown, Camera, Search, MapPin, Grid3X3, ExternalLink, Maximize2, X, Radio } from "lucide-react";
import { cctvCameras, regions, type CCTVCamera } from "@/data/cctvCameras";

const CCTVView = () => {
  const [selectedCam, setSelectedCam] = useState<CCTVCamera>(cctvCameras[0]);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(regions[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");
  const [gridCams] = useState<CCTVCamera[]>(cctvCameras.slice(0, 4));

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

  const openStream = useCallback((cam: CCTVCamera) => {
    window.open(cam.url, "_blank", "noopener,noreferrer");
  }, []);

  const renderMacOSWindow = (cam: CCTVCamera, isGrid = false) => {
    const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${cam.lng - 0.003}%2C${cam.lat - 0.002}%2C${cam.lng + 0.003}%2C${cam.lat + 0.002}&layer=mapnik&marker=${cam.lat}%2C${cam.lng}`;

    return (
      <div className={`flex flex-col bg-card border border-border rounded-lg overflow-hidden shadow-lg ${isGrid ? "h-full" : "h-full"}`}>
        {/* macOS Title Bar */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/80 border-b border-border shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-destructive cursor-pointer hover:brightness-110" />
            <div className="w-2.5 h-2.5 rounded-full cursor-pointer hover:brightness-110" style={{ backgroundColor: "hsl(45, 90%, 50%)" }} />
            <div className="w-2.5 h-2.5 rounded-full cursor-pointer hover:brightness-110" style={{ backgroundColor: "hsl(140, 60%, 40%)" }} />
          </div>
          <div className="flex-1 text-center">
            <span className="text-[9px] font-mono text-muted-foreground truncate block">
              {isGrid ? cam.site_name : `🔴 LIVE — ${cam.site_name} — ${cam.kelurahan}, ${cam.kecamatan}`}
            </span>
          </div>
          {!isGrid && (
            <button
              onClick={() => openStream(cam)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Maximize2 className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-black">
          {/* Map showing exact camera location */}
          <iframe
            key={`map-${cam.cctv_id}`}
            src={mapUrl}
            className="w-full h-full border-0"
            style={{
              filter: "brightness(0.3) contrast(1.5) saturate(0.3) hue-rotate(180deg)",
              minHeight: isGrid ? "150px" : "350px",
            }}
            title={`Camera Location - ${cam.site_name}`}
          />

          {/* Live indicator + camera overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Scan lines effect */}
            <div className="absolute inset-0" style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.015) 2px, rgba(0,255,0,0.015) 4px)",
            }} />

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-primary/60" />
            <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-primary/60" />
            <div className="absolute bottom-12 left-2 w-6 h-6 border-l-2 border-b-2 border-primary/60" />
            <div className="absolute bottom-12 right-2 w-6 h-6 border-r-2 border-b-2 border-primary/60" />

            {/* Crosshair center */}
            {!isGrid && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-[1px] bg-primary/30" />
                <div className="w-[1px] h-8 bg-primary/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            )}
          </div>

          {/* Camera info panel - top left */}
          <div className={`absolute top-2 left-2 bg-black/80 border border-primary/30 rounded px-2.5 py-1.5 backdrop-blur-md pointer-events-auto ${isGrid ? "max-w-[60%]" : ""}`}>
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className={`${isGrid ? "text-[7px]" : "text-[9px]"} font-mono text-primary font-bold`}>● LIVE</span>
              <Radio className={`${isGrid ? "w-2 h-2" : "w-3 h-3"} text-primary animate-pulse`} />
            </div>
            {!isGrid && (
              <>
                <div className="text-[9px] font-mono text-foreground">{cam.location || cam.site_name}</div>
                <div className="text-[8px] font-mono text-muted-foreground">
                  {cam.kelurahan}, {cam.kecamatan} — {cam.walikota}
                </div>
                <div className="text-[7px] font-mono text-primary/70 mt-0.5">
                  <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                  {cam.lat.toFixed(5)}°S, {cam.lng.toFixed(5)}°E
                </div>
              </>
            )}
          </div>

          {/* Open stream button - center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-auto">
            <button
              onClick={() => openStream(cam)}
              className="bg-primary/20 hover:bg-primary/40 border border-primary/50 hover:border-primary rounded-lg px-4 py-2.5 transition-all group backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Camera className={`${isGrid ? "w-4 h-4" : "w-5 h-5"} text-primary group-hover:scale-110 transition-transform`} />
                <div className="text-left">
                  <div className={`${isGrid ? "text-[8px]" : "text-[10px]"} font-mono text-primary font-bold`}>BUKA LIVE STREAM</div>
                  {!isGrid && <div className="text-[8px] font-mono text-muted-foreground">HLS Stream · Balitower</div>}
                </div>
                <ExternalLink className={`${isGrid ? "w-3 h-3" : "w-4 h-4"} text-primary/60`} />
              </div>
            </button>
          </div>

          {/* Status bar - bottom */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/85 border-t border-primary/20 px-3 py-1.5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[7px] font-mono text-primary flex items-center gap-1">
                  <Camera className="w-2.5 h-2.5" /> CAM-{cam.cctv_id}
                </span>
                <span className="text-[7px] font-mono text-muted-foreground">
                  {new Date().toLocaleTimeString("id-ID", { hour12: false })} WIB
                </span>
              </div>
              <span className="text-[7px] font-mono text-muted-foreground">
                {isGrid ? cam.kelurahan : "JAKARTA SMART CITY · BALITOWER NETWORK"}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-primary" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">CCTV SURVEILLANCE NETWORK</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {cctvCameras.length} kamera · Jakarta Smart City · Balitower HLS
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[8px] font-mono">
          <button
            onClick={() => setViewMode("single")}
            className={`px-2 py-0.5 rounded border transition-colors ${viewMode === "single" ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            Single
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${viewMode === "grid" ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            <Grid3X3 className="w-2.5 h-2.5" /> 2×2
          </button>
          <div className="flex items-center gap-1 text-primary">
            <Wifi className="w-3 h-3" />
            <span>LIVE</span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Main Content */}
        <div className="col-span-3">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
              {gridCams.map(cam => (
                <div key={cam.cctv_id}>
                  {renderMacOSWindow(cam, true)}
                </div>
              ))}
            </div>
          ) : (
            renderMacOSWindow(selectedCam)
          )}
        </div>

        {/* Camera List Sidebar */}
        <div className="flex flex-col gap-1 overflow-hidden">
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

          <div className="text-[7px] font-mono text-muted-foreground px-1">
            {filteredCameras.length} KAMERA · KLIK UNTUK PREVIEW
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-0.5 pr-0.5">
            {filteredRegions.map((region) => {
              const camsInRegion = filteredCameras.filter(c => c.walikota === region);
              const isExpanded = expandedRegion === region;
              return (
                <div key={region}>
                  <button
                    onClick={() => setExpandedRegion(isExpanded ? null : region)}
                    className="w-full text-left px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground flex items-center justify-between bg-secondary/50 rounded"
                  >
                    <span className="font-medium">{region} ({camsInRegion.length})</span>
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                  </button>
                  {isExpanded && camsInRegion.map((cam) => (
                    <button
                      key={cam.cctv_id}
                      onClick={() => { setSelectedCam(cam); setViewMode("single"); }}
                      className={`w-full text-left p-1.5 rounded border transition-all mt-0.5 group ${
                        selectedCam.cctv_id === cam.cctv_id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card hover:bg-muted hover:border-primary/30"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0" />
                        <Camera className="w-2.5 h-2.5 text-primary shrink-0" />
                        <span className="text-[7px] font-mono font-medium text-foreground truncate">{cam.site_name}</span>
                      </div>
                      <div className="text-[6px] font-mono text-muted-foreground mt-0.5 truncate pl-5">
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
