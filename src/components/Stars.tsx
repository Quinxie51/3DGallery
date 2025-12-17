import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Stars() {
  const starsRef = useRef<THREE.Points>(null);
  
  const starGeometry = useMemo(() => {
    const positions = [];
    const colors = [];
    
    // Create stars around the gallery space
    for (let i = 0; i < 1000; i++) {
      // Random position in a sphere around the gallery
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 20 + Math.random() * 30;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = Math.max(5, radius * Math.sin(phi) * Math.sin(theta)); // Keep stars above floor
      const z = radius * Math.cos(phi);
      
      positions.push(x, y, z);
      
      // Purple and white star colors
      const colorChoice = Math.random();
      if (colorChoice > 0.7) {
        colors.push(0.9, 0.8, 1); // Bright white
      } else if (colorChoice > 0.4) {
        colors.push(0.6, 0.4, 1); // Purple
      } else {
        colors.push(0.4, 0.3, 0.8); // Deep purple
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, []);
  
  // Gentle twinkling animation
  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
    }
  });
  
  return (
    <points ref={starsRef} geometry={starGeometry}>
      <pointsMaterial 
        size={0.05} 
        vertexColors 
        transparent 
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}
