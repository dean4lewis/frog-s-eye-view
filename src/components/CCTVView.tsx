import { useState } from "react";
import { MapPin, Monitor, ExternalLink, Wifi, ChevronDown, Play, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CCTVRuas {
  id: string;
  name: string;
  region: string;
  operator: string;
  online: number;
  lat: number;
  lon: number;
  embedUrl: string;
}

const cctvTollRoads: CCTVRuas[] = [
  { id: "TDK-001", name: "Tol Dalam Kota", region: "DKI Jakarta", operator: "JM", online: 26, lat: -6.2088, lon: 106.8456, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=dalam-kota#cctv" },
  { id: "JBC-001", name: "Jakarta-Bogor-Ciawi (Jagorawi)", region: "Jakarta-Bogor", operator: "JM", online: 18, lat: -6.3500, lon: 106.8700, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=jakarta-bogor-ciawi#cctv" },
  { id: "JTG-001", name: "Jakarta-Tangerang", region: "Jakarta-Tangerang", operator: "JM", online: 15, lat: -6.1800, lon: 106.6300, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=jakarta-tangerang#cctv" },
  { id: "JCK-001", name: "Jakarta-Cikampek", region: "Jakarta-Karawang", operator: "JM", online: 22, lat: -6.3200, lon: 107.1500, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=jakarta-cikampek#cctv" },
  { id: "SDT-001", name: "Sedyatmo (Bandara)", region: "DKI Jakarta", operator: "JM", online: 12, lat: -6.1275, lon: 106.6537, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=sedyatmo#cctv" },
  { id: "ATP-001", name: "Akses Tanjung Priok", region: "DKI Jakarta", operator: "HK", online: 14, lat: -6.1200, lon: 106.8800, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=akses-tanjung-priok#cctv" },
  { id: "CPL-001", name: "Cipularang", region: "Purwakarta", operator: "JM", online: 23, lat: -6.6500, lon: 107.4300, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=cipularang#cctv" },
  { id: "PDC-001", name: "Padalarang-Cileunyi", region: "Bandung", operator: "JM", online: 16, lat: -6.9100, lon: 107.5400, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=padalarang-cileunyi#cctv" },
  { id: "CKP-001", name: "Cikampek-Palimanan", region: "Subang-Cirebon", operator: "LMS", online: 38, lat: -6.5800, lon: 107.8600, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=cikampek-palimanan#cctv" },
  { id: "JRE-001", name: "JORR E (Bambu Apus-Rorotan)", region: "DKI Jakarta", operator: "JLJ", online: 20, lat: -6.2800, lon: 106.9200, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=jorr-e-bambu-apus-rorotan#cctv" },
  { id: "CMC-001", name: "Cimanggis-Cibitung", region: "Depok-Bekasi", operator: "CCT", online: 25, lat: -6.3700, lon: 106.9800, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=cimanggis-cibitung#cctv" },
  { id: "CBC-001", name: "Cibitung-Cilincing", region: "Bekasi", operator: "CTP", online: 32, lat: -6.2500, lon: 107.0500, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=cibitung-cilincing#cctv" },
  { id: "CTP-001", name: "Cawang-Tj Priok-Pluit", region: "DKI Jakarta", operator: "CMNP", online: 3, lat: -6.2400, lon: 106.8700, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=cawang-tj-priok-ancol-timur-jembatan-tigapluit#cctv" },
  { id: "DPA-001", name: "Depok-Antasari", region: "Depok", operator: "CW", online: 3, lat: -6.4000, lon: 106.8100, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=depok-antasari#cctv" },
  { id: "BKC-001", name: "Bekasi-Cawang-Kp Melayu", region: "Jakarta-Bekasi", operator: "KKDM", online: 10, lat: -6.2600, lon: 106.9400, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=bekasi-cawang-kampung-melayu#cctv" },
  { id: "KGP-001", name: "Kelapa Gading-Pulo Gebang", region: "DKI Jakarta", operator: "JTD", online: 9, lat: -6.1700, lon: 106.9100, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=6-tol-dalam-kota-kelapa-gading-pulo-gebang#cctv" },
  { id: "BTB-001", name: "Bakaheuni-Terbanggi Besar", region: "Lampung", operator: "BTB", online: 9, lat: -5.2000, lon: 105.2500, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=bakaheuni-terbanggi-besar#cctv" },
  { id: "BPS-001", name: "Balikpapan-Samarinda", region: "Kalimantan Timur", operator: "JM", online: 13, lat: -1.1500, lon: 116.8500, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=balikpapan-samarinda#cctv" },
  { id: "BMT-001", name: "Belawan-Medan-Tanjung Morawa", region: "Sumatera Utara", operator: "JM", online: 6, lat: 3.5900, lon: 98.6800, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=belawan-medan-tanjung-morawa#cctv" },
  { id: "CSK-001", name: "Ciawi-Sukabumi", region: "Jawa Barat", operator: "TJT", online: 12, lat: -6.7200, lon: 106.8300, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=ciawi-sukabumi-ciawi-cibadak#cctv" },
  { id: "BRR-001", name: "Bogor Ring Road", region: "Bogor", operator: "MSJ", online: 6, lat: -6.5900, lon: 106.7900, embedUrl: "https://mudik.pu.go.id/cctv-tol/?id_ruas=bogor-ring-road-seksi-i-iiia-sentul-selatan-simpang-semplak#cctv" },
];

const totalOnline = cctvTollRoads.reduce((sum, r) => sum + r.online, 0);

const CCTVView = () => {
  const [selectedRuas, setSelectedRuas] = useState(cctvTollRoads[0]);
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [showLiveEmbed, setShowLiveEmbed] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "live">("map");

  const regions = Array.from(new Set(cctvTollRoads.map(r => r.region)));

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">CCTV JALAN TOL INDONESIA</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {totalOnline} cameras online · {cctvTollRoads.length} ruas · Source: BPJT / mudik.pu.go.id
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
            Live CCTV
          </button>
          <span className="flex items-center gap-1 text-primary"><Wifi className="w-3 h-3" /> LIVE</span>
          <a href="https://bpjt.pu.go.id/cctv/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <ExternalLink className="w-3 h-3" /> BPJT
          </a>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        {/* Main Content */}
        <div className="col-span-3 bg-card border border-border rounded overflow-hidden relative flex flex-col">
          {viewMode === "map" ? (
            <>
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary border-b border-border shrink-0">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(35, 80%, 50%)" }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(120, 30%, 35%)" }} />
                </div>
                <div className="flex-1 bg-muted rounded px-3 py-0.5 text-[9px] font-mono text-muted-foreground text-center truncate">
                  intl-srvid.mil.id/cctv/{selectedRuas.id} — {selectedRuas.name}
                </div>
              </div>

              <div className="relative flex-1">
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedRuas.lon - 0.08}%2C${selectedRuas.lat - 0.05}%2C${selectedRuas.lon + 0.08}%2C${selectedRuas.lat + 0.05}&layer=mapnik&marker=${selectedRuas.lat}%2C${selectedRuas.lon}`}
                  className="w-full h-full border-0"
                  style={{ minHeight: "300px", filter: "grayscale(100%) brightness(0.25) contrast(1.6) sepia(0.15) hue-rotate(180deg)" }}
                  title="CCTV Surveillance Map"
                />

                <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
                  <div className="text-[9px] font-mono text-foreground font-medium">{selectedRuas.name}</div>
                  <div className="text-[8px] font-mono text-muted-foreground">{selectedRuas.region} · BUJT ({selectedRuas.operator})</div>
                  <div className="text-[8px] font-mono text-muted-foreground mt-0.5">
                    {selectedRuas.lat.toFixed(4)}°S, {selectedRuas.lon.toFixed(4)}°E
                  </div>
                </div>

                <div className="absolute top-2 right-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
                  <div className="text-[8px] font-mono text-primary">{selectedRuas.online} CAM ONLINE</div>
                </div>

                <div className="absolute bottom-2 left-2 right-2 flex gap-1.5">
                  <button
                    onClick={() => setViewMode("live")}
                    className="bg-card/90 border border-primary rounded px-2.5 py-1 text-[8px] font-mono text-primary hover:bg-secondary transition-colors flex items-center gap-1"
                  >
                    <Play className="w-2.5 h-2.5" /> Play Live CCTV
                  </button>
                  <a
                    href={selectedRuas.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-card/90 border border-border rounded px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-2.5 h-2.5" /> Buka di Tab Baru
                  </a>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Live CCTV Embed */}
              <div className="flex items-center gap-2 px-3 py-1 bg-secondary border-b border-border shrink-0">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-destructive" />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(35, 80%, 50%)" }} />
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(120, 30%, 35%)" }} />
                </div>
                <div className="flex-1 bg-muted rounded px-3 py-0.5 text-[9px] font-mono text-muted-foreground text-center truncate">
                  mudik.pu.go.id/cctv-tol — {selectedRuas.name} — LIVE FEED
                </div>
                <button onClick={() => setViewMode("map")} className="text-muted-foreground hover:text-foreground">
                  <X className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 relative">
                <iframe
                  src={selectedRuas.embedUrl}
                  className="w-full h-full border-0"
                  style={{ minHeight: "400px" }}
                  title={`CCTV Live - ${selectedRuas.name}`}
                  allow="fullscreen"
                  sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                />
                <div className="absolute top-2 left-2 bg-card/90 border border-border rounded px-2.5 py-1.5 backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                    <span className="text-[9px] font-mono text-foreground">LIVE — {selectedRuas.name}</span>
                  </div>
                  <div className="text-[8px] font-mono text-muted-foreground">{selectedRuas.online} cameras · {selectedRuas.region}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* CCTV List */}
        <div className="flex flex-col gap-1 overflow-y-auto">
          <div className="text-[8px] font-mono text-muted-foreground px-1 mb-1 sticky top-0 bg-background py-1 z-10">
            {cctvTollRoads.length} RUAS TOL · {totalOnline} CAMERAS
          </div>
          {regions.map((region) => {
            const ruasInRegion = cctvTollRoads.filter(r => r.region === region);
            const isExpanded = expandedRegion === region || ruasInRegion.some(r => r.id === selectedRuas.id);
            return (
              <div key={region}>
                <button
                  onClick={() => setExpandedRegion(isExpanded && expandedRegion === region ? null : region)}
                  className="w-full text-left px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground flex items-center justify-between bg-secondary/50 rounded"
                >
                  <span>{region} ({ruasInRegion.length})</span>
                  <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                </button>
                {isExpanded && ruasInRegion.map((ruas) => (
                  <button
                    key={ruas.id}
                    onClick={() => {
                      setSelectedRuas(ruas);
                    }}
                    className={`w-full text-left p-2 rounded border transition-all mt-0.5 ${
                      selectedRuas.id === ruas.id
                        ? "border-primary bg-secondary"
                        : "border-border bg-card hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-[8px] font-mono font-medium text-foreground truncate">{ruas.id}</span>
                    </div>
                    <div className="text-[7px] font-mono text-muted-foreground mt-0.5 truncate">
                      <MapPin className="w-2 h-2 inline mr-0.5" />
                      {ruas.name}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[7px] font-mono text-primary flex items-center gap-0.5">
                        <Wifi className="w-2 h-2" /> {ruas.online} online
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRuas(ruas);
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
