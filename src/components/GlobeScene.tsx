import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

// War/conflict alert points
const alertPoints = [
  { name: "Ukraine-Russia", lat: 48.3, lon: 35.0, level: "HIGH", desc: "Perang aktif" },
  { name: "Gaza-Israel", lat: 31.5, lon: 34.5, level: "HIGH", desc: "Konflik bersenjata" },
  { name: "Yemen-Houthi", lat: 15.3, lon: 44.2, level: "HIGH", desc: "Serangan Laut Merah" },
  { name: "Taiwan Strait", lat: 24.0, lon: 118.5, level: "MED", desc: "Ketegangan militer" },
  { name: "Natuna EEZ", lat: 3.5, lon: 108.0, level: "MED", desc: "Pelanggaran ZEE" },
  { name: "Korea DMZ", lat: 38.0, lon: 127.0, level: "HIGH", desc: "Uji rudal ICBM" },
  { name: "Iran", lat: 32.4, lon: 53.7, level: "MED", desc: "Uji balistik" },
  { name: "Myanmar", lat: 19.7, lon: 96.1, level: "MED", desc: "Konflik internal" },
  { name: "Laut China Selatan", lat: 12.0, lon: 114.0, level: "HIGH", desc: "Militerisasi" },
  { name: "Sudan", lat: 15.5, lon: 32.5, level: "HIGH", desc: "Perang saudara" },
];

const latLonToVec3 = (lat: number, lon: number, r: number) => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
};

const IndonesiaPoints = () => {
  const cities = [
    { name: "Jakarta", lat: -6.2, lon: 106.8 },
    { name: "Surabaya", lat: -7.3, lon: 112.7 },
    { name: "Bandung", lat: -6.9, lon: 107.6 },
    { name: "Medan", lat: 3.6, lon: 98.7 },
    { name: "Makassar", lat: -5.1, lon: 119.4 },
    { name: "Denpasar", lat: -8.7, lon: 115.2 },
    { name: "Jayapura", lat: -2.5, lon: 140.7 },
    { name: "Pontianak", lat: 0.0, lon: 109.3 },
    { name: "Manado", lat: 1.5, lon: 124.8 },
    { name: "Ambon", lat: -3.7, lon: 128.2 },
    { name: "Natuna", lat: 3.9, lon: 108.4 },
    { name: "Sorong", lat: -0.9, lon: 131.3 },
  ];

  return (
    <>
      {cities.map((city) => {
        const pos = latLonToVec3(city.lat, city.lon, 2.02);
        return (
          <group key={city.name} position={pos}>
            <mesh>
              <sphereGeometry args={[0.018, 8, 8]} />
              <meshBasicMaterial color="#5a7a9a" />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="text-[7px] font-mono text-muted-foreground whitespace-nowrap">{city.name}</div>
            </Html>
          </group>
        );
      })}
    </>
  );
};

// Blinking alert points on globe
const AlertBlips = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const mesh = child.children[0] as THREE.Mesh;
        if (mesh?.material) {
          const mat = mesh.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.4 + Math.sin(clock.getElapsedTime() * 4 + i * 1.5) * 0.4;
        }
        const scale = 0.7 + Math.sin(clock.getElapsedTime() * 3 + i) * 0.4;
        child.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {alertPoints.map((ap) => {
        const pos = latLonToVec3(ap.lat, ap.lon, 2.03);
        const color = ap.level === "HIGH" ? "#8a3a3a" : "#8a7a3a";
        return (
          <group key={ap.name} position={pos}>
            <mesh>
              <sphereGeometry args={[0.035, 8, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.8} />
            </mesh>
            {/* Pulse ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.04, 0.06, 16]} />
              <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="text-[6px] font-mono whitespace-nowrap px-1 py-0.5 rounded bg-card/80 border border-border">
                <span className={ap.level === "HIGH" ? "text-destructive" : "status-warning"}>⚠ {ap.name}</span>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
};

const SatelliteOrbit = ({ speed, radius, color, name, inclination = 0 }: { speed: number; radius: number; color: string; name: string; inclination?: number }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 0.5 + inclination) * (radius * 0.3);
    }
  });

  return (
    <group ref={ref}>
      {/* Satellite body */}
      <mesh>
        <boxGeometry args={[0.06, 0.02, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[0.06, 0.002, 0.03]} />
        <meshStandardMaterial color="#4a6a8a" emissive="#4a6a8a" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.06, 0.002, 0.03]} />
        <meshStandardMaterial color="#4a6a8a" emissive="#4a6a8a" emissiveIntensity={0.15} />
      </mesh>
      {/* Antenna */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.03]} />
        <meshBasicMaterial color="#7a8a9a" />
      </mesh>
      <mesh position={[0, 0.035, 0]}>
        <sphereGeometry args={[0.005, 6, 6]} />
        <meshBasicMaterial color="#9aaacc" />
      </mesh>
      <Html distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="text-[6px] font-mono text-primary whitespace-nowrap opacity-80">{name}</div>
      </Html>
    </group>
  );
};

// Orbit path rings
const OrbitPath = ({ radius }: { radius: number }) => (
  <mesh rotation={[Math.PI / 2, 0, 0]}>
    <ringGeometry args={[radius - 0.003, radius, 128]} />
    <meshBasicMaterial color="#1a2a3a" transparent opacity={0.08} side={THREE.DoubleSide} />
  </mesh>
);

const Globe = () => {
  const globeRef = useRef<THREE.Group>(null);

  const globeMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#0d1117"),
    emissive: new THREE.Color("#111820"),
    emissiveIntensity: 0.2,
    wireframe: false,
    transparent: true,
    opacity: 0.95,
  }), []);

  const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
    color: new THREE.Color("#1e2a3a"),
    wireframe: true,
    transparent: true,
    opacity: 0.12,
  }), []);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.04;
    }
  });

  return (
    <group ref={globeRef}>
      <mesh material={globeMaterial}>
        <sphereGeometry args={[2, 64, 64]} />
      </mesh>
      <mesh material={wireframeMaterial}>
        <sphereGeometry args={[2.01, 32, 32]} />
      </mesh>
      <mesh>
        <sphereGeometry args={[2.08, 32, 32]} />
        <meshBasicMaterial color="#4a6a8a" transparent opacity={0.02} side={THREE.BackSide} />
      </mesh>
      <IndonesiaPoints />
      <AlertBlips />
    </group>
  );
};

