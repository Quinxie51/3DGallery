export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2.5]} receiveShadow>
      <planeGeometry args={[10, 20]} />
      <meshStandardMaterial 
        color="#0d0520"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}