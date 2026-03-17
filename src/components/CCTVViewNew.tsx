import { useState, useEffect, useRef } from "react";
import { Monitor, Search, MapPin, Globe, Radio, ChevronDown, Grid3x3 as Grid3X3, Maximize2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import Hls from 'hls.js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface CCTVCamera {
  id: string;
  camera_name: string;
  stream_url: string;
  province: string;
  city: string;
  location_detail: string;
  latitude: number;
  longitude: number;
  status: string;
}

const CCTVViewNew = () => {
  const [cameras, setCameras] = useState<CCTVCamera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<CCTVCamera | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);
  const [gridMode, setGridMode] = useState(false);
  const [gridCameras, setGridCameras] = useState<CCTVCamera[]>([]);
  const [loading, setLoading] = useState(true);
  const [streamError, setStreamError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRef2 = useRef<HTMLVideoElement>(null);
  const videoRef3 = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const hlsRefs = useRef<(Hls | null)[]>([null, null, null, null]);

  useEffect(() => {
    loadCameras();
  }, []);

  const loadCameras = async () => {
    try {
      const { data, error } = await supabase
        .from('cctv_cameras')
        .select('*')
        .eq('status', 'active')
        .order('province', { ascending: true })
        .order('city', { ascending: true })
        .order('camera_name', { ascending: true });

      if (error) throw error;

      setCameras(data || []);
      if (data && data.length > 0) {
        setSelectedCamera(data[0]);
        setExpandedProvince(data[0].province);
        setGridCameras(data.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading cameras:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedCamera || gridMode) return;

    const video = videoRef.current;
    if (!video) return;

    setStreamError(null);

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });

      hlsRef.current = hls;

      hls.loadSource(selectedCamera.stream_url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          setStreamError('Stream tidak dapat dimuat. Silakan coba kamera lain.');
          console.error('HLS Error:', data);
        }
      });

      return () => {
        hls.destroy();
      };
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = selectedCamera.stream_url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(err => {
          console.log('Autoplay prevented:', err);
        });
      });
    }
  }, [selectedCamera, gridMode]);

  useEffect(() => {
    if (!gridMode) {
      hlsRefs.current.forEach(hls => {
        if (hls) hls.destroy();
      });
      hlsRefs.current = [null, null, null, null];
      return;
    }

    const videoElements = [videoRef1.current, videoRef2.current, videoRef3.current, videoRef.current];

    gridCameras.forEach((camera, index) => {
      const video = videoElements[index];
      if (!video || !camera) return;

      if (Hls.isSupported()) {
        if (hlsRefs.current[index]) {
          hlsRefs.current[index]?.destroy();
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90,
        });

        hlsRefs.current[index] = hls;

        hls.loadSource(camera.stream_url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(err => {
            console.log('Autoplay prevented:', err);
          });
        });

      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = camera.stream_url;
        video.addEventListener('loadedmetadata', () => {
          video.play().catch(err => {
            console.log('Autoplay prevented:', err);
          });
        });
      }
    });

    return () => {
      hlsRefs.current.forEach(hls => {
        if (hls) hls.destroy();
      });
      hlsRefs.current = [null, null, null, null];
    };
  }, [gridMode, gridCameras]);

  const filteredCameras = searchQuery
    ? cameras.filter(c =>
        c.camera_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location_detail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.city.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cameras;

  const provinces = Array.from(new Set(cameras.map(c => c.province)));
  const filteredProvinces = provinces.filter(p =>
    filteredCameras.some(c => c.province === p)
  );

  const handleCameraSelect = (camera: CCTVCamera) => {
    setSelectedCamera(camera);
    if (gridMode) {
      const idx = gridCameras.findIndex(g => g.id === camera.id);
      if (idx === -1) {
        setGridCameras(prev => [camera, ...prev.slice(0, 3)]);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-mono text-muted-foreground">Loading CCTV Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Monitor className="w-4 h-4 text-primary" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">CCTV SURVEILLANCE NETWORK</h2>
            <p className="text-[9px] font-mono text-muted-foreground">
              {cameras.length} kamera aktif · Live streaming · Indonesia Intelligence Network
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
            onClick={() => { setGridMode(true); setGridCameras(cameras.slice(0, 4)); }}
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${gridMode ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}
          >
            <Grid3X3 className="w-2.5 h-2.5" /> 2x2 Grid
          </button>
          <span className="flex items-center gap-1 text-primary"><Radio className="w-3 h-3" /> LIVE</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-4 gap-2 min-h-0">
        <div className="col-span-3 bg-card border border-border rounded overflow-hidden relative flex flex-col">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary border-b border-border shrink-0">
            <div className="flex gap-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(35, 80%, 50%)" }} />
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "hsl(120, 30%, 35%)" }} />
            </div>
            <div className="flex-1 bg-muted rounded px-3 py-0.5 text-[9px] font-mono text-muted-foreground text-center truncate">
              {selectedCamera ? `${selectedCamera.camera_name} — ${selectedCamera.location_detail}, ${selectedCamera.city}` : 'No camera selected'}
            </div>
          </div>

          <div className="relative flex-1 bg-black">
            {!gridMode ? (
              <div className="w-full h-full relative">
                {streamError ? (
                  <div className="absolute inset-0 flex items-center justify-center text-destructive text-sm font-mono">
                    {streamError}
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    controls
                    muted
                    playsInline
                  />
                )}

                {selectedCamera && !streamError && (
                  <>
                    <div className="absolute top-2 left-2 bg-card/95 border border-border rounded px-3 py-2 backdrop-blur-sm">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                        <span className="text-[10px] font-mono text-foreground font-medium">LIVE SURVEILLANCE</span>
                      </div>
                      <div className="text-[9px] font-mono text-foreground">{selectedCamera.camera_name}</div>
                      <div className="text-[8px] font-mono text-muted-foreground">
                        {selectedCamera.location_detail} · {selectedCamera.city}
                      </div>
                      <div className="text-[8px] font-mono text-primary mt-1">
                        <MapPin className="w-2.5 h-2.5 inline mr-0.5" />
                        {selectedCamera.latitude?.toFixed(4)}°, {selectedCamera.longitude?.toFixed(4)}°
                      </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-card/90 border-t border-border px-3 py-1.5 backdrop-blur-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Radio className="w-3 h-3 text-primary" />
                            <span className="text-[8px] font-mono text-primary">● LIVE</span>
                          </div>
                          <span className="text-[8px] font-mono text-muted-foreground">
                            {new Date().toLocaleTimeString("id-ID", { hour12: false })} WIB
                          </span>
                          <span className="text-[8px] font-mono text-muted-foreground">
                            HLS STREAM · {selectedCamera.province}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-muted-foreground">
                          INDONESIA INTELLIGENCE NETWORK
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 grid-rows-2 w-full h-full">
                {[videoRef1, videoRef2, videoRef3, videoRef].map((ref, i) => (
                  <div key={i} className="relative border border-border/50 bg-black">
                    {gridCameras[i] && (
                      <>
                        <video
                          ref={ref}
                          className="w-full h-full object-contain"
                          controls
                          muted
                          playsInline
                        />
                        <div className="absolute top-1 left-1 bg-card/90 border border-border rounded px-1.5 py-0.5 backdrop-blur-sm">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                            <span className="text-[7px] font-mono text-foreground">{gridCameras[i].camera_name}</span>
                          </div>
                          <div className="text-[6px] font-mono text-muted-foreground">{gridCameras[i].city}</div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

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

          <div className="text-[8px] font-mono text-muted-foreground px-1">
            {filteredCameras.length} KAMERA DITEMUKAN
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col gap-0.5">
            {filteredProvinces.map((province) => {
              const camsInProvince = filteredCameras.filter(c => c.province === province);
              const isExpanded = expandedProvince === province;
              return (
                <div key={province}>
                  <button
                    onClick={() => setExpandedProvince(isExpanded ? null : province)}
                    className="w-full text-left px-2 py-1 text-[8px] font-mono text-muted-foreground hover:text-foreground flex items-center justify-between bg-secondary/50 rounded"
                  >
                    <span>{province} ({camsInProvince.length})</span>
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform ${isExpanded ? "rotate-0" : "-rotate-90"}`} />
                  </button>
                  {isExpanded && camsInProvince.map((cam) => (
                    <button
                      key={cam.id}
                      onClick={() => handleCameraSelect(cam)}
                      className={`w-full text-left p-1.5 rounded border transition-all mt-0.5 ${
                        selectedCamera?.id === cam.id
                          ? "border-primary bg-secondary"
                          : "border-border bg-card hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <Radio className="w-2 h-2 text-primary" />
                        <span className="text-[7px] font-mono font-medium text-foreground truncate">{cam.camera_name}</span>
                      </div>
                      <div className="text-[6px] font-mono text-muted-foreground mt-0.5 truncate">
                        {cam.location_detail || cam.city}
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

export default CCTVViewNew;
