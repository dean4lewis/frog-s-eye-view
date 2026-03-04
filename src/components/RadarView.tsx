import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import { Radar as RadarIcon, Radio, Map, Shield, Satellite } from "lucide-react";
import DashboardPanel from "./DashboardPanel";

const radarSystems = [
  { name: "Natuna OTH-R", type: "Over-The-Horizon", range: "3,000 km", status: "ACTIVE", location: "Ranai, Natuna", azimuth: 45 },
  { name: "Pontianak ELINT", type: "Electronic Intelligence", range: "800 km", status: "ACTIVE", location: "Pontianak", azimuth: 120 },
  { name: "Makassar C-Band", type: "Air Surveillance", range: "450 km", status: "ACTIVE", location: "Makassar", azimuth: 200 },
  { name: "Jayapura S-Band", type: "Air Defense", range: "400 km", status: "MAINT", location: "Jayapura", azimuth: 310 },
  { name: "Manado X-Band", type: "Fire Control", range: "200 km", status: "ACTIVE", location: "Manado", azimuth: 75 },
  { name: "Jakarta AEWC", type: "Airborne Early Warning", range: "600 km", status: "ACTIVE", location: "Halim PK", azimuth: 160 },
  { name: "Surabaya Naval", type: "Surface Search", range: "350 km", status: "ACTIVE", location: "Surabaya", azimuth: 240 },
  { name: "Biak Long Range", type: "Long Range Search", range: "500 km", status: "ACTIVE", location: "Biak", azimuth: 350 },
];

// 3D Radar sweep line
const RadarSweep = () => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.getElapsedTime() * 1.2;
    }
  });

  return (
    <mesh ref={ref} rotation={[0, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[3, 0.01]} />
      <meshBasicMaterial color="#4a6a8a" transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Radar rings
const RadarRings = () => {
  const rings = [0.5, 1.0, 1.5, 2.0, 2.5];
  return (
    <>
      {rings.map((r) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[r - 0.005, r, 64]} />
          <meshBasicMaterial color="#2a3a4a" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
};

// Cross lines
const CrossLines = () => (
  <>
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[5, 0.005]} />
      <meshBasicMaterial color="#2a3a4a" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
    <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]}>
      <planeGeometry args={[5, 0.005]} />
      <meshBasicMaterial color="#2a3a4a" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  </>
);

// Blips on radar
const RadarBlips = () => {
  const blips = [
    { x: 0.8, z: 0.5, label: "UAV-01", threat: false },
    { x: -1.2, z: 0.3, label: "KRI-Raden", threat: false },
    { x: 0.3, z: -1.5, label: "UNKNOWN", threat: true },
    { x: -0.7, z: -0.9, label: "F-16C", threat: false },
    { x: 1.5, z: -0.4, label: "HOSTILE?", threat: true },
    { x: -0.2, z: 1.8, label: "PALAPA-D", threat: false },
  ];

  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const scale = 0.8 + Math.sin(clock.getElapsedTime() * 3 + i) * 0.3;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {blips.map((b, i) => (
        <group key={i} position={[b.x, 0.02, b.z]}>
          <mesh>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshBasicMaterial color={b.threat ? "#8a4a4a" : "#4a8a6a"} />
          </mesh>
          <Html distanceFactor={5} style={{ pointerEvents: "none" }}>
            <div className={`text-[7px] font-mono whitespace-nowrap px-1 py-0.5 rounded ${b.threat ? "text-destructive bg-destructive/10" : "text-primary bg-primary/10"}`}>
              {b.label}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
};

// 3D Satellite model
const Satellite3D = ({ orbitRadius, speed, name }: { orbitRadius: number; speed: number; name: string }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * orbitRadius;
      ref.current.position.z = Math.sin(t) * orbitRadius;
      ref.current.position.y = 1.5 + Math.sin(t * 0.5) * 0.3;
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.06, 0.02, 0.04]} />
        <meshStandardMaterial color="#6a7a8a" emissive="#4a6a8a" emissiveIntensity={0.4} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[0.06, 0.002, 0.03]} />
        <meshStandardMaterial color="#3a5a7a" emissive="#3a5a7a" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.06, 0.002, 0.03]} />
        <meshStandardMaterial color="#3a5a7a" emissive="#3a5a7a" emissiveIntensity={0.2} />
      </mesh>
      <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
        <div className="text-[6px] font-mono text-muted-foreground whitespace-nowrap opacity-70">{name}</div>
      </Html>
    </group>
  );
};

// Radar base plate
const RadarBase = () => (
  <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
    <circleGeometry args={[2.8, 64]} />
    <meshBasicMaterial color="#0a1520" transparent opacity={0.9} side={THREE.DoubleSide} />
  </mesh>
);

