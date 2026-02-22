import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';

const defaultMessages = [
  'Welcome to The Blue Memory Hall',
  "with you, I've found my forever place",
  'Every moment with you feels like home',
  'A year of love, gently unfolding.',
  '365 days since you walked into my world.',
];

interface FloorTextProps {
  messages?: string[];
  enabled?: boolean;
  baseTriggerDistance?: number;
  triggerStep?: number;
  fadeRange?: number;
}

export function FloorText({
  messages = defaultMessages,
  enabled = true,
  baseTriggerDistance = 10,
  triggerStep = 1.5,
  fadeRange = 2,
}: FloorTextProps) {
  const { camera } = useThree();
  const textRefs = useRef<Array<any>>([]);
  
  useFrame(() => {
    const distance = camera.position.length();
    
    // Map camera distance to text visibility
    textRefs.current.forEach((ref, index) => {
      if (ref && ref.material) {
        // Each text appears at different distances
        const triggerDistance = baseTriggerDistance - (index * triggerStep); // Gradually appear as you zoom in
        
        let opacity = 0;
        if (enabled && distance < triggerDistance) {
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