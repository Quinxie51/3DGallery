interface WallProps {
  position: [number, number, number];
  rotation: [number, number, number];
  width: number;
  height: number;
  color?: string;
}

export function Wall({ position, rotation, width, height, color = "#1a0f2e" }: WallProps) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial 
        color={color}
        roughness={0.9}
        metalness={0.1}
      />
    </mesh>
  );
}