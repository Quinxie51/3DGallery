import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type SkyMode = 'starry-night' | 'snow' | 'shooting-stars';

interface StarsProps {
  mode: SkyMode;
}

export function Stars({ mode }: StarsProps) {
  const starsRef = useRef<THREE.Points>(null);
  const shootingStarsRef = useRef<THREE.Group>(null);
  const snowRef = useRef<THREE.Points>(null);
  const [shootingStars, setShootingStars] = useState<Array<{
    startPos: THREE.Vector3;
    direction: THREE.Vector3;
    speed: number;
    startTime: number;
  }>>([]);
  
  const starGeometry = useMemo(() => {
    const positions = [];
    const colors = [];
    const starCount = mode === 'starry-night' ? 2000 : mode === 'snow' ? 1500 : 1000;
    
    // Create stars around the gallery space
    for (let i = 0; i < starCount; i++) {
      // Random position in a sphere around the gallery
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const radius = 20 + Math.random() * 30;
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = Math.max(5, radius * Math.sin(phi) * Math.sin(theta)); // Keep stars above floor
      const z = radius * Math.cos(phi);
      
      positions.push(x, y, z);
      
      // Star colors
      const colorChoice = Math.random();
      if (colorChoice > 0.7) {
        colors.push(0.9, 0.9, 1); // Bright white
      } else if (colorChoice > 0.4) {
        colors.push(0.6, 0.6, 1); // Light blue
      } else {
        colors.push(0.4, 0.4, 0.8); // Deep blue
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    
    return geometry;
  }, [mode]);

  // Snow geometry
  const snowGeometry = useMemo(() => {
    const positions = [];
    const velocities = [];
    
    // Create 500 snowflakes
    for (let i = 0; i < 500; i++) {
      positions.push(
        (Math.random() - 0.5) * 40, // x
        Math.random() * 30 + 5,     // y (start high)
        (Math.random() - 0.5) * 40  // z
      );
      
      // Random falling velocity for each snowflake
      velocities.push(0.5 + Math.random() * 1);
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.userData = { velocities }; // Store velocities
    
    return geometry;
  }, []);

  // Create circular texture for snowflakes
  const snowTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create radial gradient for soft circular snowflake
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);
  
  // Animation based on mode
  useFrame((state) => {
    if (starsRef.current) {
      if (mode === 'starry-night') {
        // Gentle rotation and twinkling
        starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
      } else if (mode === 'snow') {
        // Gentle rotation for stars
        starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.008;
      } else if (mode === 'shooting-stars') {
        // Faster rotation
        starsRef.current.rotation.y = state.clock.getElapsedTime() * 0.015;
        
        // Add shooting stars occasionally
        if (Math.random() < 0.02 && shootingStars.length < 5) {
          const startPos = new THREE.Vector3(
            (Math.random() - 0.5) * 50,
            20 + Math.random() * 20,
            (Math.random() - 0.5) * 50
          );
          const direction = new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            -1 - Math.random(),
            (Math.random() - 0.5) * 2
          ).normalize();
          
          setShootingStars(prev => [...prev, {
            startPos,
            direction,
            speed: 15 + Math.random() * 10,
            startTime: state.clock.getElapsedTime()
          }]);
        }
        
        // Remove old shooting stars
        setShootingStars(prev => 
          prev.filter(star => state.clock.getElapsedTime() - star.startTime < 2)
        );
      }
    }
    
    // Animate falling snow
    if (mode === 'snow' && snowRef.current) {
      const positions = snowRef.current.geometry.attributes.position.array as Float32Array;
      const velocities = snowRef.current.geometry.userData.velocities;
      
      for (let i = 0; i < positions.length; i += 3) {
        // Move snowflake down
        positions[i + 1] -= velocities[i / 3] * 0.02;
        
        // Add slight horizontal drift
        positions[i] += Math.sin(state.clock.getElapsedTime() + i) * 0.002;
        positions[i + 2] += Math.cos(state.clock.getElapsedTime() + i) * 0.002;
        
        // Reset snowflake to top when it reaches the floor
        if (positions[i + 1] < 0) {
          positions[i + 1] = 30 + Math.random() * 5;
          positions[i] = (Math.random() - 0.5) * 40;
          positions[i + 2] = (Math.random() - 0.5) * 40;
        }
      }
      
      snowRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });
  
  return (
    <group>
      {/* Background stars */}
      <points ref={starsRef} geometry={starGeometry}>
        <pointsMaterial 
          size={mode === 'starry-night' ? 0.04 : mode === 'snow' ? 0.035 : 0.05} 
          vertexColors 
          transparent 
          opacity={mode === 'snow' ? 0.7 : 0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Falling snow */}
      {mode === 'snow' && (
        <points ref={snowRef} geometry={snowGeometry}>
          <pointsMaterial 
            size={0.15}
            color="#ffffff"
            map={snowTexture}
            transparent 
            opacity={0.9}
            sizeAttenuation
            alphaTest={0.01}
          />
        </points>
      )}
      
      {/* Shooting stars */}
      {mode === 'shooting-stars' && (
        <group ref={shootingStarsRef}>
          {shootingStars.map((star, index) => (
            <ShootingStar key={index} {...star} />
          ))}
        </group>
      )}
    </group>
  );
}

// Shooting star component
function ShootingStar({ startPos, direction, speed, startTime }: {
  startPos: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  startTime: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const lineRef = useRef<THREE.Line>(null);
  
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime() - startTime;
    const distance = speed * elapsed;
    
    if (meshRef.current) {
      meshRef.current.position.copy(startPos).addScaledVector(direction, distance);
    }
    
    if (lineRef.current) {
      const positions = [];
      for (let i = 0; i < 10; i++) {
        const offset = distance - i * 0.5;
        const pos = startPos.clone().addScaledVector(direction, offset);
        positions.push(pos.x, pos.y, pos.z);
      }
      lineRef.current.geometry.setAttribute(
        'position',
        new THREE.Float32BufferAttribute(positions, 3)
      );
    }
  });
  
  const lineGeometry = new THREE.BufferGeometry();
  const lineMaterial = new THREE.LineBasicMaterial({ 
    color: '#ffffff', 
    transparent: true, 
    opacity: 0.6 
  });
  
  return (
    <group>
      {/* Shooting star head */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
      
      {/* Shooting star tail */}
      <primitive object={new THREE.Line(lineGeometry, lineMaterial)} ref={lineRef} />
    </group>
  );
}
