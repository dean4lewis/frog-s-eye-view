import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

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

  return (
    <>
      {cities.map((city) => {
        const pos = latLonToVec3(city.lat, city.lon, 2.02);
        return (
          <group key={city.name} position={pos}>
            <mesh>
              <sphereGeometry args={[0.02, 8, 8]} />
              <meshBasicMaterial color="#00e599" />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="text-[8px] font-mono text-primary whitespace-nowrap glow-text-primary">
                {city.name}
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
};

const SatelliteOrbit = ({ speed, radius, color, name }: { speed: number; radius: number; color: string; name: string }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.getElapsedTime() * speed;
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 0.5) * (radius * 0.3);
    }
  });

  return (
    <group ref={ref}>
      <mesh>
        <boxGeometry args={[0.06, 0.02, 0.04]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {/* Solar panels */}
      <mesh position={[0.08, 0, 0]}>
        <boxGeometry args={[0.06, 0.001, 0.03]} />
        <meshStandardMaterial color="#3388ff" emissive="#3388ff" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[-0.08, 0, 0]}>
        <boxGeometry args={[0.06, 0.001, 0.03]} />
        <meshStandardMaterial color="#3388ff" emissive="#3388ff" emissiveIntensity={0.3} />
      </mesh>
      <Html distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="text-[7px] font-mono text-accent whitespace-nowrap opacity-70">
          {name}
        </div>
      </Html>
    </group>
  );
};

const Globe = () => {
  const globeRef = useRef<THREE.Group>(null);

  const globeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color("#0a1628"),
      emissive: new THREE.Color("#0a2540"),
      emissiveIntensity: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.9,
    });
  }, []);

  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#1a3a5c"),
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
  }, []);

  useFrame(({ clock }) => {
    if (globeRef.current) {
      globeRef.current.rotation.y = clock.getElapsedTime() * 0.05;
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
      {/* Atmosphere */}
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshBasicMaterial color="#00e599" transparent opacity={0.03} side={THREE.BackSide} />
      </mesh>
      <IndonesiaPoints />
    </group>
  );
};

const RadarRing = ({ radius }: { radius: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.005, radius, 64]} />
      <meshBasicMaterial color="#00e599" transparent opacity={0.1} side={THREE.DoubleSide} />
    </mesh>
  );
};

const GlobeScene = ({ onSatelliteClick }: { onSatelliteClick?: () => void }) => {
  return (
    <div className="w-full h-full relative" onClick={onSatelliteClick}>
      <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -5, -10]} intensity={0.3} color="#00e599" />

        <Globe />

        <SatelliteOrbit speed={0.3} radius={3} color="#00e599" name="PALAPA-D" />
        <SatelliteOrbit speed={0.4} radius={3.3} color="#3399ff" name="TELKOM-3S" />
        <SatelliteOrbit speed={0.25} radius={3.6} color="#ff6633" name="BRIsat" />
        <SatelliteOrbit speed={0.35} radius={2.8} color="#ffcc00" name="LAPAN-A2" />
        <SatelliteOrbit speed={0.2} radius={3.9} color="#cc33ff" name="SATRIA-1" />

        <RadarRing radius={2.5} />
        <RadarRing radius={3.0} />
        <RadarRing radius={3.5} />

        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} />
        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>

      {/* Overlay HUD */}
      <div className="absolute top-4 left-4 text-[10px] font-mono text-primary space-y-1 pointer-events-none">
        <div>LAT: -2.5489° S</div>
        <div>LON: 117.0125° E</div>
        <div>ALT: 35,786 km</div>
        <div className="text-muted-foreground mt-2">GEOSYNC ORBIT</div>
      </div>

      <div className="absolute bottom-4 right-4 text-[10px] font-mono text-muted-foreground pointer-events-none">
        <div>SAT ACTIVE: <span className="text-primary">14</span></div>
        <div>TRACKING: <span className="text-primary">128</span></div>
        <div>SIGNALS: <span className="status-online">NOMINAL</span></div>
      </div>
    </div>
  );
};

export default GlobeScene;
