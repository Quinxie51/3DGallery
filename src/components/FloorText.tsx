import { useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const messages = [
  "Welcome to The Blue Memory Hall",
  "with you, I've found my forever place",
  "Every moment with you feels like home",
  "A year of love, gently unfolding.",
  "365 days since you walked into my world."
];

export function FloorText() {
  const { camera } = useThree();
  const textRefs = useRef<Array<any>>([]);
  
  useFrame(() => {
    const distance = camera.position.length();
    
    // Map camera distance to text visibility
    textRefs.current.forEach((ref, index) => {
      if (ref && ref.material) {
        // Each text appears at different distances
        const triggerDistance = 10 - (index * 1.5); // Gradually appear as you zoom in
        const fadeRange = 2;
        
        let opacity = 0;
        if (distance < triggerDistance) {
          opacity = Math.min(1, (triggerDistance - distance) / fadeRange);
        }
        
        ref.material.opacity = opacity;
      }
    });
  });
  
  return (
    <group>
      {messages.map((message, index) => (
        <Text
          key={index}
          ref={(el) => (textRefs.current[index] = el)}
          position={[0, 0.05, -4 + index * 2]} // Positioned on floor, spread out
          rotation={[-Math.PI / 2, 0, 0]} // Flat on floor
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          maxWidth={8}
          textAlign="center"
        >
          {message}
          <meshBasicMaterial transparent opacity={0} color="#ffffff" />
        </Text>
      ))}
    </group>
  );
}