const Radar3DScene = () => (
  <div className="w-full h-full relative" style={{ minHeight: 300 }}>
    <Canvas camera={{ position: [0, 4, 4], fov: 40 }}>
      <ambientLight intensity={0.15} />
      <pointLight position={[5, 8, 5]} intensity={0.5} color="#6a8aaa" />

      <RadarBase />
      <RadarRings />
      <CrossLines />
      <RadarSweep />
      <RadarBlips />

      <Satellite3D orbitRadius={2} speed={0.4} name="PALAPA-D" />
      <Satellite3D orbitRadius={2.3} speed={0.3} name="LAPAN-A2" />
      <Satellite3D orbitRadius={1.7} speed={0.5} name="BRIsat" />

      <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={12} autoRotate autoRotateSpeed={0.15} />
    </Canvas>

    {/* Overlay labels */}
    <div className="absolute top-2 left-2 text-[8px] font-mono text-muted-foreground pointer-events-none space-y-0.5">
      <div>MODE: <span className="text-primary">SURVEILLANCE</span></div>
      <div>SCAN: <span className="text-primary">360° ACTIVE</span></div>
      <div>RANGE: <span className="text-foreground">3,000 KM</span></div>
    </div>
    <div className="absolute bottom-2 right-2 text-[8px] font-mono text-muted-foreground pointer-events-none">
      <div>BLIPS: <span className="text-foreground">6</span></div>
      <div>THREATS: <span className="text-destructive">2</span></div>
      <div>SAT: <span className="text-primary">3 TRACKED</span></div>
    </div>
  </div>
);

const RadarView = () => {
  const [view, setView] = useState<"3d" | "list">("3d");

  return (
    <div className="h-full p-3 flex flex-col gap-2 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2.5">
          <RadarIcon className="w-4 h-4 text-muted-foreground" />
          <div>
            <h2 className="text-xs font-bold text-foreground tracking-wide">RADAR & SATELLITE SYSTEMS</h2>
            <p className="text-[9px] font-mono text-muted-foreground">{radarSystems.length} systems tracked · 3 satellites · National Air Defense</p>
          </div>
        </div>
        <div className="flex gap-1 text-[8px] font-mono">
          <button onClick={() => setView("3d")} className={`px-2 py-0.5 rounded border ${view === "3d" ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}>3D Radar</button>
          <button onClick={() => setView("list")} className={`px-2 py-0.5 rounded border ${view === "list" ? "border-primary bg-secondary text-foreground" : "border-border bg-card text-muted-foreground"}`}>Systems</button>
        </div>
      </div>

      {view === "3d" ? (
        <div className="flex-1 bg-card border border-border rounded overflow-hidden" style={{ minHeight: 400 }}>
          <Radar3DScene />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-1.5">
            {radarSystems.map((radar) => (
              <div key={radar.name} className="bg-card border border-border rounded p-2.5">
                <div className="grid grid-cols-5 gap-3 text-[9px] font-mono items-center">
                  <span className="text-foreground font-medium">{radar.name}</span>
                  <span className="text-muted-foreground">{radar.type}</span>
                  <span className="text-muted-foreground">{radar.range}</span>
                  <span className="text-muted-foreground">{radar.location}</span>
                  <span className={`text-right ${radar.status === "ACTIVE" ? "text-primary" : "status-warning"}`}>{radar.status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2">
            <DashboardPanel title="Coverage" icon={<Map className="w-3 h-3" />}>
              <div className="space-y-1 text-[9px] font-mono">
                <div className="flex justify-between"><span className="text-muted-foreground">Western</span><span className="text-primary">98%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Central</span><span className="text-primary">94%</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Eastern</span><span className="status-warning">78%</span></div>
              </div>
            </DashboardPanel>
            <DashboardPanel title="Threats" icon={<Shield className="w-3 h-3" />}>
              <div className="space-y-1 text-[9px] font-mono">
                <div className="flex justify-between"><span className="text-muted-foreground">Aircraft</span><span className="text-foreground">0</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Maritime</span><span className="status-warning">2</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Unknown</span><span className="status-critical">1</span></div>
              </div>
            </DashboardPanel>
            <DashboardPanel title="Satellites" icon={<Satellite className="w-3 h-3" />}>
              <div className="space-y-1 text-[9px] font-mono">
                <div className="flex justify-between"><span className="text-muted-foreground">PALAPA-D</span><span className="text-primary">TRACK</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">LAPAN-A2</span><span className="text-primary">TRACK</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">BRIsat</span><span className="text-primary">TRACK</span></div>
              </div>
            </DashboardPanel>
          </div>
        </>
      )}
    </div>
  );
};

export default RadarView;
