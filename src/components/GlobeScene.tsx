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
              <sphereGeometry args={[0.015, 8, 8]} />
              <meshBasicMaterial color="#7a8fa6" />
            </mesh>
            <Html distanceFactor={6} style={{ pointerEvents: "none" }}>
              <div className="text-[7px] font-mono text-muted-foreground whitespace-nowrap">
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
        <boxGeometry args={[0.05, 0.015, 0.03]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0.07, 0, 0]}>
        <boxGeometry args={[0.05, 0.001, 0.025]} />
        <meshStandardMaterial color="#4a6a8a" emissive="#4a6a8a" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-0.07, 0, 0]}>
        <boxGeometry args={[0.05, 0.001, 0.025]} />
        <meshStandardMaterial color="#4a6a8a" emissive="#4a6a8a" emissiveIntensity={0.15} />
      </mesh>
      <Html distanceFactor={8} style={{ pointerEvents: "none" }}>
        <div className="text-[6px] font-mono text-muted-foreground whitespace-nowrap opacity-60">
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
      color: new THREE.Color("#0d1117"),
      emissive: new THREE.Color("#111820"),
      emissiveIntensity: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.95,
    });
  }, []);

  const wireframeMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: new THREE.Color("#1e2a3a"),
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
  }, []);

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
    </group>
  );
};

const RadarRing = ({ radius }: { radius: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.2;
    }
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

        <SatelliteOrbit speed={0.3} radius={3} color="#6a7a8a" name="PALAPA-D" />
        <SatelliteOrbit speed={0.4} radius={3.3} color="#5a7a9a" name="TELKOM-3S" />
        <SatelliteOrbit speed={0.25} radius={3.6} color="#7a8a9a" name="BRIsat" />
        <SatelliteOrbit speed={0.35} radius={2.8} color="#8a8a8a" name="LAPAN-A2" />
        <SatelliteOrbit speed={0.2} radius={3.9} color="#5a6a7a" name="SATRIA-1" />

        <RadarRing radius={2.5} />
        <RadarRing radius={3.0} />
        <RadarRing radius={3.5} />

        <Stars radius={50} depth={50} count={1500} factor={3} saturation={0} fade />
        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={3}
          maxDistance={10}
          autoRotate
          autoRotateSpeed={0.2}
        />
      </Canvas>

      <div className="absolute top-3 left-3 text-[9px] font-mono text-muted-foreground space-y-0.5 pointer-events-none">
        <div>LAT -2.5489°</div>
        <div>LON 117.0125°</div>
        <div>ALT 35,786 km</div>
      </div>

      <div className="absolute bottom-3 right-3 text-[9px] font-mono text-muted-foreground pointer-events-none">
        <div>SATELLITES <span className="text-foreground">14</span></div>
        <div>TRACKING <span className="text-foreground">128</span></div>
        <div>STATUS <span className="text-primary">NOMINAL</span></div>
      </div>
    </div>
  );
};

export default GlobeScene;
