interface CeilingLightProps {
  position: [number, number, number];
}

export function CeilingLight({ position }: CeilingLightProps) {
  return (
    <group position={position}>
      {/* Yellow point light */}
      <pointLight 
        color="#ffdb58" 
        intensity={3.5} 
        distance={20}
        decay={1.2}
      />
      
      {/* Visible light bulb */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial 
          color="#ffdb58"
          emissive="#ffdb58"
          emissiveIntensity={4}
        />
      </mesh>
      
      {/* Light fixture/mount */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.2, 8]} />
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}