import { useState } from "react";
import DashboardPanel from "./DashboardPanel";
import { Monitor, MapPin } from "lucide-react";

const cctvLocations = [
  { id: "JKT-001", city: "Jakarta", location: "Monas", status: "ONLINE", lat: -6.1754, lon: 106.8272 },
  { id: "JKT-002", city: "Jakarta", location: "Thamrin", status: "ONLINE", lat: -6.1951, lon: 106.8233 },
  { id: "SBY-001", city: "Surabaya", location: "Tugu Pahlawan", status: "ONLINE", lat: -7.2459, lon: 112.7378 },
  { id: "BDG-001", city: "Bandung", location: "Gedung Sate", status: "ONLINE", lat: -6.9025, lon: 107.6186 },
  { id: "MDN-001", city: "Medan", location: "Istana Maimun", status: "OFFLINE", lat: 3.5752, lon: 98.6837 },
  { id: "MKS-001", city: "Makassar", location: "Fort Rotterdam", status: "ONLINE", lat: -5.1344, lon: 119.4068 },
  { id: "DPS-001", city: "Denpasar", location: "Ngurah Rai", status: "ONLINE", lat: -8.7480, lon: 115.1673 },
  { id: "JYP-001", city: "Jayapura", location: "Base Camp", status: "ONLINE", lat: -2.5337, lon: 140.7187 },
];

const CCTVView = () => {
  const [selectedCCTV, setSelectedCCTV] = useState(cctvLocations[0]);

  return (
    <div className="h-full p-3 flex flex-col gap-3 overflow-hidden">
      <div className="flex items-center gap-3">
        <Monitor className="w-5 h-5 text-primary" />
        <div>
          <h2 className="text-sm font-bold text-foreground">CCTV Network — Indonesia</h2>
          <p className="text-[10px] font-mono text-muted-foreground">
            {cctvLocations.filter(c => c.status === "ONLINE").length} cameras online
          </p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
        {/* Map Area */}
        <div className="col-span-2 bg-card border border-border rounded-lg overflow-hidden relative">
          {/* macOS Safari-style browser bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(45, 100%, 50%)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(120, 60%, 45%)" }} />
            </div>
            <div className="flex-1 bg-muted rounded px-3 py-0.5 text-[10px] font-mono text-muted-foreground text-center">
              🔒 intl-srvid.mil.id/cctv/live/{selectedCCTV.id}
            </div>
          </div>

          {/* Map embed */}
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedCCTV.lon - 0.05}%2C${selectedCCTV.lat - 0.03}%2C${selectedCCTV.lon + 0.05}%2C${selectedCCTV.lat + 0.03}&layer=mapnik&marker=${selectedCCTV.lat}%2C${selectedCCTV.lon}`}
            className="w-full h-full border-0"
            style={{ minHeight: "350px", filter: "hue-rotate(180deg) invert(90%) contrast(1.2)" }}
            title="CCTV Map"
          />

          {/* Overlay info */}
          <div className="absolute bottom-3 left-3 bg-card/90 border border-border rounded px-3 py-2">
            <div className="text-[10px] font-mono text-primary">
              📍 {selectedCCTV.city} — {selectedCCTV.location}
            </div>
            <div className="text-[9px] font-mono text-muted-foreground">
              {selectedCCTV.lat.toFixed(4)}°S, {selectedCCTV.lon.toFixed(4)}°E
            </div>
          </div>
        </div>

        {/* CCTV List */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          {cctvLocations.map((cctv) => (
            <button
              key={cctv.id}
              onClick={() => setSelectedCCTV(cctv)}
              className={`text-left p-2 rounded border transition-all ${
                selectedCCTV.id === cctv.id
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${cctv.status === "ONLINE" ? "bg-primary pulse-dot" : "bg-destructive"}`} />
                <span className="text-[10px] font-mono font-bold text-foreground">{cctv.id}</span>
              </div>
              <div className="text-[9px] font-mono text-muted-foreground mt-1">
                <MapPin className="w-2.5 h-2.5 inline mr-1" />
                {cctv.city} — {cctv.location}
              </div>
              <div className={`text-[8px] font-mono mt-1 ${cctv.status === "ONLINE" ? "status-online" : "status-danger"}`}>
                {cctv.status}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CCTVView;
