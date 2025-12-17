interface WallLightProps {
  position: [number, number, number];
  rotation?: [number, number, number];
}

export function WallLight({ position, rotation = [0, 0, 0] }: WallLightProps) {
  return (
    <group position={position} rotation={rotation}>
      {/* Main spotlight pointing down */}
      <spotLight
        color="#d4a574"
        intensity={6.5}
        angle={Math.PI / 2}
        penumbra={0.3}
        distance={18}
        decay={1.2}
        position={[0, 0, 0.2]}
        target-position={[0, -3, 0]}
      />
      
      {/* Light fixture body */}
      <mesh position={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.08, 0.12, 0.15, 8]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Glowing lens */}
      <mesh position={[0, -0.05, 0.1]}>
        <cylinderGeometry args={[0.1, 0.1, 0.05, 8]} />
        <meshStandardMaterial 
          color="#d4a574"
          emissive="#d4a574"
          emissiveIntensity={2.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Wall mount plate */}
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 8]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
    </group>
  );
}