const RadarRing = ({ radius }: { radius: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.z = clock.getElapsedTime() * 0.2;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.003, radius, 64]} />
      <meshBasicMaterial color="#2a3a4a" transparent opacity={0.08} side={THREE.DoubleSide} />
    </mesh>
  );
};

const GlobeScene = ({ onSatelliteClick }: { onSatelliteClick?: () => void }) => {
  return (
    <div className="w-full h-full relative cursor-pointer" onClick={onSatelliteClick}>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#c0c8d4" />
        <pointLight position={[-10, -5, -10]} intensity={0.2} color="#4a6a8a" />

        <Globe />

        {/* Satellites with realistic orbits */}
        <SatelliteOrbit speed={0.3} radius={3} color="#6a7a8a" name="PALAPA-D" inclination={0} />
        <SatelliteOrbit speed={0.4} radius={3.3} color="#5a7a9a" name="TELKOM-3S" inclination={1} />
        <SatelliteOrbit speed={0.25} radius={3.6} color="#7a8a9a" name="BRIsat" inclination={2} />
        <SatelliteOrbit speed={0.35} radius={2.8} color="#8a8a8a" name="LAPAN-A2" inclination={0.5} />
        <SatelliteOrbit speed={0.2} radius={3.9} color="#5a6a7a" name="SATRIA-1" inclination={1.5} />
        <SatelliteOrbit speed={0.28} radius={4.2} color="#6a8a9a" name="NUSANTARA-1" inclination={3} />

        {/* Orbit paths */}
        <OrbitPath radius={3} />
        <OrbitPath radius={3.3} />
        <OrbitPath radius={3.6} />

        <RadarRing radius={2.5} />
        <RadarRing radius={3.0} />
        <RadarRing radius={3.5} />

        <Stars radius={50} depth={50} count={2000} factor={3} saturation={0} fade />
        <OrbitControls enableZoom enablePan={false} minDistance={3} maxDistance={10} autoRotate autoRotateSpeed={0.2} />
      </Canvas>

      {/* Overlay HUD */}
      <div className="absolute top-3 left-3 text-[9px] font-mono text-muted-foreground space-y-0.5 pointer-events-none">
        <div>LAT -2.5489°</div>
        <div>LON 117.0125°</div>
        <div>ALT 35,786 km</div>
        <div className="mt-1 text-primary">MODE: INTEL SURVEILLANCE</div>
      </div>

      {/* Alert summary */}
      <div className="absolute top-3 right-3 text-[8px] font-mono pointer-events-none bg-card/80 border border-border rounded px-2 py-1.5 backdrop-blur-sm">
        <div className="text-muted-foreground mb-1">GLOBAL ALERTS</div>
        <div className="text-destructive flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" /> HIGH: {alertPoints.filter(a => a.level === "HIGH").length}
        </div>
        <div className="status-warning flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "hsl(35, 70%, 50%)" }} /> MED: {alertPoints.filter(a => a.level === "MED").length}
        </div>
      </div>

      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-muted-foreground pointer-events-none">
        <div>SATELLITES <span className="text-foreground">14</span></div>
        <div>TRACKING <span className="text-foreground">128</span></div>
        <div>ALERTS <span className="text-destructive">{alertPoints.length}</span></div>
        <div>STATUS <span className="text-primary">NOMINAL</span></div>
      </div>

      {/* Bottom alert ticker */}
      <div className="absolute bottom-3 left-3 right-24 pointer-events-none">
        <div className="bg-card/80 border border-border rounded px-2 py-1 backdrop-blur-sm overflow-hidden">
          <div className="text-[7px] font-mono text-muted-foreground animate-pulse">
            ⚠ ALERT: {alertPoints[0].name} — {alertPoints[0].desc} | {alertPoints[1].name} — {alertPoints[1].desc} | {alertPoints[2].name} — {alertPoints[2].desc}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobeScene;
